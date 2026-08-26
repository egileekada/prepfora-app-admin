"use client"

import { LoadingLayout } from "@/components/layouts"
import { useRouter } from "next/navigation"
import { useEffect } from "react"


export default function HomePage() {

    const router = useRouter()

    useEffect(() => {
        router.push("/dashboard/home")
    }, [])

    return (
        <LoadingLayout loading={true} >
            <section>
                Home
            </section>
        </LoadingLayout>
    )
}