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

async function getStockSummary(ticker: string, mock: boolean) {
    console.log("mock", mock)
    if (mock) {
        return {
            company: "Apple Inc.",
            sharePrice: {
                current: 148.97,
                previous: 148.56,
            },
            volume: {
                current: 100,
                previous: 320,
            },
        }
    }

    console.log("fetching stock summary")
    const intradayRes = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
        {
            next: { revalidate: 500 },
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

    let [intraday, quote, overview] = await Promise.all([
        intradayRes.json(),
        quoteRes.json(),
        overviewRes.json(),
    ])

    if (!intraday || !quote || !overview) {
        throw new Error("Failed to fetch stock summary json")
    }

    if (intraday.Note) {
        console.log(">>> intraday", intraday)
        intraday = null
        console.log("Alpha Vantage Intraday API rate limit exceeded")
    }

    if (quote.Note) {
        console.log(">>> quote", quote)
        quote = null
        console.log("Alpha Vantage Quote API rate limit exceeded")
    }

    if (overview.Note) {
        console.log(">>> overview", overview)
        overview = null
        console.log("Alpha Vantage Overview API rate limit exceeded")
    }

    // console.log(
    //     ">>> Response Data",
    //     intraday["Time Series (1min)"][
    //         Object.keys(intraday["Time Series (1min)"])[0]
    //     ]["1. open"],

    //     quote["Global Quote"]["08. previous close"],

    //     intraday["Time Series (1min)"][
    //         Object.keys(intraday["Time Series (1min)"])[0]
    //     ]["5. volume"],

    //     intraday["Time Series (1min)"][
    //         Object.keys(intraday["Time Series (1min)"])[1]
    //     ]["5. volume"],
    // )

    // console.log(">>> Response Data", intraday, quote, overview)

    const response: StockSummaryType = {
        company: overview?.Name ?? "",
        sharePrice: {
            current: parseFloat(
                intraday["Time Series (1min)"][
                    Object.keys(intraday["Time Series (1min)"])[0]
                ]["1. open"] ?? 0,
            ),
            previous: parseFloat(
                quote["Global Quote"]["08. previous close"] ?? 0,
            ),
        },
        volume: {
            current: parseFloat(
                intraday["Time Series (1min)"][
                    Object.keys(intraday["Time Series (1min)"])[0]
                ]["5. volume"] ?? 0,
            ),
            previous: parseFloat(
                intraday["Time Series (1min)"][
                    Object.keys(intraday["Time Series (1min)"])[1]
                ]["5. volume"] ?? 0,
            ),
        },
    }

    console.log(">>> Response", response)

    return response
}

async function StockSummary(props: StockSummaryProps) {
    // NOTE - change this to false to use the API
    const stockSummary = await getStockSummary(props.ticker, true)

    return (
        <Card className="flex h-[20%] items-center gap-8">
            <div className="flex-grow-1 max-w-sm space-y-1">
                <Metric className="truncate text-4xl">
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
                    <Metric>
                        ${stockSummary.sharePrice.current.toFixed(2)}
                    </Metric>
                    <Text>
                        from ${stockSummary.sharePrice.previous.toFixed(2)}
                    </Text>
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
