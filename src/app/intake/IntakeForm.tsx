"use client";

import { useMemo, useState } from "react";

import { saveIntake, submitIntake } from "@/app/intake/actions";
import AttachmentList from "@/app/intake/components/AttachmentList";
import MarkdownEditor from "@/app/intake/components/MarkdownEditor";
import Button from "@/components/Elements/Button";
import { cn } from "@/helpers/cn";
import {
  ACCOUNT_STATUSES,
  PROJECT_PRIORITY_LABELS,
  formatFee,
  normalizeProjectPriorities,
  parseFee,
  type AccountStatus,
  type IntakeAttachment,
  type IntakeFeature,
  type IntakeIntegration,
  type IntakeSavePayload,
  type IntakeSnapshot,
} from "@/lib/intake/types";

import { deleteIntakeFile } from "./lib/upload";

const fieldClass =
  "block h-10 w-full rounded-md border border-default-300 bg-white px-3 py-2 text-sm text-default-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

const labelClass = "text-sm font-medium text-default-900";

const sectionClass =
  "space-y-4 rounded-xl border border-default-200 bg-white p-5 shadow-sm";

const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  existing: "Existing",
  needs_creation: "Needs creation",
  unknown: "Unknown",
};

type IntakeFormState = {
  business: IntakeSnapshot["business"];
  contact: IntakeSnapshot["contact"];
  project: IntakeSnapshot["project"];
  features: IntakeFeature[];
  integrations: IntakeIntegration[];
  generalAttachments: IntakeAttachment[];
};

function toFormState(snapshot: IntakeSnapshot): IntakeFormState {
  return {
    business: snapshot.business,
    contact: snapshot.contact,
    project: snapshot.project,
    features: snapshot.features,
    integrations: snapshot.integrations,
    generalAttachments: snapshot.generalAttachments,
  };
}

function toPayload(token: string, form: IntakeFormState): IntakeSavePayload {
  return {
    token,
    business: {
      name: form.business.name,
      legalName: form.business.legalName,
      domain: form.business.domain,
      website: form.business.website,
    },
    contact: {
      name: form.contact.name,
      email: form.contact.email,
      phone: form.contact.phone,
      role: form.contact.role,
    },
    project: {
      name: form.project.name,
      descriptionMarkdown: form.project.descriptionMarkdown,
      additionalNotesMarkdown: form.project.additionalNotesMarkdown,
      fee: form.project.fee,
      priorities: form.project.priorities,
      paymentPlanId: form.project.paymentPlanId,
    },
    features: form.features.map((feature, index) => ({
      id: feature.id,
      name: feature.name,
      descriptionMarkdown: feature.descriptionMarkdown,
      sortOrder: index,
      attachmentIds: feature.attachments.map((attachment) => attachment.id),
    })),
    integrations: form.integrations.map((integration) => ({
      id: integration.id,
      name: integration.name,
      descriptionMarkdown: integration.descriptionMarkdown,
      accountStatus: integration.accountStatus,
      accountEmail: integration.accountEmail,
      featureIds: integration.featureIds,
      attachmentIds: integration.attachments.map((attachment) => attachment.id),
    })),
    generalAttachmentIds: form.generalAttachments.map(
      (attachment) => attachment.id,
    ),
  };
}

function newTempId() {
  return `temp_${crypto.randomUUID()}`;
}

type IntakeFormProps = {
  snapshot: IntakeSnapshot;
};

