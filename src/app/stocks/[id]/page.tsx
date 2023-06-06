import {
    BadgeDelta,
    Card,
    List,
    ListItem,
    Metric,
    Text,
    Title,
} from "@tremor/react"
import ListCard from "./ListCard"
import StockSummary from "./StockSummary"
import { DataInterval, DataType, TradeType } from "@/types/stocks"
import StockChart from "./StockChart"
import SummaryCard from "./SummaryCard"

interface searchParams {
    interval?: DataInterval
    data?: DataType
    [key: string]: string | string[] | undefined
}

async function isStockReal(ticker: string) {
    const res = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
    )

    if (!res.ok) {
        throw new Error("Failed to fetch stock summary")
    }

    const overview = await res.json()

    if ((overview as any).Note) {
        console.log("Alpha Vantage earnings API rate limit exceeded")
        return false
    }

    if (Object.keys(overview).length === 0) {
        return false
    }

    return true
}

async function getAIRecommendation(ticker: string) {
    const res = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: `What are the pros and cons of investing in ${ticker} stock?
			
			Response Format (Add a - at the start of every line including "Pros:" and "Cons:"):
			Why you should invest:
			- Pros

			Things to take note of
			- Cons
			`,
            max_tokens: 150,
        }),
    })

    const data = await res.json()

    if (!res.ok) {
        console.log(data)
        return "AI recommendation not available"
    }

    if (data.choices[0].text) {
        console.log(data.choices[0].text)
        return data.choices[0].text
    }
}

async function StockPage({
    params,
    searchParams,
}: {
    params: { id: string }
    searchParams: searchParams
}) {
    const isValidStock = await isStockReal(params.id)

    if (!isValidStock) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Text className="text-2xl">Stock not found</Text>
            </div>
        )
    }

    const aiRecommendation = await getAIRecommendation(params.id)

    return (
        <div className="flex h-full gap-4">
            <div className="flex h-full w-[70%] flex-col gap-4">
                <StockSummary ticker={params.id} />
                <StockChart
                    ticker={params.id}
                    data={
                        searchParams.data
                            ? ["stocks", "earnings"].includes(
                                  searchParams.data.toLowerCase(),
                              )
                                ? searchParams.data
                                : "stocks"
                            : "stocks"
                    }
                    interval={
                        searchParams?.interval
                            ? ["today", "month", "max"].includes(
                                  searchParams?.interval.toLowerCase() as DataInterval,
                              )
                                ? (searchParams.interval.toLowerCase() as DataInterval)
                                : "today"
                            : "today"
                    }
                />
                {/* FIXME - uncomment this after new alphavantage api key */}
                {/* <div className="flex h-[25%] gap-4">
                    <ListCard ticker={params.id} type="Company" />
                    <ListCard ticker={params.id} type="Stock" />
                </div> */}
            </div>
            <div className="flex h-full w-[30%] flex-col gap-4">
                {/* <SummaryCard ticker={params.id} /> */}
                <Card className="h-2/6">
                    <Title className="mb-4 text-2xl font-semibold">
                        AI Advisor
                    </Title>
                    <div className="max-h-[90%] overflow-scroll whitespace-pre-line">
                        {aiRecommendation.trim()}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default StockPage
