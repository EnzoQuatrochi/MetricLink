import './Login.css'
import { useState } from 'react'
import { loginUser } from '../services/api'
import { useNavigate } from 'react-router-dom'
import UserComponent from '../components/UserComponent'

export default function Login() {
    const navigate = useNavigate()
    const [error, setError] = useState<string | undefined>()

    async function handleLogin(name: string, password: string) {
        setError(undefined)

        if (!name.trim()) {
            setError('Nome não pode ser vazio.')
            return
        }
        if (!password.trim()) {
            setError('Senha não pode ser vazia.')
            return
        }

        try {
            const token = await loginUser(name, password)
            navigate('/home', { state: { mode: 'auth', token }, replace: true })
        } catch {
            setError('Nome ou senha incorretos.')
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