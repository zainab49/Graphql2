// XPByProjectChart.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';

function XPByProjectChart({ projects }) {
  const chartData = projects.map((project) => ({
    name: project.object?.name || 'Unknown',
    xp: parseFloat((project.amount / 1024).toFixed(2)),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 30, bottom: 90 }}
      >
        <defs>
          <linearGradient id="gradientXp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8E9AAF" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#CBC0D3" stopOpacity={0.2} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="4 4" stroke="#EFD3D7" />
        <XAxis
          dataKey="name"
          angle={-40}
          textAnchor="end"
          interval={0}
          tick={{ fill: '#8E9AAF', fontSize: 12 }}
        />
        <YAxis
          tick={{ fill: '#8E9AAF' }}
          label={{
            value: 'XP in KB',
            angle: -90,
            position: 'insideLeft',
            style: { fill: '#8E9AAF', fontSize: 14 },
          }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', borderColor: '#CBC0D3' }}
          labelStyle={{ color: '#8E9AAF' }}
          cursor={{ fill: '#EFD3D7', opacity: 0.1 }}
        />
        <Bar dataKey="xp" fill="url(#gradientXp)" radius={[10, 10, 0, 0]}>
          <LabelList dataKey="xp" position="top" fill="#5a6c7d" fontSize={12} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default XPByProjectChart;
