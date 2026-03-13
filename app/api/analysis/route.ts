import { NextResponse } from "next/server"

let insights:any[] = []

export async function GET(){

return NextResponse.json(insights)

}

export async function POST(req:Request){

const body = await req.json()

const insight = {
id:Date.now(),
texto:body.texto
}

insights.push(insight)

return NextResponse.json(insight)

}