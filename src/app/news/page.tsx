async function NewsPage() {
    const delay = await new Promise(resolve => setTimeout(resolve, 5000))

    return <div className="text-xl">This is a news page {delay as string}</div>
}

export default NewsPage
