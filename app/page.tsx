"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export default function Home() {
const { data: session } = useSession()

return (
<div>
{!session ? (
<button onClick={() => signIn("github")}>
Entrar com GitHub
</button>
) : (
<>
<p>Logado como {session.user?.email}</p>
<button onClick={() => signOut()}>
Sair
</button>
</>
)}
</div>
)
}