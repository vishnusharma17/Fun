'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Swords,
  Trophy,
  PlusSquare,
  ShieldAlert,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import UploadModal from './UploadModal';

export default function Navbar() {
  const pathname = usePathname();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const navLinks = [
    { href: '/battle', label: '1v1 Battle', icon: Swords },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/admin', label: 'Admin Metrics', icon: ShieldAlert },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090b]/80 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/battle" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-cyan-400 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
              VIBE<span className="text-fuchsia-500">CLASH</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 p-1.5 rounded-full border border-zinc-800/80">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Button & User Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:from-fuchsia-500 hover:to-cyan-400 transition-all shadow-md shadow-fuchsia-500/20 active:scale-95"
            >
              <PlusSquare className="w-4 h-4" />
              <span>Post Vibe</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#09090b]/90 backdrop-blur-xl border-t border-zinc-800/80 px-4 py-2 flex justify-around items-center">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium ${
                isActive ? 'text-fuchsia-400' : 'text-zinc-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </>
  );
}
