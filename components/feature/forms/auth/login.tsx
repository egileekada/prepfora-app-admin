"use client"

import { GoogleBtn } from "@/components/common";
import { CustomButton, FormikField } from "@/components/ui";
import useAuth from "@/hooks/auth/useAuth";
import { FormikProvider } from "formik";

export default function LoginForm() {
    const { formik } = useAuth();

    return (
        <FormikProvider value={formik}>
            <form className=" w-full p-6 flex flex-col gap-6 rounded-2xl bg-white ">
                <FormikField placeholder="janedoe@mail.com" name="email" label="Email*" />
                <div className=" flex flex-col gap-4 w-full " >
                    <CustomButton fullWidth variant="disabled" >Continue</CustomButton>
                    <GoogleBtn />
                </div>
            </form>
        </FormikProvider>
    );
}
