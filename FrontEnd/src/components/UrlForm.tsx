import { useState } from 'react'
import { createUrl } from '../services/api'
import type { Url } from '../types'
import './UrlForm.css'

interface UrlFormProps {
  onUrlCreated: (url: Url) => void
}

export default function UrlForm({ onUrlCreated }: UrlFormProps){

    const [url, setUrl] = useState("")
    const [expiresAt, setExpiresAt] = useState("")

    async function handleSubmit(){
    
        try {
            const newUrl = await createUrl(url, expiresAt)
            onUrlCreated(newUrl)
        } catch (error) {
            console.error("Erro ao criar URL:", error)
        }
    }
    
    return(
        <div className="form">
            <h1>Criar Url</h1>
            <div className='properties'>
                <label>Url:</label>
                <input
                    className="data"
                    placeholder="Insira a url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
            </div>
            <div className='properties'>
                <label>Data de expiração:</label>
                <input
                    className="data"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                />
            </div>
            <p className="notice"></p>
            <button className="submitButton" onClick={handleSubmit}>Criar</button>
        </div>
    )
}
