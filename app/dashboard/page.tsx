""use client"";

import { useEffect, useRef, useState } from ""react"";

export default function Dashboard() {
const [texto, setTexto] = useState("""");
const [resposta, setResposta] = useState(""Olá Elisa. Estou pronta para ajudar."");
const recognitionRef = useRef<any>(null);

useEffect(() => {
if (typeof window === ""undefined"") return;

const SpeechRecognition =
(window as any).SpeechRecognition ||
(window as any).webkitSpeechRecognition;

if (!SpeechRecognition) {
setResposta(""Seu navegador não suporta reconhecimento de voz."");
return;
}

const recognition = new SpeechRecognition();
recognition.lang = ""pt-BR"";
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = async (event: any) => {
const frase = event.results[0][0].transcript;
setTexto(frase);
setResposta(""Pensando..."");

try {
const r = await fetch(""/api/chat"", {
method: ""POST"",
headers: { ""Content-Type"": ""application/json"" },
body: JSON.stringify({ message: frase }),
});

const data = await r.json();
const reply = data.reply || ""Não consegui gerar resposta."";

setResposta(reply);

const voz = new SpeechSynthesisUtterance(reply);
voz.lang = ""pt-BR"";
speechSynthesis.cancel();
speechSynthesis.speak(voz);
} catch {
setResposta(""Não consegui responder."");
}
};

recognitionRef.current = recognition;
}, []);

function ouvir() {
recognitionRef.current?.start();
}

return (
<main style={{ background: ""#05070f"", color: ""white"", minHeight: ""100vh"", padding: 40, fontFamily: ""Arial"" }}>
<h1 style={{ fontSize: 48 }}>NeuroTwin 2050</h1>
<h2>Sistema Neural Inteligente</h2>

<div style={{ display: ""flex"", justifyContent: ""center"", marginTop: 30, marginBottom: 30 }}>
<img
src=""/avatar-neuro.png""
alt=""NeuroTwin Avatar""
style={{
width: 430,
height: 430,
objectFit: ""cover"",
borderRadius: ""50%"",
boxShadow: ""0 0 120px #00d5ff"",
border: ""4px solid rgba(0,213,255,.35)"",
}}
/>
</div>

<button onClick={ouvir} style={{ fontSize: 28, padding: ""18px 40px"", borderRadius: 15, background: ""#0b84ff"", color: ""white"", border: ""none"", cursor: ""pointer"" }}>
🎙 Conversar
</button>

<br />
<br />

<h3>Você disse:</h3>
<div style={{ fontSize: 24, color: ""#7de3ff"" }}>{texto}</div>

<br />

<h3>NeuroBot respondeu:</h3>
<div style={{ fontSize: 26, lineHeight: 1.7, background: ""#101827"", padding: 30, borderRadius: 15 }}>
{resposta}
</div>
</main>
);
}
'@ | Set-Content -Encoding UTF8 app\dashboard\page.tsx"