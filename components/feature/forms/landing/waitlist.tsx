"use client"
import { CustomButton, CustomText, FormikField } from "@/components/ui";
import { IWaitlist } from "@/types/waitlist";
import { FormikProps, FormikProvider } from "formik";

export default function Waitlist(
    {
        formik,
        loading
    }: {
        formik: FormikProps<IWaitlist>;
        loading: boolean
    }
) {

    console.log(formik.errors);
    

    return (
        <FormikProvider value={formik} >
            <form onSubmit={formik.handleSubmit} className=" w-full flex flex-col gap-4 " >
                <div className=" w-full flex flex-col " >
                    <CustomText type="display-sm" >Get early access to Prepfora.</CustomText>
                    <CustomText type="body-lg" >We're putting the finishing touches on Prepfora. Join the waitlist today, and get <span className=" font-bold " >1 month FREE</span> subscription when we launch</CustomText>
                </div>
                <div className=" w-full flex flex-col gap-3 pt-3 " >
                    <div className=" w-full lg:flex-row flex-col flex gap-3 " >
                        <FormikField
                            name="first_name"
                            label="First Name*"
                        />
                        <FormikField
                            name="last_name"
                            label="Last Name*"
                        />
                    </div>
                    <FormikField
                        name="email"
                        label="Email*"
                    />
                </div>
                <div className=" w-full pt-4 " >
                    <CustomButton loading={loading} type="submit" variant="disabled" fullWidth >Notify Me</CustomButton>
                </div>
            </form>
        </FormikProvider>
    )
}