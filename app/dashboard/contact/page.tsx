"use client";

import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { showSuccess } from "@/config/toast";
import { IContactMessageItem } from "@/types/contact";
import ResponseEditor from "@/components/feature/contact/responseEditor";

const INITIAL_MESSAGES: IContactMessageItem[] = [
    {
        id: "1",
        name: "Jane Doe",
        email: "janedoe@gmail.com",
        subject: "General Inquiry",
        category: "General Inquiry",
        date: "Aug 15",
        fullDate: "August 15 10:30 AM",
        preview: "Hello, I am having trouble accessing the advanced question library for the upcoming test...",
        body: [
            "Hello Admin Team,",
            "I am having trouble accessing the advanced question library for the upcoming test. It seems my subscription status might not be reflecting correctly on the dashboard. I upgraded my plan two days ago.",
            "Could you please check my account and ensure the proper permissions are applied?",
        ],
        replies: [
            {
                id: "r1",
                sender: "Admin",
                createdAt: "August 15 11:00 AM",
                content: [
                    "Hello,",
                    "Thank you for reaching out. I understand you're having issues accessing the advanced question library. I will look into your subscription status right away to ensure everything is set up correctly after your recent upgrade.",
                    "Please hold on for a moment while I check your account. I'll get back to you shortly with an update.",
                ],
            },
        ],
        hasPendingResponse: false,
    },
    {
        id: "2",
        name: "Manny Pete",
        email: "mannypete@gmail.com",
        subject: "Technical Support",
        category: "Technical Support",
        categoryColor: "primary",
        date: "Aug 15",
        fullDate: "August 15 09:15 AM",
        preview: "Hello, I am having trouble accessing the advanced question library for the upcoming test...",
        body: [
            "Hello Admin Team,",
            "I am having trouble accessing the advanced question library for the upcoming test. It seems my subscription status might not be reflecting correctly on the dashboard. I upgraded my plan two days ago.",
            "Could you please check my account and ensure the proper permissions are applied?",
        ],
        replies: [],
        hasPendingResponse: true,
    },
    {
        id: "3",
        name: "Dolly Parton",
        email: "dollyparton@gmail.com",
        subject: "Billing Question",
        category: "Billing Question",
        date: "Aug 15",
        fullDate: "August 15 08:30 AM",
        preview: "Hello, I am having trouble accessing the advanced question library for the upcoming test...",
        body: [
            "Hello Admin Team,",
            "I am having trouble accessing the advanced question library for the upcoming test. It seems my subscription status might not be reflecting correctly on the dashboard. I upgraded my plan two days ago.",
            "Could you please check my account and ensure the proper permissions are applied?",
        ],
        replies: [],
        hasPendingResponse: true,
    },
];

