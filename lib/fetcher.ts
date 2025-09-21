import apiClient from '../lib/apiClient';

export const fetcher = async (url: string) => {
  const response = await apiClient.get(url);
  
  // Handle specific API response structures
  if (url === '/api/v1/decks' && response.data.decks) {
    return response.data.decks;
  }
  
  // Handle individual deck responses
  if (url.startsWith('/api/v1/decks/') && url.endsWith('/study') && response.data.session) {
    return response.data.session;
  }
  
  // Handle individual deck responses
  if (url.startsWith('/api/v1/decks/') && response.data.deck) {
    return response.data.deck;
  }

  // Handle kanji search responses
  if (url.includes('/api/v1/kanji/search')) {
    // Handle different possible response structures
    if (response.data.kanji) {
      return response.data.kanji;
    } else if (response.data.kanjis) {
      return response.data.kanjis;
    } else if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return [];
    }
  }

  // Handle all kanji responses
  if (url === '/api/v1/kanji') {
    return response.data.kanji || response.data || [];
  }
  
  return response.data;
};

export default fetcher;