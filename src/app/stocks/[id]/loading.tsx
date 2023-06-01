"use client"

import { Card} from "@tremor/react"

function StocksLoading() {
    return (
        <div className="flex h-full animate-pulse gap-4">
            <div className="flex h-full w-[70%] flex-col gap-4">
                <Card className="flex h-[20%] items-center gap-8 bg-slate-200"></Card>
                <Card className="h-[55%] bg-slate-200"></Card>
                <div className="flex h-[25%] gap-4">
                    <Card className="bg-slate-200" />
                    <Card className="bg-slate-200" />
                </div>
            </div>
            <div className="flex h-full w-[30%] flex-col gap-4">
                <Card className="h-3/5 bg-slate-200" />
                <Card className="h-2/5 bg-slate-200" />
            </div>
        </div>
    )
}

export default StocksLoading
