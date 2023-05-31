import { Card, Metric, BadgeDelta, Text } from "@tremor/react"

type CurrPrevMetrics = {
    current: number
    previous: number
}

interface StockSummaryProps {
    company: string
    ticker: string
    sharePrice: CurrPrevMetrics
    volume: CurrPrevMetrics
}

function StockSummary(props: StockSummaryProps) {
    return (
        <Card className="flex h-[20%] items-center gap-8">
            <div className="space-y-1">
                <Metric className="text-4xl">{props.company}</Metric>
                <Text className="text-lg font-light ">{props.ticker}</Text>
            </div>
            <Card className="px-5 py-4">
                <div className="flex w-full items-start justify-between">
                    <Text>Share price</Text>
                    <BadgeDelta
                        className=""
                        deltaType={
                            props.sharePrice.current ===
                            props.sharePrice.previous
                                ? "unchanged"
                                : props.sharePrice.current >
                                  props.sharePrice.previous
                                ? "increase"
                                : "decrease" ?? "unchanged"
                        }>
                        {Math.abs(
                            ((props.sharePrice.current -
                                props.sharePrice.previous) /
                                props.sharePrice.previous) *
                                100,
                        ).toFixed(2)}
                        %
                    </BadgeDelta>
                </div>
                <div className="flex items-baseline justify-start space-x-3 truncate">
                    <Metric>${props.sharePrice.current}</Metric>
                    <Text>from ${props.sharePrice.previous}</Text>
                </div>
            </Card>
            <Card className="px-5 py-4">
                <div className="flex w-full items-start justify-between">
                    <Text>Volume</Text>
                    <BadgeDelta
                        className=""
                        deltaType={
                            props.volume.current === props.volume.previous
                                ? "unchanged"
                                : props.volume.current > props.volume.previous
                                ? "increase"
                                : "decrease"
                        }>
                        {Math.abs(props.volume.current - props.volume.previous).toFixed(2)}
                    </BadgeDelta>
                </div>
                <div className="flex items-baseline justify-start space-x-3 truncate">
                    <Metric>{props.volume.current}</Metric>
                    <Text>from {props.volume.previous}</Text>
                </div>
            </Card>
        </Card>
    )
}

export default StockSummary
