(() => {
  const STAMP = '2026-09-08T10:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-05-08';
  const CHECKED_IDS = new Set(['HNR1','EUNL','LHA','ALV']);
  const CHANGED_IDS = new Set(['HNR1','LHA','ALV']);
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
      hnr.news = upsert(hnr.news, {date:'2026-09-07',sourceName:'Hannover Re / EQS',category:'Monte Carlo / Renewal-Ausblick',title:'Monte Carlo: leicht rückläufige Preise, stabile Konditionen und selektive Wachstumschancen',summary:'Hannover Rück erwartet für die Erneuerungen zum 1. Januar 2027 leicht rückläufige Preise bei überwiegend stabilen Konditionen. Der Wettbewerbsdruck nimmt zu; zugleich bleibt die Nachfrage nach hochwertigem Rückversicherungsschutz hoch und selektives Wachstum bei risikoadäquater Bepreisung möglich.',impactText:'Leicht negativ; Stärke 1. Sinkende Preise begrenzen das Margenpotenzial, stabile Konditionen und disziplinierte Zeichnung wirken dagegen.',impact:-1,source:'https://www.hannover-re.com/de/news/2026/hannover-rueck-sieht-profitable-wachstumsmoeglichkeiten-in-einem-zunehmend-anspruchsvollen-marktumfeld/'}, (a,b) => a.date === b.date && a.title === b.title);
      hnr.analysts = upsert(hnr.analysts, {house:'Barclays',analyst:'Claudia Gaspari',date:'2026-09-04',rating:'Underweight',target:246,reason:'Kursziel von 247 auf 246 EUR gesenkt. Nach der H1-Berichtssaison sieht Barclays schwächere zugrunde liegende Trends, die teilweise durch geringere Großschäden und günstige Marktbewertungen überdeckt wurden.',quality:'Historische Güte: n. v.',source:'https://www.finanznachrichten.de/nachrichten-2026-09/69495352-barclays-stuft-hannover-rueckversicherung-ag-auf-underweight-322.htm'}, (a,b) => a.house === b.house && a.date === b.date);
      hnr.next = '17.09.2026 · Natixis 2026 FIG Conference, Paris';
      hnr.thesis = 'Operativ robuste Rückversicherung mit hoher Ergebnisqualität und attraktivem Ausschüttungsprofil. Der Investmentcase bleibt positiv, solange Schadenbudget, Reserven und Kapitalquote stabil bleiben. Der Monte-Carlo-Ausblick bestätigt jedoch zunehmenden Wettbewerb und leicht rückläufige Renewal-Preise; selektives Wachstum und stabile Konditionen begrenzen den Gegenwind.';
      hnr.analystNote = 'Rollierendes Vier-Monats-Fenster ab 08.05.2026, geprüft bis 08.09.2026 10:00 CEST. Hannover-Re-IR, FinanzNachrichten/dpa-AFX und MarketScreener wurden geprüft. Barclays vom 04.09.2026 wurde ergänzt.';
      hnr.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 08.05.2026 geprüft. Offizielle IR-/Directors’-Dealings-, EQS- und ergänzende Quellen wurden geprüft; keine neue relevante diskretionäre Open-Market-Transaktion verifiziert.';
      hnr.lastChangedAt = STAMP;
      hnr.changedSections = ['Analysten','News','Termin/Trigger','Investment-Einordnung'];
      hnr.updateStatus = 'corrected';
      hnr.updateTag = 'KORRIGIERT';
    }

    const etf = holdings.find(h => h.id === 'EUNL');
    if (etf) {
      etf.analystNote = 'Nicht anwendbar: ETF. ISIN IE00B4L5Y983, thesaurierend und TER 0,20 %. Produktseite und Fondsstruktur am 08.09.2026 erneut geprüft; Analysten-Kursziele sind für den ETF nicht anwendbar.';
      etf.insiderNote = 'Nicht anwendbar: Ein ETF hat keine Unternehmensinsider.';
      etf.updateStatus = 'checked';
    }

    const lha = holdings.find(h => h.id === 'LHA');
    if (lha) {
      lha.analysts = upsert(lha.analysts, {house:'JPMorgan',analyst:'Harry Gowers',date:'2026-09-04',rating:'Neutral',target:7.5,reason:'Einstufung und Kursziel 7,50 EUR bestätigt. Nach einer Roadshow in Mailand wertet JPMorgan das Nachfrageumfeld als günstig für das Erreichen der Jahresziele.',quality:'Historische Güte: n. v.',source:'https://www.finanznachrichten.de/nachrichten-2026-09/69492672-jpmorgan-stuft-lufthansa-ag-auf-neutral-322.htm'}, (a,b) => a.house === b.house && a.date === b.date);
      lha.next = '03.11.2026 · 3. Zwischenbericht Januar–September 2026';
      lha.analystNote = 'Rollierendes Vier-Monats-Fenster ab 08.05.2026, geprüft bis 08.09.2026 10:00 CEST. Lufthansa IR, FinanzNachrichten/dpa-AFX, MarketScreener und Onvista wurden geprüft. JPMorgan Neutral / 7,50 EUR vom 04.09.2026 wurde ergänzt.';
      lha.insiderNote = 'Lufthansa Directors’ Dealings und ergänzende Quellen wurden im rollierenden Vier-Monats-Fenster ab 08.05.2026 geprüft; keine neue meldepflichtige diskretionäre Open-Market-Transaktion verifiziert.';
      lha.lastChangedAt = STAMP;
      lha.changedSections = ['Analysten','Termin/Trigger'];
      lha.updateStatus = 'corrected';
      lha.updateTag = 'KORRIGIERT';
    }

    const alv = holdings.find(h => h.id === 'ALV');
    if (alv) {
      alv.news = upsert(alv.news, {date:'2026-08-07',sourceName:'Allianz IR',category:'Q2 / 6M 2026',title:'Q2 2026: operatives Ergebnis steigt 10,6 % auf Rekordwert 4,9 Mrd. EUR',summary:'Das Geschäftsvolumen erreichte 45,6 Mrd. EUR bei 5,7 % internem Wachstum. Das operative Ergebnis stieg im Quartal auf 4,9 Mrd. EUR; Allianz sieht sich auf Kurs für die Jahresziele.',impactText:'Positiv; Stärke 3. Breites organisches Wachstum und Rekord-Operating-Profit stärken Ergebnisqualität und Kapitalrückführung.',impact:3,source:'https://www.allianz.com/de/investor_relations/mitteilungen/ir-meldungen/260807.html'}, (a,b) => a.date === b.date && a.title === b.title);
      alv.analysts = upsert(alv.analysts, {house:'Barclays',analyst:'Claudia Gaspari',date:'2026-09-04',rating:'Underweight',target:353,reason:'Kursziel von 350 auf 353 EUR erhöht, Underweight bestätigt. Barclays sieht nach der H1-Berichtssaison geringe Gewinndynamik und eine bereits angemessene Bewertung des Sektors.',quality:'Historische Güte: n. v.',source:'https://www.finanznachrichten.de/nachrichten-2026-09/69495194-barclays-stuft-allianz-se-auf-underweight-322.htm'}, (a,b) => a.house === b.house && a.date === b.date);
      alv.analysts = upsert(alv.analysts, {house:'JPMorgan',analyst:'Kamran M Hossain',date:'2026-08-14',rating:'Neutral',target:460,reason:'Kursziel nach den Quartalszahlen von 430 auf 460 EUR angehoben. Höhere operative Ergebnisprognosen bis 2028 stützen das Ziel; JPMorgan sieht dennoch nur begrenztes Kurspotenzial.',quality:'Historische Güte: n. v.',source:'https://www.finanznachrichten.de/nachrichten-2026-08/69318355-jpmorgan-stuft-allianz-se-auf-neutral-322.htm'}, (a,b) => a.house === b.house && a.date === b.date);
      alv.next = '21.09.2026 · Berenberg and Goldman Sachs German Corporate Conference, München';
      alv.analystNote = 'Rollierendes Vier-Monats-Fenster ab 08.05.2026, geprüft bis 08.09.2026 10:00 CEST. Allianz IR, FinanzNachrichten/dpa-AFX und MarketScreener wurden geprüft. JPMorgan vom 14.08. und Barclays vom 04.09. wurden ergänzt.';
      alv.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 08.05.2026. Allianz Directors’ Dealings, EQS und ergänzende Quellen wurden geprüft; keine neue diskretionäre Open-Market-Transaktion verifiziert.';
      alv.lastChangedAt = STAMP;
      alv.changedSections = ['News','Analysten','Termin/Trigger'];
      alv.updateStatus = 'corrected';
      alv.updateTag = 'KORRIGIERT';
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
      chip.title = 'Teilaktualisierung: Die verbindliche Datei Holdings (1)(1).md ist in dieser Laufzeit nicht als Conversation-Datei verfügbar. Der ausdrücklich bestätigte Bestand von 12 Positionen wurde deshalb gegen Repository und Marktdatensymbole abgeglichen; keine Position wurde entfernt.';
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
    if (selected === 'HNR1') document.querySelectorAll('#tab-research tbody tr').forEach(r => { if ((r.textContent||'').includes('Barclays') && (r.textContent||'').includes('04.09.2026')) badge(r.querySelector('td'), 'KORRIGIERT'); });
    if (selected === 'LHA') document.querySelectorAll('#tab-research tbody tr').forEach(r => { if ((r.textContent||'').includes('JPMorgan') && (r.textContent||'').includes('04.09.2026')) badge(r.querySelector('td'), 'KORRIGIERT'); });
    if (selected === 'ALV') document.querySelectorAll('#tab-research tbody tr').forEach(r => { if ((r.textContent||'').includes('Barclays') || ((r.textContent||'').includes('JPMorgan') && (r.textContent||'').includes('14.08.2026'))) badge(r.querySelector('td'), 'KORRIGIERT'); });
    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 08.09.2026 · 10:00 · Quellen in jedem Eintrag';
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
