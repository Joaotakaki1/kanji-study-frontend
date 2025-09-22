import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { mutate } from 'swr';
import apiClient from '../lib/apiClient';
import TemplateDeckList from './TemplateDeckList';
import { cacheKeys } from '../lib/swr-config';

const CreateDeckSchema = z.object({
  title: z.string().min(1, 'Deck title is required').max(100, 'Deck title must be less than 100 characters'),
  description: z.string().optional(),
});

type CreateDeckFormInputs = z.infer<typeof CreateDeckSchema>;

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateDeckModal: React.FC<CreateDeckModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [submitError, setSubmitError] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [view, setView] = useState<'custom' | 'template'>('template'); // Default to template view

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10); // Small delay for CSS transition
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300); // Match transition duration
    }
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateDeckFormInputs>({
    resolver: zodResolver(CreateDeckSchema),
  });

  const onSubmit = async (data: CreateDeckFormInputs) => {
    try {
      setSubmitError('');
      await apiClient.post('/api/v1/decks', data);
      
      // Invalidate decks cache to refresh dashboard
      await mutate(cacheKeys.decks);
      
      reset();
      onSuccess();
      onClose();
    } catch {
      setSubmitError('Failed to create deck. Please try again.');
    }
  };

  const handleClose = () => {
    reset();
    setSubmitError('');
    setView('template'); // Reset to template view
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-lg p-6 w-full max-w-2xl mx-4 transform transition-all duration-300 ${
          isAnimating ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Create New Deck</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setView('template')}
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              view === 'template'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Use a Template
          </button>
          <button
            onClick={() => setView('custom')}
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              view === 'custom'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Create Custom
          </button>
        </div>

        {/* Conditional Content */}
        {view === 'template' ? (
          <TemplateDeckList onSuccess={onSuccess} onClose={handleClose} />
        ) : (
          <>
            {submitError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Deck Title</label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isSubmitting}
                  placeholder="Enter deck title..."
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block mb-1 font-medium">Description (Optional)</label>
                <textarea
                  {...register('description')}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isSubmitting}
                  placeholder="Enter deck description..."
                  rows={3}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Deck'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateDeckModal;