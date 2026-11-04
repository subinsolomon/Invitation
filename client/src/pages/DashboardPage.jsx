import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { dashboardService } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useWeddingPhase } from '../context/WeddingPhaseContext';

const ratingRows = [
  { key: 'food', field: 'foodRating', label: 'Food', color: '#facc15' },
  { key: 'venueAmbience', field: 'venueAmbienceRating', label: 'Venue & ambience', color: '#38bdf8' },
  { key: 'photography', field: 'photographyRating', label: 'Photography', color: '#fb7185' },
  { key: 'musicEntertainment', field: 'musicEntertainmentRating', label: 'Music & entertainment', color: '#4ade80' },
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

const csvCell = (value) => {
  let text = String(value ?? '');
  if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

const downloadCsv = (filename, headers, rows) => {
  const content = [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const DashboardPage = () => {
  const { currentTheme } = useTheme();
  const { weddingPhase, setWeddingPhase } = useWeddingPhase();
  const prefersReducedMotion = useReducedMotion();
  const [tokenInput, setTokenInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingFeedbackStatus, setUpdatingFeedbackStatus] = useState(false);
  const [updatingRSVPStatus, setUpdatingRSVPStatus] = useState(false);
  const [updatingMemorySharingStatus, setUpdatingMemorySharingStatus] = useState(false);
  const [updatingWeddingPhase, setUpdatingWeddingPhase] = useState(false);
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

  const handleFeedbackToggle = async () => {
    const enabled = !dashboard.feedbackEnabled;
    setUpdatingFeedbackStatus(true);
    setErrorMessage('');
    try {
      const result = await dashboardService.setFeedbackEnabled(accessToken, enabled);
      setDashboard((current) => ({ ...current, feedbackEnabled: result.feedbackEnabled }));
    } catch (error) {
      setErrorMessage(error.message || 'Could not change feedback availability.');
    } finally {
      setUpdatingFeedbackStatus(false);
    }
  };

  const handleRSVPToggle = async () => {
    const enabled = !dashboard.rsvpEnabled;
    setUpdatingRSVPStatus(true);
    setErrorMessage('');
    try {
      const result = await dashboardService.setRSVPEnabled(accessToken, enabled);
      setDashboard((current) => ({ ...current, rsvpEnabled: result.rsvpEnabled }));
    } catch (error) {
      setErrorMessage(error.message || 'Could not change RSVP availability.');
    } finally {
      setUpdatingRSVPStatus(false);
    }
  };

  const handleMemorySharingToggle = async () => {
    const enabled = !dashboard.memorySharingEnabled;
    setUpdatingMemorySharingStatus(true);
    setErrorMessage('');
    try {
      const result = await dashboardService.setMemorySharingEnabled(accessToken, enabled);
      setDashboard((current) => ({ ...current, memorySharingEnabled: result.memorySharingEnabled }));
    } catch (error) {
      setErrorMessage(error.message || 'Could not change Share Your Memories availability.');
    } finally {
      setUpdatingMemorySharingStatus(false);
    }
  };

  const handleWeddingPhaseToggle = async () => {
    const phase = weddingPhase === 'before' ? 'after' : 'before';
    setUpdatingWeddingPhase(true);
    setErrorMessage('');
    try {
      const result = await dashboardService.setWeddingPhase(accessToken, phase);
      setWeddingPhase(result.weddingPhase);
      setDashboard((current) => ({ ...current, weddingPhase: result.weddingPhase }));
    } catch (error) {
      setErrorMessage(error.message || 'Could not change the wedding phase.');
    } finally {
      setUpdatingWeddingPhase(false);
    }
  };

  const exportRSVPs = () => downloadCsv(
    'sajini-subin-rsvps.csv',
    ['Name', 'Email', 'Phone', 'Attendance', 'Submitted at'],
    dashboard.rsvps.map((entry) => [
      entry.name,
      entry.email,
      entry.phone,
      entry.attendance ? 'Attending' : 'Not attending',
      new Date(entry.createdAt).toISOString(),
    ]),
  );

  const exportFeedback = () => downloadCsv(
    'sajini-subin-feedback.csv',
    ['Food', 'Venue & ambience', 'Photography', 'Music & entertainment', 'Comment', 'Submitted at'],
    dashboard.feedback.map((entry) => [
      entry.foodRating,
      entry.venueAmbienceRating,
      entry.photographyRating,
      entry.musicEntertainmentRating,
      entry.comment,
      new Date(entry.createdAt).toISOString(),
    ]),
  );

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

        <section className="mb-6 flex flex-col gap-4 border-y border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between" aria-label="Wedding phase">
          <div>
            <p className="font-medium text-white">Website phase</p>
            <p className="mt-1 text-sm text-white/55">
              {weddingPhase === 'after'
                ? 'After the wedding — guest pages show thank-you and memory-focused copy.'
                : 'Before the wedding — guest pages show invitation and RSVP copy.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium ${weddingPhase === 'before' ? 'text-gold-200' : 'text-white/45'}`}>Before</span>
            <button
              type="button"
              role="switch"
              aria-checked={weddingPhase === 'after'}
              aria-label="After the wedding phase"
              onClick={handleWeddingPhaseToggle}
              disabled={updatingWeddingPhase}
              className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition-colors disabled:cursor-wait disabled:opacity-60 ${weddingPhase === 'after' ? 'border-gold-300/50 bg-gold-300/25' : 'border-white/20 bg-white/10'}`}
            >
              <span className={`absolute left-1 h-6 w-6 rounded-full shadow transition-transform ${weddingPhase === 'after' ? 'translate-x-6 bg-gold-200' : 'translate-x-0 bg-slate-300'}`} />
            </button>
            <span className={`text-xs font-medium ${weddingPhase === 'after' ? 'text-gold-200' : 'text-white/45'}`}>After</span>
          </div>
        </section>

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

        <section className="mt-6 flex flex-col gap-4 border-y border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between" aria-label="Feedback availability">
          <div>
            <p className="font-medium text-white">Feedback submissions</p>
            <p className="mt-1 text-sm text-white/55">
              {dashboard.feedbackEnabled ? 'Guests can submit ratings and comments.' : 'The feedback form is hidden from guests.'}
              {' '}Changes reach open feedback pages within a few seconds.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={dashboard.feedbackEnabled}
            aria-label="Accept feedback submissions"
            onClick={handleFeedbackToggle}
            disabled={updatingFeedbackStatus}
            className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition-colors disabled:cursor-wait disabled:opacity-60 ${dashboard.feedbackEnabled ? 'border-emerald-300/50 bg-emerald-400/25' : 'border-white/20 bg-white/10'}`}
          >
            <span className={`absolute left-1 h-6 w-6 rounded-full shadow transition-transform ${dashboard.feedbackEnabled ? 'translate-x-6 bg-emerald-200' : 'translate-x-0 bg-slate-300'}`} />
          </button>
        </section>

        <section className="flex flex-col gap-4 border-b border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between" aria-label="RSVP availability">
          <div>
            <p className="font-medium text-white">RSVP submissions</p>
            <p className="mt-1 text-sm text-white/55">
              {dashboard.rsvpEnabled ? 'Guests can submit RSVP responses.' : 'The RSVP form is hidden from guests.'}
              {' '}Changes reach open RSVP pages within a few seconds.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={dashboard.rsvpEnabled}
            aria-label="Accept RSVP submissions"
            onClick={handleRSVPToggle}
            disabled={updatingRSVPStatus}
            className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition-colors disabled:cursor-wait disabled:opacity-60 ${dashboard.rsvpEnabled ? 'border-emerald-300/50 bg-emerald-400/25' : 'border-white/20 bg-white/10'}`}
          >
            <span className={`absolute left-1 h-6 w-6 rounded-full shadow transition-transform ${dashboard.rsvpEnabled ? 'translate-x-6 bg-emerald-200' : 'translate-x-0 bg-slate-300'}`} />
          </button>
        </section>

        <section className="flex flex-col gap-4 border-b border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between" aria-label="Share Your Memories availability">
          <div>
            <p className="font-medium text-white">Share Your Memories tab</p>
            <p className="mt-1 text-sm text-white/55">
              {dashboard.memorySharingEnabled ? 'The placeholder tab is visible to guests.' : 'The tab is hidden from guests.'}
              {' '}Guest uploads are not active yet.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={dashboard.memorySharingEnabled}
            aria-label="Show Share Your Memories tab"
            onClick={handleMemorySharingToggle}
            disabled={updatingMemorySharingStatus}
            className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition-colors disabled:cursor-wait disabled:opacity-60 ${dashboard.memorySharingEnabled ? 'border-emerald-300/50 bg-emerald-400/25' : 'border-white/20 bg-white/10'}`}
          >
            <span className={`absolute left-1 h-6 w-6 rounded-full shadow transition-transform ${dashboard.memorySharingEnabled ? 'translate-x-6 bg-emerald-200' : 'translate-x-0 bg-slate-300'}`} />
          </button>
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
          <div className="mt-8">
            <h3 className="mb-4 text-sm font-medium text-white/75">Rating distribution</h3>
            <div className="grid gap-5 md:grid-cols-2">
              {ratingRows.map((row) => {
                const distribution = [5, 4, 3, 2, 1].map((score) => ({
                  score,
                  count: feedback.filter((entry) => entry[row.field] === score).length,
                }));
                const maximum = Math.max(1, ...distribution.map(({ count }) => count));
                return (
                  <div key={row.key} className="border-b border-white/10 pb-4">
                    <p className="mb-3 text-sm text-white/75">{row.label}</p>
                    <div className="flex h-24 items-end gap-2" aria-label={`${row.label} rating distribution`}>
                      {distribution.map(({ score, count }) => (
                        <div key={score} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
                          <span className="text-[0.65rem] tabular-nums text-white/55">{count}</span>
                          <motion.div
                            className="w-full max-w-10 rounded-t-sm"
                            style={{ backgroundColor: row.color, opacity: 0.8 }}
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(count ? 8 : 2, (count / maximum) * 58)}px` }}
                            transition={{ duration: prefersReducedMotion ? 0 : 0.45 }}
                          />
                          <span className="text-[0.65rem] text-white/40">{score}&#9733;</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="rsvps-title">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Guest list</p>
              <h2 id="rsvps-title" className="font-serif text-2xl font-semibold text-white">All RSVPs</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/50">{rsvps.length} records</span>
              <button type="button" onClick={exportRSVPs} className="min-h-10 rounded-lg border border-white/15 px-3 text-xs font-medium text-white/80 hover:bg-white/5">
                Export CSV
              </button>
            </div>
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
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/50">{feedback.length} records</span>
              <button type="button" onClick={exportFeedback} className="min-h-10 rounded-lg border border-white/15 px-3 text-xs font-medium text-white/80 hover:bg-white/5">
                Export CSV
              </button>
            </div>
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