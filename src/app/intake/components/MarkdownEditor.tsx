"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { marked } from "marked";
import TurndownService from "turndown";

import Button from "@/components/Elements/Button";
import { cn } from "@/helpers/cn";

const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
});

function markdownToHtml(markdown: string) {
  return marked.parse(markdown || "", { async: false }) as string;
}

function htmlToMarkdown(html: string) {
  if (!html || html === "<p></p>") {
    return "";
  }
  return turndown.turndown(html);
}

type MarkdownEditorProps = {
  id?: string;
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
};

export default function MarkdownEditor({
  id,
  value,
  onChange,
  placeholder,
}: MarkdownEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: markdownToHtml(value),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        id: id ?? "",
        class:
          "min-h-[8rem] px-3 py-2 text-sm text-default-900 outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:text-lg [&_h2]:font-semibold [&_p]:my-1",
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange(htmlToMarkdown(instance.getHTML()));
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }
    const current = htmlToMarkdown(editor.getHTML());
    if (current !== value) {
      editor.commands.setContent(markdownToHtml(value), {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  return (
    <div className="overflow-hidden rounded-md border border-default-300 bg-white shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
      <div className="flex flex-wrap gap-1 border-b border-default-200 bg-default-50 px-2 py-1">
        <ToolbarButton
          label="Bold"
          active={editor?.isActive("bold") ?? false}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="Italic"
          active={editor?.isActive("italic") ?? false}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="List"
          active={editor?.isActive("bulletList") ?? false}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="Heading"
          active={editor?.isActive("heading", { level: 2 }) ?? false}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
        />
      </div>
      <div className="relative">
        {placeholder && editor?.isEmpty ? (
          <p className="pointer-events-none absolute left-3 top-2 text-sm text-default-400">
            {placeholder}
          </p>
        ) : null}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function ToolbarButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? "secondary" : "ghost"}
      className={cn("h-7 px-2 text-xs", active && "bg-default-200")}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
