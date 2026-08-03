import './UserComponent.css'
import { useState } from 'react'

interface UserComponentProps {
    title: string
    buttonLabel: string
    onSubmit?: (email: string, password: string) => void
    error?: string
}

export default function UserComponent({ title, buttonLabel, onSubmit, error }: UserComponentProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function handleSubmit() {
        onSubmit?.(email, password)
    }

    return (
        <div className='userComponent'>
            <h1>{title}</h1>
            <p className='subtitle'>Syncrone your urls metrics in all devices!</p>
            <div className='properties'>
                <label>Enter your Email:</label>
                <input
                    className='data'
                    placeholder='Email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <label>Enter your Password:</label>
                <input
                    className='data'
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            {error && <p className='errorMsg'>{error}</p>}
            <div className='buttons'>
                <button onClick={handleSubmit}>{buttonLabel}</button>
            </div>
        </div>
    )
}
