"use client";

import { useMemo, useState } from "react";
import { ArrowDown2 } from "iconsax-reactjs";
import { CustomText } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useAnalyticsDashboard } from "@/hooks/useAnalytics";
import { useAdmin } from "@/context/AdminContext";
import { useRouter } from "next/navigation";

interface StatItem {
    title: string;
    number: string;
    perc: string;
    isHighlight?: boolean;
}

interface ActivityItem {
    title: string;
    time: string;
}

interface ChartDay {
    day: string;
    practiceSessions: string;
    dailyActiveUsers: string;
    sessionsHeight: number;
    activeHeight: number;
}

const recentActivities: ActivityItem[] = [
    {
        title: "New student Marcus R. registered",
        time: "2h ago",
    },
    {
        title: "Mathematics questions imported",
        time: "6h ago",
    },
    {
        title: "New student Marcus R. registered",
        time: "Yesterday",
    },
    {
        title: "New student Marcus R. registered",
        time: "Yesterday",
    },
];

export default function HomePage() {
    const router = useRouter();
    const { admin } = useAdmin();
    const { data: analytics, isLoading } = useAnalyticsDashboard();

    const [selectedPeriod, setSelectedPeriod] = useState("7 days");
    const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
    const [activeDayIndex, setActiveDayIndex] = useState<number>(0);

    const periodOptions = ["7 days", "14 days", "30 days", "3 months"];

    const statCards: StatItem[] = useMemo(() => [
        {
            title: "Total Students",
            number: analytics ? analytics.total_students.toLocaleString() : (isLoading ? "..." : "0"),
            perc: analytics?.new_signups
                ? `${analytics.new_signups.this_month.toLocaleString()} new this month`
                : "Overall student base",
        },
        {
            title: "Active Students",
            number: analytics ? analytics.active_students.daily_active.toLocaleString() : (isLoading ? "..." : "0"),
            perc: analytics?.active_students
                ? `${analytics.active_students.weekly_active.toLocaleString()} active this week`
                : "Daily active students",
        },
        {
            title: "New Sign Ups today",
            number: analytics ? analytics.new_signups.today.toLocaleString() : (isLoading ? "..." : "0"),
            perc: analytics?.new_signups
                ? `${analytics.new_signups.this_week.toLocaleString()} this week`
                : "Real-time tracking active",
            isHighlight: true,
        },
        {
            title: "Total Exams Taken",
            number: analytics ? analytics.exams_and_practices.total_taken.toLocaleString() : (isLoading ? "..." : "0"),
            perc: analytics?.exams_and_practices
                ? `${analytics.exams_and_practices.practices_taken.toLocaleString()} practice, ${analytics.exams_and_practices.mocks_taken.toLocaleString()} mock`
                : "Cumulative since inception",
        },
        {
            title: "Questions Answered",
            number: analytics ? analytics.activity_metrics.total_questions_answered.toLocaleString() : (isLoading ? "..." : "0"),
            perc: analytics?.activity_metrics
                ? `${analytics.activity_metrics.accuracy_rate_percentage.toFixed(1)}% accuracy rate`
                : "Across student sessions",
        },
        {
            title: "PrepPoints Awarded",
            number: analytics ? analytics.activity_metrics.total_prep_points_awarded.toLocaleString() : (isLoading ? "..." : "0"),
            perc: analytics?.activity_metrics
                ? `${analytics.activity_metrics.total_badges_earned.toLocaleString()} badges earned`
                : "Student PrepPoints used",
        },
    ], [analytics, isLoading]);

    const chartData: ChartDay[] = useMemo(() => {
        if (analytics?.recent_trends_7d && analytics.recent_trends_7d.length > 0) {
            const trends = analytics.recent_trends_7d;
            const maxVal = Math.max(
                ...trends.map((t) => (t.exams_taken || 0) + (t.signups || 0)),
                1
            );
            const maxScale = 75;

            return trends.map((item) => {
                const dateObj = new Date(item.date);
                const dayLabel = !isNaN(dateObj.getTime())
                    ? dateObj.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()
                    : item.date;

                const sessions = item.exams_taken || 0;
                const signups = item.signups || 0;

                const sessionsHeight = maxVal > 0 ? Math.max((sessions / maxVal) * maxScale, 4) : 4;
                const activeHeight = maxVal > 0 ? Math.max((signups / maxVal) * maxScale, 4) : 4;

                return {
                    day: dayLabel,
                    practiceSessions: sessions.toLocaleString(),
                    dailyActiveUsers: signups.toLocaleString(),
                    sessionsHeight,
                    activeHeight,
                };
            });
        }

        return [
            { day: "SUN", practiceSessions: "0", dailyActiveUsers: "0", sessionsHeight: 12, activeHeight: 8 },
            { day: "MON", practiceSessions: "0", dailyActiveUsers: "0", sessionsHeight: 12, activeHeight: 8 },
            { day: "TUE", practiceSessions: "0", dailyActiveUsers: "0", sessionsHeight: 12, activeHeight: 8 },
            { day: "WED", practiceSessions: "0", dailyActiveUsers: "0", sessionsHeight: 12, activeHeight: 8 },
            { day: "THU", practiceSessions: "0", dailyActiveUsers: "0", sessionsHeight: 12, activeHeight: 8 },
            { day: "FRI", practiceSessions: "0", dailyActiveUsers: "0", sessionsHeight: 12, activeHeight: 8 },
            { day: "SAT", practiceSessions: "0", dailyActiveUsers: "0", sessionsHeight: 12, activeHeight: 8 },
        ];
    }, [analytics?.recent_trends_7d]);

    const safeActiveIndex = Math.min(activeDayIndex, Math.max(chartData.length - 1, 0));

    return (
        <section className="w-full flex flex-col gap-7 pb-10">
            {/* Header Greeting */}
            <div className="flex items-center justify-between">
                <CustomText
                    type="headline-sm"
                    className="font-medium text-neutral-500 text-2xl lg:text-[26px] tracking-tight"
                >
                    Hello {admin?.name || "Admin"}!
                </CustomText>
                {isLoading && (
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <div className="w-3.5 h-3.5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                        <span>Updating metrics...</span>
                    </div>
                )}
            </div>

            {/* Stat Cards Grid (3 Columns x 2 Rows) */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((item, index) => (
                    <div
                        key={index}
                        className="w-full flex flex-col justify-between bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] min-h-[145px]"
                    >
                        <CustomText
                            type="body-sm"
                            className="text-neutral-350 text-[13px] font-normal"
                        >
                            {item.title}
                        </CustomText>
                        <CustomText
                            type="headline-lg"
                            className="font-semibold text-neutral-500 text-[32px] leading-tight my-2.5 tracking-tight"
                        >
                            {item.number}
                        </CustomText>
                        <CustomText
                            type="body-sm"
                            className={cn(
                                "text-xs font-normal",
                                item.isHighlight
                                    ? "text-secondary-350 font-medium"
                                    : "text-neutral-300"
                            )}
                        >
                            {item.perc}
                        </CustomText>
                    </div>
                ))}
            </div>

            {/* Analytics & Quick Action Section */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left: Students Overview Chart Card */}
                <div className="w-full lg:col-span-2 bg-white rounded-2xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                    {/* Card Header with Period Selector */}
                    <div className="w-full flex items-center justify-between pb-6">
                        <CustomText
                            type="title-lg"
                            className="font-semibold text-neutral-500 text-xl lg:text-[22px]"
                        >
                            Students Overview
                        </CustomText>

                        {/* 7 Days Filter Pill */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
                                className="flex items-center gap-3 border border-neutral-300 rounded-xl px-3.5 py-1.5 text-neutral-400 hover:text-neutral-500 hover:border-neutral-400 transition-colors cursor-pointer bg-white"
                            >
                                <span className="text-sm font-medium">{selectedPeriod}</span>
                                <span className="w-5 h-5 rounded-full border border-neutral-400 flex items-center justify-center shrink-0">
                                    <ArrowDown2 size={10} className="text-neutral-500" />
                                </span>
                            </button>

                            {isPeriodDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-20"
                                        onClick={() => setIsPeriodDropdownOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-neutral-100 py-1.5 z-30 flex flex-col">
                                        {periodOptions.map((period) => (
                                            <button
                                                key={period}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPeriod(period);
                                                    setIsPeriodDropdownOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-neutral-50 cursor-pointer",
                                                    selectedPeriod === period
                                                        ? "text-primary-300 font-semibold"
                                                        : "text-neutral-400"
                                                )}
                                            >
                                                {period}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="w-full relative pt-4">
                        {/* Interactive Floating Tooltip */}
                        {safeActiveIndex !== null && chartData[safeActiveIndex] && (
                            <div
                                className="absolute top-0 z-10 bg-white rounded-xl shadow-[0_4px_16px_rgba(37,99,235,0.12)] border border-primary-200 px-4 py-2.5 flex flex-col gap-1 transition-all duration-200 pointer-events-none"
                                style={{
                                    left: `clamp(10px, ${
                                        (safeActiveIndex / Math.max(chartData.length - 1, 1)) * 72 + 6
                                    }%, calc(100% - 190px))`,
                                }}
                            >
                                <div className="flex items-center justify-between gap-3 text-xs">
                                    <span className="text-neutral-350">Practice Sessions:</span>
                                    <span className="font-semibold text-neutral-500">
                                        {chartData[safeActiveIndex].practiceSessions}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3 text-xs">
                                    <span className="text-neutral-350">Daily Signups:</span>
                                    <span className="font-semibold text-neutral-500">
                                        {chartData[safeActiveIndex].dailyActiveUsers}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Stacked Bars Container */}
                        <div className="w-full h-[270px] flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-6 pt-16 border-b border-neutral-100/60">
                            {chartData.map((item, index) => {
                                const isActive = safeActiveIndex === index;
                                return (
                                    <div
                                        key={`${item.day}-${index}`}
                                        onMouseEnter={() => setActiveDayIndex(index)}
                                        onClick={() => setActiveDayIndex(index)}
                                        className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                                    >
                                        {/* Bar wrapper */}
                                        <div
                                            className={cn(
                                                "w-full max-w-[56px] flex flex-col justify-end transition-transform duration-200",
                                                isActive ? "scale-y-[1.01]" : "group-hover:opacity-90"
                                            )}
                                            style={{
                                                height: `${Math.min(item.sessionsHeight + item.activeHeight, 100)}%`,
                                            }}
                                        >
                                            {/* Top segment: Daily Signups / Active (Light Blue) */}
                                            <div
                                                className="w-full bg-primary-100 rounded-t-[3px] transition-colors"
                                                style={{
                                                    height: `${
                                                        ((item.activeHeight) /
                                                            Math.max(item.sessionsHeight + item.activeHeight, 1)) *
                                                        100
                                                    }%`,
                                                }}
                                            />
                                            {/* Bottom segment: Practice Sessions / Exams (Primary Blue) */}
                                            <div
                                                className="w-full bg-primary-300 transition-colors"
                                                style={{
                                                    height: `${
                                                        ((item.sessionsHeight) /
                                                            Math.max(item.sessionsHeight + item.activeHeight, 1)) *
                                                        100
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* X-Axis Day Labels */}
                        <div className="w-full flex items-center justify-between gap-2 sm:gap-4 px-2 sm:px-6 pt-3">
                            {chartData.map((item, index) => (
                                <div
                                    key={`${item.day}-label-${index}`}
                                    className="flex-1 text-center cursor-pointer"
                                    onClick={() => setActiveDayIndex(index)}
                                    onMouseEnter={() => setActiveDayIndex(index)}
                                >
                                    <CustomText
                                        type="body-sm"
                                        className={cn(
                                            "text-xs font-semibold tracking-wider transition-colors",
                                            safeActiveIndex === index
                                                ? "text-primary-300 font-bold"
                                                : "text-neutral-250"
                                        )}
                                    >
                                        {item.day}
                                    </CustomText>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chart Legend */}
                    <div className="w-full flex items-center gap-6 pt-6">
                        <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-[2px] bg-primary-100 shrink-0" />
                            <CustomText type="body-sm" className="text-neutral-400 text-xs font-normal">
                                Daily Signups
                            </CustomText>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-[2px] bg-primary-300 shrink-0" />
                            <CustomText type="body-sm" className="text-neutral-400 text-xs font-normal">
                                Practice & Exam Sessions
                            </CustomText>
                        </div>
                    </div>
                </div>

                {/* Right: Recent Activities & Quick Actions */}
                <div className="w-full flex flex-col">
                    {/* Recent Activities Section */}
                    <div>
                        <CustomText
                            type="title-md"
                            className="font-semibold text-neutral-500 text-lg mb-3"
                        >
                            Recent Activities
                        </CustomText>
                        <div className="w-full bg-white rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col divide-y divide-neutral-100">
                            {recentActivities.map((activity, index) => (
                                <div
                                    key={index}
                                    className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3"
                                >
                                    <CustomText
                                        type="body-sm"
                                        className="text-neutral-500 text-[13px] sm:text-sm font-normal truncate"
                                    >
                                        {activity.title}
                                    </CustomText>
                                    <CustomText
                                        type="body-sm"
                                        className="text-neutral-250 text-xs shrink-0"
                                    >
                                        {activity.time}
                                    </CustomText>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions Section */}
                    <div className="mt-7">
                        <CustomText
                            type="title-md"
                            className="font-semibold text-neutral-500 text-lg mb-3"
                        >
                            Quick Actions
                        </CustomText>
                        <div className="w-full flex flex-col gap-3.5">
                            <button
                                type="button"
                                onClick={() => router.push("/dashboard/question")}
                                className="w-full h-14 bg-secondary-250 text-neutral-500 rounded-2xl px-6 flex items-center text-left font-semibold text-sm transition-all duration-200 hover:brightness-95 active:scale-[0.99] cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                            >
                                <CustomText
                                    type="body-md"
                                    className="font-semibold text-neutral-500"
                                >
                                    Import Questions
                                </CustomText>
                            </button>

                            <button
                                type="button"
                                onClick={() => router.push("/dashboard/home")}
                                className="w-full h-14 bg-primary-150 text-neutral-500 rounded-2xl px-6 flex items-center text-left font-semibold text-sm transition-all duration-200 hover:brightness-95 active:scale-[0.99] cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                            >
                                <CustomText
                                    type="body-md"
                                    className="font-semibold text-neutral-500"
                                >
                                    Add Admin
                                </CustomText>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
