"use client";
import { LoadingLayout } from "@/components/layouts";
import { Column, CustomButton, CustomTable, CustomText } from "@/components/ui";
import { dateFormat } from "@/config/dateFormat";
import useWaitList from "@/hooks/useWaitList";
import { IWaitlistData } from "@/types/waitlist";

const columns: Column<IWaitlistData>[] = [
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
        id: "user.firstName",
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
    const { useGetWaitList, page, setPage } = useWaitList();
    const { data: waitList, isLoading, isRefetching } = useGetWaitList();

    console.log(waitList?.data);
    

    return (
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
                        <CustomButton fullWidth className=" font-semibold ">
                            Email All
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
        </section>
    );
}