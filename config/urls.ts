export const URLS = {
    WAIT_LIST: "/waitlist",
    WAIT_LIST_BULK: "/waitlist/send_message",
    CONTACT: "/contact_message/create",

    FAQ: "/faq",
    FAQ_BY_ID: (id: string) => `/faq/${id}`,

    // Admin Auth
    ADMIN_LOGIN: "/admin/auth/login",
    ADMIN_VALIDATE_OTP: "/admin/auth/validate-otp",
    ADMIN_ME: "/admin/auth/me",
    ADMIN_REFRESH_TOKEN: "/admin/auth/refresh-token",

    // Analytics
    ANALYTICS_ADMIN: "/analytics/admin",
    ANALYTICS_DASHBOARD: "/analytics/dashboard",

    // Affiliates
    AFFILIATE_ALL: "/affiliate/admin/all",
    AFFILIATE_INVITES: "/affiliate/admin/invites",
    AFFILIATE_INVITE: "/affiliate/admin/invite",
    AFFILIATE_BY_ID: (id: string) => `/affiliate/${id}`,
    AFFILIATE_DETAILS: (id: string) => `/affiliate/details/${id}`,
};



