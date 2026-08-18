import './UrlCard.css'
import './UrlForm.css'
import type { Url } from '../types'
import { deleteUrl } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

const BASE_URL = import.meta.env.VITE_API_URL

function isUrlExpired(expiresAt: string): boolean {
    return new Date(expiresAt) < new Date()
}

interface UrlCardProps {
    url: Url
    onBack: () => void
    onDelete: (slug: string) => void
    token?: string
    mode?: string
}

export default function UrlCard({ url, onBack, onDelete, token, mode }: UrlCardProps) {

    const navigate = useNavigate()
    const expired = isUrlExpired(url.expires_at)
    const cardRef = useRef<HTMLDivElement>(null)
    const [borderFlash, setBorderFlash] = useState<'success' | 'error' | null>(null)
    const [borderSize, setBorderSize] = useState({ width: 0, height: 0 })
    const [copyNotice, setCopyNotice] = useState<string>('')
    const [copyNoticeIsSuccess, setCopyNoticeIsSuccess] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    function triggerBorderFlash(type: 'success' | 'error') {
        setBorderFlash(null)
        requestAnimationFrame(() => {
            if (cardRef.current) {
                const { offsetWidth, offsetHeight } = cardRef.current
                setBorderSize({ width: offsetWidth, height: offsetHeight })
            }
            setBorderFlash(type)
        })
    }

    function handleBorderAnimationEnd(event: React.AnimationEvent<SVGRectElement>) {
        if (event.animationName === 'form-border-draw') {
            setBorderFlash(null)
            setCopyNotice('')
        }
    }

    function copyToClipboard() {
        if (expired) {
            setCopyNoticeIsSuccess(false)
            setCopyNotice('Url Expired')
            triggerBorderFlash('error')
        } else {
            navigator.clipboard.writeText(`${BASE_URL}/${url.slug}`)
            setCopyNoticeIsSuccess(true)
            setCopyNotice('Copied')
            triggerBorderFlash('success')
        }
    }

    async function handleDelete() {
        setShowConfirm(false)
        await deleteUrl(url.slug, token)
        onDelete(url.slug)
    }

    return (
        <>
        {showConfirm && (
            <ConfirmDialog
                message="Deseja excluir essa url permanentemente?"
                onConfirm={handleDelete}
                onCancel={() => setShowConfirm(false)}
            />
        )}
        <div className='urlCard'>
            <div className='topButton'>
                <button className="backButton" onClick={onBack}>🠔 Back</button>
            </div>
            <div className='formPosition'>
                <div className="card_form" ref={cardRef}>
                    {borderFlash && borderSize.width > 0 && (
                        <svg
                            className="form-borderFlash"
                            width={borderSize.width}
                            height={borderSize.height}
                            aria-hidden="true"
                        >
                            <rect
                                className={`form-borderFlash-stroke form-borderFlash-stroke--${borderFlash}`}
                                x="1"
                                y="1"
                                width={borderSize.width - 2}
                                height={borderSize.height - 2}
                                rx="15"
                                ry="15"
                                pathLength="100"
                                onAnimationEnd={handleBorderAnimationEnd}
                            />
                        </svg>
                    )}
                    <h1>Url Data - {url.slug}</h1>
                    <p><strong>Short Url: </strong>{BASE_URL}/{url.slug}</p>
                    <p><strong>Original Url: </strong>{url.original_url}</p>
                    <p><strong>Created at: </strong>{new Date(url.created_at).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Expired at: </strong>{new Date(url.expires_at).toLocaleDateString('pt-BR')}</p>
                    <p className={`urlCardNotice${copyNotice ? (copyNoticeIsSuccess ? ' urlCardNotice--success' : '') : ''}`}>
                        {copyNotice || (expired ? 'This url is expired' : '')}
                    </p>
                    <div className="url-card-buttons">
                        <button className="copyButton" onClick={copyToClipboard}>Copy URL</button>
                        <button className="submitButton" onClick={() => navigate(`/metrics/${url.slug}`, { state: { token, mode } })}>View Metrics</button>
                        <button className='deleteButton' onClick={() => setShowConfirm(true)}>Delete Url</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}