import { Wifi, WifiOff, Loader2, Activity } from "lucide-react";
import type { ConnState } from "@/hooks/useRoom";

interface ConnectionBadgeProps {
  state: ConnState;
  ping: number | null;
}

export function ConnectionBadge({ state, ping }: ConnectionBadgeProps) {
  const label = (() => {
    switch (state) {
      case "connecting": return "Conectando...";
      case "waiting": return "Aguardando outro usuário...";
      case "connected": return "Usuário conectado";
      case "error": return "Erro de conexão";
      default: return "Desconectado";
    }
  })();

  const dotColor =
    state === "connected" ? "bg-emerald-500" :
    state === "waiting" ? "bg-primary" :
    state === "error" ? "bg-rose-500" :
    "bg-slate-400";

  return (
    <div className="inline-flex items-center gap-3 text-sm font-bold">
      <span className={`relative flex h-2.5 w-2.5`}>
        <span className={`absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-40 animate-ping`} />
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dotColor}`} />
      </span>
      <span className="text-slate-600 tracking-tight">{label}</span>
      {state === "connected" && ping !== null && (
        <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 border-l border-slate-200 pl-3 ml-1 uppercase tracking-widest">
          <Activity className="h-3 w-3" />
          {ping}ms
        </span>
      )}
      {state === "connecting" && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
      {state === "error" && <WifiOff className="h-4 w-4 text-rose-500" />}
      {state === "connected" && <Wifi className="h-4 w-4 text-emerald-500" />}
    </div>
  );
}

