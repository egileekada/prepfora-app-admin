"use client";

import httpService, { tokenStorage } from "@/config/httpService";
import { URLS } from "@/config/urls";
import { AdminAnalyticsResponse } from "@/types/analytics";
import { ApiResponse } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";

export const useAnalyticsDashboard = () => {
    const hasToken = typeof window !== "undefined" ? !!tokenStorage.getAccess() : false;

    return useQuery<AdminAnalyticsResponse | null>({
        queryKey: ["analytics-dashboard"],
        queryFn: async () => {
            try {
                const response = await httpService.get<ApiResponse<AdminAnalyticsResponse>>(
                    URLS.ANALYTICS_ADMIN
                );
                return response.data?.data ?? null;
            } catch {
                const fallback = await httpService.get<ApiResponse<AdminAnalyticsResponse>>(
                    URLS.ANALYTICS_DASHBOARD
                );
                return fallback.data?.data ?? null;
            }
        },
        enabled: hasToken,
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
    });
};
