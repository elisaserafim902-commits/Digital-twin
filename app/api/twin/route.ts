import { NextResponse } from "next/server"

let analysis:any[] = []

export async function GET(){
return NextResponse.json(analysis)
}

export async function POST(req:Request){

const body = await req.json()

const result = {
id:Date.now(),
analise:body.analise
}

analysis.push(result)

return NextResponse.json(result)
}