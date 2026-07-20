import type { Url, Metrics, MetricsHistory } from "../types";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL

export async function createUrl(originalUrl: string, expires_at: string): Promise<Url> {

    const response = await axios({
        method: 'post',
        url: `${BASE_URL}/urls`,
        data: {
            original_url: originalUrl,
            expires_at: expires_at,
        },
    })

    return response.data
}

export async function getMetrics(slug: string, day: string): Promise<Metrics> {

    const response = await axios({
        method: 'get',
        url: `${BASE_URL}/urls/${slug}/metrics`,
        params: {
            day: day,
        }
    })

    return response.data
}

export async function getMetricsHistory(slug: string): Promise<MetricsHistory> {

    const response = await axios({
        method: 'get',
        url: `${BASE_URL}/urls/${slug}/history`,
    })

    return response.data
}
