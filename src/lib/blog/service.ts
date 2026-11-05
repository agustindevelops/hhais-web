import "server-only";

import { Prisma, type Blog } from "../../../generated/prisma/client";

import { prisma } from "@/lib/prisma";

import { slugify } from "./slug";

const BLOG_STATUSES = ["draft", "published"] as const;
const MAX_TITLE_LENGTH = 160;
const MAX_EXCERPT_LENGTH = 300;
const MAX_CONTENT_LENGTH = 100_000;

export type BlogStatus = (typeof BLOG_STATUSES)[number];

export class BlogServiceError extends Error {
  status: number;
  code: string;

  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = "BlogServiceError";
    this.code = code;
    this.status = status;
  }
}

export function serializeBlog(blog: Blog) {
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    content_markdown: blog.contentMarkdown,
    status: blog.status,
    published_at: blog.publishedAt,
    created_at: blog.createdAt,
    updated_at: blog.updatedAt,
  };
}

function parseStatus(status: string | undefined, fallback: BlogStatus) {
  const value = status ?? fallback;
  if (!BLOG_STATUSES.includes(value as BlogStatus)) {
    throw new BlogServiceError(
      "INVALID_STATUS",
      "status must be draft or published",
    );
  }
  return value as BlogStatus;
}

function parseTitle(title: string) {
  const value = title.trim();
  if (!value) {
    throw new BlogServiceError("INVALID_TITLE", "title is required");
  }
  if (value.length > MAX_TITLE_LENGTH) {
    throw new BlogServiceError(
      "INVALID_TITLE",
      `title must be ${MAX_TITLE_LENGTH} characters or fewer`,
    );
  }
  return value;
}

function parseSlug(slug: string) {
  const value = slugify(slug);
  if (!value) {
    throw new BlogServiceError(
      "INVALID_SLUG",
      "slug must include letters or numbers",
    );
  }
  return value;
}

function parseExcerpt(excerpt: string) {
  const value = excerpt.trim();
  if (value.length > MAX_EXCERPT_LENGTH) {
    throw new BlogServiceError(
      "INVALID_EXCERPT",
      `excerpt must be ${MAX_EXCERPT_LENGTH} characters or fewer`,
    );
  }
  return value;
}

function parseContent(content: string) {
  if (content.length > MAX_CONTENT_LENGTH) {
    throw new BlogServiceError(
      "INVALID_CONTENT",
      "content_markdown is too long",
    );
  }
  return content;
}

function publishedAtFor(status: BlogStatus, current: Date | null) {
  if (status === "published") {
    return current ?? new Date();
  }
  return null;
}

function isUniqueConflict(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
}

async function assertSlugAvailable(input: {
  userId: number;
  slug: string;
  ignoreId?: string;
}) {
  const existing = await prisma.blog.findFirst({
    where: {
      userId: input.userId,
      slug: input.slug,
      ...(input.ignoreId ? { NOT: { id: input.ignoreId } } : {}),
    },
    select: { id: true },
  });

  if (existing) {
    throw new BlogServiceError(
      "BLOG_SLUG_TAKEN",
      "You already have a post with this slug",
      409,
    );
  }
}

export async function getOwnedBlog(input: { userId: number; id: string }) {
  const blog = await prisma.blog.findFirst({
    where: { id: input.id, userId: input.userId },
  });

  if (!blog) {
    throw new BlogServiceError("BLOG_NOT_FOUND", "Blog post not found", 404);
  }

  return blog;
}

export async function listOwnedBlogs(userId: number) {
  return prisma.blog.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createOwnedBlog(input: {
  userId: number;
  title: string;
  slug?: string;
  excerpt?: string;
  contentMarkdown?: string;
  status?: string;
}) {
  const title = parseTitle(input.title);
  const slug = parseSlug(input.slug?.trim() ? input.slug : title);
  const excerpt = parseExcerpt(input.excerpt ?? "");
  const contentMarkdown = parseContent(input.contentMarkdown ?? "");
  const status = parseStatus(input.status, "draft");

  await assertSlugAvailable({ userId: input.userId, slug });

  try {
    return await prisma.blog.create({
      data: {
        userId: input.userId,
        title,
        slug,
        excerpt,
        contentMarkdown,
        status,
        publishedAt: publishedAtFor(status, null),
      },
    });
  } catch (error) {
    if (isUniqueConflict(error)) {
      throw new BlogServiceError(
        "BLOG_SLUG_TAKEN",
        "You already have a post with this slug",
        409,
      );
    }
    throw error;
  }
}

export async function updateOwnedBlog(input: {
  userId: number;
  id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  contentMarkdown?: string;
  status?: string;
}) {
  const existing = await getOwnedBlog({ userId: input.userId, id: input.id });

  const title = input.title === undefined ? existing.title : parseTitle(input.title);
  const slug =
    input.slug === undefined ? existing.slug : parseSlug(input.slug);
  const excerpt =
    input.excerpt === undefined ? existing.excerpt : parseExcerpt(input.excerpt);
  const contentMarkdown =
    input.contentMarkdown === undefined
      ? existing.contentMarkdown
      : parseContent(input.contentMarkdown);
  const status = parseStatus(input.status ?? existing.status, "draft");

  if (slug !== existing.slug) {
    await assertSlugAvailable({
      userId: input.userId,
      slug,
      ignoreId: existing.id,
    });
  }

  try {
    return await prisma.blog.update({
      where: { id: existing.id },
      data: {
        title,
        slug,
        excerpt,
        contentMarkdown,
        status,
        publishedAt: publishedAtFor(status, existing.publishedAt),
      },
    });
  } catch (error) {
    if (isUniqueConflict(error)) {
      throw new BlogServiceError(
        "BLOG_SLUG_TAKEN",
        "You already have a post with this slug",
        409,
      );
    }
    throw error;
  }
}

export async function deleteOwnedBlog(input: { userId: number; id: string }) {
  const existing = await getOwnedBlog({ userId: input.userId, id: input.id });
  await prisma.blog.delete({ where: { id: existing.id } });
  return existing;
}
