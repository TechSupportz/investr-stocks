export interface SellRequests {
    [key: string]: {
        amount: number
        receiver: string
        shareCount: number
        sharePrice: number
        ticker: string
    }
}
