"use client";

import { AdminUser } from "@/types/auth";
import React, { createContext, useContext } from "react";

interface AdminContextType {
    admin: AdminUser | null;
    isLoading: boolean;
    refetch: () => void;
}

const AdminContext = createContext<AdminContextType>({
    admin: null,
    isLoading: false,
    refetch: () => {},
});

export const AdminProvider = ({
    children,
    value,
}: {
    children: React.ReactNode;
    value: AdminContextType;
}) => {
    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => useContext(AdminContext);
