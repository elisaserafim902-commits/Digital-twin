import { NextResponse } from "next/server"

export async function GET() {
return NextResponse.json({
status: "online",
paisesMonitorados: 187,
alertas: [
{ tipo: "Clima", nivel: "Moderado", local: "Sul do Brasil" },
{ tipo: "Terremotos", nivel: "Baixo", local: "Cinturão do Pacífico" },
{ tipo: "Vulcões", nivel: "Monitoramento", local: "Andes" },
{ tipo: "Economia", nivel: "Atenção", local: "Mercados globais" }
],
modulos: [
"Clima mundial",
"Terremotos",
"Vulcões",
"Satélites",
"Economia global",
"IA mundial",
"Energia",
"Infraestrutura"
]
})
}