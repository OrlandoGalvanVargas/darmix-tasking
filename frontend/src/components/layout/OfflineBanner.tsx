import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-40 border-b border-warning/40 bg-warning-soft px-4 py-2 text-center text-sm font-medium text-warning"
    >
      Sin conexión a internet. Los cambios podrían no guardarse.
    </div>
  );
}
