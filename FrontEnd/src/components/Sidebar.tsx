import type { Url } from '../types'
import './Sidebar.css'

interface SidebarProps {
    urls: Url[]
    onSelectUrl: (url: Url) => void
}

export default function Sidebar({ urls, onSelectUrl }: SidebarProps) {
    return (
        <div className="sidebar">
            <h1 className='sidebarTitle'>Urls History</h1>
            {urls.map((url) => (
                <div key={url.slug} className="urlSidebarCard" onClick={() => onSelectUrl(url)}>
                    <p>Slug: <strong>{url.slug}</strong></p>
                    <p className="urlOriginal" title={url.original_url}>{url.original_url}</p>
                </div>
            ))}
        </div>
    )
}