export default function IntakeForm({ snapshot }: IntakeFormProps) {
  const [form, setForm] = useState<IntakeFormState>(() => toFormState(snapshot));
  const [submittedAt, setSubmittedAt] = useState(snapshot.project.submittedAt);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"save" | "submit" | null>(null);

  const token = snapshot.token;
  const projectId = snapshot.project.id;
  const alreadySubmitted = Boolean(submittedAt);

  const persist = async (mode: "save" | "submit") => {
    setBusy(mode);
    setError(null);
    setStatusMessage(null);
    try {
      const result =
        mode === "submit"
          ? await submitIntake(toPayload(token, form))
          : await saveIntake(toPayload(token, form));

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setForm(toFormState(result.snapshot));
      setSubmittedAt(result.snapshot.project.submittedAt);
      setStatusMessage(
        mode === "submit"
          ? null
          : "Saved. You can come back to this link anytime.",
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  };

  const addFeature = () => {
    setForm((current) => ({
      ...current,
      features: [
        ...current.features,
        {
          id: newTempId(),
          name: "",
          descriptionMarkdown: "",
          sortOrder: current.features.length,
          integrationIds: [],
          attachments: [],
        },
      ],
    }));
  };

  const updateFeature = (id: string, patch: Partial<IntakeFeature>) => {
    setForm((current) => ({
      ...current,
      features: current.features.map((feature) =>
        feature.id === id ? { ...feature, ...patch } : feature,
      ),
    }));
  };

  const movePriority = (index: number, direction: -1 | 1) => {
    setForm((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.project.priorities.length) {
        return current;
      }
      const priorities = [...current.project.priorities];
      const [moved] = priorities.splice(index, 1);
      priorities.splice(nextIndex, 0, moved);
      return {
        ...current,
        project: {
          ...current.project,
          priorities: normalizeProjectPriorities(priorities),
        },
      };
    });
  };

  const moveFeature = (index: number, direction: -1 | 1) => {
    setForm((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.features.length) {
        return current;
      }
      const features = [...current.features];
      const [moved] = features.splice(index, 1);
      features.splice(nextIndex, 0, moved);
      return { ...current, features };
    });
  };

  const deleteFeature = async (feature: IntakeFeature) => {
    setError(null);
    try {
      await Promise.all(
        feature.attachments.map((attachment) =>
          deleteIntakeFile(token, attachment.id),
        ),
      );
      setForm((current) => ({
        ...current,
        features: current.features.filter((item) => item.id !== feature.id),
        integrations: current.integrations.map((integration) => ({
          ...integration,
          featureIds: integration.featureIds.filter((id) => id !== feature.id),
        })),
      }));
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not delete feature files",
      );
    }
  };

  const addIntegration = () => {
    setForm((current) => ({
      ...current,
      integrations: [
        ...current.integrations,
        {
          id: newTempId(),
          name: "",
          descriptionMarkdown: "",
          accountStatus: "unknown",
          accountEmail: "",
          featureIds: [],
          attachments: [],
        },
      ],
    }));
  };

  const updateIntegration = (
    id: string,
    patch: Partial<IntakeIntegration>,
  ) => {
    setForm((current) => ({
      ...current,
      integrations: current.integrations.map((integration) =>
        integration.id === id ? { ...integration, ...patch } : integration,
      ),
    }));
  };

  const toggleIntegrationFeature = (integrationId: string, featureId: string) => {
    setForm((current) => ({
      ...current,
      integrations: current.integrations.map((integration) => {
        if (integration.id !== integrationId) {
          return integration;
        }
        const hasFeature = integration.featureIds.includes(featureId);
        return {
          ...integration,
          featureIds: hasFeature
            ? integration.featureIds.filter((id) => id !== featureId)
            : [...integration.featureIds, featureId],
        };
      }),
    }));
  };

  const deleteIntegration = async (integration: IntakeIntegration) => {
    setError(null);
    try {
      await Promise.all(
        integration.attachments.map((attachment) =>
          deleteIntakeFile(token, attachment.id),
        ),
      );
      setForm((current) => ({
        ...current,
        integrations: current.integrations.filter(
          (item) => item.id !== integration.id,
        ),
      }));
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not delete integration files",
      );
    }
  };

  const submitDisabled = alreadySubmitted || busy !== null;
  const saveDisabled = busy !== null;

  const featureOptions = useMemo(
    () =>
      form.features.map((feature) => ({
        id: feature.id,
        name: feature.name.trim() || "Untitled feature",
      })),
    [form.features],
  );

  return (
    <div className="space-y-6">
      {alreadySubmitted ? (
        <p
          className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-default-800"
          role="status"
        >
          Your project information has been submitted to HHAIS for review.
        </p>
      ) : null}

      {statusMessage ? (
        <p className="text-sm text-white" role="status">
          {statusMessage}
        </p>
      ) : null}

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <section className={sectionClass}>
        <h2 className="text-xl font-semibold text-default-900">
          Business / Contact
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="business-name"
            label="Business name"
            value={form.business.name}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                business: { ...current.business, name: value },
              }))
            }
          />
          <Field
            id="legal-name"
            label="Legal name"
            value={form.business.legalName}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                business: { ...current.business, legalName: value },
              }))
            }
          />
          <Field
            id="domain"
            label="Domain"
            value={form.business.domain}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                business: { ...current.business, domain: value },
              }))
            }
          />
          <Field
            id="website"
            label="Website"
            value={form.business.website}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                business: { ...current.business, website: value },
              }))
            }
          />
          <Field
            id="contact-name"
            label="Primary contact name"
            value={form.contact.name}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                contact: { ...current.contact, name: value },
              }))
            }
          />
          <Field
            id="contact-email"
            label="Primary contact email"
            type="email"
            value={form.contact.email}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                contact: { ...current.contact, email: value },
              }))
            }
          />
          <Field
            id="contact-phone"
            label="Phone"
            value={form.contact.phone}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                contact: { ...current.contact, phone: value },
              }))
            }
          />
          <Field
            id="contact-role"
            label="Role"
            value={form.contact.role}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                contact: { ...current.contact, role: value },
              }))
            }
          />
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="text-xl font-semibold text-default-900">Project</h2>
        <Field
          id="project-name"
          label="Project name"
          value={form.project.name}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              project: { ...current.project, name: value },
            }))
          }
        />
        <div className="space-y-2">
          <label className={labelClass} htmlFor="project-description">
            Project description
          </label>
          <MarkdownEditor
            id="project-description"
            value={form.project.descriptionMarkdown}
            onChange={(descriptionMarkdown) =>
              setForm((current) => ({
                ...current,
                project: { ...current.project, descriptionMarkdown },
              }))
            }
            placeholder="Describe the project"
          />
        </div>
        <Field
          id="project-fee"
          label="Fee"
          value={form.project.fee}
          inputMode="decimal"
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              project: { ...current.project, fee: value },
            }))
          }
          onBlur={() =>
            setForm((current) => {
              const parsed = parseFee(current.project.fee);
              return {
                ...current,
                project: {
                  ...current.project,
                  fee:
                    parsed == null
                      ? current.project.fee.trim()
                      : formatFee(parsed),
                },
              };
            })
          }
        />
        <fieldset className="space-y-3">
          <legend className={labelClass}>Preferred payment plan</legend>
          {snapshot.paymentPlans.length === 0 ? (
            <p className="text-sm text-default-600">
              Payment plans are not available yet.
            </p>
          ) : (
            <div className="space-y-2">
              {snapshot.paymentPlans.map((plan) => (
                <label
                  key={plan.id}
                  className="flex cursor-pointer items-start gap-3 rounded-md border border-default-200 bg-default-50 px-3 py-3"
                >
                  <input
                    type="radio"
                    name="payment-plan"
                    className="mt-1"
                    checked={form.project.paymentPlanId === plan.id}
                    onChange={() =>
                      setForm((current) => ({
                        ...current,
                        project: {
                          ...current.project,
                          paymentPlanId: plan.id,
                        },
                      }))
                    }
                  />
                  <span>
                    <span className="block text-sm font-medium text-default-900">
                      {plan.name}
                    </span>
                    <span className="mt-1 block text-sm text-default-600">
                      {plan.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </fieldset>
        <div className="space-y-2">
          <p className={labelClass}>Priorities</p>
          <p className="text-sm text-default-600">
            Rank Time, Quality, and Budget. 1 is the highest priority.
          </p>
          <ol className="space-y-2">
            {form.project.priorities.map((priority, index) => (
              <li
                key={priority}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-default-200 bg-default-50 px-3 py-2"
              >
                <span className="text-sm font-medium text-default-900">
                  {index + 1}. {PROJECT_PRIORITY_LABELS[priority]}
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={index === 0}
                    onClick={() => movePriority(index, -1)}
                  >
                    Up
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={index === form.project.priorities.length - 1}
                    onClick={() => movePriority(index, 1)}
                  >
                    Down
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-2">
          <label className={labelClass} htmlFor="project-notes">
            Additional notes
          </label>
          <MarkdownEditor
            id="project-notes"
            value={form.project.additionalNotesMarkdown}
            onChange={(additionalNotesMarkdown) =>
              setForm((current) => ({
                ...current,
                project: { ...current.project, additionalNotesMarkdown },
              }))
            }
            placeholder="Anything else we should know"
          />
        </div>
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-default-900">Features</h2>
          <Button type="button" variant="outline" size="sm" onClick={addFeature}>
            Add feature
          </Button>
        </div>
        {form.features.length === 0 ? (
          <p className="text-sm text-default-600">
            Add at least one feature before submitting.
          </p>
        ) : null}
        <div className="space-y-4">
          {form.features.map((feature, index) => (
            <article
              key={feature.id}
              className="space-y-3 rounded-lg border border-default-200 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-default-600">
                  Feature {index + 1}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={index === 0}
                    onClick={() => moveFeature(index, -1)}
                  >
                    Up
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={index === form.features.length - 1}
                    onClick={() => moveFeature(index, 1)}
                  >
                    Down
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => deleteFeature(feature)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <Field
                id={`feature-name-${feature.id}`}
                label="Name"
                value={feature.name}
                onChange={(name) => updateFeature(feature.id, { name })}
              />
              <div className="space-y-2">
                <label
                  className={labelClass}
                  htmlFor={`feature-description-${feature.id}`}
                >
                  Description
                </label>
                <MarkdownEditor
                  id={`feature-description-${feature.id}`}
                  value={feature.descriptionMarkdown}
                  onChange={(descriptionMarkdown) =>
                    updateFeature(feature.id, { descriptionMarkdown })
                  }
                />
              </div>
              <div className="space-y-2">
                <p className={labelClass}>Files</p>
                <AttachmentList
                  token={token}
                  projectId={projectId}
                  featureId={feature.id}
                  attachments={feature.attachments}
                  onChange={(attachments) =>
                    updateFeature(feature.id, { attachments })
                  }
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-default-900">
            Integrations
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addIntegration}
          >
            Add integration
          </Button>
        </div>
        {form.integrations.length === 0 ? (
          <p className="text-sm text-default-600">
            Add any third-party accounts or services this project needs.
          </p>
        ) : null}
        <div className="space-y-4">
          {form.integrations.map((integration, index) => (
            <article
              key={integration.id}
              className="space-y-3 rounded-lg border border-default-200 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-default-600">
                  Integration {index + 1}
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => deleteIntegration(integration)}
                >
                  Delete
                </Button>
              </div>
              <Field
                id={`integration-name-${integration.id}`}
                label="Name"
                value={integration.name}
                onChange={(name) => updateIntegration(integration.id, { name })}
              />
              <div className="space-y-2">
                <label
                  className={labelClass}
                  htmlFor={`integration-description-${integration.id}`}
                >
                  Description
                </label>
                <MarkdownEditor
                  id={`integration-description-${integration.id}`}
                  value={integration.descriptionMarkdown}
                  onChange={(descriptionMarkdown) =>
                    updateIntegration(integration.id, { descriptionMarkdown })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    className={labelClass}
                    htmlFor={`integration-status-${integration.id}`}
                  >
                    Account status
                  </label>
                  <select
                    id={`integration-status-${integration.id}`}
                    className={fieldClass}
                    value={integration.accountStatus}
                    onChange={(event) =>
                      updateIntegration(integration.id, {
                        accountStatus: event.target.value as AccountStatus,
                      })
                    }
                  >
                    {ACCOUNT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {ACCOUNT_STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </div>
                <Field
                  id={`integration-email-${integration.id}`}
                  label="Account email"
                  type="email"
                  value={integration.accountEmail}
                  onChange={(accountEmail) =>
                    updateIntegration(integration.id, { accountEmail })
                  }
                />
              </div>
              <fieldset className="space-y-2">
                <legend className={labelClass}>Associated features</legend>
                {featureOptions.length === 0 ? (
                  <p className="text-sm text-default-600">
                    Add features to associate them here.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {featureOptions.map((feature) => (
                      <label
                        key={feature.id}
                        className="flex cursor-pointer items-center gap-2 text-sm text-default-800"
                      >
                        <input
                          type="checkbox"
                          checked={integration.featureIds.includes(feature.id)}
                          onChange={() =>
                            toggleIntegrationFeature(integration.id, feature.id)
                          }
                        />
                        {feature.name}
                      </label>
                    ))}
                  </div>
                )}
              </fieldset>
              <div className="space-y-2">
                <p className={labelClass}>Files</p>
                <AttachmentList
                  token={token}
                  projectId={projectId}
                  integrationId={integration.id}
                  attachments={integration.attachments}
                  onChange={(attachments) =>
                    updateIntegration(integration.id, { attachments })
                  }
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="text-xl font-semibold text-default-900">
          General project files
        </h2>
        <p className="text-sm text-default-600">
          Upload files that do not belong to a specific feature or integration.
        </p>
        <AttachmentList
          token={token}
          projectId={projectId}
          attachments={form.generalAttachments}
          onChange={(generalAttachments) =>
            setForm((current) => ({ ...current, generalAttachments }))
          }
        />
      </section>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={saveDisabled}
          onClick={() => persist("save")}
        >
          {busy === "save" ? "Saving…" : "Save"}
        </Button>
        <Button
          type="button"
          disabled={submitDisabled}
          onClick={() => persist("submit")}
        >
          {alreadySubmitted
            ? "Submitted"
            : busy === "submit"
              ? "Submitting…"
              : "Submit"}
        </Button>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: string;
  inputMode?: "decimal" | "numeric" | "text";
}) {
  return (
    <div className="space-y-2">
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className={cn(fieldClass)}
      />
    </div>
  );
}
