export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-spinner" />
      <p>{message}</p>
    </div>
  );
}
