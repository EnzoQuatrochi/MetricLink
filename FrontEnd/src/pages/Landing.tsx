import './Landing.css'
import { useNavigate, Link } from 'react-router-dom'

export default function Landing() {
    const navigate = useNavigate()

    return (
        <div className='pag'>
            <div className='LandingForm'>
                <h1>Welcome to MetricLink</h1>
                <p className='subtitle'>Create, track and delete your personal urls with metrics</p>
                <div className='buttons'>
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/home', { state: { mode: 'local' } })}>Guest</button>
                </div>
                <p>Don't have an account? <Link to='/register'>Create one!</Link></p>
            </div>
        </div>
    )
}
