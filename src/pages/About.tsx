import { Link } from "react-router-dom";
import { ArrowLeft, Github, Shield, Zap, Share2, Heart, Code2 } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-[#050505] relative flex flex-col selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
        <div className="bg-[#121418] border border-white/5 shadow-2xl shadow-black px-6 py-4 rounded-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <img src="/assets/logo.png" alt="AirNoctise" className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <a 
              target="_blank" 
              rel="noopener noreferrer"
              href="https://github.com/wellyngtombarcellos/AirNoctise" 
              className="flex items-center gap-2 bg-white/5 px-5 py-2.5 rounded-full border border-white/5 hover:bg-white/10 transition-all group"
            >
              <Github size={16} className="text-white/40 group-hover:text-white transition-transform" />
              <span className="text-xs font-bold text-white/40 group-hover:text-white uppercase tracking-widest">Open Source</span>
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-24">
          
          {/* Hero Section */}
          <section className="text-center space-y-8 animate-float-in">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 px-5 py-2 rounded-full border border-blue-500/20 shadow-sm">
              <Heart size={14} className="text-primary fill-primary" />
              <span className="text-[10px] font-black text-primary tracking-widest uppercase">Feito para a comunidade</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white hero-text tracking-tighter leading-[0.9]">
              Compartilhar deve ser <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">simples, privado e aberto.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/40 font-medium max-w-2xl mx-auto leading-relaxed">
              O AirNoctise é uma plataforma de transferência de arquivos P2P projetada para quem valoriza a privacidade e a velocidade.
            </p>
            <div className="pt-4">
              <Link 
                to="/" 
                className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:bg-slate-100 transition-all hover:-translate-y-1 active:translate-y-0"
              >
                Começar a usar agora <ArrowLeft className="rotate-180" size={20} />
              </Link>
            </div>
          </section>

          {/* Features Grid */}
          <section className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Privacidade Total",
                desc: "Seus arquivos nunca tocam em nossos servidores. A conexão é direta entre você e o destinatário."
              },
              {
                icon: Zap,
                title: "Sem Limites",
                desc: "Como a transferência é direta (P2P), não impomos limites de tamanho de arquivo ou velocidade."
              },
              {
                icon: Share2,
                title: "Criptografia",
                desc: "Toda a comunicação é criptografada de ponta a ponta usando protocolos modernos de WebRTC."
              }
            ].map((f, i) => (
              <div key={i} className="bg-[#121418] border border-white/5 p-10 rounded-[3rem] shadow-2xl space-y-6 hover:translate-y-[-8px] transition-all group">
                <div className="w-16 h-16 bg-[#1A1D23] rounded-2xl flex items-center justify-center text-white border border-white/5 shadow-sm group-hover:scale-110 transition-transform">
                  <f.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white hero-text">{f.title}</h3>
                <p className="text-white/30 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </section>


          {/* Open Source Section */}
          <section className="bg-white text-slate-900 rounded-[4rem] p-12 md:p-20 relative overflow-hidden shadow-3xl">
            <div className="relative z-10 space-y-8 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-slate-900/5 px-4 py-2 rounded-full border border-slate-900/10">
                <Code2 size={14} className="text-slate-900/60" />
                <span className="text-[10px] font-bold text-slate-900/60 uppercase tracking-widest">Código Aberto</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold hero-text leading-tight text-slate-900">
                Transparência é o nosso <br /> alicerce.
              </h2>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                Acreditamos que softwares de privacidade devem ser auditáveis. O AirNoctise é 100% open source, permitindo que qualquer pessoa veja como funciona e contribua para o seu crescimento.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a 
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/wellyngtombarcellos/AirNoctise"
                  className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
                >
                  <Github size={20} /> Ver no GitHub
                </a>
              </div>
            </div>
            
            {/* Background Icon Decor */}
            <Github className="absolute -right-20 -bottom-20 text-slate-900/[0.03] w-[35rem] h-[35rem] pointer-events-none -rotate-12" />
          </section>

          {/* Footer inside main */}
          <footer className="text-center pt-20 border-t border-white/5 pb-10">
            <p className="text-white/20 font-medium">
              AirNoctise © 2026 • Desenvolvido com ❤️ pela comunidade Open Source
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default About;
