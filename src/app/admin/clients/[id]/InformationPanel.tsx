import { formatDate } from "../../format";
import {
  PROJECT_PRIORITY_LABELS,
  isProjectPriority,
} from "@/lib/intake/types";

import type { AdminClient } from "./load-client";
import {
  DarkMarkdown,
  EmptyNote,
  Facts,
  Panel,
  formatBytes,
  formatFee,
  text,
  websiteHref,
} from "./ui";

const ACCOUNT_STATUS_LABELS: Record<string, string> = {
  existing: "Existing",
  needs_creation: "Needs creation",
  unknown: "Unknown",
};

function tokenStatus(access: {
  revokedAt: Date | null;
  expiresAt: Date | null;
}) {
  if (access.revokedAt) {
    return "Revoked";
  }
  if (access.expiresAt && access.expiresAt.getTime() <= Date.now()) {
    return "Expired";
  }
  return "Active";
}

function priorityLabel(value: string, index: number) {
  const label = isProjectPriority(value)
    ? PROJECT_PRIORITY_LABELS[value]
    : value;
  return `${index + 1}. ${label}`;
}

function statusLabel(value: string) {
  if (!value) {
    return "—";
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function InformationPanel({ client }: { client: AdminClient }) {
  const business = client.business;
  const site = websiteHref(business?.website);

  return (
    <div className="space-y-4">
      <Panel title="Client">
        <Facts
          items={[
            { label: "Name", value: text(client.name) },
            { label: "Email", value: text(client.email) },
            { label: "Created", value: formatDate(client.createdAt) },
            { label: "Updated", value: formatDate(client.updatedAt) },
          ]}
        />
      </Panel>

      <Panel title="Business">
        {business ? (
          <Facts
            items={[
              { label: "Name", value: text(business.name) },
              { label: "Legal name", value: text(business.legalName) },
              { label: "Domain", value: text(business.domain) },
              {
                label: "Website",
                value: site ? (
                  <a
                    href={site}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    {business.website}
                  </a>
                ) : (
                  "—"
                ),
              },
            ]}
          />
        ) : (
          <EmptyNote>No business is on file for this client.</EmptyNote>
        )}
      </Panel>

      <Panel title="Contacts">
        {business && business.contacts.length > 0 ? (
          <ul className="space-y-4">
            {business.contacts.map((contact) => (
              <li
                key={contact.id}
                className="rounded-xl border border-white/10 px-4 py-4"
              >
                <Facts
                  items={[
                    { label: "Name", value: text(contact.name) },
                    { label: "Email", value: text(contact.email) },
                    { label: "Phone", value: text(contact.phone) },
                    { label: "Role", value: text(contact.role) },
                    {
                      label: "Primary",
                      value: contact.isPrimary ? "Yes" : "No",
                    },
                  ]}
                />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyNote>No contacts are on file for this client.</EmptyNote>
        )}
      </Panel>

      <Panel title="Projects">
        {business && business.projects.length > 0 ? (
          <div className="space-y-4">
            {business.projects.map((project) => (
              <article
                key={project.id}
                className="space-y-4 rounded-xl border border-white/10 px-4 py-4"
              >
                <h3 className="text-base font-semibold text-white">
                  {project.name.trim() || "Untitled project"}
                </h3>
                <Facts
                  items={[
                    { label: "Fee", value: formatFee(project.fee) },
                    {
                      label: "Payment plan",
                      value: text(project.paymentPlan?.name),
                    },
                    {
                      label: "Priorities",
                      value:
                        project.priorities.length > 0
                          ? project.priorities
                              .map((priority, index) =>
                                priorityLabel(priority, index),
                              )
                              .join(", ")
                          : "—",
                    },
                    {
                      label: "Submitted",
                      value: project.submittedAt
                        ? formatDate(project.submittedAt)
                        : "Not submitted",
                    },
                    { label: "Updated", value: formatDate(project.updatedAt) },
                  ]}
                />
                {project.paymentPlan?.description ? (
                  <p className="text-sm text-default-300">
                    {project.paymentPlan.description}
                  </p>
                ) : null}
                <DarkMarkdown markdown={project.descriptionMarkdown} />
                {project.additionalNotesMarkdown?.trim() ? (
                  <div>
                    <h4 className="text-xs font-medium uppercase tracking-wide text-default-400">
                      Notes
                    </h4>
                    <DarkMarkdown markdown={project.additionalNotesMarkdown} />
                  </div>
                ) : null}

                <div>
                  <h4 className="text-xs font-medium uppercase tracking-wide text-default-400">
                    Features
                  </h4>
                  {project.features.length > 0 ? (
                    <ul className="mt-3 space-y-3">
                      {project.features.map((feature) => (
                        <li key={feature.id}>
                          <p className="text-sm font-medium text-white">
                            {text(feature.name)}
                          </p>
                          <DarkMarkdown markdown={feature.descriptionMarkdown} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyNote>No features.</EmptyNote>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-medium uppercase tracking-wide text-default-400">
                    Integrations
                  </h4>
                  {project.integrations.length > 0 ? (
                    <ul className="mt-3 space-y-3">
                      {project.integrations.map((integration) => (
                        <li key={integration.id}>
                          <p className="text-sm font-medium text-white">
                            {text(integration.name)}
                          </p>
                          <p className="mt-1 text-sm text-default-300">
                            {ACCOUNT_STATUS_LABELS[integration.accountStatus] ??
                              integration.accountStatus}
                            {integration.accountEmail
                              ? ` · ${integration.accountEmail}`
                              : ""}
                          </p>
                          <DarkMarkdown
                            markdown={integration.descriptionMarkdown}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyNote>No integrations.</EmptyNote>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-medium uppercase tracking-wide text-default-400">
                    Attachments
                  </h4>
                  {project.attachments.length > 0 ? (
                    <ul className="mt-3 space-y-2">
                      {project.attachments.map((attachment) => (
                        <li
                          key={attachment.id}
                          className="flex flex-wrap items-baseline justify-between gap-2 text-sm"
                        >
                          <span className="text-white">{attachment.fileName}</span>
                          <span className="text-default-400">
                            {statusLabel(attachment.status)} ·{" "}
                            {formatBytes(attachment.byteSize)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyNote>No attachments.</EmptyNote>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyNote>No projects are on file for this client.</EmptyNote>
        )}
      </Panel>

      <Panel title="Access links">
        {client.accessTokens.length > 0 ? (
          <ul className="space-y-4">
            {client.accessTokens.map((access) => (
              <li key={access.id}>
                <Facts
                  items={[
                    { label: "Status", value: tokenStatus(access) },
                    { label: "Created", value: formatDate(access.createdAt) },
                    {
                      label: "Expires",
                      value: access.expiresAt
                        ? formatDate(access.expiresAt)
                        : "No expiration",
                    },
                  ]}
                />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyNote>No access links have been issued.</EmptyNote>
        )}
      </Panel>
    </div>
  );
}
