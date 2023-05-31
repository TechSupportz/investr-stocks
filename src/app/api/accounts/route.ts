import { fidorBaseURL } from "@/types/fidorAPI"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const res = await fetch(`${fidorBaseURL}/accounts`, {
            method: "GET",
            headers: {
                authorization: `${req.headers.get("authorization")}`,
                accept: "application/vnd.fidor.de; version=1+json",
                "content-type": "application/json",
            },
        })

        if (!res.ok) {
            throw new Error("Failed to fetch account details")
        }

        const data = await res.json()
        return NextResponse.json({ data })
    } catch (error) {
        throw new Error("Error fetching account")
    }
}
