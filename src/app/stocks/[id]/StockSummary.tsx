import { DataInterval } from "@/types/stocks"
import { Card, Metric, BadgeDelta, Text } from "@tremor/react"

type CurrPrevMetrics = {
    current: number
    previous: number
}

interface StockSummaryType {
    company: string
    sharePrice: CurrPrevMetrics
    volume: CurrPrevMetrics
}

interface StockSummaryProps {
    ticker: string
    interval: DataInterval
}

async function getStockSummary(ticker: string) {
	console.log("fetching stock summary")
    const intradayRes = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
        {
            next: { revalidate: 60 },
        },
    )

    const quoteRes = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
    )

    const overviewRes = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
    )

    if (!intradayRes.ok || !quoteRes.ok || !overviewRes.ok) {
        throw new Error("Failed to fetch stock summary")
    }

    const [intraday, quote, overview] = await Promise.all([
        intradayRes.json(),
        quoteRes.json(),
        overviewRes.json(),
    ])

    if (!intraday || !quote || !overview) {
        throw new Error("Failed to fetch stock summary json")
    }

    console.log(
        ">>> Response Data",
        intraday["Time Series (1min)"][
            Object.keys(intraday["Time Series (1min)"])[0]
        ]["1. open"],

        quote["Global Quote"]["08. previous close"],

        intraday["Time Series (1min)"][
            Object.keys(intraday["Time Series (1min)"])[0]
        ]["5. volume"],

        intraday["Time Series (1min)"][
            Object.keys(intraday["Time Series (1min)"])[1]
        ]["5. volume"],
    )

    const response: StockSummaryType = {
        company: overview.Name,
        sharePrice: {
            current: parseFloat(
                intraday["Time Series (1min)"][
                    Object.keys(intraday["Time Series (1min)"])[0]
                ]["1. open"],
            ),
            previous: parseFloat(quote["Global Quote"]["08. previous close"]),
        },
        volume: {
            current: parseFloat(
                intraday["Time Series (1min)"][
                    Object.keys(intraday["Time Series (1min)"])[0]
                ]["5. volume"],
            ),
            previous: parseFloat(
                intraday["Time Series (1min)"][
                    Object.keys(intraday["Time Series (1min)"])[1]
                ]["5. volume"],
            ),
        },
    }

    console.log(">>> Response", response)

    return response
}

async function StockSummary(props: StockSummaryProps) {
    const stockSummary = await getStockSummary(props.ticker)
    console.log(stockSummary)

    return (
        <Card className="flex h-[20%] items-center gap-8">
            <div className="flex-grow-[2] space-y-1">
                <Metric className="text-4xl">
                    {stockSummary.company ?? props.ticker}
                </Metric>
                <Text
                    className={`text-lg font-light ${
                        stockSummary.company ? "" : "hidden"
                    }`}>
                    {props.ticker}
                </Text>
            </div>
            <Card className="px-5 py-4">
                <div className="flex w-full items-start justify-between">
                    <Text>Share price</Text>
                    <BadgeDelta
                        className=""
                        deltaType={
                            stockSummary.sharePrice.current ===
                            stockSummary.sharePrice.previous
                                ? "unchanged"
                                : stockSummary.sharePrice.current >
                                  stockSummary.sharePrice.previous
                                ? "increase"
                                : "decrease" ?? "unchanged"
                        }>
                        {Math.abs(
                            ((stockSummary.sharePrice.current -
                                stockSummary.sharePrice.previous) /
                                stockSummary.sharePrice.previous) *
                                100,
                        ).toFixed(2)}
                        %
                    </BadgeDelta>
                </div>
                <div className="flex items-baseline justify-start space-x-3 truncate">
                    <Metric>${stockSummary.sharePrice.current}</Metric>
                    <Text>from ${stockSummary.sharePrice.previous}</Text>
                </div>
            </Card>
            <Card className="px-5 py-4">
                <div className="flex w-full items-start justify-between">
                    <Text>Volume (Last 5 minutes)</Text>
                    <BadgeDelta
                        className=""
                        deltaType={
                            stockSummary.volume.current ===
                            stockSummary.volume.previous
                                ? "unchanged"
                                : stockSummary.volume.current >
                                  stockSummary.volume.previous
                                ? "increase"
                                : "decrease"
                        }>
                        {Math.abs(
                            stockSummary.volume.current -
                                stockSummary.volume.previous,
                        ).toFixed(2)}
                    </BadgeDelta>
                </div>
                <div className="flex items-baseline justify-start space-x-3 truncate">
                    <Metric>{stockSummary.volume.current}</Metric>
                    <Text>from {stockSummary.volume.previous}</Text>
                </div>
            </Card>
        </Card>
    )
}

export default StockSummary
