import './Register.css'
import { useState } from 'react'
import { createUser } from '../services/api'
import { useNavigate } from 'react-router-dom'
import UserComponent from '../components/UserComponent'

export default function Register(){

    const navigate = useNavigate()
    const [error, setError] = useState<string | undefined>()

    async function handleRegister(email: string, password: string) {
        setError(undefined)
        try {
            const token = await createUser(email, password)
            navigate('/home', { state: { mode: 'auth', token } })
        } catch {
            setError('Invalid email or password.')
        }
    }

    return (
        <div className='register'>
            <div className='topButton'>
                <button className="backButton" onClick={() => navigate(-1)}>🠔 Back</button>
            </div>
            <UserComponent title='Create Account' onSubmit={handleRegister} error={error} buttonLabel='Create' />
        </div>
    )
}