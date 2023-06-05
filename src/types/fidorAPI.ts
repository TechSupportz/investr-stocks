export const fidorBaseURL: string = "https://api.tp.sandbox.fidorfzco.com"

export interface FidorPagination {
    current_page: number
    per_page: number
    total_entries: number
    total_pages: number
}

export interface FidorAccount {
    id: string
    account_number?: string
    iban?: string
    balance?: number
    balance_available?: number
    bic: string
    created_at: string
    updated_at: string
    nick: string
}

export interface FidorAccountResponse {
    data: FidorAccount[]
    collection: FidorPagination
}

export interface FidorTransaction {
    id: string
    account_id: string
    transaction_type: string
    subject: string
    amount: number
    currency: string
    transaction_type_details: {
        internal_transfer_id: string
        remote_account_id: string
        remote_name: string
        remote_nick: string
        remote_subject: string
        recipient: string
        recipient_name: string
    }
    created_at: string
    updated_at: string
}

export interface FidorTransactionsResponse {
    data: FidorTransaction[]
    collection: FidorPagination
}
