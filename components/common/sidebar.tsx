"use client"
import {
    Book,
    ChartSquare,
    Element4,
    Like,
    People,
    Profile2User,
    ShieldSecurity,
    Sms,
} from "iconsax-reactjs";

import { Logo } from "../icons";
import { CustomText } from "../ui";
import { usePathname, useRouter } from "next/navigation";

import { AdminUser } from "@/types/auth";
import { clearSession } from "@/config/httpService";
import { LogOut } from "lucide-react";

interface SidebarProps {
    admin?: AdminUser | null;
}

export default function Sidebar({ admin }: SidebarProps) {

    const pathname = usePathname();
    const { push } = useRouter();

    const handleLogout = () => {
        clearSession();
        push("/");
    };

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
            name: "Affiliates",
            link: "/dashboard/affiliate",
            icon: People,
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

    const adminName = admin?.name || "Admin";
    const adminRole = admin?.role?.name || "Administrator";
    const initials = adminName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "A";

    return (
        <div className=" w-fit h-screen ">
            <div className=" w-[263px] h-screen bg-primary-300 py-10 items-start flex flex-col px-6 ">
                <div className=" ">
                    <Logo color="white" width={150} />
                </div>
                <div className=" w-full flex-col flex pt-10 gap-2 ">
                    {sidebar_link?.map((item, index) => {
                        const isActive =
                            pathname === item?.link ||
                            (item?.link !== "/dashboard/home" &&
                                pathname.startsWith(item?.link));
                        return (
                            <button
                                key={index}
                                disabled={item?.disable}
                                onClick={() => push(item.link)}
                                className={` ${isActive ? " bg-[#0B1739] shadow-sm font-semibold " : " hover:bg-white/10 "} cursor-pointer px-3 gap-4 flex items-center text-white w-full h-[50px] rounded-xl transition-all `}
                            >
                                <item.icon size={24} />
                                <CustomText type="body-lg">
                                    {item?.name}
                                </CustomText>
                            </button>
                        );
                    })}
                </div>

                <div className=" p-4 w-full rounded-2xl bg-primary-350 flex items-center justify-between gap-3 mt-auto text-white ">
                    <div className="flex items-center gap-3 overflow-hidden">
                        {admin?.profile_picture ? (
                            <img
                                src={admin.profile_picture}
                                alt={adminName}
                                className="border border-white rounded-full w-10 h-10 object-cover shrink-0"
                            />
                        ) : (
                            <div className="border border-white rounded-full w-10 h-10 bg-white/20 flex items-center justify-center font-bold text-white shrink-0 text-sm">
                                {initials}
                            </div>
                        )}
                        <div className="truncate">
                            <CustomText type="body-lg" className="truncate font-medium">
                                {adminName}
                            </CustomText>
                            <CustomText type="body-sm" className="text-white/70 text-xs truncate">
                                {adminRole}
                            </CustomText>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Log out"
                        className="text-white/70 hover:text-white transition p-1.5 rounded-lg hover:bg-white/10 cursor-pointer shrink-0"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

