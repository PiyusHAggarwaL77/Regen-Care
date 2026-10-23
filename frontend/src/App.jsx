import { useState } from 'react';
import { investigateOffer } from './api/investigate.js';
import ErrorMessage from './components/ErrorMessage.jsx';
import LoadingState from './components/LoadingState.jsx';
import OfferForm from './components/OfferForm.jsx';
import Report from './components/Report.jsx';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);
  const [formKey, setFormKey] = useState(0);

  async function handleInvestigation(input) {
    setIsLoading(true);
    setError('');
    setReport(null);

    try {
      const nextReport = await investigateOffer(input);
      setReport(nextReport);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  function resetInvestigation() {
    setReport(null);
    setError('');
    setFormKey((currentKey) => currentKey + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#start" className="text-xl font-bold tracking-tight text-slate-950">ScamSieve</a>
          <p className="hidden text-sm text-slate-600 sm:block">Evidence before verdict.</p>
        </div>
      </header>

      <main id="start" className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-700">Offer investigation assistant</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Check the offer. Follow the evidence.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">Paste a suspicious job, internship, scholarship, or recruitment offer. ScamSieve will help you review evidence and uncertainty—never promise that an offer is safe.</p>
        </section>

        <section className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="form-heading">
          <h2 id="form-heading" className="text-2xl font-bold text-slate-950">Start an investigation</h2>
          <p className="mt-2 text-slate-600">Use offer text, a website URL, or both. At least one is required.</p>
          <div className="mt-6">
            <OfferForm key={formKey} isLoading={isLoading} onSubmit={handleInvestigation} />
          </div>
          <p className="mt-5 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">Privacy note: future research mode may send limited search queries to a configured provider. This mock milestone does not call any research provider or open submitted URLs.</p>
        </section>

        <div className="mx-auto mt-8 max-w-6xl">
          {isLoading ? <LoadingState /> : null}
          {error ? <ErrorMessage message={error} /> : null}
          {report ? <Report report={report} onReset={resetInvestigation} /> : null}
        </div>
      </main>
    </div>
  );
}
