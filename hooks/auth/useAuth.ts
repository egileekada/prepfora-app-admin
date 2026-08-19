"use client"
import { ApiErrorResponse } from "@/config/getErrorMessage";
import { handleApiError } from "@/config/handleApiError";
import httpService from "@/config/httpService";
import { showSuccess } from "@/config/toast";
import { URLS } from "@/config/urls";
import { IWaitlist } from "@/types/waitlist";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

const useAuth = () => {

    const [isOpen, setOpen] = useState(false)

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Please enter a valid email")
            .required("Email is required"),

        first_name: Yup.string()
            .trim()
            .min(2, "First name must be at least 2 characters")
            .required("First name is required"),

        last_name: Yup.string()
            .trim()
            .min(2, "Last name must be at least 2 characters")
            .required("Last name is required"),
    });
    
    const waitlist = useMutation({
        mutationFn: (data: IWaitlist) =>
            httpService.post(URLS.WAIT_LIST, data),
        onError: (error: AxiosError<ApiErrorResponse>) => handleApiError(error),
        onSuccess: (data) => {

            setOpen(false)
            showSuccess(data?.data?.message); 
            formik.resetForm()
        },
    }); 

    const formik = useFormik({
        initialValues: {
            email: "",
            first_name: "",
            last_name: "",
        },
        validationSchema: validationSchema,
        onSubmit: (data) => {
            waitlist.mutate(data)
        },
    });

    return {
        formik,
        isOpen,
        setOpen,
        isLoading: waitlist.isPending
    };
};

export default useAuth;
