"use client";
import { LoadingLayout, ModalLayout } from "@/components/layouts";
import { Column, CustomButton, CustomField, CustomTable, CustomText, FormikField, FormikRichTextEditor } from "@/components/ui";
import useFAQ from "@/hooks/useFAQ";
import { IFaqResponse } from "@/types/faq";
import { Dropdown } from "@heroui/react";
import { FormikProvider } from "formik";
import { MoreCircle, SearchNormal1 } from "iconsax-reactjs";
import moment from "moment";
import { useState } from "react";

export default function FAQPage() {

    const [showModal, setShowModal] = useState("")
    const { useGetFAQ, page, setPage, formik, isLoading: isLoadingFAQ, setOpen, isOpen, setIndex, index, setIsOpenDelete, isOpenDelete, deleteFAQ } = useFAQ();

    const editHandler = (item: IFaqResponse) => {
        setShowModal("")
        setIndex(item.id)
        formik.setFieldValue("title", item.title)
        formik.setFieldValue("description", item.description)
        setOpen(true)
    }

    const deleteHandler = (item: IFaqResponse) => {
        setShowModal("")
        setIndex(item.id)
        setIsOpenDelete(true)
    }

    const columns: Column<IFaqResponse>[] = [
        {
            id: "title",
            name: "QUESTION",
            render: (_value, row) => {
                return (
                    <div className=" flex flex-col text-sm gap-2 ">
                        <CustomText type="body-lg-bold" className=" capitalize ">
                            {row?.title}
                        </CustomText>
                        <CustomText type="body-md" className=" capitalize text-gray-500 ">
                            <div dangerouslySetInnerHTML={{ __html: row?.description.slice(0, 100) + '...' }} />
                        </CustomText>
                    </div>
                );
            },
        },
        {
            id: "updated_at",
            name: "LAST UPDATED",
            render: (_value, row) => {
                return (
                    <div>
                        <CustomText type="body-md" className=" capitalize ">
                            {moment(row?.updated_at).fromNow()}
                        </CustomText>
                    </div>
                );
            },
        },
        {
            id: "action",
            name: "ACTION",
            render: (_value, row) => {
                return (
                    <Dropdown  >
                        <Dropdown.Trigger>
                            <button
                                onClick={() => setShowModal(row.id)}
                                aria-label="Open menu"
                                type="button"
                            >
                                <MoreCircle size={25} />
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Popover isOpen={showModal === row?.id} onOpenChange={() => setShowModal("")} >
                            <Dropdown.Menu >
                                <Dropdown.Item >
                                    <button type="button" onClick={() => editHandler(row)} >
                                        <CustomText type="body-md"  >
                                            Edit Question
                                        </CustomText>
                                    </button>
                                </Dropdown.Item>
                                <Dropdown.Item  >
                                    <button type="button" onClick={() => deleteHandler(row)} >
                                        <CustomText type="body-md" className=" text-error-350 " >
                                            Delete Question
                                        </CustomText>
                                    </button>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown.Popover>
                    </Dropdown>
                );
            },
        },
    ];

    const { data: faqs, isLoading } = useGetFAQ();

    return (
        <FormikProvider value={formik} >
            <section className=" w-full flex flex-col gap-8 ">
                <CustomText type="headline-sm">Frequently Asked Questions</CustomText>
                <div className=" flex w-full flex-col gap-4 ">
                    <div className=" w-full flex justify-between gap-6 items-center ">
                        <div className=" max-w-[300px] w-full " >
                            <CustomField
                                placeholder="Search FAQ"
                                prefix={
                                    <SearchNormal1 size={24} />
                                }
                            />
                        </div>
                        <div className=" w-[140px] ">
                            <CustomButton
                                fullWidth
                                className=" font-semibold "
                                onClick={() => setOpen(true)}>
                                {"Add New FAQ"}
                            </CustomButton>
                        </div>
                    </div>
                    <LoadingLayout
                        loading={isLoading}
                    // length={waitList?.data?.length}
                    >
                        <CustomTable<IFaqResponse>
                            columns={columns}
                            rows={faqs?.data ?? []}
                            rowKey="id"
                            total={faqs?.pagination?.total ?? 0}
                            page={page}
                            onPageChange={setPage}
                            rowsPerPage={10}
                        />
                    </LoadingLayout>
                </div>
                <ModalLayout open={isOpen} size="md" onOpenChange={setOpen}  >
                    <form onSubmit={formik.handleSubmit} className=" w-full flex flex-col gap-3 " >
                        <CustomText type="title-lg" >{index ? "Edit" : "Add New"} FAQ</CustomText>
                        <FormikField
                            label="Enter Question*"
                            placeholder="Enter title"
                            type="text"
                            name="title"
                        />
                        <FormikRichTextEditor
                            label="Enter Response*"
                            placeholder="Enter message"
                            name="description"
                        />
                        <div className=" w-full " >
                            <CustomButton
                                variant="disabled"
                                type="submit"
                                fullWidth
                                loading={isLoadingFAQ}
                                disabled={isLoadingFAQ || !formik.isValid}
                            >
                                {index ? "Update" : "Add"} FAQ
                            </CustomButton>
                        </div>
                    </form>
                </ModalLayout>
                <ModalLayout open={isOpenDelete} size="md" onOpenChange={setIsOpenDelete}  >
                    <form onSubmit={formik.handleSubmit} className=" w-full flex flex-col gap-3 " >
                        <CustomText type="title-lg" >Delete FAQ</CustomText>
                        <CustomText type="body-lg" >Are you sure you want to delete ths question?</CustomText>
                        <div className=" w-full flex gap-4 pt-4 " >
                            <CustomButton
                                variant="primary-outline"
                                type="submit"
                                fullWidth
                                onClick={() => setIsOpenDelete(false)}
                            >
                                Cancel
                            </CustomButton>
                            <CustomButton
                                variant="error"
                                type="submit"
                                fullWidth
                                onClick={() => deleteFAQ.mutate()}
                                loading={isLoadingFAQ}
                                disabled={isLoadingFAQ || !formik.isValid}
                            >
                                Delete FAQ
                            </CustomButton>
                        </div>
                    </form>
                </ModalLayout>
            </section>
        </FormikProvider>
    );
}