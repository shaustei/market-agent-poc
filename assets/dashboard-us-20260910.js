(() => {
  const STAMP = '2026-09-10T17:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-05-10';
  const CHECKED_IDS = new Set(['CAT','JBL','LMT','MCD','AMZN','MEDP','NTAP','RNG']);
  const CHANGED_IDS = new Set(['JBL','LMT','MEDP','NTAP','RNG']);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const fmtStamp = value => new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(value)).replace(',', ' ·');
  const upsert = (items, entry, same) => [entry].concat((items || []).filter(item => !same(item, entry)));

  async function ready() {
    for (let i=0;i<60;i++) {
      try { if (Array.isArray(holdings) && holdings.length===12 && typeof renderCards==='function' && typeof renderDetail==='function') return true; } catch (_) {}
      await sleep(100);
    }
    return false;
  }

  function addAnalyst(h,e){ h.analysts=upsert(h.analysts,e,(a,b)=>a.house===b.house&&a.date===b.date&&a.rating===b.rating&&a.target===b.target); }
  function addTrigger(h,e){ h.triggers=upsert(h.triggers,e,(a,b)=>a.date===b.date&&a.title===b.title); }
  function addInsider(h,e){ h.insiders=upsert(h.insiders,e,(a,b)=>a.date===b.date&&a.name===b.name&&a.type===b.type&&a.shares===b.shares&&a.price===b.price); }

  function applyRun(){
    window.marketAgentUpdateMeta={contentUpdatedAt:STAMP,lastSuccessfulRunAt:STAMP,status:'partial',marketStatus:'US open'};
    holdings.forEach(h=>{
      if(!CHECKED_IDS.has(h.id)) return;
      h.analysts=(h.analysts||[]).filter(x=>!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||x.date>=FOUR_MONTH_CUTOFF);
      h.insiders=(h.insiders||[]).filter(x=>!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||x.date>=FOUR_MONTH_CUTOFF);
      h.lastCheckedAt=STAMP;
      h.changedSections=[];
      h.updateStatus='checked';
      delete h.updateTag;
    });

    const cat=holdings.find(h=>h.id==='CAT');
    if(cat){
      cat.analystNote='Rollierendes Vier-Monats-Fenster ab 10.05.2026, geprüft bis 10.09.2026 17:00 CEST. Unternehmens-/IR-, MarketBeat-, Yahoo-/S&P-Global- und weitere frei zugängliche Analystenquellen wurden geprüft; seit dem vorherigen US-Lauf keine zusätzliche belastbar verifizierte Einzelrevision übernommen.';
      cat.insiderNote='SEC Form 4 und ergänzende Insiderquellen im Vier-Monats-Fenster ab 10.05.2026 geprüft; seit dem vorherigen US-Lauf keine neue belastbar verifizierte relevante Transaktion übernommen.';
    }

    const jbl=holdings.find(h=>h.id==='JBL');
    if(jbl){
      addTrigger(jbl,{date:'2026-09-30',title:'Q4- und FY2026-Ergebnisse + Investor Briefing',background:'Jabil veröffentlicht die Q4-/FY2026-Zahlen vor US-Handelsstart und erläutert anschließend die strategischen und finanziellen Prioritäten für FY2027. Für den Investmentcase besonders relevant sind AI-Infrastruktur-Nachfrage, Marge, Free Cashflow und FY2027-Ausblick.',direction:'neutral',criteria:[1,1,1],source:'https://finance.yahoo.com/markets/stocks/articles/jabil-announces-date-fourth-quarter-201000077.html',sourceName:'Jabil / Business Wire',status:'bestätigt'});
      jbl.next='30.09.2026 · Q4/FY2026-Ergebnisse';
      jbl.analystNote='Rollierendes Vier-Monats-Fenster ab 10.05.2026, geprüft bis 10.09.2026 17:00 CEST. Jabil IR sowie mehrere Analystenquellen geprüft; seit der Goldman-Sachs-Revision vom 08.09. wurde keine zusätzliche belastbar verifizierte Einzelrevision übernommen.';
      jbl.insiderNote='SEC Form 4 und ergänzende Insiderquellen im Vier-Monats-Fenster ab 10.05.2026 geprüft; keine neue belastbar verifizierte relevante Transaktion seit dem vorherigen US-Lauf übernommen.';
      jbl.lastChangedAt=STAMP;jbl.changedSections=['Termin/Trigger'];jbl.updateStatus='updated';jbl.updateTag='NEU';
    }

    const lmt=holdings.find(h=>h.id==='LMT');
    if(lmt){
      addAnalyst(lmt,{house:'UBS',analyst:'Gavin Parsons',date:'2026-09-09',rating:'Buy',target:674,reason:'Von Hold auf Buy hochgestuft; Kursziel von 581 auf 674 USD angehoben. Begründung: starkes Wachstum im Missile-Geschäft und attraktivere Bewertung trotz begrenzter F-35-Wachstumsfantasie.',quality:'Historische Güte: n. v.',source:'https://www.barrons.com/articles/lockheed-l3harris-stock-military-midterm-elections-e5ed876c'});
      lmt.analystNote='Rollierendes Vier-Monats-Fenster ab 10.05.2026, geprüft bis 10.09.2026 17:00 CEST. UBS/Gavin Parsons vom 09.09. ergänzt: Upgrade Hold → Buy, Kursziel 581 → 674 USD; weitere relevante Quellen geprüft.';
      lmt.insiderNote='SEC Form 4 und ergänzende Insiderquellen im Vier-Monats-Fenster ab 10.05.2026 geprüft; keine neue belastbar verifizierte relevante Transaktion seit dem vorherigen US-Lauf übernommen.';
      lmt.lastChangedAt=STAMP;lmt.changedSections=['Analysten'];lmt.updateStatus='updated';lmt.updateTag='NEU';
    }

    const mcd=holdings.find(h=>h.id==='MCD');
    if(mcd){
      mcd.analystNote='Rollierendes Vier-Monats-Fenster ab 10.05.2026, geprüft bis 10.09.2026 17:00 CEST. Unternehmens-/IR-, MarketBeat-, Yahoo-/S&P-Global- und weitere frei zugängliche Analystenquellen geprüft; seit dem vorherigen US-Lauf keine zusätzliche belastbar verifizierte Einzelrevision übernommen.';
      mcd.insiderNote='SEC Form 4 und ergänzende Insiderquellen im Vier-Monats-Fenster ab 10.05.2026 geprüft; keine neue belastbar verifizierte relevante Transaktion seit dem vorherigen US-Lauf übernommen.';
    }

    const amzn=holdings.find(h=>h.id==='AMZN');
    if(amzn){
      amzn.analystNote='Rollierendes Vier-Monats-Fenster ab 10.05.2026, geprüft bis 10.09.2026 17:00 CEST. Mehrere Analystenquellen geprüft; seit dem vorherigen US-Lauf keine zusätzliche belastbar verifizierte Einzelrevision übernommen.';
      amzn.insiderNote='SEC Form 4 im rollierenden Vier-Monats-Fenster ab 10.05.2026 geprüft. Die jüngsten bekannten Bezos-Verkäufe bleiben als plan-/kontextabhängige Transaktionen einzuordnen; seit dem vorherigen US-Lauf keine neue belastbar verifizierte relevante Transaktion übernommen.';
    }

    const medp=holdings.find(h=>h.id==='MEDP');
    if(medp){
      addInsider(medp,{date:'2026-08-26',name:'Robert O. Kraft',function:'Director',type:'Optionsausübung + Verkauf',shares:3858,price:617.81,volume:3858*617.81,filingType:'SEC Form 4',planContext:'Kein 10b5-1-Hinweis im Formular; Verkauf folgte unmittelbar auf Ausübung bereits vollständig gevesteter Optionen.',context:'Kein reiner Open-Market-Verkauf: 3.858 Optionen zu 84,36 USD ausgeübt und dieselbe Stückzahl zu Ø 617,81 USD verkauft. Wegen direktem Optionsbezug nicht als eindeutiges diskretionäres Verkaufssignal gewertet.',source:'https://www.sec.gov/Archives/edgar/data/1668397/000155859226000010/xslF345X06/wk-form4_1787949166.xml'});
      addInsider(medp,{date:'2026-08-26',name:'August J. Troendle',function:'President, CEO, Director, >10% Owner',type:'Open-Market-Verkauf',shares:4000,price:620.03,volume:4000*620.03,filingType:'SEC Form 4',planContext:'Limit Order in offenem Handelsfenster; kein 10b5-1-Hinweis im Formular.',context:'Diskretionärer Open-Market-Verkauf im offenen Handelsfenster. Teil einer Serie von Verkäufen des CEO/Gründers; relevant für Insider-Sentiment, aber im Kontext seines weiterhin sehr großen direkten und indirekten Bestands zu sehen.',source:'https://www.sec.gov/Archives/edgar/data/1668397/000162205826000008/xslF345X03/wk-form4_1787861551.xml'});
      addInsider(medp,{date:'2026-08-25',name:'August J. Troendle',function:'President, CEO, Director, >10% Owner',type:'Open-Market-Verkauf',shares:673,price:620.38,volume:673*620.38,filingType:'SEC Form 4',planContext:'Limit Order in offenem Handelsfenster; kein 10b5-1-Hinweis im Formular.',context:'Diskretionärer Open-Market-Verkauf im offenen Handelsfenster; zusammen mit Folgetransaktion vom 26.08. als fortgesetzte Reduktion des direkten Bestands einzuordnen.',source:'https://www.sec.gov/Archives/edgar/data/1668397/000162205826000008/xslF345X03/wk-form4_1787861551.xml'});
      addInsider(medp,{date:'2026-08-24',name:'August J. Troendle',function:'President, CEO, Director, >10% Owner',type:'Open-Market-Verkauf',shares:1983,price:620.23,volume:1983*620.23,filingType:'SEC Form 4',planContext:'Limit Order in offenem Handelsfenster; kein 10b5-1-Hinweis im Formular.',context:'Diskretionärer Open-Market-Verkauf; Fortsetzung der Verkäufe vom 21.08. bei weiterhin erheblichem Restbestand.',source:'https://www.sec.gov/Archives/edgar/data/1622058/000089225126000152/xslF345X06/form4.xml'});
      addInsider(medp,{date:'2026-08-21',name:'August J. Troendle',function:'President, CEO, Director, >10% Owner',type:'Open-Market-Verkauf',shares:13995,price:624.45,volume:13995*624.45,filingType:'SEC Form 4',planContext:'Limit Order in offenem Handelsfenster; kein 10b5-1-Hinweis im Formular.',context:'Diskretionärer Open-Market-Verkauf. Das Formular nennt ausdrücklich eine Limit Order in einem offenen Handelsfenster; deshalb als echtes Verkaufssignal erfasst, jedoch relativiert durch den weiterhin großen direkten und indirekten Bestand.',source:'https://www.sec.gov/Archives/edgar/data/1622058/000089225126000152/xslF345X06/form4.xml'});
      medp.insiderNote='SEC Form 4 vollständig im Vier-Monats-Fenster ab 10.05.2026 geprüft. Neu erfasst: CEO/Gründer August J. Troendle mit diskretionären Open-Market-Verkäufen am 21., 24., 25. und 26.08.; Robert O. Kraft am 26.08. separat als optionsbedingte Ausübung plus Verkauf klassifiziert.';
      medp.analystNote='Rollierendes Vier-Monats-Fenster ab 10.05.2026, geprüft bis 10.09.2026 17:00 CEST. MarketBeat sowie S&P-Global/Yahoo-nahe Konsensquellen geprüft; keine zusätzliche belastbar verifizierte Einzelrevision seit dem vorherigen US-Lauf übernommen.';
      medp.lastChangedAt=STAMP;medp.changedSections=['Insider'];medp.updateStatus='updated';medp.updateTag='NEU';
    }

    const ntap=holdings.find(h=>h.id==='NTAP');
    if(ntap){
      addAnalyst(ntap,{house:'Susquehanna',analyst:'n. v.',date:'2026-09-03',rating:'Neutral',target:195,reason:'Kursziel von 185 auf 195 USD erhöht, Neutral bestätigt. Nach dem starken Quartal stehen höherer Ausblick und AI-/All-Flash-Nachfrage gegen Margen- und Free-Cashflow-Risiken.',quality:'Historische Güte: n. v.',source:'https://www.marketbeat.com/instant-alerts/analyst-netapp-nasdaq-ntap-price-target-raised-to-19500-at-susquehanna-2026-09-03/'});
      ntap.analystNote='Rollierendes Vier-Monats-Fenster ab 10.05.2026, geprüft bis 10.09.2026 17:00 CEST. Susquehanna vom 03.09. ergänzt: Neutral bestätigt, Kursziel 185 → 195 USD. Weitere aktuelle Revisionen aus dem bestehenden Bestand bleiben erhalten.';
      ntap.insiderNote='SEC Form 4 und ergänzende Insiderquellen im Vier-Monats-Fenster ab 10.05.2026 geprüft; keine neue belastbar verifizierte Transaktion seit dem vorherigen US-Lauf übernommen.';
      ntap.lastChangedAt=STAMP;ntap.changedSections=['Analysten'];ntap.updateStatus='updated';ntap.updateTag='NEU';
    }

    const rng=holdings.find(h=>h.id==='RNG');
    if(rng){
      addTrigger(rng,{date:'2026-09-10',title:'Goldman Sachs Communacopia + Technology Conference',background:'RingCentral-Management präsentiert heute um 16:45 ET. Relevant sind Aussagen zu AI-Monetarisierung, ARR-/Umsatztrend, Marge, Free Cashflow und Nachfrage im Enterprise-/Contact-Center-Geschäft.',direction:'neutral',criteria:[1,1,1],source:'https://ir.ringcentral.com/news/press-release-details/2026/RingCentral-to-Present-at-Goldman-Sachs-and-Piper-Sandler-Conferences/default.aspx',sourceName:'RingCentral IR',status:'bestätigt'});
      rng.analystNote='Rollierendes Vier-Monats-Fenster ab 10.05.2026, geprüft bis 10.09.2026 17:00 CEST. RBC, Oppenheimer, Needham, Wells Fargo, Morgan Stanley sowie weitere aktuelle Quellen geprüft; seit dem vorherigen US-Lauf keine zusätzliche belastbar verifizierte Einzelrevision übernommen.';
      rng.insiderNote='SEC Form 4 im rollierenden Vier-Monats-Fenster ab 10.05.2026 erneut geprüft; bestehende plan-/steuerbezogene Transaktionen bleiben entsprechend klassifiziert. Seit dem vorherigen US-Lauf keine neue belastbar verifizierte relevante Transaktion übernommen.';
      rng.lastChangedAt=STAMP;rng.changedSections=['Termin/Trigger'];rng.updateStatus='updated';rng.updateTag='NEU';
    }
  }

  function addBadge(el,label){ if(!el||el.querySelector('.update-badge'))return;const b=document.createElement('span');b.className='update-badge';b.textContent=label;el.prepend(b); }
  function markUi(){
    const chip=document.getElementById('content-state-chip'),text=document.getElementById('content-state');
    if(chip&&text){text.textContent=`Inhalte: ${fmtStamp(STAMP)}`;chip.classList.remove('status-ok','status-error','status-closed');chip.classList.add('status-partial');chip.title='US-Börsen regulär geöffnet. Acht US-Werte geprüft. Teilstatus ausschließlich, weil die angekündigte verbindliche Datei Holdings (1)(1).md in dieser Laufzeit nicht als Conversation-Datei abrufbar war; der ausdrücklich bestätigte 12er-Bestand wurde technisch abgeglichen und keine Position entfernt.';}
    document.querySelectorAll('.update-badge').forEach(el=>el.remove());
    document.querySelectorAll('.holding').forEach(card=>{card.classList.remove('content-changed','content-partial');const h=holdings.find(x=>x.id===card.dataset.id);if(CHANGED_IDS.has(card.dataset.id)){card.classList.add('content-changed');card.title=`Heute inhaltlich aktualisiert · ${(h?.changedSections||[]).join(', ')}`;}else if(h&&CHECKED_IDS.has(h.id)){card.title=`Letzte Inhaltsprüfung: ${fmtStamp(STAMP)} · Keine inhaltliche Änderung`;}});
    if(selected==='JBL') document.querySelectorAll('#tab-events .trigger').forEach(el=>{if(/Q4- und FY2026/.test(el.textContent||''))addBadge(el.querySelector('.item-top'),'NEU');});
    if(selected==='LMT') document.querySelectorAll('#tab-research tbody tr').forEach(el=>{if(/UBS/.test(el.textContent||''))addBadge(el.querySelector('td'),'NEU');});
    if(selected==='MEDP') document.querySelectorAll('#tab-research tbody tr').forEach(el=>{if(/Troendle|Kraft/.test(el.textContent||''))addBadge(el.querySelector('td'),'NEU');});
    if(selected==='NTAP') document.querySelectorAll('#tab-research tbody tr').forEach(el=>{if(/Susquehanna/.test(el.textContent||''))addBadge(el.querySelector('td'),'NEU');});
    if(selected==='RNG') document.querySelectorAll('#tab-events .trigger').forEach(el=>{if(/Goldman Sachs Communacopia/.test(el.textContent||''))addBadge(el.querySelector('.item-top'),'NEU');});
    const footer=document.querySelector('footer.shell');if(footer)footer.textContent='Market Agent · Datenstand 10.09.2026 · 17:00 · Quellen in jedem Eintrag';
  }

  async function boot(){if(!(await ready()))return;applyRun();renderCards();renderDetail();markUi();[500,1500,4000,8000].forEach(ms=>setTimeout(()=>{try{renderCards();renderDetail();markUi();}catch(_){}},ms));document.addEventListener('click',e=>{if(e.target.closest('.holding,.tab,.filter'))setTimeout(markUi,0)});window.addEventListener('pageshow',()=>setTimeout(markUi,0));}
  boot();
})();
