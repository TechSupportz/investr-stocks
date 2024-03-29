"use client"

import {
    CashIcon,
    DatabaseIcon,
    IdentificationIcon,
    LibraryIcon,
} from "@heroicons/react/outline"
import { Icon } from "@tremor/react"
import React from "react"

interface AccountCardIconProps {
    icon: "Identification" | "Library" | "Cash" | "Database"
}

function AccountCardIcon({ icon }: AccountCardIconProps) {
    if (icon === "Identification") {
        return (
            <Icon
                icon={IdentificationIcon}
                variant="light"
                size="xl"
                color="blue"
            />
        )
    }

    if (icon === "Library") {
        return (
            <Icon icon={LibraryIcon} variant="light" size="xl" color="cyan" />
        )
    }

    if (icon === "Cash") {
        return <Icon icon={CashIcon} variant="light" size="xl" color="teal" />
    }

    if (icon === "Database") {
        return (
            <Icon icon={DatabaseIcon} variant="light" size="xl" color="teal" />
        )
    }
}

export default AccountCardIcon
