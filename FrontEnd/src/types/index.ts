export interface Url {
    slug: string
    original_url: string
    created_at: string
    expires_at: string
}
  
export interface Metrics {
    total_clicks: number
    clicks_per_day: number
}

export interface MetricsHistory {
    total_clicks: number
    history: { day: string, clicks: number}[]
}
