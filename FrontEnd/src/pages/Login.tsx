import './Login.css'
import { useState } from 'react'
import { loginUser } from '../services/api'
import { useNavigate } from 'react-router-dom'
import UserComponent from '../components/UserComponent'

export default function Login() {
    const navigate = useNavigate()
    const [error, setError] = useState<string | undefined>()

    async function handleLogin(email: string, password: string) {
        setError(undefined)
        try {
            const token = await loginUser(email, password)
            navigate('/home', { state: { mode: 'auth', token } })
        } catch {
            setError('Invalid email or password.')
        }
    }

    return (
        <div className='login'>
            <div className='topButton'>
                <button className="backButton" onClick={() => navigate(-1)}>🠔 Back</button>
            </div>
            <UserComponent
                title='Login'
                buttonLabel='Login'
                onSubmit={handleLogin}
                error={error}
            />
        </div>
    )
}