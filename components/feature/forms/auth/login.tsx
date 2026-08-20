"use client"

import { GoogleBtn } from "@/components/common";
import { CustomButton, FormikField } from "@/components/ui";
import useAuth from "@/hooks/auth/useAuth";
import { FormikProvider } from "formik";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const { formik } = useAuth();

    const router = useRouter()

    return (
        <FormikProvider value={formik}>
            <form className=" w-full p-6 flex flex-col gap-6 rounded-2xl bg-white ">
                <FormikField placeholder="janedoe@mail.com" name="email" label="Email*" />
                <FormikField placeholder="*******" name="password" label="Password*" />
                <div className=" flex flex-col gap-4 w-full " >
                    <CustomButton onClick={()=> router.push("/dashboard/home")} fullWidth variant="disabled" >Log In</CustomButton> 
                </div>
            </form>
        </FormikProvider>
    );
}
