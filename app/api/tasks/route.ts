export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// 🔹 GET - listar tarefas
export async function GET() {
try {
const tasks = await prisma.task.findMany()
return NextResponse.json(tasks)
} catch (error) {
console.error(error)
return NextResponse.json({ error: "erro" }, { status: 500 })
}
}

// 🔹 POST - criar tarefa
export async function POST(req: Request) {
try {
const body = await req.json()

const task = await prisma.task.create({
data: {
title: body.title,
status: body.status || "pending"
}
})

return NextResponse.json(task)
} catch (error) {
console.error(error)
return NextResponse.json({ error: "erro" }, { status: 500 })
}
}

// 🔹 PUT - atualizar tarefa
export async function PUT(req: Request) {
try {
const { id, title, status } = await req.json()

const task = await prisma.task.update({
where: { id },
data: {
title,
status
}
})

return NextResponse.json(task)
} catch (error) {
console.error(error)
return NextResponse.json({ error: "erro" }, { status: 500 })
}
}

// 🔹 DELETE - excluir tarefa
export async function DELETE(req: Request) {
try {
const { id } = await req.json()

await prisma.task.delete({
where: { id }
})

return NextResponse.json({ message: "Deletado com sucesso" })
} catch (error) {
console.error(error)
return NextResponse.json({ error: "erro" }, { status: 500 })
}
}