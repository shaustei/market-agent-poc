(() => {
  const s=document.createElement('script');
  s.src='/assets/dashboard-eu-20261005.js?v=20261005-1000';
  s.onerror=()=>{const c=document.getElementById('content-state-chip'),t=document.getElementById('content-state');if(c){c.classList.remove('status-ok','status-partial','status-closed');c.classList.add('status-error')}if(t)t.textContent='Inhalte: letzter erfolgreicher Stand 02.10.2026 · 17:00 · Aktualisierung fehlgeschlagen'};
  document.body.appendChild(s);
})();