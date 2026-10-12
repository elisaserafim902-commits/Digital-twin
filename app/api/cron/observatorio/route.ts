import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Autonomous Core v0.1 — execução programada e supervisionável.
 * Não envia alertas nem persiste histórico até haver armazenamento confiável.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({status:"nao_configurado",erro:"CRON_SECRET ausente"},{status:503});
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({erro:"Não autorizado"},{status:401});
  }
  const started = Date.now();
  try {
    const response = await fetch(new URL("/api/observatorio", request.url), {
      cache:"no-store",
      signal:AbortSignal.timeout(24000),
      headers:{"accept":"application/json"}
    });
    if (!response.ok) throw new Error(`Observatório HTTP ${response.status}`);
    const data = await response.json();
    const fontes = data?.fontes || {};
    const resumo = data?.resumo || {};
    const verificadas = ["usgs","nasaEonet","gdacs"].map(nome=>({
      nome,
      status: fontes[nome]?.status || "desconhecido",
      atualizadoEm: fontes[nome]?.atualizadoEm || null
    }));
    const operacionais = verificadas.filter(f=>f.status==="online").length;
    const status = operacionais===3?"operacional":operacionais>0?"degradado":"indisponivel";
    const resultado = {
      modulo:"NeuroTwin Autonomous Core",
      versao:"0.1",
      executadoEm:new Date().toISOString(),
      duracaoMs:Date.now()-started,
      status,
      fontes:verificadas,
      resumo,
      eventosExibidos:data?.geo?.total ?? null,
      limitacoes:"Verificação pontual. Não armazena histórico, não envia notificações e não comprova atividade ao vivo."
    };
    console.info("[NeuroTwin Autonomous Core]",JSON.stringify(resultado));
    return NextResponse.json(resultado,{status:status==="indisponivel"?503:200,headers:{"Cache-Control":"no-store"}});
  } catch(error) {
    console.error("[NeuroTwin Autonomous Core] Falha:",error);
    return NextResponse.json({modulo:"NeuroTwin Autonomous Core",status:"falha",executadoEm:new Date().toISOString(),erro:"Falha ao consultar o observatório"},{status:503});
  }
}
