"use client"
import { ApiErrorResponse } from "@/config/getErrorMessage";
import { handleApiError } from "@/config/handleApiError";
import httpService from "@/config/httpService";
import { showSuccess } from "@/config/toast";
import { URLS } from "@/config/urls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useFetchData } from "./useFetchData";
import { PaginatedResponse } from "@/types/pagination";
import { IFaqData, IFaqResponse } from "@/types/faq";

const useFAQ = () => {

    const [isOpen, setOpen] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [page, setPage] = useState(1)
    const [index, setIndex] = useState("")
    const queryClient = useQueryClient()


    const useGetFAQ = () => {
        return useFetchData<PaginatedResponse<IFaqResponse>>({
            endpoint: URLS.FAQ,
            name: [URLS.FAQ],
            params: {
                page,
                limit: 10
            }
        });
    };

    const validationSchema = Yup.object({
        title: Yup.string()
            .trim()
            .min(2, "Title must be at least 2 characters")
            .required("Title is required"),

        description: Yup.string()
            .trim()
            .min(10, "Description must be at least 10 characters")
            .required("Description is required"),
    });

    const createFAQ = useMutation({
        mutationFn: (data: IFaqData) =>
            httpService.post(URLS.FAQ, data),
        onError: (error: AxiosError<ApiErrorResponse>) => handleApiError(error),
        onSuccess: (data) => {

            setOpen(false)
            showSuccess(data?.data?.message);
            setIndex("")
            formik.resetForm()
            queryClient.invalidateQueries({ queryKey: [URLS.FAQ] })
        },
    });

    const updateFAQ = useMutation({
        mutationFn: (data: IFaqData) =>
            httpService.put(URLS.FAQ_BY_ID(index), data),
        onError: (error: AxiosError<ApiErrorResponse>) => handleApiError(error),
        onSuccess: (data) => {
            setOpen(false)
            showSuccess(data?.data?.message);
            setIndex("")
            formik.resetForm()
            queryClient.invalidateQueries({ queryKey: [URLS.FAQ] })
        },
    });

    const deleteFAQ = useMutation({
        mutationFn: () =>
            httpService.delete(URLS.FAQ_BY_ID(index)),
        onError: (error: AxiosError<ApiErrorResponse>) => handleApiError(error),
        onSuccess: (data) => {
            showSuccess(data?.data?.message);
            setIndex("")
            setIsOpenDelete(false)
            queryClient.invalidateQueries({ queryKey: [URLS.FAQ] })
        },
    });

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
        },
        validationSchema: validationSchema,
        onSubmit: (data) => {
            if (index) {
                updateFAQ.mutate(data)
            } else {
                createFAQ.mutate(data)
            }
        },
    });

    const isLoading = createFAQ.isPending || updateFAQ.isPending || deleteFAQ.isPending

    return {
        formik,
        isOpen,
        setOpen,
        isLoading,
        useGetFAQ,
        page,
        setPage,
        deleteFAQ,
        setIndex,
        index,
        setIsOpenDelete,
        isOpenDelete
    };
};

export default useFAQ;
