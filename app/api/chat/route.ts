import { NextResponse } from "next/server"

export async function POST(req: Request) {
const { message } = await req.json()

const texto = message?.toLowerCase() || ""

let reply = "Entendido, Elisa. Estou analisando sua solicitação."

if (texto.includes("clima") || texto.includes("previsão")) {
reply = "Elisa, para previsão real do clima, o próximo passo é conectar uma API meteorológica. Por enquanto, o módulo de voz e resposta está funcionando."
}

if (texto.includes("oportunidade")) {
reply = "Detectei busca por oportunidades. Vou preparar o radar de tendências, negócios e investimentos."
}

if (texto.includes("relatório")) {
reply = "Posso estruturar relatórios automáticos com resumo, análise e próximos passos."
}

return NextResponse.json({ reply })
}