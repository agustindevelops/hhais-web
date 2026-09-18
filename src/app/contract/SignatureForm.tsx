"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from "react";
import SignatureCanvas from "react-signature-canvas";

import { signContract } from "@/app/contract/actions";
import Button from "@/components/Elements/Button";
import { developedBy } from "@/common/constants";
import type { ContractPageData } from "@/lib/contract/types";

type SignatureFormProps = {
  page: ContractPageData;
};

export default function SignatureForm({ page }: SignatureFormProps) {
  const router = useRouter();
  const titleId = useId();
  const canvasRef = useRef<SignatureCanvas | null>(null);
  const padContainerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 720, height: 280 });
  const [signerName, setSignerName] = useState(() => defaultSignerName(page));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const { snapshot, contract, isAdmin } = page;
  const submitted = Boolean(snapshot.project.submittedAt);
  const locked = Boolean(contract?.lockedAt);
  const clientSigned = Boolean(contract?.client.signedAt);
  const hhaisSigned = Boolean(contract?.hhais.signedAt);

  const canClientSign = submitted && !locked && !clientSigned && !isAdmin;
  const canHhaisSign =
    submitted && !locked && clientSigned && !hhaisSigned && isAdmin;
  const canSign = canClientSign || canHhaisSign;

  const closeModal = useCallback(() => {
    if (pending) {
      return;
    }
    setOpen(false);
    setError(null);
  }, [pending]);

  const clearPad = useCallback(() => {
    canvasRef.current?.clear();
  }, []);

  const measureCanvas = useCallback(() => {
    const container = padContainerRef.current;
    if (!container) {
      return;
    }
    const width = Math.max(320, Math.floor(container.clientWidth));
    const height = Math.max(220, Math.min(360, Math.floor(width * 0.42)));
    setCanvasSize({ width, height });
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    measureCanvas();
    const onResize = () => measureCanvas();
    window.addEventListener("resize", onResize);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, measureCanvas, closeModal]);

  useEffect(() => {
    if (!open) {
      return;
    }
    // Remounted canvas when size changes — clear any stale strokes.
    canvasRef.current?.clear();
  }, [open, canvasSize.width, canvasSize.height]);

  const onSubmit = () => {
    setError(null);

    if (!canSign) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas || canvas.isEmpty()) {
      setError("Please draw your signature before submitting.");
      return;
    }

    const name = signerName.trim();
    if (!name) {
      setError("Printed name is required.");
      return;
    }

    const signatureDataUrl = canvas.toDataURL("image/png");

    startTransition(async () => {
      const result = await signContract({
        token: snapshot.token,
        admin: isAdmin,
        signerName: name,
        signatureDataUrl,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setOpen(false);
      router.refresh();
    });
  };

  if (locked) {
    return (
      <div className="space-y-3 print:hidden">
        <h3 className="text-base font-semibold text-default-900">
          Agreement executed
        </h3>
        <p className="text-sm text-default-700">
          Both parties have signed. Download the executed PDF for your records.
        </p>
        <a
          href={`/api/contract/pdf?token=${encodeURIComponent(snapshot.token)}`}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Download executed agreement
        </a>
      </div>
    );
  }

  if (!submitted) {
    return (
      <div className="space-y-2 print:hidden">
        <h3 className="text-base font-semibold text-default-900">
          Signature unavailable
        </h3>
        <p className="text-sm text-default-700">
          Complete and submit the intake form before signing this agreement.
        </p>
      </div>
    );
  }

  if (isAdmin && !clientSigned) {
    return (
      <div className="space-y-2 print:hidden">
        <h3 className="text-base font-semibold text-default-900">
          Waiting for client
        </h3>
        <p className="text-sm text-default-700">
          The client must sign first. Share the contract link without{" "}
          <code className="rounded bg-default-100 px-1 text-xs">admin=true</code>
          .
        </p>
      </div>
    );
  }

  if (!isAdmin && clientSigned && !hhaisSigned) {
    return (
      <div className="space-y-2 print:hidden">
        <h3 className="text-base font-semibold text-default-900">
          Waiting for HHAIS
        </h3>
        <p className="text-sm text-default-700">
          Thank you. Your signature is on file. Helping Hand AI Solutions will
          countersign next.
        </p>
      </div>
    );
  }

  if (clientSigned && hhaisSigned && !locked) {
    return (
      <div className="space-y-3 print:hidden">
        <h3 className="text-base font-semibold text-default-900">
          Finalizing agreement
        </h3>
        <p className="text-sm text-default-700">
          Both signatures are on file. Refresh this page to finish generating
          the executed PDF.
        </p>
        <Button type="button" onClick={() => router.refresh()}>
          Refresh
        </Button>
      </div>
    );
  }

  if (!canSign) {
    return null;
  }

  return (
    <>
      <div className="space-y-3 print:hidden">
        <div>
          <h3 className="text-base font-semibold text-default-900">
            {isAdmin ? "HHAIS signature" : "Client signature"}
          </h3>
          <p className="mt-1 text-sm text-default-600">
            {isAdmin
              ? "Review the agreement above, then open the signature pad to sign as Helping Hand AI Solutions."
              : "Review the agreement above, then open the signature pad to confirm the scope, fee, and payment plan."}
          </p>
        </div>
        <Button type="button" onClick={() => setOpen(true)}>
          Open signature pad
        </Button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 print:hidden">
          <button
            type="button"
            aria-label="Close signature pad"
            className="absolute inset-0 bg-default-900/50"
            onClick={closeModal}
            disabled={pending}
          />
          <div className="absolute inset-0 flex items-end justify-center p-0 sm:items-center sm:p-6">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative flex max-h-[100dvh] w-full max-w-3xl flex-col rounded-t-2xl border border-default-200 bg-white shadow-xl sm:max-h-[90dvh] sm:rounded-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-default-200 px-5 py-4 sm:px-6">
                <div>
                  <h2
                    id={titleId}
                    className="text-xl font-semibold text-default-900"
                  >
                    {isAdmin ? "Sign as HHAIS" : "Sign agreement"}
                  </h2>
                  <p className="mt-1 text-sm text-default-600">
                    Draw your signature in the pad below. Use the full width for
                    a clear mark.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={pending}
                  className="rounded-md px-2 py-1 text-sm font-medium text-default-600 hover:bg-default-100 hover:text-default-900 disabled:opacity-50"
                >
                  Close
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto px-5 py-4 sm:px-6">
                <div>
                  <label
                    htmlFor="signer-name-modal"
                    className="mb-1 block text-sm font-medium text-default-800"
                  >
                    Printed name
                  </label>
                  <input
                    id="signer-name-modal"
                    type="text"
                    value={signerName}
                    onChange={(event) => setSignerName(event.target.value)}
                    className="w-full rounded-md border border-default-300 px-3 py-2 text-sm"
                    autoComplete="name"
                    autoFocus
                  />
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-default-800">
                      Signature
                    </p>
                    <button
                      type="button"
                      onClick={clearPad}
                      className="text-sm font-medium text-primary"
                    >
                      Clear
                    </button>
                  </div>
                  <div
                    ref={padContainerRef}
                    className="overflow-hidden rounded-lg border border-default-300 bg-[#fafafa]"
                  >
                    <SignatureCanvas
                      ref={canvasRef}
                      penColor="#111827"
                      canvasProps={{
                        className: "touch-none w-full",
                        width: canvasSize.width,
                        height: canvasSize.height,
                        style: {
                          width: "100%",
                          height: `${canvasSize.height}px`,
                          display: "block",
                        },
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-default-500">
                    Sign with your finger, stylus, or mouse.
                  </p>
                </div>

                {error ? (
                  <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-default-200 px-5 py-4 sm:px-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={pending}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={onSubmit} disabled={pending}>
                  {pending ? "Saving signature…" : "Sign agreement"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function defaultSignerName(page: ContractPageData) {
  if (page.isAdmin) {
    return developedBy;
  }
  return page.snapshot.contact.name || "";
}
