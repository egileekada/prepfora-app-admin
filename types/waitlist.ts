
export interface IWaitlist {
    email: string;
    first_name: string;
    last_name: string;
}

export interface IWaitlistData {
    created_at: string;
    updated_at: string;
    isDeleted: boolean;
    deleted_at: string;
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
}

export interface IContact {
    email: string;
    first_name: string;
    last_name: string;
    message: string;
}