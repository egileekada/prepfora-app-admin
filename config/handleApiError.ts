import { AxiosError } from "axios"; 
import { getErrorMessage } from "./getErrorMessage";
import { showError } from "./toast";

type ApiErrorResponse = {
    detail?: string;
    message?: string;
    error?: string;
};

export function handleApiError(error: AxiosError<ApiErrorResponse>) {
    const message = getErrorMessage(error);  
    showError(message) 
}
