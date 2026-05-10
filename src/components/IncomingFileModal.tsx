import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileIcon, Check, X, Download } from "lucide-react";
import { formatBytes } from "@/lib/format";
import type { IncomingOffer } from "@/hooks/useRoom";

interface IncomingFileModalProps {
  offer: IncomingOffer | null;
  fromName: string;
  onAccept: (o: IncomingOffer) => void;
  onReject: (o: IncomingOffer) => void;
}

export function IncomingFileModal({ offer, fromName, onAccept, onReject }: IncomingFileModalProps) {
  return (
    <Dialog open={!!offer} onOpenChange={(o) => { if (!o && offer) onReject(offer); }}>
      <DialogContent className="bg-white border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] rounded-[3rem] p-8 md:p-12 max-w-[450px] overflow-hidden !outline-none">
        <DialogHeader className="space-y-6 relative z-10 mb-2">
          <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-center justify-center mx-auto shadow-sm">
            <Download className="text-primary h-12 w-12" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-4xl font-bold tracking-tight text-center text-slate-900 hero-text">Arquivo Disponível</DialogTitle>
            <DialogDescription className="text-center text-slate-500 text-lg font-medium leading-tight">
              <span className="font-bold text-slate-900">{fromName}</span> está enviando um arquivo para você
            </DialogDescription>
          </div>
        </DialogHeader>

        {offer && (
          <div className="space-y-10 pt-4 relative z-10">
            <div className="flex items-center gap-5 rounded-[2.5rem] bg-slate-50 border border-slate-100 p-6 shadow-inner">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white border border-slate-100 shadow-sm shrink-0">
                <FileIcon className="h-8 w-8 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold text-slate-900 text-xl tracking-tight">{offer.name}</div>
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">{formatBytes(offer.size)}</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => onAccept(offer)}
                className="flex items-center justify-center gap-3 w-full h-20 rounded-[2rem] bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg shadow-2xl active:scale-95 transition-all"
              >
                <Check size={20} /> Aceitar e Baixar
              </button>
              <button 
                onClick={() => onReject(offer)}
                className="flex items-center justify-center gap-2 w-full h-14 rounded-full text-slate-400 hover:text-slate-600 font-bold text-sm transition-all hover:bg-slate-50 active:scale-95"
              >
                <X size={16} /> Recusar arquivo
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


