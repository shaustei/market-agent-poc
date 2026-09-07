(() => {
  const STAMP = '2026-09-07T17:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-05-07';
  const CHECKED_IDS = new Set(['CAT','JBL','LMT','MCD','AMZN','MEDP','NTAP','RNG']);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const formatStamp = value => new Intl.DateTimeFormat('de-DE', {
    timeZone:'Europe/Berlin', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'
  }).format(new Date(value)).replace(',', ' ·');

  async function waitForHoldings() {
    for (let i = 0; i < 80; i += 1) {
      try {
        if (Array.isArray(holdings) && holdings.length === 12 && typeof renderCards === 'function' && typeof renderDetail === 'function') return true;
      } catch (_) {}
      await sleep(250);
    }
    return false;
  }

  function applyRun() {
    window.marketAgentUpdateMeta = {
      contentUpdatedAt: STAMP,
      lastSuccessfulRunAt: STAMP,
      status: 'closed',
      marketStatus: 'US holiday - Labor Day'
    };

    holdings.forEach(h => {
      if (!CHECKED_IDS.has(h.id)) return;
      h.analysts = (h.analysts || []).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date >= FOUR_MONTH_CUTOFF);
      h.insiders = (h.insiders || []).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date >= FOUR_MONTH_CUTOFF);
      h.lastCheckedAt = STAMP;
      h.changedSections = [];
      h.updateStatus = 'checked-market-closed';
      delete h.updateTag;
    });

    for (const id of ['CAT','JBL','LMT','MCD','AMZN']) {
      const h = holdings.find(x => x.id === id);
      if (!h) continue;
      h.analystNote = `Rollierendes Vier-Monats-Fenster ab 07.05.2026, geprüft bis 07.09.2026 17:00 CEST. Unternehmens-/IR- und frei zugängliche Analystenquellen wurden auf neue Revisionen seit dem vorherigen US-Lauf geprüft; keine zusätzliche belastbar verifizierte Einzelrevision wurde übernommen.`;
      h.insiderNote = `Rollierendes Vier-Monats-Fenster ab 07.05.2026. SEC Form 4 und ergänzende Insiderquellen wurden auf neue relevante Transaktionen seit dem vorherigen US-Lauf geprüft; keine zusätzliche belastbar verifizierte diskretionäre Open-Market-Transaktion wurde übernommen.`;
    }
  }

  function markRun() {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip && text) {
      text.textContent = `Inhalte: ${formatStamp(STAMP)}`;
      chip.classList.remove('status-ok','status-partial','status-error','status-closed');
      chip.classList.add('status-closed');
      chip.title = 'US-Börsen am 07.09.2026 wegen Labor Day geschlossen. Keine neuen Kurszeitstempel erzeugt. Inhaltsprüfung der acht US-Werte abgeschlossen. Die angekündigte Datei Holdings (1)(1).md war in dieser Conversation-Laufzeit nicht abrufbar; der ausdrücklich bestätigte 12er-Bestand wurde gegen Dashboard-IDs, Daten-JSONs und Marktdatensymbole abgeglichen.';
    }

    document.querySelectorAll('.update-badge').forEach(el => el.remove());
    document.querySelectorAll('.holding').forEach(card => {
      card.classList.remove('content-changed','content-partial');
      const h = holdings.find(x => x.id === card.dataset.id);
      if (h && CHECKED_IDS.has(h.id)) card.title = `Letzte Inhaltsprüfung: ${formatStamp(STAMP)} · US-Börsen geschlossen · keine inhaltliche Änderung`;
    });

    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 07.09.2026 · 17:00 · Quellen in jedem Eintrag';
  }

  async function boot() {
    const ready = await waitForHoldings();
    if (!ready) return;
    await sleep(13000);
    applyRun();
    renderCards();
    renderDetail();
    markRun();
    document.addEventListener('click', event => {
      if (event.target.closest('.holding,.tab,.filter')) setTimeout(markRun, 0);
    });
    document.addEventListener('keydown', event => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target.closest('.holding')) setTimeout(markRun, 0);
    });
    window.addEventListener('pageshow', () => setTimeout(markRun, 0));
  }

  boot();
})();
