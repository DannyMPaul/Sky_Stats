import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface TempChartProps {
  data: Array<{
    dt: number;
    temp: number;
  }>;
  tempUnit: 'C' | 'F';
  onConvertTemp: (temp: number) => number;
}

export const TempChart = ({ data, tempUnit, onConvertTemp }: TempChartProps) => {
  const chartData = data.map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', hour12: true }),
    temp: Math.round(onConvertTemp(item.temp))
  }));

  return (
    <div className="w-full h-64 mt-4">
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-700" />
          <XAxis 
            dataKey="time"
            className="text-white text-xs"
          />
          <YAxis
            className="text-white text-xs"
            unit={`°${tempUnit}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(4px)',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white'
            }}
          />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#FCD34D"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};