(() => {
  const STAMP = '2026-09-07T10:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-05-07';
  const CHECKED_IDS = new Set(['HNR1','EUNL','LHA','ALV']);
  const CHANGED_IDS = new Set(['HNR1','EUNL']);
  const HNR_NEWS_TITLE = 'Monte Carlo: leicht rückläufige Preise, stabile Konditionen und selektive Wachstumschancen';

  const formatStamp = value => new Intl.DateTimeFormat('de-DE', {
    timeZone:'Europe/Berlin', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'
  }).format(new Date(value)).replace(',', ' ·');
  const upsert = (items, entry, same) => [entry].concat((items || []).filter(item => !same(item, entry)));
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function waitForHoldings() {
    for (let i = 0; i < 80; i += 1) {
      if (Array.isArray(holdings) && holdings.length === 12 && typeof renderCards === 'function' && typeof renderDetail === 'function') return;
      await sleep(250);
    }
    throw new Error('12 Holdings nicht vollständig geladen');
  }

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
      hnr.news = upsert(hnr.news, {
        date:'2026-09-07', sourceName:'Hannover Re / EQS', category:'Monte Carlo / Renewal-Ausblick',
        title:HNR_NEWS_TITLE,
        summary:'Hannover Rück erwartet für die Erneuerungen zum 1. Januar 2027 leicht rückläufige Preise bei überwiegend stabilen Konditionen. Der Wettbewerbsdruck nimmt zu, gleichzeitig sieht das Unternehmen bei risikoadäquater Bepreisung selektive Wachstumschancen; die Nachfrage nach hochwertigem Rückversicherungsschutz bleibt hoch.',
        impactText:'Leicht negativ; Stärke 1. Sinkende Preise begrenzen das Margenpotenzial, werden aber durch stabile Konditionen, disziplinierte Zeichnung und selektive Wachstumschancen teilweise kompensiert.',
        impact:-1,
        source:'https://www.eqs-news.com/news/corporate-news/hannover-rueck-sieht-profitable-wachstumsmoeglichkeiten-in-einem-zunehmend-anspruchsvollen-marktumfeld/4de3bbc2-6a42-4fcf-a767-fad99de13736_de'
      }, (a,b) => a.date === b.date && a.title === b.title);
      hnr.next = '17.09.2026 · Natixis FIG Conference, Paris';
      hnr.thesis = 'Operativ robuste Rückversicherung mit hoher Ergebnisqualität und attraktivem Ausschüttungsprofil. Der Investmentcase bleibt positiv, solange Schadenbudget, Reserven und Kapitalquote stabil bleiben. Der Monte-Carlo-Ausblick bestätigt jedoch zunehmenden Wettbewerb und leicht rückläufige Renewal-Preise; selektives Wachstum und stabile Konditionen begrenzen den Gegenwind.';
      if (!(hnr.tailwinds || []).some(x => x.includes('selektive Wachstumschancen'))) {
        hnr.tailwinds = ['Trotz zunehmenden Wettbewerbs sieht Hannover Rück selektive Wachstumschancen bei risikoadäquaten Preisen; Nachfrage und Konditionen bleiben in wichtigen Segmenten robust.'].concat(hnr.tailwinds || []);
      }
      if (!(hnr.risks || []).some(x => x.includes('Wettbewerbsdruck'))) {
        hnr.risks = ['Zunehmender Wettbewerbsdruck und leicht rückläufige Renewal-Preise können das Margen- und Gewinnwachstum im Schaden-Rückversicherungsgeschäft normalisieren.'].concat(hnr.risks || []);
      }
      hnr.analystNote = 'Rollierendes Vier-Monats-Fenster ab 07.05.2026, geprüft bis 07.09.2026 10:00 CEST. Hannover-Re-IR, FinanzNachrichten/dpa-AFX und MarketScreener wurden geprüft; keine neue belastbar verifizierte Einzelanalyse seit dem vorherigen EU-Lauf übernommen.';
      hnr.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 07.05.2026 geprüft. Offizielle IR-/Directors’-Dealings- und EQS-Quellen wurden geprüft; keine neue relevante Open-Market-Transaktion verifiziert.';
      hnr.lastChangedAt = STAMP;
      hnr.changedSections = ['News','Termin/Trigger','Rückenwind/Risiken','Investment-Einordnung'];
      hnr.updateStatus = 'updated';
      hnr.updateTag = 'NEU';
    }

    const etf = holdings.find(h => h.id === 'EUNL');
    if (etf) {
      etf.analystNote = 'Nicht anwendbar: ETF. Produktmerkmale am 07.09.2026 gegen iShares geprüft: ISIN IE00B4L5Y983, thesaurierend, TER 0,20 %, UCITS; 1.252 Fondspositionen, KGV 26,34 und KBV 4,15 per 03.09.2026; Anteilklassen-Nettovermögen 149,464 Mrd. USD per 04.09.2026.';
      etf.insiderNote = 'Nicht anwendbar: Ein ETF hat keine Unternehmensinsider.';
      etf.lastChangedAt = STAMP;
      etf.changedSections = ['Stammdaten'];
      etf.updateStatus = 'updated';
      etf.updateTag = 'AKTUALISIERT';
    }

    const lha = holdings.find(h => h.id === 'LHA');
    if (lha) {
      lha.analystNote = 'Rollierendes Vier-Monats-Fenster ab 07.05.2026, geprüft bis 07.09.2026 10:00 CEST. Lufthansa IR, FinanzNachrichten/dpa-AFX, MarketScreener und Onvista wurden erneut geprüft; seit der JPMorgan-Bestätigung Neutral / 7,50 EUR vom 04.09.2026 wurde keine neue belastbar verifizierte Einzelrevision übernommen.';
      lha.insiderNote = 'Lufthansa Directors’ Dealings und ergänzende Quellen wurden im rollierenden Vier-Monats-Fenster ab 07.05.2026 geprüft; keine neue meldepflichtige Open-Market-Transaktion verifiziert.';
    }

    const alv = holdings.find(h => h.id === 'ALV');
    if (alv) {
      alv.analystNote = 'Rollierendes Vier-Monats-Fenster ab 07.05.2026, geprüft bis 07.09.2026 10:00 CEST. Allianz IR, FinanzNachrichten/dpa-AFX und MarketScreener wurden erneut geprüft; keine neue belastbar verifizierte Einzelanalyse seit dem vorherigen EU-Lauf übernommen.';
      alv.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 07.05.2026. EQS/Directors’-Dealings und Allianz-IR wurden geprüft; keine neue diskretionäre Open-Market-Transaktion seit dem vorherigen EU-Lauf verifiziert.';
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
      chip.title = 'Teilaktualisierung: Die verbindliche Datei Holdings (1)(1).md war in dieser Laufzeit nicht als Conversation-Datei abrufbar. Der ausdrücklich bestätigte 12er-Bestand wurde deshalb gegen 12 Dashboard-IDs und 12 Marktdatensymbole abgeglichen; keine Position wurde entfernt.';
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
      document.querySelectorAll('#tab-events .news-item').forEach(item => {
        if ((item.textContent || '').includes(HNR_NEWS_TITLE)) addBadge(item.querySelector('h4'), 'NEU');
      });
    }
    if (selected === 'EUNL') {
      const note = document.querySelector('#tab-research .footnote');
      if (note) addBadge(note, 'AKTUALISIERT');
    }

    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 07.09.2026 · 10:00 · Quellen in jedem Eintrag';
  }

  async function boot() {
    await waitForHoldings();
    await sleep(12200);
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
    if (text) text.textContent = 'Inhalte: letzter erfolgreicher Stand 04.09.2026 · 17:00 · EU-Aktualisierung fehlgeschlagen';
  });
})();
