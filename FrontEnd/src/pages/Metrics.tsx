import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { MetricsHistory } from '../types'
import { getMetricsHistory } from '../services/api'
import MetricsChart from '../components/MetricsChart'
import './Metrics.css'

export default function Metrics() {

    const { slug } = useParams<{ slug: string }>()
    const [metrics, setMetrics] = useState<MetricsHistory | null>(null)

    useEffect(() => {
        async function fetchMetrics() {
            const data = await getMetricsHistory(slug!)
            setMetrics(data)
        }
        fetchMetrics()
    }, [slug])

    const navigate = useNavigate()
    
    return (
        <div className="metrics">
            <div className='topButton'>
                <button className="backButton" onClick={() => navigate(-1)}>🠔 Voltar</button>
            </div>
            <div className='metricsCard'>
                <div className='h1'>
                    <h1>Métricas de {slug}</h1>
                </div>
                {metrics ? (
                    <>
                        <div className='metricsData'>
                            <p>Total de Clicks: {metrics.total_clicks}</p>
                            <p>Cliques por Dia:</p>
                            <div className='days'>
                                {metrics.history.map((item) => (
                                    <p key={item.day}>• {item.day}: {item.clicks} clicks</p>
                                ))}
                            </div>
                        </div>
                        <MetricsChart history={metrics.history} />
                    </>
                ) : (
                    <p>Carregando...</p>
                )}
            </div>
        </div>
    )
}
