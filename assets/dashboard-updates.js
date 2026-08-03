(() => {
  const CONTENT_UPDATED_AT = '2026-08-03T17:00:00+02:00';
  const LAST_SUCCESSFUL_RUN_AT = '2026-08-03T17:00:00+02:00';
  const RUN_STATUS = 'ok';
  const CHECKED_IDS = new Set(['CAT','JBL','LMT','MCD','AMZN']);

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

  async function addAmazon() {
    if (holdings.some(h => h.id === 'AMZN')) return;
    const response = await fetch('/data/AMZN.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Amazon holding data unavailable');
    holdings.push(await response.json());
    quotes.AMZN ||= { price: null, currency: 'USD', source: 'fallback', series: [] };
    const all = document.querySelector('[data-filter="ALL"]');
    if (all) all.textContent = `Alle ${holdings.length}`;
  }

  async function boot() {
    setContentChip();
    for (let i = 0; i < 80 && (!Array.isArray(holdings) || holdings.length === 0); i++) await new Promise(r => setTimeout(r, 50));
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