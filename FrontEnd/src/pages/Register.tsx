import './Register.css'
import { useState } from 'react'
import { createUser } from '../services/api'
import { useNavigate } from 'react-router-dom'
import UserComponent from '../components/UserComponent'

export default function Register(){

    const navigate = useNavigate()
    const [error, setError] = useState<string | undefined>()

    async function handleRegister(name: string, password: string) {
        setError(undefined)

        if (!name.trim()) {
            setError("Name can't be empty")
            return
        }
        if (!password.trim()) {
            setError("Password can't be empty")
            return
        }

        try {
            const token = await createUser(name, password)
            navigate('/home', { state: { mode: 'auth', token }, replace: true })
        } catch {
            setError('Error to create account. This name could already be used.')
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