(() => {
  const STAMP = '2026-09-04T10:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-05-04';
  const CHECKED_IDS = new Set(['HNR1','EUNL','LHA','ALV']);
  const CHANGED_IDS = new Set(['EUNL','LHA']);
  const LHA_ANALYST_HOUSE = 'JPMorgan';

  const formatStamp = value => new Intl.DateTimeFormat('de-DE', {
    timeZone:'Europe/Berlin', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'
  }).format(new Date(value)).replace(',', ' ·');
  const upsert = (items, entry, same) => [entry].concat((items || []).filter(item => !same(item, entry)));

  function applyRun() {
    window.marketAgentUpdateMeta = { contentUpdatedAt: STAMP, lastSuccessfulRunAt: STAMP, status: 'partial' };

    holdings.forEach(h => {
      if (!CHECKED_IDS.has(h.id)) return;
      h.analysts = (h.analysts || []).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date >= FOUR_MONTH_CUTOFF);
      h.insiders = (h.insiders || []).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date >= FOUR_MONTH_CUTOFF);
      h.lastCheckedAt = STAMP;
      h.changedSections = [];
      h.updateStatus = 'checked';
      delete h.updateTag;
    });

    const hnr = holdings.find(h => h.id === 'HNR1');
    if (hnr) {
      hnr.analystNote = 'Rollierendes Vier-Monats-Fenster ab 04.05.2026, geprüft bis 04.09.2026 10:00 CEST. Hannover-Re-IR, FinanzNachrichten/dpa-AFX und MarketScreener wurden geprüft; keine neue belastbar verifizierte Einzelanalyse gegenüber dem vorhandenen Bestand übernommen.';
      hnr.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 04.05.2026 geprüft. Offizielle IR-/Directors’-Dealings-Quellen wurden geprüft; keine neue relevante Open-Market-Transaktion verifiziert.';
    }

    const etf = holdings.find(h => h.id === 'EUNL');
    if (etf) {
      etf.analystNote = 'Nicht anwendbar: ETF. Produktmerkmale am 04.09.2026 gegen iShares geprüft: ISIN IE00B4L5Y983, thesaurierend, TER 0,20 %, UCITS; 1.252 Fondspositionen, KGV 26,30 und KBV 4,16 per 02.09.2026.';
      etf.insiderNote = 'Nicht anwendbar: Ein ETF hat keine Unternehmensinsider.';
      etf.lastChangedAt = STAMP;
      etf.changedSections = ['Stammdaten'];
      etf.updateStatus = 'updated';
      etf.updateTag = 'AKTUALISIERT';
    }

    const lha = holdings.find(h => h.id === 'LHA');
    if (lha) {
      const jp = {
        house:LHA_ANALYST_HOUSE, date:'2026-09-04', rating:'Neutral', target:7.50,
        reason:'JPMorgan bestätigte nach einer Roadshow in Mailand Neutral mit Kursziel 7,50 EUR. Analyst Harry Gowers beurteilt das Nachfrageumfeld weiterhin als günstig für das Erreichen der Jahresziele.',
        quality:'Analyst: Harry Gowers · historische Güte öffentlich nicht belastbar verifizierbar: n. v.',
        source:'https://de.marketscreener.com/boerse-nachrichten/jpmorgan-belaesst-lufthansa-auf-neutral-ziel-7-50-euro-ce785bdadc8fff24'
      };
      lha.analysts = upsert(lha.analysts, jp, (a,b) => a.house === b.house && a.date === b.date && a.rating === b.rating && a.target === b.target);
      lha.analystNote = 'Rollierendes Vier-Monats-Fenster ab 04.05.2026, geprüft bis 04.09.2026 10:00 CEST. Neu aufgenommen: JPMorgan / Harry Gowers, Neutral, Kursziel 7,50 EUR vom 04.09.2026. Lufthansa IR, FinanzNachrichten/dpa-AFX, MarketScreener und Onvista wurden geprüft.';
      lha.insiderNote = 'Lufthansa Directors’ Dealings wurde geprüft. Im rollierenden Vier-Monats-Fenster ab 04.05.2026 wurde keine neue meldepflichtige Open-Market-Transaktion gefunden.';
      lha.lastChangedAt = STAMP;
      lha.changedSections = ['Analysten'];
      lha.updateStatus = 'updated';
      lha.updateTag = 'NEU';
    }

    const alv = holdings.find(h => h.id === 'ALV');
    if (alv) {
      alv.analystNote = 'Rollierendes Vier-Monats-Fenster ab 04.05.2026, geprüft bis 04.09.2026 10:00 CEST. Allianz IR, FinanzNachrichten/dpa-AFX und MarketScreener wurden geprüft; keine neue belastbar verifizierte Einzelanalyse seit dem vorherigen EU-Lauf übernommen.';
      alv.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 04.05.2026. EQS/Directors’-Dealings und Allianz-IR wurden geprüft; keine neue discretionary Open-Market-Transaktion gegenüber dem vorhandenen Bestand verifiziert.';
    }
  }

  function addBadge(el, label) {
    if (!el || el.querySelector('.update-badge')) return;
    const badge = document.createElement('span');
    badge.className = 'update-badge';
    badge.textContent = label;
    el.prepend(badge);
  }

  function markRun() {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip && text) {
      text.textContent = `Inhalte: ${formatStamp(STAMP)}`;
      chip.classList.remove('status-ok','status-partial','status-error','status-closed');
      chip.classList.add('status-partial');
      chip.title = 'Teilaktualisierung: Die im Auftrag enthaltene 12er-Holdingsliste wurde vollständig gegen Dashboard-IDs, Daten-JSONs und Marktdatensymbole abgeglichen. Die Datei Holdings (1)(1).md selbst war in dieser Ausführung nicht als Conversation-Datei abrufbar. Die drei neuen US-Werte sind technisch aufgenommen; ihr vollständiger US-Recherchecheck erfolgt im 17:00-Lauf.';
    }

    document.querySelectorAll('.update-badge').forEach(el => el.remove());
    document.querySelectorAll('.holding').forEach(card => {
      card.classList.remove('content-changed','content-partial');
      const h = holdings.find(x => x.id === card.dataset.id);
      if (CHANGED_IDS.has(card.dataset.id)) {
        card.classList.add('content-changed');
        card.title = `Heute inhaltlich aktualisiert · ${(h?.changedSections || []).join(', ')}`;
      } else if (h?.lastCheckedAt && CHECKED_IDS.has(h.id)) {
        card.title = `Letzte Inhaltsprüfung: ${formatStamp(h.lastCheckedAt)} · Keine inhaltliche Änderung`;
      }
    });

    if (selected === 'EUNL') {
      const note = document.querySelector('#tab-research .footnote');
      if (note) addBadge(note, 'AKTUALISIERT');
    }
    if (selected === 'LHA') {
      document.querySelectorAll('#tab-research tbody tr').forEach(row => {
        const t = row.textContent || '';
        if (t.includes(LHA_ANALYST_HOUSE) && t.includes('04.09.2026')) addBadge(row.querySelector('td:first-child'), 'NEU');
      });
    }

    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 04.09.2026 · 10:00 · Quellen in jedem Eintrag';
  }

  async function boot() {
    await new Promise(r => setTimeout(r, 10500));
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

  boot().catch(() => {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip) { chip.classList.remove('status-ok','status-partial','status-closed'); chip.classList.add('status-error'); }
    if (text) text.textContent = 'Inhalte: letzter erfolgreicher Stand 03.09.2026 · 17:00 · Aktualisierung fehlgeschlagen';
  });
})();
