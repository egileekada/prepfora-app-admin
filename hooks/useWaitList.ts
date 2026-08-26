"use client"
import { ApiErrorResponse } from "@/config/getErrorMessage";
import { handleApiError } from "@/config/handleApiError";
import httpService from "@/config/httpService";
import { showSuccess } from "@/config/toast";
import { URLS } from "@/config/urls";
import { IWaitlist, IWaitlistData } from "@/types/waitlist";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useFetchData } from "./useFetchData";
import { PaginatedResponse } from "@/types/pagination";

const useWaitList = () => {

    const [isOpen, setOpen] = useState(false)
    const [page, setPage] = useState(1)


    const useGetWaitList = () => {
        return useFetchData<PaginatedResponse<IWaitlistData>>({
            endpoint: URLS.WAIT_LIST,
            name: [URLS.WAIT_LIST],
            params: {
                page,
                limit: 10
            }
        });
    };

    const validationSchema = Yup.object({
        emails: Yup.array()
            .of(Yup.string().email("Please enter a valid email"))
            .min(1, "Email is required")
            .required("Email is required"),

        subject: Yup.string()
            .trim()
            .min(2, "Subject must be at least 2 characters")
            .required("Subject is required"),

        message: Yup.string()
            .trim()
            .min(10, "Message must be at least 10 characters")
            .required("Message is required"),
    });

    const inviteUser = useMutation({
        mutationFn: (data: IWaitlist) =>
            httpService.post(URLS.WAIT_LIST_BULK, data),
        onError: (error: AxiosError<ApiErrorResponse>) => handleApiError(error),
        onSuccess: (data) => {

            setOpen(false)
            showSuccess(data?.data?.message);
            formik.resetForm()
        },
    });

    const formik = useFormik({
        initialValues: {
            emails: [] as string[],
            subject: "",
            message: "",
        },
        validationSchema: validationSchema,
        onSubmit: (data) => {
            inviteUser.mutate(data)
        },
    });

    return {
        formik,
        isOpen,
        setOpen,
        isLoading: inviteUser.isPending,
        useGetWaitList,
        page,
        setPage
    };
};

export default useWaitList;
