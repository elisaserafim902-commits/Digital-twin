import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Foco = { id: string; latitude: number; longitude: number; data: string | null; satelite: string | null; municipio: string | null; estado: string | null; fonte: "INPE" };

function parseCSV(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = "", quoted = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === '"') {
      if (quoted && input[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (c === "," && !quoted) { row.push(field); field = ""; }
    else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && input[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some(x => x.trim())) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

export async function GET() {
  const url = process.env.INPE_FOCOS_CSV_URL;
  if (!url) return NextResponse.json({
    status: "nao_configurado", fonte: "INPE - Programa Queimadas",
    mensagem: "Configure INPE_FOCOS_CSV_URL com uma URL HTTPS oficial de CSV de focos do INPE.",
    focos: [], total: 0, atualizadoEm: new Date().toISOString()
  }, { headers: { "Cache-Control": "no-store" } });

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || !(
      parsed.hostname === "inpe.br" || parsed.hostname.endsWith(".inpe.br")
    )) throw new Error("Fonte deve estar hospedada em dominio oficial inpe.br");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    let response: Response;
    try { response = await fetch(parsed.toString(), { signal: controller.signal, cache: "no-store" }); }
    finally { clearTimeout(timeout); }
    if (!response.ok) throw new Error("INPE HTTP " + response.status);
    const text = await response.text();
    if (text.length > 5_000_000) throw new Error("Arquivo excede limite de processamento");
    const rows = parseCSV(text.replace(/^\uFEFF/, ""));
    const header = (rows.shift() || []).map(s => s.trim().toLowerCase());
    const index = (...names: string[]) => header.findIndex(h => names.includes(h));
    const lat = index("lat", "latitude"), lon = index("lon", "longitude", "long");
    if (lat < 0 || lon < 0) throw new Error("CSV INPE sem colunas latitude/longitude");
    const date = index("data_hora_gmt", "data_hora", "data", "datahora");
    const sat = index("satelite", "satélite"), city = index("municipio", "município"), state = index("estado", "uf");
    const get = (r: string[], i: number) => i < 0 ? null : (r[i]?.trim() || null);
    const focos: Foco[] = rows.slice(0, 10000).map((r, i) => ({
      id: "inpe-" + i + "-" + (get(r, date) || ""),
      latitude: Number(r[lat]), longitude: Number(r[lon]),
      data: get(r, date), satelite: get(r, sat), municipio: get(r, city), estado: get(r, state), fonte: "INPE" as const
    })).filter(f => Number.isFinite(f.latitude) && Math.abs(f.latitude) <= 90 && Number.isFinite(f.longitude) && Math.abs(f.longitude) <= 180);
    return NextResponse.json({
      status: "online", fonte: "INPE - Programa Queimadas", modalidade: "dados_publicados_na_fonte",
      transmissaoAoVivo: false, focos, total: focos.length, limite: 10000,
      atualizadoEm: new Date().toISOString()
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({
      status: "offline", fonte: "INPE - Programa Queimadas",
      mensagem: e instanceof Error ? e.message : "Erro ao consultar INPE",
      focos: [], total: 0, atualizadoEm: new Date().toISOString()
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
