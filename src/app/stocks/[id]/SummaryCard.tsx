import { BadgeDelta, Card, Title, Text, Metric } from "@tremor/react"
import PurchaseCard from "./PurchaseCard"

async function getStockDetails(ticker: string) {
    const quoteRes = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
    )

    if (!quoteRes.ok) {
        throw new Error("Failed to fetch stock card details")
    }

    const quote = await quoteRes.json()

    if (!quote) {
        throw new Error("Stock card details undefined")
    }

    if (quote.Note) {
        throw new Error("Alpha Vantage API rate limit exceeded")
    }

    const response = {
        buy: quote["Global Quote"]["05. price"].slice(0, 6),
        sell: quote["Global Quote"]["04. low"].slice(0, 6),
        isUp: quote["Global Quote"]["09. change"][0] !== "-",
    }

    return response
}

interface SummaryCardProps {
    ticker: string
}

async function SummaryCard(props: SummaryCardProps) {
    const tradeDetails = await getStockDetails(props.ticker)

    return (
        <Card className="h-4/6 py-4">
            <div>
                <Title className="mb-2 text-2xl font-semibold">Summary</Title>
                <Card className="px-5 py-4">
                    <div className="flex w-full items-start justify-between">
                        <Text>Your investments</Text>
                        <BadgeDelta className="" deltaType={"increase"}>
                            {5.97}%
                        </BadgeDelta>
                    </div>
                    <Metric>${`150,736`}</Metric>
                </Card>
            </div>
            <div>
                <Title className="my-3 text-2xl font-semibold">Trade</Title>
                <PurchaseCard
                    ticker={props.ticker}
                    buyPrice={tradeDetails.buy}
                    sellPrice={tradeDetails.sell}
                    isUp={tradeDetails.isUp}
                />
            </div>
        </Card>
    )
}

export default SummaryCard
