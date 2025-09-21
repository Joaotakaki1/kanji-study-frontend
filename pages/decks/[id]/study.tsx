import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import Flashcard from '../../../components/study/Flashcard';
import SessionSummary from '../../../components/study/SessionSummary';
import fetcher from '../../../lib/fetcher';
import apiClient from '../../../lib/apiClient';

interface StudyCard {
  id: number; // Primary field (from your API response)
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

interface StudySession {
  deckId: number;
  deckTitle: string;
  studyCards: StudyCard[];
  totalCards: number;
}

const StudyPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [answeredCards, setAnsweredCards] = useState<{ kanjiId: number; grade: string }[]>([]);

  const { data: session, error, isLoading } = useSWR<StudySession>(
    id ? `/api/v1/decks/${id}/study` : null,
    fetcher
  );

  // Debug session data (keep for potential future debugging)
  console.log('Study session data:', session);
  console.log('Total cards value:', session?.totalCards, 'Type:', typeof session?.totalCards);

  // Ensure we have valid total cards count
  const validTotalCards = session?.totalCards && session.totalCards > 0 ? session.totalCards : (session?.studyCards?.length || 1);

  const handleAnswer = async (grade: 'bad' | 'hard' | 'good' | 'easy') => {
    if (!session || currentIndex >= session.studyCards.length) return;

    const currentCard = session.studyCards[currentIndex];
    
    // Debug logging
    console.log('Current card:', currentCard);
    console.log('ID:', currentCard.id, 'KanjiId:', currentCard.kanjiId);
    
    // Use id as primary field, kanjiId as fallback
    const kanjiId = currentCard.id || currentCard.kanjiId || 0;
    const kanjiIdNumber = typeof kanjiId === 'string' ? parseInt(kanjiId, 10) : kanjiId;
    
    // Validate we have a valid kanjiId
    if (!kanjiIdNumber || kanjiIdNumber === 0) {
      console.error('Invalid kanjiId:', kanjiIdNumber, 'Card:', currentCard);
      return;
    }
    
    console.log('Sending payload:', { kanjiId: kanjiIdNumber, grade });
    
    try {
      const response = await apiClient.post('/api/v1/study/progress', {
        kanjiId: kanjiIdNumber,
        grade: grade
      });
      
      console.log('API response:', response.data);

      // Track answered card
      setAnsweredCards(prev => [...prev, { kanjiId: kanjiIdNumber, grade }]);

      // Move to next card or complete session
      if (currentIndex + 1 >= session.studyCards.length) {
        setSessionComplete(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: unknown } };
        console.error('Error response:', apiError.response?.data);
      }
      // Still advance to next card even if submission fails
      if (currentIndex + 1 >= session.studyCards.length) {
        setSessionComplete(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Loading study session...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !session) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-4">Failed to load study session</div>
            <button
              onClick={() => router.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Go Back
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (sessionComplete) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto py-8">
          <SessionSummary
            deckTitle={session.deckTitle}
            totalCards={validTotalCards}
            answeredCards={answeredCards}
            onBackToDeck={() => router.push(`/decks/${id}`)}
            onStudyAgain={async () => {
              // Reset local state
              setCurrentIndex(0);
              setSessionComplete(false);
              setAnsweredCards([]);
              
              // Revalidate SWR cache to fetch fresh study data
              await mutate(`/api/v1/decks/${id}/study`);
            }}
          />
        </div>
      </ProtectedRoute>
    );
  }

  // Validate session data
  if (!session.studyCards || session.studyCards.length === 0) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-6xl mb-6">📚</div>
            <div className="text-yellow-600 text-lg mb-4">No cards available for study</div>
            <p className="text-gray-600 mb-6">
              All cards in this deck have been studied today!<br/>
              Come back tomorrow for your scheduled reviews.
            </p>
            <button
              onClick={() => router.push(`/decks/${id}`)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              📖 Back to Deck
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Validate current index
  if (currentIndex >= session.studyCards.length) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-4">Invalid card index</div>
            <p className="text-gray-600 mb-6">Something went wrong with the study session.</p>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSessionComplete(false);
                setAnsweredCards([]);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Restart Session
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const currentCard = session.studyCards[currentIndex];
  
  // Extra safety check for currentCard
  if (!currentCard) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-4">Card data missing</div>
            <p className="text-gray-600 mb-6">The current card data is not available.</p>
            <button
              onClick={() => router.push(`/decks/${id}`)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Back to Deck
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const progress = ((currentIndex + 1) / validTotalCards) * 100;

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <button
              onClick={() => router.push(`/decks/${id}`)}
              className="text-green-600 hover:text-green-700 mb-2"
            >
              ← Back to Deck
            </button>
            <h1 className="text-2xl font-bold">Studying: {session.deckTitle}</h1>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Card {currentIndex + 1} of {validTotalCards}
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Flashcard Component */}
        <div className="flex justify-center flashcard-container">
          <Flashcard
            card={currentCard}
            onAnswer={handleAnswer}
            cardNumber={currentIndex + 1}
            totalCards={session.totalCards}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StudyPage;