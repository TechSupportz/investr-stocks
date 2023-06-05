import { Badge, BadgeDelta, Card, Metric, Text } from "@tremor/react"

export interface TransactionCardProps {
    ticker: string
    shares: number
    price: number
}

function TransactionCard(props: TransactionCardProps) {
    return (
        <Card
            className="flex items-center justify-between py-4"
            decoration="left"
            decorationColor="green">
            <div className="flex flex-col">
                <Metric className="text-2xl">{props.ticker}</Metric>
                <Text>{props.shares} shares</Text>
            </div>
            <div className="flex flex-col items-end">
                <BadgeDelta deltaType="increase">4.20%</BadgeDelta>
                <Metric className="text-2xl">${props.price.toFixed(2)}</Metric>
            </div>
        </Card>
    )
}

export default TransactionCard
