import type { ReactNode } from "react";

import PrintButton from "@/app/contract/PrintButton";
import MarkdownBody from "@/app/contract/MarkdownBody";
import {
  buildPaymentSchedule,
  formatUsd,
} from "@/lib/contract/payment-schedule";
import {
  APPENDIX_A_INTRO,
  APPENDIX_A_TITLE,
  appendixAClosing,
  exhibitScopeLabel,
  exhibitsForAttachmentIds,
  formatDocumentRefs,
} from "@/lib/contract/exhibits";
import type {
  ContractExhibit,
  ContractRecordView,
  ContractSignatureView,
} from "@/lib/contract/types";
import {
  PROJECT_PRIORITY_LABELS,
  type AccountStatus,
  type IntakeSnapshot,
} from "@/lib/intake/types";
import { developedBy } from "@/common/constants";

const PROVIDER_NAME = "Helping Hand AI Solutions";
const PROVIDER_SHORT = "HHAIS";

const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  existing: "Existing account",
  needs_creation: "Needs to be created",
  unknown: "To be confirmed",
};

const sectionClass =
  "contract-section space-y-4 rounded-xl border border-default-200 bg-white p-6 shadow-sm print:shadow-none";

type ContractDocumentProps = {
  snapshot: IntakeSnapshot;
  exhibits: ContractExhibit[];
  contract: ContractRecordView | null;
  token: string;
  signatureActions?: ReactNode;
};

function formatLongDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(typeof value === "string" ? new Date(value) : value);
}

function displayValue(value: string, fallback = "—") {
  const trimmed = value.trim();
  return trimmed || fallback;
}

