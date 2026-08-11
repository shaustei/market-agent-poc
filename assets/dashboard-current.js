(() => {
  const CONTENT_UPDATED_AT = '2026-08-11T10:00:00+02:00';
  const LAST_SUCCESSFUL_RUN_AT = '2026-08-11T10:00:00+02:00';
  const RUN_STATUS = 'partial';
  const CHECKED_IDS = new Set(['HNR1','EUNL','LHA','ALV']);
  const CHANGED_IDS = new Set([]);

  window.marketAgentUpdateMeta = {
    contentUpdatedAt: CONTENT_UPDATED_AT,
    lastSuccessfulRunAt: LAST_SUCCESSFUL_RUN_AT,
    status: RUN_STATUS
  };

  const formatStamp = value => new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(value)).replace(',', ' ·');

  function setContentChip() {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (!chip || !text) return;
    text.textContent = `Inhalte: ${formatStamp(CONTENT_UPDATED_AT)}`;
    chip.classList.remove('status-ok','status-partial','status-error','status-closed');
    chip.classList.add('status-partial');
    chip.title = 'Teilaktualisierung: Holdings.md bzw. eine neuere Holdings-Datei war im Repository nicht verfügbar; der bestätigte 9er-Sollbestand wurde gegen Dashboard-IDs, Daten-JSONs und Marktdatensymbole geprüft.';
  }

  function setCurrentMetadata() {
    holdings.forEach(h => {
      if (!CHECKED_IDS.has(h.id)) return;
      h.lastCheckedAt = CONTENT_UPDATED_AT;
      if (!CHANGED_IDS.has(h.id)) {
        h.changedSections = [];
        h.updateStatus = 'checked';
        delete h.updateTag;
      }
    });
  }

  function markCardsCurrentRun() {
    document.querySelectorAll('.holding').forEach(card => {
      const h = holdings.find(x => x.id === card.dataset.id);
      const changed = Boolean(h && CHANGED_IDS.has(h.id));
      card.classList.toggle('content-changed', changed);
      if (CHECKED_IDS.has(h?.id)) {
        card.classList.toggle('content-partial', false);
        card.title = `Letzte Inhaltsprüfung: ${formatStamp(CONTENT_UPDATED_AT)}${changed ? ` · Geändert: ${h.changedSections.join(', ')}` : ' · Keine inhaltliche Änderung'}`;
      } else {
        card.classList.remove('content-changed');
      }
    });
  }

  function markDetailCurrentRun() {
    document.querySelectorAll('.update-badge').forEach(el => el.remove());
  }

  function installWrappers() {
    const baseCards = renderCards;
    renderCards = function(){ baseCards(); markCardsCurrentRun(); };
    const baseDetail = renderDetail;
    renderDetail = function(){ baseDetail(); markDetailCurrentRun(); };
  }

  async function boot() {
    for (let i = 0; i < 80 && (!Array.isArray(holdings) || holdings.length === 0); i++) await new Promise(r => setTimeout(r, 50));
    await new Promise(r => setTimeout(r, 150));
    setContentChip();
    setCurrentMetadata();
    installWrappers();
    renderCards();
    renderDetail();
  }

  boot().catch(() => {
    const chip = document.getElementById('content-state-chip');
    chip?.classList.remove('status-ok','status-partial','status-closed');
    chip?.classList.add('status-error');
    const text = document.getElementById('content-state');
    if (text) text.textContent = `Inhalte: ${formatStamp(LAST_SUCCESSFUL_RUN_AT)} · Warnung`;
  });
})();