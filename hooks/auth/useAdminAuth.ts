"use client";

import { handleApiError } from "@/config/handleApiError";
import httpService, { tokenStorage, unsecureHttpService } from "@/config/httpService";
import { showSuccess, showError } from "@/config/toast";
import { URLS } from "@/config/urls";
import { AdminAuthResponseData, AdminUser, ApiResponse } from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

/**
 * Hook for Admin Login - sends OTP to email
 */
export const useAdminLogin = () => {
    const router = useRouter();

    const loginMutation = useMutation({
        mutationFn: async (data: { email: string }) => {
            const response = await unsecureHttpService.post<ApiResponse<{ message?: string }>>(
                URLS.ADMIN_LOGIN,
                data
            );
            return response.data;
        },
        onError: (error: AxiosError) => {
            handleApiError(error as AxiosError<{ message?: string; detail?: string }>);
        },
        onSuccess: (data, variables) => {
            showSuccess(data?.message || "Verification code sent to your email.");
            router.push(`/auth/validation?email=${encodeURIComponent(variables.email)}`);
        },
    });

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .trim()
                .email("Please enter a valid email address")
                .required("Email is required"),
        }),
        onSubmit: (values) => {
            loginMutation.mutate({ email: values.email.trim() });
        },
    });

    return {
        formik,
        isPending: loginMutation.isPending,
    };
};

/**
 * Hook for Admin OTP Validation - validates OTP, stores tokens, redirects to dashboard
 */
export const useAdminValidateOtp = (email?: string) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const validateMutation = useMutation({
        mutationFn: async (data: { otp: string }) => {
            if (!email) {
                throw new Error("Email is missing. Please restart the login process.");
            }
            const response = await unsecureHttpService.post<ApiResponse<AdminAuthResponseData>>(
                URLS.ADMIN_VALIDATE_OTP,
                {
                    email: email.trim(),
                    otp: data.otp.trim(),
                }
            );
            return response.data;
        },
        onError: (error: AxiosError) => {
            handleApiError(error as AxiosError<{ message?: string; detail?: string }>);
        },
        onSuccess: (data) => {
            const authData = data?.data;
            if (authData?.tokens?.access_token) {
                tokenStorage.setAccess(authData.tokens.access_token);
            }
            if (authData?.tokens?.refresh_token) {
                tokenStorage.setRefresh(authData.tokens.refresh_token);
            }
            if (authData?.admin && typeof window !== "undefined") {
                localStorage.setItem("prepfora_admin_user", JSON.stringify(authData.admin));
                queryClient.setQueryData(["admin-me"], authData.admin);
            }
            showSuccess(data?.message || "Logged in successfully!");
            router.push("/dashboard/home");
        },
    });

    const resendMutation = useMutation({
        mutationFn: async () => {
            if (!email) {
                throw new Error("Email is missing. Please enter your email first.");
            }
            const response = await unsecureHttpService.post<ApiResponse<{ message?: string }>>(
                URLS.ADMIN_LOGIN,
                { email: email.trim() }
            );
            return response.data;
        },
        onError: (error: AxiosError) => {
            handleApiError(error as AxiosError<{ message?: string; detail?: string }>);
        },
        onSuccess: (data) => {
            showSuccess(data?.message || "A new 6-digit code has been sent to your email.");
        },
    });

    const formik = useFormik({
        initialValues: {
            otp: "",
        },
        validationSchema: Yup.object({
            otp: Yup.string()
                .trim()
                .length(6, "Code must be 6 digits")
                .required("Verification code is required"),
        }),
        onSubmit: (values) => {
            validateMutation.mutate({ otp: values.otp.trim() });
        },
    });

    return {
        formik,
        isPending: validateMutation.isPending,
        resendOtp: () => {
            if (!email) {
                showError("No email address provided to resend code to.");
                return;
            }
            resendMutation.mutate();
        },
        isResending: resendMutation.isPending,
    };
};

/**
 * Hook to get Current Authenticated Admin
 */
export const useCurrentAdmin = (options?: { enabled?: boolean }) => {
    const hasToken = typeof window !== "undefined" ? !!tokenStorage.getAccess() : false;
    const enabled = options?.enabled !== undefined ? options.enabled && hasToken : hasToken;

    return useQuery<AdminUser | null>({
        queryKey: ["admin-me"],
        queryFn: async () => {
            const token = tokenStorage.getAccess();
            if (!token) {
                return null;
            }
            const response = await httpService.get<ApiResponse<AdminUser>>(URLS.ADMIN_ME);
            const user = response.data?.data;
            if (user && typeof window !== "undefined") {
                localStorage.setItem("prepfora_admin_user", JSON.stringify(user));
            }
            return user;
        },
        enabled,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};
