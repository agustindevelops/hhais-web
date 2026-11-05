import { NextResponse } from "next/server";

import {
  isUserAuthFailure,
  jsonError,
  requireUser,
} from "@/lib/auth/require-user";
import { hasBlogWriteFields, readBlogWriteInput } from "@/lib/blog/input";
import { blogErrorResponse } from "@/lib/blog/response";
import {
  deleteOwnedBlog,
  getOwnedBlog,
  serializeBlog,
  updateOwnedBlog,
} from "@/lib/blog/service";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** Read one blog post owned by the signed-in user. */
export async function GET(_request: Request, context: RouteContext) {
  const authResult = await requireUser();
  if (isUserAuthFailure(authResult)) {
    return authResult.response;
  }

  const { id } = await context.params;
  if (!id) {
    return jsonError("blog id is required");
  }

  try {
    const blog = await getOwnedBlog({ userId: authResult.userId, id });
    return NextResponse.json(serializeBlog(blog));
  } catch (error) {
    return blogErrorResponse(error, "Failed to read blog post");
  }
}

/** Update one blog post owned by the signed-in user. */
export async function PATCH(request: Request, context: RouteContext) {
  const authResult = await requireUser();
  if (isUserAuthFailure(authResult)) {
    return authResult.response;
  }

  const { id } = await context.params;
  if (!id) {
    return jsonError("blog id is required");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = readBlogWriteInput(body);
  if (!parsed.ok) {
    return jsonError(parsed.message);
  }
  if (!hasBlogWriteFields(parsed.input)) {
    return jsonError("No fields to update");
  }

  try {
    const blog = await updateOwnedBlog({
      userId: authResult.userId,
      id,
      title: parsed.input.title,
      slug: parsed.input.slug,
      excerpt: parsed.input.excerpt,
      contentMarkdown: parsed.input.contentMarkdown,
      status: parsed.input.status,
    });

    return NextResponse.json(serializeBlog(blog));
  } catch (error) {
    return blogErrorResponse(error, "Failed to update blog post");
  }
}

/** Delete one blog post owned by the signed-in user. */
export async function DELETE(_request: Request, context: RouteContext) {
  const authResult = await requireUser();
  if (isUserAuthFailure(authResult)) {
    return authResult.response;
  }

  const { id } = await context.params;
  if (!id) {
    return jsonError("blog id is required");
  }

  try {
    const deleted = await deleteOwnedBlog({
      userId: authResult.userId,
      id,
    });

    return NextResponse.json({
      id: deleted.id,
      deleted: true,
    });
  } catch (error) {
    return blogErrorResponse(error, "Failed to delete blog post");
  }
}
