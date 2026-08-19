"use client"

import { CustomButton, OTPInput } from "@/components/ui";
import useAuth from "@/hooks/auth/useAuth";
import { FormikProvider } from "formik";


export default function VerificationForm() {

    const { formik } = useAuth();

    return (
        <FormikProvider value={formik}>
            <form className=" w-full p-6 flex flex-col gap-6 rounded-2xl bg-white ">
                <div className=" flex flex-col gap-3 w-full justify-center items-center " >
                    <OTPInput name="otp" length={6} />
                </div>
                <div className=" flex flex-col gap-3 w-full " >
                    <CustomButton fullWidth variant="disabled" >Continue</CustomButton> 
                </div>
            </form>
        </FormikProvider>
    );
}