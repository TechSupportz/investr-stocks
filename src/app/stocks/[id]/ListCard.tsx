import { Card, List, ListItem } from "@tremor/react"
import { redirect } from "next/navigation"

interface ListItem {
    title: string
    value: string
}

interface ListCardProps {
    ticker: string
    type: "Company" | "Stock"
}

async function getCompanyDetails({ ticker, type }: ListCardProps) {
    const overviewRes = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
    )

    if (!overviewRes.ok) {
        throw new Error("Failed to fetch company card details")
    }

    const overview = await overviewRes.json()

    if (!overview) {
        throw new Error("Company card details undefined")
    }

    if (overview.Note) {
        redirect("/rateLimit")
        throw new Error("Alpha Vantage overview API rate limit exceeded")
    }

    const response = [
        {
            title: "Exchange",
            value: overview.Exchange,
        },
        {
            title: "Sector",
            value: overview.Sector[0] + overview.Sector.slice(1).toLowerCase(),
        },
        {
            title: "P/E Ratio",
            value: overview.PERatio,
        },
        {
            title: "Dividend Yield",
            value:
                overview.DividendYield == 0
                    ? "N/A"
                    : `${overview.DividendYield}%`,
        },
    ]

    return response
}

async function getStockDetails({ ticker, type }: ListCardProps) {
    const quoteRes = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
    )

    const exchangeRateRes = await fetch(
        "https://api.exchangerate.host/latest?base=USD&symbols=SGD&places=2",
    )

    if (!quoteRes.ok) {
        throw new Error("Failed to fetch stock card details")
    }

    let [quote, exchangeRate] = await Promise.all([
        quoteRes.json(),
        exchangeRateRes.json(),
    ])

    if (!quote) {
        throw new Error("Stock card details undefined")
    }

    if (quote.Note) {
        redirect("/rateLimit")
        throw new Error("Alpha Vantage API rate limit exceeded")
    }

    if (exchangeRate.rates.SGD) {
        console.log(">>> exchangeRate", exchangeRate)
        exchangeRate = exchangeRate.rates.SGD
    } else {
        console.log(">>> exchangeRate", "Unable to fetch exchange rate")
        exchangeRate = 1.36
    }

    const response = [
        {
            title: "Open",
            value: (
                parseFloat(quote["Global Quote"]["02. open"].slice(0, 6)) *
                exchangeRate
            ).toFixed(2),
        },
        {
            title: "High",
            value: (
                parseFloat(quote["Global Quote"]["03. high"].slice(0, 6)) *
                exchangeRate
            ).toFixed(2),
        },
        {
            title: "Low",
            value: (
                parseFloat(quote["Global Quote"]["04. low"].slice(0, 6)) *
                exchangeRate
            ).toFixed(2),
        },
        {
            title: "Previous Close",
            value: (
                parseFloat(
                    quote["Global Quote"]["08. previous close"].slice(0, 6),
                ) * exchangeRate
            ).toFixed(2),
        },
    ]

    return response
}

async function ListCard(props: ListCardProps) {
    const cardDetails =
        props.type === "Company"
            ? await getCompanyDetails(props)
            : await getStockDetails(props)

    return (
        <Card className="flex flex-col items-center justify-center px-5 py-2">
            <List>
                {cardDetails.map((item, index) => (
                    <ListItem key={index}>
                        <span>{item.title}</span>
                        <span>{item.value}</span>
                    </ListItem>
                ))}
            </List>
        </Card>
    )
}

export default ListCard
