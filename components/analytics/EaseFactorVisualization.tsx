import React from 'react';

interface EaseFactorVisualizationProps {
  averageEaseFactor: number;
}

const EaseFactorVisualization: React.FC<EaseFactorVisualizationProps> = ({
  averageEaseFactor
}) => {
  // Ease factor typically ranges from 1.3 (very hard) to 2.5+ (very easy)
  // We'll normalize this to a 0-100 scale for visualization
  const normalizedEase = Math.min(100, Math.max(0, ((averageEaseFactor - 1.3) / (2.5 - 1.3)) * 100));
  
  const getDifficultyInfo = () => {
    if (averageEaseFactor >= 2.3) {
      return {
        level: 'Very Easy',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        barColor: 'bg-green-500',
        icon: '🎯',
        message: 'You find most kanji quite easy!'
      };
    } else if (averageEaseFactor >= 2.1) {
      return {
        level: 'Easy',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        barColor: 'bg-blue-500',
        icon: '😊',
        message: 'Good mastery of the material!'
      };
    } else if (averageEaseFactor >= 1.9) {
      return {
        level: 'Moderate',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        barColor: 'bg-yellow-500',
        icon: '⚖️',
        message: 'Balanced difficulty level.'
      };
    } else if (averageEaseFactor >= 1.6) {
      return {
        level: 'Challenging',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        barColor: 'bg-orange-500',
        icon: '💪',
        message: 'Keep practicing for improvement!'
      };
    } else {
      return {
        level: 'Very Hard',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        barColor: 'bg-red-500',
        icon: '🔥',
        message: 'Stay strong! Practice makes perfect!'
      };
    }
  };

  const difficultyInfo = getDifficultyInfo();

  return (
    <div className="space-y-6">
      {/* Ease Factor Display */}
      <div className="text-center">
        <div className="text-4xl mb-2">{difficultyInfo.icon}</div>
        <div className={`text-lg font-semibold ${difficultyInfo.color}`}>
          {difficultyInfo.level}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Average Ease Factor: {averageEaseFactor.toFixed(2)}
        </div>
      </div>

      {/* Visual Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Difficulty Level</span>
          <span className="text-sm text-gray-500">{normalizedEase.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className={`${difficultyInfo.barColor} h-4 rounded-full transition-all duration-500`}
            style={{ width: `${normalizedEase}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Hard</span>
          <span>Easy</span>
        </div>
      </div>

      {/* Explanation */}
      <div className={`${difficultyInfo.bgColor} rounded-lg p-4`}>
        <div className="text-center">
          <div className={`font-semibold ${difficultyInfo.color} mb-1`}>
            {difficultyInfo.message}
          </div>
          <div className="text-sm text-gray-600">
            The ease factor measures how difficult you find the kanji on average.
            Higher values indicate easier recall.
          </div>
        </div>
      </div>

      {/* Scale Reference */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Ease Factor Scale:</div>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>1.3 - 1.6</span>
            <span className="text-red-600">Very Hard</span>
          </div>
          <div className="flex justify-between">
            <span>1.6 - 1.9</span>
            <span className="text-orange-600">Challenging</span>
          </div>
          <div className="flex justify-between">
            <span>1.9 - 2.1</span>
            <span className="text-yellow-600">Moderate</span>
          </div>
          <div className="flex justify-between">
            <span>2.1 - 2.3</span>
            <span className="text-blue-600">Easy</span>
          </div>
          <div className="flex justify-between">
            <span>2.3+</span>
            <span className="text-green-600">Very Easy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EaseFactorVisualization;