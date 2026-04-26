import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const session=await getServerSession(authOptions)

const projects = await prisma.project.findMany({
where:{
companyId: session.user.companyId
}
})