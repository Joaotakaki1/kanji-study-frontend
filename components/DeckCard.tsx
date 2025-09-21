import React from 'react';
import Link from 'next/link';

interface Deck {
  id: number;
  title: string;
  kanjiCount: number;
  createdAt: string;
  updatedAt: string;
}

interface DeckCardProps {
  deck: Deck;
}

const DeckCard: React.FC<DeckCardProps> = ({ deck }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{deck.title}</h3>
        <span className="text-sm text-gray-500">
          {deck.kanjiCount} kanji
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Created: {new Date(deck.createdAt).toLocaleDateString()}
        </div>
        <Link 
          href={`/decks/${deck.id}`}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          View Deck
        </Link>
      </div>
    </div>
  );
};

export default DeckCard;
export type { Deck };