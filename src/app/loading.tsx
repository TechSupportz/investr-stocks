"use client"

import { Pinwheel } from "@uiball/loaders"

function loading() {
    return (
        <div className="grid h-full place-items-center">
            <Pinwheel size={48} color="#60a5fa" />
        </div>
    )
}

export default loading
