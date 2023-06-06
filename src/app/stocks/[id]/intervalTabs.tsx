"use client"

import { Tab, TabList, Toggle, ToggleItem } from "@tremor/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

function IntervalToggle() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [value, setValue] = useState(searchParams.get("interval") ?? "today")

    const newSearchParams = new URLSearchParams(searchParams.toString())

    const toggleInterval = (value: string) => {
        newSearchParams.set("interval", value)
        setValue(value)
        router.push(`${pathname}?${newSearchParams.toString()}`)
    }

    return (
        <TabList
            color="blue"
            defaultValue={searchParams.get("data") ?? "today"}
            value={value}
            onValueChange={toggleInterval}>
            <Tab value="today" text="Today" />
            <Tab value="month" text="Month" />
            <Tab value="max" text="Max" />
        </TabList>
    )
}

export default IntervalToggle
