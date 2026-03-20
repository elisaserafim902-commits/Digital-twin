import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET - listar tarefas
export async function GET() {
const tasks = await prisma.task.findMany({
orderBy: { createdAt: "desc" },
})
return NextResponse.json(tasks)
}

// POST - criar tarefa
export async function POST(req: Request) {
const body = await req.json()

const task = await prisma.task.create({
data: {
title: body.title,
status: "pending",
},
})

return NextResponse.json(task)
}