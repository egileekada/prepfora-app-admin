"use client";

import { VerificationForm } from "@/components/feature";
import { AuthLayout } from "@/components/layouts";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ValidationContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    return (
        <AuthLayout
            title="Verify your email"
            body={
                email
                    ? `An email with a 6-digit code has been sent to ${email}.`
                    : "Please enter the 6-digit code sent to your admin email address."
            }
            btn="Back to Login"
            btnlink="/"
        >
            <VerificationForm email={email || undefined} />
        </AuthLayout>
    );
}

export default function ValidationPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center py-20 text-gray-500">Loading verification...</div>}>
            <ValidationContent />
        </Suspense>
    );
}
