"use client";

import { useState } from "react";
import { X, Check, Copy, CheckCircle2, Mail, ExternalLink } from "lucide-react";
import { useSendAffiliateInvite } from "@/hooks/useAffiliates";
import { showSuccess } from "@/config/toast";

interface InviteAffiliateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function InviteAffiliateModal({
    isOpen,
    onClose,
    onSuccess,
}: InviteAffiliateModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    const sendInviteMutation = useSendAffiliateInvite();

    if (!isOpen) return null;

    const handleClose = () => {
        setName("");
        setEmail("");
        setError("");
        setCopiedCode(false);
        setCopiedLink(false);
        sendInviteMutation.reset();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            setError("Email address is required");
            return;
        }

        // Basic email validation regex
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setError("Please enter a valid email address");
            return;
        }

        setError("");

        sendInviteMutation.mutate(
            {
                name: name.trim() || undefined,
                email: trimmedEmail,
            },
            {
                onSuccess: () => {
                    onSuccess?.();
                },
            }
        );
    };

    const handleCopy = async (text: string, type: "code" | "link") => {
        if (!text) return;
        try {
            if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
            }
        } catch {
            // Ignore clipboard errors
        }
        if (type === "code") {
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
            showSuccess("Invite code copied to clipboard");
        } else {
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
            showSuccess("Invite link copied to clipboard");
        }
    };

    const rawData = sendInviteMutation.data as any;
    const inviteData = rawData?.data ?? rawData;
    const isSuccess = sendInviteMutation.isSuccess && !!inviteData && typeof inviteData === "object";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
                onClick={handleClose}
            />

            {/* Modal Box */}
            <div className="relative w-full max-w-[480px] bg-white rounded-3xl p-7 sm:p-9 shadow-2xl z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Top header row */}
                <div className="w-full flex items-center justify-between">
                    <span className="text-emerald-900 font-medium text-sm tracking-wide">
                        {isSuccess ? "Success" : "Invite"}
                    </span>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="w-7 h-7 rounded-full border border-neutral-900 flex items-center justify-center text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                        <X size={15} strokeWidth={2.5} />
                    </button>
                </div>

                {isSuccess ? (
                    /* Success view showing code and invite link */
                    <div className="w-full flex flex-col items-center text-center mt-3 animate-in fade-in duration-200">
                        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                            <CheckCircle2 size={32} />
                        </div>

                        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                            Invitation Sent!
                        </h2>
                        <p className="text-sm text-neutral-600 mt-1.5 max-w-[360px]">
                            An invite email has been sent to{" "}
                            <span className="font-semibold text-neutral-900">{inviteData.email || email}</span>.
                        </p>

                        {/* Invite Code Box */}
                        {inviteData.code && (
                            <div className="w-full mt-6 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col gap-2 text-left">
                                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                                    Invite Code (Expires in 24h)
                                </span>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="font-mono text-2xl font-bold tracking-widest text-[#2563EB]">
                                        {inviteData.code}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(inviteData.code!, "code")}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer shadow-xs"
                                    >
                                        {copiedCode ? (
                                            <>
                                                <Check size={14} className="text-emerald-600" />
                                                <span className="text-emerald-600">Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={14} />
                                                <span>Copy Code</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Invite Link Box (if provided by API) */}
                        {inviteData.invite_link && (
                            <div className="w-full mt-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-2 text-left">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <ExternalLink size={16} className="text-neutral-400 shrink-0" />
                                    <span className="text-xs text-neutral-600 truncate font-mono">
                                        {inviteData.invite_link}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(inviteData.invite_link!, "link")}
                                    className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
                                >
                                    {copiedLink ? (
                                        <>
                                            <Check size={13} className="text-emerald-600" />
                                            <span className="text-emerald-600">Copied</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={13} />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="w-full flex items-center gap-3 mt-7">
                            <button
                                type="button"
                                onClick={() => {
                                    sendInviteMutation.reset();
                                    setEmail("");
                                    setName("");
                                }}
                                className="flex-1 h-12 rounded-xl border border-neutral-300 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                            >
                                Invite Another
                            </button>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 h-12 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-sm font-semibold text-white transition-colors cursor-pointer shadow-sm"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Initial Invite Form */
                    <>
                        <h2 className="text-2xl sm:text-[26px] font-bold text-neutral-900 mt-4 mb-6 tracking-tight">
                            Invite Affiliate
                        </h2>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            {/* Name input (Optional reference for admin) */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-neutral-900">
                                    Name <span className="text-xs font-normal text-neutral-400">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Jane Doe"
                                    disabled={sendInviteMutation.isPending}
                                    className="w-full h-13 px-4 rounded-xl border border-neutral-300 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 transition-colors disabled:bg-neutral-100"
                                />
                            </div>

                            {/* Email input (Required) */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-neutral-900">
                                    Email *
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (error) setError("");
                                        }}
                                        placeholder="janedoe@gmail.com"
                                        disabled={sendInviteMutation.isPending}
                                        className="w-full h-13 pl-4 pr-10 rounded-xl border border-neutral-300 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 transition-colors disabled:bg-neutral-100"
                                    />
                                    <Mail
                                        size={18}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                                    />
                                </div>
                                {error && (
                                    <span className="text-xs text-rose-500 font-medium">{error}</span>
                                )}
                            </div>

                            {/* Send Button */}
                            <button
                                type="submit"
                                disabled={sendInviteMutation.isPending || !email.trim()}
                                className="w-full h-13 bg-[#93B4F8] hover:bg-[#80a5f7] active:scale-[0.99] text-neutral-900 font-semibold rounded-2xl text-base transition-all mt-3 cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {sendInviteMutation.isPending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                                        <span>Sending Invite...</span>
                                    </>
                                ) : (
                                    "Send Invite"
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
