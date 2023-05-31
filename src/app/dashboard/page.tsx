import { Card } from "@tremor/react"

async function DashboardPage() {
    const delay = await new Promise(resolve => setTimeout(resolve, 5000))

    return (
        <div className="flex h-full flex-col gap-6">
            <div className="flex h-[40%] gap-6">
                <Card className="w-4/5">{delay as string}</Card>
                <Card className="w-1/5"></Card>
            </div>
            <div className="flex h-[60%] gap-6">
                <Card className="w-2/6"></Card>
                <Card className="w-4/6"></Card>
            </div>
        </div>
    )
}

export default DashboardPage