export default function ContactPage() {
    const [messages, setMessages] = useState<IContactMessageItem[]>(INITIAL_MESSAGES);
    const [selectedId, setSelectedId] = useState<string>("1");
    const [activeTab, setActiveTab] = useState<"all" | "pending">("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [replyText, setReplyText] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Filter messages according to tab and search term
    const filteredMessages = useMemo(() => {
        return messages.filter((msg) => {
            const matchesTab = activeTab === "all" ? true : msg.hasPendingResponse;
            const query = searchQuery.trim().toLowerCase();
            const matchesSearch =
                query === "" ||
                msg.name.toLowerCase().includes(query) ||
                msg.category.toLowerCase().includes(query) ||
                msg.email.toLowerCase().includes(query) ||
                msg.preview.toLowerCase().includes(query);

            return matchesTab && matchesSearch;
        });
    }, [messages, activeTab, searchQuery]);

    // Active selected message (fallback to first filtered if current selection is not found)
    const activeMessage = useMemo(() => {
        return (
            messages.find((m) => m.id === selectedId) ||
            filteredMessages[0] ||
            messages[0]
        );
    }, [messages, selectedId, filteredMessages]);

    const handleSendMessage = () => {
        if (!replyText.trim() || !activeMessage) return;

        setIsSubmitting(true);

        setTimeout(() => {
            const paragraphs = replyText
                .split("\n\n")
                .map((p) => p.trim())
                .filter(Boolean);

            const newReply = {
                id: `reply-${Date.now()}`,
                sender: "Admin",
                createdAt: "Just now",
                content: paragraphs.length > 0 ? paragraphs : [replyText.trim()],
            };

            setMessages((prev) =>
                prev.map((msg) => {
                    if (msg.id === activeMessage.id) {
                        return {
                            ...msg,
                            replies: [...msg.replies, newReply],
                            hasPendingResponse: false,
                        };
                    }
                    return msg;
                })
            );

            setReplyText("");
            setIsSubmitting(false);
            showSuccess("Response sent successfully");
        }, 300);
    };

    return (
        <div className="w-full max-w-[1440px] mx-auto pb-12 flex flex-col gap-6 font-sans">
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                Contact Messages
            </h1>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Search, Tabs & Message Cards */}
                <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5">
                    {/* Search Input Box */}
                    <div className="relative flex items-center bg-transparent border border-neutral-300/90 rounded-xl px-3.5 py-2.5 shadow-2xs focus-within:border-primary-300 focus-within:ring-1 focus-within:ring-primary-300 transition-all">
                        <Search size={18} className="text-neutral-400 mr-2.5 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-6 pt-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab("all")}
                            className={`relative pb-1.5 text-sm transition-colors cursor-pointer ${
                                activeTab === "all"
                                    ? "text-primary-300 font-semibold"
                                    : "text-neutral-600 hover:text-neutral-900 font-normal"
                            }`}
                        >
                            All
                            {activeTab === "all" && (
                                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary-300 rounded-full" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("pending")}
                            className={`relative pb-1.5 text-sm transition-colors cursor-pointer ${
                                activeTab === "pending"
                                    ? "text-primary-300 font-semibold"
                                    : "text-neutral-600 hover:text-neutral-900 font-normal"
                            }`}
                        >
                            Pending Response
                            {activeTab === "pending" && (
                                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary-300 rounded-full" />
                            )}
                        </button>
                    </div>

                    {/* Message Cards List */}
                    <div className="flex flex-col gap-3.5 pt-1">
                        {filteredMessages.length === 0 ? (
                            <div className="bg-white rounded-2xl p-6 text-center text-sm text-neutral-400 border border-neutral-100 shadow-xs">
                                No messages found
                            </div>
                        ) : (
                            filteredMessages.map((item) => {
                                const isSelected = item.id === activeMessage?.id;

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedId(item.id)}
                                        className={`rounded-2xl p-5 transition-all cursor-pointer bg-white ${
                                            isSelected
                                                ? "border-2 border-primary-300 shadow-xs"
                                                : "border border-neutral-100/90 shadow-2xs hover:border-neutral-200"
                                        }`}
                                    >
                                        {/* Card Header */}
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-neutral-900 text-base">
                                                {item.name}
                                            </h3>
                                            <span className="text-xs text-neutral-400 font-medium">
                                                {item.date}
                                            </span>
                                        </div>

                                        {/* Category Tag */}
                                        <p
                                            className={`text-xs font-semibold mt-1 ${
                                                item.categoryColor === "primary"
                                                    ? "text-primary-300"
                                                    : "text-neutral-500"
                                            }`}
                                        >
                                            {item.category}
                                        </p>

                                        {/* Preview */}
                                        <p className="text-xs sm:text-[13px] text-neutral-500 mt-2 line-clamp-2 leading-relaxed font-normal">
                                            {item.preview}
                                        </p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Column: Message Details & Response Thread */}
                {activeMessage && (
                    <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl p-6 sm:p-8 lg:p-9 shadow-xs border border-neutral-100/90 flex flex-col">
                        {/* Conversation Header */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                                    {activeMessage.name}
                                </h2>
                                <p className="text-sm text-neutral-500 mt-0.5 font-normal">
                                    {activeMessage.email}
                                </p>
                            </div>
                            <span className="text-xs font-medium text-neutral-400 whitespace-nowrap pt-1">
                                {activeMessage.fullDate}
                            </span>
                        </div>

                        {/* Subject */}
                        <div className="mt-6 text-sm flex items-center gap-2">
                            <span className="font-bold text-neutral-900">Subject</span>
                            <span className="text-neutral-700 font-normal">
                                {activeMessage.subject}
                            </span>
                        </div>

                        {/* Message Body */}
                        <div className="mt-6 space-y-4 text-sm text-neutral-700 leading-relaxed font-normal">
                            {activeMessage.body.map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                            ))}
                        </div>

                        {/* Response Thread (if any responses exist) */}
                        {activeMessage.replies.length > 0 && (
                            <div className="mt-8 space-y-4">
                                <h3 className="font-bold text-sm text-neutral-900">
                                    Your Response
                                </h3>
                                {activeMessage.replies.map((reply) => (
                                    <div
                                        key={reply.id}
                                        className="space-y-4 text-sm text-neutral-700 leading-relaxed font-normal"
                                    >
                                        {reply.content.map((p, pIdx) => (
                                            <p key={pIdx}>{p}</p>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Response Composer */}
                        <div className="mt-8">
                            <ResponseEditor
                                value={replyText}
                                onChange={setReplyText}
                                onSubmit={handleSendMessage}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}