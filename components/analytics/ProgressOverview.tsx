import React from 'react';

interface ProgressOverviewProps {
  totalKanji: number;
  studiedKanji: number;
  unstudiedKanji: number;
  progressPercentage: number;
}

const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  totalKanji,
  studiedKanji,
  unstudiedKanji,
  progressPercentage
}) => {
  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Study Progress</span>
          <span className="text-sm text-gray-500">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>{totalKanji}</span>
        </div>
      </div>

      {/* Progress Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{studiedKanji}</div>
          <div className="text-sm text-green-700">Studied</div>
          <div className="text-xs text-gray-500 mt-1">
            {progressPercentage}% of total
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{unstudiedKanji}</div>
          <div className="text-sm text-gray-700">Remaining</div>
          <div className="text-xs text-gray-500 mt-1">
            {100 - progressPercentage}% left
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
        <div className="text-center">
          {progressPercentage === 100 ? (
            <>
              <div className="text-2xl mb-2">🎉</div>
              <div className="font-semibold text-gray-800">Congratulations!</div>
              <div className="text-sm text-gray-600">You&apos;ve studied all available kanji!</div>
            </>
          ) : progressPercentage >= 75 ? (
            <>
              <div className="text-2xl mb-2">🔥</div>
              <div className="font-semibold text-gray-800">Almost There!</div>
              <div className="text-sm text-gray-600">Just {unstudiedKanji} more kanji to go!</div>
            </>
          ) : progressPercentage >= 50 ? (
            <>
              <div className="text-2xl mb-2">💪</div>
              <div className="font-semibold text-gray-800">Great Progress!</div>
              <div className="text-sm text-gray-600">You&apos;re halfway through!</div>
            </>
          ) : progressPercentage >= 25 ? (
            <>
              <div className="text-2xl mb-2">🌱</div>
              <div className="font-semibold text-gray-800">Good Start!</div>
              <div className="text-sm text-gray-600">Keep up the momentum!</div>
            </>
          ) : (
            <>
              <div className="text-2xl mb-2">🚀</div>
              <div className="font-semibold text-gray-800">Ready to Begin!</div>
              <div className="text-sm text-gray-600">Your kanji journey starts here!</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressOverview;