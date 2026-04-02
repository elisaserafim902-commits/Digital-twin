"use client"

import Sidebar from "./Sidebar"
import Header from "./Header"

export default function LayoutShell({ children }: any) {
return (
<div className="flex bg-[#020617] min-h-screen text-white">

<Sidebar />

<div className="flex-1 flex flex-col">
<Header />

<main className="p-8">
{children}
</main>
</div>

</div>
)
}