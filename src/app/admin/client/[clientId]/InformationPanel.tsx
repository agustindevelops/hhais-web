import { formatDate } from "../../format";

import type { AdminClient } from "./load-client";
import { EmptyNote, Facts, Panel, text, websiteHref } from "./ui";

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
