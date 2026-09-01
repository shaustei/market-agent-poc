(() => {
  const FLOOR_STAMP = '2026-09-01T10:00:00+02:00';
  const floorMs = new Date(FLOOR_STAMP).getTime();
  const fmt = value => new Intl.DateTimeFormat('de-DE', {timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(value)).replace(',', ' ·');
  function enforceFloor(){
    const value = window.marketAgentUpdateMeta?.contentUpdatedAt;
    const ms = value ? new Date(value).getTime() : 0;
    if (Number.isFinite(ms) && ms >= floorMs) return;
    const text=document.getElementById('content-state');
    if(text) text.textContent=`Inhalte: ${fmt(FLOOR_STAMP)}`;
    const footer=document.querySelector('footer.shell');
    if(footer) footer.textContent='Market Agent · Datenstand 01.09.2026 · 10:00 · Quellen in jedem Eintrag';
  }
  [0,1500,3500,5500,8000].forEach(d=>setTimeout(enforceFloor,d));
  window.addEventListener('pageshow',enforceFloor);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)enforceFloor()});
})();
