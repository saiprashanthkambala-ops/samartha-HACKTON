import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

/** Small trend sparkline — rendered only when historical data exists. */
export default function PriceSparkline({ history }) {
  if (!Array.isArray(history) || history.length < 2) return null;
  const data = history.map((v, i) => ({ i, v }));
  return (
    <div style={{ width: '100%', height: 46 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, bottom: 2, left: 0, right: 0 }}>
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Tooltip
            formatter={(v) => [`₹${v}`, '₹']}
            contentStyle={{ borderRadius: 8, fontSize: 12, borderColor: '#DCEAF5' }}
          />
          <Line type="monotone" dataKey="v" stroke="#1469B8" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
