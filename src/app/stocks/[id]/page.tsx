import { BadgeDelta, Card, List, ListItem, Metric, Text } from "@tremor/react"
import ListCard from "./ListCard"
import StockSummary from "./StockSummary"

function StockPage({ params }: { params: { id: string } }) {
    return (
        <div className="flex h-full gap-6">
            <div className="flex h-full w-[70%] flex-col gap-6">
                {/* TODO - Replace with API data */}
                <StockSummary
                    company="AAPL"
                    ticker={params.id}
                    sharePrice={{ current: 175.43, previous: 172.99 }}
                    volume={{ current: 100, previous: 200 }}
                />
                {/* TODO - extract into a StockChart component  */}
                <Card className="h-[55%]">Graph</Card>
                <div className="flex h-[25%] gap-6">
                    {/* TODO - Probably can map this with API response */}
                    <ListCard
                        items={[
                            {
                                title: "Exchange",
                                value: "NASDAQ",
                            },
                            {
                                title: "Sector",
                                value: "Technology",
                            },
                            {
                                title: "P/E Ratio",
                                value: "29.78",
                            },
                            {
                                title: "Dividend Yield",
                                value: "0.60%",
                            },
                        ]}
                    />
                    <ListCard
                        items={[
                            {
                                title: "Open",
                                value: "$173.32",
                            },
                            {
                                title: "High",
                                value: "$175.77",
                            },
                            {
                                title: "Low",
                                value: "$173.11",
                            },
                            {
                                title: "Previous Close",
                                value: "$172.99",
                            },
                        ]}
                    />
                </div>
            </div>
            <div className="flex h-full w-[30%] flex-col gap-6">
                <Card className="h-3/5" />
                <Card className="h-2/5" />
            </div>
        </div>
    )
}

export default StockPage
