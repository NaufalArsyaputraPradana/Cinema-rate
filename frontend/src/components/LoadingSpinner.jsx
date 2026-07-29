export default function LoadingSpinner() {
  return (
    <div className="flex w-full items-center justify-center p-8">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <div className="absolute h-12 w-12 rounded-full border-4 dark:border-slate-700 border-slate-300"></div>
        <div className="absolute h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
      </div>
    </div>
  );
}
