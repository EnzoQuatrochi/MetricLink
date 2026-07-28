import './UrlCard.css'
import type { Url } from '../types'
import { deleteUrl } from '../services/api'
import { useNavigate } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_API_URL

function isUrlExpired(expiresAt: string): boolean {
    return new Date(expiresAt) < new Date()
}

interface UrlCardProps {
    url: Url
    onBack: () => void
    onDelete: (slug: string) => void
}

export default function UrlCard({ url, onBack, onDelete }: UrlCardProps) {

    const navigate = useNavigate()
    const expired = isUrlExpired(url.expires_at)

    function copyToClipboard() {
        navigator.clipboard.writeText(`${BASE_URL}/${url.slug}`)
    }

    async function handleDelete() {
        await deleteUrl(url.slug)
        onDelete(url.slug)
    }

    return (
        <div className='urlCard'>
            <div className='topButton'>
                <button className="backButton" onClick={onBack}>🠔 Back</button>
            </div>
            <div className='formPosition'>
                <div className="card_form">
                    <h1>Url Data - {url.slug}</h1>
                    <p><strong>Short Url: </strong>{BASE_URL}/{url.slug}</p>
                    <p><strong>Original Url: </strong>{url.original_url}</p>
                    <p><strong>Created at: </strong>{new Date(url.created_at).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Expired at: </strong>{new Date(url.expires_at).toLocaleDateString('pt-BR')}</p>
                    <p className="urlCardNotice">{expired ? "This url is expired" : ""}</p>
                    <div className="url-card-buttons">
                        <button className="copyButton" onClick={copyToClipboard}>Copy URL</button>
                        <button className="submitButton" onClick={() => navigate(`/metrics/${url.slug}`, { state: { slug: url.slug } })}>View Metrics</button>
                        <button className='deleteButton' onClick={handleDelete}>Delete Url</button>
                    </div>
                </div>
            </div>
        </div>
    )
}