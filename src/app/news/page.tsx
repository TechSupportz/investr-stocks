import { Card, Metric, Title } from "@tremor/react"
import Link from "next/link"

async function getNews() {
    const res = await fetch(
        `https://newsapi.org/v2/everything?q=stocks&apiKey=${process.env.NEWS_API_KEY}`,
    )

    if (!res.ok) {
        console.log("Failed to fetch news")
        return
    }

    const news = await res.json()

    if (news.status === "error") {
        console.log("Failed to fetch news")
        return
    }

    return news.articles
}

async function NewsPage() {
    const allNews: any[] = await getNews()

    return (
        <div className="flex flex-col gap-3">
            {allNews.map(news => (
                <Link href={news.url} target="_blank">
                    <Card>
                        <Title>{news.title}</Title>
                        <img src={news.urlToImage} className="max-w-[200px]" />
                    </Card>
                </Link>
            ))}
        </div>
    )
}

export default NewsPage
