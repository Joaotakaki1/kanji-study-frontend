import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'orange' | 'green' | 'purple' | 'red' | 'yellow';
  subtitle?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle,
  trend
}) => {
  const colorClasses = {
    blue: {
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      icon: 'text-blue-500'
    },
    orange: {
      text: 'text-orange-600',
      bg: 'bg-orange-50',
      icon: 'text-orange-500'
    },
    green: {
      text: 'text-green-600',
      bg: 'bg-green-50',
      icon: 'text-green-500'
    },
    purple: {
      text: 'text-purple-600',
      bg: 'bg-purple-50',
      icon: 'text-purple-500'
    },
    red: {
      text: 'text-red-600',
      bg: 'bg-red-50',
      icon: 'text-red-500'
    },
    yellow: {
      text: 'text-yellow-600',
      bg: 'bg-yellow-50',
      icon: 'text-yellow-500'
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <span className="text-green-500">📈</span>;
      case 'down':
        return <span className="text-red-500">📉</span>;
      default:
        return <span className="text-gray-500">➡️</span>;
    }
  };

  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      {/* Header with icon */}
      <div className="flex items-center justify-between mb-4">
        <div className={`${colors.bg} rounded-lg p-3`}>
          <span className={`text-2xl ${colors.icon}`}>{icon}</span>
        </div>
        {trend && (
          <div className="flex items-center space-x-1 text-sm">
            {getTrendIcon()}
            <span className="text-gray-600">{trend.value}</span>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="text-sm font-medium text-gray-500 mb-2">{title}</div>

      {/* Value */}
      <div className={`text-3xl font-bold ${colors.text} mb-2`}>
        {value}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div className="text-sm text-gray-600">{subtitle}</div>
      )}
    </div>
  );
};

export default StatCard;