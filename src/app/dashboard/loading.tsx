"use client"

import { Card } from "@tremor/react"

function DashboardLoading() {
    return (
        <div className="flex h-full animate-pulse flex-col gap-4">
            <div className="flex h-[40%] gap-4">
                <Card className="w-4/5 bg-slate-200"></Card>
                <Card className="w-1/5 bg-slate-200"></Card>
            </div>
            <div className="flex h-[60%] gap-4">
                <Card className="w-2/6 bg-slate-200"></Card>
                <Card className="w-4/6 bg-slate-200"></Card>
            </div>
        </div>
    )
}

export default DashboardLoading
