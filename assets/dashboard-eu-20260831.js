(() => {
  const STAMP = '2026-08-31T10:03:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-05-01';
  const CHECKED_IDS = new Set(['HNR1','EUNL','LHA','ALV']);
  const NEW_ALLIANZ_NEWS_TITLE = 'Allianz prüft laut Reuters/Sky eine mögliche Übernahme der britischen AA';
  const formatStamp = value => new Intl.DateTimeFormat('de-DE', {
    timeZone:'Europe/Berlin', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'
  }).format(new Date(value)).replace(',', ' ·');
  const upsert = (items, entry, same) => [entry].concat((items || []).filter(item => !same(item, entry)));

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

    const hnr = holdings.find(h => h.id === 'HNR1');
    if (hnr) {
      hnr.next = '01.09.2026 · Commerzbank / ODDO BHF Corporate Conference';
      hnr.analystNote = 'Rollierendes Vier-Monats-Fenster ab 01.05.2026, geprüft bis 31.08.2026 10:03 CEST. Hannover-Re-IR, dpa-AFX/FinanzNachrichten und weitere frei zugängliche Analystenquellen wurden geprüft; keine neue belastbar verifizierte Einzelanalyse seit dem vorherigen Lauf übernommen.';
      hnr.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 01.05.2026 geprüft. Keine neue relevante Open-Market-Directors’-Dealings-Transaktion gegenüber dem vorhandenen Bestand verifiziert.';
    }

    const lha = holdings.find(h => h.id === 'LHA');
    if (lha) {
      lha.analystNote = 'Rollierendes Vier-Monats-Fenster ab 01.05.2026, geprüft bis 31.08.2026 10:03 CEST. Lufthansa IR sowie dpa-AFX/FinanzNachrichten und weitere frei zugängliche Analystenquellen wurden erneut geprüft; keine neue belastbar verifizierte Einzelanalyse seit dem vorherigen Lauf übernommen.';
      lha.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 01.05.2026 geprüft. Lufthansa Directors’ Dealings wurde erneut geprüft; keine neue relevante Open-Market-Transaktion gegenüber dem vorhandenen Bestand verifiziert.';
    }

    const etf = holdings.find(h => h.id === 'EUNL');
    if (etf) {
      etf.analystNote = 'Nicht anwendbar: Ein ETF hat keine unternehmensspezifischen Sell-Side-Kursziele. Produktmerkmale wurden erneut gegen die iShares-Produktinformation geprüft.';
      etf.insiderNote = 'Nicht anwendbar: Ein ETF hat keine Unternehmensinsider.';
    }

    const alv = holdings.find(h => h.id === 'ALV');
    if (alv) {
      const aaNews = {
        date:'2026-08-29', sourceName:'Reuters / Sky News', category:'M&A / Medienbericht',
        title:NEW_ALLIANZ_NEWS_TITLE,
        summary:'Reuters berichtet unter Berufung auf Sky News, Allianz prüfe eine mögliche Übernahme des britischen Pannenhilfe- und Versicherungsdienstleisters AA für rund 5 Mrd. GBP. Allianz gehört dem Bericht zufolge zu mehreren Interessenten; ein Angebot ist nicht bestätigt. Allianz und AA lehnten einen Kommentar ab.',
        impactText:'Neutral bis leicht negativ; Stärke 2. Strategisch könnte AA die britische Privatkundendistribution verbreitern. Solange kein bestätigtes Angebot vorliegt, dominieren Unsicherheit über Kaufpreis, Kapitalbindung und Integrationsrisiko; die operative Allianz-Guidance ändert sich dadurch nicht.',
        impact:-2,
        source:'https://www.reuters.com/legal/transactional/german-insurer-allianz-weighs-677-billion-takeover-aa-roadside-rescue-giant-sky-2026-08-29/'
      };
      alv.news = upsert(alv.news, aaNews, (a,b) => a.date === b.date && a.title === b.title);
      alv.adviceWhy = 'Q2 2026 bestätigt hohe Ertrags- und Kapitalstärke. Der Reuters/Sky-Bericht über eine mögliche AA-Übernahme ist bislang unbestätigt und ändert die operative Guidance nicht, erhöht aber kurzfristig die Unsicherheit über Kapitalbindung und Transaktionsdisziplin. Zukäufe bleiben daher eher bei Rücksetzern als prozyklisch attraktiv.';
      alv.risks = [
        'Ein mögliches Gebot für die britische AA von rund 5 Mrd. GBP ist bislang nur berichtet, nicht bestätigt. Ein hoher Kaufpreis könnte Kapital binden und Integrations- sowie Ausführungsrisiken erhöhen.',
        'Die Aktie notiert nahe ihrem Rekordhoch; Morningstars Sell-Abstufung vom 27.08. unterstreicht das Bewertungs- und Sicherheitsmargenrisiko.',
        'Naturkatastrophen, Schadeninflation und Reservestärkungen können die Combined Ratio und das Quartalsergebnis deutlich belasten.',
        'Kapitalmarktvolatilität und Abflüsse bei PIMCO oder AllianzGI würden Gebühreneinnahmen und Ergebnisqualität im Asset Management schwächen.'
      ];
      alv.analystNote = 'Rollierendes Vier-Monats-Fenster ab 01.05.2026, geprüft bis 31.08.2026 10:03 CEST. Seit Morningstars Sell-Abstufung vom 27.08. wurde keine neuere belastbar verifizierte Einzelanalyse übernommen; bestehende valide Einträge bleiben erhalten.';
      alv.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 01.05.2026 geprüft. Offizielle Directors’-Dealings-/EQS-Quellen wurden erneut geprüft; keine neue klar verifizierte discretionary Open-Market-Transaktion gegenüber dem vorhandenen Bestand übernommen.';
      alv.lastChangedAt = STAMP;
      alv.changedSections = ['News','Investment-Einordnung','Rückenwind/Risiken'];
      alv.updateStatus = 'updated';
      alv.updateTag = 'NEU';
    }
  }

  function markDetailBadges() {
    document.querySelectorAll('.news-item h4').forEach(h4 => {
      if (h4.textContent.trim() !== NEW_ALLIANZ_NEWS_TITLE || h4.querySelector('.update-badge')) return;
      const badge = document.createElement('span');
      badge.className = 'update-badge update-new';
      badge.textContent = 'NEU';
      h4.prepend(badge);
    });
  }

  function markRun() {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip && text) {
      text.textContent = `Inhalte: ${formatStamp(STAMP)}`;
      chip.classList.remove('status-ok','status-partial','status-error','status-closed');
      chip.classList.add('status-partial');
      chip.title = 'Teilaktualisierung: Der im Auftrag bestätigte 9er-Bestand ist gegen Daten-JSONs, Dashboard-IDs und Marktdatensymbole konsistent. Die separate Holdings-Datei im Projektchat ist in dieser Ausführung nicht direkt abrufbar; deshalb wurde keine Bestandslöschung vorgenommen.';
    }

    document.querySelectorAll('.holding').forEach(card => {
      card.classList.remove('content-changed','content-partial');
      const h = holdings.find(x => x.id === card.dataset.id);
      if (h?.updateStatus === 'updated') {
        card.classList.add('content-changed');
        card.title = `Inhaltlich aktualisiert: ${formatStamp(h.lastChangedAt)} · ${h.changedSections.join(', ')}`;
      } else if (h?.lastCheckedAt && CHECKED_IDS.has(h.id)) {
        card.title = `Letzte Inhaltsprüfung: ${formatStamp(h.lastCheckedAt)} · Keine inhaltliche Änderung`;
      }
    });

    markDetailBadges();
    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 31.08.2026 · 10:03 · Quellen in jedem Eintrag';
  }

  async function boot() {
    await new Promise(r => setTimeout(r, 2300));
    applyRun();
    const baseCards = renderCards;
    renderCards = function(){ baseCards(); markRun(); };
    const baseDetail = renderDetail;
    renderDetail = function(){ baseDetail(); markRun(); };
    renderCards();
    renderDetail();
    markRun();
  }

  boot().catch(() => {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip) { chip.classList.remove('status-ok','status-partial','status-closed'); chip.classList.add('status-error'); }
    if (text) text.textContent = 'Inhalte: letzter erfolgreicher Stand 28.08.2026 · 17:00 · Aktualisierung fehlgeschlagen';
  });
})();
