import { NextResponse } from "next/server";
import { consultarGDACS } from "../../../lib/providers/gdacs";

export const dynamic = "force-dynamic";

export async function GET() {
const resultado = await consultarGDACS();

return NextResponse.json(resultado);
}