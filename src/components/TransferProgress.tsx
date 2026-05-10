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
    <div className="bg-white border border-slate-100 shadow-xl rounded-[2.5rem] p-8 animate-float-in relative overflow-hidden">
      <div className="flex items-start gap-4 relative z-10">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shrink-0 border ${
          isDone ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"
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
            <div className="truncate font-bold text-lg text-slate-900">{transfer.name}</div>
            <div className="text-sm font-bold tabular-nums text-primary">
              {pct.toFixed(0)}%
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            {transfer.direction === "send" ? "Enviando" : "Recebendo"}
            {transfer.status !== "active" && ` · ${labelStatus(transfer.status)}`}
          </div>
        </div>

        {isActive && (
          <button 
            onClick={onCancel} 
            className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all active:scale-90"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {!isActive && (
          <button 
            onClick={onDismiss} 
            className="flex items-center justify-center px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold transition-all text-xs active:scale-95 shadow-lg"
          >
            Fechar
          </button>
        )}
      </div>

      <div className="w-full bg-slate-100 rounded-full h-2.5 mt-6 mb-6 overflow-hidden relative z-10">
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${isDone ? 'bg-emerald-500' : 'bg-primary shadow-[0_0_15px_rgba(37,99,235,0.3)]'}`} 
          style={{ width: `${pct}%` }} 
        />
      </div>

      <div className="grid grid-cols-3 gap-2 p-5 bg-slate-50 rounded-[1.8rem] border border-slate-100/50 relative z-10">
        <div>
          <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Total</div>
          <div className="text-slate-900 font-bold text-sm tabular-nums truncate">
            {formatBytes(transfer.transferred)}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Velocidade</div>
          <div className="text-slate-900 font-bold text-sm tabular-nums">
            {isActive ? formatSpeed(transfer.speed) : "—"}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">ETA</div>
          <div className="text-slate-900 font-bold text-sm tabular-nums">
            {isActive ? formatTime(transfer.eta) : "—"}
          </div>
        </div>
      </div>

      {/* Faded Background Icon */}
      <RefreshCw className="absolute -right-6 -bottom-10 text-slate-50 w-48 h-48 pointer-events-none -rotate-12" />
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
