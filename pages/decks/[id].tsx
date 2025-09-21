import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import fetcher from '../../lib/fetcher';
import apiClient from '../../lib/apiClient';

interface Kanji {
  id: number;
  character: string;
  meaning: string;
  reading: string;
  strokeCount: number;
  grade: number;
  frequency: number;
  addedAt?: string;
}

interface DeckDetail {
  id: number;
  title: string;
  description?: string;
  kanjiCount: number;
  createdAt: string;
  updatedAt: string;
  kanjis: Kanji[];
}

const DeckDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Kanji[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAllKanjis, setShowAllKanjis] = useState(false);
  const [allKanjis, setAllKanjis] = useState<Kanji[]>([]);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const { data: deck, error, mutate } = useSWR<DeckDetail>(
    id ? `/api/v1/decks/${id}` : null,
    fetcher
  );

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim() && searchQuery.trim().length >= 1) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300); // Reduced delay for more responsive search

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    try {
      setIsSearching(true);
      const response = await apiClient.get(`/api/v1/kanji/search?q=${encodeURIComponent(query)}`);
      
      // Handle different possible response structures
      let results = [];
      if (response.data.kanji) {
        results = response.data.kanji;
      } else if (response.data.kanjis) {
        results = response.data.kanjis;
      } else if (Array.isArray(response.data)) {
        results = response.data;
      } else {
        results = [];
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddKanji = async (kanjiId: number) => {
    try {
      await apiClient.post(`/api/v1/decks/${id}/kanji`, { kanjiId });
      mutate(); // Refresh deck data
      setSearchQuery(''); // Clear search
      setSearchResults([]);
      // Refresh all kanjis list if it's currently showing
      if (showAllKanjis) {
        await handleShowAllKanjis();
      }
    } catch (error: unknown) {
      const apiError = error as { response?: { status?: number } };
      if (apiError.response?.status === 409) {
        setWarningMessage('This kanji is already in the deck!');
        setShowWarningModal(true);
      } else {
        console.error('Failed to add kanji:', error);
        setWarningMessage('Failed to add kanji. Please try again.');
        setShowWarningModal(true);
      }
    }
  };

  const handleRemoveKanji = async (kanjiId: number) => {
    try {
      await apiClient.delete(`/api/v1/decks/${id}/kanji/${kanjiId}`);
      mutate(); // Refresh deck data
    } catch (error) {
      console.error('Failed to remove kanji:', error);
    }
  };

  const handleShowAllKanjis = async () => {
    if (!showAllKanjis) {
      try {
        setIsSearching(true);
        const response = await apiClient.get('/api/v1/kanji');
        setAllKanjis(response.data.kanji || response.data || []);
      } catch (error) {
        console.error('Failed to fetch all kanjis:', error);
        setAllKanjis([]);
      } finally {
        setIsSearching(false);
      }
    }
    setShowAllKanjis(!showAllKanjis);
  };

  if (!id) {
    return (
      <ProtectedRoute>
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error loading deck. Please try again.
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const isLoading = !deck && !error;

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Loading deck...</div>
          </div>
        ) : deck ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-green-600 hover:text-green-700 mb-2"
                >
                  ← Back to Dashboard
                </button>
                <h1 className="text-3xl font-bold">{deck.title}</h1>
                {deck.description && (
                  <p className="text-gray-600 mt-2">{deck.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {deck.kanjis?.length || 0} kanji in this deck
                </p>
              </div>
              
              {/* Start Study Button */}
              {deck.kanjis && deck.kanjis.length > 0 && (
                <div className="flex flex-col items-end space-y-2">
                  <button
                    onClick={() => router.push(`/decks/${deck.id}/study`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg"
                  >
                    🧠 Start Study Session
                  </button>
                  <p className="text-xs text-gray-500">
                    Study {deck.kanjis.length} kanji{deck.kanjis.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>

            {/* Search Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4">Add Kanji</h2>
              <p className="text-sm text-gray-600 mb-3">
                Search for kanji by typing the character, meaning (in English), or reading. For example: try &ldquo;sun&rdquo;, &ldquo;日&rdquo;, or &ldquo;にち&rdquo;
              </p>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for kanji by character, meaning, or reading..."
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="text-gray-400">Searching...</div>
                  </div>
                )}
              </div>

              {searchQuery.trim() && !isSearching && searchResults.length === 0 && (
                <div className="mt-4 p-4 bg-gray-100 rounded text-gray-600 text-center">
                  No kanji found matching &ldquo;{searchQuery}&rdquo;. Try searching by character, meaning, or reading.
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="mt-4 max-h-60 overflow-y-auto">
                  <div className="text-sm text-gray-600 mb-2">
                    Found {searchResults.length} kanji{searchResults.length !== 1 ? 's' : ''}
                  </div>
                  <div className="grid gap-2">
                    {searchResults.map((kanji) => (
                      <div
                        key={kanji.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-bold">{kanji.character}</span>
                          <div>
                            <div className="font-medium">{kanji.meaning}</div>
                            <div className="text-sm text-gray-600">
                              Reading: {kanji.reading} | Strokes: {kanji.strokeCount} | Grade: {kanji.grade}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddKanji(kanji.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                          disabled={deck.kanjis.some((k: Kanji) => k.id === kanji.id)}
                        >
                          {deck.kanjis.some((k: Kanji) => k.id === kanji.id) ? 'Added' : 'Add'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Kanji List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Kanji in this Deck</h2>
              {deck.kanjis && deck.kanjis.length > 0 ? (
                <div className="grid gap-4">
                  {deck.kanjis.map((kanji: Kanji) => (
                    <div
                      key={kanji.id}
                      className="flex justify-between items-center p-4 border rounded hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-3xl font-bold">{kanji.character}</span>
                        <div>
                          <div className="font-medium text-lg">{kanji.meaning}</div>
                          <div className="text-sm text-gray-600">
                            <span className="mr-4">Reading: {kanji.reading}</span>
                            <span className="mr-4">Strokes: {kanji.strokeCount}</span>
                            <span className="mr-4">Grade: {kanji.grade}</span>
                            <span>Freq: #{kanji.frequency}</span>
                          </div>
                          {kanji.addedAt && (
                            <div className="text-xs text-gray-500 mt-1">
                              Added: {new Date(kanji.addedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveKanji(kanji.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No kanji in this deck yet.</p>
                  <p className="text-sm mt-2 mb-4">Use the search above or browse all available kanjis to add to your deck.</p>
                  <button
                    onClick={handleShowAllKanjis}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                    disabled={isSearching}
                  >
                    {isSearching ? 'Loading...' : showAllKanjis ? 'Hide All Kanjis' : 'Show All Available Kanjis'}
                  </button>
                </div>
              )}
            </div>

            {/* All Available Kanjis Section */}
            {showAllKanjis && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">All Available Kanjis</h2>
                {allKanjis.length > 0 ? (
                  <div className="grid gap-4 max-h-96 overflow-y-auto">
                    {allKanjis.map((kanji) => {
                      const isAlreadyInDeck = deck?.kanjis?.some((deckKanji: Kanji) => deckKanji.id === kanji.id);
                      return (
                        <div
                          key={kanji.id}
                          className="flex justify-between items-center p-4 border rounded hover:bg-gray-50"
                        >
                          <div>
                            <span className="text-xl font-semibold mr-3">{kanji.character}</span>
                            <span className="text-gray-700">{kanji.meaning}</span>
                            {kanji.reading && (
                              <span className="text-sm text-gray-500 ml-2">
                                ({kanji.reading})
                              </span>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                              Grade: {kanji.grade} | Strokes: {kanji.strokeCount}
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddKanji(kanji.id)}
                            disabled={isAlreadyInDeck}
                            className={`px-3 py-1 rounded text-sm ${
                              isAlreadyInDeck 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                          >
                            {isAlreadyInDeck ? 'Already Added' : 'Add'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No kanjis available.</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : null}

        {/* Warning Modal */}
        {showWarningModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-red-600">Warning</h2>
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-700 mb-6">{warningMessage}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default DeckDetailPage;