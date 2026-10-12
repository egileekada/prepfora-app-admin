"use client";

import { useState } from "react";
import {
    Add,
    ArrowDown2,
    ArrowLeft2,
    ArrowRight2,
    CloseCircle,
    More,
    SearchNormal1,
} from "iconsax-reactjs";
import { CustomText } from "@/components/ui";
import { cn } from "@/lib/utils";

interface Exam {
    id: string;
    acronym: string;
    fullName: string;
    mocks: string;
    subjects: string;
}

interface QuestionItem {
    id: number;
    statement: string;
    options: { key: string; text: string; isCorrect?: boolean }[];
    theoryAnswer: string;
}

const summaryStats = [
    { title: "Total Exams", value: "5" },
    { title: "Total Questions", value: "12,850" },
    { title: "Total Subjects", value: "245" },
    { title: "Total Topics", value: "245" },
];

const initialExams: Exam[] = [
    {
        id: "waec",
        acronym: "WAEC",
        fullName: "Joint Admissions and Matriculation Board",
        mocks: "1999 - 2025",
        subjects: "18+ Subjects",
    },
    {
        id: "jamb",
        acronym: "JAMB",
        fullName: "Joint Admissions and Matriculation Board",
        mocks: "1999 - 2025",
        subjects: "18+ Subjects",
    },
    {
        id: "neco",
        acronym: "NECO",
        fullName: "Joint Admissions and Matriculation Board",
        mocks: "1999 - 2025",
        subjects: "18+ Subjects",
    },
    {
        id: "post-utme",
        acronym: "POST-UTME",
        fullName: "Joint Admissions and Matriculation Board",
        mocks: "1999 - 2025",
        subjects: "18+ Subjects",
    },
];

const mockQuestions: QuestionItem[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    statement:
        "Find the derivative of the function \\( f(x) = e^{2x} \\sin(3x) \\) with respect to \\( x \\).",
    options: [
        {
            key: "A",
            text: "\\( f'(x) = 2e^{2x} \\sin(3x) + 3e^{2x} \\cos(3x) \\)",
            isCorrect: true,
        },
        {
            key: "B",
            text: "\\( f'(x) = e^{2x} (2\\sin(3x) + 3\\cos(3x)) \\)",
        },
        {
            key: "C",
            text: "\\( f'(x) = 6e^{2x} \\cos(3x) \\)",
        },
        {
            key: "D",
            text: "\\( f'(x) = e^{2x} \\sin(3x) + \\cos(3x) \\)",
        },
    ],
    theoryAnswer:
        "This is going to be the long form answer that the admin will see about the question that was asked",
}));

