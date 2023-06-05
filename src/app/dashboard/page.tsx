import { db } from "@/firebase"
import { SellRequests } from "@/types/firestore"
import { Card, Metric, Text, Title } from "@tremor/react"
import { doc, getDoc } from "firebase/firestore"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"
import AccountCardIcon from "./AccountCardIcon"
import SellReqCard from "./SellReqCard"

async function getSellRequests() {
    const docRef = doc(db, "admin", "sellRequests")

    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
        return undefined
    }

    const data = docSnap.data() as SellRequests

    return data
}

async function getAccountDetails(access_token: string) {
    const res = await fetch(`https://api.tp.sandbox.fidorfzco.com/accounts`, {
        method: "GET",
        headers: {
            authorization: `Bearer ${access_token}`,
            accept: "application/vnd.fidor.de; version=1,text/json",
            "Content-Type": "application/json'",
        },
        cache: "no-store",
    })

    if (!res.ok) {
        throw new Error("Failed to fetch account details")
    }

    return res.json()
}

async function getTransactions(access_token: string) {
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
        console.log(res.statusText)
        throw new Error("Failed to fetch account details")
    }

    return res.json()
}

async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/")
    }

    const accountDetails = await getAccountDetails(session.accessToken)
    const transactions = await getTransactions(session.accessToken)

    console.log(">>> Account details", accountDetails)

    if (
        session.user.id === "95933444" &&
        session.user.email === "studenta23@email.com"
    ) {
        const sellRequests = await getSellRequests()

        return (
            <div className="flex h-full w-full gap-4">
                <Card className="w-1/3">
                    <Title className="mb-4 text-2xl font-semibold">
                        Sell Requests
                    </Title>
                    <div className="space-y-4">
                        {sellRequests ? (
                            Object.keys(sellRequests).length > 0 ? (
                                Object.keys(sellRequests).map(key => (
                                    <SellReqCard
                                        key={key}
                                        id={key}
                                        amount={sellRequests[key].amount}
                                        receiver={sellRequests[key].receiver}
                                        shareCount={
                                            sellRequests[key].shareCount
                                        }
                                        sharePrice={
                                            sellRequests[key].sharePrice
                                        }
                                        ticker={sellRequests[key].ticker}
                                        token={session.accessToken}
                                    />
                                ))
                            ) : (
                                <Text>No sell requests!</Text>
                            )
                        ) : (
                            <Text>No sell requests!</Text>
                        )}
                    </div>
                </Card>
                <div className="flex w-2/3 flex-col gap-4">
                    <Card className="h-1/3">
                        <Title className="mb-4 text-2xl font-semibold">
                            Your account
                        </Title>
                        <div className="flex gap-4">
                            <Card
                                className="flex gap-4"
                                decoration="top"
                                decorationColor="blue">
                                <AccountCardIcon icon="Identification" />
                                <div>
                                    <Text>Account ID</Text>
                                    <Metric>{accountDetails.data[0].id}</Metric>
                                </div>
                            </Card>
                            <Card
                                className="flex gap-4"
                                decoration="top"
                                decorationColor="cyan">
                                <AccountCardIcon icon="Library" />
                                <div>
                                    <Text>Account number</Text>
                                    <Metric>
                                        {accountDetails.data[0].account_number}
                                    </Metric>
                                </div>
                            </Card>
                            <Card
                                className="flex gap-4"
                                decoration="top"
                                decorationColor="teal">
                                <AccountCardIcon icon="Cash" />
                                <div>
                                    <Text>Balance</Text>
                                    <Metric>
                                        $
                                        {accountDetails.data[0].balance.toLocaleString(
                                            "en-US",
                                        )}
                                    </Metric>
                                </div>
                            </Card>
                        </div>
                    </Card>
                    <Card className="h-2/3">
                        <Title className="mb-4 text-2xl font-semibold">
                            Your transactions
                        </Title>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-full flex-col gap-4">
            <div className="flex h-[40%] gap-4">
                <Card className="w-4/5"></Card>
                <Card className="w-1/5"></Card>
            </div>
            <div className="flex h-[60%] gap-4">
                <Card className="w-2/6"></Card>
                <Card className="w-4/6"></Card>
            </div>
        </div>
    )
}

export default DashboardPage
