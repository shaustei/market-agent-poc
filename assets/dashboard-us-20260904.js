(() => {
  const STAMP = '2026-09-04T17:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-05-04';
  const CHECKED_IDS = new Set(['CAT','JBL','LMT','MCD','AMZN','MEDP','NTAP','RNG']);
  const CHANGED_IDS = new Set(['MEDP','NTAP','RNG']);
  const formatStamp = value => new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(value)).replace(',', ' ·');
  const upsert = (items, entry, same) => [entry].concat((items || []).filter(item => !same(item, entry)));
  const insider = (date,name,role,type,shares,price,source,context,filingType='SEC Form 4') => ({date,name,role,type,shares,price,volume:Number((shares*price).toFixed(2)),filingType,context,source});

  function applyRun() {
    window.marketAgentUpdateMeta = {contentUpdatedAt:STAMP,lastSuccessfulRunAt:STAMP,status:'partial'};
    holdings.forEach(h => {
      if (!CHECKED_IDS.has(h.id)) return;
      h.analysts = (h.analysts || []).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date >= FOUR_MONTH_CUTOFF);
      h.insiders = (h.insiders || []).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date >= FOUR_MONTH_CUTOFF);
      h.lastCheckedAt = STAMP;
      h.changedSections = [];
      h.updateStatus = 'checked';
      delete h.updateTag;
    });

    for (const id of ['CAT','JBL','LMT','MCD','AMZN']) {
      const h = holdings.find(x => x.id === id);
      if (!h) continue;
      h.analystNote = `Rollierendes Vier-Monats-Fenster ab 04.05.2026, geprüft bis 04.09.2026 17:00 CEST. Unternehmens-/IR- und aktuelle Analystenquellen wurden erneut geprüft; seit dem vorherigen US-Lauf wurde keine zusätzliche belastbar verifizierte Einzelrevision übernommen.`;
      h.insiderNote = `Rollierendes Vier-Monats-Fenster ab 04.05.2026. SEC Form 4 und ergänzende Insiderquellen wurden erneut geprüft; seit dem vorherigen US-Lauf wurde keine zusätzliche relevante diskretionäre Open-Market-Transaktion verifiziert.`;
    }

    const medp = holdings.find(h => h.id === 'MEDP');
    if (medp) {
      medp.insiders = [
        insider('2026-08-27','August J. Troendle','CEO / Director / >10%-Owner','Open-Market-Verkauf',650,620.27,'https://www.marketbeat.com/stocks/NASDAQ/MEDP/insider-trades/','Open-Market-Verkauf. Planstatus in den frei zugänglichen Quellen nicht belastbar als Rule-10b5-1 verifiziert; daher nicht als automatischer Verkauf eingeordnet.'),
        insider('2026-08-26','August J. Troendle','CEO / Director / >10%-Owner','Open-Market-Verkauf',4000,620.03,'https://www.marketbeat.com/instant-alerts/insider-august-troendle-sells-4000-shares-of-medpace-nasdaq-medp-stock-2026-08-27/','Materieller CEO-Verkauf; wegen des weiterhin sehr großen Restbestands moderat negativ, Planstatus n. v.'),
        insider('2026-08-26','Robert O. Kraft','Director','Open-Market-Verkauf',3858,617.81,'https://www.sec.gov/Archives/edgar/data/1668397/000155859226000010/xslF345X06/wk-form4_1787949166.xml','SEC Form 4; Director-Verkauf. Planstatus aus der zugänglichen Darstellung nicht belastbar verifiziert.'),
        insider('2026-08-25','August J. Troendle','CEO / Director / >10%-Owner','Open-Market-Verkauf',673,620.38,'https://www.sec.gov/Archives/edgar/data/1668397/000162205826000008/xslF345X03/wk-form4_1787861551.xml','SEC Form 4; kleinerer Open-Market-Verkauf, Planstatus n. v.'),
        insider('2026-08-24','August J. Troendle','CEO / Director / >10%-Owner','Open-Market-Verkauf',1983,620.23,'https://www.marketbeat.com/stocks/NASDAQ/MEDP/insider-trades/','Open-Market-Verkauf; Planstatus n. v.'),
        insider('2026-08-21','August J. Troendle','CEO / Director / >10%-Owner','Open-Market-Verkauf',13995,624.45,'https://www.marketbeat.com/instant-alerts/insider-insider-selling-medpace-nasdaqmedp-ceo-sells-873917775-in-stock-2026-08-25/','Materieller CEO-Verkauf; Teil eines breiten Verkaufsclusters im August. Planstatus n. v.'),
        insider('2026-08-20','August J. Troendle','CEO / Director / >10%-Owner','Open-Market-Verkauf',27174,618.79,'https://www.marketbeat.com/instant-alerts/august-troendle-sells-27174-shares-of-medpace-nasdaqmedp-stock-2026-08-21/','Großer CEO-Verkauf im August-Cluster; moderat negativ für Insider-Sentiment, aber kein isolierter Fundamental-Call.'),
        insider('2026-08-20','Kevin M. Brady','CFO','Open-Market-Verkauf',3400,625.24,'https://www.marketbeat.com/stocks/NASDAQ/MEDP/insider-trades/','CFO-Verkauf; Planstatus n. v.'),
        insider('2026-08-19','August J. Troendle','CEO / Director / >10%-Owner','Open-Market-Verkauf',15609,606.47,'https://www.sec.gov/Archives/edgar/data/1668397/000089225126000125/xslF345X03/form4.xml','SEC Form 4; gewichteter Durchschnittspreis, Ausführungen laut Filing zwischen 606,20 und 626,51 USD. Planstatus n. v.'),
        insider('2026-08-19','Brian T. Carley','Director','Open-Market-Verkauf',5000,608.63,'https://www.marketbeat.com/stocks/NASDAQ/MEDP/insider-trades/','Director-Verkauf; Planstatus n. v.'),
        insider('2026-08-19','Fred B. Davenport Jr.','Director','Open-Market-Verkauf',7283,606.15,'https://www.marketbeat.com/stocks/NASDAQ/MEDP/insider-trades/','Director-Verkauf; Planstatus n. v.'),
        insider('2026-08-13','August J. Troendle','CEO / Director / >10%-Owner','Open-Market-Verkauf',458,600.39,'https://www.marketbeat.com/instant-alerts/medpace-nasdaqmedp-ceo-sells-27497862-in-stock-2026-08-14/','Kleiner CEO-Verkauf; geringe Einzel-Signalstärke.'),
        insider('2026-08-12','August J. Troendle','CEO / Director / >10%-Owner','Open-Market-Verkauf',11366,601.53,'https://www.marketbeat.com/instant-alerts/medpace-nasdaqmedp-ceo-sells-11366-shares-2026-08-14/','Materieller CEO-Verkauf; Teil des August-Clusters.'),
        insider('2026-08-11','August J. Troendle','CEO / Director / >10%-Owner','Open-Market-Verkauf',17610,605.11,'https://www.marketbeat.com/instant-alerts/august-troendle-sells-17610-shares-of-medpace-nasdaqmedp-stock-2026-08-12/','Materieller CEO-Verkauf; Teil des August-Clusters.'),
        insider('2026-08-11','Cornelius P. McCarthy III','Director','Open-Market-Verkauf',1140,605.37,'https://www.marketbeat.com/stocks/NASDAQ/MEDP/insider-trades/','Director-Verkauf; geringe bis moderate Einzel-Signalstärke.'),
        insider('2026-08-10','August J. Troendle','CEO / Director / >10%-Owner','Open-Market-Verkauf',5534,601.53,'https://www.marketbeat.com/instant-alerts/medpace-nasdaqmedp-ceo-sells-5534-shares-2026-08-12/','Open-Market-Verkauf; Teil des August-Clusters.'),
        insider('2026-07-28','August J. Troendle','CEO / Director / >10%-Owner','Open-Market-Verkauf',3510,600.01,'https://www.marketbeat.com/stocks/NASDAQ/MEDP/insider-trades/','Open-Market-Verkauf; Planstatus n. v.'),
        insider('2026-07-28','Susan E. Burwig','VP','Open-Market-Verkauf',7500,600.00,'https://www.marketbeat.com/stocks/NASDAQ/MEDP/insider-trades/','VP-Verkauf; Planstatus n. v.'),
        insider('2026-07-27','August J. Troendle','CEO / Director / >10%-Owner','Open-Market-Verkauf',3728,600.85,'https://www.sec.gov/Archives/edgar/data/1668397/000162205826000004/xslF345X06/wk-form4_1785357402.xml','SEC Form 4; Open-Market-Verkauf, Planstatus n. v.'),
        insider('2026-05-28','Stephen P. Ewald','General Counsel','Open-Market-Verkauf',16349,450.00,'https://www.marketbeat.com/stocks/NASDAQ/MEDP/insider-trades/','General-Counsel-Verkauf; Planstatus n. v.')
      ];
      medp.analystNote = 'Rollierendes Vier-Monats-Fenster ab 04.05.2026. Medpace IR, MarketBeat-Konsens und ergänzende Analystenquellen geprüft. Konsens bleibt Hold; Durchschnittsziel zuletzt rund 595 USD. Keine zusätzliche heute veröffentlichte Einzelrevision belastbar verifiziert.';
      medp.insiderNote = 'SEC Form 4 und MarketBeat systematisch geprüft. Im Vier-Monats-Fenster besteht ein breites Verkaufscluster, besonders durch CEO August Troendle. Für die aufgeführten Verkäufe wurde ein Rule-10b5-1-Status in den frei zugänglichen Detailquellen nicht durchgängig belastbar verifiziert; daher Planstatus n. v. statt Unterstellung eines diskretionären oder automatischen Motivs.';
      medp.lastChangedAt = STAMP;
      medp.changedSections = ['Insider'];
      medp.updateStatus = 'updated';
      medp.updateTag = 'NEU';
    }

    const ntap = holdings.find(h => h.id === 'NTAP');
    if (ntap) {
      const analystAdds = [
        {house:'Barclays',date:'2026-09-03',rating:'Overweight',target:219,reason:'Kursziel nach Q1 FY27 von 199 auf 219 USD angehoben; starke Ergebnisse und höhere Guidance.',quality:'Analyst: Tim Long · historische Güte öffentlich nicht belastbar verifiziert: n. v.',source:'https://www.marketscreener.com/news/barclays-adjusts-price-target-on-netapp-to-219-from-199-keeps-overweight-rating-ce7858d3de81f125'},
        {house:'Morgan Stanley',date:'2026-09-03',rating:'Equal Weight',target:191,reason:'Kursziel von 173 auf 191 USD angehoben, Equal Weight bestätigt.',quality:'Historische Güte: n. v.',source:'https://www.marketscreener.com/news/morgan-stanley-adjusts-price-target-on-netapp-to-191-from-173-keeps-equalweight-rating-ce7858d3de81f124'},
        {house:'Wells Fargo',date:'2026-09-03',rating:'Equal Weight',target:190,reason:'Kursziel von 180 auf 190 USD angehoben, Equal Weight bestätigt.',quality:'Historische Güte: n. v.',source:'https://www.marketscreener.com/news/morgan-stanley-adjusts-price-target-on-netapp-to-191-from-173-keeps-equalweight-rating-ce7858d3de81f124'},
        {house:'Citigroup',date:'2026-09-03',rating:'Neutral',target:190,reason:'Kursziel von 209 auf 190 USD gesenkt, Neutral bestätigt; starke Ergebnisse treffen auf Margen-/Cashflow-Bedenken.',quality:'Historische Güte: n. v.',source:'https://www.marketbeat.com/instant-alerts/analyst-netapp-nasdaq-ntap-given-new-19000-price-target-at-citigroup-2026-09-03/'},
        {house:'Wedbush',date:'2026-09-03',rating:'Neutral',target:170,reason:'Kursziel von 150 auf 170 USD angehoben, Neutral bestätigt; Ziel bleibt unter dem jüngsten Kurs.',quality:'Historische Güte: n. v.',source:'https://www.marketbeat.com/instant-alerts/analyst-netapp-nasdaq-ntap-price-target-raised-to-17000-2026-09-03/'},
        {house:'UBS',date:'2026-09-03',rating:'Neutral',target:171,reason:'Kursziel von 160 auf 171 USD angehoben, Neutral bestätigt.',quality:'Historische Güte: n. v.',source:'https://www.marketscreener.com/news/ubs-adjusts-netapp-price-target-to-171-from-160-maintains-neutral-rating-ce7858d3d08bf12c'}
      ];
      analystAdds.forEach(a => ntap.analysts = upsert(ntap.analysts,a,(x,y)=>x.house===y.house&&x.date===y.date&&x.rating===y.rating&&x.target===y.target));
      ntap.insiders = [
        insider('2026-08-17','Cesar Cernuda','President','Open-Market-Verkauf',2608,204.48,'https://www.marketbeat.com/instant-alerts/cesar-cernuda-sells-2608-shares-of-netapp-nasdaqntap-stock-2026-08-19/','President verkaufte 2.608 Aktien; Planstatus in der frei zugänglichen Quelle nicht belastbar verifiziert.'),
        insider('2026-08-10',"Elizabeth M. O'Callahan",'EVP','Open-Market-Verkauf',1000,193.82,'https://www.marketbeat.com/instant-alerts/netapp-nasdaqntap-evp-elizabeth-ocallahan-sells-1000-shares-of-stock-2026-08-12/','EVP verkaufte 1.000 Aktien; Planstatus n. v.')
      ];
      ntap.analystNote = 'Q1-FY27-Folgerevisionen vom 03.09. vollständig ergänzt: Barclays 219/Overweight, Morgan Stanley 191/Equal Weight, Wells Fargo 190/Equal Weight, Susquehanna 195/Neutral, Citigroup 190/Neutral, Wedbush 170/Neutral und UBS 171/Neutral. Konsens bleibt trotz starker Zahlen gemischt.';
      ntap.insiderNote = 'SEC-/Insiderquellen und MarketBeat geprüft. Verifiziert wurden u. a. Verkäufe von President Cesar Cernuda (17.08.) und EVP Elizabeth O’Callahan (10.08.); kein belastbarer Open-Market-Kauf im geprüften Zeitraum gefunden. Planstatus der Verkäufe in den frei zugänglichen Quellen: n. v.';
      ntap.lastChangedAt = STAMP;
      ntap.changedSections = ['Analysten','Insider'];
      ntap.updateStatus = 'updated';
      ntap.updateTag = 'NEU';
    }

    const rng = holdings.find(h => h.id === 'RNG');
    if (rng) {
      const analystAdds = [
        {house:'Royal Bank of Canada',date:'2026-09-03',rating:'Outperform',target:85,reason:'Rishi Jaluria nahm die Coverage mit Outperform und 85 USD auf; RBC sieht geringere AI-Displacement-Risiken als vom Markt befürchtet.',quality:'Analyst: Rishi Jaluria · MarketBeat 2/5; keine eigene Trefferquote.',source:'https://www.marketbeat.com/stocks/NYSE/RNG/forecast/'},
        {house:'Oppenheimer',date:'2026-09-01',rating:'Outperform',target:85,reason:'Timothy Horan erhöhte das Kursziel von 50 auf 85 USD und bestätigte Outperform.',quality:'Analyst: Timothy Horan · MarketBeat 3/5; keine eigene Trefferquote.',source:'https://www.marketbeat.com/stocks/NYSE/RNG/forecast/'},
        {house:'Wells Fargo',date:'2026-08-25',rating:'Equal Weight',target:65,reason:'Ryan MacWilliams erhöhte das Kursziel von 43 auf 65 USD, Equal Weight bestätigt.',quality:'Analyst: Ryan MacWilliams · historische Güte öffentlich nicht belastbar verifizierbar: n. v.',source:'https://www.marketbeat.com/stocks/NYSE/RNG/forecast/'}
      ];
      analystAdds.forEach(a => rng.analysts = upsert(rng.analysts,a,(x,y)=>x.house===y.house&&x.date===y.date&&x.rating===y.rating&&x.target===y.target));
      rng.insiders = [
        insider('2026-09-03','Vladimir Shmunis','CEO / Chairman','Rule-10b5-1-Verkauf',11165,76.58,'https://www.marketbeat.com/instant-alerts/insider-ringcentral-nyse-rng-ceo-sells-11165-shares-2026-09-03/','Vorab festgelegter Rule-10b5-1-Verkauf zur Deckung von Steuerpflichten aus vestenden Equity Awards; deshalb nicht als diskretionäres bearish Signal gewertet.'),
        insider('2026-09-03','Tarun Arora','CAO','Rule-10b5-1-Verkauf',954,77.00,'https://www.sec.gov/Archives/edgar/data/1384905/000205756926000035/xslF345X06/form4-09032026_100936.xml','SEC Form 4: zusätzlich 4.323 Aktien am 01.09. per Code F zur Steuerdeckung; 954 Aktien am 03.09. verkauft. Rule-10b5-1-/Steuerkontext reduziert die Signalwirkung.'),
        insider('2026-09-02','Vaibhav Agarwal','CFO','Rule-10b5-1-Verkauf',7046,72.10,'https://www.marketbeat.com/stocks/NYSE/RNG/insider-trades/','Verkauf im Rahmen eines vorab festgelegten 10b5-1-/Steuerkontexts laut zusammengefasster SEC-Auswertung; neutral bis leicht negativ, kein diskretionäres Signal.'),
        insider('2026-09-02','Vladimir Shmunis','CEO / Chairman','Rule-10b5-1-Verkauf',15556,71.78,'https://www.marketbeat.com/instant-alerts/insider-vladimir-shmunis-sells-15556-shares-of-ringcentral-nyse-rng-stock-2026-09-03/','Vorab festgelegter Rule-10b5-1-Verkauf zur Steuerdeckung auf vested Equity Awards; geringe eigenständige Signalwirkung.'),
        insider('2026-08-25','Tarun Arora','CAO','Rule-10b5-1-/Steuerverkauf',675,67.45,'https://www.marketbeat.com/instant-alerts/insider-ringcentral-nyse-rng-cao-sells-7345800-in-stock-2026-09-03/','Kleiner Verkauf im selben Vergütungs-/Steuerkontext; geringe Signalwirkung.')
      ];
      const rbcNews = {date:'2026-09-03',sourceName:'RBC / MarketBeat',category:'Analysten / AI-Risiko',title:'RBC startet Coverage mit Outperform und 85 USD',summary:'RBC Capital Markets nahm RingCentral mit Outperform und 85 USD Kursziel auf. Analyst Rishi Jaluria sieht RingCentral weniger anfällig für AI-bedingte Verdrängung als vom Markt befürchtet.',impactText:'Positiv; Stärke 2. Neue bullische Coverage adressiert einen zentralen Bewertungs- und Wettbewerbsrisikofaktor, ist aber kein Unternehmens-Fundamentalereignis.',impact:2,source:'https://www.marketbeat.com/stocks/NYSE/RNG/forecast/'};
      rng.news = upsert(rng.news,rbcNews,(a,b)=>a.date===b.date&&a.title===b.title);
      rng.analystNote = 'Rollierendes Vier-Monats-Fenster ab 04.05.2026 geprüft. Neu ergänzt: RBC / Rishi Jaluria Outperform 85 USD (03.09.), Oppenheimer / Timothy Horan Outperform 85 USD (01.09.) und Wells Fargo Equal Weight 65 USD (25.08.); Needham 85 USD und Mizuho 40 USD bleiben im Bestand.';
      rng.insiderNote = 'SEC Form 4 und MarketBeat geprüft. Die jüngsten Verkäufe von Shmunis, Agarwal und Arora sind als Rule-10b5-1-/Steuertransaktionen im Zusammenhang mit vestenden Equity Awards dokumentiert. Daher keine Gleichsetzung mit diskretionären Open-Market-Verkäufen.';
      rng.thesis = 'RingCentral verbessert Profitabilität und Free Cashflow bei moderatem Umsatzwachstum. Neue bullische Coverage von RBC und Oppenheimer stützt den AI-/Produktcase, während der Kurs deutlich über dem breiten Analystenkonsens liegt. Die jüngsten Insiderverkäufe sind überwiegend 10b5-1-/steuerbedingt und daher kein starkes negatives Signal.';
      rng.lastChangedAt = STAMP;
      rng.changedSections = ['News','Analysten','Insider','Investment-Einordnung'];
      rng.updateStatus = 'updated';
      rng.updateTag = 'NEU';
    }
  }

  function addBadge(el,label){if(!el||el.querySelector('.update-badge'))return;const b=document.createElement('span');b.className='update-badge update-new';b.textContent=label;el.prepend(b)}
  function markRun(){
    const chip=document.getElementById('content-state-chip'), text=document.getElementById('content-state');
    if(chip&&text){text.textContent=`Inhalte: ${formatStamp(STAMP)}`;chip.classList.remove('status-ok','status-partial','status-error','status-closed');chip.classList.add('status-partial');chip.title='Teilaktualisierung: Der im Auftrag bestätigte 12er-Bestand ist mit 12 Dashboard-IDs und 12 Marktdatensymbolen konsistent. Die Datei Holdings (1)(1).md selbst war in dieser Automation-Laufzeit nicht als abrufbare Conversation-Datei verfügbar; daher wurde keine Bestandslöschung vorgenommen.';}
    document.querySelectorAll('.update-badge').forEach(el=>el.remove());
    document.querySelectorAll('.holding').forEach(card=>{card.classList.remove('content-changed','content-partial');const h=holdings.find(x=>x.id===card.dataset.id);if(CHANGED_IDS.has(card.dataset.id)){card.classList.add('content-changed');card.title=`Heute inhaltlich aktualisiert · ${(h?.changedSections||[]).join(', ')}`}else if(h?.lastCheckedAt&&CHECKED_IDS.has(h.id)){card.title=`Letzte Inhaltsprüfung: ${formatStamp(h.lastCheckedAt)} · Keine inhaltliche Änderung`}});
    if(selected==='MEDP') document.querySelectorAll('#tab-research tbody tr').forEach(row=>{if((row.textContent||'').includes('Troendle')||(row.textContent||'').includes('Kraft')) addBadge(row.querySelector('td:first-child'),'NEU')});
    if(selected==='NTAP') document.querySelectorAll('#tab-research tbody tr').forEach(row=>{const t=row.textContent||'';if(t.includes('03.09.2026')||t.includes('Cernuda')||t.includes("O'Callahan")) addBadge(row.querySelector('td:first-child'),'NEU')});
    if(selected==='RNG') {document.querySelectorAll('#tab-research tbody tr').forEach(row=>{const t=row.textContent||'';if(t.includes('03.09.2026')||t.includes('02.09.2026')||t.includes('RBC')||t.includes('Oppenheimer')) addBadge(row.querySelector('td:first-child'),'NEU')});document.querySelectorAll('#tab-events .news-item').forEach(item=>{if((item.textContent||'').includes('RBC startet Coverage')) addBadge(item.querySelector('h4'),'NEU')})}
    const footer=document.querySelector('footer.shell');if(footer)footer.textContent='Market Agent · Datenstand 04.09.2026 · 17:00 · Quellen in jedem Eintrag';
  }
  async function waitForDashboard(){for(let i=0;i<80;i++){if(Array.isArray(window.holdings)&&holdings.length===12&&typeof renderCards==='function'&&typeof renderDetail==='function')return;await new Promise(r=>setTimeout(r,250));}throw new Error('Dashboard initialization timeout')}
  async function boot(){await waitForDashboard();await new Promise(r=>setTimeout(r,12500));applyRun();renderCards();renderDetail();markRun();[1000,3000].forEach(d=>setTimeout(markRun,d));document.addEventListener('click',e=>{if(e.target.closest('.holding,.tab,.filter'))setTimeout(markRun,0)});window.addEventListener('pageshow',()=>setTimeout(markRun,0));}
  boot().catch(()=>{const chip=document.getElementById('content-state-chip'),text=document.getElementById('content-state');if(chip){chip.classList.remove('status-ok','status-partial','status-closed');chip.classList.add('status-error')}if(text)text.textContent='Inhalte: letzter erfolgreicher Stand 04.09.2026 · 10:00 · US-Aktualisierung fehlgeschlagen';});
})();