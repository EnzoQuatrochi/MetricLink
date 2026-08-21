import './Home.css'
import type { Url } from '../types'
import type { AppMode } from '../types'
import { useEffect, useState } from 'react'
import UrlForm from '../components/UrlForm'
import UrlCard from '../components/UrlCard'
import Sidebar from '../components/Sidebar'
import ConfigComponent from '../components/ConfigComponent'
import { useLocation, useNavigate } from 'react-router-dom'
import { deleteUrl, getUserUrls } from '../services/api'

interface HomeState {
    mode: AppMode
    token?: string
}

export default function Home() {

    const location = useLocation()
    const navigate = useNavigate()

    const { mode, token, selectedSlug: initialSlug } = (location.state as HomeState & { selectedSlug?: string }) ?? { mode: 'local' }

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

    const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug ?? null)
    const [isConfigOpen, setIsConfigOpen] = useState(false)

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
            <div className="home-background"></div>
            {!displayUrl && (
                <div className='config'>
                    <button className="configButton" onClick={() => setIsConfigOpen(true)}>
                        <img src="/config.png" alt="Configurations" width="24" height="24" />
                    </button>
                </div>
            )}
            {isConfigOpen && (
                <ConfigComponent
                    onClose={() => setIsConfigOpen(false)}
                    onLogout={() => navigate('/')}
                />
            )}
            <Sidebar urls={urls} onSelectUrl={(url) => setSelectedSlug(url.slug)}></Sidebar>
            <h1 className='title'>MetricLink</h1>
            <div className='home'>
                {displayUrl
                    ? <UrlCard url={displayUrl} onBack={handleBack} onDelete={handleDelete} token={token} mode={mode} />
                    : <UrlForm onUrlCreated={handleUrlCreated} mode={mode} token={token} />
                }
            </div>
        </div>
    )
}