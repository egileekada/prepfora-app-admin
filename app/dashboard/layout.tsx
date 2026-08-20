import { Sidebar } from "@/components/common";


export default function DashboardLayout ({
    children,
}: {
    children: React.ReactNode;
}) {
    return(
        <section className=" w-full h-screen overflow-hidden flex  bg-primary-50 " >
            <Sidebar />
            <div className=" flex-1 py-10 px-6 overflow-y-auto " >
                {children}
            </div>
        </section>
    )
}