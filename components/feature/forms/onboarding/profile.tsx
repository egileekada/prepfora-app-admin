"use client"
 
import { CustomButton, FormikField } from "@/components/ui";
import useAuth from "@/hooks/auth/useAuth";
import { FormikProvider } from "formik";

export default function ProfileForm() {
    const { formik } = useAuth();

    const option = [
        {
            label: "increase",
            value: "fool"
        }
    ]

    return (
        <FormikProvider value={formik}>
            <form className=" w-full p-6 flex flex-col gap-6 rounded-2xl bg-white ">
                <FormikField placeholder="Jane" name="firstname" label="First Name*" />
                <FormikField placeholder="Doe" name="email" label="Last Name*" />
                <FormikField placeholder="080XXXXXX" name="email" label="Phone Number*" />
                <FormikField as="select" options={option} placeholder="Lagos" name="email" label="State of Residence*" />
                <FormikField as="select" options={option} placeholder="Obafemi Awolowo University" name="email" label="University of Interest*" />
                <div className=" flex flex-col gap-4 w-full " >
                    <CustomButton fullWidth variant="disabled" >Continue</CustomButton> 
                </div>
            </form>
        </FormikProvider>
    );
}
