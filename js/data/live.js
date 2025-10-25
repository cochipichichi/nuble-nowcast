
export const COMMUNES=[{name:'San Nicolás',lat:-36.495,lon:-72.198},{name:'Chillán',lat:-36.606,lon:-72.103}];
export async function getNowcastLive(lat=-36.495,lon=-72.198){
  const u=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation,wind_speed_10m,wind_gusts_10m&past_hours=2&forecast_hours=0&timezone=auto`;
  const j=await (await fetch(u)).json(); const n=j.hourly; const L=a=>a.slice(-10);
  return {updated_at:new Date().toISOString(),series:{temp_c:L(n.temperature_2m),rain_mm:L(n.precipitation),wind_ms:L(n.wind_speed_10m.map(v=>v/3.6))},labels:Array.from({length:10},(_,i)=>i<9?`-${(9-i)*10}m`:'ahora')};
}
export async function getGustsLive(lat=-36.495,lon=-72.198){
  const u=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=wind_gusts_10m&past_hours=24&forecast_hours=0&timezone=auto`;
  const j=await (await fetch(u)).json(); const arr=(j.hourly?.wind_gusts_10m||[]).map(x=>x/3.6); return {values:arr,max:Math.max(...arr,0)};
}
export async function getHistoryLive(lat=-36.495,lon=-72.198){
  const u=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation,wind_gusts_10m&past_days=7&forecast_hours=0&timezone=auto`;
  const j=await (await fetch(u)).json(); const h=j.hourly; const days={};
  for(let i=0;i<h.time.length;i++){ const d=new Date(h.time[i]).toISOString().slice(0,10); days[d]??={precip:0,tempSum:0,tempN:0,gustMax:0}; days[d].precip+=(h.precipitation[i]||0); days[d].tempSum+=(h.temperature_2m[i]||0); days[d].tempN++; const g=(h.wind_gusts_10m[i]||0)/3.6; if(g>days[d].gustMax) days[d].gustMax=g; }
  const labels=Object.keys(days).sort();
  return {labels,precip:labels.map(d=>+days[d].precip.toFixed(2)),gustMax:labels.map(d=>+days[d].gustMax.toFixed(1)),tempAvg:labels.map(d=>+(days[d].tempSum/days[d].tempN).toFixed(1))};
}
export async function getRainViewerTemplate(){ const m=await (await fetch('https://api.rainviewer.com/public/weather-maps.json')).json(); const last=m?.radar?.past?.at(-1); return `https://tilecache.rainviewer.com/v2/radar/${last.path}/256/{z}/{x}/{y}/2/1_1.png`; }
export const FIRMS_MAP_KEY=''; export const FIRMS_WMS_BASE='https://firms.modaps.eosdis.nasa.gov/wms/'; export function getFIRMSUrl(){ return FIRMS_MAP_KEY?FIRMS_WMS_BASE+'MODIS?MAP_KEY='+FIRMS_MAP_KEY:null; }
