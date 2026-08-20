import { CustomText } from "@/components/ui";

export default function HomePage() {
    const data = [
        {
            title: "Total Students",
            number: "45,200",
            perc: "2% Growth since last month",
        },
        {
            title: "Active Students",
            number: "12,850",
            perc: "28% of total student base",
        },
        {
            title: "New Sign Ups today",
            number: "245",
            perc: "Real-time tracking active",
        },
        {
            title: "Total Exams Taken",
            number: "70,000",
            perc: "Cumulative since inception",
        },
        {
            title: "Total Students",
            number: "45,200",
            perc: "2% Growth since last month",
        },
        {
            title: "Total Students",
            number: "45,200",
            perc: "2% Growth since last month",
        },
    ];

    return (
        <section className=" w-full flex flex-col gap-8 ">
            <CustomText type="title-lg">Hello Admin!</CustomText>
            <div className=" w-full grid-cols-3 grid gap-6 ">
                {data?.map((item, index) => {
                    return (
                        <div
                            className=" w-full flex flex-col gap-4 bg-white rounded-lg p-4 "
                            key={index}
                        >
                            <CustomText type="body-sm">
                                {item?.title}
                            </CustomText>
                            <CustomText
                                type="headline-lg"
                                className=" font-semibold "
                            >
                                {item?.number}
                            </CustomText>
                            <CustomText type="body-md">{item?.perc}</CustomText>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
