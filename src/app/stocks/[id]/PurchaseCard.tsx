"use client"

import { CashIcon, PresentationChartLineIcon } from "@heroicons/react/outline"
import {
    Toggle,
    ToggleItem,
    Text,
    TextInput,
    Metric,
    Button,
} from "@tremor/react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

interface PurchaseCardProps {
    ticker: string
    buyPrice: number
    sellPrice: number
    isUp: boolean
}

function PurchaseCard(props: PurchaseCardProps) {
    const [tradeType, setTradeType] = useState("buy")
    const [shares, setShares] = useState(0)
    const [commission, setCommission] = useState(0)
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const session = useSession()

    useEffect(() => {
        if (props.buyPrice) {
            setCommission(props.buyPrice * 0.05)
        }
    }, [props.buyPrice])

    useEffect(() => {
        if (shares === 0) {
            setTotal(0)
            return
        }

        if (tradeType === "buy") {
            setTotal(Math.ceil(shares * (props.buyPrice - commission)))
        } else {
            setTotal(Math.ceil(shares * props.sellPrice))
        }
    }, [shares])

    const buyStocks = () => {
        setIsLoading(true)
        fetch(`${window.location.origin}/api/stocks/buy`, {
            method: "POST",
            body: JSON.stringify({
                token: session.data?.accessToken,
                accountId: session.data?.user.id,
                amount: total,
                ticker: props.ticker,
                sharePrice: props.buyPrice,
                shareCount: shares,
            }),
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))
            .finally(() => setIsLoading(false))
    }

    const sellStocks = () => {}

    return (
        <div className="w-full items-center justify-center">
            <Toggle
                className="mb-4 w-full"
                value={tradeType}
                onValueChange={value => setTradeType(value)}>
                <ToggleItem
                    className="flex w-full items-center justify-center"
                    icon={PresentationChartLineIcon}
                    value="buy"
                    text="Buy"
                />
                <ToggleItem
                    className="flex w-full items-center justify-center"
                    icon={CashIcon}
                    value="sell"
                    text="Sell"
                />
            </Toggle>
            <div className="mb-4 space-y-3">
                <div className="mx-3 flex items-center justify-between">
                    <Text className="text-base font-medium">Market Price</Text>
                    <Text
                        className={`max-w-[30%] ${
                            props.isUp ? "text-green-500" : "text-red-500"
                        }`}>
                        $
                        {tradeType === "buy" ? props.buyPrice : props.sellPrice}
                    </Text>
                </div>
                <div className="mx-3 flex items-center justify-between">
                    <Text className="text-base font-medium">No. of Shares</Text>
                    <TextInput
                        className="max-w-[30%]"
                        placeholder="0"
                        type={"number" as unknown as undefined}
                        min={0}
                        value={shares.toString()}
                        onChange={e =>
                            e.target.value.length > 0
                                ? setShares(parseInt(e.target.value))
                                : setShares(0)
                        }
                    />
                </div>
                {tradeType === "buy" ? (
                    <div className="mx-3 flex items-center justify-between">
                        <Text className="text-base font-medium">
                            Commission (per share)
                        </Text>
                        <Text className="max-w-[30%] text-red-600">
                            ${commission.toFixed(2)}
                        </Text>
                    </div>
                ) : null}
                <div className="mx-3 flex items-center justify-between">
                    <Metric className="text-xl font-bold">Total</Metric>
                    <Metric className="text-xl font-bold">
                        ${total.toFixed(2)}
                    </Metric>
                </div>
            </div>
            <Button
                className="w-full"
                loading={isLoading}
                onClick={tradeType ? buyStocks : sellStocks}>
                {tradeType === "buy" ? "Buy it!" : "Sell it!"}
            </Button>
        </div>
    )
}

export default PurchaseCard
