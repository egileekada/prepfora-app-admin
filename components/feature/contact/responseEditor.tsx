"use client";

import React, { useRef, useState } from "react";
import {
    List,
    ListOrdered,
    Italic,
    Bold,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Image as ImageIcon,
    Link2,
} from "lucide-react";

interface ResponseEditorProps {
    value: string;
    onChange: (val: string) => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
    placeholder?: string;
}

export default function ResponseEditor({
    value,
    onChange,
    onSubmit,
    isSubmitting = false,
    placeholder = "Start Typing...",
}: ResponseEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [alignment, setAlignment] = useState<"left" | "center" | "right">("left");
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    const applyFormatting = (format: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);

        let formattedText = "";
        let newCursorPos = end;

        switch (format) {
            case "bold":
                setIsBold(!isBold);
                formattedText = selectedText ? `**${selectedText}**` : "**bold**";
                newCursorPos = selectedText ? end + 4 : start + 6;
                break;
            case "italic":
                setIsItalic(!isItalic);
                formattedText = selectedText ? `*${selectedText}*` : "*italic*";
                newCursorPos = selectedText ? end + 2 : start + 7;
                break;
            case "underline":
                setIsUnderline(!isUnderline);
                formattedText = selectedText ? `<u>${selectedText}</u>` : "<u>text</u>";
                newCursorPos = selectedText ? end + 7 : start + 7;
                break;
            case "bullet":
                formattedText = selectedText
                    ? selectedText
                          .split("\n")
                          .map((line) => `• ${line}`)
                          .join("\n")
                    : "\n• ";
                newCursorPos = start + formattedText.length;
                break;
            case "ordered":
                formattedText = selectedText
                    ? selectedText
                          .split("\n")
                          .map((line, i) => `${i + 1}. ${line}`)
                          .join("\n")
                    : "\n1. ";
                newCursorPos = start + formattedText.length;
                break;
            case "link": {
                const url = prompt("Enter URL:", "https://");
                if (!url) return;
                formattedText = selectedText ? `[${selectedText}](${url})` : `[Link](${url})`;
                newCursorPos = start + formattedText.length;
                break;
            }
            case "image": {
                const imgUrl = prompt("Enter Image URL:", "https://");
                if (!imgUrl) return;
                formattedText = `![Image](${imgUrl})`;
                newCursorPos = start + formattedText.length;
                break;
            }
            default:
                break;
        }

        const nextValue = value.substring(0, start) + formattedText + value.substring(end);
        onChange(nextValue);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 10);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            onSubmit();
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-neutral-800">
                Enter Response
            </label>

            <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100/70 transition-all">
                {/* Toolbar */}
                <div className="bg-[#f4f5f7] px-3.5 py-2 flex items-center justify-between border-b border-neutral-200/60">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <button
                            type="button"
                            title="Bullet List"
                            onClick={() => applyFormatting("bullet")}
                            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-md transition-colors cursor-pointer"
                        >
                            <List size={18} />
                        </button>
                        <button
                            type="button"
                            title="Numbered List"
                            onClick={() => applyFormatting("ordered")}
                            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-md transition-colors cursor-pointer"
                        >
                            <ListOrdered size={18} />
                        </button>
                        <button
                            type="button"
                            title="Italic"
                            onClick={() => applyFormatting("italic")}
                            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                isItalic
                                    ? "bg-primary-100 text-primary-300 font-semibold"
                                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60"
                            }`}
                        >
                            <Italic size={18} />
                        </button>
                        <button
                            type="button"
                            title="Bold"
                            onClick={() => applyFormatting("bold")}
                            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                isBold
                                    ? "bg-primary-100 text-primary-300 font-semibold"
                                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60"
                            }`}
                        >
                            <Bold size={18} />
                        </button>
                        <button
                            type="button"
                            title="Underline"
                            onClick={() => applyFormatting("underline")}
                            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                isUnderline
                                    ? "bg-primary-100 text-primary-300 font-semibold"
                                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60"
                            }`}
                        >
                            <Underline size={18} />
                        </button>
                        <button
                            type="button"
                            title="Align Left"
                            onClick={() => setAlignment("left")}
                            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                alignment === "left"
                                    ? "bg-primary-100 text-primary-300"
                                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60"
                            }`}
                        >
                            <AlignLeft size={18} />
                        </button>
                        <button
                            type="button"
                            title="Align Center"
                            onClick={() => setAlignment("center")}
                            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                alignment === "center"
                                    ? "bg-primary-100 text-primary-300"
                                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60"
                            }`}
                        >
                            <AlignCenter size={18} />
                        </button>
                        <button
                            type="button"
                            title="Align Right"
                            onClick={() => setAlignment("right")}
                            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                alignment === "right"
                                    ? "bg-primary-100 text-primary-300"
                                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60"
                            }`}
                        >
                            <AlignRight size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <button
                            type="button"
                            title="Insert Image"
                            onClick={() => applyFormatting("image")}
                            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-md transition-colors cursor-pointer"
                        >
                            <ImageIcon size={18} />
                        </button>
                        <button
                            type="button"
                            title="Insert Link"
                            onClick={() => applyFormatting("link")}
                            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-md transition-colors cursor-pointer"
                        >
                            <Link2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Text Area */}
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={6}
                    style={{ textAlign: alignment }}
                    className="w-full p-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none resize-none min-h-[140px] leading-relaxed bg-white"
                />
            </div>

            {/* Send Button */}
            <div className="flex justify-end pt-1">
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isSubmitting || !value.trim()}
                    className="px-6 py-2.5 bg-primary-300 hover:bg-primary-250 active:bg-primary-350 disabled:bg-primary-150 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                    {isSubmitting ? "Sending..." : "Send Message"}
                </button>
            </div>
        </div>
    );
}
