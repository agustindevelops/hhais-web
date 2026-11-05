import { NextResponse } from "next/server";

import {
  isUserAuthFailure,
  jsonError,
  requireUser,
} from "@/lib/auth/require-user";
import { readBlogWriteInput } from "@/lib/blog/input";
import { blogErrorResponse } from "@/lib/blog/response";
import {
  createOwnedBlog,
  listOwnedBlogs,
  serializeBlog,
} from "@/lib/blog/service";

export const runtime = "nodejs";

/** List blog posts owned by the signed-in user. */
export async function GET() {
  const authResult = await requireUser();
  if (isUserAuthFailure(authResult)) {
    return authResult.response;
  }

  try {
    const blogs = await listOwnedBlogs(authResult.userId);
    return NextResponse.json({
      blogs: blogs.map(serializeBlog),
    });
  } catch (error) {
    return blogErrorResponse(error, "Failed to list blog posts");
  }
}

/** Create a blog post owned by the signed-in user. */
export async function POST(request: Request) {
  const authResult = await requireUser();
  if (isUserAuthFailure(authResult)) {
    return authResult.response;
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
  const title = parsed.input.title?.trim() ?? "";
  if (!title) {
    return jsonError("title is required");
  }

  try {
    const blog = await createOwnedBlog({
      userId: authResult.userId,
      title,
      slug: parsed.input.slug,
      excerpt: parsed.input.excerpt,
      contentMarkdown: parsed.input.contentMarkdown,
      status: parsed.input.status,
    });

    return NextResponse.json(serializeBlog(blog));
  } catch (error) {
    return blogErrorResponse(error, "Failed to create blog post");
  }
}
