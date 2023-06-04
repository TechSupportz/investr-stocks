import { BadgeDelta, Card, List, ListItem, Metric, Text } from "@tremor/react"
import ListCard from "./ListCard"
import StockSummary from "./StockSummary"
import { DataInterval, DataType, TradeType } from "@/types/stocks"
import StockChart from "./StockChart"
import SummaryCard from "./SummaryCard"

interface searchParams {
    interval?: DataInterval
    data?: DataType
    trade?: TradeType
    [key: string]: string | string[] | undefined
}

function StockPage({
    params,
    searchParams,
}: {
    params: { id: string }
    searchParams: searchParams
}) {
    return (
        <div className="flex h-full gap-4">
            <div className="flex h-full w-[70%] flex-col gap-4">
                <StockSummary
                    ticker={params.id}
                    interval={
                        searchParams?.interval
                            ? ["1D", "5D", "1M", "6M", "1Y", "MAX"].includes(
                                  searchParams?.interval.toUpperCase() as DataInterval,
                              )
                                ? (searchParams.interval.toUpperCase() as DataInterval)
                                : "1D"
                            : "1D"
                    }
                />
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
                            ? ["1D", "5D", "1M", "6M", "1Y", "MAX"].includes(
                                  searchParams?.interval.toUpperCase() as DataInterval,
                              )
                                ? (searchParams.interval.toUpperCase() as DataInterval)
                                : "1D"
                            : "1D"
                    }
                />
                {/* FIXME - uncomment this after new alphavantage api key */}
                {/* <div className="flex h-[25%] gap-4">
                    <ListCard ticker={params.id} type="Company" />
                    <ListCard ticker={params.id} type="Stock" />
                </div> */}
            </div>
            <div className="flex h-full w-[30%] flex-col gap-4">
                <SummaryCard ticker={params.id} />
                <Card className="h-2/6" />
            </div>
        </div>
    )
}

export default StockPage
