(() => {
  const STAMP = '2026-08-31T17:10:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-04-30';
  const CHECKED_IDS = new Set(['CAT','JBL','LMT','MCD','AMZN']);
  const CHANGED_IDS = new Set(['LMT','AMZN']);

  const formatStamp = value => new Intl.DateTimeFormat('de-DE', {
    timeZone:'Europe/Berlin', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'
  }).format(new Date(value)).replace(',', ' ·');
  const upsert = (list, item, key) => [item].concat((list || []).filter(x => key(x) !== key(item)));
  const analystKey = a => `${a.house}|${a.date}|${a.rating}|${a.target ?? ''}`;
  const newsKey = n => `${n.date}|${n.title}`;

  function applyRun() {
    window.marketAgentUpdateMeta = {
      contentUpdatedAt: STAMP,
      lastSuccessfulRunAt: STAMP,
      status: 'partial'
    };

    holdings.forEach(h => {
      if (!CHECKED_IDS.has(h.id)) return;
      h.analysts = (h.analysts || []).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date >= FOUR_MONTH_CUTOFF);
      h.insiders = (h.insiders || []).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date >= FOUR_MONTH_CUTOFF);
      h.lastCheckedAt = STAMP;
      h.changedSections = [];
      h.updateStatus = 'checked';
      delete h.updateTag;
    });

    const cat = holdings.find(h => h.id === 'CAT');
    if (cat) {
      cat.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 31.08.2026 17:10 CEST. Caterpillar IR, MarketBeat/MarketScreener und ergänzende frei zugängliche Ratingquellen wurden geprüft; seit dem letzten US-Lauf keine neue belastbar verifizierte materielle Einzelanalyse übernommen.';
      cat.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 30.04.2026 geprüft. SEC Form 4 und ergänzende Insiderquellen wurden geprüft; keine neue relevante Open-Market-Transaktion seit dem letzten US-Lauf verifiziert.';
    }

    const jbl = holdings.find(h => h.id === 'JBL');
    if (jbl) {
      jbl.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 31.08.2026 17:10 CEST. Jabil IR, MarketBeat/MarketScreener und ergänzende Ratingquellen wurden geprüft; keine neue belastbar verifizierte materielle Sell-Side-Revision seit dem letzten US-Lauf übernommen.';
      jbl.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 30.04.2026 geprüft. SEC Form 4 und ergänzende Insiderquellen wurden geprüft; keine neue relevante Open-Market-Transaktion verifiziert. Institutionelle 13F-Meldungen werden nicht als Insidertrades gewertet.';
    }

    const lmt = holdings.find(h => h.id === 'LMT');
    if (lmt) {
      const production = {
        date:'2026-08-31', sourceName:'U.S. Department of War', category:'Auftrag / Lieferkette',
        title:'Siebenjährige Vereinbarungen sollen PAC-3- und THAAD-Produktion beschleunigen',
        summary:'Das U.S. Department of War meldete siebenjährige Vereinbarungen mit Lockheed Martin und General Dynamics Ordnance and Tactical Systems zur Ausweitung und Beschleunigung kritischer Komponenten für PAC-3 MSE und THAAD. Die Maßnahme stärkt die industrielle Lieferkette für bereits stark nachgefragte Raketenabwehrprogramme; ein zusätzlicher, Lockheed-spezifischer Vertragswert wurde in der Meldung nicht beziffert.',
        impactText:'Positiv für Produktionsvisibilität und Lieferkettenrobustheit; Stärke 2, da die strategische Wirkung klar ist, aber kein zusätzlicher Lockheed-spezifischer Umsatzwert veröffentlicht wurde.',
        impact:2,
        source:'https://www.war.gov/News/Releases/Release/Article/4586205/dow-secures-7-year-agreements-with-general-dynamics-and-lockheed-martin-to-trip/'
      };
      lmt.news = upsert(lmt.news, production, newsKey);
      if (!(lmt.tailwinds || []).some(x => x.includes('Lieferkettenrobustheit'))) {
        lmt.tailwinds = ['Die am 31.08. angekündigten siebenjährigen DoW-Vereinbarungen erhöhen die Lieferkettenrobustheit für PAC-3 MSE und THAAD und unterstützen die geplanten Produktionsrampen.'].concat(lmt.tailwinds || []);
      }
      lmt.thesis = 'Hoher Auftragsbestand, beschleunigte Munitionsproduktion und steigende Verteidigungsbudgets stützen den langfristigen Case. Die am 31.08. angekündigten siebenjährigen DoW-Vereinbarungen zur Ausweitung kritischer PAC-3-/THAAD-Komponenten verbessern zusätzlich die Lieferketten- und Produktionsvisibilität. Q2 2026 bestätigte eine deutlich bessere operative Entwicklung; Programmausführung, Bewertung und Cash Conversion bleiben die zentralen Kontrollpunkte.';
      lmt.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 31.08.2026 17:10 CEST. Lockheed-Martin-IR, MarketBeat/MarketScreener und weitere frei zugängliche Analystenquellen wurden geprüft; keine neue belastbar verifizierte materielle Sell-Side-Einzelanalyse seit dem letzten US-Lauf übernommen.';
      lmt.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 30.04.2026 geprüft. SEC Form 4 und ergänzende Insiderquellen wurden geprüft; institutionelle Beteiligungsmeldungen werden nicht als Insidertransaktionen gewertet. Keine neue relevante Open-Market-Transaktion verifiziert.';
      lmt.changedSections = ['News','Investment-Einordnung','Rückenwind/Risiken'];
      lmt.updateStatus = 'updated';
      lmt.updateTag = 'NEU';
      lmt.lastChangedAt = STAMP;
    }

    const mcd = holdings.find(h => h.id === 'MCD');
    if (mcd) {
      mcd.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 31.08.2026 17:10 CEST. McDonald’s IR, MarketBeat/MarketScreener und ergänzende Analystenquellen wurden geprüft; die zuletzt verifizierten Revisionen vom 26.08. bleiben im Bestand, seit dem letzten US-Lauf keine neue materielle Einzelanalyse übernommen.';
      mcd.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 30.04.2026 geprüft. SEC Form 4 und ergänzende Insiderquellen wurden geprüft; keine neue relevante Open-Market-Transaktion verifiziert. Institutionelle Fondsbewegungen sind keine Insidertransaktionen.';
    }

    const amzn = holdings.find(h => h.id === 'AMZN');
    if (amzn) {
      const evercore = {
        house:'Evercore ISI', date:'2026-08-28', rating:'Outperform', target:355,
        reason:'Analyst Mark Mahaney erhöhte das 12-Monats-Kursziel von rund 315 auf 355 USD und bestätigte Outperform. Begründung: Evercores Online-Retail-Umfrage sieht zusätzliche Nachfrage durch Alexa/Agentic AI sowie starke Same-Day-Nutzung und anhaltende Retail-Reichweite.',
        quality:'Analyst Mark Mahaney · belastbare historische Güte öffentlich nicht einheitlich verifizierbar: n. v.',
        source:'https://uk.investing.com/news/stock-market-news/evercore-isi-raises-amazon-stock-price-target-on-ai-survey-results-93CH-4851066'
      };
      amzn.analysts = upsert(amzn.analysts, evercore, analystKey);
      amzn.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 31.08.2026 17:10 CEST. Neu aufgenommen: Evercore ISI / Mark Mahaney, Outperform, Kursziel 355 USD vom 28.08.2026. Amazon IR, MarketBeat/MarketScreener, Yahoo Finance und ergänzende frei zugängliche Quellen wurden geprüft.';
      amzn.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 30.04.2026 geprüft. SEC Form 4 und ergänzende Insiderquellen wurden geprüft; keine neue relevante diskretionäre Open-Market-Transaktion seit dem letzten US-Lauf verifiziert. Plan-/Vesting-Vorgänge werden separat eingeordnet.';
      amzn.changedSections = ['Analysten'];
      amzn.updateStatus = 'updated';
      amzn.updateTag = 'NEU';
      amzn.lastChangedAt = STAMP;
    }
  }

  function badgeInto(el, label) {
    if (el && !el.querySelector('.update-badge')) el.insertAdjacentHTML('beforeend', ` <span class="update-badge update-new">${label}</span>`);
  }

  function markRun() {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip && text) {
      text.textContent = `Inhalte: ${formatStamp(STAMP)}`;
      chip.classList.remove('status-ok','status-partial','status-error','status-closed');
      chip.classList.add('status-partial');
      chip.title = 'Teilaktualisierung: Der im aktuellen Auftrag bestätigte 9er-Bestand ist gegen Daten-JSONs, Dashboard-IDs und Marktdatensymbole konsistent. Die separate Holdings-Primärquelle im Projektchat ist in dieser Ausführung technisch nicht direkt lesbar.';
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

    if (selected === 'LMT') {
      document.querySelectorAll('#tab-events .news-item').forEach(item => {
        const t = item.textContent || '';
        if (t.includes('Siebenjährige Vereinbarungen') && t.includes('31.08.2026')) badgeInto(item.querySelector('h4'), 'NEU');
      });
    }
    if (selected === 'AMZN') {
      document.querySelectorAll('#tab-research tbody tr').forEach(row => {
        const t = row.textContent || '';
        if (t.includes('Evercore ISI') && t.includes('28.08.2026')) badgeInto(row.querySelector('td:first-child'), 'NEU');
      });
    }

    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 31.08.2026 · 17:10 · Quellen in jedem Eintrag';
  }

  async function boot() {
    await new Promise(r => setTimeout(r, 3600));
    applyRun();
    const baseCards = renderCards;
    renderCards = function(){ baseCards(); markRun(); };
    const baseDetail = renderDetail;
    renderDetail = function(){ baseDetail(); markRun(); };
    renderCards();
    renderDetail();
    markRun();

    setTimeout(() => {
      const latestCards = renderCards;
      renderCards = function(){ latestCards(); markRun(); };
      const latestDetail = renderDetail;
      renderDetail = function(){ latestDetail(); markRun(); };
      markRun();
    }, 1200);
  }

  boot().catch(() => {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip) { chip.classList.remove('status-ok','status-partial','status-closed'); chip.classList.add('status-error'); }
    if (text) text.textContent = 'Inhalte: letzter erfolgreicher Stand 31.08.2026 · 10:03 · Aktualisierung fehlgeschlagen';
  });
})();