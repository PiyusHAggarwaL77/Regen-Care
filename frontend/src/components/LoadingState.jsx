export default function LoadingState() {
  return (
    <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5" aria-live="polite" aria-busy="true">
      <div className="flex items-center gap-3">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" aria-hidden="true" />
        <div>
          <h2 className="font-semibold text-slate-900">Preparing your report</h2>
          <p className="mt-1 text-sm text-slate-600">Checking the submitted input and preparing the demo response…</p>
        </div>
      </div>
    </section>
  );
}
