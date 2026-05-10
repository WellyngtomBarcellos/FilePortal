import { ArrowLeft, Copy, Users, Zap, FileUp, Folder } from "lucide-react";
import { ConnectionBadge } from "@/components/ConnectionBadge";
import { FileDropZone } from "@/components/FileDropZone";
import { IncomingFileModal } from "@/components/IncomingFileModal";
import { TransferProgress } from "@/components/TransferProgress";
import { useRoom } from "@/hooks/useRoom";
import { toast } from "sonner";

interface RoomProps {
  userName: string;
  roomCode: string;
  role: "host" | "guest";
  onLeave: () => void;
}

export function Room({ userName, roomCode, role, onLeave }: RoomProps) {
  const room = useRoom({ userName, roomCode, role });
  const isFSAPISupported = typeof window !== "undefined" && "showSaveFilePicker" in window;

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast.success("Código copiado!");
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-x-hidden selection:bg-primary/20">
      
      {/* Background decoration matching Lobby */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-500/20 blur-[120px]"></div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-10 space-y-8 relative z-10 flex-1 flex flex-col">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between gap-3 shrink-0">
          <button 
            onClick={onLeave}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-slate-600 hover:text-slate-900 transition-all border border-white/40 shadow-sm text-sm font-bold active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" /> Sair da Sala
          </button>
          <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/40 shadow-sm">
            <ConnectionBadge state={room.state} ping={room.ping} />
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch flex-1">
          
          {/* Left Column: Info & Status */}
          <div className="space-y-8 flex flex-col">
            {/* Header Card */}
            <header className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative overflow-hidden animate-float-in">
              <Folder className="absolute -right-10 -bottom-10 text-slate-100 w-64 h-64 pointer-events-none -rotate-12" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-3">Código da Sala</div>
                  <div className="font-mono text-5xl font-bold tracking-widest text-slate-900">
                    {roomCode}
                  </div>
                </div>
                <button 
                  onClick={copyCode} 
                  title="Copiar código"
                  className="flex items-center justify-center h-16 w-16 rounded-3xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-primary border border-slate-100 transition-all self-start sm:self-auto shrink-0 shadow-sm active:scale-95"
                >
                  <Copy className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-slate-50 mt-8 relative z-10">
                <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-[2rem] border border-slate-100/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 shrink-0 shadow-sm">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Você</div>
                    <div className="font-bold text-slate-900 truncate">{userName}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-[2rem] border border-slate-100/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 shrink-0 shadow-sm">
                    <Users className={`h-5 w-5 ${room.peerName ? 'text-primary' : 'text-slate-300'}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Parceiro</div>
                    <div className={`font-bold text-slate-900 truncate ${!room.peerName && 'text-slate-300 italic font-medium'}`}>
                      {room.peerName ?? (room.state === "waiting" ? "Aguardando..." : "Conectando...")}
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {!isFSAPISupported && (
              <div className="bg-amber-50 rounded-[1.5rem] p-5 border border-amber-200 text-sm text-amber-700 font-medium animate-float-in">
                <strong className="text-amber-800">Aviso:</strong> seu navegador não suporta salvamento direto. 
                Use Chrome ou Edge para melhor desempenho com arquivos grandes.
              </div>
            )}

            {room.transfer && (
              <div className="animate-float-in mt-auto">
                <TransferProgress
                  transfer={room.transfer}
                  onCancel={room.cancelTransfer}
                  onDismiss={room.dismissTransfer}
                />
              </div>
            )}
          </div>

          {/* Right Column: File Drop Zone */}
          <div className="flex-1">
            <section className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] animate-float-in relative overflow-hidden h-full flex flex-col">
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <FileUp className="text-primary" size={24} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Enviar Arquivo</h2>
              </div>
              
              <div className="flex-1 flex flex-col relative z-10">
                <FileDropZone
                  onFile={room.sendFile}
                  disabled={room.state !== "connected" || (room.transfer?.status === "active")}
                />
              </div>
            </section>
          </div>

        </div>

        <IncomingFileModal
          offer={room.incoming}
          fromName={room.peerName ?? "Usuário"}
          onAccept={room.acceptIncoming}
          onReject={room.rejectIncoming}
        />
      </div>
    </div>
  );
}
