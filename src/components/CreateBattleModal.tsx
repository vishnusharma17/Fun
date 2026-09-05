'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Swords, Sparkles, X, Plus, Check } from 'lucide-react';

interface PhotoItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  user: {
    name: string;
    username: string;
  };
}

interface CreateBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBattleCreated: () => void;
}

export function CreateBattleModal({ isOpen, onClose, onBattleCreated }: CreateBattleModalProps) {
  const { currentUser } = useAuth();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [selectedA, setSelectedA] = useState<string | null>(null);
  const [selectedB, setSelectedB] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Custom Showdown');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchPhotos();
    }
  }, [isOpen]);

  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/photos');
      if (res.ok) {
        const data = await res.json();
        setPhotos(data);
        if (data.length >= 2) {
          setSelectedA(data[0].id);
          setSelectedB(data[1].id);
        }
      }
    } catch (err) {
      console.error('Failed to load photos:', err);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedA || !selectedB) {
      setError('Please select two looks for comparison.');
      return;
    }

    if (selectedA === selectedB) {
      setError('Please select two different looks to battle against each other.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/battles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || 'Aesthetic Style Battle',
          category,
          photoAId: selectedA,
          photoBId: selectedB,
          creatorId: currentUser?.id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create battle');
      }

      onBattleCreated();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative space-y-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Swords className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">Create Head-to-Head Battle</h2>
              <p className="text-xs text-neutral-400">Match any two aesthetic photos for community voting</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 flex-1 overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Battle Title</label>
            <input
              type="text"
              placeholder="e.g. Minimalist Coat vs Archival Techwear"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Category Badge</label>
            <input
              type="text"
              placeholder="e.g. Mainstage Showdown, Luxury Battle"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-500"
            />
          </div>

          {/* Photo Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Pick Look A */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-amber-400 uppercase font-bold">Select Look A</label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {photos.map((photo) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setSelectedA(photo.id)}
                    className={`w-full flex items-center gap-3 p-2 rounded-xl border text-left transition-all ${
                      selectedA === photo.id
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-800">
                      <Image src={photo.imageUrl} alt={photo.title} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white truncate">{photo.title}</p>
                      <p className="text-[10px] text-neutral-500 font-mono">@{photo.user.username}</p>
                    </div>
                    {selectedA === photo.id && <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Pick Look B */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-amber-400 uppercase font-bold">Select Look B</label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {photos.map((photo) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setSelectedB(photo.id)}
                    className={`w-full flex items-center gap-3 p-2 rounded-xl border text-left transition-all ${
                      selectedB === photo.id
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-800">
                      <Image src={photo.imageUrl} alt={photo.title} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white truncate">{photo.title}</p>
                      <p className="text-[10px] text-neutral-500 font-mono">@{photo.user.username}</p>
                    </div>
                    {selectedB === photo.id && <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white font-medium text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedA || !selectedB}
              className="w-1/2 py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              {isSubmitting ? 'Launching...' : 'Launch Comparison'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
