import { db } from "@/firebase"
import { doc, increment, setDoc } from "firebase/firestore"
import { nanoid } from "nanoid"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { email, accountId, amount, ticker, sharePrice, shareCount } =
        await req.json()

    if (!accountId || !amount || !ticker || !sharePrice || !shareCount) {
        return NextResponse.json(
            {
                error: "Missing required fields. Please send email, accountId, amount, ticker, sharePrice and shareCount.",
            },
            {
                status: 400,
            },
        )
    }

    const id = nanoid(10)

    const docRef = doc(db, "admin", "sellRequests")

    await setDoc(
        docRef,
        {
            [id]: {
                amount,
                receiver: accountId,
                shareCount,
                sharePrice,
                ticker,
            },
        },
        { merge: true },
    )

    const stockDocRef = doc(db, "users", accountId)
    await setDoc(
        stockDocRef,
        {
            [ticker]: {
                shareCount: increment(-shareCount),
                totalInvestment: increment(-(sharePrice * shareCount)),
            },
        },
        { merge: true },
    )

    return NextResponse.json(
        {
            message: `Successfully requested to sell ${shareCount} shares of ${ticker} at ${sharePrice} for ${amount} to ${accountId}`,
        },
        {
            status: 200,
        },
    )
}
