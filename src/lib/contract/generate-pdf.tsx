import "server-only";

import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import { createElement } from "react";

import { developedBy } from "@/common/constants";
import {
  APPENDIX_A_INTRO,
  APPENDIX_A_TITLE,
  appendixAClosing,
  exhibitScopeLabel,
  exhibitsForAttachmentIds,
  formatDocumentRefs,
} from "@/lib/contract/exhibits";
import type { ContractPageData } from "@/lib/contract/types";
import {
  buildPaymentSchedule,
  formatUsd,
} from "@/lib/contract/payment-schedule";
import {
  PROJECT_PRIORITY_LABELS,
  type AccountStatus,
} from "@/lib/intake/types";

const PROVIDER_NAME = "Helping Hand AI Solutions";
const PROVIDER_SHORT = "HHAIS";

const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  existing: "Existing account",
  needs_creation: "Needs to be created",
  unknown: "To be confirmed",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 42,
    fontSize: 9.5,
    fontFamily: "Times-Roman",
    color: "#111111",
    lineHeight: 1.25,
  },
  title: {
    fontSize: 14,
    fontFamily: "Times-Bold",
    marginBottom: 1,
  },
  subtitle: {
    fontSize: 8,
    color: "#444444",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  meta: {
    fontSize: 8.5,
    color: "#444444",
    marginBottom: 6,
  },
  intro: {
    marginBottom: 8,
  },
  section: {
    marginBottom: 8,
  },
  heading: {
    fontSize: 10.5,
    fontFamily: "Times-Bold",
    marginBottom: 3,
    paddingBottom: 1,
    borderBottomWidth: 0.6,
    borderBottomColor: "#111111",
  },
  body: {
    marginBottom: 3,
  },
  muted: {
    color: "#444444",
    fontSize: 8.5,
  },
  clause: {
    marginBottom: 4,
  },
  itemTitle: {
    fontFamily: "Times-Bold",
    marginBottom: 1,
  },
  bullet: {
    marginLeft: 12,
    marginBottom: 2,
  },
  scheduleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.4,
    borderBottomColor: "#888888",
    paddingVertical: 1.5,
  },
  parties: {
    flexDirection: "row",
    gap: 16,
  },
  party: {
    flex: 1,
  },
  sigGrid: {
    flexDirection: "row",
    gap: 24,
    marginTop: 6,
  },
  sigCol: {
    flex: 1,
  },
  sigImage: {
    width: 140,
    height: 36,
    objectFit: "contain",
    marginVertical: 2,
  },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 42,
    right: 42,
    fontSize: 7.5,
    color: "#555555",
    borderTopWidth: 0.4,
    borderTopColor: "#888888",
    paddingTop: 3,
  },
});

function formatLongDate(value: string | Date) {
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

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "• ")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

type GenerateInput = {
  page: ContractPageData;
  clientId: string;
};

