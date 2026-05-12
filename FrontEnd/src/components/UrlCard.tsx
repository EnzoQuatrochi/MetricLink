import { useNavigate } from 'react-router-dom'
import type { Url } from '../types'
import './UrlCard.css'

interface UrlCardProps {
    url: Url
}

export default function UrlCard({ url }: UrlCardProps){

    const navigate = useNavigate()

    function copyToClipboard() {
        navigator.clipboard.writeText(`http://127.0.0.1:8000/${url.slug}`)
    }

    return(
        <div className="form">
            <h1>Informações da Url</h1>
            <p><strong>Url Curta: </strong>http://127.0.0.1:8000/{url.slug}</p>
            <p><strong>Url original: </strong>{url.original_url}</p>
            <p><strong>Criada em: </strong>{new Date(url.created_at).toLocaleDateString('pt-BR')}</p>
            <p><strong>Expira em: </strong>{new Date(url.expires_at).toLocaleDateString('pt-BR')}</p>
            <div className="url-card-buttons">
                <button className="copyButton" onClick={copyToClipboard}>Copiar URL</button>
                <button className="submitButton" onClick={() => navigate(`/metrics/${url.slug}`)}>Ver métricas</button>
            </div>
        </div>
    )
}