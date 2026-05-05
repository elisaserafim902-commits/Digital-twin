"use client"

import { signOut } from "next-auth/react"

export default function Navbar({ email }: { email?: string }) {
return (
<div className="w-full flex justify-between items-center p-4 bg-white border-b">
<span>{email}</span>

<button
onClick={() => signOut()}
className="bg-red-500 text-white px-3 py-1 rounded"
>
Sair
</button>
</div>
)
}