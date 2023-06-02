import {
    CompanyEarnings,
    DataInterval,
    DataType,
    StockChartData,
} from "@/types/stocks"
import { AreaChart, BarChart, Card, LineChart } from "@tremor/react"
import React from "react"
import DataTypeToggle from "./DataTypeToggle"
import { DateTime } from "luxon"

interface StockChartProps {
    ticker: string
    interval: DataInterval
    data: DataType
}

async function getCompanyEarnings(ticker: string) {
    const earningsRes = await fetch(
        `https://www.alphavantage.co/query?function=EARNINGS&symbol=${ticker}&apikey=${process.env.ALPHAVANTAGE_API_KEY}}`,
    )

    if (!earningsRes.ok) {
        throw new Error("Failed to fetch company earnings")
    }

    const earnings: CompanyEarnings = await earningsRes.json()

    if (!earnings) {
        throw new Error("Company card details undefined")
    }

    if ((earnings as any).Note) {
        throw new Error("Alpha Vantage earnings API rate limit exceeded")
    }

    earnings.annualEarnings = earnings.annualEarnings.map(earnings => {
        return {
            ...earnings,
            fiscalDateEnding: DateTime.fromISO(
                earnings.fiscalDateEnding,
            ).toFormat("yyyy"),
        }
    })

    return {
        ...earnings,
    }
}

async function getStockData(ticker: string, interval: DataInterval) {
    const stockRes = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&apikey=${process.env.ALPHAVANTAGE_API_KEY}`,
    )

    if (!stockRes.ok) {
        throw new Error("Failed to fetch stock data")
    }

    const stockData = await stockRes.json()

    if (!stockData) {
        throw new Error("Stock data undefined")
    }

    if ((stockData as any).Note) {
        throw new Error("Alpha Vantage stock data API rate limit exceeded")
    }

    const response: StockChartData[] = Object.entries(
        stockData["Time Series (5min)"],
    )
        .map(([key, value]: any) => {
            return {
                time: DateTime.fromFormat(key, "yyyy-MM-dd HH:mm:ss").toFormat(
                    "HH:mm",
                ),
                stockPrice: parseFloat(value["1. open"]),
            }
        })
        .reverse()

    return response
}

async function StockChart(props: StockChartProps) {
    const chartData =
        props.data === "earnings"
            ? await getCompanyEarnings(props.ticker)
            : await getStockData(props.ticker, props.interval)

    return (
        <Card className="h-[55%]">
            <div className="mb-4 w-full items-end justify-end">
                <DataTypeToggle />
            </div>
            {props.data === "earnings" && "symbol" in chartData ? (
                <BarChart
                    data={chartData.annualEarnings}
                    categories={["reportedEPS"]}
                    index={"fiscalDateEnding"}
                    yAxisWidth={16}
                    autoMinValue
                    showLegend={false}
                />
            ) : (
                <AreaChart
                    data={!("symbol" in chartData) ? chartData : []}
                    index={"time"}
                    categories={["stockPrice"]}
                    colors={
                        !("symbol" in chartData)
                            ? chartData[0].stockPrice >
                              chartData[chartData.length - 1].stockPrice
                                ? ["red"]
                                : ["green"]
                            : ["blue"]
                    }
                    autoMinValue
                    showLegend={false}
                />
            )}
        </Card>
    )
}

export default StockChart
