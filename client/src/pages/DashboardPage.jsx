import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { dashboardService } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const ratingRows = [
  { key: 'food', label: 'Food', color: '#facc15' },
  { key: 'venueAmbience', label: 'Venue & ambience', color: '#38bdf8' },
  { key: 'photography', label: 'Photography', color: '#fb7185' },
  { key: 'musicEntertainment', label: 'Music & entertainment', color: '#4ade80' },
];

const formatDate = (value) => new Date(value).toLocaleString(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const RatingStars = ({ value }) => (
  <span className="whitespace-nowrap text-amber-300" aria-label={`${value} out of 5 stars`}>
    {'★'.repeat(value)}<span className="text-white/20">{'★'.repeat(5 - value)}</span>
  </span>
);

export const DashboardPage = () => {
  const { currentTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [tokenInput, setTokenInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadDashboard = async (token) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await dashboardService.getData(token);
      setDashboard(data);
      setAccessToken(token);
    } catch (error) {
      setDashboard(null);
      setAccessToken('');
      setErrorMessage(error.message || 'Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = (event) => {
    event.preventDefault();
    const token = tokenInput.trim();
    if (token) loadDashboard(token);
  };

  const handleSignOut = () => {
    setAccessToken('');
    setTokenInput('');
    setDashboard(null);
    setErrorMessage('');
  };

  if (!dashboard) {
    return (
      <main className="min-h-[calc(100vh-5rem)] px-4 pb-14 pt-10 sm:px-6 sm:pt-16">
        <motion.section
          className="glass-surface mx-auto max-w-md rounded-2xl p-6 sm:p-8"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.15 : 0.4 }}
        >
          <p className="eyebrow mb-3">Private access</p>
          <h1 className="font-serif text-3xl font-semibold" style={{ color: currentTheme.accentColor }}>
            Wedding dashboard
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/65">
            Enter the dashboard token configured for the server to view RSVP and guest feedback records.
          </p>
          <form onSubmit={handleUnlock} className="mt-6">
            <label htmlFor="dashboard-token" className="block text-sm font-medium text-white">
              Dashboard token
            </label>
            <input
              id="dashboard-token"
              type="password"
              autoComplete="current-password"
              value={tokenInput}
              onChange={(event) => setTokenInput(event.target.value)}
              className="mt-2 min-h-12 w-full rounded-lg border border-sky-200/20 bg-slate-950/60 px-4 text-white placeholder:text-white/35 focus:border-sky-300/70 focus:outline-none"
              placeholder="Enter access token"
              required
            />
            {errorMessage && <p className="mt-3 text-sm text-rose-200" role="alert">{errorMessage}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-5 min-h-12 w-full rounded-lg px-5 font-semibold text-slate-950 disabled:opacity-60"
              style={{ backgroundColor: currentTheme.accentColor }}
            >
              {loading ? 'Checking access...' : 'Open dashboard'}
            </button>
          </form>
        </motion.section>
      </main>
    );
  }

  const { summary, rsvps, feedback } = dashboard;
  const statCards = [
    { label: 'Total RSVPs', value: summary.totalRSVPs, detail: `${summary.attending} attending`, accent: '#38bdf8' },
    { label: 'Attending', value: summary.attending, detail: 'Confirmed yes', accent: '#4ade80' },
    { label: 'Unable to attend', value: summary.notAttending, detail: 'Confirmed no', accent: '#fb7185' },
    { label: 'Feedback entries', value: summary.totalFeedback, detail: 'Guest responses', accent: '#facc15' },
  ];

  return (
    <main className="min-h-[calc(100vh-5rem)] px-4 pb-14 pt-8 sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-3">Sajini &amp; Subin</p>
            <h1 className="font-serif text-4xl font-semibold sm:text-5xl" style={{ color: currentTheme.accentColor }}>
              Wedding dashboard
            </h1>
            <p className="mt-2 text-sm text-white/60">RSVPs and guest feedback</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => loadDashboard(accessToken)}
              disabled={loading}
              className="min-h-11 rounded-lg border border-sky-200/20 px-4 text-sm font-medium text-white hover:bg-white/5 disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="min-h-11 rounded-lg border border-white/10 px-4 text-sm font-medium text-white/70 hover:bg-white/5"
            >
              Lock dashboard
            </button>
          </div>
        </header>

        {errorMessage && <p className="mb-6 rounded-lg border border-rose-300/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100" role="alert">{errorMessage}</p>}

        <section aria-label="RSVP summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((card, index) => (
            <motion.article
              key={card.label}
              className="glass-surface min-w-0 rounded-xl p-4 sm:p-5"
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.12 : 0.3, delay: prefersReducedMotion ? 0 : index * 0.04 }}
            >
              <p className="truncate text-xs font-medium text-white/55 sm:text-sm">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums" style={{ color: card.accent }}>{card.value}</p>
              <p className="mt-1 text-xs text-white/45">{card.detail}</p>
            </motion.article>
          ))}
        </section>

        <section className="mt-10" aria-labelledby="ratings-title">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Guest feedback</p>
              <h2 id="ratings-title" className="font-serif text-2xl font-semibold text-white">Rating averages</h2>
            </div>
            <p className="text-xs text-white/50">Out of 5 · {summary.totalFeedback} responses</p>
          </div>
          <div className="grid gap-x-8 divide-y divide-white/10 border-y border-white/10 lg:grid-cols-2 lg:divide-y-0">
            {ratingRows.map((row) => {
              const value = summary.ratings[row.key];
              return (
                <div key={row.key} className="flex items-center gap-4 border-b border-white/10 py-4 last:border-b-0 lg:even:border-b-0">
                  <span className="w-40 shrink-0 text-sm text-white/75">{row.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: row.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(value / 5) * 100}%` }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <span className="w-10 text-right text-sm font-semibold tabular-nums text-white">{value.toFixed(1)}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="rsvps-title">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Guest list</p>
              <h2 id="rsvps-title" className="font-serif text-2xl font-semibold text-white">All RSVPs</h2>
            </div>
            <span className="text-xs text-white/50">{rsvps.length} records</span>
          </div>
          <div className="overflow-x-auto border-y border-white/10">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase text-white/45">
                <tr>
                  <th className="py-3 pr-4 font-medium">Guest</th>
                  <th className="py-3 pr-4 font-medium">Email</th>
                  <th className="py-3 pr-4 font-medium">Phone</th>
                  <th className="py-3 pr-4 font-medium">Attendance</th>
                  <th className="py-3 font-medium">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="text-white/80">
                    <td className="py-3 pr-4 font-medium text-white">{rsvp.name}</td>
                    <td className="py-3 pr-4">{rsvp.email}</td>
                    <td className="py-3 pr-4">{rsvp.phone || '—'}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${rsvp.attendance ? 'bg-emerald-300/10 text-emerald-200' : 'bg-rose-300/10 text-rose-200'}`}>
                        {rsvp.attendance ? 'Attending' : 'Not attending'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-3 text-xs text-white/50">{formatDate(rsvp.createdAt)}</td>
                  </tr>
                ))}
                {!rsvps.length && <tr><td colSpan="5" className="py-8 text-center text-white/45">No RSVPs yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="feedback-title">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Guest notes</p>
              <h2 id="feedback-title" className="font-serif text-2xl font-semibold text-white">All feedback</h2>
            </div>
            <span className="text-xs text-white/50">{feedback.length} records</span>
          </div>
          <div className="overflow-x-auto border-y border-white/10">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="text-xs uppercase text-white/45">
                <tr>
                  <th className="py-3 pr-4 font-medium">Received</th>
                  <th className="py-3 pr-4 font-medium">Food</th>
                  <th className="py-3 pr-4 font-medium">Venue</th>
                  <th className="py-3 pr-4 font-medium">Photography</th>
                  <th className="py-3 pr-4 font-medium">Music</th>
                  <th className="py-3 font-medium">Comment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {feedback.map((entry) => (
                  <tr key={entry.id} className="align-top text-white/75">
                    <td className="whitespace-nowrap py-4 pr-4 text-xs text-white/50">{formatDate(entry.createdAt)}</td>
                    <td className="py-4 pr-4"><RatingStars value={entry.foodRating} /></td>
                    <td className="py-4 pr-4"><RatingStars value={entry.venueAmbienceRating} /></td>
                    <td className="py-4 pr-4"><RatingStars value={entry.photographyRating} /></td>
                    <td className="py-4 pr-4"><RatingStars value={entry.musicEntertainmentRating} /></td>
                    <td className="max-w-sm whitespace-pre-wrap py-4">{entry.comment}</td>
                  </tr>
                ))}
                {!feedback.length && <tr><td colSpan="6" className="py-8 text-center text-white/45">No feedback submitted yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;