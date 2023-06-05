import { db } from "@/firebase"
import { UserStocks } from "@/types/firestore"
import { BadgeDelta, Card, Metric, Text, Title } from "@tremor/react"
import { doc, getDoc } from "firebase/firestore"
import PurchaseCard from "./PurchaseCard"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

async function getStockDetails(ticker: string) {
    const quoteRes = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
    )

    const exchangeRateRes = await fetch(
        "https://api.exchangerate.host/latest?base=USD&symbols=SGD&places=2",
    )

    if (!quoteRes.ok) {
        throw new Error("Failed to fetch stock card details")
    }

    let [quote, exchangeRate] = await Promise.all([
        quoteRes.json(),
        exchangeRateRes.json(),
    ])

    if (!quote) {
        throw new Error("Stock card details undefined")
    }

    if (quote.Note) {
        throw new Error("Alpha Vantage API rate limit exceeded")
    }

    if (exchangeRate.rates.SGD) {
        console.log(">>> exchangeRate", exchangeRate)
        exchangeRate = exchangeRate.rates.SGD
    }

    if (!exchangeRate.rates.SGD) {
        console.log(">>> exchangeRate", "Unable to fetch exchange rate")
        exchangeRate = 1.36
    }

    const response = {
        buy:
            parseFloat(quote["Global Quote"]["05. price"].slice(0, 6)) *
            exchangeRate,
        sell:
            parseFloat(quote["Global Quote"]["04. low"].slice(0, 6)) *
            exchangeRate,
        isUp: quote["Global Quote"]["09. change"][0] !== "-",
    }

    return response
}

async function getUserInvestments(
    ticker: string,
    buyPrice: number,
    accountId: string,
) {
    const docRef = doc(db, "users", accountId)

    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
        return undefined
    }

    const data = docSnap.data() as UserStocks

    if (!data[ticker]) {
        return undefined
    }

    const returns =
        (data[ticker].shareCount * buyPrice - data[ticker].totalInvestment) /
        data[ticker].totalInvestment

    return {
        shareCount: data[ticker].shareCount,
        totalInvestment: data[ticker].totalInvestment,
        returns: returns,
    }
}

interface SummaryCardProps {
    ticker: string
}

async function SummaryCard(props: SummaryCardProps) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return <Text>Not logged in</Text>
    }

    const tradeDetails = await getStockDetails(props.ticker)

    const userInvestments = await getUserInvestments(
        props.ticker,
        tradeDetails.buy,
        session.user.id,
    )

    return (
        <Card className="h-4/6 py-4">
            <div>
                <Title className="mb-2 text-2xl font-semibold">Summary</Title>
                <Card className="px-5 py-4">
                    {userInvestments ? (
                        <>
                            <div className="flex w-full items-start justify-between">
                                <Text>Your investments</Text>
                                <BadgeDelta className="" deltaType={"increase"}>
                                    {userInvestments.returns.toFixed(2)}%
                                </BadgeDelta>
                            </div>
                            <Metric>
                                ${userInvestments.totalInvestment.toFixed(2)}
                            </Metric>
                        </>
                    ) : (
                        <Text>You have no investments in this stock</Text>
                    )}
                </Card>
            </div>
            <div>
                <Title className="my-3 text-2xl font-semibold">Trade</Title>
                <PurchaseCard
                    ticker={props.ticker}
                    buyPrice={tradeDetails.buy}
                    sellPrice={tradeDetails.sell}
                    isUp={tradeDetails.isUp}
                    session={session}
                />
            </div>
        </Card>
    )
}

export default SummaryCard
