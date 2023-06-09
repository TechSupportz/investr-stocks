import { Metric } from "@tremor/react"

function RateLimitPage() {
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <Metric>AlphaVantage Rate limit hit</Metric>
            <Metric>Please try again in a minute or switch API keys</Metric>
        </div>
    )
}

export default RateLimitPage
