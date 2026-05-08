import type { Url, Metrics } from "../types";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/";

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
