"use client";

import { useState } from "react";
import { ArrowDown2 } from "iconsax-reactjs";
import { CustomText } from "@/components/ui";
import { cn } from "@/lib/utils";

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

const statCards: StatItem[] = [
    {
        title: "Total Students",
        number: "45,200",
        perc: "2% Growth since last month",
    },
    {
        title: "Active Students",
        number: "12,850",
        perc: "28% of total student base",
    },
    {
        title: "New Sign Ups today",
        number: "245",
        perc: "Real-time tracking active",
        isHighlight: true,
    },
    {
        title: "Total Exams Taken",
        number: "70,000",
        perc: "Cumulative since inception",
    },
    {
        title: "Total Question",
        number: "18,000",
        perc: "Verified repository content",
    },
    {
        title: "Rewards Redeemed",
        number: "15,400",
        perc: "Student PrepPoints used",
    },
];

const chartData: ChartDay[] = [
    {
        day: "SUN",
        practiceSessions: "1,750",
        dailyActiveUsers: "600",
        sessionsHeight: 52,
        activeHeight: 18,
    },
    {
        day: "MON",
        practiceSessions: "2,000",
        dailyActiveUsers: "800",
        sessionsHeight: 62,
        activeHeight: 15,
    },
    {
        day: "TUE",
        practiceSessions: "1,100",
        dailyActiveUsers: "750",
        sessionsHeight: 38,
        activeHeight: 24,
    },
    {
        day: "WED",
        practiceSessions: "700",
        dailyActiveUsers: "1,550",
        sessionsHeight: 22,
        activeHeight: 48,
    },
    {
        day: "THU",
        practiceSessions: "2,450",
        dailyActiveUsers: "750",
        sessionsHeight: 74,
        activeHeight: 22,
    },
    {
        day: "FRI",
        practiceSessions: "1,800",
        dailyActiveUsers: "720",
        sessionsHeight: 55,
        activeHeight: 22,
    },
    {
        day: "SAT",
        practiceSessions: "1,150",
        dailyActiveUsers: "800",
        sessionsHeight: 38,
        activeHeight: 25,
    },
];

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
    const [selectedPeriod, setSelectedPeriod] = useState("7 days");
    const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
    const [activeDayIndex, setActiveDayIndex] = useState<number>(1); // Default to MON to match design

    const periodOptions = ["7 days", "14 days", "30 days", "3 months"];

    return (
        <section className="w-full flex flex-col gap-7 pb-10">
            {/* Header Greeting */}
            <CustomText
                type="headline-sm"
                className="font-medium text-neutral-500 text-2xl lg:text-[26px] tracking-tight"
            >
                Hello Admin!
            </CustomText>

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
                        {activeDayIndex !== null && chartData[activeDayIndex] && (
                            <div
                                className="absolute top-0 z-10 bg-white rounded-xl shadow-[0_4px_16px_rgba(37,99,235,0.12)] border border-primary-200 px-4 py-2.5 flex flex-col gap-1 transition-all duration-200 pointer-events-none"
                                style={{
                                    left: `clamp(10px, ${
                                        (activeDayIndex / (chartData.length - 1)) * 72 + 6
                                    }%, calc(100% - 190px))`,
                                }}
                            >
                                <div className="flex items-center justify-between gap-3 text-xs">
                                    <span className="text-neutral-350">Practice Sessions:</span>
                                    <span className="font-semibold text-neutral-500">
                                        {chartData[activeDayIndex].practiceSessions}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3 text-xs">
                                    <span className="text-neutral-350">Daily Active Users:</span>
                                    <span className="font-semibold text-neutral-500">
                                        {chartData[activeDayIndex].dailyActiveUsers}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Stacked Bars Container */}
                        <div className="w-full h-[270px] flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-6 pt-16 border-b border-neutral-100/60">
                            {chartData.map((item, index) => {
                                const isActive = activeDayIndex === index;
                                return (
                                    <div
                                        key={item.day}
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
                                                height: `${item.sessionsHeight + item.activeHeight}%`,
                                            }}
                                        >
                                            {/* Top segment: Daily Active Users (Light Blue) */}
                                            <div
                                                className="w-full bg-primary-100 rounded-t-[3px] transition-colors"
                                                style={{
                                                    height: `${
                                                        (item.activeHeight /
                                                            (item.sessionsHeight + item.activeHeight)) *
                                                        100
                                                    }%`,
                                                }}
                                            />
                                            {/* Bottom segment: Practice Sessions (Primary Blue) */}
                                            <div
                                                className="w-full bg-primary-300 transition-colors"
                                                style={{
                                                    height: `${
                                                        (item.sessionsHeight /
                                                            (item.sessionsHeight + item.activeHeight)) *
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
                                    key={item.day}
                                    className="flex-1 text-center cursor-pointer"
                                    onClick={() => setActiveDayIndex(index)}
                                    onMouseEnter={() => setActiveDayIndex(index)}
                                >
                                    <CustomText
                                        type="body-sm"
                                        className={cn(
                                            "text-xs font-semibold tracking-wider transition-colors",
                                            activeDayIndex === index
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
                                Daily Active Users
                            </CustomText>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-[2px] bg-primary-300 shrink-0" />
                            <CustomText type="body-sm" className="text-neutral-400 text-xs font-normal">
                                Practice Sessions
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
