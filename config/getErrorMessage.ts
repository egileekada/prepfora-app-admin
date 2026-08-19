import { AxiosError } from "axios";

type FastApiValidationError = {
    loc?: (string | number)[];
    msg?: string;
    type?: string;
    ctx?: Record<string, unknown>;
};

export type ApiErrorResponse = {
    detail?: string | FastApiValidationError[] | any;
    message?: string;
    error?: string;
};

export function getErrorMessage(
    error: AxiosError<ApiErrorResponse>
): string {
    const data = error.response?.data;

    if (!data) return error.message;

    // Handle FastAPI validation errors (array)
    if (Array.isArray(data.detail)) {
        return data.detail
            .map((err) => {
                const field =
                    err.loc?.[err.loc.length - 1] ?? "Field";

                const message =
                    err.msg ?? "Invalid value";

                return `${String(field)}: ${message}`;
            })
            .join("\n");
    }

    // Normal API errors
    return (
        data.detail ||
        data.message ||
        data.error ||
        error.message ||
        "Unknown error occurred"
    );
}