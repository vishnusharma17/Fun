'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UploadCloud, Sparkles, ArrowLeft, Tag, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const AESTHETIC_CATEGORIES = [
  'Minimalist',
  'Streetwear',
  'High Fashion',
  'Formal',
  'Vintage',
  'Y2K',
  'Techwear',
  'Avant-Garde',
];

const PRESET_IMAGE_TEMPLATES = [
  {
    label: 'Minimalist Coat Look',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Tailored Blazer Look',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Streetwear Layered Look',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Classic Trench Look',
    url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80',
  },
];

export function UploadPhotoView() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState(AESTHETIC_CATEGORIES[0]);
  const [outfitTags, setOutfitTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please select or create an account persona before uploading.');
      return;
    }

    if (!imageUrl) {
      setError('Please provide a valid image URL or pick a preset template.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          category,
          outfitTags,
          userId: currentUser.id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to upload photo');
      }

      // Redirect to user's profile
      router.push(`/u/${currentUser.username}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO ARENA
        </Link>
      </div>

      <div className="p-8 rounded-3xl bg-neutral-950 border border-neutral-800/80 shadow-2xl space-y-6">
        <div className="border-b border-neutral-800 pb-6">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            SHOWCASE FIT
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Upload Style Photo</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Publish high-resolution fit pics to participate in public head-to-head comparisons.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
              Look Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Asymmetric Wool Coat & Leather Boots"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neutral-500"
            />
          </div>

          {/* Aesthetic Category */}
          <div>
            <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
              Aesthetic Category *
            </label>
            <div className="flex flex-wrap gap-2">
              {AESTHETIC_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                    category === cat
                      ? 'bg-white text-black font-bold shadow-lg'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Outfit Brand & Garment Tags */}
          <div>
            <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-neutral-500" /> Outfit Tags / Brands
            </label>
            <input
              type="text"
              placeholder="e.g. Jil Sander Coat, Bottega Veneta Boots, Studio Nicholson Trousers"
              value={outfitTags}
              onChange={(e) => setOutfitTags(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neutral-500"
            />
          </div>

          {/* Image URL & Preset Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-neutral-500" /> High Quality Image URL *
            </label>

            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neutral-500"
            />

            <div className="space-y-2">
              <span className="text-[11px] font-mono text-neutral-500">Or pick a sample aesthetic preset:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_IMAGE_TEMPLATES.map((tmpl) => (
                  <button
                    type="button"
                    key={tmpl.label}
                    onClick={() => setImageUrl(tmpl.url)}
                    className="relative aspect-square rounded-xl overflow-hidden border border-neutral-800 hover:border-amber-400 group transition-all"
                  >
                    <Image src={tmpl.url} alt={tmpl.label} fill className="object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[10px] font-mono text-neutral-200 leading-tight truncate">
                        {tmpl.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Image Preview */}
          {imageUrl && (
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-neutral-500">Preview:</span>
              <div className="relative aspect-[3/4] max-w-xs mx-auto rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900">
                <Image src={imageUrl} alt="Look Preview" fill className="object-cover" />
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
              Fit Notes & Details
            </label>
            <textarea
              rows={3}
              placeholder="Describe the silhouette, materials, drape, or styling choices..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neutral-500"
            />
          </div>

          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-sm tracking-wide transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              {isSubmitting ? 'Publishing Fit...' : 'Publish to Arena'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
