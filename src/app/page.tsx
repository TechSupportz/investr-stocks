import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import { Text } from "@tremor/react"
import { db } from "@/firebase"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { SellRequests } from "@/types/firestore"

async function getAccountDetails(access_token: string) {
    const res = await fetch(
        `https://api.tp.sandbox.fidorfzco.com/transactions`,
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

    const docRef = doc(db, "users", session.user.id)

    const docSnap = (await getDoc(docRef)).data()
    return (
        <div>
            <Text>{JSON.stringify(session, null, 2)}</Text>
            <br />
            {Object.keys(docSnap!).map(key => {
                return (
                    <div>
                        <Text>{key}</Text>
                        <Text>{JSON.stringify(docSnap![key])}</Text>
                    </div>
                )
            })}
            <Text>{JSON.stringify(account)}</Text>
        </div>
    )
}
