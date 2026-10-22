"use client";

import { useMemo, useState } from "react";

type Props = { lat: number; lng: number; title?: string };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function MapaSatelite({ lat, lng, title = "Ponto geográfico" }: Props) {
  const [zoom, setZoom] = useState(11);
  const latitude = clamp(lat, -85.05112878, 85.05112878);
  const longitude = ((lng + 180) % 360 + 360) % 360 - 180;
  const tiles = useMemo(() => {
    const n = 2 ** zoom;
    const latRad = (latitude * Math.PI) / 180;
    const x = ((longitude + 180) / 360) * n;
    const y = (1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2 * n;
    const tileX = Math.floor(x);
    const tileY = Math.floor(y);
    const offsetX = (x - tileX) * 256;
    const offsetY = (y - tileY) * 256;
    return Array.from({ length: 25 }, (_, index) => {
      const dx = (index % 5) - 2;
      const dy = Math.floor(index / 5) - 2;
      const tx = ((tileX + dx) % n + n) % n;
      const ty = tileY + dy;
      return {
        key: `${zoom}-${tx}-${ty}`,
        url: ty < 0 || ty >= n ? "" : `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${ty}/${tx}`,
        left: dx * 256 - offsetX,
        top: dy * 256 - offsetY,
      };
    });
  }, [latitude, longitude, zoom]);

  return (
    <section style={{ marginTop: 14, padding: 12, background: "#071b32", border: "1px solid #24618c", borderRadius: 12 }}>
      <strong style={{ display: "block", marginBottom: 7 }}>Imagem de satélite — {title}</strong>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <button type="button" onClick={() => setZoom(z => clamp(z - 1, 2, 17))} style={button}>−</button>
        <span style={{ fontSize: 12 }}>Zoom {zoom}</span>
        <button type="button" onClick={() => setZoom(z => clamp(z + 1, 2, 17))} style={button}>+</button>
      </div>
      <div aria-label="Imagem de satélite centralizada nas coordenadas selecionadas" style={{ height: 280, position: "relative", overflow: "hidden", background: "#07101c", borderRadius: 9 }}>
        {tiles.map(tile => tile.url && (
          <img key={tile.key} src={tile.url} alt="" loading="lazy" draggable={false}
            style={{ position: "absolute", width: 256, height: 256, maxWidth: "none", left: `calc(50% + ${tile.left}px)`, top: `calc(50% + ${tile.top}px)`, pointerEvents: "none" }} />
        ))}
        <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", color: "#00f5ff", fontSize: 28, textShadow: "0 0 5px black" }}>⊕</div>
      </div>
      <p style={{ fontSize: 11, lineHeight: 1.4, margin: "8px 0 0", color: "#abc8dd" }}>
        Coordenadas: {lat.toFixed(5)}, {lng.toFixed(5)}. Imagens: Esri World Imagery e seus fornecedores.
        Data de captura e atualização não fornecida nesta visualização; não representa transmissão ao vivo.
        O marcador indica a coordenada reportada, não necessariamente a área de maior impacto.
      </p>
    </section>
  );
}
