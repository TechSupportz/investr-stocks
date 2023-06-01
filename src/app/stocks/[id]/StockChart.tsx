import { DataInterval, DataType } from "@/types/stocks"
import { Card, LineChart } from "@tremor/react"
import React from "react"
import DataTypeToggle from "./DataTypeToggle"

interface StockChartProps {
    ticker: string
    interval: DataInterval
    data: DataType
}

const chartdata = [
    {
        year: 1970,
        "Export Growth Rate": 2.04,
        "Import Growth Rate": 1.53,
    },
    {
        year: 1971,
        "Export Growth Rate": 1.96,
        "Import Growth Rate": 1.58,
    },
    {
        year: 1972,
        "Export Growth Rate": 1.96,
        "Import Growth Rate": 1.61,
    },
    {
        year: 1973,
        "Export Growth Rate": 1.93,
        "Import Growth Rate": 1.61,
    },
    {
        year: 1974,
        "Export Growth Rate": 1.88,
        "Import Growth Rate": 1.67,
    },
]

function StockChart(props: StockChartProps) {
    return (
        <Card className="h-[55%]">
            <div className="flex mb-4">
                <DataTypeToggle />
            </div>
            <LineChart
                data={chartdata}
                index="year"
                showLegend={false}
                categories={["Export Growth Rate", "Import Growth Rate"]}
            />
        </Card>
    )
}

export default StockChart
