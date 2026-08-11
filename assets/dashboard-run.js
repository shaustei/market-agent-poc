(() => {
  const CONTENT_UPDATED_AT = '2026-08-11T10:00:00+02:00';
  const LAST_SUCCESSFUL_RUN_AT = '2026-08-11T10:00:00+02:00';
  const RUN_STATUS = 'partial';
  const CHECKED_IDS = new Set(['HNR1','EUNL','LHA','ALV']);
  const HISTORICAL_CORRECTION_AT = '2026-08-10T10:00:00+02:00';

  window.marketAgentUpdateMeta = {
    contentUpdatedAt: CONTENT_UPDATED_AT,
    lastSuccessfulRunAt: LAST_SUCCESSFUL_RUN_AT,
    status: RUN_STATUS
  };

  const formatStamp = value => new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(value)).replace(',', ' ·');

  const allianzContext = 'Vorstand · Vertragliches Eigeninvestment gemäß Vorstandsdienstvertrag · Außerhalb eines Handelsplatzes · EQS Directors’ Dealings, Erstmeldung · Kein discretionary Open-Market-Trade.';
  const allianzPrice = 369.30365;
  const allianzTrades = [
    {date:'2026-05-11',name:'Oliver Bäte',type:'Kauf (vertragliches Eigeninvestment)',shares:1327,price:allianzPrice,volume:490065.94,context:allianzContext,source:'https://www.eqs-news.com/news/directors-dealings/allianz-se-oliver-bate-acquisition-as-own-investment-of-the-members-of-the-board-of-management-according-to-the-contract-of-employment-as-a-member-of-the-board-of-management/d329f168-9779-4171-9118-9f6433d8ef3e_en'},
    {date:'2026-05-11',name:'Claire-Marie Anne Coste-Lepoutre',type:'Kauf (vertragliches Eigeninvestment)',shares:1455,price:allianzPrice,volume:537336.81,context:allianzContext,source:'https://www.eqs-news.com/news/directors-dealings/allianz-se-claire-marie-anne-coste-lepoutre-kauf-als-eigeninvestment-der-vorstaende-entsprechend-dem-vorstandsdienstvertrag/461c0951-9bd3-41b5-93fc-a3971d022a7e_de'},
    {date:'2026-05-11',name:'Christopher George Townsend',type:'Kauf (vertragliches Eigeninvestment)',shares:338,price:allianzPrice,volume:124824.63,context:allianzContext,source:'https://www.eqs-news.com/news/directors-dealings/allianz-se-christopher-george-townsend-kauf-als-eigeninvestment-der-vorstaende-entsprechend-dem-vorstandsdienstvertrag/a1ca5923-a63a-4759-bda1-edf6d60e97a0_de'},
    {date:'2026-05-11',name:'Dr. Barbara Karuth-Zelle',type:'Kauf (vertragliches Eigeninvestment)',shares:338,price:allianzPrice,volume:124824.63,context:allianzContext,source:'https://www.eqs-news.com/de/news/directors-dealings/allianz-se-dr-barbara-karuth-zelle-kauf-als-eigeninvestment-der-vorstaende-entsprechend-dem-vorstandsdienstvertrag/af819789-4d14-41e0-bdee-7b0e8eea68df_de'},
    {date:'2026-05-11',name:'Dr. Klaus-Peter Röhler',type:'Kauf (vertragliches Eigeninvestment)',shares:338,price:allianzPrice,volume:124824.63,context:allianzContext,source:'https://www.eqs-news.com/de/news/directors-dealings/allianz-se-dr-klaus-peter-roehler-kauf-als-eigeninvestment-der-vorstaende-entsprechend-dem-vorstandsdienstvertrag/17d490e8-1de2-4832-8bd0-d740865dbfcc_de'},
    {date:'2026-05-11',name:'Dr. Andreas Wimmer',type:'Kauf (vertragliches Eigeninvestment)',shares:338,price:allianzPrice,volume:124824.63,context:allianzContext,source:'https://www.eqs-news.com/de/news/directors-dealings/allianz-se-dr-andreas-wimmer-kauf-als-eigeninvestment-der-vorstaende-entsprechend-dem-vorstandsdienstvertrag/9985a4c2-1ca5-4054-921a-f6bede13b347_de'},
    {date:'2026-05-11',name:'Sirma Boshnakova',type:'Kauf (vertragliches Eigeninvestment)',shares:338,price:allianzPrice,volume:124824.63,context:allianzContext,source:'https://www.eqs-news.com/news/managers-transactions/allianz-se-sirma-boshnakova-kauf-als-eigeninvestment-der-vorstaende-entsprechend-dem-vorstandsdienstvertrag/c88448ff-cecc-4020-aa32-a35ba424c76b_de'},
    {date:'2026-05-11',name:'Dr. Günther Thallinger',type:'Kauf (vertragliches Eigeninvestment)',shares:338,price:allianzPrice,volume:124824.63,context:allianzContext,source:'https://www.eqs-news.com/de/news/directors-dealings/allianz-se-dr-gunther-thallinger-kauf-als-eigeninvestment-der-vorstande-entsprechend-dem-vorstandsdienstvertrag/39ca44fd-0503-4cc9-ae5a-ea8479032889'},
    {date:'2026-05-11',name:'Renate Wagner',type:'Kauf (vertragliches Eigeninvestment)',shares:338,price:allianzPrice,volume:124824.63,context:allianzContext,source:'https://www.eqs-news.com/de/news/directors-dealings/allianz-se-renate-wagner-kauf-als-eigeninvestment-der-vorstaende-entsprechend-dem-vorstandsdienstvertrag/60e2c8ce-1782-4813-9c34-c733c06600bd_de'}
  ];

  const hannoverTrade = {
    date:'2026-05-12', name:'Clemens Jungsthöfel', type:'Kauf (Open Market)', shares:1000,
    price:234, volume:234000,
    context:'Vorstand · Xetra (XETR) · EQS Directors’ Dealings, Erstmeldung · Open-Market-Kauf; kein Vesting, Steuerverkauf, Optionsvorgang oder automatischer Plan.',
    source:'https://www.eqs-news.com/de/news/directors-dealings/hannover-ruck-se-clemens-jungsthofel-buy/c5a0f424-27a2-4eb5-85c0-b075f0f179d6_en'
  };

  function setContentChip() {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (!chip || !text) return;
    text.textContent = `Inhalte: ${formatStamp(CONTENT_UPDATED_AT)}`;
    chip.classList.remove('status-ok','status-partial','status-error','status-closed');
    chip.classList.add('status-partial');
    chip.title = 'Teilaktualisierung: Holdings.md bzw. eine neuere Holdings-Datei war im Repository nicht verfügbar; der bestätigte 9er-Sollbestand wurde gegen Dashboard-IDs, Daten-JSONs und Marktdatensymbole geprüft.';
  }

  function applyHistoricalCorrections() {
    const hnr = holdings.find(h => h.id === 'HNR1');
    if (hnr) {
      hnr.insiders = [hannoverTrade].concat((hnr.insiders || []).filter(i => !(i.date === hannoverTrade.date && i.name === hannoverTrade.name)));
      hnr.insiderNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 11.08.2026 10:00 CEST. Verifiziert ist der Open-Market-Kauf von Vorstand Clemens Jungsthöfel am 12.05.2026 über 1.000 Aktien zu 234,00 EUR auf Xetra. EQS/Directors’ Dealings wurde zusätzlich auf neuere relevante Meldungen geprüft; bis zum Prüfzeitpunkt wurde keine weitere verifizierte Transaktion gefunden.';
      hnr.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 11.08.2026 10:00 CEST. FinanzNachrichten/dpa-AFX, MarketScreener und frei zugängliche Analyseübersichten wurden erneut geprüft; keine neuere belastbare Einzelanalyse mit Rating und Kursziel als die vorhandenen Einträge verifiziert. Öffentliche belastbare Trefferquoten einzelner Analysten waren nicht verfügbar.';
      hnr.lastChangedAt = HISTORICAL_CORRECTION_AT;
    }

    const lha = holdings.find(h => h.id === 'LHA');
    if (lha) {
      lha.next = '03.11.2026 · 3. Zwischenbericht Januar–September 2026';
      lha.advice = 'Halten; Margenerholung vor Zukauf abwarten.';
      lha.adviceWhy = 'Q2 zeigte einen deutlichen Ergebnisrückgang und der Jahresausblick wurde auf 1,7–2,2 Mrd. EUR bereinigtes EBIT eingegrenzt. Hohe Treibstoffkosten und Störungen belasten; der langfristige Margenpfad bleibt bestehen, ist kurzfristig aber mit hoher Unsicherheit behaftet.';
      lha.thesis = 'Zyklischer Turnaround-Case mit wertvollen Cargo-/MRO-Aktivitäten, aber hoher Kosten- und Ausführungsabhängigkeit. Q2 2026 bestätigte die Belastung durch Treibstoff und Störungen; der auf 1,7–2,2 Mrd. EUR eingegrenzte EBIT-Ausblick reduziert die kurzfristige Visibilität.';
      const q2News = {date:'2026-08-04',sourceName:'Lufthansa / Reuters',category:'Q2/H1-Ergebnis / Guidance',title:'Q2-Ergebnis fällt deutlich; Jahresausblick auf 1,7–2,2 Mrd. EUR EBIT eingegrenzt',summary:'Lufthansa erzielte im Q2 383 Mio. EUR bereinigtes EBIT nach 871 Mio. EUR im Vorjahr. Der Konzern erwartet für 2026 nun 1,7–2,2 Mrd. EUR bereinigtes EBIT. Hohe Treibstoffkosten und Störungen bleiben die wesentlichen Belastungsfaktoren.',impactText:'Negativ; Stärke 3. Der deutliche Ergebnisrückgang und die vorsichtigere Jahresbandbreite verschlechtern die kurzfristige Ergebnisvisibilität.',impact:-3,source:'https://www.reuters.com/business/lufthansa-sets-2026-profit-outlook-range-after-q2-ebit-hit-by-fuel-costs-2026-08-04/'};
      lha.news = [q2News].concat((lha.news || []).filter(n => !(n.date === q2News.date && n.title === q2News.title)));
      const q3Trigger = {date:'2026-11-03',title:'3. Zwischenbericht Januar–September 2026',background:'Nächster regulärer Finanzbericht. Im Fokus stehen Fuel-Kosten, Yield, Kapazität, operative Zuverlässigkeit, Free Cashflow und Einhaltung der EBIT-Bandbreite von 1,7–2,2 Mrd. EUR.',direction:'neutral',criteria:[1,1,0],source:'https://investor-relations.lufthansagroup.com/en/events/financial-calendar.html',sourceName:'Lufthansa IR',status:'bestätigt'};
      lha.triggers = [q3Trigger].concat((lha.triggers || []).filter(t => !(t.date === q3Trigger.date && t.title === q3Trigger.title)));
      lha.risks = ['Hohe Treibstoffkosten und geopolitische Störungen belasten die Ergebnisvisibilität; trotz Hedging wurde die EBIT-Erwartung 2026 auf 1,7–2,2 Mrd. EUR eingegrenzt.', ...(lha.risks || []).filter(v => !v.startsWith('Jet-Fuel-Preise und geopolitische Störungen'))];
      lha.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 11.08.2026 10:00 CEST. FinanzNachrichten/dpa-AFX, MarketScreener, Yahoo Finance, Onvista und die IR-Abdeckung wurden erneut geprüft; keine neuere belastbare Einzelanalyse mit Rating und Kursziel als die vorhandenen Einträge verifiziert.';
      lha.insiderNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 11.08.2026 10:00 CEST. Lufthansa IR/Directors’ Dealings und weitere Pflichtmeldungsquellen wurden erneut geprüft; keine neue verifizierte meldepflichtige Open-Market-Transaktion gefunden.';
      lha.lastChangedAt = HISTORICAL_CORRECTION_AT;
    }

    const alv = holdings.find(h => h.id === 'ALV');
    if (alv) {
      const keys = new Set(allianzTrades.map(i => `${i.date}|${i.name}`));
      alv.insiders = allianzTrades.concat((alv.insiders || []).filter(i => !keys.has(`${i.date}|${i.name}`)));
      alv.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 11.08.2026 10:00 CEST. FinanzNachrichten/dpa-AFX, MarketScreener und frei zugängliche Analyseübersichten wurden nach Q2 erneut geprüft; bis zum Prüfzeitpunkt wurde keine neue belastbare Einzelanalyse mit Rating und Kursziel nach dem 07.08. verifiziert. Bestehende valide Einträge bleiben erhalten.';
      alv.insiderNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 11.08.2026 10:00 CEST. Die offizielle Allianz-Directors’-Dealings-Seite und EQS wurden erneut geprüft. Die neun Vorstands-Eigeninvestments vom 11.05.2026 erfolgten gemäß Vorstandsdienstvertrag außerhalb eines Handelsplatzes und werden nicht als discretionary Open-Market-Kaufsignal gewertet; keine neuere verifizierte relevante Transaktion gefunden.';
      alv.lastChangedAt = HISTORICAL_CORRECTION_AT;
    }

    const etf = holdings.find(h => h.id === 'EUNL');
    if (etf) {
      etf.analystNote = 'Nicht anwendbar: Ein ETF hat keine unternehmensspezifischen Sell-Side-Kursziele. Relevanter sind Indexbewertung, Gewinnrevisionen, Tracking Difference, Kosten und Allokation.';
      etf.insiderNote = 'Nicht anwendbar: Ein ETF hat keine Unternehmensinsider.';
    }

    holdings.forEach(h => {
      if (!CHECKED_IDS.has(h.id)) return;
      h.lastCheckedAt = CONTENT_UPDATED_AT;
      h.changedSections = [];
      h.updateStatus = 'checked';
      delete h.updateTag;
    });
  }

  function markCardsCurrentRun() {
    document.querySelectorAll('.holding').forEach(card => {
      const h = holdings.find(x => x.id === card.dataset.id);
      card.classList.remove('content-changed','content-partial');
      if (h?.lastCheckedAt && CHECKED_IDS.has(h.id)) {
        card.title = `Letzte Inhaltsprüfung: ${formatStamp(h.lastCheckedAt)} · Keine inhaltliche Änderung`;
      }
    });
  }

  function markDetailCurrentRun() {
    document.querySelectorAll('.update-badge').forEach(el => el.remove());
  }

  function setFooterStamp() {
    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 11.08.2026 · 10:00 · Quellen in jedem Eintrag';
  }

  function installWrappers() {
    const baseCards = renderCards;
    renderCards = function(){ baseCards(); markCardsCurrentRun(); };
    const baseDetail = renderDetail;
    renderDetail = function(){ baseDetail(); markDetailCurrentRun(); };
  }

  async function boot() {
    for (let i = 0; i < 80 && (!Array.isArray(holdings) || holdings.length === 0); i++) await new Promise(r => setTimeout(r, 50));
    await new Promise(r => setTimeout(r, 150));
    setContentChip();
    setFooterStamp();
    applyHistoricalCorrections();
    installWrappers();
    renderCards();
    renderDetail();
  }

  boot().catch(() => {
    const chip = document.getElementById('content-state-chip');
    chip?.classList.remove('status-ok','status-partial','status-closed');
    chip?.classList.add('status-error');
    const text = document.getElementById('content-state');
    if (text) text.textContent = `Inhalte: ${formatStamp(LAST_SUCCESSFUL_RUN_AT)} · Warnung`;
  });
})();