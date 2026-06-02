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
    const { min: minExpirationDate, max: maxExpirationDate } = getExpirationDateBounds()

    async function handleSubmit(){
        if (!url.trim()) {
            setNotice("Empty url input")
            return
        }
        if (!expiresAt) {
            setNotice("Empty expiration date")
            return
        }
        if (!isExpirationDateInRange(expiresAt, minExpirationDate, maxExpirationDate)) {
            setNotice("Expiration date must be within the next 30 days")
            return
        }

        setNotice("")

        try {
            const newUrl = await createUrl(url.trim(), expiresAt)
            onUrlCreated(newUrl)
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
                        setNotice("")
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
                            setNotice("Expiration date must be within the next 30 days")
                            return
                        }
                        setExpiresAt(value)
                        setNotice("")
                    }}
                />
            </div>
            <p className="urlFormNotice">{notice}</p>
            <button className="submitButton" onClick={handleSubmit}>Create</button>
        </div>
    )
}
