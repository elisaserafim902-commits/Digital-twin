import { NextResponse } from "next/server"

export async function POST(req: Request) {
const { message } = await req.json()
const texto = (message || "").toLowerCase()

let analysis = "Comando recebido. NeuroTwin operacional."

if (texto.includes("clima")) {
analysis =
"Módulo climático identificado. Próxima integração: API meteorológica para previsão local, alertas de tempestade, temperatura e risco ambiental."
}

if (texto.includes("alerta")) {
analysis =
"Nenhum alerta crítico ativo no momento. Estrutura pronta para conectar alertas climáticos, terremotos, segurança e infraestrutura."
}

if (texto.includes("oportunidade")) {
analysis =
"Radar de oportunidades acionado. Próximos módulos: concursos, licitações, negócios locais, tendências de IA e mercado."
}

if (texto.includes("relatório")) {
analysis =
"Módulo de relatórios acionado. Posso estruturar relatórios diários, semanais e executivos com análise estratégica."
}

return NextResponse.json({
reply: analysis,
status: "operational",
source: "NeuroTwin Operations Core"
})
}