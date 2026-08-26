"use client";
import { LoadingLayout, ModalLayout } from "@/components/layouts";
import { Column, CustomButton, CustomTable, CustomText, FormikField, FormikRichTextEditor } from "@/components/ui";
import { dateFormat } from "@/config/dateFormat";
import useWaitList from "@/hooks/useWaitList";
import { IWaitlistData } from "@/types/waitlist";
import { Checkbox } from "@heroui/react";
import { FormikProvider } from "formik";


const summaryCards = [
    {
        title: "Total Students on Waitlist",
        number: "5,200",
    },
    {
        title: "Joined Today",
        number: "50",
    },
];

export default function WaitListPage() {

    const { useGetWaitList, page, setPage, formik, isLoading: isLoadingInviteUser, setOpen, isOpen } = useWaitList();

    const columns: Column<IWaitlistData>[] = [
        {
            id: "select",
            name: "",
            render: (_value, row) => {
                const selectedEmails: string[] = Array.isArray(formik.values.emails)
                    ? formik.values.emails
                    : [];
                const isChecked = Boolean(row?.email && selectedEmails.includes(row.email));

                const handleChange = (selected: boolean) => {
                    if (!row?.email) return;
                    if (selected) {
                        formik.setFieldValue("emails", [...selectedEmails, row.email]);
                    } else {
                        formik.setFieldValue(
                            "emails",
                            selectedEmails.filter((item: string) => item !== row.email)
                        );
                    }
                };

                return (
                    <Checkbox
                        aria-label={`Select ${row?.first_name || "row"}`}
                        isSelected={isChecked}
                        onChange={handleChange}
                    >
                        <Checkbox.Content className="border rounded-md">
                            <Checkbox.Control >
                                <Checkbox.Indicator />
                            </Checkbox.Control>
                        </Checkbox.Content>
                    </Checkbox>
                );
            },
        },
        {
            id: "name",
            name: "Name",
            render: (_value, row) => {
                return (
                    <div className=" flex flex-col text-sm ">
                        <CustomText type="body-lg-bold" className=" capitalize ">
                            {row?.first_name + " " + row?.last_name}
                        </CustomText>
                    </div>
                );
            },
        },
        { id: "email", name: "Email" },
        { id: "phone_number", name: "PHONE NUMBER" },
        {
            id: "created_at",
            name: "DATE JOINED",
            render: (_value, row) => {
                return (
                    <div>
                        <CustomText type="body-lg" className=" capitalize ">
                            {dateFormat(row?.created_at)}
                        </CustomText>
                    </div>
                );
            },
        },
    ];
    const { data: waitList, isLoading } = useGetWaitList();


    return (
        <FormikProvider value={formik} >
            <section className=" w-full flex flex-col gap-8 ">
                <CustomText type="headline-sm">Waitlist Management</CustomText>
                <div className=" w-full grid-cols-2 grid gap-6 ">
                    {summaryCards.map((item, index) => {
                        return (
                            <div
                                className=" w-full flex flex-col gap-4 bg-white rounded-lg p-4 "
                                key={index}
                            >
                                <CustomText type="body-sm">{item?.title}</CustomText>
                                <CustomText type="headline-lg" className=" font-semibold ">
                                    {item?.number}
                                </CustomText>
                            </div>
                        );
                    })}
                </div>
                <div className=" flex w-full flex-col gap-4 ">
                    <div className=" w-full flex justify-between items-center ">
                        <CustomText type="headline-sm">Students</CustomText>
                        <div className=" w-[198px] ">
                            <CustomButton
                                fullWidth
                                className=" font-semibold "
                                isDisabled={formik.values.emails.length === 0}
                                onClick={() => {
                                    if (!Array.isArray(formik.values.emails) || formik.values.emails.length === 0) {
                                        const allEmails = waitList?.data?.map((item) => item.email).filter(Boolean) ?? [];
                                        formik.setFieldValue("emails", allEmails);
                                    }
                                    setOpen(true);
                                }}
                            >
                                {"Email All"}
                            </CustomButton>
                        </div>
                    </div>
                    <LoadingLayout
                        loading={isLoading}
                    // length={waitList?.data?.length}
                    >
                        <CustomTable<IWaitlistData>
                            columns={columns}
                            rows={waitList?.data ?? []}
                            rowKey="id"
                            total={waitList?.pagination?.total ?? 0}
                            page={page}
                            onPageChange={setPage}
                            rowsPerPage={10}
                        />
                    </LoadingLayout>
                </div>
                <ModalLayout open={isOpen} size="md" onOpenChange={setOpen}  >
                    <form onSubmit={formik.handleSubmit} className=" w-full flex flex-col gap-3 " >
                        <CustomText type="title-lg" >Send an Email</CustomText>
                        <FormikField
                            label="Email Subject*"
                            placeholder="Enter subject"
                            type="text"
                            name="subject"
                        />
                        <FormikRichTextEditor
                            label="Message*"
                            placeholder="Enter message"
                            name="message"
                        />
                        <div className=" w-full " >
                            <CustomButton
                                variant="disabled"
                                type="submit"
                                fullWidth
                                loading={isLoadingInviteUser}
                                disabled={isLoadingInviteUser || !formik.isValid}
                            >
                                Invite
                            </CustomButton>
                        </div>
                    </form>
                </ModalLayout>
            </section>
        </FormikProvider>
    );
}