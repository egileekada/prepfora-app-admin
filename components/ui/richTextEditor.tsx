"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { useCallback, useEffect } from "react";

export interface RichTextEditorProps {
  /** Current HTML value (controlled) */
  value?: string;
  /** Called with the new HTML string on every change */
  onChange?: (html: string) => void;
  /** Called on blur — handy for Formik's `handleBlur` / touched state */
  onBlur?: () => void;
  placeholder?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  minHeight?: number;
  className?: string;
}

function ToolbarButton({
  onPress,
  isActive,
  isDisabled,
  label,
  children,
}: {
  onPress: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      disabled={isDisabled}
      onClick={onPress}
      aria-label={label}
      aria-pressed={isActive}
      className={`min-w-8 w-8 h-8 flex items-center justify-center rounded-md transition-colors text-sm ${isActive
        ? "bg-primary-100 text-primary-600 font-medium"
        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
        } ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", previousUrl ?? "");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-default-200 bg-default-50 px-2 py-1.5 bg-neutral-50 rounded-t-xl ">
      <ToolbarButton
        label="Heading 1"
        isActive={editor.isActive("heading", { level: 1 })}
        onPress={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 2"
        isActive={editor.isActive("heading", { level: 2 })}
        onPress={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        isActive={editor.isActive("heading", { level: 3 })}
        onPress={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={16} />
      </ToolbarButton>

      <div className="w-[1px] h-6 bg-default-200 mx-1" />

      <ToolbarButton
        label="Bold"
        isActive={editor.isActive("bold")}
        onPress={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        isActive={editor.isActive("italic")}
        onPress={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        isActive={editor.isActive("underline")}
        onPress={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough"
        isActive={editor.isActive("strike")}
        onPress={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Code"
        isActive={editor.isActive("code")}
        onPress={() => editor.chain().focus().toggleCode().run()}
      >
        <Code size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Link"
        isActive={editor.isActive("link")}
        onPress={setLink}
      >
        <LinkIcon size={16} />
      </ToolbarButton>

      <div className="w-[1px] h-6 bg-default-200 mx-1" />

      <ToolbarButton
        label="Bullet list"
        isActive={editor.isActive("bulletList")}
        onPress={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        isActive={editor.isActive("orderedList")}
        onPress={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Quote"
        isActive={editor.isActive("blockquote")}
        onPress={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </ToolbarButton>

      <div className="w-[1px] h-6 bg-default-200 mx-1" />

      <ToolbarButton
        label="Undo"
        isDisabled={!editor.can().undo()}
        onPress={() => editor.chain().focus().undo().run()}
      >
        <Undo size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        isDisabled={!editor.can().redo()}
        onPress={() => editor.chain().focus().redo().run()}
      >
        <Redo size={16} />
      </ToolbarButton>
    </div>
  );
}

export default function RichTextEditor({
  value = "",
  onChange,
  onBlur,
  placeholder = "Write something…",
  isInvalid = false,
  isDisabled = false,
  minHeight = 180,
  className = "",
}: RichTextEditorProps) {
  const editor = useEditor({
    // Avoids Tiptap/Next.js SSR hydration-mismatch warnings
    immediatelyRender: false,
    editable: !isDisabled,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none px-3 py-2 " +
          "prose-p:my-2 prose-headings:my-2",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    onBlur: () => {
      onBlur?.();
    },
  });

  // Keep editor content in sync if `value` is changed from outside
  // (e.g. Formik's setFieldValue / resetForm / initial async data load).
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  useEffect(() => {
    editor?.setEditable(!isDisabled);
  }, [isDisabled, editor]);

  return (
    <div
      className={`rounded-xl border transition-colors ${isInvalid
        ? "border-danger focus-within:border-danger"
        : "border-default-200 focus-within:border-primary"
        } ${isDisabled ? "opacity-60 pointer-events-none" : ""} ${className}`}
    >
      <Toolbar editor={editor} />
      <div style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
