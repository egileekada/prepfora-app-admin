"use client";

import { handleApiError } from "@/config/handleApiError";
import httpService, { tokenStorage } from "@/config/httpService";
import { showSuccess } from "@/config/toast";
import { URLS } from "@/config/urls";
import { AffiliateInvite, AffiliateItem, SendAffiliateInvitePayload } from "@/types/affiliate";
import { ApiResponse } from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetAffiliates = () => {
    return useQuery<AffiliateItem[]>({
        queryKey: ["affiliates-all"],
        queryFn: async () => {
            try {
                const response = await httpService.get<any>(URLS.AFFILIATE_ALL);
                const raw = response.data;
                const items = Array.isArray(raw)
                    ? raw
                    : Array.isArray(raw?.data)
                    ? raw.data
                    : Array.isArray(raw?.data?.items)
                    ? raw.data.items
                    : Array.isArray(raw?.items)
                    ? raw.items
                    : [];
                return items;
            } catch (error) {
                console.error("Error fetching affiliates:", error);
                return [];
            }
        },
        enabled: typeof window !== "undefined" && !!tokenStorage.getAccess(),
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useGetAffiliateInvites = () => {
    return useQuery<AffiliateInvite[]>({
        queryKey: ["affiliate-invites"],
        queryFn: async () => {
            try {
                const response = await httpService.get<any>(URLS.AFFILIATE_INVITES);
                const raw = response.data;
                const items = Array.isArray(raw)
                    ? raw
                    : Array.isArray(raw?.data)
                    ? raw.data
                    : Array.isArray(raw?.data?.items)
                    ? raw.data.items
                    : Array.isArray(raw?.items)
                    ? raw.items
                    : [];
                return items;
            } catch (error) {
                console.error("Error fetching affiliate invites:", error);
                return [];
            }
        },
        enabled: typeof window !== "undefined" && !!tokenStorage.getAccess(),
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useSendAffiliateInvite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: SendAffiliateInvitePayload) => {
            const response = await httpService.post<any>(
                URLS.AFFILIATE_INVITE,
                {
                    email: payload.email.trim(),
                    ...(payload.invite_url ? { invite_url: payload.invite_url } : {}),
                }
            );
            return response.data;
        },
        onError: (error: AxiosError) => {
            handleApiError(error as AxiosError<{ message?: string; detail?: string }>);
        },
        onSuccess: (data) => {
            showSuccess(data?.message || "Affiliate invitation sent successfully!");
            queryClient.invalidateQueries({ queryKey: ["affiliates-all"] });
            queryClient.invalidateQueries({ queryKey: ["affiliate-invites"] });
        },
    });
};

export const useGetAffiliateDetails = (id: string) => {
    const hasToken = typeof window !== "undefined" ? !!tokenStorage.getAccess() : false;

    return useQuery<AffiliateItem | null>({
        queryKey: ["affiliate-detail", id],
        queryFn: async () => {
            if (!id) return null;
            try {
                const response = await httpService.get<any>(URLS.AFFILIATE_DETAILS(id));
                const raw = response.data;
                return raw?.data ?? raw ?? null;
            } catch {
                try {
                    const fallbackRes = await httpService.get<any>(URLS.AFFILIATE_BY_ID(id));
                    const raw = fallbackRes.data;
                    return raw?.data ?? raw ?? null;
                } catch {
                    return null;
                }
            }
        },
        enabled: hasToken && !!id,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
    });
};
