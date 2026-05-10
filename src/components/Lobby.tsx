import { useState } from "react";
import { Zap, Plus, LogIn, Sparkles, Send, Shield, Github, Rocket, Lock } from "lucide-react";
import { generateRoomCode } from "@/lib/format";
import { toast } from "sonner";

interface LobbyProps {
  onJoin: (opts: { name: string; code: string; role: "host" | "guest" }) => void;
}

export function Lobby({ onJoin }: LobbyProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const validate = () => {
    if (!name.trim()) {
      toast.error("Digite seu nome");
      return false;
    }
    return true;
  };

  const handleCreate = () => {
    if (!validate()) return;
    const newCode = generateRoomCode();
    onJoin({ name: name.trim(), code: newCode, role: "host" });
  };

  const handleJoin = () => {
    if (!validate()) return;
    const c = code.trim().toUpperCase();
    if (!/^[A-Z0-9]{4,12}$/.test(c)) {
      toast.error("Código inválido");
      return;
    }
    onJoin({ name: name.trim(), code: c, role: "guest" });
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-x-hidden selection:bg-primary/20">
      
      {/* Navigation */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-black/5 px-6 py-4 rounded-full flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center group cursor-pointer">
              <img src="/assets/logo-black.png" alt="AirNoctise" className="h-10 w-auto object-contain" />
            </div>
            

          </div>

          <div className="flex items-center gap-3">
            <a target="_blank" href="https://github.com/wellyngtombarcellos/AirNoctise" className="hidden sm:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
              <Github size={14} className="text-slate-600" />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Open Source</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 pt-32 pb-20 max-w-7xl mx-auto w-full gap-16 lg:gap-32">
        
        {/* Upload Card */}
        <div className="w-full max-w-[420px] animate-float-in">
          <div className="bg-white rounded-[3rem] p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white relative overflow-hidden">
            
            <div className="space-y-8 px-4 py-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 hero-text">Bem-vindo</h3>
                <p className="text-slate-400 text-sm font-medium">Crie ou entre em uma sala para começar</p>
              </div>

              {/* Inputs */}
              <div className="space-y-3">
                <div className="group">
                  <input 
                    type="text" 
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border-transparent border-b-slate-200 border-b py-4 px-2 focus:outline-none focus:border-primary transition-all placeholder:text-slate-400 font-medium"
                  />
                </div>
                <div className="group">
                  <input 
                    type="text" 
                    placeholder="Código da sala (opcional)"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full bg-slate-50 border-transparent border-b-slate-200 border-b py-4 px-2 focus:outline-none focus:border-primary transition-all placeholder:text-slate-400 font-mono tracking-widest"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex gap-3">
                <button 
                  onClick={handleCreate}
                  className="flex-[1.5] bg-primary text-white h-16 rounded-[2rem] font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Criar sala
                </button>
                <button 
                  onClick={handleJoin}
                  disabled={!code.trim()}
                  className="flex-1 bg-slate-900 text-white h-16 rounded-[2rem] font-bold text-sm hover:bg-slate-800 disabled:opacity-30 transition-all"
                >
                  Entrar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Text Section */}
        <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl animate-float-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="hero-text text-6xl md:text-8xl text-white leading-[0.95] tracking-tight">
            Need to send <br />
            <span className="italic">big files?</span>
          </h1>
          
          <p className="text-white/80 text-xl md:text-2xl font-medium leading-relaxed max-w-lg">
            Compartilhe arquivos gigantes diretamente entre navegadores. 
            <span className="block mt-2 opacity-60 text-lg">Sem servidores, sem limites, 100% open source.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <div className="flex items-center gap-2 text-white/60">
              <Shield size={20} />
              <span className="text-sm font-semibold">Criptografado ponta a ponta</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="py-10 px-6 border-t border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <img 
              src="https://ambarks.com/assets/image/ambarks/withe-logotipo.png" 
              alt="Ambarks Studios" 
              className="h-8 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" 
            />
          </div>
          

        </div>
      </footer>

      {/* Decorative Blur Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-500/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
}

