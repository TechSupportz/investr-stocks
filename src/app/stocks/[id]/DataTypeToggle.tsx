"use client"

import { Toggle, ToggleItem } from "@tremor/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

function DataTypeToggle() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const newSearchParams = new URLSearchParams(searchParams.toString())

    const toggleDataType = (value: string) => {
        newSearchParams.set("data", value)

        router.push(`${pathname}?${newSearchParams.toString()}`)
    }

    return (
        <Toggle
            color="zinc"
            defaultValue={searchParams.get("data") ?? "stocks"}
            onValueChange={toggleDataType}>
            <ToggleItem value="stocks" text="Stocks" />
            <ToggleItem value="earnings" text="Earnings" />
        </Toggle>
    )
}

export default DataTypeToggle
