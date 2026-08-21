(() => {
  const CONTENT_UPDATED_AT = '2026-08-21T10:00:00+02:00';
  const LAST_SUCCESSFUL_RUN_AT = '2026-08-21T10:00:00+02:00';
  const CHECKED_IDS = new Set(['HNR1','EUNL','LHA','ALV']);
  const CHANGED_IDS = new Set(['HNR1','LHA','ALV']);
  const FOUR_MONTH_CUTOFF = '2026-04-21';

  const formatStamp = value => new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(value)).replace(',', ' ·');

  const upsert = (list, item, key) => [item].concat((list || []).filter(x => key(x) !== key(item)));
  const analystKey = a => `${a.house}|${a.date}|${a.rating}|${a.target ?? ''}`;
  const insiderKey = i => `${i.date}|${i.name}|${i.type}|${i.volume ?? ''}`;

  function applyCurrentRun() {
    window.marketAgentUpdateMeta = {
      contentUpdatedAt: CONTENT_UPDATED_AT,
      lastSuccessfulRunAt: LAST_SUCCESSFUL_RUN_AT,
      status: 'partial'
    };

    holdings.forEach(h => {
      if (!CHECKED_IDS.has(h.id)) return;
      h.analysts = (h.analysts || []).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date >= FOUR_MONTH_CUTOFF);
      h.insiders = (h.insiders || []).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date >= FOUR_MONTH_CUTOFF);
      h.lastCheckedAt = CONTENT_UPDATED_AT;
      h.changedSections = [];
      h.updateStatus = 'checked';
      delete h.updateTag;
    });

    const hnr = holdings.find(h => h.id === 'HNR1');
    if (hnr) {
      [
        {house:'JPMorgan',date:'2026-08-13',rating:'Neutral',target:270,reason:'Kamran Hossain passte seine Schätzungen nach Q2 an und hob die Jahresüberschussprognose leicht an; sie liegt weiter über der bestätigten Unternehmensguidance.',quality:'Analyst: Kamran M Hossain · historische Güte: n. v.',source:'https://de.marketscreener.com/boerse-nachrichten/jpmorgan-belaesst-hannover-rueck-auf-neutral-ziel-270-euro-ce7859d9d08cf526'},
        {house:'Berenberg',date:'2026-08-13',rating:'Buy',target:330,reason:'Michael Christodoulou sieht Hannover Rück trotz schwächerem Rückversicherungsumfeld gut positioniert; Gewinnwachstum, Dividenden sowie Volumen- und Kostendisziplin stützen die Einschätzung.',quality:'Analyst: Michael Christodoulou · historische Güte: n. v.',source:'https://de.marketscreener.com/boerse-nachrichten/berenberg-belaesst-hannover-rueck-auf-buy-ziel-330-euro-ce7859d9db8df125'},
        {house:'RBC',date:'2026-08-13',rating:'Sector Perform',target:270,reason:'Ben Cohen sieht Q2 weitgehend im Rahmen und erwartet eine Umsatzerholung im zweiten Halbjahr; bis 2028 rechnet er jedoch mit annähernder EPS-Stagnation.',quality:'Analyst: Ben Cohen · historische Güte: n. v.',source:'https://de.marketscreener.com/boerse-nachrichten/rbc-belaesst-hannover-rueck-auf-sector-perform-ziel-270-euro-ce7859d9db89f426'},
        {house:'UBS',date:'2026-08-12',rating:'Buy',target:312,reason:'Will Hardcastle sah die Ergebniskennziffern über Konsens; die Großschäden lagen allerdings über seiner Prognose.',quality:'Analyst: Will Hardcastle · historische Güte: n. v.',source:'https://at.marketscreener.com/boerse-nachrichten/ubs-belaesst-hannover-rueck-auf-buy-ziel-312-euro-ce7859d8db8ef525'},
        {house:'Jefferies',date:'2026-08-12',rating:'Buy',target:360,reason:'Philip Kett bestätigte Buy und 360 EUR nach Q2; Preisrückgänge waren erwartet, während das laufende Vertragsvolumen deutlich zulegte.',quality:'Analyst: Philip Kett · historische Güte: n. v.',source:'https://de.marketscreener.com/boerse-nachrichten/jefferies-belaesst-hannover-rueck-auf-buy-ziel-360-euro-ce7859d8d88bfe2d'}
      ].forEach(a => { hnr.analysts = upsert(hnr.analysts, a, analystKey); });
      hnr.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 21.08.2026 10:00 CEST. Hannover-Re-IR, FinanzNachrichten/dpa-AFX, MarketScreener und frei zugängliche Analyseübersichten wurden geprüft; neue Post-Q2-Einschätzungen vom 12./13.08. wurden ergänzt.';
      hnr.insiderNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 21.08.2026 10:00 CEST. Der bereits verifizierte Open-Market-Kauf von Vorstand Clemens Jungsthöfel am 12.05.2026 bleibt gültig; keine neuere relevante Directors’-Dealings-Transaktion verifiziert.';
      hnr.changedSections = ['Analysten'];
      hnr.updateStatus = 'updated';
      hnr.updateTag = 'NEU';
      hnr.lastChangedAt = CONTENT_UPDATED_AT;
    }

    const lha = holdings.find(h => h.id === 'LHA');
    if (lha) {
      const barclays = {house:'Barclays',date:'2026-08-19',rating:'Underweight',target:7.5,reason:'Andrew Lobbenberg senkte das Ziel von 7,75 auf 7,50 EUR. Er hält selbst das reduzierte operative Jahresziel für optimistisch und sieht das Risiko einer weiteren Gewinnwarnung.',quality:'Analyst: Andrew Lobbenberg · historische Güte: n. v.',source:'https://at.marketscreener.com/boerse-nachrichten/barclays-senkt-ziel-fuer-lufthansa-auf-7-50-euro-underweight-ce7859d2d88ff32c'};
      lha.analysts = upsert(lha.analysts, barclays, analystKey);
      const vranckx = {date:'2026-08-07',name:'Dieter Vranckx',type:'Kauf · Open Market',shares:11000,price:8.342,volume:91762,context:'Vorstand; Erwerb von 11.000 Aktien zu 8,342 EUR auf Xetra. Meldepflichtiges Eigengeschäft; kein Vesting-, Steuerverkaufs-, Options- oder 10b5-1-Vorgang.',source:'https://www.nasdaq.com/press-release/deutsche-lufthansa-ag-dieter-vranckx-acquisition-2026-08-11'};
      lha.insiders = upsert(lha.insiders, vranckx, insiderKey);
      lha.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 21.08.2026 10:00 CEST. Lufthansa IR, FinanzNachrichten/dpa-AFX, MarketScreener, Yahoo Finance und Onvista wurden geprüft; Barclays vom 19.08. wurde ergänzt.';
      lha.insiderNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 21.08.2026 10:00 CEST. Neu aufgenommen: Vorstand Dieter Vranckx kaufte am 07.08.2026 auf Xetra 11.000 Aktien zu 8,342 EUR für 91.762 EUR. Keine neuere relevante Transaktion verifiziert.';
      lha.changedSections = ['Analysten','Insider'];
      lha.updateStatus = 'updated';
      lha.updateTag = 'NEU';
      lha.lastChangedAt = CONTENT_UPDATED_AT;
    }

    const alv = holdings.find(h => h.id === 'ALV');
    if (alv) {
      [
        {house:'Jefferies',date:'2026-08-17',rating:'Hold',target:325,reason:'Philip Kett bestätigte Hold und 325 EUR in seiner monatlichen Branchenbetrachtung zu Kursentwicklung und Konsensrevisionen im europäischen Versicherungssektor.',quality:'Analyst: Philip Kett · historische Güte: n. v.',source:'https://www.finanzen.at/analyse/allianz-hold-1101332'},
        {house:'JPMorgan',date:'2026-08-14',rating:'Neutral',target:460,reason:'Kamran M Hossain erhöhte das Ziel von 430 auf 460 EUR nach Q2 und hob operative Ergebnisprognosen bis 2028 an; das Kurspotenzial sieht er dennoch als begrenzt.',quality:'Analyst: Kamran M Hossain · historische Güte: n. v.',source:'https://at.marketscreener.com/boerse-nachrichten/jpmorgan-hebt-ziel-fuer-allianz-auf-460-euro-neutral-ce7859dfd988f523'},
        {house:'Goldman Sachs',date:'2026-08-13',rating:'Buy',target:465,reason:'Andrew Baker erhöhte das Ziel von 450 auf 465 EUR nach dem Quartalsbericht; ausschlaggebend war ein höher angesetzter materieller Buchwert.',quality:'Analyst: Andrew Baker · historische Güte: n. v.',source:'https://www.finanzen.at/analyse/allianz-buy-1100678'}
      ].forEach(a => { alv.analysts = upsert(alv.analysts, a, analystKey); });
      alv.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 21.08.2026 10:00 CEST. Allianz IR, FinanzNachrichten/dpa-AFX, MarketScreener und frei zugängliche Analyseübersichten wurden geprüft; Post-Q2-Revisionen von Goldman Sachs, JPMorgan und Jefferies wurden ergänzt.';
      alv.insiderNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 21.08.2026 10:00 CEST. Allianz Directors’ Dealings/EQS wurden erneut geprüft; keine neuere relevante Open-Market-Transaktion gegenüber dem vorhandenen Bestand verifiziert.';
      alv.changedSections = ['Analysten'];
      alv.updateStatus = 'updated';
      alv.updateTag = 'NEU';
      alv.lastChangedAt = CONTENT_UPDATED_AT;
    }

    const etf = holdings.find(h => h.id === 'EUNL');
    if (etf) {
      etf.analystNote = 'Nicht anwendbar: Ein ETF hat keine unternehmensspezifischen Sell-Side-Kursziele. Relevanter sind Indexbewertung, Gewinnrevisionen, Tracking Difference, Kosten und Allokation.';
      etf.insiderNote = 'Nicht anwendbar: Ein ETF hat keine Unternehmensinsider.';
    }
  }

  function badgeInto(el, label) {
    if (el && !el.querySelector('.update-badge')) el.insertAdjacentHTML('beforeend', ` <span class="update-badge update-new">${label}</span>`);
  }

  function markCurrentRun() {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip && text) {
      text.textContent = `Inhalte: ${formatStamp(CONTENT_UPDATED_AT)}`;
      chip.classList.remove('status-ok','status-partial','status-error','status-closed');
      chip.classList.add('status-partial');
      chip.title = 'Teilaktualisierung: Holdings.md bzw. eine neuere Holdings-Datei war im Repository nicht verfügbar; der bestätigte 9er-Sollbestand wurde gegen Dashboard-IDs, Daten-JSONs und Marktdatensymbole geprüft.';
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

    if (CHANGED_IDS.has(selected)) {
      document.querySelectorAll('#tab-research tbody tr').forEach(row => {
        const t = row.textContent || '';
        if ((selected === 'LHA' && (t.includes('19.08.2026') || t.includes('07.08.2026'))) ||
            (selected === 'ALV' && (t.includes('17.08.2026') || t.includes('14.08.2026') || t.includes('13.08.2026'))) ||
            (selected === 'HNR1' && (t.includes('13.08.2026') || t.includes('12.08.2026')))) {
          badgeInto(row.querySelector('td:first-child'), 'NEU');
        }
      });
    }

    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 21.08.2026 · 10:00 · Quellen in jedem Eintrag';
  }

  async function boot() {
    await new Promise(r => setTimeout(r, 320));
    applyCurrentRun();
    const baseCards = renderCards;
    renderCards = function(){ baseCards(); markCurrentRun(); };
    const baseDetail = renderDetail;
    renderDetail = function(){ baseDetail(); markCurrentRun(); };
    renderCards();
    renderDetail();
    markCurrentRun();

    setTimeout(() => {
      const latestCards = renderCards;
      renderCards = function(){ latestCards(); markCurrentRun(); };
      const latestDetail = renderDetail;
      renderDetail = function(){ latestDetail(); markCurrentRun(); };
      markCurrentRun();
    }, 700);
  }

  boot().catch(() => {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip) { chip.classList.remove('status-ok','status-partial','status-closed'); chip.classList.add('status-error'); }
    if (text) text.textContent = 'Inhalte: letzter erfolgreicher Stand 13.08.2026 · 10:00 · Aktualisierung fehlgeschlagen';
  });
})();