import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export async function GET() {

const tasks = await prisma.task.findMany()
const projects = await prisma.project.findMany()
const memories = await prisma.memory.findMany()

let insight = "Sistema está observando padrões."

if (tasks.length > 5) {
insight = "Alta carga de tarefas. Considere priorizar ou eliminar tarefas de baixo impacto."
}

if (projects.length === 0) {
insight = "Nenhum projeto estratégico ativo. Definir um objetivo pode melhorar foco."
}

if (memories.length > 10) {
insight = "Memória rica detectada. O Twin já possui base para análise estratégica."
}

const evolution = {
tasks: tasks.length,
projects: projects.length,
memories: memories.length,
insight
}

retur