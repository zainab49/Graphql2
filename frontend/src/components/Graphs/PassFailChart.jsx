// PassFailChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

function PassFailChart({ passCount, failCount }) {
  const data = [
    { name: 'PASS', value: passCount },
    { name: 'FAIL', value: failCount },
  ];

  const COLORS = ['#A8DADC', '#FFB4B4'];

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={130}
        label={({ name, value }) => `${name}: ${value}`}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} stroke="#fff" strokeWidth={2} />
        ))}
      </Pie>
      <Tooltip
        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', borderColor: '#CBC0D3' }}
        labelStyle={{ color: '#8E9AAF' }}
      />
      <Legend
        iconType="circle"
        formatter={(value) => <span style={{ color: '#8E9AAF', fontWeight: '600' }}>{value}</span>}
      />
    </PieChart>
  );
}

export default PassFailChart;
