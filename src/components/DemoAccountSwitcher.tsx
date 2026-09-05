'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Users, Check, Plus, UserCircle, Sparkles } from 'lucide-react';
import Image from 'next/image';

export function DemoAccountSwitcher() {
  const { currentUser, users, switchUser, refreshUsers } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for creating a new profile
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [styleTags, setStyleTags] = useState('Minimalist, Streetwear');
  const [avatar, setAvatar] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          name,
          email,
          bio,
          styleTags,
          avatar: avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create user');
      }

      const newUser = await res.json();
      await refreshUsers();
      switchUser(newUser.id);
      setIsModalOpen(false);
      // Reset form
      setUsername('');
      setName('');
      setEmail('');
      setBio('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Account Switcher Bar Header Component */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all text-xs font-medium text-neutral-300 hover:text-white"
        >
          {currentUser ? (
            <>
              <div className="relative w-5 h-5 rounded-full overflow-hidden border border-neutral-700">
                <Image src={currentUser.avatar} alt={currentUser.name} fill className="object-cover" />
              </div>
              <span className="max-w-[100px] truncate">{currentUser.name}</span>
            </>
          ) : (
            <>
              <UserCircle className="w-4 h-4 text-neutral-400" />
              <span>Select Persona</span>
            </>
          )}
          <Users className="w-3.5 h-3.5 ml-1 text-neutral-500" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-xl bg-neutral-950 border border-neutral-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-neutral-900 mb-1">
              <div className="text-[10px] uppercase tracking-wider font-mono text-neutral-500 font-semibold">
                Active Switcher
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">Switch active user for testing voting & interactions</p>
            </div>

            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              {users.map((user) => {
                const isSelected = currentUser?.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchUser(user.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                      isSelected
                        ? 'bg-neutral-800/80 text-white font-medium'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-7 h-7 rounded-full overflow-hidden border border-neutral-700 flex-shrink-0">
                        <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                      </div>
                      <div className="truncate">
                        <div className="truncate font-medium leading-tight">{user.name}</div>
                        <div className="text-[10px] text-neutral-500 font-mono truncate">@{user.username}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-neutral-900 mt-2 pt-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors border border-amber-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                Create New Persona
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal to register new account */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs tracking-wider">
                <Sparkles className="w-4 h-4" />
                CREATE PROFILE
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-500 hover:text-white text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-white mb-1">Join the Arena</h3>
            <p className="text-xs text-neutral-400 mb-6">
              Create your aesthetic profile space to share fits & participate in battles.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. maya_style"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="maya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Bio / Philosophy</label>
                <textarea
                  rows={2}
                  placeholder="Architectural tailoring & monochrome aesthetics..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Style Aesthetics (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Streetwear, Minimalist, High Fashion"
                  value={styleTags}
                  onChange={(e) => setStyleTags(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Avatar Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
