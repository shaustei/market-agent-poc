(() => {
  const STAMP = '2026-09-02T10:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-05-02';
  const CHECKED_IDS = new Set(['HNR1','EUNL','LHA','ALV']);
  const CHANGED_IDS = new Set(['EUNL','LHA']);
  const EUNL_TITLE = 'Öl- und Renditeschock belastet globale Aktienmärkte';
  const LHA_TAP_TITLE = 'TAP-Privatisierung: Bewertung der verbindlichen Angebote liegt der Regierung vor';
  const LHA_OIL_TITLE = 'Brent über 95 USD verschärft den Kostendruck für Airlines';

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
      hnr.next = '07.09.2026 · Monte Carlo Pressefrühstück';
      hnr.analystNote = 'Rollierendes Vier-Monats-Fenster ab 02.05.2026, geprüft bis 02.09.2026 10:00 CEST. Hannover-Re-IR, FinanzNachrichten/dpa-AFX, MarketScreener und Onvista wurden geprüft; keine neue bis zum Prüfzeitpunkt belastbar verifizierte Einzelanalyse gegenüber dem vorhandenen Bestand übernommen.';
      hnr.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 02.05.2026 geprüft. Offizielle IR-/Directors’-Dealings-Quellen wurden geprüft; keine neue relevante Open-Market-Transaktion verifiziert.';
    }

    const etf = holdings.find(h => h.id === 'EUNL');
    if (etf) {
      const macro = {
        date:'2026-09-02', sourceName:'Reuters', category:'Makro / Markt',
        title:EUNL_TITLE,
        summary:'Erneute US-Iran-Angriffe trieben Brent auf rund 95 USD und globale Anleiherenditen deutlich nach oben. Asiatische Aktienmärkte gaben kräftig nach; europäische Futures signalisierten ebenfalls einen schwächeren Start. Höhere Energiepreise und Renditen erhöhen kurzfristig den Bewertungsdruck auf globale Aktien.',
        impactText:'Negativ kurzfristig; Stärke 2. Der Schock wirkt breit über Zinsen, Inflationserwartungen und Risikoappetit. Die globale Diversifikation des ETF begrenzt Einzeltitelrisiken, nicht aber systemische Marktbewegungen.',
        impact:-2,
        source:'https://www.reuters.com/world/china/global-markets-wrapup-1-2026-09-02/'
      };
      etf.news = upsert(etf.news, macro, (a,b) => a.date === b.date && a.title === b.title);
      etf.analystNote = 'Nicht anwendbar: ETF. Produktmerkmale am 02.09.2026 gegen iShares geprüft: ISIN IE00B4L5Y983, thesaurierend, TER 0,20 %, UCITS; 1.279 Positionen per 28.08.2026.';
      etf.insiderNote = 'Nicht anwendbar: Ein ETF hat keine Unternehmensinsider.';
      etf.lastChangedAt = STAMP;
      etf.changedSections = ['News'];
      etf.updateStatus = 'updated';
      etf.updateTag = 'NEU';
    }

    const lha = holdings.find(h => h.id === 'LHA');
    if (lha) {
      const tap = {
        date:'2026-09-01', sourceName:'Reuters', category:'M&A / TAP',
        title:LHA_TAP_TITLE,
        summary:'Die portugiesische Staatsholding Parpublica hat der Regierung ihre Bewertung der verbindlichen Angebote von Lufthansa und Air France-KLM für eine Minderheitsbeteiligung an TAP übermittelt. Damit ist das Verfahren einen Schritt weiter; Käufer, Preis und endgültige Entscheidung sind weiterhin offen.',
        impactText:'Neutral; Stärke 2. Der Prozess wird konkreter und kann strategischen Atlantik-Zugang schaffen. Ohne Entscheidung und Kaufpreis bleiben Kapitalbindungs- und Integrationsrisiken jedoch unverändert wesentlich.',
        impact:0,
        source:'https://www.reuters.com/business/portugal-receives-assessment-binding-bids-flag-carrier-tap-privatisation-2026-09-01/'
      };
      const oil = {
        date:'2026-09-02', sourceName:'Reuters', category:'Öl / Geopolitik',
        title:LHA_OIL_TITLE,
        summary:'Brent stieg am 2. September auf rund 95,45 USD je Barrel, nachdem neue US-Iran-Angriffe die Sorge um die Straße von Hormus und die globale Energieversorgung verschärften. Gleichzeitig stiegen Anleiherenditen deutlich.',
        impactText:'Negativ; Stärke 3. Höhere Kerosinpreise wirken direkt auf die Kostenbasis der Airlines. Lufthansa ist durch Hedging teilweise geschützt, bleibt aber bei länger anhaltend hohen Preisen, Streckenstörungen und schwächerem Risikoappetit exponiert.',
        impact:-3,
        source:'https://www.reuters.com/world/china/global-markets-wrapup-1-2026-09-02/'
      };
      lha.news = upsert(lha.news, tap, (a,b) => a.date === b.date && a.title === b.title);
      lha.news = upsert(lha.news, oil, (a,b) => a.date === b.date && a.title === b.title);
      lha.next = '02.09.2026 · Commerzbank & ODDO BHF Conference';
      lha.advice = 'Halten; erst bei klarerer Margen- und Treibstoffkostenvisibilität aufstocken.';
      lha.adviceWhy = 'Robuste Nachfrage, Cargo und Technik stützen, aber Brent über 95 USD verschärft kurzfristig den Kosten- und Inflationsdruck. Die TAP-Privatisierung ist einen Schritt weiter, Kaufpreis und Zuschlag sind jedoch offen. Ein Zukauf benötigt mehr Sichtbarkeit bei Marge, Kerosin und Kapitalbindung.';
      if (!(lha.risks || []).some(x => x.includes('Brent über 95 USD'))) {
        lha.risks = ['Brent über 95 USD erhöht trotz Hedging den Treibstoffkostendruck; bei länger anhaltend hohen Preisen steigen Margen-, Ticketpreis- und Nachfragerisiken.'].concat(lha.risks || []);
      }
      lha.analystNote = 'Rollierendes Vier-Monats-Fenster ab 02.05.2026, geprüft bis 02.09.2026 10:00 CEST. Lufthansa IR, FinanzNachrichten/dpa-AFX, MarketScreener und Onvista wurden geprüft; keine neue bis zum Prüfzeitpunkt veröffentlichte belastbar verifizierte Einzelanalyse gegenüber dem vorhandenen Bestand übernommen. Später datierte Veröffentlichungen wurden nicht vorweggenommen.';
      lha.insiderNote = 'Lufthansa Directors’ Dealings wurde geprüft. Im rollierenden Vier-Monats-Fenster ab 02.05.2026 wurde keine neue meldepflichtige Open-Market-Transaktion gefunden; die IR-Seite weist als jüngste Directors’-Dealings-Meldungen Vorgänge aus 03/2026 aus.';
      lha.lastChangedAt = STAMP;
      lha.changedSections = ['News','Rückenwind/Risiken','Investment-Einordnung'];
      lha.updateStatus = 'updated';
      lha.updateTag = 'NEU';
    }

    const alv = holdings.find(h => h.id === 'ALV');
    if (alv) {
      alv.analystNote = 'Rollierendes Vier-Monats-Fenster ab 02.05.2026, geprüft bis 02.09.2026 10:00 CEST. Allianz IR, FinanzNachrichten/dpa-AFX, MarketScreener und Onvista wurden geprüft; Morningstar vom 27.08. bleibt der jüngste bereits erfasste belastbare Einzelhinweis. Keine neue Analyse bis zum Prüfzeitpunkt übernommen.';
      alv.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 02.05.2026. EQS/Directors’-Dealings und Allianz-IR wurden geprüft; keine neuere discretionary Open-Market-Transaktion gegenüber dem vorhandenen Bestand verifiziert.';
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
      chip.title = 'Teilaktualisierung: In den verfügbaren Gesprächsdateien und im Repository war keine aktuelle Holdings.md auffindbar. Der im Auftrag bestätigte 9er-Bestand wurde deshalb vollständig gegen Daten-JSONs, Dashboard-IDs und Marktdatensymbole abgeglichen; keine Position wurde entfernt.';
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
      document.querySelectorAll('#tab-events .news-item').forEach(item => {
        if ((item.textContent || '').includes(EUNL_TITLE)) addBadge(item.querySelector('h4'), 'NEU');
      });
    }
    if (selected === 'LHA') {
      document.querySelectorAll('#tab-events .news-item').forEach(item => {
        const t = item.textContent || '';
        if (t.includes(LHA_TAP_TITLE) || t.includes(LHA_OIL_TITLE)) addBadge(item.querySelector('h4'), 'NEU');
      });
    }

    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 02.09.2026 · 10:00 · Quellen in jedem Eintrag';
  }

  async function boot() {
    await new Promise(r => setTimeout(r, 9000));
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
    if (text) text.textContent = 'Inhalte: letzter erfolgreicher Stand 01.09.2026 · 17:00 · Aktualisierung fehlgeschlagen';
  });
})();