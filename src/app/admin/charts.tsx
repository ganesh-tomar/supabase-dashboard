'use client'

import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

export default function DashboardCharts({ data }: { data: any[] }) {
  // Transform the profile data into a daily count
  const dailyCounts = data.reduce((acc: any, profile: any) => {
    const date = new Date(profile.created_at).toLocaleDateString()
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const chartData = Object.keys(dailyCounts).map(date => ({
    date,
    users: dailyCounts[date]
  }))

  // If there's only one data point, duplicate it so the line chart can render properly
  if (chartData.length === 1) {
    chartData.push({ date: 'Today', users: chartData[0].users })
  }

  return (
    <div style={{ width: '100%', height: 300, marginTop: '2rem', backgroundColor: 'var(--card-bg)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: 'var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
      <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>User Growth over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="var(--foreground)" opacity={0.5} fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--foreground)" opacity={0.5} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card-bg)', border: 'var(--glass-border)', borderRadius: 'var(--radius-md)' }}
            itemStyle={{ color: 'var(--primary)', fontWeight: 600 }}
          />
          <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
