(() => {
  const FLOOR_STAMP='2026-09-18T17:00:00+02:00';
  const floorMs=new Date(FLOOR_STAMP).getTime();
  const fmt=value=>new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(value)).replace(',',' ·');
  function latestSuccessfulStamp(){
    const stamps=[FLOOR_STAMP];
    if(window.marketAgentUpdateMeta?.contentUpdatedAt)stamps.push(window.marketAgentUpdateMeta.contentUpdatedAt);
    if(window.marketAgentUpdateMeta?.lastSuccessfulRunAt)stamps.push(window.marketAgentUpdateMeta.lastSuccessfulRunAt);
    // Per-holding checks do not prove a successfully published content run.
    const valid=stamps.map(value=>({value,ms:new Date(value).getTime()})).filter(x=>Number.isFinite(x.ms)&&x.ms>=floorMs).sort((a,b)=>b.ms-a.ms);
    return valid[0]?.value||FLOOR_STAMP;
  }
  function enforce(){
    const stamp=latestSuccessfulStamp(),formatted=fmt(stamp),text=document.getElementById('content-state'),chip=document.getElementById('content-state-chip');
    if(text&&text.textContent!==`Inhalte: ${formatted}`)text.textContent=`Inhalte: ${formatted}`;
    if(chip){const status=window.marketAgentUpdateMeta?.status;const cls=status==='ok'?'status-ok':status==='closed'?'status-closed':status==='error'?'status-error':'status-partial';chip.classList.remove('status-error','status-closed','status-ok','status-partial');chip.classList.add(cls)}
    const footer=document.querySelector('footer.shell');
    if(footer){
      const d=new Date(stamp),date=new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric'}).format(d),time=new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',hour:'2-digit',minute:'2-digit'}).format(d);
      const value=`Market Agent · Datenstand ${date} · ${time} · Quellen in jedem Eintrag`;
      if(footer.textContent!==value)footer.textContent=value;
    }
  }
  [0,100,500,1500,4000,8000,15000,21000,30000].forEach(delay=>setTimeout(enforce,delay));
  window.addEventListener('pageshow',()=>setTimeout(enforce,0));
  document.addEventListener('click',e=>{if(e.target.closest('.holding,.tab,.filter'))setTimeout(enforce,100)});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(enforce,0)});
})();