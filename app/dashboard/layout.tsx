"use client";

import { Sidebar } from "@/components/common";
import { tokenStorage } from "@/config/httpService";
import { AdminProvider } from "@/context/AdminContext";
import { useCurrentAdmin } from "@/hooks/auth/useAdminAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isCheckingToken, setIsCheckingToken] = useState(true);

    const { data: admin, isLoading, isError, refetch } = useCurrentAdmin();

    useEffect(() => {
        const token = tokenStorage.getAccess();
        if (!token) {
            router.replace("/");
        } else {
            setIsCheckingToken(false);
        }
    }, [router]);

    useEffect(() => {
        if (isError) {
            tokenStorage.clearAll();
            router.replace("/");
        }
    }, [isError, router]);

    if (isCheckingToken) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-primary-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Checking authorization...</p>
                </div>
            </div>
        );
    }

    return (
        <AdminProvider value={{ admin: admin ?? null, isLoading, refetch }}>
            <section className="w-full h-screen overflow-hidden flex bg-primary-50">
                <Sidebar admin={admin} />
                <div className="flex-1 py-10 px-6 overflow-y-auto">
                    {children}
                </div>
            </section>
        </AdminProvider>
    );
}