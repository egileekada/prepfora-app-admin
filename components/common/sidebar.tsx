"use client"
import {
    Book,
    ChartSquare,
    Element4,
    Like,
    Profile2User,
    ShieldSecurity,
    Sms,
} from "iconsax-reactjs";
import { Logo } from "../icons";
import { CustomText } from "../ui";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {

    const pathname = usePathname()
    const { push } = useRouter()

    const sidebar_link = [
        {
            name: "Dashboard",
            link: "/dashboard/home",
            icon: Element4,
            disable: false
        },
        // {
        //     name: "Question Library",
        //     link: "/dashboard/question",
        //     icon: Element4,
        //     disable: false
        // },
        {
            name: "Students",
            link: "/dashboard/student",
            icon: Book,
            disable: false
        },
        {
            name: "FAQ",
            link: "/dashboard/faq",
            icon: Like,
            disable: false
        },
        {
            name: "Analytics",
            link: "/dashboard/analytics",
            icon: ChartSquare,
            disable: false
        },
        {
            name: "Waitlist",
            link: "/dashboard/waitlist",
            icon: Profile2User,
            disable: false
        },
        {
            name: "Contact",
            link: "/dashboard/contact",
            icon: Sms,
            disable: false
        },
        {
            name: "Terms",
            link: "/dashboard/terms",
            icon: Book,
            disable: true
        },
        {
            name: "Privacy Policy",
            link: "/dashboard/policy",
            icon: ShieldSecurity,
            disable: true
        },
    ];

    return (
        <div className=" w-fit h-screen ">
            <div className=" w-[263px] h-screen bg-primary-300 py-10 items-start flex flex-col px-6 ">
                <div className=" ">
                    <Logo color="white" width={150} />
                </div>
                <div className=" w-full flex-col flex pt-10 gap-2 ">
                    {sidebar_link?.map((item, index) => {
                        return (
                            <button
                                key={index}
                                disabled={item?.disable}
                                onClick={() => push(item.link)}
                                className={` ${pathname === item?.link ? " bg-primary-550 " : ""} cursor-pointer  px-3 gap-4 flex items-center text-white w-full h-[50px] rounded-lg `}
                            >
                                <item.icon size={24} />
                                <CustomText type="body-lg">
                                    {item?.name}
                                </CustomText>
                            </button>
                        );
                    })}
                </div>
                <div className=" p-4 w-full rounded-2xl bg-primary-350 flex items-center gap-4 mt-auto text-white ">
                    <div className=" border border-white rounded-full w-10 h-10 bg-white "></div>
                    <div>
                        <CustomText type="body-lg">Jane Doe</CustomText>
                        <CustomText type="body-sm">Admin</CustomText>
                    </div>
                </div>
            </div>
        </div>
    );
}
