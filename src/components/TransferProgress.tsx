import { ArrowDown, ArrowUp, X, CheckCircle2, RefreshCw } from "lucide-react";
import { formatBytes, formatSpeed, formatTime } from "@/lib/format";
import type { ActiveTransfer } from "@/hooks/useRoom";

interface TransferProgressProps {
  transfer: ActiveTransfer;
  onCancel: () => void;
  onDismiss: () => void;
}

export function TransferProgress({ transfer, onCancel, onDismiss }: TransferProgressProps) {
  const pct = transfer.size > 0 ? Math.min(100, (transfer.transferred / transfer.size) * 100) : 0;
  const isDone = transfer.status === "done";
  const isActive = transfer.status === "active";

  return (
    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-2xl rounded-[2.5rem] p-8 animate-float-in relative overflow-hidden">
      <div className="flex items-start gap-4 relative z-10">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shrink-0 border ${
          isDone ? "bg-emerald-500/10 border-emerald-500/20" : "bg-primary/10 border-primary/20"
        }`}>
          {isDone ? (
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          ) : transfer.direction === "send" ? (
            <ArrowUp className="h-6 w-6 text-primary" />
          ) : (
            <ArrowDown className="h-6 w-6 text-primary" />
          )}
        </div>
        
        <div className="min-w-0 flex-1 py-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="truncate font-bold text-lg text-white">{transfer.name}</div>
            <div className="text-sm font-bold tabular-nums text-primary">
              {pct.toFixed(0)}%
            </div>
          </div>
          <div className="text-[10px] font-bold text-white/40 tracking-widest uppercase">
            {transfer.direction === "send" ? "Enviando" : "Recebendo"}
            {transfer.status !== "active" && ` · ${labelStatus(transfer.status)}`}
          </div>
        </div>

        {isActive && (
          <button 
            onClick={onCancel} 
            className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all active:scale-90"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {!isActive && (
          <button 
            onClick={onDismiss} 
            className="flex items-center justify-center px-5 py-2.5 rounded-full bg-white text-slate-900 font-bold transition-all text-xs active:scale-95 shadow-lg"
          >
            Fechar
          </button>
        )}
      </div>

      <div className="w-full bg-white/5 rounded-full h-2.5 mt-6 mb-6 overflow-hidden relative z-10">
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${isDone ? 'bg-emerald-500' : 'bg-primary shadow-[0_0_15px_rgba(37,99,235,0.4)]'}`} 
          style={{ width: `${pct}%` }} 
        />
      </div>

      <div className="grid grid-cols-3 gap-2 p-5 bg-white/5 rounded-[1.8rem] border border-white/5 relative z-10">
        <div>
          <div className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1">Total</div>
          <div className="text-white font-bold text-sm tabular-nums truncate">
            {formatBytes(transfer.transferred)}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1">Velocidade</div>
          <div className="text-white font-bold text-sm tabular-nums">
            {isActive ? formatSpeed(transfer.speed) : "—"}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1">ETA</div>
          <div className="text-white font-bold text-sm tabular-nums">
            {isActive ? formatTime(transfer.eta) : "—"}
          </div>
        </div>
      </div>

      {/* Faded Background Icon */}
      <RefreshCw className="absolute -right-6 -bottom-10 text-white/[0.02] w-48 h-48 pointer-events-none -rotate-12" />
    </div>
  );
}

function labelStatus(s: ActiveTransfer["status"]) {
  switch (s) {
    case "done": return "Concluído";
    case "cancelled": return "Cancelado";
    case "error": return "Erro";
    default: return "";
  }
}
