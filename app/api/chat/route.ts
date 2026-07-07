import { NextResponse } from "next/server"

export async function POST(req: Request) {
const { message } = await req.json()

const response = await fetch("http://localhost:3000/api/operations", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ message }),
})

const data = await response.json()

return NextResponse.json({
reply: data.reply,
})
}