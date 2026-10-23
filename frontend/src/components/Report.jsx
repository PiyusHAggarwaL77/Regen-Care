const displayType = {
  observed_fact: 'Observed fact',
  warning_sign: 'Warning sign',
  contradiction: 'Contradiction',
  unknown: 'Unknown',
};

function CheckStatus({ checks }) {
  const labels = {
    search: 'Public-source search',
    fetch: 'Page retrieval',
    evidenceExtraction: 'Evidence extraction',
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-4" aria-labelledby="checks-heading">
      <h3 id="checks-heading" className="font-semibold text-slate-900">Checks in this report</h3>
      <dl className="mt-3 space-y-2 text-sm">
        {Object.entries(labels).map(([key, label]) => (
          <div key={key} className="flex justify-between gap-4 border-b border-slate-200 pb-2 last:border-0 last:pb-0">
            <dt className="text-slate-600">{label}</dt>
            <dd className="font-medium text-slate-900">{checks?.[key] || 'unknown'}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function Report({ report, onReset }) {
  const isDemo = report.isDemo || report.mode === 'mock';

  return (
    <section className="space-y-6" aria-labelledby="report-heading">
      {isDemo ? (
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-950" role="status">
          DEMO DATA — NOT LIVE RESEARCH. No TinyFish search or page retrieval was performed.
        </div>
      ) : null}

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-800">Assessment</p>
          <h2 id="report-heading" className="mt-1 text-2xl font-bold text-slate-950">{report.summary?.label || 'Needs verification'}</h2>
          <p className="mt-2 max-w-2xl text-slate-700">{report.summary?.explanation}</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="min-h-11 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-indigo-100"
        >
          New investigation
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="findings-heading">
            <h3 id="findings-heading" className="text-lg font-bold text-slate-950">Findings</h3>
            {report.findings?.length ? (
              <ul className="mt-4 space-y-3">
                {report.findings.map((finding) => (
                  <li key={finding.id} className="rounded-xl border border-slate-200 p-4">
                    <p className="text-sm font-semibold text-indigo-700">{displayType[finding.type] || finding.type}</p>
                    <h4 className="mt-1 font-semibold text-slate-950">{finding.title}</h4>
                    <p className="mt-1 text-sm text-slate-700">{finding.detail}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-slate-700">No findings are shown because this mock milestone does not analyse claims or conduct live research.</p>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="unknowns-heading">
            <h3 id="unknowns-heading" className="text-lg font-bold text-slate-950">What we couldn’t verify</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              {(report.unknowns || []).map((unknown) => <li key={unknown}>{unknown}</li>)}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="next-steps-heading">
            <h3 id="next-steps-heading" className="text-lg font-bold text-slate-950">Suggested next steps</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700">
              {(report.nextSteps || []).map((step) => <li key={step}>{step}</li>)}
            </ol>
          </section>
        </div>

        <aside className="space-y-6">
          <CheckStatus checks={report.checks} />
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="sources-heading">
            <h3 id="sources-heading" className="text-lg font-bold text-slate-950">Submitted inputs</h3>
            <div className="mt-3 space-y-4">
              {(report.sources || []).map((source) => (
                <article key={source.id} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                  <h4 className="font-semibold text-slate-900">{source.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">{source.summary}</p>
                  {source.url ? (
                    <a
                      className="mt-2 inline-block break-all text-sm font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900"
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {source.url}
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{report.disclaimer}</p>
    </section>
  );
}
