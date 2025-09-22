import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import TemplateDeckCard, { DeckTemplate } from './TemplateDeckCard';
import apiClient from '../lib/apiClient';
import { cacheKeys, revalidationStrategies } from '../lib/swr-config';

interface TemplateDeckListProps {
  onSuccess: () => void;
  onClose: () => void;
}

interface TemplatesResponse {
  success: boolean;
  message: string;
  templateDecks: DeckTemplate[];
}

const TemplateDeckList: React.FC<TemplateDeckListProps> = ({ onSuccess, onClose }) => {
  const [creatingTemplateId, setCreatingTemplateId] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const { data: templatesResponse, error: fetchError, isLoading } = useSWR<TemplatesResponse>(
    cacheKeys.deckTemplates,
    revalidationStrategies.static
  );

  const templates = templatesResponse?.templateDecks || [];

  const handleSelectTemplate = async (templateId: number) => {
    try {
      setError('');
      setCreatingTemplateId(templateId);
      
      await apiClient.post('/api/v1/decks/from-template', {
        templateId
      });
      
      // Invalidate decks cache to refresh dashboard
      await mutate(cacheKeys.decks);
      
      // Success: close modal and trigger dashboard refresh
      onSuccess();
      onClose();
    } catch (apiError: unknown) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (apiError && typeof apiError === 'object' && 'response' in apiError) {
        const errorResponse = apiError as { response?: { data?: { details?: { code?: string }; message?: string }; status?: number } };
        const errorData = errorResponse.response?.data;
        
        // Handle Prisma constraint errors
        if (errorData?.details?.code === 'P2003') {
          errorMessage = 'Authentication error: Please log out and log back in.';
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        }
        
        console.error('Template deck creation error:', {
          error: apiError,
          response: errorData,
          status: errorResponse.response?.status
        });
      } else {
        console.error('Template deck creation error:', apiError);
      }
      
      setError(errorMessage);
    } finally {
      setCreatingTemplateId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading suggested decks...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="space-y-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Failed to load deck templates. Please try again later.
        </div>
      </div>
    );
  }

  if (!templates.length) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-600">No deck templates available at the moment.</p>
          <p className="text-gray-500 text-sm mt-2">Check back later for new templates!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div className="text-sm text-gray-600 mb-4">
        Choose from {templates.length} pre-made deck{templates.length !== 1 ? 's' : ''} to get started quickly:
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {templates.map((template) => (
          <TemplateDeckCard
            key={template.id}
            template={template}
            onSelect={handleSelectTemplate}
            isLoading={creatingTemplateId === template.id}
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateDeckList;