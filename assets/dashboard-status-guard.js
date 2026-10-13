(() => {
  const fmt=value=>new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(value)).replace(',',' ·');
  function latestSuccessfulStamp(){
    const meta=window.marketAgentUpdateMeta;
    const stamp=meta?.lastSuccessfulRunAt;
    if(!stamp||!Number.isFinite(new Date(stamp).getTime())||new Date(stamp).getTime()>Date.now()+60000)return null;
    return stamp;
  }
  function enforce(){
    const stamp=latestSuccessfulStamp(),formatted=stamp?fmt(stamp):null,text=document.getElementById('content-state'),chip=document.getElementById('content-state-chip');
    if(text){const label=formatted?`Inhalte: ${formatted}`:'Inhalte: Inhaltsstand nicht verifizierbar';if(text.textContent!==label)text.textContent=label;}
    if(chip){const status=formatted?window.marketAgentUpdateMeta?.status:'error';const cls=status==='ok'?'status-ok':status==='closed'?'status-closed':status==='error'?'status-error':'status-partial';chip.classList.remove('status-error','status-closed','status-ok','status-partial');chip.classList.add(cls)}
    const footer=document.querySelector('footer.shell');
    if(footer&&stamp){
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