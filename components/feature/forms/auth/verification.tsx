"use client";

import { CustomButton, OTPInput } from "@/components/ui";
import { useAdminValidateOtp } from "@/hooks/auth/useAdminAuth";
import { FormikProvider } from "formik";
import { useSearchParams } from "next/navigation";

interface VerificationFormProps {
    email?: string;
}

export default function VerificationForm({ email: emailProp }: VerificationFormProps) {
    const searchParams = useSearchParams();
    const queryEmail = searchParams.get("email");
    const email = emailProp || queryEmail || "";

    const { formik, isPending, resendOtp, isResending } = useAdminValidateOtp(email);

    const isCodeComplete = formik.values.otp?.trim().length === 6;
    const isButtonDisabled = isPending || !isCodeComplete;

    return (
        <FormikProvider value={formik}>
            <form
                onSubmit={formik.handleSubmit}
                className="w-full p-6 flex flex-col gap-6 rounded-2xl bg-white shadow-sm"
            >
                <div className="flex flex-col gap-3 w-full justify-center items-center">
                    <OTPInput name="otp" length={6} isLoading={isPending} />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 px-1">
                    <span>Didn&apos;t receive the code?</span>
                    <button
                        type="button"
                        onClick={resendOtp}
                        disabled={isResending || isPending}
                        className="text-secondary-450 font-semibold hover:underline disabled:opacity-50 cursor-pointer"
                    >
                        {isResending ? "Resending..." : "Resend code"}
                    </button>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <CustomButton
                        type="submit"
                        fullWidth
                        loading={isPending}
                        disabled={isButtonDisabled}
                        variant={isButtonDisabled ? "disabled" : "primary"}
                    >
                        {isPending ? "Verifying..." : "Continue"}
                    </CustomButton>
                </div>
            </form>
        </FormikProvider>
    );
}