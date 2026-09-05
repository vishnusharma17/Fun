import React from 'react';
import { getAdminStats } from '@/app/actions/admin';
import { Eye, Users, Image as ImageIcon, Swords, Clock, ShieldAlert } from 'lucide-react';

export const revalidate = 0; // Always fetch fresh metrics

export default async function AdminPage() {
  const stats = await getAdminStats();

  const statCards = [
    {
      title: 'Total Site Visits',
      value: stats.totalVisits.toLocaleString(),
      icon: Eye,
      gradient: 'from-cyan-500/20 to-blue-500/10',
      borderColor: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
    },
    {
      title: 'Registered Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      gradient: 'from-fuchsia-500/20 to-purple-500/10',
      borderColor: 'border-fuchsia-500/30',
      iconColor: 'text-fuchsia-400',
    },
    {
      title: 'Uploaded Images',
      value: stats.totalPosts.toLocaleString(),
      icon: ImageIcon,
      gradient: 'from-violet-500/20 to-indigo-500/10',
      borderColor: 'border-violet-500/30',
      iconColor: 'text-violet-400',
    },
    {
      title: 'Battles Fought',
      value: stats.totalVotes.toLocaleString(),
      icon: Swords,
      gradient: 'from-amber-500/20 to-orange-500/10',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>ADMIN METRICS CONTROL</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            System Analytics & Log Counter
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time telemetry and page visit traffic tracking for VibeClash.
          </p>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl p-5 border bg-gradient-to-br ${card.gradient} ${card.borderColor} bg-zinc-900/60 shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl bg-black/40 ${card.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-white mt-4 tracking-tight">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Page Visit Log Table */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-fuchsia-400" />
            <h2 className="text-base font-extrabold text-white">
              Recent Page Visit Log
            </h2>
          </div>
          <span className="text-xs font-semibold text-zinc-500">
            Last {stats.recentVisits.length} visits
          </span>
        </div>

        {stats.recentVisits.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            No site visits logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950/80 text-[11px] uppercase tracking-wider text-zinc-400 font-bold border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-3.5">Visit ID</th>
                  <th className="px-6 py-3.5">IP Address</th>
                  <th className="px-6 py-3.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {stats.recentVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-zinc-800/30 transition">
                    <td className="px-6 py-4 font-mono text-xs text-fuchsia-400">
                      {visit.id}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-300">
                      {visit.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-400">
                      {new Date(visit.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
