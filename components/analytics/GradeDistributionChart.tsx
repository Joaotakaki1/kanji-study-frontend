import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface GradeDistributionData {
  grade: string;
  count: number;
  percentage: number;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

interface GradeDistributionChartProps {
  data: GradeDistributionData[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    payload: GradeDistributionData;
  }>;
}

const GradeDistributionChart: React.FC<GradeDistributionChartProps> = ({ data }) => {
  // Color scheme for different grades
  const COLORS = {
    'bad': '#ef4444',     // red
    'hard': '#f97316',    // orange
    'good': '#22c55e',    // green
    'easy': '#3b82f6'     // blue
  };

  // Custom tooltip component
  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800 capitalize">{data.grade}</p>
          <p className="text-gray-600">
            <span className="font-medium">{data.count}</span> cards ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend component
  interface LegendProps {
    payload?: Array<{
      value: string;
      color: string;
    }>;
  }

  const CustomLegend: React.FC<LegendProps> = (props) => {
    const { payload } = props;
    if (!payload) return null;
    
    return (
      <div className="flex justify-center mt-4">
        <div className="grid grid-cols-2 gap-4">
          {payload.map((entry, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm text-gray-600 capitalize">
                {entry.value} ({data.find(d => d.grade === entry.value)?.count || 0})
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Check if data is empty
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">🎯</div>
          <div>No grade data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            nameKey="grade"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.grade as keyof typeof COLORS] || '#6b7280'} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GradeDistributionChart;