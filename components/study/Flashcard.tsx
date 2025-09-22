import React, { useState } from 'react';

interface StudyCard {
  id: number; // Primary field (from API response)
  kanjiId?: number; // Fallback field name
  character: string;
  meaning: string;
  reading: string;
  isNew: boolean;
  isDue: boolean;
  strokeCount: number;
  grade: number;
  frequency: number;
}

interface FlashcardProps {
  card: StudyCard;
  onAnswer: (grade: 'bad' | 'hard' | 'good' | 'easy') => void;
  cardNumber: number;
  totalCards: number;
}

const Flashcard: React.FC<FlashcardProps> = ({ card, onAnswer, cardNumber, totalCards }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Safety check for card data
  if (!card) {
    return (
      <div className="relative w-full max-w-lg min-h-96">
        <div className="bg-red-50 border border-red-200 rounded-xl shadow-2xl p-8 flex flex-col justify-center items-center">
          <div className="text-red-600 text-lg font-semibold mb-4">Card Error</div>
          <div className="text-red-500 text-center">
            Card data is missing. Please try refreshing the study session.
          </div>
        </div>
      </div>
    );
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (grade: 'bad' | 'hard' | 'good' | 'easy') => {
    onAnswer(grade);
    // Reset flip state for next card
    setIsFlipped(false);
  };

  return (
    <div className="relative w-full max-w-lg">
      {/* Card container with flip animation */}
      <div 
        className={`relative w-full min-h-[500px] transition-all duration-500 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of card (shows kanji) */}
        <div 
          className={`absolute inset-0 bg-white rounded-xl shadow-2xl p-8 flex flex-col justify-center items-center cursor-pointer backface-hidden ${
            isFlipped ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleFlip}
        >
          <div className="text-center">
            {/* Metadata badges */}
            <div className="flex justify-center space-x-2 mb-6">
              {card.isNew && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  ✨ New!
                </span>
              )}
              {card.isDue && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                  ⏰ Review Due!
                </span>
              )}
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                Grade {card.grade}
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                #{card.frequency}
              </span>
            </div>

            {/* Large kanji character */}
            <div className="text-9xl font-bold mb-8 text-gray-800">
              {card.character}
            </div>

            {/* Stroke count */}
            <div className="text-gray-500 text-sm mb-6">
              {card.strokeCount} strokes
            </div>

            {/* Flip instruction */}
            <div className="text-blue-600 hover:text-blue-700 text-lg font-medium">
              🔄 Click to reveal meaning & reading
            </div>
          </div>
        </div>

        {/* Back of card (shows meaning and reading) */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-2xl p-6 flex flex-col justify-between backface-hidden rotate-y-180 ${
            isFlipped ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="text-center flex-1 flex flex-col justify-center">
            {/* Small kanji at top */}
            <div className="text-4xl font-bold mb-3 text-gray-700">
              {card.character}
            </div>

            {/* Meaning */}
            <div className="text-2xl font-semibold text-gray-800 mb-3">
              {card.meaning}
            </div>

            {/* Reading */}
            <div className="text-xl text-gray-600 mb-4 font-medium">
              {card.reading}
            </div>

            {/* Additional info */}
            <div className="text-sm text-gray-500 mb-6">
              {card.strokeCount} strokes • Grade {card.grade} • Frequency #{card.frequency}
            </div>
          </div>

          {/* Bottom section with question and buttons */}
          <div className="text-center">
            {/* How well did you know this? */}
            <div className="text-gray-700 font-medium mb-4">
              How well did you know this kanji?
            </div>

            {/* Answer buttons */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm mx-auto">
              <button
                onClick={() => handleAnswer('bad')}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-semibold transition-colors shadow-md text-sm"
              >
                😵 Bad
                <div className="text-xs opacity-90 mt-1">Didn&apos;t know</div>
              </button>
              <button
                onClick={() => handleAnswer('hard')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg font-semibold transition-colors shadow-md text-sm"
              >
                😅 Hard
                <div className="text-xs opacity-90 mt-1">Struggled</div>
              </button>
              <button
                onClick={() => handleAnswer('good')}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-semibold transition-colors shadow-md text-sm"
              >
                😊 Good
                <div className="text-xs opacity-90 mt-1">Got it right</div>
              </button>
              <button
                onClick={() => handleAnswer('easy')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold transition-colors shadow-md text-sm"
              >
                🎯 Easy
                <div className="text-xs opacity-90 mt-1">Too easy</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card counter */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        Card {cardNumber} of {totalCards}
      </div>
    </div>
  );
};

export default Flashcard;