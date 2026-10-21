"use client";

import { CustomButton, FormikField } from "@/components/ui";
import { useAdminLogin } from "@/hooks/auth/useAdminAuth";
import { FormikProvider } from "formik";

export default function LoginForm() {
    const { formik, isPending } = useAdminLogin();

    const isButtonDisabled = isPending || !formik.values.email || !formik.isValid;

    return (
        <FormikProvider value={formik}>
            <form
                onSubmit={formik.handleSubmit}
                className="w-full p-6 flex flex-col gap-6 rounded-2xl bg-white shadow-sm"
            >
                <div className="flex flex-col gap-1">
                    <FormikField
                        placeholder="admin@prepfora.com"
                        name="email"
                        label="Email*"
                        type="email"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        We will send a 6-digit one-time verification code to this email.
                    </p>
                </div>
                <div className="flex flex-col gap-4 w-full">
                    <CustomButton
                        type="submit"
                        fullWidth
                        loading={isPending}
                        disabled={isButtonDisabled}
                        variant={isButtonDisabled ? "disabled" : "primary"}
                    >
                        {isPending ? "Sending Code..." : "Log In"}
                    </CustomButton>
                </div>
            </form>
        </FormikProvider>
    );
}
