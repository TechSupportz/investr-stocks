import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import { Text } from "@tremor/react"

async function getAccountDetails(access_token: string) {
    const res = await fetch(
        `https://api.tp.sandbox.fidorfzco.com/transactions?per_page=100`,
        {
            method: "GET",
            headers: {
                authorization: `Bearer ${access_token}`,
                accept: "application/vnd.fidor.de; version=1,text/json",
            },
            cache: "no-store",
        },
    )

    if (!res.ok) {
        throw new Error("Failed to fetch account details")
    }

    return res.json()
}

export default async function Home() {
    const session = await getServerSession(authOptions)
    // console.log(">>>", session)

    if (!session) {
        return <Text>Not logged in</Text>
    }

    const account = await getAccountDetails(session.accessToken)

    return (
        <div>
            <Text>{JSON.stringify(session, null, 2)}</Text>
            <br />
            <Text>{account && JSON.stringify(account.data, null, 2)}</Text>
        </div>
    )
}
