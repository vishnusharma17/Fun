'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Swords,
  Trophy,
  PlusSquare,
  ShieldAlert,
  Sparkles,
  User,
  LogIn,
  LogOut,
} from 'lucide-react';
import UploadModal from './UploadModal';
import AuthModal from './AuthModal';
import { UserSession } from '@/app/actions/auth';

export default function Navbar() {
  const pathname = usePathname();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('vibeclash_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
  }, []);

  const handleLoginSuccess = (sessionUser: UserSession) => {
    setUser(sessionUser);
    localStorage.setItem('vibeclash_user', JSON.stringify(sessionUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('vibeclash_user');
  };

  const navLinks = [
    { href: '/battle', label: 'home', icon: Swords },
    { href: '/leaderboard', label: 'leaderboard', icon: Trophy },
  ];

  if (user?.role === 'ADMIN') {
    navLinks.push({ href: '/admin', label: 'Admin Metrics', icon: ShieldAlert });
  }

  return (
    <>
      <header className="sticky top-0 z-50 glass-panel border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/battle" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-cyan-400 group-hover:scale-105 transition-transform duration-300 neon-glow-fuchsia">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-fuchsia-200">
              VIBE<span className="text-fuchsia-500 font-black">CLASH</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-zinc-950/80 p-1.5 rounded-full border border-white/10 shadow-inner">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white shadow-lg neon-glow-fuchsia'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons & Profile Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-fuchsia-600 via-pink-500 to-cyan-500 hover:brightness-110 transition-all shadow-lg neon-glow-violet active:scale-95"
            >
              <PlusSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Post Vibe</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-bold text-white hover:border-fuchsia-500 transition"
                >
                  <User className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>@{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-full text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-bold text-zinc-300 hover:text-white transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Wireframe Bottom Navigation Bar (+ and Account icon) */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-zinc-950/90 border border-white/20 rounded-full px-6 py-2 shadow-2xl flex items-center justify-between backdrop-blur-lg">
        {/* Nav links (home, leaderboard) */}
        <div className="flex items-center gap-4 font-mono text-sm font-bold text-zinc-300">
          <Link
            href="/battle"
            className={`hover:text-white transition ${
              pathname === '/battle' ? 'text-fuchsia-400 font-extrabold' : ''
            }`}
          >
            home
          </Link>
          <Link
            href="/leaderboard"
            className={`hover:text-white transition ${
              pathname === '/leaderboard' ? 'text-fuchsia-400 font-extrabold' : ''
            }`}
          >
            leaderboard
          </Link>
        </div>

        {/* Center Upload (+) Button */}
        <button
          onClick={() => setIsUploadOpen(true)}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black text-xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition"
          title="Upload Image"
        >
          +
        </button>

        {/* Right Account / Login Icon */}
        {user ? (
          <Link
            href="/profile"
            className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-mono font-black text-sm hover:border-fuchsia-500 transition"
            title={user.username || 'Profile'}
          >
            {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
          </Link>
        ) : (
          <button
            onClick={() => setIsAuthOpen(true)}
            className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-mono font-black text-sm hover:border-fuchsia-500 transition"
            title="Login"
          >
            A
          </button>
        )}
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        userId={user?.id}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
