import { db } from "@/firebase"
import { SellRequests } from "@/types/firestore"
import {
    deleteField,
    doc,
    getDoc,
    increment,
    setDoc,
    updateDoc,
} from "firebase/firestore"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { receiver, amount, ticker, shareCount, sharePrice, reqID } =
        await req.json()

    if (
        !receiver ||
        !amount ||
        !ticker ||
        !shareCount ||
        !sharePrice ||
        !reqID
    ) {
        return NextResponse.json(
            {
                error: "Missing required fields. Please send receiver, amount, ticker, shareCount, sharePrice, reqID and token.",
            },
            { status: 400 },
        )
    }

    const docRef = doc(db, "admin", "sellRequests")

    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
        return NextResponse.json({
            error: `No sell requests found.`,
        })
    }

    const data = docSnap.data() as SellRequests

    const sellReq = data[reqID]

    if (!sellReq) {
        return NextResponse.json(
            {
                error: `No sell request found with ID ${reqID}.`,
            },
            { status: 404 },
        )
    }

    const stockDocRef = doc(db, "users", receiver)

    await setDoc(
        stockDocRef,
        {
            [ticker]: {
                shareCount: increment(shareCount),
                totalInvestment: increment(sharePrice * shareCount),
            },
        },
        { merge: true },
    )

    await updateDoc(docRef, {
        [reqID]: deleteField(),
    })

    return NextResponse.json(
        {
            message: `Successfully rejected and reverted sale of ${shareCount} ${ticker} at ${sharePrice} for ${amount} to ${receiver}`,
        },
        {
            status: 200,
        },
    )
}
