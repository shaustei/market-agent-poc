(() => {
  const FLOOR_STAMP = '2026-09-01T10:00:00+02:00';
  const floorMs = new Date(FLOOR_STAMP).getTime();
  const fmt = value => new Intl.DateTimeFormat('de-DE', {
    timeZone:'Europe/Berlin', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'
  }).format(new Date(value)).replace(',', ' ·');

  function latestSuccessfulStamp() {
    const stamps = [];
    if (window.marketAgentUpdateMeta?.contentUpdatedAt) stamps.push(window.marketAgentUpdateMeta.contentUpdatedAt);
    if (window.marketAgentUpdateMeta?.lastSuccessfulRunAt) stamps.push(window.marketAgentUpdateMeta.lastSuccessfulRunAt);
    if (typeof holdings !== 'undefined' && Array.isArray(holdings)) {
      holdings.forEach(h => {
        if (h?.lastCheckedAt) stamps.push(h.lastCheckedAt);
        if (h?.lastChangedAt) stamps.push(h.lastChangedAt);
      });
    }
    const valid = stamps
      .map(value => ({value, ms:new Date(value).getTime()}))
      .filter(x => Number.isFinite(x.ms) && x.ms >= floorMs)
      .sort((a,b) => b.ms - a.ms);
    return valid[0]?.value || FLOOR_STAMP;
  }

  function enforceLatestStatus() {
    const stamp = latestSuccessfulStamp();
    const text = document.getElementById('content-state');
    const chip = document.getElementById('content-state-chip');
    if (text) text.textContent = `Inhalte: ${fmt(stamp)}`;
    if (chip) {
      chip.classList.remove('status-error','status-closed');
      const status = window.marketAgentUpdateMeta?.status;
      chip.classList.toggle('status-ok', status === 'ok');
      chip.classList.toggle('status-partial', status !== 'ok');
    }
    const footer = document.querySelector('footer.shell');
    if (footer) {
      const d = new Date(stamp);
      const date = new Intl.DateTimeFormat('de-DE', {timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric'}).format(d);
      const time = new Intl.DateTimeFormat('de-DE', {timeZone:'Europe/Berlin',hour:'2-digit',minute:'2-digit'}).format(d);
      footer.textContent = `Market Agent · Datenstand ${date} · ${time} · Quellen in jedem Eintrag`;
    }
  }

  [0,1500,3500,5500,8000,10000,12000,14000,18000].forEach(delay => setTimeout(enforceLatestStatus, delay));
  window.addEventListener('pageshow', () => setTimeout(enforceLatestStatus, 0));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) setTimeout(enforceLatestStatus, 0); });
  document.addEventListener('click', event => {
    if (event.target.closest('.holding,.tab,.filter')) setTimeout(enforceLatestStatus, 0);
  });
})();
