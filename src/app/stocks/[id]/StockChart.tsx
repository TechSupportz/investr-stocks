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
import IntervalToggle from "./intervalTabs"

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
        console.log("Alpha Vantage earnings API rate limit exceeded")
        return {
            symbol: ticker,
            annualEarnings: [],
        }
    }

    earnings.annualEarnings = earnings.annualEarnings.map(earnings => {
        return {
            ...earnings,
            fiscalDateEnding: DateTime.fromISO(
                earnings.fiscalDateEnding,
            ).toFormat("yyyy"),
        }
    })

    return earnings
}

async function getTodayStockData(ticker: string) {
    const stockRes = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&apikey=${process.env.ALPHAVANTAGE_API_KEY}`,
    )

    const exchangeRateRes = await fetch(
        "https://api.exchangerate.host/latest?base=USD&symbols=SGD&places=2",
    )

    if (!stockRes.ok) {
        throw new Error("Failed to fetch stock data")
    }

    let [stockData, exchangeRate] = await Promise.all([
        stockRes.json(),
        exchangeRateRes.json(),
    ])

    if (!stockData) {
        throw new Error("Stock data undefined")
    }

    if ((stockData as any).Note) {
        console.log("Alpha Vantage stock data API rate limit exceeded")
        return []
    }

    if (exchangeRate.rates.SGD) {
        console.log(">>> exchangeRate", exchangeRate)
        exchangeRate = exchangeRate.rates.SGD
    } else {
        console.log(">>> exchangeRate", "Unable to fetch exchange rate")
        exchangeRate = 1.36
    }

    const response: StockChartData[] = Object.entries(
        stockData["Time Series (5min)"],
    )
        .map(([key, value]: any) => {
            return {
                time: DateTime.fromFormat(key, "yyyy-MM-dd HH:mm:ss").toFormat(
                    "HH:mm",
                ),
                stockPrice: parseFloat(value["1. open"]) * exchangeRate,
            }
        })
        .reverse()

    return response
}

async function getMonthStockData(ticker: string) {
    const stockRes = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=60min&outputsize=full&apikey=${process.env.ALPHAVANTAGE_API_KEY}`,
    )

    const exchangeRateRes = await fetch(
        "https://api.exchangerate.host/latest?base=USD&symbols=SGD&places=2",
    )

    if (!stockRes.ok) {
        throw new Error("Failed to fetch stock data")
    }

    let [stockData, exchangeRate] = await Promise.all([
        stockRes.json(),
        exchangeRateRes.json(),
    ])

    if (!stockData) {
        throw new Error("Stock data undefined")
    }

    if ((stockData as any).Note) {
        console.log("Alpha Vantage stock data API rate limit exceeded")
        return []
    }

    if (exchangeRate.rates.SGD) {
        console.log(">>> exchangeRate", exchangeRate)
        exchangeRate = exchangeRate.rates.SGD
    } else {
        console.log(">>> exchangeRate", "Unable to fetch exchange rate")
        exchangeRate = 1.36
    }

    const response: StockChartData[] = Object.entries(
        stockData["Time Series (60min)"],
    )
        .slice(0, 720)
        .map(([key, value]: any) => {
            return {
                time: DateTime.fromFormat(key, "yyyy-MM-dd HH:mm:ss").toFormat(
                    "dd/MM",
                ),
                stockPrice: parseFloat(value["1. open"]) * exchangeRate,
            }
        })
        .reverse()

    return response
}

async function getMaxStockData(ticker: string) {
    const stockRes = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${ticker}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`,
    )

    const exchangeRateRes = await fetch(
        "https://api.exchangerate.host/latest?base=USD&symbols=SGD&places=2",
    )

    if (!stockRes.ok) {
        throw new Error("Failed to fetch stock data")
    }

    let [stockData, exchangeRate] = await Promise.all([
        stockRes.json(),
        exchangeRateRes.json(),
    ])

    if (!stockData) {
        throw new Error("Stock data undefined")
    }

    if ((stockData as any).Note) {
        console.log("Alpha Vantage stock data API rate limit exceeded")
        return []
    }

    if (exchangeRate.rates.SGD) {
        console.log(">>> exchangeRate", exchangeRate)
        exchangeRate = exchangeRate.rates.SGD
    } else {
        console.log(">>> exchangeRate", "Unable to fetch exchange rate")
        exchangeRate = 1.36
    }

    const response: StockChartData[] = Object.entries(
        stockData["Monthly Time Series"],
    )
        .map(([key, value]: any) => {
            return {
                time: DateTime.fromFormat(key, "yyyy-MM-dd").toFormat(
                    "dd/MM/yyyy",
                ),
                stockPrice: parseFloat(value["1. open"]) * exchangeRate,
            }
        })
        .reverse()

    return response
}

interface StockChartProps {
    ticker: string
    interval: DataInterval
    data: DataType
}

async function StockChart(props: StockChartProps) {
    const chartData =
        props.data === "earnings"
            ? await getCompanyEarnings(props.ticker)
            : props.interval === "today"
            ? await getTodayStockData(props.ticker)
            : props.interval === "month"
            ? await getMonthStockData(props.ticker)
            : await getMaxStockData(props.ticker)

    return (
        <Card className="h-[55%]">
            <div className="mb-4 flex w-full items-end justify-between">
                <IntervalToggle
                    className={
                        props.data === "stocks" ? "opacity-100" : "opacity-0"
                    }
                />
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
