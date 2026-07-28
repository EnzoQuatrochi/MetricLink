import './UrlForm.css'
import axios from 'axios'
import type { Url } from '../types'
import { useRef, useState } from 'react'
import { createUrl } from '../services/api'
import { getExpirationDateBounds, isExpirationDateInRange } from '../utils/date'
import DatePicker from './DatePicker'

interface UrlFormProps {
    onUrlCreated: (url: Url) => void
}

export default function UrlForm({ onUrlCreated }: UrlFormProps){

    const [isLoading, setIsLoading] = useState(false)
    const [url, setUrl] = useState("")
    const [expiresAt, setExpiresAt] = useState("")
    const [notice, setNotice] = useState("")
    const [noticeIsSuccess, setNoticeIsSuccess] = useState(false)
    const [borderFlash, setBorderFlash] = useState<'success' | 'error' | null>(null)
    const [borderSize, setBorderSize] = useState({ width: 0, height: 0 })
    const formRef = useRef<HTMLDivElement>(null)
    const { min: minExpirationDate, max: maxExpirationDate } = getExpirationDateBounds()

    function triggerBorderFlash(type: 'success' | 'error') {
        setBorderFlash(null)
        requestAnimationFrame(() => {
            if (formRef.current) {
                const { offsetWidth, offsetHeight } = formRef.current
                setBorderSize({ width: offsetWidth, height: offsetHeight })
            }
            setBorderFlash(type)
        })
    }

    function showError(message: string) {
        setNoticeIsSuccess(false)
        setNotice(message)
        triggerBorderFlash('error')
    }

    function clearNotice() {
        setNotice("")
        setNoticeIsSuccess(false)
        setBorderFlash(null)
    }

    function handleBorderAnimationEnd(event: React.AnimationEvent<SVGRectElement>) {
        if (event.animationName === 'form-border-draw') {
            setBorderFlash(null)
        }
    }

    async function handleSubmit(){

        if (!url.trim()) {
            showError("Empty url input")
            return
        }
        if (!expiresAt) {
            showError("Empty expiration date")
            return
        }
        if (!isExpirationDateInRange(expiresAt, minExpirationDate, maxExpirationDate)) {
            showError("Expiration date must be within the next 30 days")
            return
        }

        setIsLoading(true)
        console.log(isLoading)

        try {
            const newUrl = await createUrl(url.trim(), expiresAt)
            onUrlCreated(newUrl)
            setUrl("")
            setExpiresAt("")
            setNotice("Url Created")
            setNoticeIsSuccess(true)
            triggerBorderFlash('success')
            setIsLoading(false)
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? (typeof error.response?.data?.detail === 'string'
                    ? error.response.data.detail
                    : 'Failed to create URL')
                : 'Failed to create URL'
            showError(message)
            await new Promise(resolve => setTimeout(resolve, 3500))
            setIsLoading(false)
        }
    }
    
    return(
        <div className="form" ref={formRef}>
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
                        rx="10"
                        ry="10"
                        pathLength="100"
                        onAnimationEnd={handleBorderAnimationEnd}
                    />
                </svg>
            )}
            <h1>Create Url</h1>
            <div className='properties'>
                <label>Url:</label>
                <input
                    className="data"
                    placeholder="Insert url"
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value)
                        clearNotice()
                    }}
                />
            </div>
            <div className='properties'>
                <label>Expiration date:</label>
                <DatePicker
                    minDate={minExpirationDate}
                    maxDate={maxExpirationDate}
                    value={expiresAt}
                    onChange={(value) => {
                        if (value && !isExpirationDateInRange(value, minExpirationDate, maxExpirationDate)) {
                            showError("Expiration date must be within the next 30 days")
                            return
                        }
                        setExpiresAt(value)
                        clearNotice()
                    }}
                />
            </div>
            <p className={`urlFormNotice${noticeIsSuccess ? " urlFormNotice--success" : ""}`}>{notice}</p>
            <button className="submitButton" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create"}
            </button>
        </div>
    )
}
