import { Card, List, ListItem } from "@tremor/react"

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
        throw new Error("Alpha Vantage API rate limit exceeded")
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
            value: overview.DividendYield,
        },
    ]

    return response
}

async function getStockDetails({ ticker, type }: ListCardProps) {
    const quoteRes = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
    )

    if (!quoteRes.ok) {
        throw new Error("Failed to fetch stock card details")
    }

    const quote = await quoteRes.json()

    if (!quote) {
        throw new Error("Stock card details undefined")
    }

    if (quote.Note) {
        throw new Error("Alpha Vantage API rate limit exceeded")
    }

    const response = [
        {
            title: "Open",
            value: quote["Global Quote"]["02. open"].slice(0, 6),
        },
        {
            title: "High",
            value: quote["Global Quote"]["03. high"].slice(0, 6),
        },
        {
            title: "Low",
            value: quote["Global Quote"]["04. low"].slice(0, 6),
        },
        {
            title: "Previous Close",
            value: quote["Global Quote"]["08. previous close"].slice(0, 6),
        },
    ]

    return response
}

async function ListCard(props: ListCardProps) {
    const items = [
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
    ]

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
