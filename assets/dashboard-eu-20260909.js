(() => {
  const STAMP = '2026-09-09T10:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-05-09';
  const CHECKED_IDS = new Set(['HNR1','EUNL','LHA','ALV']);
  const CHANGED_IDS = new Set(['HNR1','EUNL']);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const formatStamp = value => new Intl.DateTimeFormat('de-DE', {timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(value)).replace(',', ' ·');
  const upsert = (items, entry, same) => [entry].concat((items || []).filter(item => !same(item, entry)));

  async function waitForDashboard() {
    for (let i = 0; i < 80; i++) {
      try {
        if (Array.isArray(holdings) && holdings.length === 12 && typeof renderCards === 'function' && typeof renderDetail === 'function') return true;
      } catch (_) {}
      await sleep(250);
    }
    return false;
  }

  function applyData() {
    window.marketAgentUpdateMeta = {contentUpdatedAt:STAMP,lastSuccessfulRunAt:STAMP,status:'partial',marketStatus:'open'};
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
      hnr.analysts = upsert(hnr.analysts, {
        house:'Jefferies', analyst:'Philip Kett', date:'2026-09-09', rating:'Buy', target:325,
        reason:'Kursziel von 360 auf 325 EUR gesenkt, Buy bestätigt. Jefferies verweist auf den im Branchenvergleich hohen Reservepuffer; dessen relative Stärke dürfte bei wieder sinkenden Rückversicherungspreisen an Bedeutung gewinnen.',
        quality:'Historische Güte: n. v.',
        source:'https://www.finanznachrichten.de/nachrichten-2026-09/69527816-jefferies-stuft-hannover-rueckversicherung-ag-auf-buy-322.htm'
      }, (a,b) => a.house === b.house && a.date === b.date);
      hnr.analysts = upsert(hnr.analysts, {
        house:'Berenberg', analyst:'Michael Christodoulou', date:'2026-09-08', rating:'Buy', target:330,
        reason:'Buy und Kursziel 330 EUR bestätigt. Nach Gesprächen in Monte Carlo erwartet Berenberg weiter sinkende Rückversicherungspreise, sieht die Unternehmen im aktuellen Marktumfeld aber als relativ robust an.',
        quality:'Historische Güte: n. v.',
        source:'https://www.finanznachrichten.de/nachrichten-2026-09/69518359-berenberg-stuft-hannover-rueckversicherung-ag-auf-buy-322.htm'
      }, (a,b) => a.house === b.house && a.date === b.date);
      hnr.analystNote = 'Rollierendes Vier-Monats-Fenster ab 09.05.2026, geprüft bis 09.09.2026 10:00 CEST. Hannover-Re-IR, FinanzNachrichten/dpa-AFX und MarketScreener wurden geprüft. Neu: Jefferies Buy / 325 EUR vom 09.09. und Berenberg Buy / 330 EUR vom 08.09.';
      hnr.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 09.05.2026 geprüft. Offizielle IR-/Directors’-Dealings-, EQS- und ergänzende Quellen wurden geprüft; keine neue relevante diskretionäre Open-Market-Transaktion verifiziert.';
      hnr.lastChangedAt = STAMP;
      hnr.changedSections = ['Analysten'];
      hnr.updateStatus = 'updated';
      hnr.updateTag = 'NEU';
    }

    const etf = holdings.find(h => h.id === 'EUNL');
    if (etf) {
      etf.analystNote = 'Nicht anwendbar: ETF. iShares-Produktdaten am 09.09.2026 geprüft: ISIN IE00B4L5Y983, thesaurierend, UCITS, TER 0,20 %, 1.252 Positionen per 07.09.2026, KGV 26,51 und KBV 4,18 per 07.09.2026; Fondsvermögen 153,310 Mrd. USD per 08.09.2026.';
      etf.insiderNote = 'Nicht anwendbar: Ein ETF hat keine Unternehmensinsider.';
      etf.lastChangedAt = STAMP;
      etf.changedSections = ['Stammdaten'];
      etf.updateStatus = 'updated';
      etf.updateTag = 'AKTUALISIERT';
    }

    const lha = holdings.find(h => h.id === 'LHA');
    if (lha) {
      lha.analystNote = 'Rollierendes Vier-Monats-Fenster ab 09.05.2026, geprüft bis 09.09.2026 10:00 CEST. Lufthansa IR, FinanzNachrichten/dpa-AFX, MarketScreener und Onvista wurden geprüft; keine neue belastbar verifizierte Einzelrevision seit dem vorherigen EU-Lauf übernommen.';
      lha.insiderNote = 'Lufthansa Directors’ Dealings und ergänzende Quellen wurden im rollierenden Vier-Monats-Fenster ab 09.05.2026 geprüft; keine neue meldepflichtige diskretionäre Open-Market-Transaktion verifiziert.';
    }

    const alv = holdings.find(h => h.id === 'ALV');
    if (alv) {
      alv.analystNote = 'Rollierendes Vier-Monats-Fenster ab 09.05.2026, geprüft bis 09.09.2026 10:00 CEST. Allianz IR, FinanzNachrichten/dpa-AFX und MarketScreener wurden geprüft; keine neue belastbar verifizierte Einzelrevision seit dem vorherigen EU-Lauf übernommen.';
      alv.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 09.05.2026. Allianz Directors’ Dealings, EQS und ergänzende Quellen wurden geprüft; keine neue diskretionäre Open-Market-Transaktion verifiziert.';
    }
  }

  function badge(el, text) {
    if (!el || el.querySelector('.update-badge')) return;
    const b = document.createElement('span'); b.className = 'update-badge'; b.textContent = text; el.prepend(b);
  }

  function markUi() {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip && text) {
      text.textContent = `Inhalte: ${formatStamp(STAMP)}`;
      chip.classList.remove('status-ok','status-partial','status-error','status-closed');
      chip.classList.add('status-partial');
      chip.title = 'Teilaktualisierung: Die verbindliche Datei Holdings (1)(1).md ist in dieser Laufzeit nicht als Conversation-Datei verfügbar. Der ausdrücklich bestätigte Bestand von 12 Positionen wurde gegen Repository und Marktdatensymbole abgeglichen; keine Position wurde entfernt.';
    }

    document.querySelectorAll('.holding').forEach(card => {
      card.classList.remove('content-changed','content-partial');
      const h = holdings.find(x => x.id === card.dataset.id);
      if (CHANGED_IDS.has(card.dataset.id)) {
        card.classList.add('content-changed');
        card.title = `Inhaltlich aktualisiert · ${(h?.changedSections || []).join(', ')}`;
      } else if (CHECKED_IDS.has(card.dataset.id)) {
        card.title = `Letzte Inhaltsprüfung: ${formatStamp(STAMP)} · Keine inhaltliche Änderung`;
      }
    });

    document.querySelectorAll('.update-badge').forEach(el => el.remove());
    if (selected === 'HNR1') {
      document.querySelectorAll('#tab-research tbody tr').forEach(r => {
        const t = r.textContent || '';
        if ((t.includes('Jefferies') && t.includes('09.09.2026')) || (t.includes('Berenberg') && t.includes('08.09.2026'))) badge(r.querySelector('td'), 'NEU');
      });
    }
    if (selected === 'EUNL') {
      const note = document.querySelector('#tab-research .footnote');
      if (note) badge(note, 'AKTUALISIERT');
    }

    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 09.09.2026 · 10:00 · Quellen in jedem Eintrag';
  }

  async function boot() {
    if (!(await waitForDashboard())) return;
    applyData();
    renderCards(); renderDetail(); markUi();
    [1500,5000,13000,20000].forEach(ms => setTimeout(() => { try { renderCards(); renderDetail(); markUi(); } catch (_) {} }, ms));
    document.addEventListener('click', e => { if (e.target.closest('.holding,.tab,.filter')) setTimeout(markUi, 0); });
    window.addEventListener('pageshow', () => setTimeout(markUi, 250));
  }
  boot();
})();
