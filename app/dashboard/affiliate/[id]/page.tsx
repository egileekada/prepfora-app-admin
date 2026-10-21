"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronDown, Search } from "lucide-react";
import { useGetAffiliateDetails } from "@/hooks/useAffiliates";
import { ReferralItem } from "@/types/affiliate";

const defaultReferrals: ReferralItem[] = [
    {
        id: "ref-1",
        name: "Jane Doe",
        email: "janedoe@gmail.com",
        status: "Converted",
        subscription: "Paid",
        joined: "5 days ago",
    },
    {
        id: "ref-2",
        name: "John Doe",
        email: "johndoe@gmail.com",
        status: "Converted",
        subscription: "Free",
        joined: "7 days ago",
    },
    {
        id: "ref-3",
        name: "John Doe",
        email: "johndoe@gmail.com",
        status: "Pending",
        subscription: "-",
        joined: "-",
    },
    {
        id: "ref-4",
        name: "John Doe",
        email: "johndoe@gmail.com",
        status: "Converted",
        subscription: "Paid",
        joined: "12 days ago",
    },
    {
        id: "ref-5",
        name: "John Doe",
        email: "johndoe@gmail.com",
        status: "Converted",
        subscription: "Paid",
        joined: "12 days ago",
    },
    {
        id: "ref-6",
        name: "James Doe",
        email: "jamesdoe@gmail.com",
        status: "Pending",
        subscription: "-",
        joined: "-",
    },
];

