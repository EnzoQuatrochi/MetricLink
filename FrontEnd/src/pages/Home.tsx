import { useState } from 'react'
import UrlForm from '../components/UrlForm'
import UrlCard from '../components/UrlCard'
import Sidebar from '../components/Sidebar'
import type { Url } from '../types'
import './Home.css'

export default function Home() {

    const [selectedUrl, setSelectedUrl] = useState<Url | null>(null)
    const [urls, setUrls] = useState<Url[]>(() => {
        const saved = localStorage.getItem('urls')
        return saved ? JSON.parse(saved) : []
    })

    function handleUrlCreated(newUrl: Url) {
        const updatedUrls = [...urls, newUrl]
        setUrls(updatedUrls)
        localStorage.setItem('urls', JSON.stringify(updatedUrls))
    }

    function handleBack() {
        setSelectedUrl(null)
    }

    return (
        <div className='layout'>
            <Sidebar urls={urls} onSelectUrl={setSelectedUrl} />
            <div className='home'>
                {selectedUrl 
                    ? <UrlCard url={selectedUrl} onBack={handleBack} />
                    : <UrlForm onUrlCreated={handleUrlCreated} />
                }
            </div>
        </div>
    )
}