import NeuroBot from "@/components/NeuroBot"

export default function Home() {
return (
<main className="min-h-screen bg-[#020617] text-white">

<div className="container mx-auto py-20">

<h1 className="text-7xl font-bold text-center">
NeuroTwin
</h1>

<p className="text-center text-gray-400 mt-4 text-xl">
Plataforma Inteligente de Digital Twin
</p>

<div className="flex justify-center mt-16">
<NeuroBot />
</div>

<div className="flex justify-center gap-6 mt-12">

<a
href="/login"
className="bg-cyan-500 px-8 py-4 rounded-xl"
>
Entrar
</a>

<a
href="/register"
className="border border-cyan-500 px-8 py-4 rounded-xl"
>
Criar Conta
</a>

</div>

</div>

</main>
)
}