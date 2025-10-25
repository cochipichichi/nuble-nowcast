// LIVE data hooks
// Comunas de Ñuble (aprox coords centro urbano)
export const COMMUNES = [
  {name:'Chillán', lat:-36.606, lon:-72.103},
  {name:'Chillán Viejo', lat:-36.634, lon:-72.131},
  {name:'San Nicolás', lat:-36.495, lon:-72.198},
  {name:'San Carlos', lat:-36.422, lon:-71.957},
  {name:'Coihueco', lat:-36.618, lon:-71.825},
  {name:'Quirihue', lat:-36.283, lon:-72.535},
  {name:'Cobquecura', lat:-36.135, lon:-72.792},
  {name:'Bulnes', lat:-36.742, lon:-72.298},
  {name:'Yungay', lat:-37.117, lon:-72.010},
  {name:'Pinto', lat:-36.732, lon:-71.892},
  {name:'Ñiquén', lat:-36.221, lon:-71.820},
  {name:'San Fabián', lat:-36.550, lon:-71.550},
  {name:'El Carmen', lat:-36.900, lon:-72.023},
  {name:'Pemuco', lat:-37.091, lon:-72.101},
  {name:'Quillón', lat:-36.739, lon:-72.470}
];

// Open-Meteo (sin key) — series recientes últimas ~2h
export async function getNowcastLive(lat=-36.495, lon=-72.198){
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation,wind_speed_10m,wind_gusts_10m&past_hours=2&forecast_hours=0&timezone=auto`;
  const r = await fetch(url);
  if(!r.ok) throw new Error('Open-Meteo HTTP '+r.status);
  const j = await r.json();
  const n = j.hourly;
  const pickLast = (arr, N)=>arr.slice(-N);
  return {
    updated_at: new Date().toISOString(),
    series: {
      temp_c:  pickLast(n.temperature_2m, 10),
      rain_mm: pickLast(n.precipitation, 10),
      wind_ms: pickLast(n.wind_speed_10m.map(v=>v/3.6), 10) // km/h -> m/s
    },
    labels: Array.from({length:10}, (_,i)=> i<9 ? `-${(9-i)*10}m` : 'ahora')
  };
}

// Ráfagas últimas 24h (sparkline)
export async function getGustsLive(lat=-36.495, lon=-72.198){
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=wind_gusts_10m&past_hours=24&forecast_hours=0&timezone=auto`;
  const r = await fetch(url);
  if(!r.ok) throw new Error('Open-Meteo gusts HTTP '+r.status);
  const j = await r.json();
  const arr = (j.hourly?.wind_gusts_10m||[]).map(x=>x/3.6); // km/h -> m/s
  return { values: arr, max: Math.max(...arr, 0) };
}

// RainViewer — overlay en el mapa
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
