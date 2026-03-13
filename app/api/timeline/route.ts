import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export async function GET() {
const timeline = await prisma.timeline.findMany({
orderBy: { date: "desc" }
})

return NextResponse.json(timeline)
}

export async function POST(req: Request) {
const body = await req.json()

const event = await prisma.timeline.create({
data: {
event: body.event,
date: new Date(body.date)
}
})

return NextResponse.json(event)
}