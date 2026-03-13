import { NextResponse } from "next/server"

let users:any[] = []

export async function GET(){

return NextResponse.json(users)

}

export async function POST(req:Request){

const body = await req.json()

const user = {
id:Date.now(),
email:body.email,
password:body.password
}

users.push(user)

return NextResponse.json(user)

}