export default function AffiliateDetailsPage() {
    const routeParams = useParams();
    const id = typeof routeParams?.id === "string" ? routeParams.id : Array.isArray(routeParams?.id) ? routeParams.id[0] : "";
    const router = useRouter();

    const { data: affiliateDetail, isLoading } = useGetAffiliateDetails(id);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("All");
    const [selectedPlan, setSelectedPlan] = useState<string>("All");
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSuspended, setIsSuspended] = useState(false);

    const affiliateName = affiliateDetail?.name || "Affiliate Details";
    const affiliateEmail = affiliateDetail?.email || "affiliate@example.com";
    
    let joinedDate = "-";
    if (affiliateDetail?.created_at) {
        try {
            const d = new Date(affiliateDetail.created_at);
            if (!isNaN(d.getTime())) {
                joinedDate = d.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                });
            }
        } catch {
            joinedDate = String(affiliateDetail.created_at);
        }
    }

    const filteredReferrals = useMemo(() => {
        return defaultReferrals.filter((item) => {
            const matchesSearch =
                !searchQuery.trim() ||
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                selectedStatus === "All" || item.status === selectedStatus;

            const matchesPlan =
                selectedPlan === "All" ||
                (selectedPlan === "Paid Users" && item.subscription === "Paid") ||
                (selectedPlan === "Free Users" && item.subscription === "Free");

            return matchesSearch && matchesStatus && matchesPlan;
        });
    }, [searchQuery, selectedStatus, selectedPlan]);

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedStatus("All");
        setSelectedPlan("All");
    };

    return (
        <section className="w-full flex flex-col gap-7 pb-14">
            {/* Back to Affiliates button */}
            <div>
                <button
                    type="button"
                    onClick={() => router.push("/dashboard/affiliate")}
                    className="flex items-center gap-2 text-neutral-800 hover:text-neutral-950 font-medium text-sm cursor-pointer transition-colors"
                >
                    <ChevronLeft size={18} />
                    <span>Back to Affiliates</span>
                </button>
            </div>

            {/* Profile & Metric summary */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Affiliate Profile Card */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100 flex flex-col justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl shrink-0">
                            {affiliateName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold text-neutral-900 leading-snug">
                                {affiliateName}
                            </h2>
                            <p className="text-xs text-neutral-500 mt-0.5">
                                {affiliateEmail}
                            </p>
                            {affiliateDetail?.code && (
                                <span className="inline-block mt-2 px-2.5 py-0.5 bg-neutral-100 rounded-md text-xs font-mono font-semibold text-neutral-700 w-fit">
                                    {affiliateDetail.code}
                                </span>
                            )}
                            <div className="mt-3 flex items-center gap-3 text-xs text-neutral-500">
                                <span>Joined: <strong className="text-neutral-800 font-semibold">{joinedDate}</strong></span>
                                <span>Status: <strong className={isSuspended || affiliateDetail?.isSuspended ? "text-rose-600 font-semibold" : "text-emerald-600 font-semibold"}>
                                    {isSuspended || affiliateDetail?.isSuspended ? "Suspended" : "Active"}
                                </strong></span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsSuspended((prev) => !prev)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                                isSuspended || affiliateDetail?.isSuspended
                                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                    : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                            }`}
                        >
                            {isSuspended || affiliateDetail?.isSuspended ? "Reactivate Affiliate" : "Suspend Affiliate"}
                        </button>
                    </div>
                </div>

                {/* Stat Cards 2x2 */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100 flex flex-col justify-between">
                        <span className="text-xs text-neutral-400 font-medium">Total Referrals</span>
                        <span className="text-2xl font-bold text-neutral-900 mt-3">{affiliateDetail?.referrals_count ?? 40}</span>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100 flex flex-col justify-between">
                        <span className="text-xs text-neutral-400 font-medium">Conversions</span>
                        <span className="text-2xl font-bold text-neutral-900 mt-3">{affiliateDetail?.conversions_count ?? 31}</span>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100 flex flex-col justify-between">
                        <span className="text-xs text-neutral-400 font-medium">Total Commission</span>
                        <span className="text-2xl font-bold text-neutral-900 mt-3">${(affiliateDetail?.total_commission ?? 1240).toLocaleString()}</span>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100 flex flex-col justify-between">
                        <span className="text-xs text-neutral-400 font-medium">Conversion Rate</span>
                        <span className="text-2xl font-bold text-emerald-600 mt-3">
                            {affiliateDetail?.referrals_count
                                ? Math.round(((affiliateDetail.conversions_count || 0) / affiliateDetail.referrals_count) * 100) + "%"
                                : "77.5%"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Referrals Section */}
            <div className="w-full flex flex-col gap-5 mt-2">
                <div className="w-full flex items-center justify-between gap-4 flex-wrap">
                    <h3 className="text-xl font-bold text-neutral-900">Referred Users</h3>

                    {/* Filter and Action Bar */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Search bar */}
                        <div className="relative w-full sm:w-[260px]">
                            <Search
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, email"
                                className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-300 bg-white text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Status filter */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsStatusDropdownOpen(!isStatusDropdownOpen);
                                    setIsPlanDropdownOpen(false);
                                }}
                                className="h-11 px-4 rounded-xl border border-neutral-300 bg-white text-sm text-neutral-700 flex items-center gap-2 cursor-pointer hover:bg-neutral-50 transition-colors"
                            >
                                <span>{selectedStatus}</span>
                                <ChevronDown size={16} className="text-neutral-500" />
                            </button>

                            {isStatusDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-20"
                                        onClick={() => setIsStatusDropdownOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-neutral-100 py-1.5 z-30 flex flex-col text-xs font-medium">
                                        {["All", "Converted", "Pending"].map((status) => (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedStatus(status);
                                                    setIsStatusDropdownOpen(false);
                                                }}
                                                className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 text-neutral-700 cursor-pointer"
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Plan filter */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsPlanDropdownOpen(!isPlanDropdownOpen);
                                    setIsStatusDropdownOpen(false);
                                }}
                                className="h-11 px-4 rounded-xl border border-neutral-300 bg-white text-sm text-neutral-700 flex items-center gap-2 cursor-pointer hover:bg-neutral-50 transition-colors"
                            >
                                <span>{selectedPlan}</span>
                                <ChevronDown size={16} className="text-neutral-500" />
                            </button>

                            {isPlanDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-20"
                                        onClick={() => setIsPlanDropdownOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-neutral-100 py-1.5 z-30 flex flex-col text-xs font-medium">
                                        {["All", "Paid Users", "Free Users"].map((plan) => (
                                            <button
                                                key={plan}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPlan(plan);
                                                    setIsPlanDropdownOpen(false);
                                                }}
                                                className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 text-neutral-700 cursor-pointer"
                                            >
                                                {plan}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Clear filters */}
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="text-[#2563EB] hover:underline text-xs font-semibold cursor-pointer ml-1"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Referrals Table Container */}
                <div className="w-full bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100 overflow-hidden">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[650px]">
                            <thead>
                                <tr className="bg-[#C7D7FE] text-neutral-800 text-xs font-semibold uppercase tracking-wider">
                                    <th className="py-4 px-6">NAME</th>
                                    <th className="py-4 px-6">EMAIL</th>
                                    <th className="py-4 px-6">STATUS</th>
                                    <th className="py-4 px-6">SUBSCRIPTION</th>
                                    <th className="py-4 px-6">JOINED</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 text-sm">
                                {filteredReferrals.map((item) => (
                                    <tr key={item.id} className="hover:bg-neutral-50/80 transition-colors">
                                        <td className="py-5 px-6 font-bold text-neutral-900">
                                            {item.name}
                                        </td>
                                        <td className="py-5 px-6 text-neutral-600">
                                            {item.email}
                                        </td>
                                        <td className="py-5 px-6 font-semibold">
                                            {item.status === "Converted" ? (
                                                <span className="text-[#10B981]">Converted</span>
                                            ) : (
                                                <span className="text-[#F59E0B]">Pending</span>
                                            )}
                                        </td>
                                        <td className="py-5 px-6 text-neutral-800 font-medium">
                                            {item.subscription}
                                        </td>
                                        <td className="py-5 px-6 text-neutral-600">
                                            {item.joined}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
