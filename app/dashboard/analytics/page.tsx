"use client";

import { useState } from "react";
import { ArrowDown2, ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";
import { CustomText } from "@/components/ui";
import { cn } from "@/lib/utils";

interface ChartDay {
    day: string;
    newUsers: number;
    activeUsers: number;
    newHeight: number;
    activeHeight: number;
}

interface SubjectPerformance {
    name: string;
    score: number;
    status: "attention" | "strong" | "stable";
}

const chartData: ChartDay[] = [
    {
        day: "SUN",
        newUsers: 400,
        activeUsers: 800,
        newHeight: 48,
        activeHeight: 22,
    },
    {
        day: "MON",
        newUsers: 550,
        activeUsers: 900,
        newHeight: 68,
        activeHeight: 22,
    },
    {
        day: "TUE",
        newUsers: 300,
        activeUsers: 750,
        newHeight: 35,
        activeHeight: 35,
    },
    {
        day: "WED",
        newUsers: 220,
        activeUsers: 950,
        newHeight: 22,
        activeHeight: 58,
    },
    {
        day: "THU",
        newUsers: 650,
        activeUsers: 850,
        newHeight: 75,
        activeHeight: 20,
    },
    {
        day: "FRI",
        newUsers: 480,
        activeUsers: 800,
        newHeight: 58,
        activeHeight: 24,
    },
    {
        day: "SAT",
        newUsers: 320,
        activeUsers: 750,
        newHeight: 38,
        activeHeight: 24,
    },
];

const weakestTopics = [
    {
        id: 1,
        title: "Topic 1",
        accuracy: "42% Avg Accuracy",
    },
    {
        id: 2,
        title: "Topic 2",
        accuracy: "42% Avg Accuracy",
    },
    {
        id: 3,
        title: "Topic 3",
        accuracy: "42% Avg Accuracy",
    },
];

const subjectsData: SubjectPerformance[] = [
    {
        name: "English Language",
        score: 60,
        status: "stable",
    },
    {
        name: "Mathematics",
        score: 60,
        status: "stable",
    },
    {
        name: "Biology",
        score: 95,
        status: "strong",
    },
    {
        name: "Physics",
        score: 35,
        status: "attention",
    },
    {
        name: "Chemistry",
        score: 72,
        status: "stable",
    },
    {
        name: "Economics",
        score: 88,
        status: "strong",
    },
];

export default function AnalyticsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState("7 days");
    const [isPeriodOpen, setIsPeriodOpen] = useState(false);

    const [selectedTopicExam, setSelectedTopicExam] = useState("WAEC");
    const [isTopicExamOpen, setIsTopicExamOpen] = useState(false);

    const [selectedSubjectExam, setSelectedSubjectExam] = useState("WAEC");
    const [isSubjectExamOpen, setIsSubjectExamOpen] = useState(false);

    const [activeDayIndex, setActiveDayIndex] = useState<number>(0); // SUN selected by default to match tooltip
    const [subjectPageIndex, setSubjectPageIndex] = useState(0);

    const periodOptions = ["7 days", "14 days", "30 days", "3 months"];
    const examOptions = ["WAEC", "JAMB", "NECO"];

    const displayedSubjects = subjectsData.slice(
        subjectPageIndex * 4,
        subjectPageIndex * 4 + 4
    );

    return (
        <section className="w-full flex flex-col gap-8 pb-12">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                {/* ================= LEFT COLUMN ================= */}
                <div className="w-full lg:col-span-7 flex flex-col gap-7">
                    {/* Student Growth & Retention Header & Chart */}
                    <div className="w-full flex flex-col gap-4">
                        {/* Title Row with 7-days Filter */}
                        <div className="w-full flex items-start justify-between gap-4">
                            <div>
                                <CustomText
                                    type="headline-sm"
                                    className="font-medium text-neutral-500 text-2xl lg:text-[26px] tracking-tight"
                                >
                                    Student Growth & Retention
                                </CustomText>
                                <CustomText
                                    type="body-md"
                                    className="text-neutral-350 text-xs sm:text-sm font-normal mt-1"
                                >
                                    Registration trends and active user daily trajectory.
                                </CustomText>
                            </div>

                            {/* Period Dropdown */}
                            <div className="relative shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsPeriodOpen(!isPeriodOpen)}
                                    className="flex items-center gap-3 border border-neutral-300 rounded-xl px-3.5 py-1.5 text-neutral-500 bg-white hover:border-neutral-400 transition-colors cursor-pointer text-sm"
                                >
                                    <span className="font-medium text-xs sm:text-sm">
                                        {selectedPeriod}
                                    </span>
                                    <span className="w-5 h-5 rounded-full border border-neutral-400 flex items-center justify-center shrink-0">
                                        <ArrowDown2 size={10} className="text-neutral-500" />
                                    </span>
                                </button>

                                {isPeriodOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-20"
                                            onClick={() => setIsPeriodOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-neutral-100 py-1.5 z-30 flex flex-col">
                                            {periodOptions.map((opt) => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedPeriod(opt);
                                                        setIsPeriodOpen(false);
                                                    }}
                                                    className={cn(
                                                        "w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-neutral-50 cursor-pointer",
                                                        selectedPeriod === opt
                                                            ? "text-primary-300 font-semibold"
                                                            : "text-neutral-500"
                                                    )}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Chart Card */}
                        <div className="w-full bg-white rounded-2xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                            <div className="w-full relative pt-4">
                                {/* Floating Tooltip */}
                                {activeDayIndex !== null && chartData[activeDayIndex] && (
                                    <div
                                        className="absolute top-0 z-10 bg-white rounded-xl shadow-[0_4px_16px_rgba(37,99,235,0.12)] border border-primary-200 px-4 py-2.5 flex flex-col gap-1 transition-all duration-200 pointer-events-none"
                                        style={{
                                            left: `clamp(8px, ${
                                                (activeDayIndex / (chartData.length - 1)) * 72 + 4
                                            }%, calc(100% - 170px))`,
                                        }}
                                    >
                                        <div className="flex items-center justify-between gap-3 text-xs">
                                            <span className="text-neutral-350">New Users:</span>
                                            <span className="font-semibold text-neutral-500">
                                                {chartData[activeDayIndex].newUsers}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3 text-xs">
                                            <span className="text-neutral-350">Active Users:</span>
                                            <span className="font-semibold text-neutral-500">
                                                {chartData[activeDayIndex].activeUsers}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Stacked Bars */}
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
                                                <div
                                                    className={cn(
                                                        "w-full max-w-[56px] flex flex-col justify-end transition-transform duration-200",
                                                        isActive
                                                            ? "scale-y-[1.01]"
                                                            : "group-hover:opacity-90"
                                                    )}
                                                    style={{
                                                        height: `${item.newHeight + item.activeHeight}%`,
                                                    }}
                                                >
                                                    {/* Top segment: Active Users (Light Blue) */}
                                                    <div
                                                        className="w-full bg-primary-100 rounded-t-[3px] transition-colors"
                                                        style={{
                                                            height: `${
                                                                (item.activeHeight /
                                                                    (item.newHeight + item.activeHeight)) *
                                                                100
                                                            }%`,
                                                        }}
                                                    />
                                                    {/* Bottom segment: New Users (Primary Blue) */}
                                                    <div
                                                        className="w-full bg-primary-300 transition-colors"
                                                        style={{
                                                            height: `${
                                                                (item.newHeight /
                                                                    (item.newHeight + item.activeHeight)) *
                                                                100
                                                            }%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* X-Axis Labels */}
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
                                    <CustomText
                                        type="body-sm"
                                        className="text-neutral-400 text-xs font-normal"
                                    >
                                        Active Users
                                    </CustomText>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <span className="w-2.5 h-2.5 rounded-[2px] bg-primary-300 shrink-0" />
                                    <CustomText
                                        type="body-sm"
                                        className="text-neutral-400 text-xs font-normal"
                                    >
                                        New Users
                                    </CustomText>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weakest Topics Section */}
                    <div className="w-full flex flex-col gap-4">
                        <div className="w-full flex items-center justify-between">
                            <CustomText
                                type="title-lg"
                                className="font-semibold text-neutral-500 text-xl lg:text-[22px]"
                            >
                                Weakest Topics
                            </CustomText>

                            {/* Exam Filter Dropdown */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsTopicExamOpen(!isTopicExamOpen)}
                                    className="flex items-center gap-3 border border-neutral-300 rounded-xl px-3.5 py-1.5 text-neutral-500 bg-white hover:border-neutral-400 transition-colors cursor-pointer text-sm"
                                >
                                    <span className="font-medium text-xs sm:text-sm">
                                        {selectedTopicExam}
                                    </span>
                                    <span className="w-5 h-5 rounded-full border border-neutral-400 flex items-center justify-center shrink-0">
                                        <ArrowDown2 size={10} className="text-neutral-500" />
                                    </span>
                                </button>

                                {isTopicExamOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-20"
                                            onClick={() => setIsTopicExamOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-neutral-100 py-1.5 z-30 flex flex-col">
                                            {examOptions.map((opt) => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedTopicExam(opt);
                                                        setIsTopicExamOpen(false);
                                                    }}
                                                    className={cn(
                                                        "w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-neutral-50 cursor-pointer",
                                                        selectedTopicExam === opt
                                                            ? "text-primary-300 font-semibold"
                                                            : "text-neutral-500"
                                                    )}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* List of Weakest Topics */}
                        <div className="w-full flex flex-col gap-3.5">
                            {weakestTopics.map((item) => (
                                <div
                                    key={item.id}
                                    className="w-full bg-white border border-neutral-100 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-1 transition-all hover:border-neutral-200"
                                >
                                    <CustomText
                                        type="body-lg-bold"
                                        className="font-bold text-neutral-500 text-sm"
                                    >
                                        {item.title}
                                    </CustomText>
                                    <CustomText
                                        type="body-sm"
                                        className="text-neutral-350 text-xs font-normal"
                                    >
                                        {item.accuracy}
                                    </CustomText>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ================= RIGHT COLUMN ================= */}
                <div className="w-full lg:col-span-5 flex flex-col gap-7">
                    {/* Rewards and Engagement Section */}
                    <div className="w-full flex flex-col gap-4">
                        <CustomText
                            type="title-lg"
                            className="font-semibold text-neutral-500 text-xl lg:text-[22px]"
                        >
                            Rewards and Engagement
                        </CustomText>

                        <div className="w-full bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-6">
                            {/* 2 Stat Cards */}
                            <div className="w-full grid grid-cols-2 gap-4">
                                {/* PrepPoints Used */}
                                <div className="bg-[#eaeffa] rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[96px]">
                                    <CustomText
                                        type="body-sm"
                                        className="text-neutral-400 text-xs font-medium"
                                    >
                                        PrepPoints Used
                                    </CustomText>
                                    <CustomText
                                        type="headline-lg"
                                        className="font-bold text-neutral-500 text-2xl tracking-tight mt-2"
                                    >
                                        2.2M
                                    </CustomText>
                                </div>

                                {/* Credits Redeemed */}
                                <div className="bg-[#eafaf5] rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[96px]">
                                    <CustomText
                                        type="body-sm"
                                        className="text-neutral-400 text-xs font-medium"
                                    >
                                        Credits Redeemed
                                    </CustomText>
                                    <CustomText
                                        type="headline-lg"
                                        className="font-bold text-neutral-500 text-2xl tracking-tight mt-2"
                                    >
                                        500k
                                    </CustomText>
                                </div>
                            </div>

                            {/* Trending Badges */}
                            <div className="flex flex-col gap-3">
                                <CustomText
                                    type="body-sm"
                                    className="text-neutral-400 text-xs font-medium"
                                >
                                    Trending Badges
                                </CustomText>
                                <div className="flex items-center gap-3">
                                    {/* Red Rosette % Badge */}
                                    <svg
                                        width="38"
                                        height="38"
                                        viewBox="0 0 44 44"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M22 2L25.8 5.6L30.9 4.3L33.3 8.9L38.4 9.8L38.7 15L43 18L41.1 22.9L43.4 27.6L39.4 30.9L39.5 36.1L34.5 37.3L32.4 42L27.2 41L23.7 44.8L19.7 41.5L14.5 42.9L12.1 38.3L7 37.4L6.7 32.2L2.4 29.2L4.3 24.3L2 19.6L6 16.3L5.9 11.1L10.9 9.9L13 5.2L18.2 6.2L21.7 2.4L22 2Z"
                                            fill="#DC2626"
                                        />
                                        <path
                                            d="M17.5 18C17.5 16.9 18.4 16 19.5 16C20.6 16 21.5 16.9 21.5 18C21.5 19.1 20.6 20 19.5 20C18.4 20 17.5 19.1 17.5 18ZM25.5 16L18.5 28M22.5 26C22.5 24.9 23.4 24 24.5 24C25.6 24 26.5 24.9 26.5 26C26.5 27.1 25.6 28 24.5 28C23.4 28 22.5 27.1 22.5 26Z"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>

                                    {/* Gold Shield Badge with Ribbons */}
                                    <svg
                                        width="38"
                                        height="38"
                                        viewBox="0 0 36 36"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 22L8 33L18 29L28 33L25 22"
                                            fill="#E11D48"
                                        />
                                        <path
                                            d="M18 4L28 7V16C28 22.5 23.5 27 18 29C12.5 27 8 22.5 8 16V7L18 4Z"
                                            fill="#F59E0B"
                                        />
                                        <path
                                            d="M18 6.5L26 9V16C26 21.2 22.3 25 18 26.8C13.7 25 10 21.2 10 16V9L18 6.5Z"
                                            fill="#FBBF24"
                                        />
                                        <path
                                            d="M18 11L19.8 14.8L24 15.4L21 18.3L21.7 22.5L18 20.5L14.3 22.5L15 18.3L12 15.4L16.2 14.8L18 11Z"
                                            fill="#FEF3C7"
                                        />
                                    </svg>

                                    {/* Red "NEW" Rosette Sticker */}
                                    <svg
                                        width="38"
                                        height="38"
                                        viewBox="0 0 44 44"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M22 2L25.8 5.6L30.9 4.3L33.3 8.9L38.4 9.8L38.7 15L43 18L41.1 22.9L43.4 27.6L39.4 30.9L39.5 36.1L34.5 37.3L32.4 42L27.2 41L23.7 44.8L19.7 41.5L14.5 42.9L12.1 38.3L7 37.4L6.7 32.2L2.4 29.2L4.3 24.3L2 19.6L6 16.3L5.9 11.1L10.9 9.9L13 5.2L18.2 6.2L21.7 2.4L22 2Z"
                                            fill="#DC2626"
                                        />
                                        <text
                                            x="22"
                                            y="27"
                                            textAnchor="middle"
                                            fill="#FBBF24"
                                            fontSize="11"
                                            fontWeight="bold"
                                            fontFamily="sans-serif"
                                        >
                                            NEW
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subject Performance Section */}
                    <div className="w-full bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                        {/* Header Row with WAEC Filter */}
                        <div className="w-full flex items-center justify-between">
                            <CustomText
                                type="title-lg"
                                className="font-semibold text-neutral-500 text-lg sm:text-xl"
                            >
                                Subject Performance
                            </CustomText>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsSubjectExamOpen(!isSubjectExamOpen)}
                                    className="flex items-center gap-3 border border-neutral-300 rounded-xl px-3.5 py-1.5 text-neutral-500 bg-white hover:border-neutral-400 transition-colors cursor-pointer text-sm"
                                >
                                    <span className="font-medium text-xs sm:text-sm">
                                        {selectedSubjectExam}
                                    </span>
                                    <span className="w-5 h-5 rounded-full border border-neutral-400 flex items-center justify-center shrink-0">
                                        <ArrowDown2 size={10} className="text-neutral-500" />
                                    </span>
                                </button>

                                {isSubjectExamOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-20"
                                            onClick={() => setIsSubjectExamOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-neutral-100 py-1.5 z-30 flex flex-col">
                                            {examOptions.map((opt) => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedSubjectExam(opt);
                                                        setIsSubjectExamOpen(false);
                                                    }}
                                                    className={cn(
                                                        "w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-neutral-50 cursor-pointer",
                                                        selectedSubjectExam === opt
                                                            ? "text-primary-300 font-semibold"
                                                            : "text-neutral-500"
                                                    )}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Status Legend Row */}
                        <div className="w-full flex items-center justify-end gap-3 text-[11px] pt-1">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-[2px] bg-error-300 shrink-0" />
                                <span className="text-neutral-350">Needs Attention</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-[2px] bg-secondary-350 shrink-0" />
                                <span className="text-neutral-350">Strong Performance</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-[2px] bg-primary-300 shrink-0" />
                                <span className="text-neutral-350">Stable</span>
                            </div>
                        </div>

                        {/* 2x2 Grid of Subject Performance Cards */}
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                            {displayedSubjects.map((subj) => {
                                const isAttention = subj.status === "attention";
                                const isStrong = subj.status === "strong";

                                const textColor = isAttention
                                    ? "text-error-300"
                                    : isStrong
                                      ? "text-secondary-350"
                                      : "text-primary-300";

                                const barColor = isAttention
                                    ? "bg-error-300"
                                    : isStrong
                                      ? "bg-secondary-350"
                                      : "bg-primary-300";

                                return (
                                    <div
                                        key={subj.name}
                                        className="border border-neutral-100 rounded-2xl p-4 bg-white flex flex-col justify-between"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <CustomText
                                                type="body-sm"
                                                className="text-neutral-500 font-medium text-xs sm:text-sm truncate"
                                            >
                                                {subj.name}
                                            </CustomText>
                                            <span
                                                className={cn(
                                                    "font-bold text-xs sm:text-sm shrink-0",
                                                    textColor
                                                )}
                                            >
                                                {subj.score}%
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden mt-3.5">
                                            <div
                                                className={cn("h-full rounded-full", barColor)}
                                                style={{ width: `${subj.score}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Carousel Arrows */}
                        <div className="w-full flex items-center justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setSubjectPageIndex((p) => Math.max(0, p - 1))
                                }
                                disabled={subjectPageIndex === 0}
                                className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-400 hover:text-neutral-500 hover:border-neutral-400 transition-colors disabled:opacity-40 cursor-pointer"
                            >
                                <ArrowLeft2 size={12} />
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    setSubjectPageIndex((p) =>
                                        (p + 1) * 4 < subjectsData.length ? p + 1 : p
                                    )
                                }
                                disabled={(subjectPageIndex + 1) * 4 >= subjectsData.length}
                                className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-400 hover:text-neutral-500 hover:border-neutral-400 transition-colors disabled:opacity-40 cursor-pointer"
                            >
                                <ArrowRight2 size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}