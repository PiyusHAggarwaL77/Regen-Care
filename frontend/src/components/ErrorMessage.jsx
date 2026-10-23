export default function ErrorMessage({ message }) {
  return (
    <section className="rounded-2xl border border-red-200 bg-red-50 p-5" role="alert">
      <h2 className="font-semibold text-red-900">We couldn’t complete the investigation</h2>
      <p className="mt-1 text-sm text-red-800">{message}</p>
      <p className="mt-3 text-sm text-red-800">Your input is still in the form above, so you can correct it and try again.</p>
    </section>
  );
}
