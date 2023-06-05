// Fidor Main account number: 4799894390

import { db } from "@/firebase"
import { doc, increment, setDoc } from "firebase/firestore"
import { nanoid } from "nanoid"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { token, accountId, amount, ticker, sharePrice, shareCount } =
        await req.json()

    if (
        !token ||
        !accountId ||
        !amount ||
        !ticker ||
        !sharePrice ||
        !shareCount
    ) {
        return NextResponse.json(
            {
                error: "Missing required fields. Please send token, accountId, amount, ticker, sharePrice and shareCount.",
            },
            { status: 400 },
        )
    }

    const body = {
        external_uid: nanoid(),
        account_id: accountId,
        receiver: "studenta23@email.com",
        amount: amount * 100,
        subject: `INVESTR-STOCKS - ${shareCount} shares of ${ticker} at ${sharePrice}`,
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
                error: `Could not buy stock`,
                details: data,
            },
            {
                status: res.status,
            },
        )
    }

    const docRef = doc(db, "users", accountId)
    await setDoc(
        docRef,
        {
            [ticker]: {
                shareCount: increment(shareCount),
                totalInvestment: increment(sharePrice * shareCount),
            },
        },
        { merge: true },
    )

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
