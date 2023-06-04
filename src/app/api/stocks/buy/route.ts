// Fidor Main account number: 4799894390

import { nanoid } from "nanoid"

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
        return {
            status: 400,
            body: {
                error: "Missing required fields. Please send token, accountId, amount, ticker, sharePrice and shareCount.",
            },
        }
    }

    const body = {
        external_uid: nanoid(),
        account_id: accountId,
        receiver: "studenta23@email.com",
        amount: amount,
        subject: `INVESTR-STOCKS | ${shareCount} shares of ${ticker} at ${sharePrice}`,
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
        return {
            status: res.status,
            body: {
                error: `Could not buy stock`,
                details: data,
            },
        }
    }

    console.log(data)
    return {
        status: 200,
        body: {
            message: "Stock bought successfully",
            data: data,
        },
    }
}
