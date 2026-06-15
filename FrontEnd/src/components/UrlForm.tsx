import { useState } from 'react'
import { createUrl } from '../services/api'
import { getExpirationDateBounds, isExpirationDateInRange } from '../utils/date'
import type { Url } from '../types'
import './UrlForm.css'

interface UrlFormProps {
  onUrlCreated: (url: Url) => void
}

export default function UrlForm({ onUrlCreated }: UrlFormProps){

    const [url, setUrl] = useState("")
    const [expiresAt, setExpiresAt] = useState("")
    const [notice, setNotice] = useState("")
    const [noticeIsSuccess, setNoticeIsSuccess] = useState(false)
    const { min: minExpirationDate, max: maxExpirationDate } = getExpirationDateBounds()

    function showError(message: string) {
        setNoticeIsSuccess(false)
        setNotice(message)
    }

    function clearNotice() {
        setNotice("")
        setNoticeIsSuccess(false)
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

        try {
            const newUrl = await createUrl(url.trim(), expiresAt)
            onUrlCreated(newUrl)
            setUrl("")
            setExpiresAt("")
            setNotice("Url Created")
            setNoticeIsSuccess(true)
        } catch (error) {
            console.error("Error to create URL:", error)
        }
    }
    
    return(
        <div className="form">
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
                <input
                    className="data"
                    type="date"
                    lang="en-US"
                    min={minExpirationDate}
                    max={maxExpirationDate}
                    value={expiresAt}
                    onChange={(e) => {
                        const value = e.target.value
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
            <button className="submitButton" onClick={handleSubmit}>Create</button>
        </div>
    )
}
