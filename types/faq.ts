

export interface IFaqData {
    title: string;
    description: string;
}

export interface IFaqResponse {
    id: string;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    isDeleted: boolean;
    deleted_at: string | null;
}