export default function ContractDocument({
  snapshot,
  exhibits,
  contract,
  token,
  signatureActions,
}: ContractDocumentProps) {
  const { business, contact, project, features, integrations, paymentPlans } =
    snapshot;
  const clientName = displayValue(
    business.legalName || business.name,
    "the Client",
  );
  const payment = buildPaymentSchedule(
    project.fee,
    project.paymentPlanId,
    paymentPlans,
  );
  const preparedOn = formatLongDate(new Date());
  const submittedOn = project.submittedAt
    ? formatLongDate(new Date(project.submittedAt))
    : null;

  const integrationsById = new Map(
    integrations.map((integration) => [integration.id, integration]),
  );
  const featuresById = new Map(features.map((feature) => [feature.id, feature]));
  const hasIntegrations = integrations.length > 0;
  const hasNotes = Boolean(project.additionalNotesMarkdown.trim());
  const hasExhibits = exhibits.length > 0;
  const sections = numberedSections(hasIntegrations, hasNotes, hasExhibits);

  return (
    <div className="contract-doc space-y-6">
      <header className={`${sectionClass} print:border-0 print:p-0`}>
        <div className="flex flex-wrap items-start justify-between gap-4 print:gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary print:tracking-[0.12em]">
              Statement of Work
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl print:mt-0.5">
              Project Agreement
            </h1>
            <p className="mt-2 text-sm text-default-600 print:mt-0.5">
              Prepared for {clientName} on {preparedOn}
              {submittedOn ? ` · Intake submitted ${submittedOn}` : ""}
              {contract?.lockedAt
                ? ` · Executed ${formatLongDate(contract.lockedAt)}`
                : ""}
            </p>
          </div>
          <PrintButton />
        </div>
        <p className="contract-lede text-sm leading-relaxed text-default-700">
          This agreement sets out the work {PROVIDER_SHORT} will deliver for{" "}
          {clientName}. The features below are the contracted deliverables and
          the basis for acceptance.
        </p>
      </header>

      <section className={sectionClass}>
        <h2 className="text-xl font-semibold text-default-900">
          {sections.parties}. Parties
        </h2>
        <div className="contract-parties grid gap-4 sm:grid-cols-2">
          <PartyCard
            label="Provider"
            name={PROVIDER_NAME}
            details={[
              { label: "Signatory", value: developedBy },
              { label: "Also referred to as", value: PROVIDER_SHORT },
            ]}
          />
          <PartyCard
            label="Client"
            name={displayValue(business.legalName || business.name)}
            details={[
              { label: "Business name", value: displayValue(business.name) },
              { label: "Legal name", value: displayValue(business.legalName) },
              { label: "Domain", value: displayValue(business.domain) },
              { label: "Website", value: displayValue(business.website) },
              { label: "Primary contact", value: displayValue(contact.name) },
              { label: "Role", value: displayValue(contact.role) },
              { label: "Email", value: displayValue(contact.email) },
              { label: "Phone", value: displayValue(contact.phone) },
            ]}
          />
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="text-xl font-semibold text-default-900">
          {sections.project}. Project
        </h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          <Detail label="Project name" value={displayValue(project.name)} />
          <Detail label="Reference" value={project.id} />
        </dl>
        {project.descriptionMarkdown.trim() ? (
          <div>
            <h3 className="text-sm font-medium text-default-900 print:hidden">
              Project description
            </h3>
            <MarkdownBody markdown={project.descriptionMarkdown} />
          </div>
        ) : (
          <p className="text-sm text-default-600">
            No project description has been recorded yet.
          </p>
        )}
        <ReferencedDocs
          exhibits={exhibitsForAttachmentIds(
            exhibits,
            snapshot.generalAttachments.map((attachment) => attachment.id),
          )}
        />
      </section>

      <section className={sectionClass}>
        <h2 className="text-xl font-semibold text-default-900">
          {sections.scope}. Scope of work
        </h2>
        <p className="text-sm leading-relaxed text-default-700">
          {PROVIDER_SHORT} will design, build, and deliver the following
          features. Work not listed is out of scope unless agreed in writing.
        </p>
        {features.length === 0 ? (
          <p className="text-sm text-default-600">
            No features have been recorded yet. Complete intake before using
            this agreement.
          </p>
        ) : (
          <ol className="space-y-4">
            {features.map((feature, index) => {
              const relatedIntegrations = feature.integrationIds
                .map((id) => integrationsById.get(id))
                .filter((item): item is NonNullable<typeof item> => item != null);
              const documentRefs = exhibitsForAttachmentIds(
                exhibits,
                feature.attachments.map((attachment) => attachment.id),
              );

              return (
                <li
                  key={feature.id}
                  className="contract-clause space-y-3 rounded-lg border border-default-200 p-4 print:break-inside-avoid"
                >
                  <h3 className="text-base font-semibold text-default-900">
                    {sections.scope}.{index + 1}{" "}
                    {displayValue(feature.name, "Untitled feature")}
                  </h3>
                  {feature.descriptionMarkdown.trim() ? (
                    <MarkdownBody markdown={feature.descriptionMarkdown} />
                  ) : (
                    <p className="text-sm text-default-600">
                      No description provided.
                    </p>
                  )}
                  {relatedIntegrations.length > 0 ? (
                    <p className="text-sm text-default-600">
                      Related integrations:{" "}
                      {relatedIntegrations
                        .map((integration) => integration.name)
                        .join(", ")}
                    </p>
                  ) : null}
                  <ReferencedDocs exhibits={documentRefs} />
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {hasIntegrations ? (
        <section className={sectionClass}>
          <h2 className="text-xl font-semibold text-default-900">
            {sections.integrations}. Integrations and third-party services
          </h2>
          <p className="text-sm leading-relaxed text-default-700">
            These services are required to deliver the features above. Unless
            stated otherwise, the Client owns the accounts; third-party fees
            are not included in the project fee.
          </p>
          <ul className="space-y-4">
            {integrations.map((integration) => {
              const relatedFeatures = integration.featureIds
                .map((id) => featuresById.get(id))
                .filter((item): item is NonNullable<typeof item> => item != null);
              const documentRefs = exhibitsForAttachmentIds(
                exhibits,
                integration.attachments.map((attachment) => attachment.id),
              );

              return (
                <li
                  key={integration.id}
                  className="contract-clause space-y-2 rounded-lg border border-default-200 p-4 print:break-inside-avoid"
                >
                  <h3 className="text-base font-semibold text-default-900">
                    {displayValue(integration.name, "Untitled integration")}
                  </h3>
                  <p className="text-sm text-default-600">
                    Account status:{" "}
                    {ACCOUNT_STATUS_LABELS[integration.accountStatus]}
                    {integration.accountEmail.trim()
                      ? ` · ${integration.accountEmail}`
                      : ""}
                  </p>
                  {integration.descriptionMarkdown.trim() ? (
                    <MarkdownBody markdown={integration.descriptionMarkdown} />
                  ) : null}
                  {relatedFeatures.length > 0 ? (
                    <p className="text-sm text-default-600">
                      Supports:{" "}
                      {relatedFeatures.map((feature) => feature.name).join(", ")}
                    </p>
                  ) : null}
                  <ReferencedDocs exhibits={documentRefs} />
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className={sectionClass}>
        <h2 className="text-xl font-semibold text-default-900">
          {sections.fee}. Fee and payment
        </h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          <Detail
            label="Project fee"
            value={
              payment.total == null ? "To be determined" : formatUsd(payment.total)
            }
          />
          <Detail
            label="Payment plan"
            value={payment.plan?.name ?? "No payment plan selected"}
          />
        </dl>
        {payment.plan ? (
          <p className="text-sm text-default-700">{payment.plan.description}</p>
        ) : (
          <p className="text-sm text-default-600">
            A payment plan has not been selected yet.
          </p>
        )}
        {payment.installments.length > 0 ? (
          <div>
            <h3 className="text-sm font-medium text-default-900 print:hidden">
              Payment schedule
            </h3>
            <ul className="contract-schedule mt-2 divide-y divide-default-200 overflow-hidden rounded-md border border-default-200">
              {payment.installments.map((installment) => (
                <li
                  key={installment.label}
                  className="flex items-center justify-between gap-4 px-3 py-2 text-sm"
                >
                  <span className="text-default-700">{installment.label}</span>
                  <span className="font-medium text-default-900">
                    {formatUsd(installment.amount)}
                  </span>
                </li>
              ))}
              <li className="flex items-center justify-between gap-4 bg-default-50 px-3 py-2 text-sm">
                <span className="font-medium text-default-900">Total</span>
                <span className="font-semibold text-default-900">
                  {payment.total == null ? "—" : formatUsd(payment.total)}
                </span>
              </li>
            </ul>
          </div>
        ) : null}
        <p className="text-sm leading-relaxed text-default-700">
          Work begins after signing and receipt of any amount due upon
          signing. Custom deliverables transfer to the Client upon payment in
          full.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className="text-xl font-semibold text-default-900">
          {sections.priorities}. Delivery priorities
        </h2>
        <p className="text-sm text-default-700">
          If trade-offs are required, {PROVIDER_SHORT} will follow this ranking
          (1 = highest):
        </p>
        <ol className="space-y-2">
          {project.priorities.map((priority, index) => (
            <li
              key={priority}
              className="contract-priority rounded-md border border-default-200 bg-default-50 px-3 py-2 text-sm font-medium text-default-900"
            >
              {index + 1}. {PROJECT_PRIORITY_LABELS[priority]}
            </li>
          ))}
        </ol>
      </section>

      {hasNotes ? (
        <section className={sectionClass}>
          <h2 className="text-xl font-semibold text-default-900">
            {sections.notes}. Additional notes and exclusions
          </h2>
          <MarkdownBody markdown={project.additionalNotesMarkdown} />
        </section>
      ) : null}

      {hasExhibits ? (
        <section className={sectionClass}>
          <h2 className="text-xl font-semibold text-default-900">
            {sections.exhibits}. {APPENDIX_A_TITLE}
          </h2>
          {APPENDIX_A_INTRO.map((paragraph) => (
            <p
              key={paragraph}
              className="text-sm leading-relaxed text-default-700"
            >
              {paragraph}
            </p>
          ))}
          <div>
            <h3 className="text-sm font-medium text-default-900">
              Referenced Documents
            </h3>
            <ul className="contract-exhibits mt-2 divide-y divide-default-200 overflow-hidden rounded-md border border-default-200">
              {exhibits.map((exhibit) => (
                <li
                  key={exhibit.attachmentId}
                  className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm"
                >
                  <div>
                    <span className="font-medium text-default-900">
                      {exhibit.reference}:
                    </span>{" "}
                    <span className="text-default-800">{exhibit.fileName}</span>
                    <p className="text-xs text-default-500">
                      {exhibitScopeLabel(exhibit)}
                    </p>
                  </div>
                  <a
                    href={`/api/file/${exhibit.attachmentId}?token=${encodeURIComponent(token)}`}
                    className="text-sm font-medium text-primary print:hidden"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {appendixAClosing(PROVIDER_NAME).map((paragraph) => (
            <p
              key={paragraph}
              className="text-sm leading-relaxed text-default-700"
            >
              {paragraph}
            </p>
          ))}
        </section>
      ) : null}

      <section className={sectionClass}>
        <h2 className="text-xl font-semibold text-default-900">
          {sections.terms}. Terms
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-default-700 print:space-y-1">
          <li>
            The features in Section {sections.scope} are the complete initial
            scope. Material changes may affect fee or timeline and require
            written agreement.
          </li>
          <li>
            The Client will provide branding, content, account access,
            approvals, and timely feedback needed to complete the listed
            features.
          </li>
          <li>
            Third-party products, licenses, domains, and usage fees are the
            Client&apos;s responsibility unless expressly included.
          </li>
          <li>
            {PROVIDER_SHORT} will deliver the described features in a
            professional manner. Acceptance is based on the feature
            descriptions herein, not on unlisted discussions.
          </li>
          <li>
            {PROVIDER_SHORT} will perform the Services based on this Agreement,
            the agreed Scope of Work, and the Client-provided documentation
            {hasExhibits
              ? ` listed in ${APPENDIX_A_TITLE} (Section ${sections.exhibits})`
              : " submitted through the project intake form"}
            . Requests that materially differ from or add to those materials may
            be treated as a change in scope.
          </li>
          <li>
            Upon payment in full, the Client owns the custom code and
            deliverables produced for this project. {PROVIDER_SHORT} may
            reuse general methods, libraries, and know-how that are not unique
            to the Client.
          </li>
          <li>
            Either party may pause or end the engagement for material breach
            after written notice and a reasonable opportunity to cure. Amounts
            owed for work already performed remain due.
          </li>
        </ul>
      </section>

      <section className={sectionClass}>
        <h2 className="text-xl font-semibold text-default-900">
          {sections.signatures}. Signatures
        </h2>
        <p className="text-sm leading-relaxed text-default-700">
          By signing, the parties agree that {PROVIDER_SHORT} will deliver the
          features above for the stated fee, and that those features define
          the customer&apos;s expectations.
        </p>
        <div className="contract-sigs grid gap-8 sm:grid-cols-2">
          <SignatureBlock
            party={PROVIDER_NAME}
            fallbackName={developedBy}
            title="Founder"
            signature={contract?.hhais ?? null}
          />
          <SignatureBlock
            party={displayValue(business.legalName || business.name)}
            fallbackName={displayValue(contact.name, "")}
            title={displayValue(contact.role, "")}
            signature={contract?.client ?? null}
          />
        </div>
        {contract?.finalPdfPath ? (
          <p className="text-xs text-default-500">
            Executed copy storage reference: {contract.finalPdfPath}
          </p>
        ) : null}
        {signatureActions ? (
          <div className="border-t border-default-200 pt-4 print:hidden">
            {signatureActions}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function numberedSections(
  hasIntegrations: boolean,
  hasNotes: boolean,
  hasExhibits: boolean,
) {
  let next = 1;
  const take = () => next++;

  return {
    parties: take(),
    project: take(),
    scope: take(),
    integrations: hasIntegrations ? take() : 0,
    fee: take(),
    priorities: take(),
    notes: hasNotes ? take() : 0,
    exhibits: hasExhibits ? take() : 0,
    terms: take(),
    signatures: take(),
  };
}

function PartyCard({
  label,
  name,
  details,
}: {
  label: string;
  name: string;
  details: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="contract-party rounded-lg border border-default-200 bg-default-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-default-500">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-default-900">{name}</p>
      <dl className="mt-3 space-y-1">
        {details.map((detail) => (
          <div key={detail.label} className="text-sm">
            <dt className="inline text-default-500">{detail.label}: </dt>
            <dd className="inline text-default-800">{detail.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-default-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-default-900">{value}</dd>
    </div>
  );
}

function ReferencedDocs({ exhibits }: { exhibits: ContractExhibit[] }) {
  if (exhibits.length === 0) {
    return null;
  }

  return (
    <p className="text-sm text-default-600">
      Referenced documentation: {formatDocumentRefs(exhibits)}
    </p>
  );
}

function SignatureBlock({
  party,
  fallbackName,
  title,
  signature,
}: {
  party: string;
  fallbackName: string;
  title: string;
  signature: ContractSignatureView | null;
}) {
  const signed = Boolean(signature?.signedAt && signature.signatureDataUrl);

  return (
    <div className="contract-sig space-y-4 print:break-inside-avoid">
      <p className="text-sm font-semibold text-default-900">{party}</p>
      {signed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={signature!.signatureDataUrl!}
          alt={`${party} signature`}
          className="h-16 w-full max-w-xs object-contain object-left"
        />
      ) : (
        <div>
          <div className="h-12 border-b border-default-400" />
          <p className="mt-2 text-xs text-default-500">Signature</p>
        </div>
      )}
      <div>
        <p className="text-sm text-default-900">
          {signature?.signerName || fallbackName || "Name"}
        </p>
        <p className="text-xs text-default-500">Printed name</p>
      </div>
      {title ? (
        <div>
          <p className="text-sm text-default-900">{title}</p>
          <p className="text-xs text-default-500">Title</p>
        </div>
      ) : null}
      <div>
        {signed && signature?.signedAt ? (
          <p className="text-sm text-default-900">
            {formatLongDate(signature.signedAt)}
          </p>
        ) : (
          <div className="h-8 border-b border-default-400" />
        )}
        <p className="mt-2 text-xs text-default-500">Date</p>
      </div>
    </div>
  );
}
