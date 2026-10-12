"use client";

import { useState } from "react";

type Props = {lat:number;lng:number;titulo:string;severidade?:number;nivelAlerta?:string;fonte?:string;onClose:()=>void};
export default function GeoAlertExplorer({lat,lng,titulo,severidade,nivelAlerta,fonte,onClose}:Props){
const [ampliado, setAmpliado] = useState(false);
const [escalaKm, setEscalaKm] = useState<5 | 25 | 100>(25);
const valid = Number.isFinite(lat)&&Number.isFinite(lng)&&Math.abs(lat)<=90&&Math.abs(lng)<=180;
if(!valid)return <p>Coordenadas indisponíveis para este evento.</p>;
const oficial = String(nivelAlerta || "").toLowerCase();
const prioridade = oficial === "red" ? "CRÍTICA · GDACS" : oficial === "orange" ? "ELEVADA · GDACS" : (severidade ?? 0) >= 8 ? "ELEVADA · TRIAGEM INTERNA" : "MONITORAMENTO · TRIAGEM INTERNA";
const destaque = oficial === "red" ? "#ff6262" : oficial === "orange" || (severidade ?? 0) >= 8 ? "#ffbb63" : "#8de8ff";
const deltaLat = escalaKm / 111.32;
const deltaLng = Math.min(179, escalaKm / Math.max(0.01, 111.32 * Math.cos(lat * Math.PI / 180)));
const bbox=[Math.max(-180,lng-deltaLng),Math.max(-90,lat-deltaLat),Math.min(180,lng+deltaLng),Math.min(90,lat+deltaLat)].join(",");
const url=`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(lat+","+lng)}`;
return <section aria-label="GeoAlert Explorer" style={ampliado ? {position:"fixed",inset:12,zIndex:10000,padding:16,border:"1px solid #266b91",borderRadius:14,background:"#061b2b",overflowY:"auto"} : {marginTop:14,padding:12,border:"1px solid #266b91",borderRadius:14,background:"#061b2b"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:10}}>
<strong style={{fontSize:12,color:"#8de8ff"}}>GEOALERT EXPLORER · MAPA INTEGRADO</strong>
<div style={{display:"flex",gap:8}}><button type="button" onClick={() => setAmpliado(v => !v)} aria-pressed={ampliado} style={{cursor:"pointer",background:"#124365",color:"#fff",border:"1px solid #41718d",borderRadius:7,padding:"5px 9px"}}>{ampliado ? "Reduzir" : "Ampliar mapa"}</button><button type="button" onClick={onClose} aria-label="Fechar mapa detalhado" style={{cursor:"pointer",background:"#12334c",color:"#fff",border:"1px solid #41718d",borderRadius:7,padding:"5px 9px"}}>Fechar</button></div>
</div>
<div role="status" style={{borderLeft:`4px solid ${destaque}`,padding:"8px 10px",background:"#092c40",marginBottom:10,borderRadius:6}}><strong style={{fontSize:12,color:destaque}}>● {prioridade}</strong><p style={{fontSize:11,margin:"6px 0 0"}}>{titulo} · {lat.toFixed(4)}, {lng.toFixed(4)} · Fonte: {fonte || "não informada"}</p></div>
<div aria-label="Escala de exploração" style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:10}}><span style={{fontSize:11,color:"#9ab8cc"}}>Área de visualização:</span>{([5,25,100] as const).map(km => <button key={km} type="button" aria-pressed={escalaKm === km} onClick={() => setEscalaKm(km)} style={{cursor:"pointer",padding:"6px 10px",borderRadius:8,border:"1px solid #39748e",background:escalaKm===km?"#176e90":"#0a3047",color:"#fff",fontSize:11}}>{km} km</button>)}</div>
<iframe title={`Mapa detalhado: ${titulo}`} src={url} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{width:"100%",height:ampliado ? "calc(100vh - 190px)" : 280,minHeight:ampliado ? 360 : 280,border:0,borderRadius:10,background:"#dce5e9"}}/>
<p style={{fontSize:10,lineHeight:1.5,color:"#a6b9c9"}}>Cartografia © colaboradores do OpenStreetMap. Os botões alteram a extensão aproximada do mapa, não representam raio de impacto. Marcador: coordenada reportada pela fonte; não representa área de risco. A prioridade é uma triagem informativa e não substitui alertas oficiais. O mapa requer conexão externa para carregar.</p>
</section>;
}
