export type DataInterval = "today" | "month" | "max"
export type DataType = "stocks" | "earnings"
export type TradeType = "buy" | "sell"

export interface CompanyEarnings {
    symbol: string
    annualEarnings: AnnualEarnings[]
}

export interface AnnualEarnings {
    fiscalDateEnding: string
    reportedEPS: number
}

export interface StockChartData {
    time: string
    stockPrice: number
}
