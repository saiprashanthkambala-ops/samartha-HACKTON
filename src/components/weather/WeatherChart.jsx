import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/**
 * Forecast charts. Values must come from a configured forecast source —
 * never invented. Charts show units and readable labels.
 */
export function TemperatureChart({ days, unitLabel = '°C' }) {
  const data = days.map((d) => ({
    day: d.dayLabel,
    max: d.tempMaxC,
    min: d.tempMinC,
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#DCEAF5" />
        <XAxis dataKey="day" stroke="#72859A" fontSize={12} />
        <YAxis stroke="#72859A" fontSize={12} unit={unitLabel} />
        <Tooltip
          formatter={(v, name) => [`${v} ${unitLabel}`, name === 'max' ? 'Max' : 'Min']}
          contentStyle={{ borderRadius: 10, borderColor: '#DCEAF5' }}
        />
        <Line type="monotone" dataKey="max" stroke="#1469B8" strokeWidth={2.5} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="min" stroke="#12995F" strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function RainfallChart({ days, unitLabel = 'mm' }) {
  const data = days.map((d) => ({ day: d.dayLabel, rain: d.rainMm }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#DCEAF5" />
        <XAxis dataKey="day" stroke="#72859A" fontSize={12} />
        <YAxis stroke="#72859A" fontSize={12} unit={unitLabel} />
        <Tooltip
          formatter={(v) => [`${v} ${unitLabel}`, 'Rainfall']}
          contentStyle={{ borderRadius: 10, borderColor: '#DCEAF5' }}
        />
        <Bar dataKey="rain" fill="#3D98F2" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
