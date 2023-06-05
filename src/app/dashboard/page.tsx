import { Button, Card, Metric, Text, Title } from "@tremor/react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { db } from "@/firebase"
import { doc, getDoc } from "firebase/firestore"
import { SellRequests } from "@/types/firestore"
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

async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/")
    }

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
                            Object.keys(sellRequests).map(key => (
                                <SellReqCard
                                    key={key}
                                    id={key}
                                    amount={sellRequests[key].amount}
                                    receiver={sellRequests[key].receiver}
                                    shareCount={sellRequests[key].shareCount}
                                    sharePrice={sellRequests[key].sharePrice}
                                    ticker={sellRequests[key].ticker}
                                    token={session.accessToken}
                                />
                            ))
                        ) : (
                            <Text>No sell requests!</Text>
                        )}
                    </div>
                </Card>
                <div className="w-2/3">
                    <Card className="h-1/3">
                        <Title className="mb-4 text-2xl font-semibold">
                            Account Balance
                        </Title>
                    </Card>
                    <Card className="h-2/3"></Card>
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
