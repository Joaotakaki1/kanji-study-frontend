import React from 'react';

interface SessionSummaryProps {
  deckTitle: string;
  totalCards: number;
  answeredCards: { kanjiId: number; grade: string }[];
  onBackToDeck: () => void;
  onStudyAgain: () => void;
}

const SessionSummary: React.FC<SessionSummaryProps> = ({
  deckTitle,
  totalCards,
  answeredCards,
  onBackToDeck,
  onStudyAgain
}) => {
  // Calculate statistics
  const badCount = answeredCards.filter(card => card.grade === 'bad').length;
  const hardCount = answeredCards.filter(card => card.grade === 'hard').length;
  const goodCount = answeredCards.filter(card => card.grade === 'good').length;
  const easyCount = answeredCards.filter(card => card.grade === 'easy').length;

  // Ensure we have valid numbers for calculation
  const validTotalCards = totalCards && totalCards > 0 ? totalCards : (answeredCards?.length || 1);
  const successfulCards = goodCount + easyCount;
  const successRate = Math.round((successfulCards / validTotalCards) * 100);

  const getPerformanceMessage = () => {
    if (successRate >= 90) return { message: "Excellent work! 🌟", color: "text-green-600" };
    if (successRate >= 70) return { message: "Great job! 🎉", color: "text-blue-600" };
    if (successRate >= 50) return { message: "Good effort! 👍", color: "text-yellow-600" };
    return { message: "Keep practicing! 💪", color: "text-orange-600" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Session Complete!</h1>
          <p className="text-gray-600">
            You&apos;ve finished studying &ldquo;{deckTitle}&rdquo;
          </p>
        </div>

        {/* Performance overview */}
        <div className="text-center mb-8">
          <div className={`text-2xl font-bold mb-2 ${performance.color}`}>
            {performance.message}
          </div>
          <div className="text-4xl font-bold text-gray-800 mb-2">
            {successRate}%
          </div>
          <div className="text-gray-600">
            Success rate ({goodCount + easyCount} out of {validTotalCards} cards)
          </div>
        </div>

        {/* Detailed statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{badCount}</div>
            <div className="text-sm text-red-700">😵 Bad</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{hardCount}</div>
            <div className="text-sm text-orange-700">😅 Hard</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{goodCount}</div>
            <div className="text-sm text-green-700">😊 Good</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{easyCount}</div>
            <div className="text-sm text-blue-700">🎯 Easy</div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <h3 className="font-semibold text-gray-800 mb-2">📈 Study Recommendations</h3>
          <div className="text-sm text-gray-600 space-y-1">
            {badCount > 0 && (
              <div>• Review the {badCount} kanji marked as &quot;Bad&quot; - they need more practice</div>
            )}
            {hardCount > 0 && (
              <div>• The {hardCount} &quot;Hard&quot; kanji will appear sooner for review</div>
            )}
            {successRate < 70 && (
              <div>• Consider studying this deck again to improve retention</div>
            )}
            {successRate >= 90 && (
              <div>• Excellent mastery! These kanji will be scheduled for longer intervals</div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onBackToDeck}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            📚 Back to Deck
          </button>
          <button
            onClick={onStudyAgain}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            🔄 Study Again
          </button>
        </div>

        {/* Next study reminder */}
        <div className="text-center mt-6 text-sm text-gray-500">
          💡 Come back tomorrow for your scheduled reviews!
        </div>
      </div>
    </div>
  );
};

export default SessionSummary;