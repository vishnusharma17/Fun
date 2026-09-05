'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Swords,
  Heart,
  MessageSquare,
  Share2,
  CheckCircle2,
  Sparkles,
  Tag,
  ChevronRight,
  Send,
  X,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PhotoData {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  outfitTags?: string;
  user: {
    id: string;
    username: string;
    name: string;
    avatar: string;
  };
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface BattleData {
  id: string;
  title?: string;
  category?: string;
  photoA: PhotoData;
  photoB: PhotoData;
  creator?: {
    id: string;
    username: string;
    name: string;
  };
  votes: Array<{
    id: string;
    userId: string;
    selectedPhotoId: string;
  }>;
  _count?: {
    likes: number;
    comments: number;
  };
}

interface HeadToHeadBattleProps {
  battle: BattleData;
  onVoteSuccess?: () => void;
}

export function HeadToHeadBattleCard({ battle, onVoteSuccess }: HeadToHeadBattleProps) {
  const { currentUser } = useAuth();

  // Local voting state
  const [votesList, setVotesList] = useState(battle.votes);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);

  // Social states
  const [likesCount, setLikesCount] = useState(battle._count?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  // Comment Modal state
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  // Share Modal state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Calculate vote totals and percentages
  const userVote = currentUser ? votesList.find((v) => v.userId === currentUser.id) : null;
  const hasVoted = Boolean(userVote);

  const totalVotes = votesList.length;
  const votesForA = votesList.filter((v) => v.selectedPhotoId === battle.photoA.id).length;
  const votesForB = votesList.filter((v) => v.selectedPhotoId === battle.photoB.id).length;

  const percentA = totalVotes > 0 ? Math.round((votesForA / totalVotes) * 100) : 50;
  const percentB = totalVotes > 0 ? 100 - percentA : 50;

  const handleVote = async (selectedPhotoId: string) => {
    if (!currentUser) {
      alert('Please select or create an account persona using the switcher in the header to vote.');
      return;
    }

    setIsSubmittingVote(true);

    try {
      const res = await fetch('/api/battles/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          battleId: battle.id,
          selectedPhotoId,
          userId: currentUser.id,
        }),
      });

      if (res.ok) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });

        // Optimistically update votes list
        setVotesList((prev) => {
          const filtered = prev.filter((v) => v.userId !== currentUser.id);
          return [...filtered, { id: Date.now().toString(), userId: currentUser.id, selectedPhotoId }];
        });

        if (onVoteSuccess) onVoteSuccess();
      }
    } catch (err) {
      console.error('Failed to submit vote:', err);
    } finally {
      setIsSubmittingVote(false);
    }
  };

  const handleToggleLike = async () => {
    if (!currentUser) {
      alert('Please select an account persona to like.');
      return;
    }

    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : prev - 1));

    try {
      await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          battleId: battle.id,
        }),
      });
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const res = await fetch(`/api/comments?battleId=${battle.id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleOpenComments = () => {
    setIsCommentOpen(true);
    fetchComments();
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          userId: currentUser.id,
          battleId: battle.id,
        }),
      });

      if (res.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/?battle=${battle.id}` : '';

  const handleCopyShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-3xl bg-neutral-950 border border-neutral-800/80 shadow-2xl overflow-hidden space-y-0">
      {/* Header Banner */}
      <div className="px-6 py-4 bg-neutral-900/60 border-b border-neutral-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Swords className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">{battle.title || 'Head-to-Head Battle'}</h3>
            <span className="text-[10px] font-mono uppercase text-neutral-400">
              {battle.category || 'Comparison Arena'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
          <span>{totalVotes} total votes</span>
        </div>
      </div>

      {/* Side-by-Side Visual Voting Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 relative gap-0 bg-neutral-900">
        {/* VS Badge Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-black border-2 border-neutral-700 shadow-2xl text-amber-400 font-extrabold text-xs font-mono tracking-wider">
          VS
        </div>

        {/* --- OPTION A --- */}
        <div className="relative group border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col justify-between overflow-hidden">
          {/* Image */}
          <div className="relative aspect-[3/4] w-full bg-neutral-950 overflow-hidden">
            <Image
              src={battle.photoA.imageUrl}
              alt={battle.photoA.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* User tag */}
            <Link
              href={`/u/${battle.photoA.user.username}`}
              className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all text-xs text-white"
            >
              <div className="relative w-5 h-5 rounded-full overflow-hidden">
                <Image src={battle.photoA.user.avatar} alt={battle.photoA.user.name} fill className="object-cover" />
              </div>
              <span className="font-medium">@{battle.photoA.user.username}</span>
            </Link>

            {/* Category tag */}
            <span className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-neutral-900/80 backdrop-blur-md text-[10px] font-mono text-neutral-300 border border-white/10">
              {battle.photoA.category}
            </span>

            {/* Look Details overlay at bottom */}
            <div className="absolute bottom-4 left-4 right-4 z-10 space-y-2">
              <h4 className="text-lg font-bold text-white leading-tight drop-shadow-md">{battle.photoA.title}</h4>
              {battle.photoA.outfitTags && (
                <p className="text-xs text-neutral-300 flex items-center gap-1 font-mono truncate">
                  <Tag className="w-3 h-3 text-neutral-400" /> {battle.photoA.outfitTags}
                </p>
              )}
            </div>
          </div>

          {/* Voting Action / Percentage Progress Bar A */}
          <div className="p-4 bg-neutral-950 border-t border-neutral-800/60 space-y-3">
            {hasVoted && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={userVote?.selectedPhotoId === battle.photoA.id ? 'text-amber-400 font-bold flex items-center gap-1' : 'text-neutral-400'}>
                    {userVote?.selectedPhotoId === battle.photoA.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {percentA}% Votes ({votesForA})
                  </span>
                </div>
                <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-800">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentA}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => handleVote(battle.photoA.id)}
              disabled={isSubmittingVote}
              className={`w-full py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                userVote?.selectedPhotoId === battle.photoA.id
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {userVote?.selectedPhotoId === battle.photoA.id ? 'Voted Look A' : 'Vote Look A'}
            </button>
          </div>
        </div>

        {/* --- OPTION B --- */}
        <div className="relative group flex flex-col justify-between overflow-hidden">
          {/* Image */}
          <div className="relative aspect-[3/4] w-full bg-neutral-950 overflow-hidden">
            <Image
              src={battle.photoB.imageUrl}
              alt={battle.photoB.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* User tag */}
            <Link
              href={`/u/${battle.photoB.user.username}`}
              className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all text-xs text-white"
            >
              <div className="relative w-5 h-5 rounded-full overflow-hidden">
                <Image src={battle.photoB.user.avatar} alt={battle.photoB.user.name} fill className="object-cover" />
              </div>
              <span className="font-medium">@{battle.photoB.user.username}</span>
            </Link>

            {/* Category tag */}
            <span className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-neutral-900/80 backdrop-blur-md text-[10px] font-mono text-neutral-300 border border-white/10">
              {battle.photoB.category}
            </span>

            {/* Look Details overlay at bottom */}
            <div className="absolute bottom-4 left-4 right-4 z-10 space-y-2">
              <h4 className="text-lg font-bold text-white leading-tight drop-shadow-md">{battle.photoB.title}</h4>
              {battle.photoB.outfitTags && (
                <p className="text-xs text-neutral-300 flex items-center gap-1 font-mono truncate">
                  <Tag className="w-3 h-3 text-neutral-400" /> {battle.photoB.outfitTags}
                </p>
              )}
            </div>
          </div>

          {/* Voting Action / Percentage Progress Bar B */}
          <div className="p-4 bg-neutral-950 border-t border-neutral-800/60 space-y-3">
            {hasVoted && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={userVote?.selectedPhotoId === battle.photoB.id ? 'text-amber-400 font-bold flex items-center gap-1' : 'text-neutral-400'}>
                    {userVote?.selectedPhotoId === battle.photoB.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {percentB}% Votes ({votesForB})
                  </span>
                </div>
                <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-800">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentB}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => handleVote(battle.photoB.id)}
              disabled={isSubmittingVote}
              className={`w-full py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                userVote?.selectedPhotoId === battle.photoB.id
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {userVote?.selectedPhotoId === battle.photoB.id ? 'Voted Look B' : 'Vote Look B'}
            </button>
          </div>
        </div>
      </div>

      {/* Card Footer Social Actions (Like, Comment, Share) */}
      <div className="px-6 py-3 bg-neutral-950 border-t border-neutral-800/80 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${
              isLiked ? 'text-rose-400 font-bold' : 'text-neutral-400 hover:text-rose-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-400' : ''}`} />
            <span>{likesCount} Likes</span>
          </button>

          <button
            onClick={handleOpenComments}
            className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Comments</span>
          </button>
        </div>

        <button
          onClick={() => setIsShareOpen(true)}
          className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* --- COMMENTS MODAL --- */}
      {isCommentOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                Battle Discussion
              </h3>
              <button
                onClick={() => setIsCommentOpen(false)}
                className="text-neutral-400 hover:text-white text-xl leading-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
              {isLoadingComments ? (
                <div className="text-center py-8 text-neutral-500 text-xs font-mono">Loading feedback...</div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-xs font-mono">
                  No comments yet. Start the style debate!
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative w-5 h-5 rounded-full overflow-hidden border border-neutral-700">
                          <Image src={comment.user.avatar} alt={comment.user.name} fill className="object-cover" />
                        </div>
                        <span className="text-xs font-semibold text-white">@{comment.user.username}</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 pl-7 leading-relaxed">{comment.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2 border-t border-neutral-800 pt-3">
              <input
                type="text"
                placeholder={currentUser ? 'Write your style verdict...' : 'Select a persona above to comment'}
                disabled={!currentUser}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!currentUser || !newComment.trim()}
                className="px-4 py-2.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- SHARE MODAL --- */}
      {isShareOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-400" />
                Share Matchup
              </h3>
              <button onClick={() => setIsShareOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              Invite friends to vote on this head-to-head comparison battle:
            </p>

            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl p-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-xs text-neutral-300 px-2 outline-none font-mono truncate"
              />
              <button
                onClick={handleCopyShare}
                className="px-3 py-1.5 bg-white text-black font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-1.5 flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
