import { Card, Metric } from "@tremor/react"

function StockPage({ params }: { params: { id: string } }) {
    return (
        <Card>
            <Metric>{params.id}</Metric>
        </Card>
    )
}

export default StockPage
