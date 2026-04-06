export default function Card({ title, value }: any) {
return (
<div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
<p className="text-gray-400">{title}</p>
<h3 className="text-white text-2xl mt-2">{value}</h3>
</div>
)
} 
