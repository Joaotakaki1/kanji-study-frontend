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
  
  return response.data;
};

export default fetcher;