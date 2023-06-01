import { CompanyEarnings, DataInterval, DataType } from "@/types/stocks"
import { BarChart, Card, LineChart } from "@tremor/react"
import React from "react"
import DataTypeToggle from "./DataTypeToggle"
import { DateTime } from "luxon"

interface StockChartProps {
    ticker: string
    interval: DataInterval
    data: DataType
}

async function getCompanyEarnings(ticker: string) {
    const res = await fetch(
        `https://www.alphavantage.co/query?function=EARNINGS&symbol=${ticker}&apikey=${process.env.ALPHAVANTAGE_API_KEY}}`,
    )

    const data: CompanyEarnings = await res.json()

    if (!res.ok) {
        throw data
    }

    data.annualEarnings = data.annualEarnings.map(earnings => {
        return {
            ...earnings,
            fiscalDateEnding: DateTime.fromISO(
                earnings.fiscalDateEnding,
            ).toFormat("yyyy"),
        }
    })

    return data
}

async function StockChart(props: StockChartProps) {
    const earnings = await getCompanyEarnings(props.ticker)

    return (
        <Card className="h-[55%]">
            <div className="mb-4 w-full items-end justify-end">
                <DataTypeToggle />
            </div>
            <BarChart
                data={earnings.annualEarnings}
                categories={["reportedEPS"]}
                index="fiscalDateEnding"
                yAxisWidth={16}
                showLegend={false}
            />
        </Card>
    )
}

export default StockChart
