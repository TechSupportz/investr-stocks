import { Metric } from "@tremor/react"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"

export default function Home() {
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <Metric>Welcome to Investr Stocks</Metric>
            <Metric>Go to the dashboard or search for a stock!</Metric>
        </div>
    )
}
