(() => {
  const fmt = value => new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(new Date(value)).replace(',', ' ·');

  function latestStamp() {
    const stamps = [];
    for (const h of (window.holdings || [])) {
      if (h.lastCheckedAt) stamps.push(h.lastCheckedAt);
      if (h.lastChangedAt) stamps.push(h.lastChangedAt);
    }
    if (window.marketAgentUpdateMeta?.contentUpdatedAt) stamps.push(window.marketAgentUpdateMeta.contentUpdatedAt);
    return stamps
      .filter(Boolean)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] || null;
  }

  function enforceLatestStatus() {
    const stamp = latestStamp();
    if (!stamp) return;
    const text = document.getElementById('content-state');
    if (text) text.textContent = `Inhalte: ${fmt(stamp)}`;
    const footer = document.querySelector('footer.shell');
    if (footer) {
      const d = new Date(stamp);
      const date = new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
      const time = new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' }).format(d);
      footer.textContent = `Market Agent · Datenstand ${date} · ${time} · Quellen in jedem Eintrag`;
    }
  }

  function install() {
    const baseCards = window.renderCards;
    if (typeof baseCards === 'function') {
      window.renderCards = function(...args) {
        const result = baseCards.apply(this, args);
        enforceLatestStatus();
        return result;
      };
    }
    const baseDetail = window.renderDetail;
    if (typeof baseDetail === 'function') {
      window.renderDetail = function(...args) {
        const result = baseDetail.apply(this, args);
        enforceLatestStatus();
        return result;
      };
    }
    enforceLatestStatus();
    window.addEventListener('pageshow', enforceLatestStatus);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) enforceLatestStatus(); });
  }

  setTimeout(install, 7000);
})();
