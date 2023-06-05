import { db } from "@/firebase"
import { deleteField, doc, updateDoc } from "firebase/firestore"
import { nanoid } from "nanoid"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { receiver, amount, ticker, shareCount, reqID, token } =
        await req.json()

    if (!receiver || !amount || !ticker || !shareCount || !reqID || !token) {
        return NextResponse.json(
            {
                error: "Missing required fields. Please send receiver, amount, ticker, shareCount, reqID and token.",
            },
            { status: 400 },
        )
    }

    const body = {
        external_uid: nanoid(),
        account_id: 95933444,
        receiver,
        amount: amount * 100,
        subject: `INVESTR-STOCKS - ${receiver} sold ${shareCount} shares of ${ticker}`,
    }

    const res = await fetch(
        "https://api.tp.sandbox.fidorfzco.com/internal_transfers",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.fidor.de; version=1,text/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        },
    )

    const data = await res.json()

    if (!res.ok) {
        console.log(data)
        return NextResponse.json(
            {
                error: `Could not sell stock`,
                details: data,
            },
            {
                status: res.status,
            },
        )
    }

    const docRef = doc(db, "admin", "sellRequests")

    await updateDoc(docRef, {
        [reqID]: deleteField(),
    })

    console.log(data)
    return NextResponse.json(
        {
            message: "Stock bought successfully",
            data: data,
        },
        {
            status: res.status,
        },
    )
}
