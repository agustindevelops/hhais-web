export type BlogWriteInput = {
  title?: string;
  slug?: string;
  excerpt?: string;
  contentMarkdown?: string;
  status?: string;
};

export type BlogInputResult =
  | { ok: true; input: BlogWriteInput }
  | { ok: false; message: string };

function readOptionalString(
  record: Record<string, unknown>,
  key: string,
): { ok: true; present: boolean; value?: string } | { ok: false; message: string } {
  if (!(key in record)) {
    return { ok: true, present: false };
  }
  if (typeof record[key] !== "string") {
    return { ok: false, message: `${key} must be a string` };
  }
  return { ok: true, present: true, value: record[key] };
}

export function readBlogWriteInput(body: unknown): BlogInputResult {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Invalid JSON body" };
  }

  const record = body as Record<string, unknown>;
  const input: BlogWriteInput = {};

  const title = readOptionalString(record, "title");
  if (!title.ok) return title;
  if (title.present) input.title = title.value;

  const slug = readOptionalString(record, "slug");
  if (!slug.ok) return slug;
  if (slug.present) input.slug = slug.value;

  const excerpt = readOptionalString(record, "excerpt");
  if (!excerpt.ok) return excerpt;
  if (excerpt.present) input.excerpt = excerpt.value;

  const content = readOptionalString(record, "content_markdown");
  if (!content.ok) return content;
  if (content.present) input.contentMarkdown = content.value;

  const status = readOptionalString(record, "status");
  if (!status.ok) return status;
  if (status.present) input.status = status.value;

  return { ok: true, input };
}

export function hasBlogWriteFields(input: BlogWriteInput) {
  return (
    input.title !== undefined ||
    input.slug !== undefined ||
    input.excerpt !== undefined ||
    input.contentMarkdown !== undefined ||
    input.status !== undefined
  );
}
