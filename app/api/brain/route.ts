import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export async function GET() {

const tasks = await prisma.task.findMany()
const projects = await prisma.project.findMany()
const memories = await prisma.memory.findMany()

let decision = "Sistema em análise."
let alert = "Nenhum alerta estratégico."

if (tasks.length > 7) {
alert = "Sobrecarga detectada. Reduza tarefas ou priorize."
}

if (projects.length === 0) {
decision = "Defina um projeto estratégico para orientar suas ações."
}

if (memories.length > 15) {
decision = "Base de conhecimento suficiente para decisões mais avançadas."
}

const brain = {
tasks: tasks.length,
projects: projects.length,
memories: memories.length,
decision,
alert
}

return NextResponse.json(brain)
}