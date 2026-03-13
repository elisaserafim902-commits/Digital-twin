type CardProps = {
titulo: string
valor: string | number
}

export default function Card({ titulo, valor }: CardProps) {

return (

<div style={{
padding:20,
background:"#f5f5f5",
borderRadius:10,
boxShadow:"0 2px 8px rgba(0,0,0,0.05)"
}}>

<h3>{titulo}</h3>

<p style={{fontSize:24,fontWeight:"bold"}}>
{valor}
</p>

</div>

)

}