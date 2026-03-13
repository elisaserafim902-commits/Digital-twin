import { NextResponse } from "next/server"

let state = {
energia:"media",
foco:"projeto principal",
projetos:3,
risco:"nenhum"
}

export async function GET(){
return NextResponse.json(state)
}

export async function POST(req:Request){

const body = await req.json()

state = body

return NextResponse.json(state)

}