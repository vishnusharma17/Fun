import React from 'react';
import { getAdminStats } from '@/app/actions/admin';
import { Eye, Users, Image as ImageIcon, Swords, Clock, ShieldAlert } from 'lucide-react';

export const revalidate = 0; // Always fetch fresh telemetry

export default async function AdminPage() {
  const stats = await getAdminStats();

  const statCards = [
    {
      title: 'Total Site Visits',
      value: stats.totalVisits.toLocaleString(),
      icon: Eye,
      gradient: 'from-cyan-500/20 via-cyan-500/10 to-transparent',
      borderColor: 'border-cyan-500/40',
      iconColor: 'text-cyan-400',
    },
    {
      title: 'Registered Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      gradient: 'from-fuchsia-500/20 via-fuchsia-500/10 to-transparent',
      borderColor: 'border-fuchsia-500/40',
      iconColor: 'text-fuchsia-400',
    },
    {
      title: 'Uploaded Images',
      value: stats.totalPosts.toLocaleString(),
      icon: ImageIcon,
      gradient: 'from-violet-500/20 via-violet-500/10 to-transparent',
      borderColor: 'border-violet-500/40',
      iconColor: 'text-violet-400',
    },
    {
      title: 'Battles Fought',
      value: stats.totalVotes.toLocaleString(),
      icon: Swords,
      gradient: 'from-amber-500/20 via-amber-500/10 to-transparent',
      borderColor: 'border-amber-500/40',
      iconColor: 'text-amber-400',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="pb-6 border-b border-white/10 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-wider mb-3">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>ADMIN METRICS CONTROL</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          System Telemetry & Visit Log
        </h1>
        <p className="text-sm text-zinc-400 mt-2 font-medium">
          Real-time metrics, voter engagement stats, and server page access counters.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-3xl p-6 border bg-gradient-to-br ${card.gradient} ${card.borderColor} glass-panel shadow-2xl transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-300">
                  {card.title}
                </span>
                <div className={`p-3 rounded-2xl bg-black/50 ${card.iconColor} border border-white/10 shadow-inner`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-4xl font-black text-white mt-5 tracking-tight">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Visits Table */}
      <div className="glass-panel border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-fuchsia-400" />
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              Recent Page Visit Log
            </h2>
          </div>
          <span className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Last {stats.recentVisits.length} Visits
          </span>
        </div>

        {stats.recentVisits.length === 0 ? (
          <div className="p-10 text-center text-zinc-400 text-sm font-medium">
            No site visits logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-black/60 text-[11px] uppercase tracking-widest text-zinc-400 font-black border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Visit ID</th>
                  <th className="px-6 py-4">IP Address</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {stats.recentVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-fuchsia-400">
                      {visit.id}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-200">
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
