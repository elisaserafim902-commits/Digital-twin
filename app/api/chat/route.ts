import { NextResponse } from "next/server"

export async function POST(req: Request) {
const { message } = await req.json()
const texto = String(message || "").toLowerCase()

let reply = `ANÁLISE NEUROTWIN 2050

Comando recebido: ${message}

Situação:
Sistema operacional ativo.

Risco:
Baixo.

Recomendação:
Prosseguir com a análise estratégica e registrar o comando no núcleo operacional.`

if (texto.includes("relatório")) {
reply = `RELATÓRIO ESTRATÉGICO

Status:
NeuroTwin operacional.

Observatório:
Pronto para integração com dados globais.

Alertas:
Nenhum alerta crítico ativo.

Projetos:
Digital Twin, Vidraçaria Nazaré e Nexa em acompanhamento.

Recomendação:
Priorizar demonstração institucional e módulo de Observatório Global.`
}

if (texto.includes("governo")) {
reply = `ANÁLISE INSTITUCIONAL

O NeuroTwin 2050 pode ser apresentado como uma plataforma de inteligência estratégica para apoio à decisão pública.

Aplicações:
Defesa Civil, gestão urbana, monitoramento climático, projetos estratégicos, relatórios executivos e observatório global.

Próxima ação:
Estruturar demonstração com dashboard, alertas e relatórios.`
}

return NextResponse.json({ reply })
}