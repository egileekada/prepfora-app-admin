"use client"

import { IoIosArrowDropleft } from "react-icons/io";
import { CustomText } from "../ui";
import { useRouter } from "next/navigation";

interface Props {
    children: React.ReactNode;
    title?: string;
    body?: string;
    btnlink?: string,
    btn?: string
}

export default function AuthLayout({ children, title, body, btn, btnlink }: Props) {

    const { back, push } = useRouter()

    return (
        <section className=" flex-1 flex py-6 flex-col justify-center items-center ">
            <div className=" max-w-[460px] w-full flex flex-col gap-8 ">
                <button onClick={()=> back()} className=" flex items-center gap-2 ">
                    <IoIosArrowDropleft size={24} />
                    <CustomText type="body-md">Back</CustomText>
                </button>
                <div className=" flex flex-col gap-2 mt-4 ">
                    <CustomText type="display-md" className=" font-semibold ">
                        {title ?? "Create Account"}
                    </CustomText>
                    <CustomText type="body-lg" >
                        {body ?? "Already have an account?"} {btn && (
                            <span onClick={()=> push(btnlink ?? "/")} className=" text-secondary-450 font-bold cursor-pointer " >{btn ?? "Login"}</span>
                        )}
                    </CustomText>
                </div>
                {children}
            </div>
        </section>
    );
}