export default function QuestionPage() {
    // Navigation view state: "exams" | "list" | "detail"
    const [view, setView] = useState<"exams" | "list" | "detail">("exams");
    const [selectedExam, setSelectedExam] = useState<Exam>(initialExams[0]);

    // Add Exam Modal state
    const [isAddExamOpen, setIsAddExamOpen] = useState(false);
    const [newExamAcronym, setNewExamAcronym] = useState("");
    const [newExamFullName, setNewExamFullName] = useState("");
    const [exams, setExams] = useState<Exam[]>(initialExams);

    // Import Questions Modal state
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    // List view filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("Mathematics");
    const [selectedYear, setSelectedYear] = useState("2021");
    const [selectedMode, setSelectedMode] = useState("Theory");
    const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Detail view state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(6); // index 6 = question 7
    const [activeTab, setActiveTab] = useState<"Objective" | "Theory">("Objective");

    const subjectOptions = ["Mathematics", "English", "Physics", "Chemistry", "Biology"];
    const yearOptions = ["2025", "2024", "2023", "2022", "2021", "2020"];
    const modeOptions = ["Objective", "Theory"];

    const handleAddExam = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newExamAcronym.trim() || !newExamFullName.trim()) return;

        const newExam: Exam = {
            id: newExamAcronym.toLowerCase().replace(/\s+/g, "-"),
            acronym: newExamAcronym.trim().toUpperCase(),
            fullName: newExamFullName.trim(),
            mocks: "1999 - 2025",
            subjects: "18+ Subjects",
        };

        setExams((prev) => [...prev, newExam]);
        setNewExamAcronym("");
        setNewExamFullName("");
        setIsAddExamOpen(false);
    };

    const handleSelectExamCard = (exam: Exam) => {
        setSelectedExam(exam);
        setView("list");
    };

    const handleSelectQuestionRow = (index: number) => {
        setCurrentQuestionIndex(index);
        setView("detail");
    };

    const currentQuestion = mockQuestions[currentQuestionIndex] || mockQuestions[0];

    return (
        <section className="w-full flex flex-col gap-8 pb-12">
            {/* ======================================================== */}
            {/* VIEW 1: AVAILABLE EXAMS (MAIN LIBRARY)                    */}
            {/* ======================================================== */}
            {view === "exams" && (
                <>
                    {/* Header Title */}
                    <CustomText
                        type="headline-sm"
                        className="font-medium text-neutral-500 text-2xl lg:text-[26px] tracking-tight"
                    >
                        Question Library
                    </CustomText>

                    {/* Summary 4 Stat Cards */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {summaryStats.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[120px]"
                            >
                                <CustomText
                                    type="body-sm"
                                    className="text-neutral-350 text-xs font-normal"
                                >
                                    {item.title}
                                </CustomText>
                                <CustomText
                                    type="headline-lg"
                                    className="font-semibold text-neutral-500 text-[32px] leading-tight my-2 tracking-tight"
                                >
                                    {item.value}
                                </CustomText>
                            </div>
                        ))}
                    </div>

                    {/* Available Exams Section */}
                    <div className="w-full flex flex-col gap-5 mt-2">
                        <CustomText
                            type="title-lg"
                            className="font-semibold text-neutral-500 text-xl lg:text-[22px]"
                        >
                            Available Exams
                        </CustomText>

                        {/* Exam Cards Grid */}
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* "Add New Exam" Card */}
                            <button
                                type="button"
                                onClick={() => setIsAddExamOpen(true)}
                                className="border-2 border-dashed border-primary-300 rounded-2xl p-6 bg-[#f0f4fd] flex flex-col items-center justify-center gap-3 cursor-pointer min-h-[175px] hover:bg-[#e6eeff] transition-colors text-center"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary-300 text-white flex items-center justify-center shadow-xs">
                                    <Add size={22} />
                                </div>
                                <CustomText
                                    type="body-md-bold"
                                    className="font-semibold text-sm text-neutral-500"
                                >
                                    Add New Exam
                                </CustomText>
                            </button>

                            {/* Existing Exam Cards */}
                            {exams.map((exam) => (
                                <div
                                    key={exam.id}
                                    onClick={() => handleSelectExamCard(exam)}
                                    className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-transparent hover:border-primary-200 transition-all flex flex-col justify-between min-h-[175px] cursor-pointer"
                                >
                                    <div>
                                        <CustomText
                                            type="title-lg"
                                            className="font-bold text-neutral-500 text-lg uppercase"
                                        >
                                            {exam.acronym}
                                        </CustomText>
                                        <CustomText
                                            type="body-sm"
                                            className="text-neutral-400 text-xs mt-1.5 line-clamp-2"
                                        >
                                            {exam.fullName}
                                        </CustomText>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 text-xs">
                                        <div>
                                            <span className="font-semibold text-neutral-500 block text-[11px]">
                                                Available mocks
                                            </span>
                                            <span className="text-neutral-400 text-[11px]">
                                                {exam.mocks}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-neutral-500 block text-[11px]">
                                                Subjects
                                            </span>
                                            <span className="text-neutral-400 text-[11px]">
                                                {exam.subjects}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* ======================================================== */}
            {/* VIEW 2: EXAM QUESTIONS TABLE LIST                        */}
            {/* ======================================================== */}
            {view === "list" && (
                <div className="w-full flex flex-col gap-6">
                    {/* Header with Back button and Import Button */}
                    <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <button
                                type="button"
                                onClick={() => setView("exams")}
                                className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-400 hover:text-neutral-500 transition-colors cursor-pointer mb-1"
                            >
                                <span className="w-4 h-4 rounded-full border border-neutral-400 flex items-center justify-center shrink-0">
                                    <ArrowLeft2 size={8} />
                                </span>
                                <span>Back to Question Library</span>
                            </button>
                            <CustomText
                                type="headline-sm"
                                className="font-medium text-neutral-500 text-2xl lg:text-[26px] tracking-tight"
                            >
                                {selectedExam.acronym} Questions
                            </CustomText>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsImportModalOpen(true)}
                            className="bg-primary-300 hover:bg-primary-250 text-white rounded-xl px-6 py-2.5 font-semibold text-sm transition-colors cursor-pointer self-start sm:self-center shadow-xs"
                        >
                            Import Questions
                        </button>
                    </div>

                    {/* Search & Filter Bar */}
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

                        {/* Filter by Dropdowns */}
                        <div className="flex flex-wrap items-center gap-3">
                            <CustomText type="body-sm" className="text-neutral-400 text-sm font-normal">
                                Filter by:
                            </CustomText>

                            {/* Subject Dropdown */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSubjectDropdownOpen(!isSubjectDropdownOpen);
                                        setIsYearDropdownOpen(false);
                                        setIsModeDropdownOpen(false);
                                    }}
                                    className="flex items-center gap-3 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-500 bg-white hover:border-neutral-400 transition-colors cursor-pointer text-sm"
                                >
                                    <span className="font-medium text-xs sm:text-sm">{selectedSubject}</span>
                                    <span className="w-5 h-5 rounded-full border border-neutral-400 flex items-center justify-center shrink-0">
                                        <ArrowDown2 size={10} className="text-neutral-500" />
                                    </span>
                                </button>

                                {isSubjectDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-20"
                                            onClick={() => setIsSubjectDropdownOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-neutral-100 py-1.5 z-30 flex flex-col">
                                            {subjectOptions.map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedSubject(s);
                                                        setIsSubjectDropdownOpen(false);
                                                    }}
                                                    className={cn(
                                                        "w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-neutral-50 cursor-pointer",
                                                        selectedSubject === s
                                                            ? "text-primary-300 font-semibold"
                                                            : "text-neutral-500"
                                                    )}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Year Dropdown */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsYearDropdownOpen(!isYearDropdownOpen);
                                        setIsSubjectDropdownOpen(false);
                                        setIsModeDropdownOpen(false);
                                    }}
                                    className="flex items-center gap-3 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-500 bg-white hover:border-neutral-400 transition-colors cursor-pointer text-sm"
                                >
                                    <span className="font-medium text-xs sm:text-sm">{selectedYear}</span>
                                    <span className="w-5 h-5 rounded-full border border-neutral-400 flex items-center justify-center shrink-0">
                                        <ArrowDown2 size={10} className="text-neutral-500" />
                                    </span>
                                </button>

                                {isYearDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-20"
                                            onClick={() => setIsYearDropdownOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-neutral-100 py-1.5 z-30 flex flex-col">
                                            {yearOptions.map((y) => (
                                                <button
                                                    key={y}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedYear(y);
                                                        setIsYearDropdownOpen(false);
                                                    }}
                                                    className={cn(
                                                        "w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-neutral-50 cursor-pointer",
                                                        selectedYear === y
                                                            ? "text-primary-300 font-semibold"
                                                            : "text-neutral-500"
                                                    )}
                                                >
                                                    {y}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Mode Dropdown (Theory/Objective) */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModeDropdownOpen(!isModeDropdownOpen);
                                        setIsSubjectDropdownOpen(false);
                                        setIsYearDropdownOpen(false);
                                    }}
                                    className="flex items-center gap-3 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-500 bg-white hover:border-neutral-400 transition-colors cursor-pointer text-sm"
                                >
                                    <span className="font-medium text-xs sm:text-sm">{selectedMode}</span>
                                    <span className="w-5 h-5 rounded-full border border-neutral-400 flex items-center justify-center shrink-0">
                                        <ArrowDown2 size={10} className="text-neutral-500" />
                                    </span>
                                </button>

                                {isModeDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-20"
                                            onClick={() => setIsModeDropdownOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-neutral-100 py-1.5 z-30 flex flex-col">
                                            {modeOptions.map((m) => (
                                                <button
                                                    key={m}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedMode(m);
                                                        setIsModeDropdownOpen(false);
                                                    }}
                                                    className={cn(
                                                        "w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-neutral-50 cursor-pointer",
                                                        selectedMode === m
                                                            ? "text-primary-300 font-semibold"
                                                            : "text-neutral-500"
                                                    )}
                                                >
                                                    {m}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Questions Table */}
                    <div className="w-full bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100 mt-2">
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-primary-100 h-13">
                                        <th className="px-6 py-4 text-left font-semibold text-xs text-neutral-500 uppercase tracking-wider w-[42%]">
                                            Question
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold text-xs text-neutral-500 uppercase tracking-wider w-[18%]">
                                            Options
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold text-xs text-neutral-500 uppercase tracking-wider w-[30%]">
                                            Answer
                                        </th>
                                        <th className="px-6 py-4 text-center font-semibold text-xs text-neutral-500 uppercase tracking-wider w-[10%]">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100/60">
                                    {mockQuestions.slice(0, 7).map((item, index) => (
                                        <tr
                                            key={item.id}
                                            onClick={() => handleSelectQuestionRow(index)}
                                            className="h-18 hover:bg-neutral-50/70 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-2.5">
                                                    <span className="font-bold text-neutral-500 text-sm shrink-0">
                                                        {index + 1}
                                                    </span>
                                                    <CustomText
                                                        type="body-sm"
                                                        className="text-neutral-500 font-medium text-xs sm:text-sm line-clamp-2"
                                                    >
                                                        {item.statement}
                                                    </CustomText>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <CustomText
                                                    type="body-sm"
                                                    className="text-neutral-400 text-xs sm:text-sm font-normal"
                                                >
                                                    N/A
                                                </CustomText>
                                            </td>
                                            <td className="px-6 py-4">
                                                <CustomText
                                                    type="body-sm"
                                                    className="text-neutral-450 text-xs sm:text-sm font-normal line-clamp-2"
                                                >
                                                    This is going to be the long form answer that the
                                                    admin will see abo...
                                                </CustomText>
                                            </td>
                                            <td
                                                className="px-6 py-4 whitespace-nowrap text-center"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectQuestionRow(index);
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
                                    ))}
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
            )}

            {/* ======================================================== */}
            {/* VIEW 3: QUESTION DETAIL (OBJECTIVE & THEORY MODES)       */}
            {/* ======================================================== */}
            {view === "detail" && (
                <div className="w-full flex flex-col gap-6">
                    {/* Header with Back button and Import Button */}
                    <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <button
                                type="button"
                                onClick={() => setView("list")}
                                className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-400 hover:text-neutral-500 transition-colors cursor-pointer mb-1"
                            >
                                <span className="w-4 h-4 rounded-full border border-neutral-400 flex items-center justify-center shrink-0">
                                    <ArrowLeft2 size={8} />
                                </span>
                                <span>Back to {selectedExam.acronym} Questions</span>
                            </button>
                            <CustomText
                                type="headline-sm"
                                className="font-medium text-neutral-500 text-2xl lg:text-[26px] tracking-tight"
                            >
                                {selectedExam.acronym} {selectedSubject} Questions
                            </CustomText>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsImportModalOpen(true)}
                            className="bg-primary-300 hover:bg-primary-250 text-white rounded-xl px-6 py-2.5 font-semibold text-sm transition-colors cursor-pointer self-start sm:self-center shadow-xs"
                        >
                            Import Questions
                        </button>
                    </div>

                    {/* Question Content & Question Navigator Grid */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
                        {/* Left Column: Question & Options / Answer */}
                        <div className="w-full lg:col-span-8 flex flex-col gap-6">
                            {/* Question Statement */}
                            <div className="pt-2">
                                <CustomText
                                    type="title-lg"
                                    className="font-semibold text-neutral-500 text-lg sm:text-xl leading-relaxed"
                                >
                                    {currentQuestion.statement}
                                </CustomText>
                            </div>

                            {/* Mode: OBJECTIVE */}
                            {activeTab === "Objective" && (
                                <div className="w-full flex flex-col gap-3.5">
                                    {currentQuestion.options.map((opt) => (
                                        <div
                                            key={opt.key}
                                            className="w-full bg-[#eaeffa] rounded-2xl p-4 flex items-center gap-4 transition-all hover:bg-[#e1e9f8] cursor-pointer"
                                        >
                                            <div
                                                className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0",
                                                    opt.key === "A"
                                                        ? "bg-primary-300 text-white"
                                                        : "bg-primary-100 text-primary-400"
                                                )}
                                            >
                                                {opt.key}
                                            </div>
                                            <span className="text-neutral-500 text-xs sm:text-sm font-medium">
                                                {opt.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Mode: THEORY */}
                            {activeTab === "Theory" && (
                                <div className="w-full border border-neutral-200 bg-[#f9fafb] rounded-2xl p-6 min-h-[220px]">
                                    <CustomText
                                        type="body-md"
                                        className="text-neutral-400 text-sm leading-relaxed"
                                    >
                                        {currentQuestion.theoryAnswer}
                                    </CustomText>
                                </div>
                            )}

                            {/* "View Next Question" Action Button */}
                            <div className="w-full flex justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentQuestionIndex((prev) =>
                                            prev + 1 < mockQuestions.length ? prev + 1 : 0
                                        )
                                    }
                                    className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl px-6 py-3 font-semibold text-sm flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                                >
                                    <span>View Next Question</span>
                                    <ArrowRight2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Question Navigator */}
                        <div className="w-full lg:col-span-4 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100 flex flex-col gap-5">
                            <div>
                                <CustomText
                                    type="title-lg"
                                    className="font-semibold text-neutral-500 text-base sm:text-lg"
                                >
                                    Question Navigator
                                </CustomText>
                                <CustomText
                                    type="body-sm"
                                    className="text-neutral-350 text-xs font-normal mt-0.5"
                                >
                                    Jump to any question quickly
                                </CustomText>
                            </div>

                            {/* Tabs: Objective | Theory */}
                            <div className="w-full flex items-center gap-6 border-b border-neutral-100 pb-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("Objective")}
                                    className={cn(
                                        "pb-2 font-semibold text-sm transition-colors cursor-pointer relative",
                                        activeTab === "Objective"
                                            ? "text-primary-300 border-b-2 border-primary-300"
                                            : "text-neutral-400 hover:text-neutral-500"
                                    )}
                                >
                                    Objective
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("Theory")}
                                    className={cn(
                                        "pb-2 font-semibold text-sm transition-colors cursor-pointer relative",
                                        activeTab === "Theory"
                                            ? "text-primary-300 border-b-2 border-primary-300"
                                            : "text-neutral-400 hover:text-neutral-500"
                                    )}
                                >
                                    Theory
                                </button>
                            </div>

                            {/* Number Buttons Grid */}
                            <div className="grid grid-cols-5 gap-2.5 pt-1">
                                {Array.from(
                                    { length: activeTab === "Objective" ? 20 : 6 },
                                    (_, i) => {
                                        const isCurrent = currentQuestionIndex === i;
                                        return (
                                            <div key={i} className="relative flex justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentQuestionIndex(i)}
                                                    className={cn(
                                                        "w-10 h-10 rounded-xl border border-primary-200 flex items-center justify-center font-medium text-xs transition-colors cursor-pointer",
                                                        isCurrent
                                                            ? "bg-primary-50 text-primary-300 font-bold border-primary-300"
                                                            : "bg-white text-primary-300 hover:bg-primary-50"
                                                    )}
                                                >
                                                    {i + 1}
                                                </button>
                                                {/* Active Question Dot Indicator */}
                                                {isCurrent && (
                                                    <span className="absolute -top-1 -right-0.5 w-2 h-2 rounded-full bg-primary-300 ring-2 ring-white" />
                                                )}
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* MODAL: ADD NEW EXAM (IMAGE 5)                            */}
            {/* ======================================================== */}
            {isAddExamOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-neutral-500/25 backdrop-blur-[2px] z-40 transition-opacity"
                        onClick={() => setIsAddExamOpen(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
                            {/* Header */}
                            <div className="w-full flex items-start justify-between">
                                <div className="flex flex-col">
                                    <span className="text-secondary-350 text-xs font-semibold">
                                        Question Library
                                    </span>
                                    <CustomText
                                        type="headline-sm"
                                        className="font-bold text-neutral-500 text-xl mt-1"
                                    >
                                        Add New Exam
                                    </CustomText>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsAddExamOpen(false)}
                                    className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-500 transition-colors cursor-pointer"
                                >
                                    <CloseCircle size={18} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleAddExam} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-neutral-500">
                                        Exam Acronym *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="JAMB"
                                        value={newExamAcronym}
                                        onChange={(e) => setNewExamAcronym(e.target.value)}
                                        required
                                        className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-500 placeholder:text-neutral-300 focus:outline-none focus:border-primary-300 transition-colors"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-neutral-500">
                                        Exam Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Joint Admission and Matriculation Board"
                                        value={newExamFullName}
                                        onChange={(e) => setNewExamFullName(e.target.value)}
                                        required
                                        className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-500 placeholder:text-neutral-300 focus:outline-none focus:border-primary-300 transition-colors"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-12 bg-primary-150 hover:bg-primary-200 text-neutral-500 font-semibold rounded-xl mt-2 transition-colors cursor-pointer"
                                >
                                    Add Exam
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}

            {/* ======================================================== */}
            {/* MODAL: IMPORT QUESTIONS                                  */}
            {/* ======================================================== */}
            {isImportModalOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-neutral-500/25 backdrop-blur-[2px] z-40 transition-opacity"
                        onClick={() => setIsImportModalOpen(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
                            <div className="w-full flex items-start justify-between">
                                <div className="flex flex-col">
                                    <span className="text-secondary-350 text-xs font-semibold">
                                        Question Library
                                    </span>
                                    <CustomText
                                        type="headline-sm"
                                        className="font-bold text-neutral-500 text-xl mt-1"
                                    >
                                        Import Questions ({selectedExam.acronym})
                                    </CustomText>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsImportModalOpen(false)}
                                    className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-500 transition-colors cursor-pointer"
                                >
                                    <CloseCircle size={18} />
                                </button>
                            </div>

                            <div className="border-2 border-dashed border-primary-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-2 bg-[#f8faff]">
                                <span className="text-3xl">📄</span>
                                <CustomText type="body-md-bold" className="font-semibold text-neutral-500">
                                    Drop question CSV or Excel file here
                                </CustomText>
                                <CustomText type="body-sm" className="text-neutral-350 text-xs">
                                    Supports .csv, .xlsx up to 25MB
                                </CustomText>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsImportModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-500 text-sm font-medium hover:bg-neutral-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsImportModalOpen(false)}
                                    className="px-6 py-2.5 rounded-xl bg-primary-300 text-white text-sm font-semibold hover:bg-primary-250 cursor-pointer"
                                >
                                    Upload & Import
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}