import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { feedbackService } from '../services/api';

const ratingCategories = [
  { key: 'foodRating', label: 'Food', description: 'The meal and refreshments' },
  { key: 'venueAmbienceRating', label: 'Venue & ambience', description: 'The venue, setting, and atmosphere' },
  { key: 'photographyRating', label: 'Photography', description: 'The photos and memories' },
  { key: 'musicEntertainmentRating', label: 'Music & entertainment', description: 'The music and entertainment' },
];

const emptyRatings = {
  foodRating: 0,
  venueAmbienceRating: 0,
  photographyRating: 0,
  musicEntertainmentRating: 0,
};

export const FeedbackPage = () => {
  const { currentTheme } = useTheme();
  const [ratings, setRatings] = useState(emptyRatings);
  const [hoveredRating, setHoveredRating] = useState({});
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setErrorMessage('');

    const missingRating = ratingCategories.find(({ key }) => !ratings[key]);
    if (missingRating) {
      setErrorMessage(`Please rate ${missingRating.label.toLowerCase()} before submitting.`);
      return;
    }
    if (!comment.trim()) {
      setErrorMessage('Please add a comment before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await feedbackService.submitFeedback({ ...ratings, comment: comment.trim() });
      setMessage(response.message || 'Thank you for sharing your feedback.');
      setRatings(emptyRatings);
      setComment('');
    } catch (error) {
      setErrorMessage(error.message || 'Feedback could not be submitted. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.main
      className="min-h-[calc(100vh-5rem)] px-4 pb-14 pt-8 sm:px-6 sm:pt-12"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="eyebrow mb-3">A note from you</p>
          <h1 className="font-serif text-4xl font-semibold sm:text-5xl" style={{ color: currentTheme.accentColor }}>
            Share your feedback
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            Your thoughts mean a lot to us. Rate each part of the celebration and leave us a note.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="glass-surface rounded-2xl p-5 sm:p-8">
          <div className="divide-y divide-white/10">
            {ratingCategories.map((category, index) => {
              const activeRating = hoveredRating[category.key] || ratings[category.key];
              return (
                <motion.fieldset
                  key={category.key}
                  className="flex flex-col gap-3 py-5 first:pt-0 last:pb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0.12 : 0.35, delay: prefersReducedMotion ? 0 : index * 0.07 }}
                >
                  <legend className="sr-only">Rate {category.label}</legend>
                  <div>
                    <p className="font-medium text-white">{category.label}</p>
                    <p className="mt-1 text-xs text-white/55 sm:text-sm">{category.description}</p>
                  </div>
                  <div
                    className="flex items-center gap-1 self-start sm:self-auto"
                    role="radiogroup"
                    aria-label={`${category.label} rating`}
                    onMouseLeave={() => setHoveredRating((previous) => ({ ...previous, [category.key]: 0 }))}
                    onKeyDown={(event) => {
                      const movement = event.key === 'ArrowRight' || event.key === 'ArrowUp'
                        ? 1
                        : event.key === 'ArrowLeft' || event.key === 'ArrowDown'
                          ? -1
                          : 0;
                      if (!movement) return;
                      event.preventDefault();
                      const currentScore = ratings[category.key] || Number(event.target.dataset.ratingValue) || 1;
                      const nextScore = ((currentScore - 1 + movement + 5) % 5) + 1;
                      setRatings((previous) => ({ ...previous, [category.key]: nextScore }));
                      event.currentTarget.querySelector(`[data-rating-value="${nextScore}"]`)?.focus();
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((score) => (
                      <motion.button
                        key={score}
                        type="button"
                        role="radio"
                        aria-checked={ratings[category.key] === score}
                        tabIndex={ratings[category.key] === score || (!ratings[category.key] && score === 1) ? 0 : -1}
                        data-rating-value={score}
                        aria-label={`${score} out of 5 stars`}
                        onMouseEnter={() => setHoveredRating((previous) => ({ ...previous, [category.key]: score }))}
                        onFocus={() => setHoveredRating((previous) => ({ ...previous, [category.key]: score }))}
                        onBlur={() => setHoveredRating((previous) => ({ ...previous, [category.key]: 0 }))}
                        onClick={() => setRatings((previous) => ({ ...previous, [category.key]: score }))}
                        whileHover={prefersReducedMotion ? undefined : { scale: 1.18, rotate: -5 }}
                        whileTap={prefersReducedMotion ? undefined : { scale: 0.88 }}
                        animate={{ scale: activeRating >= score ? 1.08 : 1, color: activeRating >= score ? '#FACC15' : 'rgba(226,232,240,0.38)' }}
                        transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                        className="flex h-10 w-9 items-center justify-center text-3xl leading-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                      >
                        {activeRating >= score ? '★' : '☆'}
                      </motion.button>
                    ))}
                    <span className="ml-2 min-w-8 text-xs tabular-nums text-white/60" aria-live="polite">
                      {ratings[category.key] ? `${ratings[category.key]}/5` : ''}
                    </span>
                  </div>
                </motion.fieldset>
              );
            })}
          </div>

          <label htmlFor="feedback-comment" className="mt-5 block text-sm font-medium text-white">
            Your note
          </label>
          <textarea
            id="feedback-comment"
            name="comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={2000}
            rows={5}
            required
            placeholder="What would you like us to know?"
            className="mt-2 w-full resize-y rounded-xl border border-sky-200/20 bg-slate-950/55 px-4 py-3 text-sm leading-6 text-white placeholder:text-white/40 focus:border-sky-300/70 focus:outline-none"
          />
          <div className="mt-2 flex items-center justify-between gap-4">
            <p className="text-xs text-white/50">Your ratings and note are sent privately to us.</p>
            <span className="shrink-0 text-xs tabular-nums text-white/45">{comment.length}/2000</span>
          </div>

          {(errorMessage || message) && (
            <p
              className={`mt-5 rounded-lg border px-4 py-3 text-sm ${errorMessage ? 'border-rose-300/30 bg-rose-400/10 text-rose-100' : 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100'}`}
              role="status"
            >
              {errorMessage || message}
            </p>
          )}

          <div className="mt-6 flex justify-end">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.03, y: -2 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
              className="inline-flex min-h-12 items-center justify-center rounded-full px-7 font-semibold text-slate-950 disabled:cursor-wait disabled:opacity-60"
              style={{ backgroundColor: currentTheme.accentColor }}
            >
              {isSubmitting ? 'Sending...' : 'Send feedback'}
              <span className="ml-3" aria-hidden="true">↗</span>
            </motion.button>
          </div>
        </form>
      </div>
    </motion.main>
  );
};

export default FeedbackPage;