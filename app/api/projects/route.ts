import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function GET(){

const projects = await prisma.project.findMany()

return NextResponse.json(projects)

}

export async function POST(req:Request){

const data = await req.json()

const project = await prisma.project.create({
data:{
name:data.name
}
})

return NextResponse.json(project)

}