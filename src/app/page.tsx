import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import { Metric, Text } from "@tremor/react"
import { db } from "@/firebase"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { SellRequests } from "@/types/firestore"
import { redirect } from "next/navigation"

export default async function Home() {
    const session = await getServerSession(authOptions)
    // console.log(">>>", session)

    return (
        <div>
            <Metric>Welcome to Investr Stocks</Metric>
            <Metric>Login to get started!</Metric>
        </div>
    )
}
