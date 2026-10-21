"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    UserX,
    Eye,
    Copy,
    UserPlus,
    RefreshCw,
    AlertCircle,
    Check,
} from "lucide-react";
import { InviteAffiliateModal } from "@/components/feature/affiliate/InviteAffiliateModal";
import { useGetAffiliates, useGetAffiliateInvites } from "@/hooks/useAffiliates";
import { AffiliateItem } from "@/types/affiliate";
import { showSuccess } from "@/config/toast";

const ITEMS_PER_PAGE = 10;

function formatJoinedDate(dateStr?: string | null): string {
    if (!dateStr) return "-";
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return String(dateStr);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return String(dateStr);
    }
}

function getInitials(name?: string | null, email?: string | null): string {
    if (typeof name === "string" && name.trim()) {
        const parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length >= 2 && parts[0]?.[0] && parts[1]?.[0]) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        if (parts[0]) {
            return parts[0].slice(0, 2).toUpperCase();
        }
    }
    if (typeof email === "string" && email.trim()) {
        return email.trim().slice(0, 2).toUpperCase();
    }
    return "AF";
}

export default function AffiliatesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [activeActionId, setActiveActionId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Live backend queries
    // Table: GET /affiliate/admin/all
    const {
        data: apiAffiliates,
        isLoading,
        isError,
        refetch,
        isFetching,
    } = useGetAffiliates();

    // Invites: GET /affiliate/admin/invites
    const { data: apiInvites } = useGetAffiliateInvites();

    // Safe affiliates array from backend API
    const affiliates: AffiliateItem[] = useMemo(() => {
        return Array.isArray(apiAffiliates) ? apiAffiliates : [];
    }, [apiAffiliates]);

    // Search filter across Name, Email, and Affiliate Code
    const filteredAffiliates = useMemo(() => {
        if (!Array.isArray(affiliates)) return [];
        if (!searchQuery.trim()) return affiliates;
        const q = searchQuery.toLowerCase().trim();
        return affiliates.filter(
            (item) =>
                item &&
                (String(item.name || "").toLowerCase().includes(q) ||
                 String(item.email || "").toLowerCase().includes(q) ||
                 String(item.code || "").toLowerCase().includes(q))
        );
    }, [affiliates, searchQuery]);

    // Dynamic Pagination calculations (safe against NaN / Infinity)
    const totalPages = Math.max(1, Math.ceil((filteredAffiliates?.length || 0) / ITEMS_PER_PAGE));
    const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

    const paginatedAffiliates = useMemo(() => {
        if (!Array.isArray(filteredAffiliates)) return [];
        const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
        return filteredAffiliates.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredAffiliates, safeCurrentPage]);

    // Live Metrics (completely safe against null/undefined or object payloads)
    const totalAffiliatesCount = affiliates.length;
    const pendingInvitesCount = Array.isArray(apiInvites)
        ? apiInvites.filter((inv) => inv?.isActive).length
        : 0;
    const totalReferralsCount = affiliates.reduce(
        (acc, curr) => acc + (curr?.referrals_count || 0),
        0
    );
    const totalCommissionsSum = affiliates.reduce(
        (acc, curr) => acc + (curr?.total_commission || 0),
        0
    );
    const totalCommissionsFormatted = `$${totalCommissionsSum.toLocaleString()}`;

    const handleCopyCode = async (e: React.MouseEvent, code: string, id: string) => {
        e.stopPropagation();
        try {
            if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(code);
            }
        } catch {
            // Ignore clipboard errors on restricted origins
        }
        setCopiedId(id);
        showSuccess(`Copied referral code: ${code}`);
        setTimeout(() => setCopiedId(null), 2000);
        setActiveActionId(null);
    };

    return (
        <section className="w-full flex flex-col gap-8 pb-14">
            {/* Page Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl lg:text-[26px] font-bold text-neutral-900 tracking-tight">
                        Affiliates Management
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        View, monitor, and invite affiliates to your platform.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        title="Refresh data"
                        className="h-10 px-3.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 active:scale-95 text-neutral-600 flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                    >
                        <RefreshCw size={14} className={isFetching ? "animate-spin text-blue-600" : ""} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>
            </div>

            {/* Stat Cards Grid (4 Columns) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100 flex flex-col justify-between min-h-[120px]">
                    <span className="text-xs text-neutral-400 font-medium tracking-wide">
                        Total Affiliates
                    </span>
                    <span className="text-3xl font-bold text-neutral-900 mt-2">
                        {isLoading ? (
                            <span className="inline-block w-12 h-8 bg-neutral-200 animate-pulse rounded-md" />
                        ) : (
                            totalAffiliatesCount
                        )}
                    </span>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100 flex flex-col justify-between min-h-[120px]">
                    <span className="text-xs text-neutral-400 font-medium tracking-wide">
                        Pending Invites
                    </span>
                    <span className="text-3xl font-bold text-neutral-900 mt-2">
                        {isLoading ? (
                            <span className="inline-block w-12 h-8 bg-neutral-200 animate-pulse rounded-md" />
                        ) : (
                            pendingInvitesCount
                        )}
                    </span>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100 flex flex-col justify-between min-h-[120px]">
                    <span className="text-xs text-neutral-400 font-medium tracking-wide">
                        Total Referrals
                    </span>
                    <span className="text-3xl font-bold text-neutral-900 mt-2">
                        {isLoading ? (
                            <span className="inline-block w-12 h-8 bg-neutral-200 animate-pulse rounded-md" />
                        ) : (
                            totalReferralsCount
                        )}
                    </span>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100 flex flex-col justify-between min-h-[120px]">
                    <span className="text-xs text-neutral-400 font-medium tracking-wide">
                        Total Commissions
                    </span>
                    <span className="text-3xl font-bold text-neutral-900 mt-2">
                        {isLoading ? (
                            <span className="inline-block w-20 h-8 bg-neutral-200 animate-pulse rounded-md" />
                        ) : (
                            totalCommissionsFormatted
                        )}
                    </span>
                </div>
            </div>

            {/* Error banner if fetching failed */}
            {isError && (
                <div className="w-full bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-rose-800 text-sm">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle size={18} className="text-rose-600 shrink-0" />
                        <span>Failed to load affiliates from the server.</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="px-3.5 py-1.5 bg-rose-600 text-white font-medium rounded-lg text-xs hover:bg-rose-700 transition-colors cursor-pointer"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Affiliates Table Section */}
            <div className="w-full flex flex-col gap-5">
                <div className="w-full flex items-center justify-between gap-4 flex-wrap">
                    <h2 className="text-xl font-bold text-neutral-900">Affiliates</h2>

                    {/* Filter and Action Bar */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Search bar */}
                        <div className="relative w-full sm:w-[280px] md:w-[320px]">
                            <Search
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Search by name, email, code"
                                className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-300 bg-white text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Invite Affiliate Button */}
                        <button
                            type="button"
                            onClick={() => setIsInviteOpen(true)}
                            className="bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99] text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm cursor-pointer shrink-0 inline-flex items-center gap-2"
                        >
                            <UserPlus size={16} />
                            <span>Invite Affiliate</span>
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="w-full bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100 overflow-hidden">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-[#C7D7FE] text-neutral-800 text-xs font-semibold uppercase tracking-wider">
                                    <th className="py-4 px-6">NAME</th>
                                    <th className="py-4 px-6">EMAIL</th>
                                    <th className="py-4 px-6">REFERRALS</th>
                                    <th className="py-4 px-6">CONVERSIONS</th>
                                    <th className="py-4 px-6">JOINED</th>
                                    <th className="py-4 px-6 text-center">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 text-sm">
                                {isLoading ? (
                                    /* Skeleton loading state */
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <tr key={`skeleton-${index}`} className="animate-pulse">
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-neutral-200" />
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="w-28 h-4 bg-neutral-200 rounded" />
                                                        <div className="w-16 h-3 bg-neutral-200 rounded" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="w-36 h-4 bg-neutral-200 rounded" />
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="w-10 h-4 bg-neutral-200 rounded" />
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="w-10 h-4 bg-neutral-200 rounded" />
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="w-20 h-4 bg-neutral-200 rounded" />
                                            </td>
                                            <td className="py-5 px-6 text-center">
                                                <div className="w-8 h-8 rounded-full bg-neutral-200 mx-auto" />
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredAffiliates.length === 0 ? (
                                    /* Empty state */
                                    <tr>
                                        <td colSpan={6} className="py-16 px-6 text-center">
                                            <div className="max-w-[360px] mx-auto flex flex-col items-center justify-center text-center">
                                                <div className="w-14 h-14 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mb-3">
                                                    <UserPlus size={26} />
                                                </div>
                                                <h3 className="text-base font-bold text-neutral-900">
                                                    {searchQuery ? "No matching affiliates" : "No affiliates yet"}
                                                </h3>
                                                <p className="text-xs text-neutral-500 mt-1 mb-5">
                                                    {searchQuery
                                                        ? `No affiliate results match "${searchQuery}". Try a different keyword.`
                                                        : "There are currently no registered affiliates. Invite someone to join your affiliate network."}
                                                </p>
                                                {searchQuery ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setSearchQuery("")}
                                                        className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                                                    >
                                                        Clear Search
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsInviteOpen(true)}
                                                        className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                                                    >
                                                        <UserPlus size={14} />
                                                        <span>Invite Affiliate</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    /* Render live affiliate rows */
                                    paginatedAffiliates.map((item, index) => (
                                        <tr
                                            key={item?.id || `affiliate-${index}`}
                                            onClick={() => item?.id && router.push(`/dashboard/affiliate/${item.id}`)}
                                            className="hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                                        >
                                            {/* Name & Avatar */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    {item.avatar ? (
                                                        <img
                                                            src={item.avatar}
                                                            alt={item.name || "Affiliate"}
                                                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-neutral-200"
                                                        />
                                                    ) : (
                                                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                                                            {getInitials(item.name, item.email)}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                                                                {item.name || "Unnamed Affiliate"}
                                                            </span>
                                                            {item.isSuspended && (
                                                                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                                                                    Suspended
                                                                </span>
                                                            )}
                                                        </div>
                                                        {item.code && (
                                                            <span className="text-xs font-mono text-neutral-500">
                                                                {item.code}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email column */}
                                            <td className="py-4 px-6 text-neutral-600">
                                                {item.email || "-"}
                                            </td>

                                            {/* Referrals column */}
                                            <td className="py-4 px-6 text-neutral-800 font-medium">
                                                {item.referrals_count ?? 0}
                                            </td>

                                            {/* Conversions column */}
                                            <td className="py-4 px-6 text-neutral-800 font-medium">
                                                {item.conversions_count ?? 0}
                                            </td>

                                            {/* Joined column */}
                                            <td className="py-4 px-6 text-neutral-600">
                                                {formatJoinedDate(item.created_at)}
                                            </td>

                                            {/* Actions */}
                                            <td
                                                className="py-4 px-6 text-center relative"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="inline-block relative">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setActiveActionId(
                                                                activeActionId === item.id ? null : item.id
                                                            )
                                                        }
                                                        className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:border-neutral-500 transition-colors cursor-pointer"
                                                    >
                                                        <MoreHorizontal size={16} />
                                                    </button>

                                                    {/* Dropdown Menu */}
                                                    {activeActionId === item.id && (
                                                        <>
                                                            <div
                                                                className="fixed inset-0 z-20"
                                                                onClick={() => setActiveActionId(null)}
                                                            />
                                                            <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-neutral-100 py-1.5 z-30 flex flex-col text-left">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setActiveActionId(null);
                                                                        if (item?.id) {
                                                                            router.push(`/dashboard/affiliate/${item.id}`);
                                                                        }
                                                                    }}
                                                                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                                                                >
                                                                    <Eye size={14} className="text-neutral-400" />
                                                                    <span>View Details</span>
                                                                </button>

                                                                {item.code && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => handleCopyCode(e, item.code, item.id)}
                                                                        className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                                                                    >
                                                                        {copiedId === item.id ? (
                                                                            <>
                                                                                <Check size={14} className="text-emerald-600" />
                                                                                <span className="text-emerald-600 font-semibold">Code Copied!</span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Copy size={14} className="text-neutral-400" />
                                                                                <span>Copy Code</span>
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                )}

                                                                <div className="my-1 border-t border-neutral-100" />

                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setActiveActionId(null);
                                                                        alert(`Affiliate status: ${item.isSuspended ? "Currently Suspended" : "Active"}`);
                                                                    }}
                                                                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                                                                >
                                                                    <UserX size={14} className="text-neutral-400" />
                                                                    <span>Status: {item.isSuspended ? "Suspended" : "Active"}</span>
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Dynamic Pagination Controls */}
                {!isLoading && filteredAffiliates.length > 0 && (
                    <div className="w-full flex items-center justify-between gap-4 flex-wrap pt-2">
                        <span className="text-xs text-neutral-500 font-medium">
                            Showing{" "}
                            <span className="text-neutral-800 font-semibold">
                                {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}
                            </span>{" "}
                            to{" "}
                            <span className="text-neutral-800 font-semibold">
                                {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredAffiliates.length)}
                            </span>{" "}
                            of{" "}
                            <span className="text-neutral-800 font-semibold">
                                {filteredAffiliates.length}
                            </span>{" "}
                            affiliates
                        </span>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={safeCurrentPage === 1}
                                className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:border-neutral-500 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-xs"
                            >
                                <ChevronLeft size={14} />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((page) => {
                                    if (totalPages <= 7) return true;
                                    if (page === 1 || page === totalPages) return true;
                                    if (Math.abs(page - safeCurrentPage) <= 1) return true;
                                    return false;
                                })
                                .reduce<(number | string)[]>((acc, page, idx, arr) => {
                                    if (idx > 0 && typeof arr[idx - 1] === "number" && page - arr[idx - 1] > 1) {
                                        acc.push("...");
                                    }
                                    acc.push(page);
                                    return acc;
                                }, [])
                                .map((item, idx) => {
                                    if (item === "...") {
                                        return (
                                            <span key={`dots-${idx}`} className="text-xs text-neutral-400 px-1">
                                                ...
                                            </span>
                                        );
                                    }
                                    const pageNum = Number(item);
                                    const isActive = pageNum === safeCurrentPage;
                                    return (
                                        <button
                                            key={`page-${pageNum}`}
                                            type="button"
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold cursor-pointer transition-colors ${
                                                isActive
                                                    ? "bg-[#2563EB] text-white"
                                                    : "text-neutral-600 hover:bg-neutral-100"
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={safeCurrentPage === totalPages}
                                className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:border-neutral-500 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-xs"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Invite Affiliate Modal */}
            <InviteAffiliateModal
                isOpen={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                onSuccess={() => {
                    refetch();
                }}
            />
        </section>
    );
}
