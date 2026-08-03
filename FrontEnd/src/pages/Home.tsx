import './Home.css'
import type { Url } from '../types'
import type { AppMode } from '../types'
import { useEffect, useState } from 'react'
import UrlForm from '../components/UrlForm'
import UrlCard from '../components/UrlCard'
import Sidebar from '../components/Sidebar'
import { useLocation } from 'react-router-dom'
import { deleteUrl, getUserUrls } from '../services/api'

interface HomeState {
    mode: AppMode
    token?: string
}

export default function Home() {

    const location = useLocation()

    const { mode, token } = (location.state as HomeState) ?? { mode: 'local' }

    const [urls, setUrls] = useState<Url[]>(() => {
        if (mode === 'local') {
            const saved = localStorage.getItem('urls')
            return saved ? JSON.parse(saved) : []
        }
        return []
    })
    useEffect(() => {
        if (mode === 'auth' && token) {
            getUserUrls(token).then(setUrls)
        }
    }, [mode, token])

    const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

    const displayUrl = selectedSlug
        ? urls.find(u => u.slug === selectedSlug) ?? null
        : null

    function handleUrlCreated(newUrl: Url) {
        const updatedUrls = [...urls, newUrl]
        setUrls(updatedUrls)
        if (mode === 'local') {
            localStorage.setItem('urls', JSON.stringify(updatedUrls))
        }
    }

    function handleBack() {
        setSelectedSlug(null)
    }

    async function handleDelete(slug: string) {
        if (mode === 'auth') {
            await deleteUrl(slug, token)
        }
        const updatedUrls = urls.filter(u => u.slug !== slug)
        setUrls(updatedUrls)
        if (mode === 'local') {
            localStorage.setItem('urls', JSON.stringify(updatedUrls))
        }
        setSelectedSlug(null)
    }

    return (
        <div className='layout'>
            <div className='config'>
                <button className="configbutton">
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 474 512.46">
                        <path d="M249.71.13 12.08 35.6C5.46 36.59 0 43.43 0 50.23v418.88c0 6.77 5.39 9.38 12.08 10.31l237.63 32.97c6.68.92 12.08-7.77 12.08-14.63V10.44c0-6.86-5.53-11.28-12.08-10.31zm124.96 329.08-.01-34.07c-.58.17-1.2.27-1.83.27h-53.47c-3.55 0-6.45-2.96-6.45-6.45v-66.2c0-3.48 2.97-6.45 6.45-6.45h53.47c.63 0 1.24.1 1.82.27v-34.06c0-6.29 5.1-11.4 11.39-11.4 3.29 0 6.25 1.4 8.33 3.63l76.01 70.9c4.59 4.27 4.85 11.47.58 16.06l-76.95 75.59c-4.47 4.4-11.67 4.34-16.07-.13a11.439 11.439 0 0 1-3.27-7.96zm-87.26 129.54h31.02V345.46h25.37v113.9c0 6.77-2.8 12.95-7.27 17.44-4.47 4.52-10.67 7.31-17.49 7.31h-31.63v-25.36zm31.02-292.48V52.98h-31.02V27.62h31.63c6.81 0 13.01 2.79 17.49 7.27 4.47 4.48 7.27 10.68 7.27 17.49v113.89h-25.37zm-87.67 58.52-24.93-5.68v74.24l24.93-7.18v-61.38z"/>
                    </svg>
                </button>
            </div>
            <Sidebar urls={urls} onSelectUrl={(url) => setSelectedSlug(url.slug)}></Sidebar>
            <h1 className='title'>MetricLink</h1>
            <div className='home'>
                {displayUrl
                    ? <UrlCard url={displayUrl} onBack={handleBack} onDelete={handleDelete} token={token} />
                    : <UrlForm onUrlCreated={handleUrlCreated} mode={mode} token={token} />
                }
            </div>
        </div>
    )
}