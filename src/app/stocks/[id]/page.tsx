import { BadgeDelta, Card, List, ListItem, Metric, Text } from "@tremor/react"

function StockPage({ params }: { params: { id: string } }) {
    return (
        <div className="flex h-full gap-6">
            <div className="flex h-full w-[70%] flex-col gap-6">
                {/* TODO - extract into a StockSummary component  */}
                <Card className="flex h-[20%] items-center gap-8">
                    <div className="space-y-1">
                        <Metric className="text-4xl">Apple</Metric>
                        <Text className="text-lg font-light ">{params.id}</Text>
                    </div>
                    <Card className="px-5 py-4">
                        <div className="flex w-full items-start justify-between">
                            <Text>Share price</Text>
                            <BadgeDelta className="" deltaType="increase">
                                4.20%
                            </BadgeDelta>
                        </div>
                        <div className="flex items-baseline justify-start space-x-3 truncate">
                            <Metric>$175.43</Metric>
                            <Text>from $172.59</Text>
                        </div>
                    </Card>
                    <Card className="px-5 py-4">
                        <div className="flex w-full items-start justify-between">
                            <Text>Volume</Text>
                            <BadgeDelta className="" deltaType="decrease">
                                100
                            </BadgeDelta>
                        </div>
                        <div className="flex items-baseline justify-start space-x-3 truncate">
                            <Metric>100</Metric>
                            <Text>from 200</Text>
                        </div>
                    </Card>
                </Card>
                {/* TODO - extract into a StockChart component  */}
                <Card className="h-[55%]">Graph</Card>
                <div className="flex h-[25%] gap-6">
                    {/* TODO - extract into a ListCard component  */}
                    <Card>
                        <List>
                            <ListItem>
                                <span>Something</span>
                                <span>Another thing</span>
                            </ListItem>
                            <ListItem>
                                <span>Something</span>
                                <span>Another thing</span>
                            </ListItem>
                            <ListItem>
                                <span>Something</span>
                                <span>Another thing</span>
                            </ListItem>
                            <ListItem>
                                <span>Something</span>
                                <span>Another thing</span>
                            </ListItem>
                        </List>
                    </Card>
                    <Card />
                </div>
            </div>
            <div className="flex h-full w-[30%] flex-col gap-6">
                <Card className="h-3/5" />
                <Card className="h-2/5" />
            </div>
        </div>
    )
}

export default StockPage
