(() => {
  const STAMP = '2026-09-03T10:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-05-03';
  const CHECKED_IDS = new Set(['HNR1','EUNL','LHA','ALV']);
  const CHANGED_IDS = new Set(['HNR1','EUNL','LHA','ALV']);
  const HNR_TRIGGER_TITLE = 'Monte Carlo Pressefrühstück';
  const LHA_TITLE = 'Nahost-Flugplan konkretisiert: Riad ab 10. September, Amman ab 25. Oktober';
  const ALV_TITLE = 'Aktienrückkauf: 5,45 Mio. eigene Aktien seit Programmstart erworben';

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
      hnr.next = '07.09.2026 · 08:00 · Monte Carlo Pressefrühstück';
      hnr.triggers = upsert(hnr.triggers, {
        date:'2026-09-07', title:HNR_TRIGGER_TITLE,
        background:'Pressefrühstück von 08:00 bis 09:30 CEST in Monte Carlo. Relevant sind Aussagen zu Renewal-Preisen, Großschäden, Kapitalallokation und zur bestätigten 2026-Gewinnguidance von mindestens 2,7 Mrd. EUR.',
        direction:'neutral', criteria:[1,1,1],
        source:'https://www.hannover-re.com/en/', sourceName:'Hannover Re IR', status:'bestätigt'
      }, (a,b) => a.date === b.date && a.title === b.title);
      hnr.analystNote = 'Rollierendes Vier-Monats-Fenster ab 03.05.2026, geprüft bis 03.09.2026 10:00 CEST. Hannover-Re-IR, FinanzNachrichten/dpa-AFX, MarketScreener und Onvista wurden geprüft; keine neue belastbar verifizierte Einzelanalyse gegenüber dem vorhandenen Bestand übernommen.';
      hnr.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 03.05.2026 geprüft. Offizielle IR-/Directors’-Dealings-Quellen wurden geprüft; keine neue relevante Open-Market-Transaktion verifiziert.';
      hnr.lastChangedAt = STAMP;
      hnr.changedSections = ['Termin/Trigger'];
      hnr.updateStatus = 'updated';
      hnr.updateTag = 'NEU';
    }

    const etf = holdings.find(h => h.id === 'EUNL');
    if (etf) {
      etf.analystNote = 'Nicht anwendbar: ETF. Produktmerkmale am 03.09.2026 gegen iShares geprüft: ISIN IE00B4L5Y983, thesaurierend, TER 0,20 %, UCITS; 1.253 Fondspositionen sowie KGV 26,50 und KBV 4,17 per 01.09.2026.';
      etf.insiderNote = 'Nicht anwendbar: Ein ETF hat keine Unternehmensinsider.';
      etf.lastChangedAt = STAMP;
      etf.changedSections = ['Stammdaten'];
      etf.updateStatus = 'updated';
      etf.updateTag = 'AKTUALISIERT';
    }

    const lha = holdings.find(h => h.id === 'LHA');
    if (lha) {
      const routeNews = {
        date:'2026-09-01', sourceName:'Lufthansa Group', category:'Netzwerk / Nahost',
        title:LHA_TITLE,
        summary:'Lufthansa Group hat den Zeitplan für die schrittweise Wiederaufnahme konkretisiert: Frankfurt–Riad soll ab 10. September dreimal wöchentlich zurückkehren, Frankfurt–Amman täglich ab 25. Oktober. Eurowings hält Erbil wegen der Sicherheitslage mindestens bis einschließlich 20. September ausgesetzt.',
        impactText:'Leicht positiv operativ; Stärke 1. Die Netzabdeckung normalisiert sich teilweise, zugleich zeigt die fortgesetzte Erbil-Aussetzung, dass das geopolitische Risiko und mögliche kurzfristige Flugplanänderungen bestehen bleiben.',
        impact:1,
        source:'https://business.lufthansagroup.com/be/de/program/experts/news/lufthansa-group-resumes-flights-to-and-from-riyadh--amman--beirut-'
      };
      lha.news = upsert(lha.news, routeNews, (a,b) => a.date === b.date && a.title === b.title);
      lha.triggers = upsert(lha.triggers, {
        date:'2026-09-10', title:'Wiederaufnahme Frankfurt–Riad',
        background:'Geplante Wiederaufnahme mit drei wöchentlichen Flügen. Operativ positiv, aber von der Sicherheitslage im Nahen Osten abhängig; weitere Änderungen bleiben möglich.',
        direction:'up', criteria:[1,1,1],
        source:'https://business.lufthansagroup.com/be/de/program/experts/news/lufthansa-group-resumes-flights-to-and-from-riyadh--amman--beirut-',
        sourceName:'Lufthansa Group', status:'bestätigt'
      }, (a,b) => a.date === b.date && a.title === b.title);
      lha.next = '10.09.2026 · Wiederaufnahme Frankfurt–Riad';
      lha.analystNote = 'Rollierendes Vier-Monats-Fenster ab 03.05.2026, geprüft bis 03.09.2026 10:00 CEST. Lufthansa IR, FinanzNachrichten/dpa-AFX, MarketScreener und Onvista wurden geprüft; keine neue belastbar verifizierte Einzelanalyse seit dem vorherigen EU-Lauf übernommen.';
      lha.insiderNote = 'Lufthansa Directors’ Dealings wurde geprüft. Im rollierenden Vier-Monats-Fenster ab 03.05.2026 wurde keine neue meldepflichtige Open-Market-Transaktion gefunden.';
      lha.lastChangedAt = STAMP;
      lha.changedSections = ['Termin/Trigger','News'];
      lha.updateStatus = 'updated';
      lha.updateTag = 'AKTUALISIERT';
    }

    const alv = holdings.find(h => h.id === 'ALV');
    if (alv) {
      const buyback = {
        date:'2026-09-01', sourceName:'Allianz / EQS', category:'Kapitalallokation',
        title:ALV_TITLE,
        summary:'Allianz kaufte vom 24. bis 28. August 57.715 eigene Aktien zurück. Seit Beginn des Rückkaufprogramms am 13. März wurden damit bis einschließlich 28. August insgesamt 5.448.823 Aktien erworben.',
        impactText:'Leicht positiv; Stärke 1. Der laufende Rückkauf stützt Kapitaldisziplin und Gewinn je Aktie. Die Signalwirkung bleibt begrenzt, weil das Programm bereits angekündigt war und bei Kursen nahe dem Rekordhoch jeder zusätzliche Rückkauf-Euro weniger günstig eingesetzt wird.',
        impact:1,
        source:'https://www.finanznachrichten.de/nachrichten-2026-09/69464145-eqs-cms-allianz-se-veroeffentlichung-einer-kapitalmarktinformation-022.htm'
      };
      alv.news = upsert(alv.news, buyback, (a,b) => a.date === b.date && a.title === b.title);
      alv.next = '21.09.2026 · Berenberg / Goldman Sachs German Corporate Conference';
      alv.analystNote = 'Rollierendes Vier-Monats-Fenster ab 03.05.2026, geprüft bis 03.09.2026 10:00 CEST. Allianz IR, FinanzNachrichten/dpa-AFX, MarketScreener und Onvista wurden geprüft; keine neue belastbar verifizierte Einzelanalyse seit dem vorherigen EU-Lauf übernommen.';
      alv.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 03.05.2026. EQS/Directors’-Dealings und Allianz-IR wurden geprüft; keine neue discretionary Open-Market-Transaktion gegenüber dem vorhandenen Bestand verifiziert. Der Aktienrückkauf ist eine Unternehmenstransaktion und kein Insidertrade.';
      alv.lastChangedAt = STAMP;
      alv.changedSections = ['News','Termin/Trigger'];
      alv.updateStatus = 'updated';
      alv.updateTag = 'NEU';
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
      chip.title = 'Teilaktualisierung: In den verfügbaren Gesprächsdateien und im Repository war keine aktuelle Holdings.md auffindbar. Der im Auftrag bestätigte 9er-Bestand wurde gegen Daten-JSONs, Dashboard-IDs und Marktdatensymbole abgeglichen; keine Position wurde entfernt.';
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

    if (selected === 'HNR1') {
      document.querySelectorAll('#tab-events .trigger').forEach(item => {
        if ((item.textContent || '').includes(HNR_TRIGGER_TITLE)) addBadge(item.querySelector('strong'), 'NEU');
      });
    }
    if (selected === 'EUNL') {
      const note = document.querySelector('#tab-research .footnote');
      if (note) addBadge(note, 'AKTUALISIERT');
    }
    if (selected === 'LHA') {
      document.querySelectorAll('#tab-events .news-item').forEach(item => {
        if ((item.textContent || '').includes(LHA_TITLE)) addBadge(item.querySelector('h4'), 'AKTUALISIERT');
      });
      document.querySelectorAll('#tab-events .trigger').forEach(item => {
        if ((item.textContent || '').includes('Wiederaufnahme Frankfurt–Riad')) addBadge(item.querySelector('strong'), 'AKTUALISIERT');
      });
    }
    if (selected === 'ALV') {
      document.querySelectorAll('#tab-events .news-item').forEach(item => {
        if ((item.textContent || '').includes(ALV_TITLE)) addBadge(item.querySelector('h4'), 'NEU');
      });
    }

    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 03.09.2026 · 10:00 · Quellen in jedem Eintrag';
  }

  async function boot() {
    await new Promise(r => setTimeout(r, 9500));
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
    if (text) text.textContent = 'Inhalte: letzter erfolgreicher Stand 02.09.2026 · 17:00 · Aktualisierung fehlgeschlagen';
  });
})();
