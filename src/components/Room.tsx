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
    <div className="min-h-screen relative flex flex-col overflow-x-hidden selection:bg-primary/30">
      
      {/* Background decoration matching Lobby */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-500/5 blur-[120px]"></div>
      </div>


      <div className="mx-auto w-full max-w-6xl px-6 py-10 space-y-8 relative z-10 flex-1 flex flex-col">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between gap-3 shrink-0">
          <button 
            onClick={onLeave}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#121418] hover:bg-[#1A1D23] text-white/60 hover:text-white transition-all border border-white/5 shadow-sm text-sm font-bold active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" /> Sair da Sala
          </button>
          <div className="bg-[#121418] px-6 py-3 rounded-full border border-white/5 shadow-sm">
            <ConnectionBadge state={room.state} ping={room.ping} />
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch flex-1">
          
          {/* Left Column: Info & Status */}
          <div className="space-y-8 flex flex-col">
            {/* Header Card */}
            <header className="bg-[#121418] rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden animate-float-in">
              <Folder className="absolute -right-10 -bottom-10 text-white/[0.02] w-64 h-64 pointer-events-none -rotate-12" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="text-[11px] font-bold text-white/40 tracking-widest uppercase mb-3">Código da Sala</div>
                  <div className="font-mono text-5xl font-bold tracking-widest text-white">
                    {roomCode}
                  </div>
                </div>
                <button 
                  onClick={copyCode} 
                  title="Copiar código"
                  className="flex items-center justify-center h-16 w-16 rounded-3xl bg-[#1A1D23] hover:bg-white/5 text-white/40 hover:text-primary border border-white/5 transition-all self-start sm:self-auto shrink-0 shadow-sm active:scale-95"
                >
                  <Copy className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-white/5 mt-8 relative z-10">
                <div className="flex items-center gap-4 bg-[#1A1D23] p-5 rounded-[2rem] border border-white/5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#121418] border border-white/10 shrink-0 shadow-sm">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1">Você</div>
                    <div className="font-bold text-white truncate">{userName}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-[#1A1D23] p-5 rounded-[2rem] border border-white/5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#121418] border border-white/10 shrink-0 shadow-sm">
                    <Users className={`h-5 w-5 ${room.peerName ? 'text-primary' : 'text-white/20'}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1">Parceiro</div>
                    <div className={`font-bold text-white truncate ${!room.peerName && 'text-white/20 italic font-medium'}`}>
                      {room.peerName ?? (room.state === "waiting" ? "Aguardando..." : "Conectando...")}
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {!isFSAPISupported && (
              <div className="bg-amber-500/10 rounded-[1.5rem] p-5 border border-amber-500/20 text-sm text-amber-500 font-medium animate-float-in">
                <strong className="text-amber-400">Aviso:</strong> seu navegador não suporta salvamento direto. 
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
            <section className="bg-[#121418] rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl animate-float-in relative overflow-hidden h-full flex flex-col">
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="p-3 bg-[#1A1D23] rounded-2xl border border-white/10 shadow-sm">
                  <FileUp className="text-primary" size={24} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Enviar Arquivo</h2>
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
