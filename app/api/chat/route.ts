import { NextResponse } from "next/server";

export async function POST(req: Request) {
try {
const body = await req.json();

const message = String(
body.message ?? body.mensagem ?? ""
).trim();

if (!message) {
return NextResponse.json(
{
status: "error",
reply: "Nenhum comando foi informado.",
},
{ status: 400 }
);
}

const text = message.toLowerCase();
let reply: string;

if (
text.includes("modulo") ||
text.includes("módulo")
) {
reply = `NEUROTWIN 2050 - MODULOS OPERACIONAIS

1. Centro Cognitivo
2. Observatorio Global
3. Alertas Estrategicos
4. Relatorios Executivos
5. Radar de Oportunidades
6. Tendencias Globais
7. NeuroCore
8. Comando de Voz

Status: nucleo operacional ativo.`;
} else if (
text.includes("terremoto") ||
text.includes("earthquake") ||
text.includes("cataclismo") ||
text.includes("desastre")
) {
reply = `OBSERVATORIO NEUROTWIN 2050

Modulo de eventos naturais identificado.

Fontes de dados configuradas:
- USGS para atividade sismica
- NASA EONET para eventos naturais

A consulta de eventos reais deve ser executada pelo Observatorio Global.

Importante: o NeuroTwin deve diferenciar dados confirmados, alertas oficiais, estimativas e previsoes.`;
} else if (
text.includes("alerta") ||
text.includes("alert")
) {
reply = `CENTRO DE ALERTAS NEUROTWIN 2050

Estrutura de classificacao:
- fonte
- data e hora
- localizacao
- categoria
- severidade
- confiabilidade
- status

Nenhum alerta deve ser apresentado como real sem dados provenientes de fonte externa validada.`;
} else if (text.includes("status")) {
reply = `STATUS NEUROTWIN 2050

API de conversacao: operacional
Nucleo de comandos: operacional
Observatorio Global: integrado ao projeto
USGS: fonte configurada
NASA EONET: fonte configurada
Comando de voz: interface disponivel

Status geral: nucleo em desenvolvimento e validacao.`;
} else {
reply = `NEUROTWIN 2050

Comando recebido:
${message}

O comando foi recebido pelo nucleo operacional.

Ainda nao existe uma fonte externa associada a esta pergunta. O sistema nao ira inventar uma resposta.`;
}

return NextResponse.json({
status: "ok",
timestamp: new Date().toISOString(),
message,
reply,
});
} catch (error) {
console.error("NeuroTwin API error:", error);

return NextResponse.json(
{
status: "error",
reply: "Falha interna no nucleo NeuroTwin.",
},
{ status: 500 }
);
}
}