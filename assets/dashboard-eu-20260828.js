(() => {
  const STAMP = '2026-08-28T10:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-04-28';
  const CHECKED_IDS = new Set(['HNR1','EUNL','LHA','ALV']);
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
      hnr.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 28.08.2026 10:00 CEST. Hannover-Re-IR sowie frei zugängliche Analystenquellen wurden erneut geprüft; keine neue belastbar verifizierte Einzelanalyse gegenüber dem vorhandenen Stand übernommen.';
      hnr.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 28.04.2026 geprüft. Keine neuere relevante Open-Market-Directors’-Dealings-Transaktion gegenüber dem vorhandenen Bestand verifiziert.';
    }

    const lha = holdings.find(h => h.id === 'LHA');
    if (lha) {
      lha.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 28.08.2026 10:00 CEST. Lufthansa IR sowie frei zugängliche Analystenquellen wurden erneut geprüft; keine neue belastbar verifizierte Einzelanalyse gegenüber dem vorhandenen Stand übernommen.';
      lha.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 28.04.2026 geprüft. Lufthansa Directors’ Dealings wurde erneut geprüft; keine neuere relevante Open-Market-Transaktion gegenüber dem vorhandenen Bestand verifiziert.';
    }

    const etf = holdings.find(h => h.id === 'EUNL');
    if (etf) {
      etf.analystNote = 'Nicht anwendbar: Ein ETF hat keine unternehmensspezifischen Sell-Side-Kursziele. Produktmerkmale wurden zum 28.08.2026 gegen die iShares-Produktseite geprüft.';
      etf.insiderNote = 'Nicht anwendbar: Ein ETF hat keine Unternehmensinsider.';
    }

    const alv = holdings.find(h => h.id === 'ALV');
    if (alv) {
      alv.next = '12.11.2026 · Q3-Ergebnisse';
      alv.advice = 'Halten; operative Stärke bestätigt, Bewertung bleibt der zentrale Gegenpunkt.';
      alv.adviceWhy = 'Q2 2026 brachte einen Rekord beim operativen Gewinn, eine Solvency-II-Quote von 225 % und starke Nettozuflüsse im Asset Management. Gleichzeitig liegt die Aktie nahe ihrem Rekordhoch; die Morningstar-Abstufung auf Sell vom 27.08. unterstreicht das Bewertungsrisiko. Ein prozyklischer Zukauf ist daher weniger attraktiv als ein gestaffelter Einstieg bei Rücksetzern.';
      alv.thesis = 'Global diversifizierter Versicherer und Asset Manager mit hoher Kapitalstärke, belastbarer Ertragsbasis und klarer Ausschüttungspolitik. Q2 2026 bestätigt den Investmentcase mit Rekord-Operativgewinn, 225 % Solvency-II-Quote und starken Asset-Management-Zuflüssen; die hohe Bewertung begrenzt kurzfristig die Sicherheitsmarge.';

      const q2 = {
        date:'2026-08-07', sourceName:'Allianz IR', category:'Q2/H1-Ergebnis',
        title:'Rekord-Operativgewinn und stärkere Kapitalquote; Jahresziel bestätigt',
        summary:'Allianz steigerte den operativen Gewinn im Q2 um 10,6 % auf 4,874 Mrd. EUR. Das Geschäftsvolumen erreichte 45,6 Mrd. EUR, die Solvency-II-Quote 225 %. Im Asset Management lagen die Drittmittel-Nettozuflüsse bei 39 Mrd. EUR. Für 2026 bleibt das Ziel eines operativen Ergebnisses von 17,4 Mrd. EUR ±1 Mrd. EUR bestehen.',
        impactText:'Positiv; Stärke 3. Rekord-Operativgewinn, Kapitalstärke und starke Asset-Management-Zuflüsse bestätigen die Ertragsqualität. Die hohe Bewertung bleibt der wesentliche kurzfristige Gegenpunkt.',
        impact:3,
        source:'https://www.allianz.com/en/mediacenter/news/media-releases/financials/260807-2q-2026-earnings-release.html'
      };
      alv.news = upsert(alv.news, q2, (a,b) => a.date === b.date && a.title === b.title);

      const morningstar = {
        house:'Morningstar', date:'2026-08-27', rating:'Sell', target:null,
        reason:'Morningstar stufte Allianz am 27.08.2026 auf Sell ab. Die frei zugängliche Meldung nennt weder ein Kursziel noch eine Detailbegründung; deshalb werden diese Angaben nicht ergänzt.',
        quality:'Historische Güte: n. v.',
        source:'https://www.marketscreener.com/news/morningstar-downgrades-allianz-to-sell-rating-ce7858dedc8ef322'
      };
      alv.analysts = upsert(alv.analysts, morningstar, (a,b) => a.house === b.house && a.date === b.date);
      alv.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 28.08.2026 10:00 CEST. Morningstar stufte Allianz am 27.08.2026 auf Sell ab; die frei zugängliche Meldung enthält kein Kursziel und keine Detailbegründung. Bestehende valide Einträge bleiben erhalten.';
      alv.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 28.04.2026 geprüft. Offizielle Directors’-Dealings-/EQS-Quellen wurden erneut geprüft; keine neue klar verifizierte discretionary Open-Market-Transaktion gegenüber dem vorhandenen Bestand übernommen.';
      alv.tailwinds = [
        'Q2 2026 erreichte mit 4,874 Mrd. EUR einen Rekord beim operativen Quartalsgewinn; das Halbjahres-Operativergebnis lag bei 9,390 Mrd. EUR.',
        'Asset Management erzielte im Q2 39 Mrd. EUR Drittmittel-Nettozuflüsse; die Dritt-AuM erreichten 2,161 Bio. EUR.',
        'Die Solvency-II-Quote stieg auf 225 % und schafft hohen Puffer für Ausschüttungen, Wachstum und unerwartete Großschäden.',
        'Die Übernahme von HSBC Life Singapore und die 15-jährige exklusive HSBC-Vertriebspartnerschaft erweitern Kundenreichweite und Wachstumspotenzial im asiatisch-pazifischen Raum.'
      ];
      alv.risks = [
        'Die Aktie notiert nahe ihrem Rekordhoch; Morningstars Sell-Abstufung vom 27.08. unterstreicht das Bewertungs- und Sicherheitsmargenrisiko.',
        'Naturkatastrophen, Schadeninflation und Reservestärkungen können die Combined Ratio und das Quartalsergebnis deutlich belasten.',
        'Kapitalmarktvolatilität und Abflüsse bei PIMCO oder AllianzGI würden Gebühreneinnahmen und Ergebnisqualität im Asset Management schwächen.',
        'Die HSBC-Life-Singapore-Transaktion bindet bis zum Abschluss Kapital und Integrationskapazität und unterliegt regulatorischer Genehmigung.'
      ];
      alv.lastChangedAt = STAMP;
      alv.changedSections = ['Termin/Trigger','News','Analysten','Investment-Einordnung','Rückenwind/Risiken'];
      alv.updateStatus = 'updated';
      alv.updateTag = 'AKTUALISIERT';
    }
  }

  function markRun() {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip && text) {
      text.textContent = `Inhalte: ${formatStamp(STAMP)}`;
      chip.classList.remove('status-ok','status-partial','status-error','status-closed');
      chip.classList.add('status-partial');
      chip.title = 'Teilaktualisierung: Die Holdings-Primärquelle im Projektchat Investment & Trading ist in dieser Ausführung technisch nicht direkt lesbar. Der im Auftrag bestätigte 9er-Bestand wurde gegen Daten-JSONs, Dashboard-IDs und Marktdatensymbole geprüft; keine Position wurde entfernt.';
    }

    document.querySelectorAll('.update-badge').forEach(el => el.remove());
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

    const alv = holdings.find(h => h.id === 'ALV');
    if (selected === 'ALV' && alv?.updateTag) {
      const heading = document.querySelector('#tab-research h3');
      if (heading && !heading.querySelector('.update-badge')) {
        const badge = document.createElement('span');
        badge.className = 'update-badge';
        badge.textContent = alv.updateTag;
        heading.appendChild(badge);
      }
    }

    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 28.08.2026 · 10:00 · Quellen in jedem Eintrag';
  }

  async function boot() {
    await new Promise(r => setTimeout(r, 1900));
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
    if (text) text.textContent = 'Inhalte: letzter erfolgreicher Stand 27.08.2026 · 17:00 · Aktualisierung fehlgeschlagen';
  });
})();
