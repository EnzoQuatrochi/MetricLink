import './Home.css'
import { useState } from 'react'
import type { Url } from '../types'
import UrlForm from '../components/UrlForm'
import UrlCard from '../components/UrlCard'
import Sidebar from '../components/Sidebar'
import { useParams, useNavigate } from 'react-router-dom'

export default function Home() {

    const { slug } = useParams<{ slug: string }>()
    const navigate = useNavigate()
    
    const [urls, setUrls] = useState<Url[]>(() => {
        const saved = localStorage.getItem('urls')
        return saved ? JSON.parse(saved) : []
    })

    const displayUrl = slug
        ? urls.find(u => u.slug === slug) ?? null
        : null

    function handleUrlCreated(newUrl: Url) {
        const updatedUrls = [...urls, newUrl]
        setUrls(updatedUrls)
        localStorage.setItem('urls', JSON.stringify(updatedUrls))
    }

    function handleBack() {
        navigate('/')
    }

    function handleDelete(slug: string) {
        const updatedUrls = urls.filter(u => u.slug !== slug)
        setUrls(updatedUrls)
        localStorage.setItem('urls', JSON.stringify(updatedUrls))
        navigate('/')
    }

    return (
        <div className='layout'>
            <Sidebar urls={urls} onSelectUrl={(url) => navigate(`/url/${url.slug}`)} />
            <h1 className='title'>MetricLink</h1>
            <div className='home'>  
                {displayUrl 
                    ? <UrlCard url={displayUrl} onBack={handleBack} onDelete={handleDelete} />
                    : <UrlForm onUrlCreated={handleUrlCreated} />
                }
            </div>
        </div>
    )
}