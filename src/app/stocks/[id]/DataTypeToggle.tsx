"use client"

import { Toggle, ToggleItem } from "@tremor/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

function DataTypeToggle() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [value, setValue] = useState(searchParams.get("data") ?? "stocks")

    const newSearchParams = new URLSearchParams(searchParams.toString())

    const toggleDataType = (value: string) => {
        newSearchParams.set("data", value)
        setValue(value)
        router.push(`${pathname}?${newSearchParams.toString()}`)
    }

    return (
        <Toggle
            color="zinc"
            defaultValue={searchParams.get("data") ?? "stocks"}
            value={value}
            onValueChange={toggleDataType}>
            <ToggleItem value="stocks" text="Stocks" />
            <ToggleItem value="earnings" text="Earnings" />
        </Toggle>
    )
}

export default DataTypeToggle
