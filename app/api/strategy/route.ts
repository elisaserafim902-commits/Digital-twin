import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function GET() {

const tasks = await prisma.task.findMany({
where:{ status:"open" }
})

const projects = await prisma.project.findMany()

const memories = await prisma.memory.findMany()

let priority = "Nenhuma tarefa registrada"
let focus = "Organizar o dia"

if(tasks.length > 0){
priority = tasks[0].title
}

if(tasks.length > 3){
focus = "Alta execução"
}else if(projects.length > 0){
focus = "Avançar projetos"
}

const strategy = {
activeProjects: projects.length,
openTasks: tasks.length,
memories: memories.length,
priorityToday: priority,
energy: tasks.length > 5 ? "alta" : "média",
focus
}

return NextResponse.json(strategy)

}