import React, { useState } from 'react';
import useSWR from 'swr';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import DeckCard, { Deck } from '../components/DeckCard';
import CreateDeckModal from '../components/CreateDeckModal';
import { cacheKeys, revalidationStrategies } from '../lib/swr-config';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { data: decks, error, mutate } = useSWR<Deck[]>(
    cacheKeys.decks,
    revalidationStrategies.moderate
  );

  const isLoading = !decks && !error;

  if (error) {
    return (
      <ProtectedRoute>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error loading decks. Please try again.
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-semibold transition-colors"
          >
            Create Deck
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Loading your decks...</div>
          </div>
        ) : (
          <>
            {decks && decks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {decks.map((deck: Deck) => (
                  <DeckCard key={deck.id} deck={deck} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">No decks yet</div>
                <p className="text-gray-400 mb-6">Create your first deck to start studying kanji!</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-semibold transition-colors"
                >
                  Create Your First Deck
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <CreateDeckModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => mutate()}
      />
    </ProtectedRoute>
  );
};

export default DashboardPage;