export async function generateExecutedPdf(
  input: GenerateInput,
): Promise<Buffer> {
  const { page } = input;
  const { snapshot, contract, exhibits } = page;
  if (!contract?.client.signatureDataUrl || !contract.hhais.signatureDataUrl) {
    throw new Error("Both signatures are required to generate the PDF.");
  }
  if (!contract.client.signedAt || !contract.hhais.signedAt) {
    throw new Error("Both signature timestamps are required.");
  }

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

  const integrationsById = new Map(
    integrations.map((integration) => [integration.id, integration]),
  );
  const featuresById = new Map(features.map((feature) => [feature.id, feature]));
  const generalDocumentRef = formatDocumentRefs(
    exhibitsForAttachmentIds(
      exhibits,
      snapshot.generalAttachments.map((attachment) => attachment.id),
    ),
  );

  const finalPdfPath =
    contract.finalPdfPath ??
    `${input.clientId}/contracts/${contract.id}/executed.pdf`;

  const doc = createElement(
    Document,
    {
      title: `Project Agreement — ${clientName}`,
      author: PROVIDER_NAME,
      subject: "Executed Statement of Work",
    },
    createElement(
      Page,
      { size: "LETTER", style: styles.page },
      createElement(Text, { style: styles.subtitle }, "Statement of Work"),
      createElement(Text, { style: styles.title }, "Project Agreement"),
      createElement(
        Text,
        { style: styles.meta },
        `Executed copy · Prepared for ${clientName}`,
      ),
      createElement(
        Text,
        { style: styles.intro },
        `This agreement sets out the work ${PROVIDER_SHORT} will deliver for ${clientName}. The features below are the contracted deliverables and the basis for acceptance.`,
      ),

      // Parties
      createElement(
        View,
        { style: styles.section },
        createElement(Text, { style: styles.heading }, "1. Parties"),
        createElement(
          View,
          { style: styles.parties },
          createElement(
            View,
            { style: styles.party },
            createElement(Text, { style: styles.itemTitle }, "Provider"),
            createElement(Text, null, PROVIDER_NAME),
            createElement(
              Text,
              { style: styles.muted },
              `Signatory: ${developedBy} · ${PROVIDER_SHORT}`,
            ),
          ),
          createElement(
            View,
            { style: styles.party },
            createElement(Text, { style: styles.itemTitle }, "Client"),
            createElement(
              Text,
              null,
              displayValue(business.legalName || business.name),
            ),
            createElement(
              Text,
              { style: styles.muted },
              `Contact: ${displayValue(contact.name)}${
                contact.email.trim() ? ` · ${contact.email}` : ""
              }${contact.phone ? ` · ${contact.phone}` : ""}`,
            ),
          ),
        ),
      ),

      // Project
      createElement(
        View,
        { style: styles.section },
        createElement(Text, { style: styles.heading }, "2. Project"),
        createElement(
          Text,
          { style: styles.body },
          `Project: ${displayValue(project.name)} · Reference: ${project.id}`,
        ),
        project.descriptionMarkdown.trim()
          ? createElement(
              Text,
              { style: styles.body },
              stripMarkdown(project.descriptionMarkdown),
            )
          : createElement(
              Text,
              { style: styles.muted },
              "No project description recorded.",
            ),
        generalDocumentRef
          ? createElement(
              Text,
              { style: styles.muted },
              `Referenced documentation: ${generalDocumentRef}`,
            )
          : null,
      ),

      // Scope
      createElement(
        View,
        { style: styles.section },
        createElement(Text, { style: styles.heading }, "3. Scope of work"),
        createElement(
          Text,
          { style: styles.body },
          `${PROVIDER_SHORT} will design, build, and deliver the following features. Work not listed is out of scope unless agreed in writing.`,
        ),
        ...features.map((feature, index) => {
          const related = feature.integrationIds
            .map((id) => integrationsById.get(id)?.name)
            .filter(Boolean);
          const documentRef = formatDocumentRefs(
            exhibitsForAttachmentIds(
              exhibits,
              feature.attachments.map((attachment) => attachment.id),
            ),
          );
          const extras = [
            related.length > 0 ? `Integrations: ${related.join(", ")}` : "",
            documentRef ? `Referenced documentation: ${documentRef}` : "",
          ].filter(Boolean);
          return createElement(
            View,
            { key: feature.id, style: styles.clause },
            createElement(
              Text,
              { style: styles.itemTitle },
              `3.${index + 1}  ${displayValue(feature.name, "Untitled feature")}`,
            ),
            createElement(
              Text,
              null,
              feature.descriptionMarkdown.trim()
                ? stripMarkdown(feature.descriptionMarkdown)
                : "No description provided.",
            ),
            extras.length > 0
              ? createElement(Text, { style: styles.muted }, extras.join(" · "))
              : null,
          );
        }),
      ),

      // Integrations
      integrations.length > 0
        ? createElement(
            View,
            { style: styles.section },
            createElement(
              Text,
              { style: styles.heading },
              "4. Integrations and third-party services",
            ),
            createElement(
              Text,
              { style: styles.body },
              "These services are required to deliver the features above. Unless stated otherwise, the Client owns the accounts; third-party fees are not included in the project fee.",
            ),
            ...integrations.map((integration) => {
              const related = integration.featureIds
                .map((id) => featuresById.get(id)?.name)
                .filter(Boolean);
              const documentRef = formatDocumentRefs(
                exhibitsForAttachmentIds(
                  exhibits,
                  integration.attachments.map((attachment) => attachment.id),
                ),
              );
              const extras = [
                `Account: ${ACCOUNT_STATUS_LABELS[integration.accountStatus]}${
                  integration.accountEmail.trim()
                    ? ` · ${integration.accountEmail}`
                    : ""
                }`,
                related.length > 0 ? `Supports: ${related.join(", ")}` : "",
                documentRef ? `Referenced documentation: ${documentRef}` : "",
              ].filter(Boolean);
              return createElement(
                View,
                { key: integration.id, style: styles.clause },
                createElement(
                  Text,
                  { style: styles.itemTitle },
                  displayValue(integration.name, "Untitled integration"),
                ),
                integration.descriptionMarkdown.trim()
                  ? createElement(
                      Text,
                      null,
                      stripMarkdown(integration.descriptionMarkdown),
                    )
                  : null,
                createElement(Text, { style: styles.muted }, extras.join(" · ")),
              );
            }),
          )
        : null,

      // Fee
      createElement(
        View,
        { style: styles.section },
        createElement(
          Text,
          { style: styles.heading },
          `${integrations.length > 0 ? "5" : "4"}. Fee and payment`,
        ),
        createElement(
          Text,
          { style: styles.body },
          `Project fee: ${
            payment.total == null ? "To be determined" : formatUsd(payment.total)
          } · Payment plan: ${payment.plan?.name ?? "No payment plan selected"}`,
        ),
        payment.plan
          ? createElement(Text, { style: styles.body }, payment.plan.description)
          : null,
        ...payment.installments.map((installment) =>
          createElement(
            View,
            { key: installment.label, style: styles.scheduleRow },
            createElement(Text, null, installment.label),
            createElement(Text, null, formatUsd(installment.amount)),
          ),
        ),
        createElement(
          Text,
          { style: styles.body },
          "Work begins after signing and receipt of any amount due upon signing. Custom deliverables transfer to the Client upon payment in full.",
        ),
      ),

      // Priorities
      createElement(
        View,
        { style: styles.section },
        createElement(Text, { style: styles.heading }, "Delivery priorities"),
        createElement(
          Text,
          { style: styles.body },
          `If trade-offs are required, ${PROVIDER_SHORT} will follow this ranking (1 = highest):`,
        ),
        ...project.priorities.map((priority, index) =>
          createElement(
            Text,
            { key: priority, style: styles.bullet },
            `${index + 1}. ${PROJECT_PRIORITY_LABELS[priority]}`,
          ),
        ),
      ),

      // Notes
      project.additionalNotesMarkdown.trim()
        ? createElement(
            View,
            { style: styles.section },
            createElement(
              Text,
              { style: styles.heading },
              "Additional notes and exclusions",
            ),
            createElement(
              Text,
              null,
              stripMarkdown(project.additionalNotesMarkdown),
            ),
          )
        : null,

      // Appendix A
      exhibits.length > 0
        ? createElement(
            View,
            { style: styles.section },
            createElement(Text, { style: styles.heading }, APPENDIX_A_TITLE),
            ...APPENDIX_A_INTRO.map((paragraph) =>
              createElement(Text, { key: paragraph, style: styles.body }, paragraph),
            ),
            createElement(
              Text,
              { style: styles.itemTitle },
              "Referenced Documents",
            ),
            ...exhibits.map((exhibit) =>
              createElement(
                Text,
                { key: exhibit.attachmentId, style: styles.bullet },
                `${exhibit.reference}: ${exhibit.fileName} (${exhibitScopeLabel(exhibit)})`,
              ),
            ),
            ...appendixAClosing(PROVIDER_NAME).map((paragraph) =>
              createElement(Text, { key: paragraph, style: styles.body }, paragraph),
            ),
          )
        : null,

      // Terms
      createElement(
        View,
        { style: styles.section },
        createElement(Text, { style: styles.heading }, "Terms"),
        createElement(
          Text,
          { style: styles.bullet },
          `• The features in the Scope of work section are the complete initial scope. Material changes may affect fee or timeline and require written agreement.`,
        ),
        createElement(
          Text,
          { style: styles.bullet },
          `• The Client will provide branding, content, account access, approvals, and timely feedback needed to complete the listed features.`,
        ),
        createElement(
          Text,
          { style: styles.bullet },
          `• Third-party products, licenses, domains, and usage fees are the Client's responsibility unless expressly included.`,
        ),
        createElement(
          Text,
          { style: styles.bullet },
          `• ${PROVIDER_SHORT} will deliver the described features in a professional manner. Acceptance is based on the feature descriptions herein, not on unlisted discussions.`,
        ),
        createElement(
          Text,
          { style: styles.bullet },
          `• ${PROVIDER_SHORT} will perform the Services based on this Agreement, the agreed Scope of Work, and the Client-provided documentation${
            exhibits.length > 0
              ? ` listed in ${APPENDIX_A_TITLE}`
              : " submitted through the project intake form"
          }. Requests that materially differ from or add to those materials may be treated as a change in scope.`,
        ),
        createElement(
          Text,
          { style: styles.bullet },
          `• Upon payment in full, the Client owns the custom code and deliverables produced for this project. ${PROVIDER_SHORT} may reuse general methods, libraries, and know-how that are not unique to the Client.`,
        ),
        createElement(
          Text,
          { style: styles.bullet },
          `• Either party may pause or end the engagement for material breach after written notice and a reasonable opportunity to cure. Amounts owed for work already performed remain due.`,
        ),
      ),

      // Signatures
      createElement(
        View,
        { style: styles.section },
        createElement(Text, { style: styles.heading }, "Signatures"),
        createElement(
          Text,
          { style: styles.body },
          `By signing, the parties agree that ${PROVIDER_SHORT} will deliver the features above for the stated fee, and that those features define the customer's expectations.`,
        ),
        createElement(
          View,
          { style: styles.sigGrid, wrap: false },
          createElement(
            View,
            { style: styles.sigCol },
            createElement(Text, { style: styles.itemTitle }, PROVIDER_NAME),
            createElement(Image, {
              style: styles.sigImage,
              src: contract.hhais.signatureDataUrl,
            }),
            createElement(
              Text,
              null,
              contract.hhais.signerName ?? developedBy,
            ),
            createElement(Text, { style: styles.muted }, "Founder"),
            createElement(
              Text,
              { style: styles.muted },
              `Signed ${formatLongDate(contract.hhais.signedAt)}`,
            ),
          ),
          createElement(
            View,
            { style: styles.sigCol },
            createElement(
              Text,
              { style: styles.itemTitle },
              displayValue(business.legalName || business.name),
            ),
            createElement(Image, {
              style: styles.sigImage,
              src: contract.client.signatureDataUrl,
            }),
            createElement(
              Text,
              null,
              contract.client.signerName ?? displayValue(contact.name),
            ),
            contact.role
              ? createElement(Text, { style: styles.muted }, contact.role)
              : null,
            createElement(
              Text,
              { style: styles.muted },
              `Signed ${formatLongDate(contract.client.signedAt)}`,
            ),
          ),
        ),
      ),

      createElement(
        Text,
        { style: styles.footer, fixed: true },
        `Executed agreement · Storage reference: ${finalPdfPath} · ${PROVIDER_SHORT}`,
      ),
    ),
  );

  const instance = pdf(doc);
  const stream = await instance.toBuffer();

  const chunks: Buffer[] = [];
  for await (const chunk of stream as AsyncIterable<Buffer | Uint8Array>) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}
