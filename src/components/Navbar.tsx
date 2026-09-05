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
    { href: '/battle', label: '1v1 Battle', icon: Swords },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
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

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 px-4 py-2.5 flex justify-around items-center">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                isActive ? 'text-fuchsia-400 bg-fuchsia-500/10' : 'text-zinc-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
        {user && (
          <Link
            href="/profile"
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
              pathname === '/profile' ? 'text-fuchsia-400 bg-fuchsia-500/10' : 'text-zinc-400'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
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
