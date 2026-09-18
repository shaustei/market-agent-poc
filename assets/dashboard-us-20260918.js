(() => {
  const STAMP='2026-09-18T17:00:00+02:00';
  const CHECKED=new Set(['CAT','JBL','LMT','MCD','AMZN','MEDP','NTAP','RNG']);
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const fmt=v=>new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(v)).replace(',',' ·');
  async function boot(){for(let i=0;i<80;i++){if(Array.isArray(window.holdings||holdings)&&typeof renderCards==='function')break;await sleep(150)}window.marketAgentUpdateMeta={contentUpdatedAt:STAMP,lastSuccessfulRunAt:STAMP,status:'partial',marketStatus:'US open',holdingsFallback:true};if(Array.isArray(holdings))holdings.forEach(h=>{if(CHECKED.has(h.id)){h.lastCheckedAt=STAMP;h.changedSections=h.changedSections||[];h.updateStatus='checked'}});const mark=()=>{const c=document.getElementById('content-state-chip'),t=document.getElementById('content-state');if(c&&t){t.textContent=`Inhalte: ${fmt(STAMP)}`;c.classList.remove('status-ok','status-error','status-closed');c.classList.add('status-partial');c.title='Holdings-Datei nicht erreichbar – letzter bestätigter Bestand verwendet.'}const f=document.querySelector('footer.shell');if(f)f.textContent='Market Agent · Datenstand 18.09.2026 · 17:00 · Quellen in jedem Eintrag'};mark();[500,1500,4000,8000,15000].forEach(ms=>setTimeout(mark,ms));}
  boot();
})();