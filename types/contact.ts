export interface IContactReply {
    id: string;
    sender: string;
    createdAt: string;
    content: string[];
}

export interface IContactMessageItem {
    id: string;
    name: string;
    email: string;
    subject: string;
    category: string;
    categoryColor?: "primary" | "default";
    date: string;
    fullDate: string;
    preview: string;
    body: string[];
    replies: IContactReply[];
    hasPendingResponse: boolean;
}
