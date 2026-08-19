"use client"
import { CustomButton, FormikField } from "@/components/ui";
import { IContact } from "@/types/waitlist";
import { FormikProps, FormikProvider } from "formik";

export default function ContactForm({
    formik,
    loading
}: {
    formik: FormikProps<IContact>;
    loading: boolean
}) {

    console.log(formik.errors);

    return (
        <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit} className=" w-full flex flex-col gap-3 ">
                <div className=" lg:flex-row flex-col flex w-full gap-4 ">
                    <FormikField name="first_name" label="First Name" />
                    <FormikField name="last_name" label="Last Name" />
                </div>
                <FormikField name="email" label="Email" />
                <FormikField as="textarea" name="message" label="Subject" />
                <div className=" w-full pt-4 ">
                    <CustomButton type="submit" loading={loading} variant="disabled" fullWidth>
                        Send Message
                    </CustomButton>
                </div>
            </form>
        </FormikProvider>
    );
}
