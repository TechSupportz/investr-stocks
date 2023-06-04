export interface SellRequests {
    [key: string]: {
        amount: number
        receiver: string
        shareCount: number
        sharePrice: number
        ticker: string
    }
}

export interface UserStocks {
    [ticker: string]: {
        shareCount: number
        totalInvestment: number
    }
}
