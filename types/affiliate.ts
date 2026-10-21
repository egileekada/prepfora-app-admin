export interface AffiliateItem {
    id: string;
    name: string;
    email: string;
    code: string;
    isSuspended?: boolean;
    referrals_count?: number;
    conversions_count?: number;
    total_commission?: number;
    created_at?: string;
    updated_at?: string;
    avatar?: string;
}

export interface AffiliateInvite {
    id: string;
    code: string;
    email: string;
    isActive: boolean;
    endDate: string;
    invite_link?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface SendAffiliateInvitePayload {
    name?: string;
    email: string;
    invite_url?: string | null;
}

export interface ReferralItem {
    id: string;
    name: string;
    email: string;
    status: "Converted" | "Pending";
    subscription: "Paid" | "Free" | "-";
    joined: string;
}
