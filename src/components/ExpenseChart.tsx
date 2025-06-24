
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ExpenseChartProps {
  data?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const ExpenseChart = ({ data }: ExpenseChartProps) => {
  // Use dados reais ou dados de exemplo se não houver dados
  const chartData = data && data.length > 0 ? data : [
    { name: 'Moradia', value: 1200, color: '#3B82F6' },
    { name: 'Alimentação', value: 800, color: '#10B981' },
    { name: 'Transporte', value: 450, color: '#F59E0B' },
    { name: 'Lazer', value: 300, color: '#EF4444' },
    { name: 'Saúde', value: 250, color: '#8B5CF6' },
    { name: 'Outros', value: 200.50, color: '#6B7280' },
  ];

  const COLORS = chartData.map(item => item.color);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [
              `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
              ''
            ]}
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              color: 'white'
            }}
          />
          <Legend 
            wrapperStyle={{ color: 'white' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
