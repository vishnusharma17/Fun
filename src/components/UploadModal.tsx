'use client';

import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon, Tag } from 'lucide-react';
import { createPost } from '@/app/actions/battle';
import { useRouter } from 'next/navigation';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
];

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('Streetwear');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;

    setIsSubmitting(true);
    // Use demo user ID for quick posting
    const res = await createPost({
      imageUrl,
      caption,
      category,
      userId: 'clx01vibe_user_id', // demo fallback or fetched from context
    });

    setIsSubmitting(false);

    if (res.success) {
      setImageUrl('');
      setCaption('');
      onClose();
      router.refresh();
    } else {
      alert('Failed to post vibe. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
        {/* Glow overlay */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-fuchsia-400" />
            <h2 className="text-xl font-extrabold text-white">Upload New Fit / Vibe</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
              Image URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-fuchsia-500 transition"
              />
            </div>
            {/* Quick sample image picker */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-zinc-500">Preset Samples:</span>
              <div className="flex gap-1.5">
                {SAMPLE_IMAGES.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(url)}
                    className="w-6 h-6 rounded-md overflow-hidden border border-zinc-700 hover:border-fuchsia-400 transition"
                  >
                    <img src={url} alt="sample" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
              Caption / Fit Details
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Vintage Leather Oversized Jacket 🏁"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-fuchsia-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
              Aesthetic Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-fuchsia-500 transition appearance-none"
              >
                <option value="Streetwear">Streetwear</option>
                <option value="Cyberpunk">Cyberpunk</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Vintage Y2K">Vintage Y2K</option>
                <option value="High Fashion">High Fashion</option>
              </select>
            </div>
          </div>

          {imageUrl && (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => alert('Invalid image URL')}
              />
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition shadow-lg shadow-fuchsia-500/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Fit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
