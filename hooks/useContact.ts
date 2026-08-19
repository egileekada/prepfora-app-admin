"use client"

import { ApiErrorResponse } from "@/config/getErrorMessage";
import { handleApiError } from "@/config/handleApiError";
import httpService from "@/config/httpService";
import { showSuccess } from "@/config/toast";
import { URLS } from "@/config/urls";
import { IContact } from "@/types/waitlist";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

const useContact = () => {
    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Please enter a valid email address")
            .required("Email is required"),

        first_name: Yup.string()
            .trim()
            .min(2, "First name must be at least 2 characters")
            .required("First name is required"),

        last_name: Yup.string()
            .trim()
            .min(2, "Last name must be at least 2 characters")
            .required("Last name is required"),

        message: Yup.string()
            .trim()
            .min(10, "Message must be at least 10 characters")
            .required("Message is required"),
    });

    const contact = useMutation({
        mutationFn: (data: IContact) => httpService.post(URLS.CONTACT, data),
        onError: (error: AxiosError<ApiErrorResponse>) => handleApiError(error),
        onSuccess: (data) => {
            showSuccess(data?.data?.message);
            formik.resetForm();
        },
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            first_name: "",
            last_name: "",
            message: "",
        },

        validationSchema: validationSchema,

        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                contact.mutate(values);

                resetForm();
            } catch (error) {
                console.error(error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return {
        formik,
        isLoading: contact.isPending
    };
};

export default useContact;
