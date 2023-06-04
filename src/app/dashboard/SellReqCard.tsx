"use client"

import { CheckIcon, XIcon } from "@heroicons/react/outline"
import { Button, Card, Metric, Text } from "@tremor/react"

interface SellReqCardProps {
    receiver: string
    amount: number
    shareCount: number
    ticker: string
}

function SellReqCard(props: SellReqCardProps) {
    const approve = () => {
        console.log("approve")
    }

    const reject = () => {
        console.log("reject")
    }

    return (
        <Card
            className="flex items-center justify-between py-3"
            decoration="left"
            decorationColor="blue">
            <div>
                <Text>{props.receiver}</Text>
                <Metric>${props.amount.toFixed(2)}</Metric>
                <Text>{`${props.shareCount} share${
                    props.shareCount > 1 ? "s" : ""
                } of ${props.ticker}`}</Text>
            </div>
            <div className="flex flex-col gap-2">
                <Button
                    onClick={approve}
                    color="green"
                    className="py-1 pl-4 pr-2"
                    icon={CheckIcon}
                />
                <Button
                    onClick={reject}
                    color="red"
                    className="py-1 pl-4 pr-2"
                    icon={XIcon}
                />
            </div>
        </Card>
    )
}

export default SellReqCard
