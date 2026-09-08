(() => {
  const STAMP = '2026-09-08T17:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-05-08';
  const CHECKED_IDS = new Set(['CAT','JBL','LMT','MCD','AMZN','MEDP','NTAP','RNG']);
  const CHANGED_IDS = new Set(['NTAP','RNG']);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const formatStamp = value => new Intl.DateTimeFormat('de-DE', {timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(value)).replace(',', ' ·');
  const upsert = (items, entry, same) => [entry].concat((items || []).filter(item => !same(item, entry)));

  async function waitForHoldings() {
    for (let i = 0; i < 80; i += 1) {
      try { if (Array.isArray(holdings) && holdings.length === 12 && typeof renderCards === 'function' && typeof renderDetail === 'function') return true; } catch (_) {}
      await sleep(250);
    }
    return false;
  }

  function addAnalyst(h, entry) {
    h.analysts = upsert(h.analysts, entry, (a,b) => a.house === b.house && a.date === b.date && a.rating === b.rating && a.target === b.target);
  }
  function addInsider(h, entry) {
    h.insiders = upsert(h.insiders, entry, (a,b) => a.date === b.date && a.name === b.name && a.shares === b.shares && a.price === b.price);
  }

  function applyRun() {
    window.marketAgentUpdateMeta = {contentUpdatedAt:STAMP,lastSuccessfulRunAt:STAMP,status:'partial',marketStatus:'US open'};
    holdings.forEach(h => {
      if (!CHECKED_IDS.has(h.id)) return;
      h.analysts = (h.analysts || []).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date >= FOUR_MONTH_CUTOFF);
      h.insiders = (h.insiders || []).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date >= FOUR_MONTH_CUTOFF);
      h.lastCheckedAt = STAMP;
      h.changedSections = [];
      h.updateStatus = 'checked';
      delete h.updateTag;
    });

    for (const id of ['CAT','JBL','LMT','MCD','AMZN','MEDP']) {
      const h = holdings.find(x => x.id === id); if (!h) continue;
      h.analystNote = `Rollierendes Vier-Monats-Fenster ab 08.05.2026, geprüft bis 08.09.2026 17:00 CEST. Unternehmens-/IR- sowie frei zugängliche Analystenquellen wurden auf neue belastbar verifizierbare Einzelrevisionen geprüft; seit dem vorherigen US-Lauf wurde keine zusätzliche Einzelrevision übernommen.`;
      h.insiderNote = `Rollierendes Vier-Monats-Fenster ab 08.05.2026. SEC Form 4 und ergänzende Insiderquellen wurden auf neue relevante Transaktionen geprüft; seit dem vorherigen US-Lauf wurde keine zusätzliche belastbar verifizierte diskretionäre Open-Market-Transaktion übernommen.`;
    }

    const ntap = holdings.find(h => h.id === 'NTAP');
    if (ntap) {
      addAnalyst(ntap,{house:'Citigroup',date:'2026-09-03',rating:'Neutral',target:190,reason:'Kursziel nach Q1 FY27 von 209 auf 190 USD gesenkt; starke Ergebnisse und höhere Guidance stehen schwächerem Free Cashflow, Margendruck und höheren Komponentenkosten gegenüber.',quality:'Analyst n. v. · historische Güte: n. v.',source:'https://www.marketbeat.com/instant-alerts/analyst-netapp-nasdaq-ntap-given-new-19000-price-target-at-citigroup-2026-09-03/'});
      addAnalyst(ntap,{house:'TD Cowen',date:'2026-09-03',rating:'Buy',target:200,reason:'Buy bestätigt und Kursziel 200 USD; starkes Q1, angehobener FY27-Ausblick und Nachfrage nach All-Flash/AI stützen die positive Einschätzung.',quality:'Analyst n. v. · historische Güte: n. v.',source:'https://www.marketbeat.com/instant-alerts/analyst-netapp-nasdaq-ntap-earns-buy-rating-from-td-cowen-2026-09-03/'});
      addAnalyst(ntap,{house:'Wedbush',date:'2026-09-03',rating:'Neutral',target:170,reason:'Kursziel von 150 auf 170 USD angehoben; operative Stärke anerkannt, jedoch Margen-, Free-Cashflow- und Bewertungsrisiken.',quality:'Analyst Matt Bryson · historische Güte: n. v.',source:'https://www.marketbeat.com/instant-alerts/analyst-netapp-nasdaq-ntap-price-target-raised-to-17000-2026-09-03/'});
      addAnalyst(ntap,{house:'BofA Securities',date:'2026-09-01',rating:'Neutral',target:206,reason:'Kursziel von 180 auf 206 USD angehoben; Bewertung bleibt trotz höherer Ergebnis- und Umsatzperspektive neutral.',quality:'Analyst n. v. · historische Güte: n. v.',source:'https://finance.yahoo.com/markets/stocks/articles/bofa-securities-adjusts-price-target-121115420.html'});
      ntap.analystNote = 'Rollierendes Vier-Monats-Fenster ab 08.05.2026, geprüft bis 08.09.2026 17:00 CEST. NetApp IR sowie MarketBeat/Benzinga/Yahoo wurden systematisch ergänzt; die Post-Q1-Revisionen von Citigroup, TD Cowen, Wedbush und BofA sind nun zusätzlich im Bestand.';
      ntap.insiderNote = 'SEC-/Insiderquellen im Vier-Monats-Fenster geprüft. Veröffentlichte Verkäufe wurden nicht als positives/negatives Open-Market-Signal gewertet, soweit Plan-/Vergütungs- oder Steuerkontext vorliegt; keine neue diskretionäre Open-Market-Kauftransaktion verifiziert.';
      ntap.lastChangedAt = STAMP; ntap.changedSections = ['Analysten']; ntap.updateStatus='updated'; ntap.updateTag='AKTUALISIERT';
    }

    const rng = holdings.find(h => h.id === 'RNG');
    if (rng) {
      addAnalyst(rng,{house:'RBC Capital Markets',date:'2026-09-03',rating:'Outperform',target:85,reason:'RBC nahm die Coverage mit Outperform und 85 USD auf; Begründung: geringere Verwundbarkeit gegenüber AI-Displacement als vom Markt unterstellt und robuste Enterprise-Kommunikationsposition.',quality:'Analyst Rishi Jaluria · historische Güte: n. v.',source:'https://www.benzinga.com/quote/RNG/price-targets'});
      addInsider(rng,{date:'2026-09-03',name:'Tarun Arora · Chief Accounting Officer',type:'Verkauf · Rule 10b5-1',shares:954,price:77,volume:73458,context:'SEC Form 4: Code S; Verkauf gemäß Rule-10b5-1-Plan vom 22.05.2026. Separat meldet das Filing am 01.09. eine steuerbedingte Abgabe an den Emittenten (Code F) im Zusammenhang mit vestenden RSUs.',source:'https://www.sec.gov/Archives/edgar/data/1384905/000205756926000035/xslF345X06/form4-09032026_100936.xml'});
      addInsider(rng,{date:'2026-09-02',name:'Vladimir Shmunis · CEO und Chairman',type:'Verkauf · Rule 10b5-1',shares:15556,price:71.78,volume:1116609.68,context:'SEC Form 4: mehrere Code-S-Verkäufe am 02.09. gemäß Rule-10b5-1-Plan vom 13.03.2026; gewichteter Gesamtmittelwert rund 71,78 USD. Separat meldet das Filing am 01.09. eine steuerbedingte Abgabe an den Emittenten (Code F) aus RSU-Vesting.',source:'https://www.sec.gov/Archives/edgar/data/1384905/000158664726000010/xslF345X06/form4-09032026_100927.xml'});
      rng.analystNote = 'Rollierendes Vier-Monats-Fenster ab 08.05.2026, geprüft bis 08.09.2026 17:00 CEST. RBC-Coverage vom 03.09. mit Rishi Jaluria, Outperform und 85 USD ergänzt; bestehende Needham-/Mizuho-Einträge bleiben erhalten.';
      rng.insiderNote = 'SEC Form 4 im Vier-Monats-Fenster geprüft. Neu erfasst sind die geplanten Rule-10b5-1-Verkäufe von Vladimir Shmunis und Tarun Arora; die in denselben Filings separat ausgewiesenen Code-F-Transaktionen betreffen Steuerabzug auf vestende RSUs. Die Verkäufe werden daher nicht als diskretionäres Managementsignal gewertet.';
      rng.lastChangedAt = STAMP; rng.changedSections = ['Analysten','Insider']; rng.updateStatus='updated'; rng.updateTag='NEU';
    }
  }

  function addBadge(el,label){ if(!el || el.querySelector('.update-badge')) return; const b=document.createElement('span'); b.className='update-badge'; b.textContent=label; el.prepend(b); }
  function markRun(){
    const chip=document.getElementById('content-state-chip'), text=document.getElementById('content-state');
    if(chip&&text){text.textContent=`Inhalte: ${formatStamp(STAMP)}`;chip.classList.remove('status-ok','status-partial','status-error','status-closed');chip.classList.add('status-partial');chip.title='US-Börsen regulär geöffnet. Acht US-Werte geprüft. Teilstatus nur deshalb, weil die angekündigte Datei Holdings (1)(1).md in dieser Conversation-Laufzeit nicht abrufbar war; der ausdrücklich bestätigte 12er-Bestand wurde technisch abgeglichen und keine Position entfernt.';}
    document.querySelectorAll('.update-badge').forEach(el=>el.remove());
    document.querySelectorAll('.holding').forEach(card=>{card.classList.remove('content-changed','content-partial');const h=holdings.find(x=>x.id===card.dataset.id);if(CHANGED_IDS.has(card.dataset.id)){card.classList.add('content-changed');card.title=`Heute inhaltlich aktualisiert · ${(h?.changedSections||[]).join(', ')}`;}else if(h&&CHECKED_IDS.has(h.id)){card.title=`Letzte Inhaltsprüfung: ${formatStamp(STAMP)} · Keine inhaltliche Änderung`;}});
    if(selected==='NTAP'){document.querySelectorAll('#tab-research tbody tr').forEach(row=>{if(/Citigroup|TD Cowen|Wedbush|BofA Securities/.test(row.textContent||'')) addBadge(row.querySelector('td'),'AKTUALISIERT');});}
    if(selected==='RNG'){document.querySelectorAll('#tab-research tbody tr').forEach(row=>{if(/RBC Capital Markets/.test(row.textContent||'')) addBadge(row.querySelector('td'),'NEU');if(/Tarun Arora|Vladimir Shmunis/.test(row.textContent||'')) addBadge(row.querySelector('td'),'NEU');});}
    const footer=document.querySelector('footer.shell'); if(footer) footer.textContent='Market Agent · Datenstand 08.09.2026 · 17:00 · Quellen in jedem Eintrag';
  }
  async function boot(){const ready=await waitForHoldings();if(!ready)return;await sleep(14000);applyRun();renderCards();renderDetail();markRun();document.addEventListener('click',e=>{if(e.target.closest('.holding,.tab,.filter'))setTimeout(markRun,0)});document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest('.holding'))setTimeout(markRun,0)});window.addEventListener('pageshow',()=>setTimeout(markRun,0));}
  boot();
})();
