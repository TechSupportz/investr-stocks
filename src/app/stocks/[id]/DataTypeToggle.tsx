"use client"

import { Toggle, ToggleItem } from "@tremor/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

function DataTypeToggle() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const toggleDataType = (value: string) => {
        const newSearchParams = new URLSearchParams(searchParams.toString())
        newSearchParams.set("data", value)

        router.push(`${pathname}?${newSearchParams.toString()}`)
    }

    return (
        <Toggle color="zinc" defaultValue="1" onValueChange={toggleDataType}>
            <ToggleItem value="stocks" text="Stocks" />
            <ToggleItem value="earnings" text="Earnings" />
        </Toggle>
    )
}

export default DataTypeToggle
