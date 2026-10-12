"use client";

import { useState } from "react";
import MapaGeoAlert from "./MapaGeoAlert";

type Props = {lat:number;lng:number;titulo:string;severidade?:number;nivelAlerta?:string;fonte?:string;horario?:string|number;tipo?:string;magnitude?:number;proximos?:{id:string;titulo:string;fonte:string;distanciaKm:number}[];onClose:()=>void};
export default function GeoAlertExplorer({lat,lng,titulo,severidade,nivelAlerta,fonte,horario,tipo,magnitude,proximos=[],onClose}:Props){
const [ampliado, setAmpliado] = useState(false);
const [escalaKm, setEscalaKm] = useState<5 | 25 | 100>(25);
const [modo,setModo] = useState<"mapa"|"satelite">("mapa");
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
<section aria-label="Análise geográfica" style={{padding:12,background:"#081f32",border:"1px solid #244c65",borderRadius:10,marginBottom:12}}>
<strong style={{color:"#8de8ff",fontSize:12}}>ANÁLISE GEOGRÁFICA · DADOS OBSERVADOS</strong>
<p style={{fontSize:12,margin:"8px 0"}}>Tipo: {tipo || "Não informado"}{typeof magnitude==="number" && Number.isFinite(magnitude) ? ` · Magnitude: ${magnitude.toFixed(1)}` : ""}</p>
<p style={{fontSize:12,margin:"6px 0"}}>Registro: {horario && !Number.isNaN(new Date(horario).getTime()) ? new Date(horario).toLocaleString("pt-BR") : "Horário não disponível"}</p>
<p style={{fontSize:12,margin:"6px 0"}}>Eventos adicionais próximos (até 100 km): <strong>{proximos.length}</strong></p>
{proximos.length>0 && <ul style={{paddingLeft:18,margin:"8px 0",fontSize:11,lineHeight:1.7}}>{proximos.slice(0,5).map(e=><li key={e.id}>{e.titulo} · {e.distanciaKm.toFixed(1)} km · {e.fonte}</li>)}</ul>}
<p style={{fontSize:10,color:"#aac3d2",lineHeight:1.5,margin:"8px 0 0"}}>Distâncias calculadas entre coordenadas reportadas. Contagem limitada aos eventos carregados no observatório, não representa cobertura completa, correlação causal nem estimativa de impacto.</p>
</section>
<div aria-label="Escala de exploração" style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:10}}><span style={{fontSize:11,color:"#9ab8cc"}}>Área de visualização:</span>{([5,25,100] as const).map(km => <button key={km} type="button" aria-pressed={escalaKm === km} onClick={() => setEscalaKm(km)} style={{cursor:"pointer",padding:"6px 10px",borderRadius:8,border:"1px solid #39748e",background:escalaKm===km?"#176e90":"#0a3047",color:"#fff",fontSize:11}}>{km} km</button>)}</div>
<div style={{display:"flex",gap:8,marginBottom:10}}><button type="button" aria-pressed={modo==="mapa"} onClick={()=>setModo("mapa")} style={{cursor:"pointer",padding:"7px 12px",borderRadius:8,background:modo==="mapa"?"#176e90":"#0a3047",color:"#fff",border:"1px solid #39748e"}}>Mapa</button><button type="button" aria-pressed={modo==="satelite"} onClick={()=>setModo("satelite")} style={{cursor:"pointer",padding:"7px 12px",borderRadius:8,background:modo==="satelite"?"#176e90":"#0a3047",color:"#fff",border:"1px solid #39748e"}}>Satélite</button></div>
<MapaGeoAlert lat={lat} lng={lng} escalaKm={escalaKm} ampliado={ampliado} modo={modo} titulo={titulo}/>
<p style={{fontSize:10,lineHeight:1.5,color:"#a6b9c9"}}>Cartografia: OpenStreetMap (mapa) e Esri World Imagery (satélite). Imagens de datas variáveis, sem garantia de atualização em tempo real. Os botões alteram a extensão aproximada do mapa, não representam raio de impacto. Marcador: coordenada reportada pela fonte; não representa área de risco. A prioridade é uma triagem informativa e não substitui alertas oficiais. O mapa requer conexão externa para carregar.</p>
</section>;
}
