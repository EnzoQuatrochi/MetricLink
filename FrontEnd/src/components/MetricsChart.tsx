import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import './MetricsChart.css'

interface MetricsChartProps {
    history: { day: string, clicks: number }[]
}

export default function MetricsChart({ history }: MetricsChartProps) {
    return (
        <div className='metricsChart'>
            <LineChart width={500} height={300} data={history} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis 
                    allowDecimals={false}
                    domain={[0, (dataMax: number) => dataMax + 1]}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: '#e2e8f0',
                        fontSize: '13px',
                    }}
                    wrapperStyle={{ zIndex: 100 }}
                    itemStyle={{ color: '#aed6fc' }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                    cursor={{ stroke: 'rgba(174, 214, 252, 0.3)', strokeWidth: 1 }}
                />
                <Line type="monotone" dataKey="clicks" stroke="#aed6fc" />
            </LineChart>
        </div>
    )
}
