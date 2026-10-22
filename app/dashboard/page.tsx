"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const links = [
  ["Centro Cognitivo", "/dashboard"],
  ["Observatório Global", "/dashboard/observatorio"],
  ["Relatórios Executivos", "/dashboard/relatorios"],
  ["Tendências", "/dashboard/tendencias"],
  ["Oportunidades", "/dashboard/oportunidades"],
  ["Alertas Críticos", "/dashboard/alertas"],
  ["NeuroBot", "/dashboard/neurobot"],
];

export default function Dashboard() {
  const [comando, setComando] = useState("");
  const [resposta, setResposta] = useState("Sou o Twin, sua interface de inteligência. Pergunte sobre eventos globais, explore cenários ou acesse um dos módulos.");
  const [estado, setEstado] = useState<"pronto" | "ouvindo" | "analisando">("pronto");
  const [destino, setDestino] = useState<string | null>(null);
  const [erroVoz, setErroVoz] = useState("");
  const recognitionRef = useRef<any>(null);

  const executar = useCallback(async (frase: string) => {
    const mensagem = frase.trim();
    if (!mensagem) return;
    setComando(mensagem);
    setEstado("analisando");
    setDestino(null);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: mensagem }),
      });
      if (!response.ok) throw new Error("Serviço temporariamente indisponível");
      const data = await response.json();
      const reply = String(data.reply || data.resposta || "Não foi possível obter uma resposta.");
      setResposta(reply);
      if (data.action?.type === "FOCUS_GLOBE" && Number.isFinite(data.action.lat) && Number.isFinite(data.action.lng)) {
        const params = new URLSearchParams({
          focus: "earthquake",
          lat: String(data.action.lat),
          lng: String(data.action.lng),
        });
        setDestino("/dashboard/observatorio?" + params.toString());
      }
    } catch {
      setResposta("Não foi possível consultar o núcleo cognitivo. Tente novamente.");
    } finally {
      setEstado("pronto");
    }
  }, []);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const frase = event.results?.[0]?.[0]?.transcript || "";
      if (frase) void executar(frase);
    };
    recognition.onerror = () => {
      setEstado("pronto");
      setErroVoz("Não foi possível captar sua voz. Utilize o campo de texto.");
    };
    recognition.onend = () => setEstado(v => v === "ouvindo" ? "pronto" : v);
    recognitionRef.current = recognition;
    return () => { try { recognition.stop(); } catch {} };
  }, [executar]);

  function ouvir() {
    if (!recognitionRef.current) {
      setErroVoz("Reconhecimento de voz não disponível neste navegador. Utilize o campo de texto.");
      return;
    }
    try {
      setErroVoz("");
      setEstado("ouvindo");
      recognitionRef.current.start();
    } catch {
      setEstado("pronto");
      setErroVoz("Não foi possível iniciar o microfone.");
    }
  }

  return (
    <main className="nt-home">
      <style>{`
        .nt-home{min-height:100vh;color:#f0f7ff;background:radial-gradient(ellipse at 55% 5%,#14345a 0%,#081426 38%,#040b15 80%);font-family:Inter,system-ui,Arial,sans-serif;display:grid;grid-template-columns:245px minmax(0,1fr)}
        .nt-side{padding:34px 22px;border-right:1px solid #ffffff19;background:#06111ee8;position:sticky;top:0;height:100vh}
        .nt-brand{font-size:23px;letter-spacing:.03em;font-weight:850;margin:0}.nt-brand span{color:#5bdfff}.nt-kicker{font-size:10px;letter-spacing:.19em;color:#8cb5d2;text-transform:uppercase;margin-top:8px}
        .nt-nav{display:grid;gap:7px;margin-top:46px}.nt-nav a{color:#bdd0e3;text-decoration:none;padding:12px;border-radius:10px;font-size:13px;border:1px solid transparent}.nt-nav a:hover,.nt-nav a:first-child{background:#103354;border-color:#2a597d;color:#fff}
        .nt-content{padding:38px clamp(22px,5vw,78px) 70px;max-width:1500px;width:100%;margin:auto}
        .nt-overline{color:#61d8ed;font-size:11px;font-weight:750;letter-spacing:.22em;text-transform:uppercase}
        .nt-hero{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(220px,.7fr);align-items:center;gap:26px;padding:35px 0 26px}
        .nt-hero h1{font-size:clamp(34px,4.5vw,67px);letter-spacing:-.055em;line-height:1.06;margin:17px 0 20px;font-weight:820}
        .nt-hero h1 em{font-style:normal;color:#68ddf2}.nt-lead{font-size:clamp(14px,1.4vw,18px);line-height:1.7;color:#bbcadb;max-width:680px}
        .nt-origin{font-size:13px;color:#91abc2;line-height:1.7;max-width:650px}
        .nt-orb-wrap{min-height:250px;display:grid;place-items:center}.nt-orb{width:min(22vw,250px);height:min(22vw,250px);min-width:170px;min-height:170px;border-radius:50%;position:relative;background:radial-gradient(circle at 35% 30%,#6be7ff 0%,#1a72b5 12%,#0a254b 45%,#020a1b 75%);box-shadow:0 0 70px #087cbe77,inset -24px -22px 45px #020a1b,0 0 0 1px #7eeaff45;animation:nt-breathe 5s ease-in-out infinite}
        .nt-orb:after{content:"";position:absolute;inset:-15px;border-radius:50%;border:1px solid #4ce7fa44;transform:rotateX(65deg) rotate(-25deg)}
        .nt-twin-mark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:5px;z-index:2;color:#e8fbff;text-shadow:0 0 18px #6ce8ff;font-size:48px;font-weight:850;letter-spacing:-.07em}
        .nt-twin-mark i{font-size:32px;font-style:normal;color:#73e5ff}.nt-twin-mark small{position:absolute;top:67%;font-size:10px;letter-spacing:.24em;font-weight:700;color:#bdeaff}
        .nt-orb-ouvindo{box-shadow:0 0 110px #00ddffb8,inset -24px -22px 45px #020a1b,0 0 0 5px #37e7ff55}
        .nt-orb-analisando{animation:nt-analyze 1.3s ease-in-out infinite}
        @keyframes nt-analyze{50%{filter:brightness(1.45);transform:scale(1.04)}}
        @media(prefers-reduced-motion:reduce){.nt-orb-analisando{animation:none}}

        @keyframes nt-breathe{50%{box-shadow:0 0 100px #087cbeaa,inset -24px -22px 45px #020a1b,0 0 0 1px #7eeaff65}}
        .nt-institutional{background:linear-gradient(115deg,#102a3c,#071626);border:1px solid #355b73;border-radius:18px;padding:25px;margin:0 0 24px}
        .nt-institutional h2{font-size:clamp(20px,2.4vw,29px);letter-spacing:-.03em;margin:12px 0 18px}
        .nt-pillars{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
        .nt-pillars>div{border:1px solid #29495d;background:#091c2c;border-radius:11px;padding:16px}
        .nt-pillars strong{display:block;color:#bdeef6;font-size:13px;margin-bottom:9px}
        .nt-pillars span{display:block;color:#b3c8d8;font-size:12px;line-height:1.65}
        .nt-institutional-action{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:19px;flex-wrap:wrap}
        .nt-institutional-action a{background:#3cc4d9;color:#061521;text-decoration:none;padding:11px 14px;border-radius:9px;font-size:12px;font-weight:800}
        .nt-institutional-action span{font-size:11px;line-height:1.6;color:#92acbf;max-width:410px}
        .nt-card{background:linear-gradient(135deg,#0d2237d9,#091524ed);border:1px solid #31516c80;border-radius:18px;padding:25px}
        .nt-card h2{font-size:20px;margin:8px 0 8px}.nt-muted{color:#a7bfd1;font-size:13px;line-height:1.65}
        .nt-command{display:flex;gap:10px;margin-top:18px}.nt-input{min-width:0;flex:1;padding:14px 15px;border-radius:10px;background:#04101f;color:#fff;border:1px solid #3d627d;font:inherit}
        .nt-btn{background:#29b7d3;border:1px solid #63e6ff;color:#03131e;padding:12px 18px;border-radius:10px;font-weight:800;cursor:pointer}.nt-btn:disabled{opacity:.55;cursor:wait}
        .nt-btn-alt{background:#12324b;color:#e6faff;border-color:#40748e}
        .nt-response{margin-top:18px;background:#071625;padding:18px;border-radius:12px;border:1px solid #26445c;line-height:1.65;font-size:14px;color:#d5e8f4}
        .nt-modules{margin-top:30px}.nt-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px;margin-top:16px}
        .nt-module{text-decoration:none;color:#e9f5ff;display:block;border:1px solid #24445c;background:#0a1b2a;padding:20px;border-radius:13px;transition:transform .2s,border-color .2s}.nt-module:hover{transform:translateY(-3px);border-color:#50cde9}
        .nt-module strong{display:block;margin-bottom:8px;font-size:14px}.nt-module small{color:#94b3c7;line-height:1.5;font-size:12px}
        .nt-foot{font-size:11px;color:#718da2;margin-top:28px}
        @media(max-width:1000px){.nt-home{grid-template-columns:1fr}.nt-side{position:static;height:auto;padding:19px 24px}.nt-nav{display:flex;flex-wrap:wrap;margin-top:18px;gap:3px}.nt-nav a{padding:8px 10px}.nt-content{padding:24px}.nt-hero{grid-template-columns:1fr}.nt-orb-wrap{display:none}}
        @media(max-width:650px){.nt-pillars{grid-template-columns:1fr}.nt-grid{grid-template-columns:1fr}.nt-command{flex-wrap:wrap}.nt-input{flex-basis:100%}.nt-btn{flex:1}.nt-card{padding:17px}}
        @media(prefers-reduced-motion:reduce){.nt-orb{animation:none}.nt-module{transition:none}}
      `}</style>
      <aside className="nt-side">
        <div className="nt-brand">NEURO<span>TWIN</span> <span style={{fontSize:13}}>2050</span></div>
        <div className="nt-kicker">Inteligência estratégica · apoio à decisão</div>
        <nav className="nt-nav" aria-label="Módulos NeuroTwin">
          {links.map(([label, href]) => <a href={href} key={href} aria-current={href === "/dashboard" ? "page" : undefined}>{label}</a>)}
        </nav>
      </aside>
      <div className="nt-content">
        <section className="nt-hero">
          <div>
            <div className="nt-overline">PLATAFORMA DE INTELIGÊNCIA ESTRATÉGICA · VISÃO 2050</div>
            <h1>Inteligência para <em>decisões fundamentadas.</em></h1>
            <p className="nt-lead">NeuroTwin 2050 é uma plataforma em desenvolvimento para reunir informações verificáveis, explorar cenários e apoiar análises estratégicas, inclusive em aplicações de interesse público.</p>
            <p className="nt-origin">Nossa missão é transformar dados dispersos em conhecimento rastreável. O sistema oferece subsídios à análise, sem substituir especialistas, gestores ou decisões oficiais.</p>
          </div>
          <div className="nt-orb-wrap" role="img" aria-label={"Twin: " + estado}>
            <div className={"nt-orb nt-orb-" + estado}>
              <div className="nt-twin-mark"><span>N</span><i>✧</i><span>T</span><small>NEUROTWIN</small></div>
            </div>
          </div>
        </section>
        <section className="nt-institutional" aria-label="Apresentação institucional">
          <div className="nt-overline">PROPOSTA DE VALOR · APLICAÇÕES DE INTERESSE PÚBLICO</div>
          <h2>Da fonte à decisão: um processo verificável</h2>
          <div className="nt-pillars">
            <div><strong>01 · Origem e propósito</strong><span>Projeto independente de inteligência digital concebido para organizar informações e ampliar a capacidade de análise humana.</span></div>
            <div><strong>02 · Demonstração com dados reais</strong><span>O Observatório consulta eventos sísmicos no feed público do USGS e permite explorar suas coordenadas. Não realiza previsão de desastres.</span></div>
            <div><strong>03 · Governança e responsabilidade</strong><span>Fontes identificadas, limitações explícitas e supervisão humana. Segurança, LGPD e acessibilidade ainda requerem auditoria.</span></div>
          </div>
          <div className="nt-institutional-action"><a href="/dashboard/observatorio">Explorar demonstração no Observatório →</a><span>Plataforma em desenvolvimento. Sem vínculo, homologação ou certificação governamental.</span></div>
        </section>
        <section className="nt-card" aria-label="Interação com o Twin">
          <div className="nt-overline">CENTRO COGNITIVO · INTERAÇÃO</div>
          <h2>Converse com o Twin</h2><p className="nt-muted" aria-live="polite">Estado: {estado === "ouvindo" ? "ouvindo seu comando" : estado === "analisando" ? "analisando sua solicitação" : "pronto para interagir"}</p>
          <p className="nt-muted">Pergunte, investigue um evento ou peça uma análise. O Twin utiliza as funções e fontes disponíveis no sistema.</p>
          <form className="nt-command" onSubmit={event => { event.preventDefault(); void executar(comando); }}>
            <input className="nt-input" aria-label="Escreva seu comando" value={comando} onChange={event => setComando(event.target.value)} placeholder="Ex.: Twin, mostre o terremoto mais recente" />
            <button className="nt-btn" disabled={estado === "analisando"} type="submit">{estado === "analisando" ? "Analisando…" : "Executar"}</button>
            <button className="nt-btn nt-btn-alt" type="button" onClick={ouvir} disabled={estado !== "pronto"}>{estado === "ouvindo" ? "Ouvindo…" : "Comando de voz"}</button>
          </form>
          {erroVoz && <p role="alert" className="nt-muted">{erroVoz}</p>}
          <div className="nt-response" aria-live="polite"><div className="nt-overline" style={{marginBottom:9}}>RESPOSTA DO TWIN</div>{resposta}{destino && <div style={{marginTop:15}}><a className="nt-btn" style={{display:"inline-block",textDecoration:"none"}} href={destino}>Explorar epicentro no Observatório →</a></div>}</div>
        </section>
        <section className="nt-modules">
          <div className="nt-overline">ECOSSISTEMA NEUROTWIN</div>
          <h2 style={{fontSize:25,margin:"9px 0"}}>Módulos da plataforma · desenvolvimento por etapas</h2>
          <div className="nt-grid">
            <a className="nt-module" href="/dashboard/observatorio"><strong>◎ Observatório Global</strong><small>Monitoramento geográfico e análise de eventos a partir de fontes externas.</small></a>
            <a className="nt-module" href="/dashboard/tendencias"><strong>↗ Tendências</strong><small>Exploração de sinais, mudanças e possíveis cenários.</small></a>
            <a className="nt-module" href="/dashboard/oportunidades"><strong>✦ Oportunidades</strong><small>Organização de informações para apoiar decisões estratégicas.</small></a>
            <a className="nt-module" href="/dashboard/relatorios"><strong>▤ Relatórios</strong><small>Consolidação e apresentação das análises disponíveis.</small></a>
            <a className="nt-module" href="/dashboard/alertas"><strong>◇ Alertas</strong><small>Consulta aos avisos e eventos registrados pelo sistema.</small></a>
            <a className="nt-module" href="/dashboard/neurobot"><strong>◈ NeuroBot</strong><small>Acesso ao módulo de assistência digital.</small></a>
          </div>
        </section>
        <footer className="nt-foot">NeuroTwin 2050 · Inteligência para compreender, planejar e agir. Informações e análises dependem das fontes e serviços disponíveis.</footer>
      </div>
    </main>
  );
}
