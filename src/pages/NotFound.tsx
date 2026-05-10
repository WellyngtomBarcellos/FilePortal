import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Ghost, MapPinOff } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background decoration matching the theme */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-500/20 blur-[120px]"></div>
      </div>

      <div className="bg-white rounded-[3rem] p-12 md:p-20 max-w-2xl w-full relative overflow-hidden text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white animate-float-in">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 mb-10 bg-slate-50 px-5 py-2 rounded-full border border-slate-100 shadow-sm">
          <MapPinOff className="text-primary" size={16} />
          <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Rota Desconhecida</span>
        </div>

        {/* Big typography and gradients */}
        <h1 className="hero-text text-[8rem] md:text-[12rem] leading-none font-bold mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-200">
          404
        </h1>
        
        <h2 className="text-4xl font-bold mb-6 tracking-tight text-slate-900 hero-text">Página não encontrada</h2>
        
        <p className="text-slate-500 text-lg font-medium mb-12 max-w-md mx-auto leading-relaxed">
          Ops! O caminho <span className="text-primary font-mono text-sm px-2 py-1 bg-blue-50 rounded-lg">{location.pathname}</span> parece não existir. Talvez a página tenha sido movida ou deletada.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-all w-full sm:w-auto active:scale-95"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
          <Link 
            to="/" 
            className="flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xl active:scale-95 transition-all w-full sm:w-auto"
          >
            <Home size={20} />
            Página Inicial
          </Link>
        </div>

        {/* Decorative background icon */}
        <Ghost className="absolute -left-20 -bottom-20 text-slate-50 w-[30rem] h-[30rem] pointer-events-none -rotate-12" />
      </div>
    </div>
  );
};


export default NotFound;
