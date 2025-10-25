export const $ = (s,el=document)=>el.querySelector(s);
export const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
export const setTheme = (t)=>{ document.documentElement.setAttribute('data-theme', t); localStorage.setItem('theme', t); };
export const initTheme = ()=> setTheme(localStorage.getItem('theme')||'dark');
export const toast = (msg)=>{ const el=document.createElement('div'); el.className='card'; el.style.position='fixed'; el.style.bottom='16px'; el.style.right='16px'; el.textContent=msg; document.body.appendChild(el); setTimeout(()=>el.remove(),2200); };
