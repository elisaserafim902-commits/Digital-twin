import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function GET() {
const memory = await prisma.memory.findMany()
return NextResponse.json(memory)
}

export async function POST(req: Request) {
const data = await req.json()

const item = await prisma.memory.create({
data: {
content: data.content
}
})

return NextResponse.json(item)
}