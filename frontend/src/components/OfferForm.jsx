import { useState } from 'react';

export default function OfferForm({ isLoading, onSubmit }) {
  const [offerText, setOfferText] = useState('');
  const [url, setUrl] = useState('');
  const [formError, setFormError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedOfferText = offerText.trim();
    const trimmedUrl = url.trim();

    if (!trimmedOfferText && !trimmedUrl) {
      setFormError('Add offer text, a URL, or both.');
      return;
    }

    setFormError('');
    onSubmit({ offerText: trimmedOfferText, url: trimmedUrl });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="offerText">
          Suspicious offer text
        </label>
        <textarea
          id="offerText"
          name="offerText"
          value={offerText}
          onChange={(event) => setOfferText(event.target.value)}
          placeholder="Paste the job, internship, scholarship, or recruiter message here"
          rows="7"
          maxLength="5000"
          aria-describedby="offer-help form-error"
          className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
        />
        <p id="offer-help" className="mt-2 text-sm text-slate-500">
          Offer text is optional when you provide a website URL. Maximum 5,000 characters.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="url">
          Offer website URL <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <input
          id="url"
          name="url"
          type="url"
          inputMode="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com/opportunity"
          maxLength="2048"
          aria-describedby="url-help form-error"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
        />
        <p id="url-help" className="mt-2 text-sm text-slate-500">
          Use a full web address beginning with http:// or https://.
        </p>
      </div>

      {formError ? (
        <p id="form-error" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800" role="alert">
          {formError}
        </p>
      ) : null}

      <button
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-indigo-300 sm:w-auto"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Investigating…' : 'Investigate offer'}
      </button>
    </form>
  );
}
