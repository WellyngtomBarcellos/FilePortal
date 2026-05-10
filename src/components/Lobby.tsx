import { useState } from "react";
import { Link } from "react-router-dom";
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
    <div className="min-h-screen bg-[#050505] relative flex flex-col overflow-x-hidden selection:bg-primary/30">
      
      {/* Navigation */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">

        <div className="bg-[#121418] border border-white/5 shadow-2xl shadow-black px-6 py-4 rounded-full flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center group cursor-pointer">
              <img src="/assets/logo.png" alt="AirNoctise" className="h-10 w-auto object-contain" />
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/about" className="text-sm font-bold text-white/40 hover:text-white transition-colors">Sobre</Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a target="_blank" href="https://github.com/wellyngtombarcellos/AirNoctise" className="hidden sm:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:bg-white/10 transition-all group">
              <Github size={14} className="text-white/40 group-hover:text-white" />
              <span className="text-[10px] font-bold text-white/40 group-hover:text-white uppercase tracking-widest">Open Source</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 pt-32 pb-20 max-w-7xl mx-auto w-full gap-16 lg:gap-32">
        
        {/* Upload Card */}
        <div className="w-full max-w-[420px] animate-float-in">
          <div className="bg-[#121418] rounded-[3rem] p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden">
            <div className="space-y-8 px-4 py-6 relative z-10">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white hero-text">Bem-vindo</h3>
                <p className="text-white/30 text-sm font-medium">Crie ou entre em uma sala para começar</p>
              </div>

              {/* Inputs */}
              <div className="space-y-3">
                <div className="group">
                  <input 
                    type="text" 
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#1A1D23] border-transparent border-b-white/10 border-b py-4 px-4 rounded-2xl focus:outline-none focus:border-primary transition-all placeholder:text-white/10 font-medium text-white"
                  />
                </div>
                <div className="group">
                  <input 
                    type="text" 
                    placeholder="Código da sala (opcional)"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full bg-[#1A1D23] border-transparent border-b-white/10 border-b py-4 px-4 rounded-2xl focus:outline-none focus:border-primary transition-all placeholder:text-white/10 font-mono tracking-widest text-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col gap-3">
                <button 
                  onClick={handleCreate}
                  className="w-full bg-primary text-white h-16 rounded-[2rem] font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  Criar sala
                </button>
                <button 
                  onClick={handleJoin}
                  disabled={!code.trim()}
                  className="w-full bg-white text-slate-900 h-16 rounded-[2rem] font-bold text-sm hover:bg-slate-100 disabled:opacity-20 transition-all active:scale-[0.99]"
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
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">big files?</span>
          </h1>
          
          <p className="text-white/60 text-xl md:text-2xl font-medium leading-relaxed max-w-lg">
            Compartilhe arquivos gigantes diretamente entre navegadores. 
            <span className="block mt-2 opacity-40 text-lg">Sem servidores, sem limites, 100% open source.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <div className="flex items-center gap-2 text-white/40">
              <Shield size={20} />
              <span className="text-sm font-semibold">Criptografado ponta a ponta</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <img 
              src="https://ambarks.com/assets/image/ambarks/withe-logotipo.png" 
              alt="Ambarks Studios" 
              className="h-8 opacity-20 hover:opacity-100 transition-all cursor-pointer invert" 
            />
          </div>
        </div>
      </footer>

    </div>
  );
}
