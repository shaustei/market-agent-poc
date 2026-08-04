(() => {
  const CONTENT_UPDATED_AT = '2026-08-04T10:00:00+02:00';
  const LAST_SUCCESSFUL_RUN_AT = '2026-08-04T10:00:00+02:00';
  const RUN_STATUS = 'ok';
  const CHECKED_IDS = new Set(['HNR1','EUNL','LHA','ALV']);

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
    chip.classList.add(RUN_STATUS === 'ok' ? 'status-ok' : RUN_STATUS === 'partial' ? 'status-partial' : RUN_STATUS === 'closed' ? 'status-closed' : 'status-error');
    chip.title = 'Letzter erfolgreich veröffentlichter Inhaltsstand';
  }

  function applyEuUpdate() {
    const lha = holdings.find(h => h.id === 'LHA');
    if (lha) {
      lha.next = '03.11.2026 · 3. Zwischenbericht';
      lha.advice = 'Halten; wegen gesenkter Ergebnisvisibilität nicht aufstocken.';
      lha.adviceWhy = 'Q2-EBIT und Nettogewinn brachen ein; die frühere qualitative Jahresprognose wurde durch eine Bandbreite von 1,7–2,2 Mrd. EUR ersetzt. Höhere Yields und Auslastung helfen, kompensieren Treibstoff- und Störkosten aber nicht vollständig.';
      lha.thesis = 'Turnaround-Potenzial und wertvolle Cargo-/MRO-Aktivitäten stehen hohen Treibstoff-, Personal- und Ausführungsrisiken gegenüber. Nach dem deutlichen Q2-Ergebnisrückgang und der schwächeren Guidance-Visibilität bleibt die Aktie ein zyklisches Value-/Turnaround-Investment, kein verlässlicher Qualitäts-Dividendenwert.';
      lha.triggers = [
        {date:'2026-11-03',title:'3. Zwischenbericht 2026',background:'Entscheidend sind die Positionierung innerhalb der neuen EBIT-Bandbreite von 1,7–2,2 Mrd. EUR, Treibstoffkosten, Yield, Kapazität und Free Cashflow.',direction:'neutral',criteria:[1,1,0],source:'https://investor-relations.lufthansagroup.com/en/investor-relations',sourceName:'Lufthansa IR',status:'bestätigt'},
        {date:'2026-08-04',title:'Analystenkonferenz zu H1 2026',background:'Management erläutert ab 11:30 Uhr die Halbjahreszahlen, die neue EBIT-Bandbreite, Treibstoffkosten und Kapazitätsmaßnahmen.',direction:'down',criteria:[1,1,1],source:'https://investor-relations.lufthansagroup.com/en/financial-reports-publications/financial-reports.html',sourceName:'Lufthansa IR',status:'heute'}
      ].concat((lha.triggers || []).filter(t => t.date !== '2026-08-04'));
      lha.news = [{
        date:'2026-08-04',sourceName:'Lufthansa IR / Reuters',category:'Q2-Ergebnis / Guidance',
        title:'Q2-Ergebnis bricht ein; Lufthansa ersetzt Gewinnziel durch Bandbreite',
        summary:'Der Q2-Umsatz stieg auf 11,14 Mrd. EUR. Das bereinigte EBIT fiel von rund 870 Mio. EUR auf 383 Mio. EUR; der Nettogewinn sank auf 123 Mio. EUR. Für 2026 erwartet Lufthansa nun ein bereinigtes EBIT von 1,7 bis 2,2 Mrd. EUR statt eines Ergebnisses deutlich über dem Vorjahreswert von 1,96 Mrd. EUR.',
        impactText:'Klar negativ; Stärke 3, weil Profitabilität und Ergebnisvisibilität deutlich nachlassen. Höhere Auslastung und Yields konnten Treibstoff- und Störkosten nicht ausgleichen.',impact:-3,
        source:'https://investor-relations.lufthansagroup.com/en/financial-reports-publications/financial-reports.html'
      }].concat((lha.news || []).filter(n => n.date !== '2026-08-04'));
      lha.risks = [
        'Die neue EBIT-Bandbreite von 1,7–2,2 Mrd. EUR schließt einen Gewinnrückgang gegenüber 2025 ein und signalisiert deutlich geringere Ergebnisvisibilität.',
        ...(lha.risks || []).filter(r => !r.startsWith('Jet-Fuel-Preise'))
      ];
      lha.lastCheckedAt = LAST_SUCCESSFUL_RUN_AT;
      lha.lastChangedAt = CONTENT_UPDATED_AT;
      lha.changedSections = ['Termin/Trigger','News','Investment-Einordnung','Rückenwind/Risiken'];
      lha.updateStatus = 'updated';
      lha.updateTag = 'AKTUALISIERT';
    }
  }

  function enrichMetadata() {
    holdings.forEach(h => {
      if (CHECKED_IDS.has(h.id)) {
        h.lastCheckedAt ||= LAST_SUCCESSFUL_RUN_AT;
        h.lastChangedAt ||= null;
        h.changedSections ||= [];
        h.updateStatus ||= 'checked';
      }
    });
  }

  function markCards() {
    document.querySelectorAll('.holding').forEach(card => {
      const h = holdings.find(x => x.id === card.dataset.id);
      const changed = Boolean(h?.changedSections?.length) && h?.lastChangedAt?.slice(0,10) === CONTENT_UPDATED_AT.slice(0,10);
      card.classList.toggle('content-changed', changed);
      card.classList.toggle('content-partial', h?.updateStatus === 'partial');
      if (h?.lastCheckedAt) card.title = `Letzte Inhaltsprüfung: ${formatStamp(h.lastCheckedAt)}${h.changedSections?.length ? ` · Geändert: ${h.changedSections.join(', ')}` : ' · Keine inhaltliche Änderung'}`;
    });
  }

  function badge(label) {
    const cls = label === 'KORRIGIERT' ? 'update-corrected' : label === 'AKTUALISIERT' ? 'update-updated' : 'update-new';
    return `<span class="update-badge ${cls}">${label}</span>`;
  }

  function markDetail() {
    const h = holdings.find(x => x.id === selected);
    if (!h?.updateTag) return;
    const target = document.querySelector('#tab-overview .thesis');
    if (target && !target.querySelector('.update-badge')) target.insertAdjacentHTML('afterbegin', badge(h.updateTag) + ' ');
    document.querySelectorAll('#tab-events .trigger, #tab-events .news-item, #tab-research tbody tr').forEach(el => {
      if (!el.querySelector('.update-badge')) el.insertAdjacentHTML('afterbegin', badge(h.updateTag));
    });
  }

  function installWrappers() {
    const baseCards = renderCards;
    renderCards = function(){ baseCards(); markCards(); };
    const baseDetail = renderDetail;
    renderDetail = function(){ baseDetail(); markDetail(); };
  }

  async function boot() {
    setContentChip();
    for (let i = 0; i < 80 && (!Array.isArray(holdings) || holdings.length === 0); i++) await new Promise(r => setTimeout(r, 50));
    applyEuUpdate();
    installWrappers();
    enrichMetadata();
    renderCards();
    renderDetail();
    const live = Object.values(quotes).filter(x => x.source === 'live').length;
    const state = document.getElementById('data-state');
    if (state) state.textContent = `${live}/${holdings.length} Kurse live · FX ${usdToEur ? 'live/Fallback' : 'Fallback'}`;
  }

  boot().catch(() => {
    const chip = document.getElementById('content-state-chip');
    chip?.classList.add('status-error');
    const text = document.getElementById('content-state');
    if (text) text.textContent = `Inhalte: ${formatStamp(LAST_SUCCESSFUL_RUN_AT)} · Warnung`;
  });
})();