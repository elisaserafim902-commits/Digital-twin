import { NextResponse } from "next/server"

let graph:any[] = []

export async function GET(){
return NextResponse.json(graph)
}

export async function POST(req:Request){

const body = await req.json()

const link = {
id:Date.now(),
origem:body.origem,
destino:body.destino,
tipo:body.tipo
}

graph.push(link)

return NextResponse.json(link)
}