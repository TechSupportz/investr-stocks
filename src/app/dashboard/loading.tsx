"use client"

import { Card } from "@tremor/react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

function DashboardLoading() {
    const { data: session } = useSession()

    // if (!session) {
    //     redirect("/")
    // }

    if (
        session?.user.id === "95933444" &&
        session.user.email === "studenta23@email.com"
    ) {
        return (
            <div className="flex h-full w-full animate-pulse gap-4">
                <Card className="w-1/3 bg-slate-200" />
                <div className="flex w-2/3 flex-col gap-4">
                    <Card className="h-1/3 bg-slate-200" />
                    <Card className="h-2/3 bg-slate-200" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-full animate-pulse flex-col gap-4">
            <div className="flex h-[40%] gap-4">
                <Card className="w-4/5 bg-slate-200" />
                <Card className="w-1/5 bg-slate-200" />
            </div>
            <div className="flex h-[60%] gap-4">
                <Card className="w-2/6 bg-slate-200" />
                <Card className="w-4/6 bg-slate-200" />
            </div>
        </div>
    )
}

export default DashboardLoading
