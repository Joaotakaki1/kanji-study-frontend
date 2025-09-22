import React from 'react';

export interface DeckTemplate {
  id: number;
  name: string;
  description: string;
  kanjiCount: number;
  createdAt: string;
}

interface TemplateDeckCardProps {
  template: DeckTemplate;
  onSelect: (templateId: number) => void;
  isLoading?: boolean;
}

const TemplateDeckCard: React.FC<TemplateDeckCardProps> = ({ 
  template, 
  onSelect, 
  isLoading = false 
}) => {
  // Extract JLPT level from template name for display
  const getJLPTLevel = (name: string) => {
    const match = name.match(/JLPT\s+(N[1-5])/i);
    return match ? match[1] : null;
  };

  const jlptLevel = getJLPTLevel(template.name);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-900">{template.name}</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {template.kanjiCount} kanji
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-3 overflow-hidden" style={{ 
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      }}>
        {template.description}
      </p>
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {jlptLevel && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {jlptLevel}
            </span>
          )}
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            JLPT
          </span>
        </div>
        
        <button
          onClick={() => onSelect(template.id)}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Creating...</span>
            </>
          ) : (
            <span>Select</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default TemplateDeckCard;