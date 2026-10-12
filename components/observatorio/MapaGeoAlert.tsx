"use client";
import { useEffect, useRef, useState } from "react";

type Props = {lat:number;lng:number;escalaKm:number;ampliado:boolean;modo:"mapa"|"satelite";titulo:string};
declare global {interface Window {L?: any}}
let loading:Promise<void>|null=null;
function carregarLeaflet():Promise<void>{
 if(typeof window==="undefined")return Promise.reject(new Error("Navegador indisponível"));
 if(window.L)return Promise.resolve();
 if(loading)return loading;
 loading=new Promise<void>((resolve,reject)=>{
  if(!document.querySelector('link[data-geo-leaflet]')){
   const css=document.createElement("link");css.rel="stylesheet";css.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";css.dataset.geoLeaflet="1";document.head.appendChild(css);
  }
  const script=document.createElement("script");script.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";script.async=true;
  script.onload=()=>window.L?resolve():reject(new Error("Leaflet não carregou"));
  script.onerror=()=>reject(new Error("Serviço cartográfico indisponível"));document.head.appendChild(script);
 }).catch(e=>{loading=null;throw e});
 return loading;
}
export default function MapaGeoAlert({lat,lng,escalaKm,ampliado,modo,titulo}:Props){
 const container=useRef<HTMLDivElement>(null);const map=useRef<any>(null);const layer=useRef<any>(null);
 const [erro,setErro]=useState(false);
 useEffect(()=>{let active=true;carregarLeaflet().then(()=>{
  if(!active||!container.current||map.current)return;
  const L=window.L;map.current=L.map(container.current,{zoomControl:true,scrollWheelZoom:false}).setView([lat,lng],10);
  L.circleMarker([lat,lng],{radius:9,color:"#fff",weight:2,fillColor:"#ff6b55",fillOpacity:.9}).addTo(map.current).bindTooltip("Localização reportada", {direction:"top"});
  setTimeout(()=>map.current?.invalidateSize(),100);
 }).catch(()=>{if(active)setErro(true)});
 return ()=>{active=false;map.current?.remove();map.current=null;layer.current=null};
 },[lat,lng]);
 useEffect(()=>{
  const L=window.L;if(!L||!map.current)return;
  if(layer.current)map.current.removeLayer(layer.current);
  layer.current=modo==="satelite"
   ? L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{maxZoom:19,attribution:"Tiles © Esri — World Imagery; provedores variáveis"})
   : L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap contributors"});
  layer.current.addTo(map.current);
 },[modo,erro]);
 useEffect(()=>{
  if(!map.current)return;
  const dlat=escalaKm/111.32,dlng=Math.min(170,escalaKm/Math.max(1,111.32*Math.cos(lat*Math.PI/180)));
  map.current.fitBounds([[Math.max(-85,lat-dlat),Math.max(-179,lng-dlng)],[Math.min(85,lat+dlat),Math.min(179,lng+dlng)]],{animate:false});
 },[lat,lng,escalaKm,erro]);
 useEffect(()=>{const t=setTimeout(()=>map.current?.invalidateSize(),100);return()=>clearTimeout(t)},[ampliado]);
 if(erro)return <div role="alert" style={{padding:18,color:"#fff"}}>Não foi possível carregar a camada interativa. Verifique a conexão.</div>;
 return <div ref={container} role="region" aria-label={`Mapa de ${titulo}`} style={{width:"100%",height:ampliado?"calc(100vh - 270px)":300,minHeight:280,borderRadius:10,background:"#c8d8e2",zIndex:0}}/>;
}
