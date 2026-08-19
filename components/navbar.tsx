"use client";

import NextLink from "next/link";
import { Logo } from "@/components/icons";
import { CustomButton } from "./ui";
import { usePathname } from "next/navigation";

export const Navbar = () => {

    const pathname = usePathname()
    const listItems = [
        {
            label: "How it works",
            href: "/about",
        },
        {
            label: "Pricing",
            href: "/pricing",
        },
        {
            label: "Contact",
            href: "/contact",
        },
    ];

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
            <header className="mx-auto flex h-25 max-w-[1280px] items-center justify-between gap-4 px-6">
                <div className="flex items-center gap-4">
                    <NextLink className="flex items-center gap-1" href="/">
                        <Logo width={129} />
                    </NextLink>
                </div>
                <div className="flex items-center gap-6 ">
                    {listItems.map((item) => (
                        <NextLink className={` ${item?.href === pathname ? " text-primary-300 " : " "} `} key={item.href} href={item.href}>
                            {item.label}
                        </NextLink>
                    ))}
                </div>
                <CustomButton variant="primary">Join Waitlist</CustomButton>
            </header>
        </nav>
    );
};
