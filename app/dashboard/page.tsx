return (
<div
style={{
background:"#05070f",
color:"white",
minHeight:"100vh",
padding:40,
fontFamily:"Arial"
}}
>

<h1 style={{fontSize:48}}>
NeuroTwin 2050
</h1>

<h2>Sistema Neural Inteligente</h2>

<div
style={{
display:"flex",
justifyContent:"center",
marginTop:30,
marginBottom:30
}}
>

<img
src="/neuro-avatar.svg"
alt="NeuroTwin Avatar"
style={{
width:320,
height:320,
borderRadius:"50%",
boxShadow:"0 0 80px #00d5ff",
animation:"pulse 2s infinite"
}}
/>

</div>

<br/>

<button
onClick={ouvir}
style={{
fontSize:28,
padding:"18px 40px",
borderRadius:15,
background:"#0b84ff",
color:"white",
border:"none",
cursor:"pointer"
}}
>
🎙 Conversar
</button>

<br/>
<br/>

<h3>Você disse:</h3>

<div
style={{
fontSize:24,
color:"#7de3ff"
}}
>
{texto}
</div>

<br/>

<h3>NeuroBot respondeu:</h3>

<div
style={{
fontSize:26,
lineHeight:1.7,
background:"#101827",
padding:30,
borderRadius:15
}}
>
{resposta}
</div>

<style jsx>{`
@keyframes pulse{
0%{
transform:scale(1);
filter:drop-shadow(0 0 10px #00d5ff);
}
50%{
transform:scale(1.03);
filter:drop-shadow(0 0 40px #00d5ff);
}
100%{
transform:scale(1);
filter:drop-shadow(0 0 10px #00d5ff);
}
}
`}</style>

</div>
);