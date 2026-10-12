"use client";

import { useState } from "react";
import Image from "next/image";
import {
    SearchNormal1,
    ArrowDown2,
    ArrowLeft2,
    ArrowRight2,
    More,
    CloseCircle,
    Award,
} from "iconsax-reactjs";
import { CustomText } from "@/components/ui";
import { cn } from "@/lib/utils";

interface Student {
    id: string;
    name: string;
    username: string;
    email: string;
    phone: string;
    exams: string;
    examTypes: string[];
    goals: { exam: string; goal: string }[];
    preppoints: string;
    lastActive: string;
    plan: string;
    isPaid: boolean;
    lastLogin: string;
    avatar: string;
}

const summaryCards = [
    {
        title: "Total Students",
        number: "45,200",
    },
    {
        title: "Active Students",
        number: "12,850",
    },
    {
        title: "New (Last 30 Days)",
        number: "245",
    },
];

const mockStudents: Student[] = [
    {
        id: "1",
        name: "Jane Doe",
        username: "@jane123",
        email: "janedoe@gmail.com",
        phone: "+2348066641977",
        exams: "JAMB +1 more",
        examTypes: ["WAEC", "JAMB"],
        goals: [
            { exam: "WAEC", goal: "Get at least 5 A's" },
            { exam: "JAMB", goal: "Score 350+" },
        ],
        preppoints: "4000",
        lastActive: "2hr ago",
        plan: "Free Plan",
        isPaid: false,
        lastLogin: "2 days ago",
        avatar: "/images/landing/hero1.png",
    },
    {
        id: "2",
        name: "John Doe",
        username: "@johndoe",
        email: "johndoe@gmail.com",
        phone: "+2348012345678",
        exams: "WAEC +2 more",
        examTypes: ["WAEC", "NECO", "JAMB"],
        goals: [
            { exam: "WAEC", goal: "Get at least 6 A's" },
            { exam: "JAMB", goal: "Score 320+" },
        ],
        preppoints: "4000",
        lastActive: "2hr ago",
        plan: "Paid User",
        isPaid: true,
        lastLogin: "1 day ago",
        avatar: "/images/landing/hero2.png",
    },
    {
        id: "3",
        name: "John Doe",
        username: "@johndoe2",
        email: "johndoe@gmail.com",
        phone: "+2348098765432",
        exams: "WAEC +2 more",
        examTypes: ["WAEC", "JAMB"],
        goals: [
            { exam: "WAEC", goal: "Pass all papers" },
            { exam: "JAMB", goal: "Score 300+" },
        ],
        preppoints: "4000",
        lastActive: "2hr ago",
        plan: "Free Plan",
        isPaid: false,
        lastLogin: "3 days ago",
        avatar: "/images/landing/hero3.png",
    },
    {
        id: "4",
        name: "John Doe",
        username: "@johndoe3",
        email: "johndoe@gmail.com",
        phone: "+2348055512345",
        exams: "WAEC +2 more",
        examTypes: ["WAEC", "JAMB"],
        goals: [
            { exam: "WAEC", goal: "Get at least 5 A's" },
            { exam: "JAMB", goal: "Score 350+" },
        ],
        preppoints: "4000",
        lastActive: "2hr ago",
        plan: "Paid User",
        isPaid: true,
        lastLogin: "5 hours ago",
        avatar: "/images/landing/hero1.png",
    },
    {
        id: "5",
        name: "John Doe",
        username: "@johndoe4",
        email: "johndoe@gmail.com",
        phone: "+2348077798765",
        exams: "WAEC +2 more",
        examTypes: ["WAEC", "NECO"],
        goals: [
            { exam: "WAEC", goal: "Get distinction in Math" },
            { exam: "NECO", goal: "Score 9 Credits" },
        ],
        preppoints: "4000",
        lastActive: "2hr ago",
        plan: "Free Plan",
        isPaid: false,
        lastLogin: "2 days ago",
        avatar: "/images/landing/hero2.png",
    },
    {
        id: "6",
        name: "James Doe",
        username: "@jamesdoe",
        email: "jamesdoe@gmail.com",
        phone: "+2348033344455",
        exams: "JAMB +2 more",
        examTypes: ["JAMB", "WAEC", "NECO"],
        goals: [
            { exam: "JAMB", goal: "Score 340+" },
            { exam: "WAEC", goal: "Get at least 7 A's" },
        ],
        preppoints: "4000",
        lastActive: "2hr ago",
        plan: "Paid User",
        isPaid: true,
        lastLogin: "4 hours ago",
        avatar: "/images/landing/hero3.png",
    },
];

