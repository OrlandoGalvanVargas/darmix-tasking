import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-pop-in fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border border-warning/40 bg-warning-soft px-4 py-3 text-sm font-medium text-warning shadow-lg"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
        aria-hidden="true"
      >
        <path d="M2 2l20 20" />
        <path d="M8.5 16.4a5 5 0 0 1 7 0" />
        <path d="M5 12.9a10 10 0 0 1 5.2-2.7" />
        <path d="M13.8 10.3a10 10 0 0 1 5.2 2.6" />
        <path d="M2 8.8a15 15 0 0 1 4.2-2.6" />
        <path d="M22 8.8a15 15 0 0 0-8.3-3.6" />
        <path d="M12 20h.01" />
      </svg>
      Sin conexión a internet. Los cambios podrían no guardarse.
    </div>
  );
}
