"use client"

import { CheckIcon, XIcon } from "@heroicons/react/outline"
import { Button, Card, Metric, Text } from "@tremor/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface SellReqCardProps {
    receiver: string
    amount: number
    shareCount: number
    sharePrice: number
    ticker: string
    id: string
    token: string
}

function SellReqCard(props: SellReqCardProps) {
    const router = useRouter()
    const [isSellLoading, setIsSellLoading] = useState(false)
    const [isBuyLoading, setIsBuyLoading] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)

    const approve = () => {
        setIsSellLoading(true)
        fetch("/api/stocks/sell/approve", {
            method: "POST",
            body: JSON.stringify({
                receiver: props.receiver,
                amount: props.amount,
                ticker: props.ticker,
                shareCount: props.shareCount,
                sharePrice: props.sharePrice,
                reqID: props.id,
                token: props.token,
            }),
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data) {
                    setIsDeleted(true)
                    router.refresh()
                }
            })
            .catch(err => console.log(err))
            .finally(() => setIsSellLoading(false))
    }

    const reject = () => {
        setIsBuyLoading(true)
        fetch("/api/stocks/sell/reject", {
            method: "POST",
            body: JSON.stringify({
                receiver: props.receiver,
                amount: props.amount,
                ticker: props.ticker,
                shareCount: props.shareCount,
                sharePrice: props.sharePrice,
                reqID: props.id,
            }),
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data) {
                    setIsDeleted(true)
                }
            })
            .catch(err => console.log(err))
            .finally(() => setIsBuyLoading(false))
    }

    return (
        <Card
            className={`flex items-center justify-between py-3 ${
                isDeleted ? "hidden" : ""
            }`}
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
                    loading={isSellLoading}
                    disabled={isBuyLoading}
                    color="green"
                    className="py-1 pl-4 pr-2"
                    icon={CheckIcon}
                />
                <Button
                    onClick={reject}
                    loading={isBuyLoading}
                    disabled={isSellLoading}
                    color="red"
                    className="py-1 pl-4 pr-2"
                    icon={XIcon}
                />
            </div>
        </Card>
    )
}

export default SellReqCard
