import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import './MetricsChart.css'

interface MetricsChartProps {
    history: { day: string, clicks: number }[]
}

export default function MetricsChart({ history }: MetricsChartProps) {

    const chartWidth = Math.max(600, history.length * 80)

    return (
        <div className='metricsChart'>
            <LineChart width={chartWidth} height={350} data={history} margin={{ top: 40, right: 60, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="day" 
                    tick={{ fill: '#ffffff' }} 
                    padding={{ left: 30, right: 30 }} 
                    dy={10}
                    tickFormatter={(value) => value.slice(2)}
                    label={{ value: 'Date', position: 'insideRight', offset: -50, dy:-17, fill: '#db6969ff' }}
                />
                <YAxis 
                    allowDecimals={false} 
                    domain={[0, (dataMax: number) => dataMax + 1]} 
                    tick={{ fill: '#ffffff' }} 
                    dx={-10}
                    label={{ value: 'Clicks', position: 'insideTop', offset: -35, dx:35, fill: '#db6969ff' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#ffffffff',
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
                <Line type="linear" dataKey="clicks" stroke="#aed6fc" />
            </LineChart>
        </div>
    )
}
