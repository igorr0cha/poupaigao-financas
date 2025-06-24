
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const ExpenseChart = () => {
  const data = [
    { name: 'Moradia', value: 1200, color: '#3B82F6' },
    { name: 'Alimentação', value: 800, color: '#10B981' },
    { name: 'Transporte', value: 450, color: '#F59E0B' },
    { name: 'Lazer', value: 300, color: '#EF4444' },
    { name: 'Saúde', value: 250, color: '#8B5CF6' },
    { name: 'Outros', value: 200.50, color: '#6B7280' },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [
              `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
              ''
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
