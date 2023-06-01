import { Card, List, ListItem } from "@tremor/react"

interface ListItem {
    title: string
    value: string
}

interface ListCardProps {
    items: ListItem[]
}

function ListCard(props: ListCardProps) {
    return (
        <Card className="px-5 py-2">
            <List>
                {props.items.map(item => (
                    <ListItem>
                        <span>{item.title}</span>
                        <span>{item.value}</span>
                    </ListItem>
                ))}
            </List>
        </Card>
    )
}

export default ListCard
