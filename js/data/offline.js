export async function getNowcast(){ return fetch('../data/nowcast.json').then(r=>r.json()); }
export async function getAlerts(){ return fetch('../data/alerts.json').then(r=>r.json()); }
export async function getLayers(){ return fetch('../data/layers.geojson').then(r=>r.json()); }
