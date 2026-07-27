import { useNavigate } from 'react-router-dom'
import type { Url } from '../types'
import './UrlCard.css'

interface UrlCardProps {
  url: Url
  onBack: () => void
}

const BASE_URL = import.meta.env.VITE_API_URL

function isUrlExpired(expiresAt: string): boolean {
    return new Date(expiresAt) < new Date()
}

export default function UrlCard({ url, onBack }: UrlCardProps){

    const navigate = useNavigate()
    const expired = isUrlExpired(url.expires_at)

    function copyToClipboard() {
        navigator.clipboard.writeText(`${BASE_URL}/${url.slug}`)
    }

    return(
        <div className='urlCard'>
            <div className='topButton'>
                <button className="backButton" onClick={onBack}>🠔 Back</button>
            </div>
            <div className='formPosition'>
                <div className="card_form">
                    <h1>Url Data</h1>
                    <p><strong>Short Url: </strong>{BASE_URL}/{url.slug}</p>
                    <p><strong>Original Url: </strong>{url.original_url}</p>
                    <p><strong>Created at: </strong>{new Date(url.created_at).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Expired at: </strong>{new Date(url.expires_at).toLocaleDateString('pt-BR')}</p>
                    <p className="urlCardNotice">{expired ? "This url is expired" : ""}</p>
                    <div className="url-card-buttons">
                        <button className="copyButton" onClick={copyToClipboard}>Copy URL</button>
                        <button className="submitButton" onClick={() => navigate(`/metrics/${url.slug}`)}>View Metrics</button>
                    </div>
                </div>
            </div>
        </div>
    )
}