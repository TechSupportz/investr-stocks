import { fidorBaseURL } from "@/types/fidorAPI"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const res = await fetch(`${fidorBaseURL}/accounts`, {
        method: "GET",
        headers: {
            authorization: `${req.headers.get("authorization")}`,
            accept: "application/vnd.fidor.de; version=1+json",
            "content-type": "application/json",
        },
    })

    if (!res.ok) {
        return NextResponse.json(
            { error: "Could not get accounts" },
            { status: res.status },
        )
    }

    const data = await res.json()
    return NextResponse.json({ data }, { status: res.status })
}
