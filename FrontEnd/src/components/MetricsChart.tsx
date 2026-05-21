import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import './MetricsChart.css'

interface MetricsChartProps {
    history: { day: string, clicks: number }[]
}

export default function MetricsChart({ history }: MetricsChartProps) {
    return (
        <div className='metricsChart'>
            <LineChart width={500} height={300} data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis 
                    allowDecimals={false}
                    domain={[0, (dataMax: number) => dataMax + 1]}
                />
                <Tooltip />
                <Line type="monotone" dataKey="clicks" stroke="#aed6fc" />
            </LineChart>
        </div>
    )
}
