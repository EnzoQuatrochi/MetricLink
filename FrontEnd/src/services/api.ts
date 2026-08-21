import type { Url, Metrics, MetricsHistory } from "../types";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL

function authHeader(token?: string) {
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function loginUser(name: string, password: string): Promise<string> {
    const formData = new URLSearchParams()
    formData.append('username', name)
    formData.append('password', password)

    const response = await axios({
        method: 'post',
        url: `${BASE_URL}/auth/login`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: formData,
    })

    return response.data.access_token
}

export async function createUser(name: string, password: string): Promise<string> {
    await axios({
        method: 'post',
        url: `${BASE_URL}/auth/register`,
        headers: { 'Content-Type': 'application/json' },
        data: {
            name: name,
            password: password,
        },
    })

    return loginUser(name, password)
}

export async function createUrl(originalUrl: string, expires_at: string, token?: string): Promise<Url> {
    const response = await axios({
        method: 'post',
        url: `${BASE_URL}/urls`,
        headers: authHeader(token),
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

export async function getUserUrls(token: string): Promise<Url[]> {
    const response = await axios({
        method: 'get',
        url: `${BASE_URL}/urls`,
        headers: authHeader(token),
    })
    return response.data
}

export async function getMetricsHistory(slug: string, token?: string): Promise<MetricsHistory> {
    const response = await axios({
        method: 'get',
        url: `${BASE_URL}/urls/${slug}/history`,
        headers: authHeader(token),
    })
    return response.data
}

export async function deleteUrl(slug: string, token?: string): Promise<void> {
    const response = await axios({
        method: 'delete',
        url: `${BASE_URL}/urls/${slug}`,
        headers: authHeader(token),
    })
    return response.data
}