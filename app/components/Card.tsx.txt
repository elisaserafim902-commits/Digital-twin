export default function Card({ children }: any) {
return (
<div style={{
background: "#0f172a",
padding: 20,
borderRadius: 12,
color: "#fff",
boxShadow: "0 0 20px rgba(0,0,0,0.3)"
}}>
{children}
</div>
)
}