function RosetteBadgeIcon({ muted = false }: { muted?: boolean }) {
    return (
        <svg
            width="40"
            height="40"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M22 2L25.8 5.6L30.9 4.3L33.3 8.9L38.4 9.8L38.7 15L43 18L41.1 22.9L43.4 27.6L39.4 30.9L39.5 36.1L34.5 37.3L32.4 42L27.2 41L23.7 44.8L19.7 41.5L14.5 42.9L12.1 38.3L7 37.4L6.7 32.2L2.4 29.2L4.3 24.3L2 19.6L6 16.3L5.9 11.1L10.9 9.9L13 5.2L18.2 6.2L21.7 2.4L22 2Z"
                fill={muted ? "#FCE4E4" : "#DC2626"}
            />
            <path
                d="M17.5 18C17.5 16.9 18.4 16 19.5 16C20.6 16 21.5 16.9 21.5 18C21.5 19.1 20.6 20 19.5 20C18.4 20 17.5 19.1 17.5 18ZM25.5 16L18.5 28M22.5 26C22.5 24.9 23.4 24 24.5 24C25.6 24 26.5 24.9 26.5 26C26.5 27.1 25.6 28 24.5 28C23.4 28 22.5 27.1 22.5 26Z"
                stroke={muted ? "#F87171" : "white"}
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default function StudentPage() {
    const [students, setStudents] = useState<Student[]>(mockStudents);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedExam, setSelectedExam] = useState("All Exams");
    const [selectedPlan, setSelectedPlan] = useState("Paid Users");
    const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false);
    const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const examOptions = ["All Exams", "JAMB", "WAEC", "NECO"];
    const planOptions = ["All Users", "Paid Users", "Free Plan"];

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedExam("All Exams");
        setSelectedPlan("All Users");
    };

    const handleRemoveUser = (id: string) => {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        setSelectedStudent(null);
    };

    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesExam =
            selectedExam === "All Exams" ||
            student.exams.toLowerCase().includes(selectedExam.toLowerCase());

        const matchesPlan =
            selectedPlan === "All Users" ||
            (selectedPlan === "Paid Users" && student.isPaid) ||
            (selectedPlan === "Free Plan" && !student.isPaid);

        return matchesSearch && matchesExam && matchesPlan;
    });

    return (
        <section className="w-full flex flex-col gap-8 pb-12">
            {/* Header Title */}
            <CustomText
                type="headline-sm"
                className="font-medium text-neutral-500 text-2xl lg:text-[26px] tracking-tight"
            >
                Student Management
            </CustomText>

            {/* Top 3 Metric Cards */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                {summaryCards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[120px]"
                    >
                        <CustomText
                            type="body-sm"
                            className="text-neutral-350 text-xs font-normal"
                        >
                            {card.title}
                        </CustomText>
                        <CustomText
                            type="headline-lg"
                            className="font-semibold text-neutral-500 text-[32px] leading-tight my-2 tracking-tight"
                        >
                            {card.number}
                        </CustomText>
                    </div>
                ))}
            </div>

            {/* Students Section */}
            <div className="w-full flex flex-col gap-4">
                <CustomText
                    type="title-lg"
                    className="font-semibold text-neutral-500 text-xl lg:text-[22px]"
                >
                    Students
                </CustomText>

                {/* Filter and Search Bar */}
                <div className="w-full flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="relative w-full max-w-sm">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <SearchNormal1 size={18} className="text-neutral-300" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-neutral-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-500 placeholder:text-neutral-300 focus:outline-none focus:border-primary-300 transition-colors"
                        />
                    </div>

                    {/* Filter Dropdowns & Clear Button */}
                    <div className="flex flex-wrap items-center gap-3">
                        <CustomText type="body-sm" className="text-neutral-400 text-sm font-normal">
                            Filter by:
                        </CustomText>

                        {/* Exam Filter Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsExamDropdownOpen(!isExamDropdownOpen);
                                    setIsPlanDropdownOpen(false);
                                }}
                                className="flex items-center gap-3 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-500 bg-white hover:border-neutral-400 transition-colors cursor-pointer text-sm"
                            >
                                <span className="font-medium text-xs sm:text-sm">{selectedExam}</span>
                                <span className="w-5 h-5 rounded-full border border-neutral-400 flex items-center justify-center shrink-0">
                                    <ArrowDown2 size={10} className="text-neutral-500" />
                                </span>
                            </button>

                            {isExamDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-20"
                                        onClick={() => setIsExamDropdownOpen(false)}
                                    />
                                    <div className="absolute left-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-neutral-100 py-1.5 z-30 flex flex-col">
                                        {examOptions.map((opt) => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedExam(opt);
                                                    setIsExamDropdownOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-neutral-50 cursor-pointer",
                                                    selectedExam === opt
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

                        {/* Plan Filter Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsPlanDropdownOpen(!isPlanDropdownOpen);
                                    setIsExamDropdownOpen(false);
                                }}
                                className="flex items-center gap-3 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-500 bg-white hover:border-neutral-400 transition-colors cursor-pointer text-sm"
                            >
                                <span className="font-medium text-xs sm:text-sm">{selectedPlan}</span>
                                <span className="w-5 h-5 rounded-full border border-neutral-400 flex items-center justify-center shrink-0">
                                    <ArrowDown2 size={10} className="text-neutral-500" />
                                </span>
                            </button>

                            {isPlanDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-20"
                                        onClick={() => setIsPlanDropdownOpen(false)}
                                    />
                                    <div className="absolute left-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-neutral-100 py-1.5 z-30 flex flex-col">
                                        {planOptions.map((opt) => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPlan(opt);
                                                    setIsPlanDropdownOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-neutral-50 cursor-pointer",
                                                    selectedPlan === opt
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

                        {/* Clear Filters Action */}
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="text-primary-300 font-semibold text-xs sm:text-sm hover:underline cursor-pointer ml-1"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="w-full bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100 mt-2">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr className="bg-primary-100 h-13">
                                    <th className="px-6 py-4 text-left font-semibold text-xs text-neutral-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-4 text-left font-semibold text-xs text-neutral-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left font-semibold text-xs text-neutral-500 uppercase tracking-wider">
                                        Exams
                                    </th>
                                    <th className="px-6 py-4 text-left font-semibold text-xs text-neutral-500 uppercase tracking-wider">
                                        Preppoints
                                    </th>
                                    <th className="px-6 py-4 text-left font-semibold text-xs text-neutral-500 uppercase tracking-wider">
                                        Last Active
                                    </th>
                                    <th className="px-6 py-4 text-center font-semibold text-xs text-neutral-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100/60">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((row) => (
                                        <tr
                                            key={row.id}
                                            onClick={() => setSelectedStudent(row)}
                                            className="h-16 hover:bg-neutral-50/70 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <CustomText
                                                    type="body-sm"
                                                    className="font-bold text-neutral-500 text-sm"
                                                >
                                                    {row.name}
                                                </CustomText>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <CustomText
                                                    type="body-sm"
                                                    className="text-neutral-450 text-sm font-normal"
                                                >
                                                    {row.email}
                                                </CustomText>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <CustomText
                                                    type="body-sm"
                                                    className="text-neutral-450 text-sm font-normal"
                                                >
                                                    {row.exams}
                                                </CustomText>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <CustomText
                                                    type="body-sm"
                                                    className="text-neutral-450 text-sm font-normal"
                                                >
                                                    {row.preppoints}
                                                </CustomText>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <CustomText
                                                    type="body-sm"
                                                    className="text-neutral-450 text-sm font-normal"
                                                >
                                                    {row.lastActive}
                                                </CustomText>
                                            </td>
                                            <td
                                                className="px-6 py-4 whitespace-nowrap text-center"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedStudent(row);
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    className="w-8 h-8 rounded-full border border-neutral-300 inline-flex items-center justify-center text-neutral-400 hover:text-neutral-500 hover:border-neutral-400 transition-colors cursor-pointer"
                                                >
                                                    <More size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-12 text-center text-neutral-350 text-sm"
                                        >
                                            No students found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Controls */}
                <div className="w-full flex items-center justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-400 hover:text-neutral-500 hover:border-neutral-400 transition-colors disabled:opacity-40 cursor-pointer"
                    >
                        <ArrowLeft2 size={12} />
                    </button>

                    <button
                        type="button"
                        onClick={() => setCurrentPage(1)}
                        className="w-6 h-6 rounded-md bg-primary-300 text-white flex items-center justify-center text-xs font-semibold"
                    >
                        1
                    </button>

                    <button
                        type="button"
                        onClick={() => setCurrentPage(2)}
                        className="w-6 h-6 rounded-md text-neutral-400 hover:text-neutral-500 flex items-center justify-center text-xs font-medium"
                    >
                        2
                    </button>

                    <button
                        type="button"
                        onClick={() => setCurrentPage(3)}
                        className="w-6 h-6 rounded-md text-neutral-400 hover:text-neutral-500 flex items-center justify-center text-xs font-medium"
                    >
                        3
                    </button>

                    <span className="text-neutral-300 text-xs px-1">...</span>

                    <button
                        type="button"
                        onClick={() => setCurrentPage(112)}
                        className="w-6 h-6 rounded-md text-neutral-400 hover:text-neutral-500 flex items-center justify-center text-xs font-medium"
                    >
                        112
                    </button>

                    <button
                        type="button"
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-400 hover:text-neutral-500 hover:border-neutral-400 transition-colors cursor-pointer"
                    >
                        <ArrowRight2 size={12} />
                    </button>
                </div>
            </div>

            {/* Student Detail Slide-Over Drawer */}
            {selectedStudent && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-neutral-500/25 backdrop-blur-[2px] z-40 transition-opacity"
                        onClick={() => setSelectedStudent(null)}
                    />

                    {/* Slide-over Panel */}
                    <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-[540px] bg-white shadow-2xl overflow-y-auto p-6 sm:p-8 flex flex-col justify-between animate-in slide-in-from-right duration-300">
                        <div>
                            {/* Close Trigger */}
                            <div className="w-full flex justify-end pb-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedStudent(null)}
                                    className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-500 hover:border-neutral-300 transition-colors cursor-pointer"
                                >
                                    <CloseCircle size={18} />
                                </button>
                            </div>

                            {/* Profile Header Box */}
                            <div className="border border-primary-300 rounded-2xl p-4 sm:p-5 bg-white relative flex items-center justify-between gap-4 mt-1">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-16 h-16 rounded-full border-2 border-primary-300 overflow-hidden shrink-0 bg-primary-100 flex items-center justify-center">
                                        <img
                                            src={selectedStudent.avatar}
                                            alt={selectedStudent.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <CustomText
                                            type="body-lg-bold"
                                            className="text-neutral-500 font-bold text-base"
                                        >
                                            {selectedStudent.name}
                                        </CustomText>
                                        <CustomText
                                            type="body-sm"
                                            className="text-neutral-300 text-xs"
                                        >
                                            {selectedStudent.username}
                                        </CustomText>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-neutral-400 flex items-center gap-1 font-medium">
                                                <Award size={13} className="text-accent-300" />
                                                Current Badge
                                            </span>
                                            <span className="flex items-center gap-1 bg-[#eaeffa] text-primary-400 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                                                <span>🪙</span>
                                                <span>{selectedStudent.preppoints} PP</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="border border-neutral-400 rounded-full px-3 py-1 text-xs text-neutral-500 font-medium shrink-0">
                                    {selectedStudent.plan}
                                </div>
                            </div>

                            {/* Personal Info */}
                            <div className="mt-6">
                                <CustomText
                                    type="title-md"
                                    className="font-semibold text-neutral-500 text-sm mb-2.5"
                                >
                                    Personal Info
                                </CustomText>
                                <div className="grid grid-cols-2 gap-3.5">
                                    <div className="border border-neutral-100 rounded-xl p-3.5 bg-white">
                                        <CustomText
                                            type="body-sm"
                                            className="text-neutral-350 text-xs mb-1 font-normal"
                                        >
                                            Email Address
                                        </CustomText>
                                        <CustomText
                                            type="body-sm"
                                            className="text-neutral-500 font-medium text-xs sm:text-sm truncate"
                                        >
                                            {selectedStudent.email}
                                        </CustomText>
                                    </div>
                                    <div className="border border-neutral-100 rounded-xl p-3.5 bg-white">
                                        <CustomText
                                            type="body-sm"
                                            className="text-neutral-350 text-xs mb-1 font-normal"
                                        >
                                            Phone Number
                                        </CustomText>
                                        <CustomText
                                            type="body-sm"
                                            className="text-neutral-500 font-medium text-xs sm:text-sm"
                                        >
                                            {selectedStudent.phone}
                                        </CustomText>
                                    </div>
                                </div>
                            </div>

                            {/* Preferences */}
                            <div className="mt-5">
                                <CustomText
                                    type="title-md"
                                    className="font-semibold text-neutral-500 text-sm mb-2.5"
                                >
                                    Preferences
                                </CustomText>
                                <div className="border border-neutral-100 rounded-xl p-3.5 bg-white mb-3">
                                    <CustomText
                                        type="body-sm"
                                        className="text-neutral-350 text-xs mb-2 font-normal"
                                    >
                                        Exam Type
                                    </CustomText>
                                    <div className="flex flex-col gap-1">
                                        {selectedStudent.examTypes.map((type) => (
                                            <CustomText
                                                key={type}
                                                type="body-sm"
                                                className="text-neutral-500 font-medium text-xs sm:text-sm"
                                            >
                                                {type}
                                            </CustomText>
                                        ))}
                                    </div>
                                </div>
                                <div className="border border-neutral-100 rounded-xl p-3.5 bg-white">
                                    <CustomText
                                        type="body-sm"
                                        className="text-neutral-350 text-xs mb-2 font-normal"
                                    >
                                        Goals
                                    </CustomText>
                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedStudent.goals.map((g) => (
                                            <div key={g.exam}>
                                                <CustomText
                                                    type="body-sm"
                                                    className="text-neutral-500 font-bold text-xs mb-0.5"
                                                >
                                                    {g.exam}
                                                </CustomText>
                                                <CustomText
                                                    type="body-sm"
                                                    className="text-neutral-400 text-xs font-normal"
                                                >
                                                    {g.goal}
                                                </CustomText>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Exams */}
                            <div className="mt-5">
                                <CustomText
                                    type="title-md"
                                    className="font-semibold text-neutral-500 text-sm mb-2.5"
                                >
                                    Exams
                                </CustomText>
                                <div className="border border-neutral-100 rounded-xl p-3.5 bg-white mb-3">
                                    <div className="flex items-center gap-2 mb-2.5">
                                        <Image
                                            src="/images/landing/jamb.png"
                                            alt="JAMB"
                                            width={18}
                                            height={18}
                                            className="object-contain"
                                        />
                                        <CustomText
                                            type="body-sm"
                                            className="text-neutral-500 font-bold text-xs"
                                        >
                                            JAMB
                                        </CustomText>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-neutral-400 font-medium">
                                        <span>1999</span>
                                        <span>2005</span>
                                        <span>2020</span>
                                        <span>2023</span>
                                        <span>2025</span>
                                    </div>
                                </div>
                                <div className="border border-neutral-100 rounded-xl p-3.5 bg-white">
                                    <div className="flex items-center gap-2 mb-2.5">
                                        <Image
                                            src="/images/landing/waec.png"
                                            alt="WAEC"
                                            width={18}
                                            height={18}
                                            className="object-contain"
                                        />
                                        <CustomText
                                            type="body-sm"
                                            className="text-neutral-500 font-bold text-xs"
                                        >
                                            WAEC
                                        </CustomText>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-neutral-400 font-medium">
                                        <span>1999</span>
                                        <span>2005</span>
                                        <span>2020</span>
                                        <span>2023</span>
                                        <span>2025</span>
                                    </div>
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="mt-5">
                                <CustomText
                                    type="title-md"
                                    className="font-semibold text-neutral-500 text-sm mb-2.5"
                                >
                                    Badges
                                </CustomText>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-[#fafafc] border border-neutral-100 rounded-xl p-3 flex flex-col items-center text-center">
                                        <RosetteBadgeIcon />
                                        <CustomText
                                            type="body-sm"
                                            className="text-neutral-500 font-bold text-xs mt-2"
                                        >
                                            Badge Name
                                        </CustomText>
                                        <CustomText
                                            type="body-sm"
                                            className="text-neutral-350 text-[11px] mt-0.5"
                                        >
                                            How badge is earned
                                        </CustomText>
                                    </div>
                                    <div className="bg-[#fafafc] border border-neutral-100 rounded-xl p-3 flex flex-col items-center text-center">
                                        <RosetteBadgeIcon />
                                        <CustomText
                                            type="body-sm"
                                            className="text-neutral-500 font-bold text-xs mt-2"
                                        >
                                            Badge Name
                                        </CustomText>
                                        <CustomText
                                            type="body-sm"
                                            className="text-neutral-350 text-[11px] mt-0.5"
                                        >
                                            How badge is earned
                                        </CustomText>
                                    </div>
                                    <div className="bg-[#fafafc] border border-neutral-100 rounded-xl p-3 flex flex-col items-center text-center">
                                        <RosetteBadgeIcon muted />
                                        <CustomText
                                            type="body-sm"
                                            className="text-neutral-500 font-bold text-xs mt-2"
                                        >
                                            Badge Name
                                        </CustomText>
                                        <CustomText
                                            type="body-sm"
                                            className="text-neutral-350 text-[11px] mt-0.5"
                                        >
                                            How badge is earned
                                        </CustomText>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="mt-8 pt-4 flex items-center justify-between border-t border-neutral-100">
                            <CustomText type="body-sm" className="text-neutral-400 text-xs">
                                Last Login: {selectedStudent.lastLogin}
                            </CustomText>
                            <button
                                type="button"
                                onClick={() => handleRemoveUser(selectedStudent.id)}
                                className="bg-error-300 hover:bg-error-350 text-white rounded-xl px-5 py-2.5 text-xs font-semibold transition-colors cursor-pointer"
                            >
                                Remove User
                            </button>
                        </div>
                    </aside>
                </>
            )}
        </section>
    );
}