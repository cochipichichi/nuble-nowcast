// LIVE data hooks
// Open‑Meteo (sin key) — series recientes últimas ~2h
export async function getNowcastLive(){
  const lat = -36.495, lon = -72.198;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation,wind_speed_10m&past_hours=2&forecast_hours=0&timezone=auto`;
  const r = await fetch(url);
  if(!r.ok) throw new Error('Open‑Meteo HTTP '+r.status);
  const j = await r.json();
  const n = j.hourly;
  const pickLast = (arr, N)=>arr.slice(-N);
  return {
    updated_at: new Date().toISOString(),
    series: {
      temp_c:  pickLast(n.temperature_2m, 10),
      rain_mm: pickLast(n.precipitation, 10),
      wind_ms: pickLast(n.wind_speed_10m.map(v=>v/3.6), 10)
    },
    labels: Array.from({length:10}, (_,i)=> i<9 ? `-${(9-i)*10}m` : 'ahora')
  };
}

// RainViewer — overlay en el mapa (ver map.html)
export async function getRainViewerTemplate(){
  const meta = await fetch('https://api.rainviewer.com/public/weather-maps.json').then(r=>r.json());
  const last = meta?.radar?.past?.at(-1);
  if(!last) throw new Error('RainViewer meta vacío');
  return `https://tilecache.rainviewer.com/v2/radar/${last.path}/256/{z}/{x}/{y}/2/1_1.png`;
}

// NASA FIRMS WMS — requiere MAP_KEY
export const FIRMS_MAP_KEY = ''; // <- coloca aquí tu MAP_KEY
export const FIRMS_WMS_BASE = 'https://firms.modaps.eosdis.nasa.gov/wms/';
export function getFIRMSUrl(layer='fires_modis_24'){
  if(!FIRMS_MAP_KEY) return null;
  return FIRMS_WMS_BASE + 'MODIS?MAP_KEY=' + FIRMS_MAP_KEY;
}
