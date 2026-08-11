import './Landing.css'
import { useNavigate, Link } from 'react-router-dom'

export default function Landing() {
    const navigate = useNavigate()

    return (
        <div className='landing-page'>
            <div className='landing-bg-animation'>
                <div className='shape shape-1'></div>
                <div className='shape shape-2'></div>
            </div>
            
            <div className='landing-content'>
                <div className='landing-card'>
                    <div className='landing-header'>
                        <h1 className='title-gradient'>MetricLink</h1>
                        <p className='subtitle'>
                            Create, track, and manage your personal URLs with detailed metrics.
                        </p>
                    </div>

                    <div className='landing-actions'>
                        <button className='btn-primary' onClick={() => navigate('/login')}>
                            Login
                        </button>
                        <button className='btn-secondary' onClick={() => navigate('/home', { state: { mode: 'local' }, replace: true })}>
                            Continue as Guest
                        </button>
                    </div>

                    <div className='landing-footer'>
                        <p>Don't have an account? <Link to='/register' className='register-link'>Create one!</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}
