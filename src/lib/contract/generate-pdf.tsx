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
  DOCUMENT_KIND,
  DOCUMENT_TITLE,
  FALLBACK,
  PROVIDER_NAME,
  PROVIDER_SHORT,
  PROVIDER_SIGNATORY_TITLE,
  REFERENCED_DOCUMENTS_HEADING,
  SECTION_TITLE,
  accountStatusLine,
  appendixAClosing,
  clauseTitle,
  contractLede,
  contractTerms,
  displayValue,
  exhibitListLine,
  feeCommencement,
  feeToBeDetermined,
  formatLongDate,
  integrationsIntro,
  noDescriptionProvided,
  noProjectDescription,
  noPaymentPlanSelected,
  numberedSections,
  prioritiesIntro,
  referencedDocumentationLine,
  relatedIntegrationsLine,
  scopeIntro,
  sectionHeading,
  signaturesIntro,
  supportsLine,
} from "@/lib/contract/copy";
import {
  exhibitsForAttachmentIds,
  formatDocumentRefs,
} from "@/lib/contract/exhibits";
import type { ContractPageData } from "@/lib/contract/types";
import {
  buildPaymentSchedule,
  formatUsd,
} from "@/lib/contract/payment-schedule";
import { PROJECT_PRIORITY_LABELS } from "@/lib/intake/types";

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
    FALLBACK.client,
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
  const hasIntegrations = integrations.length > 0;
  const hasNotes = Boolean(project.additionalNotesMarkdown.trim());
  const hasExhibits = exhibits.length > 0;
  const sections = numberedSections(hasIntegrations, hasNotes, hasExhibits);
  const terms = contractTerms({
    scopeSection: sections.scope,
    appendixSection: hasExhibits ? sections.exhibits : null,
  });
  const generalDocumentRef = referencedDocumentationLine(
    formatDocumentRefs(
      exhibitsForAttachmentIds(
        exhibits,
        snapshot.generalAttachments.map((attachment) => attachment.id),
      ),
    ),
  );

  const finalPdfPath =
    contract.finalPdfPath ??
    `${input.clientId}/contracts/${contract.id}/executed.pdf`;

  const doc = createElement(
    Document,
    {
      title: `${DOCUMENT_TITLE} — ${clientName}`,
      author: PROVIDER_NAME,
      subject: `Executed ${DOCUMENT_KIND}`,
    },
    createElement(
      Page,
      { size: "LETTER", style: styles.page },
      createElement(Text, { style: styles.subtitle }, DOCUMENT_KIND),
      createElement(Text, { style: styles.title }, DOCUMENT_TITLE),
      createElement(
        Text,
        { style: styles.meta },
        `Executed copy · Prepared for ${clientName}`,
      ),
      createElement(Text, { style: styles.intro }, contractLede(clientName)),

      createElement(
        View,
        { style: styles.section },
        createElement(
          Text,
          { style: styles.heading },
          sectionHeading(sections.parties, SECTION_TITLE.parties),
        ),
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

      createElement(
        View,
        { style: styles.section },
        createElement(
          Text,
          { style: styles.heading },
          sectionHeading(sections.project, SECTION_TITLE.project),
        ),
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
          : createElement(Text, { style: styles.muted }, noProjectDescription()),
        generalDocumentRef
          ? createElement(Text, { style: styles.muted }, generalDocumentRef)
          : null,
      ),

      createElement(
        View,
        { style: styles.section },
        createElement(
          Text,
          { style: styles.heading },
          sectionHeading(sections.scope, SECTION_TITLE.scope),
        ),
        createElement(Text, { style: styles.body }, scopeIntro()),
        ...features.map((feature, index) => {
          const extras = [
            relatedIntegrationsLine(
              feature.integrationIds
                .map((id) => integrationsById.get(id)?.name)
                .filter((name): name is string => Boolean(name)),
            ),
            referencedDocumentationLine(
              formatDocumentRefs(
                exhibitsForAttachmentIds(
                  exhibits,
                  feature.attachments.map((attachment) => attachment.id),
                ),
              ),
            ),
          ].filter(Boolean);
          return createElement(
            View,
            { key: feature.id, style: styles.clause },
            createElement(
              Text,
              { style: styles.itemTitle },
              clauseTitle(sections.scope, index, feature.name),
            ),
            createElement(
              Text,
              null,
              feature.descriptionMarkdown.trim()
                ? stripMarkdown(feature.descriptionMarkdown)
                : noDescriptionProvided(),
            ),
            extras.length > 0
              ? createElement(Text, { style: styles.muted }, extras.join(" · "))
              : null,
          );
        }),
      ),

      hasIntegrations
        ? createElement(
            View,
            { style: styles.section },
            createElement(
              Text,
              { style: styles.heading },
              sectionHeading(sections.integrations, SECTION_TITLE.integrations),
            ),
            createElement(Text, { style: styles.body }, integrationsIntro()),
            ...integrations.map((integration) => {
              const extras = [
                accountStatusLine(
                  integration.accountStatus,
                  integration.accountEmail,
                ),
                supportsLine(
                  integration.featureIds
                    .map((id) => featuresById.get(id)?.name)
                    .filter((name): name is string => Boolean(name)),
                ),
                referencedDocumentationLine(
                  formatDocumentRefs(
                    exhibitsForAttachmentIds(
                      exhibits,
                      integration.attachments.map((attachment) => attachment.id),
                    ),
                  ),
                ),
              ].filter(Boolean);
              return createElement(
                View,
                { key: integration.id, style: styles.clause },
                createElement(
                  Text,
                  { style: styles.itemTitle },
                  displayValue(
                    integration.name,
                    FALLBACK.untitledIntegration,
                  ),
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

      createElement(
        View,
        { style: styles.section },
        createElement(
          Text,
          { style: styles.heading },
          sectionHeading(sections.fee, SECTION_TITLE.fee),
        ),
        createElement(
          Text,
          { style: styles.body },
          `Project fee: ${
            payment.total == null ? feeToBeDetermined() : formatUsd(payment.total)
          } · Payment plan: ${payment.plan?.name ?? noPaymentPlanSelected()}`,
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
        createElement(Text, { style: styles.body }, feeCommencement()),
      ),

      createElement(
        View,
        { style: styles.section },
        createElement(
          Text,
          { style: styles.heading },
          sectionHeading(sections.priorities, SECTION_TITLE.priorities),
        ),
        createElement(Text, { style: styles.body }, prioritiesIntro()),
        ...project.priorities.map((priority, index) =>
          createElement(
            Text,
            { key: priority, style: styles.bullet },
            `${index + 1}. ${PROJECT_PRIORITY_LABELS[priority]}`,
          ),
        ),
      ),

      hasNotes
        ? createElement(
            View,
            { style: styles.section },
            createElement(
              Text,
              { style: styles.heading },
              sectionHeading(sections.notes, SECTION_TITLE.notes),
            ),
            createElement(
              Text,
              null,
              stripMarkdown(project.additionalNotesMarkdown),
            ),
          )
        : null,

      hasExhibits
        ? createElement(
            View,
            { style: styles.section },
            createElement(
              Text,
              { style: styles.heading },
              sectionHeading(sections.exhibits, SECTION_TITLE.exhibits),
            ),
            ...APPENDIX_A_INTRO.map((paragraph) =>
              createElement(Text, { key: paragraph, style: styles.body }, paragraph),
            ),
            createElement(
              Text,
              { style: styles.itemTitle },
              REFERENCED_DOCUMENTS_HEADING,
            ),
            ...exhibits.map((exhibit) =>
              createElement(
                Text,
                { key: exhibit.attachmentId, style: styles.bullet },
                exhibitListLine(exhibit),
              ),
            ),
            ...appendixAClosing().map((paragraph) =>
              createElement(Text, { key: paragraph, style: styles.body }, paragraph),
            ),
          )
        : null,

      createElement(
        View,
        { style: styles.section },
        createElement(
          Text,
          { style: styles.heading },
          sectionHeading(sections.terms, SECTION_TITLE.terms),
        ),
        ...terms.map((term) =>
          createElement(Text, { key: term, style: styles.bullet }, `• ${term}`),
        ),
      ),

      createElement(
        View,
        { style: styles.section },
        createElement(
          Text,
          { style: styles.heading },
          sectionHeading(sections.signatures, SECTION_TITLE.signatures),
        ),
        createElement(Text, { style: styles.body }, signaturesIntro()),
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
            createElement(Text, { style: styles.muted }, PROVIDER_SIGNATORY_TITLE),
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
