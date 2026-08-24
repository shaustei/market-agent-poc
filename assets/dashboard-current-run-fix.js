(() => {
  const STAMP = '2026-08-24T17:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-04-24';
  const CHECKED_IDS = new Set(['CAT','JBL','LMT','MCD','AMZN']);
  const CHANGED_IDS = new Set(['CAT','MCD']);

  const upsert = (list, item, key) => [item].concat((list || []).filter(x => key(x) !== key(item)));
  const analystKey = a => `${a.house}|${a.date}|${a.rating}|${a.target ?? ''}`;
  const newsKey = n => `${n.date}|${n.title}`;
  const triggerKey = t => `${t.date}|${t.title}`;
  const formatStamp = value => new Intl.DateTimeFormat('de-DE', {
    timeZone:'Europe/Berlin', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'
  }).format(new Date(value)).replace(',', ' ·');

  function persistPriorUpdates() {
    const hnr = holdings.find(h => h.id === 'HNR1');
    if (hnr) {
      const h1News = {date:'2026-08-12',sourceName:'Hannover Re IR',category:'H1/Q2-Ergebnis',title:'H1-Konzernergebnis steigt auf 1,4 Mrd. EUR; Guidance für 2026 bestätigt',summary:'Hannover Re steigerte das Konzernergebnis im ersten Halbjahr um 7,0 % auf 1,4 Mrd. EUR. Der P&C-Combined-Ratio verbesserte sich auf 83,2 %, die annualisierte Eigenkapitalrendite lag bei 21,5 % und die Kapitalquote nach Solvency II bei 254 %. Der Kapitalanlageertrag von 3,7 % lag über dem Jahresziel von rund 3,5 %. Die Guidance von mindestens 2,7 Mrd. EUR Konzernergebnis wurde bestätigt.',impactText:'Positiv; Stärke 3. Underwriting, Kapitalanlageergebnis und Kapitalisierung liegen robust, die bestätigte Guidance begrenzt das Ergebnisrisiko. Gegenwind bleibt der Preisrückgang bei Renewals.',impact:3,source:'https://www.hannover-re.com/en/news/2026/hannover-re-generates-very-good-half-year-result-and-remains-on-track-to-achieve-full-year-guidance/'};
      hnr.news = upsert(hnr.news,h1News,newsKey);
      const q3 = {date:'2026-11-09',title:'Zwischenmitteilung zum 30. September 2026',background:'Nächster regulärer Ergebnis-Trigger. Im Fokus stehen Großschäden, Reserveentwicklung, Renewal-Preise, P&C-Combined-Ratio, Kapitalanlageergebnis und Fortschritt zur Guidance von mindestens 2,7 Mrd. EUR Konzernergebnis.',direction:'neutral',criteria:[1,1,0],source:'https://www.hannover-re.com/en/investors/events-and-presentations/',sourceName:'Hannover Re IR',status:'bestätigt'};
      hnr.triggers = upsert(hnr.triggers,q3,triggerKey); hnr.next='09.11.2026 · Zwischenmitteilung Q3';
    }
    const jbl = holdings.find(h => h.id === 'JBL');
    if (jbl) {
      const a={house:'UBS',date:'2026-08-12',rating:'Buy',target:430,reason:'David Vogt stufte Jabil von Neutral auf Buy hoch; Kursziel unverändert 430 USD. UBS erwartet einen mehrjährigen AI-Infrastrukturzyklus und rund 20,3 Mrd. USD AI-bezogenen Umsatz im FY2027 nach rund 13,5 Mrd. USD im FY2026.',quality:'Analyst: David Vogt · historische Güte: n. v.',source:'https://www.barrons.com/articles/jabil-stock-buy-ai-amazon-658cd2cb'};
      jbl.analysts=upsert(jbl.analysts,a,analystKey);
      const n={date:'2026-08-12',sourceName:'UBS / Barron’s',category:'Analystenrevision',title:'UBS stuft Jabil auf Buy hoch; AI-Umsatz soll 2027 deutlich steigen',summary:'UBS hob Jabil von Neutral auf Buy an und beließ das Kursziel bei 430 USD. Analyst David Vogt erwartet für FY2027 rund 20,3 Mrd. USD AI-bezogenen Umsatz nach etwa 13,5 Mrd. USD im FY2026.',impactText:'Positiv; Stärke 2. Das Upgrade bestätigt den strukturellen AI-Nachfragecase, ohne wegen des unveränderten Kursziels eine fundamentale Neubewertung zu rechtfertigen.',impact:2,source:'https://www.barrons.com/articles/jabil-stock-buy-ai-amazon-658cd2cb'};
      jbl.news=upsert(jbl.news,n,newsKey);
    }
  }

  function applyCurrentRun() {
    window.marketAgentUpdateMeta={contentUpdatedAt:STAMP,lastSuccessfulRunAt:STAMP,status:'partial'};
    holdings.forEach(h => {
      if (!CHECKED_IDS.has(h.id)) return;
      h.analysts=(h.analysts||[]).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date>=FOUR_MONTH_CUTOFF);
      h.insiders=(h.insiders||[]).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date>=FOUR_MONTH_CUTOFF);
      h.lastCheckedAt=STAMP; h.changedSections=[]; h.updateStatus='checked'; delete h.updateTag;
    });

    const cat=holdings.find(h=>h.id==='CAT');
    if(cat){
      cat.next='04.11.2026* · Q3-Ergebnisse (geschätzt)';
      const result={date:'2026-08-04',sourceName:'Caterpillar IR',category:'Q2-Ergebnis',title:'Rekordquartal: Umsatz 20,5 Mrd. USD, Backlog 72,1 Mrd. USD',summary:'Caterpillar meldete für Q2 2026 Rekordumsatz von 20,5 Mrd. USD (+24 %) und bereinigtes EPS von 8,17 USD. Der Auftragsbestand stieg auf rund 72,1 Mrd. USD; besonders stark blieb Power & Energy. Das Unternehmen hob den Umsatzausblick 2026 auf Wachstum im mittleren bis hohen Zehnerprozentbereich an.',impactText:'Stark positiv; Stärke 3. Rekordumsatz, höherer Backlog und angehobener Ausblick bestätigen den strukturellen Power-/Data-Center-Treiber. Hohe Bewertung bleibt der zentrale Gegenpol.',impact:3,source:'https://www.caterpillar.com/en/news/corporate-press-releases/h/2q26-results-caterpillar-inc.html'};
      cat.news=upsert(cat.news,result,newsKey);
      const q3={date:'2026-11-04',title:'Q3-2026-Ergebnisse – vorläufiges Zeitfenster',background:'Nach dem Rekord-Q2 stehen Backlog, Power-&-Energy-Nachfrage, Margen, Tarifeffekte und die Umsetzung des angehobenen Jahresausblicks im Fokus. Termin noch nicht offiziell bestätigt.',direction:'neutral',criteria:[1,0,0],source:'https://www.marketbeat.com/stocks/NYSE/CAT/',sourceName:'MarketBeat / Schätzung',status:'geschätzt'};
      cat.triggers=upsert((cat.triggers||[]).filter(t=>t.date!=='2026-08-04'),q3,triggerKey);
      const evercore={house:'Evercore ISI',date:'2026-08-11',rating:'Outperform',target:1045,reason:'David Raso bestätigte Outperform und senkte das Kursziel von 1.103 auf 1.045 USD nach Q2. Der positive strukturelle Power-/AI-Infrastrukturcase bleibt intakt, bei zugleich höherem Bewertungsrisiko.',quality:'Analyst: David Raso · historische Güte: n. v.',source:'https://trendonify.com/news/ratings/evercore-isi-group-lowers-price-target-on-caterpillar-to-1045-from-1103-maintains-outperform-rating-211612'};
      const zacks={house:'Zacks Research',date:'2026-08-18',rating:'Strong Buy',target:null,reason:'FY2026-EPS-Schätzung auf 26,55 USD angehoben; das Haus verweist auf den starken Q2-Beat, Rekordumsatz und den wachsenden Power-/AI-Backlog.',quality:'Historische Güte: n. v.',source:'https://www.marketbeat.com/instant-alerts/zacks-research-increases-earnings-estimates-for-caterpillar-2026-08-20/'};
      cat.analysts=upsert(upsert(cat.analysts,evercore,analystKey),zacks,analystKey);
      cat.thesis='Strukturelle Nachfrage nach Stromerzeugung, Rechenzentren und Infrastruktur stärkt einen hochwertigen Zykliker. Q2 2026 bestätigte dies mit Rekordumsatz, starkem Backlog und angehobenem Jahresausblick. Nach dem starken Kursanstieg bleibt die Bewertung der dominante Risikofaktor.';
      cat.adviceWhy='Q2 bestätigt positive Gewinn- und Nachfrageimpulse. Wegen der weiterhin anspruchsvollen Bewertung sollten Zukäufe bevorzugt nach Konsolidierung oder bei weiter steigenden Schätzungen ohne zusätzliche Multiple-Ausweitung erfolgen.';
      cat.tailwinds=['Rekordumsatz von 20,5 Mrd. USD und Backlog von rund 72,1 Mrd. USD erhöhen die Visibilität.','Power-&-Energy-Nachfrage profitiert von Rechenzentren, Strominfrastruktur und Kapazitätsengpässen.','Der angehobene 2026-Umsatzausblick bestätigt positive Revisionen nach Q2.','Händlernetz, Ersatzteile und Services stützen wiederkehrende Erlöse und Cashflow.'];
      cat.risks=['Die anspruchsvolle Bewertung setzt anhaltend hohe Gewinnrevisionen voraus.','Bau, Mining und Energie bleiben zyklisch; eine Investitionsabkühlung kann Auftragseingang und Margen gleichzeitig treffen.','Tarife und Lieferkettenkosten können trotz Preiserhöhungen Margen belasten.','Data-Center-Projektverzögerungen oder regulatorische Hürden könnten den Power-Narrativ abschwächen.'];
      cat.analystNote='Rollierendes Vier-Monats-Fenster, geprüft bis 24.08.2026 17:00 CEST. Caterpillar IR, MarketScreener, MarketBeat, Zacks und frei zugängliche Ratingquellen wurden geprüft; Evercore ISI und Zacks nach Q2 ergänzt.';
      cat.insiderNote='Rollierendes Vier-Monats-Fenster ab 24.04.2026 geprüft. SEC-Form-4- und Sekundärquellen geprüft; keine neuere relevante Open-Market-Transaktion gegenüber dem vorhandenen Bestand verifiziert.';
      cat.changedSections=['Termin/Trigger','News','Analysten','Investment-Einordnung','Rückenwind/Risiken']; cat.updateStatus='updated'; cat.updateTag='AKTUALISIERT'; cat.lastChangedAt=STAMP;
    }

    const mcd=holdings.find(h=>h.id==='MCD');
    if(mcd){
      mcd.next='04.11.2026* · Q3-Ergebnisse (geschätzt)';
      const result={date:'2026-08-04',sourceName:'McDonald’s IR',category:'Q2-Ergebnis',title:'Q2: globale Comparable Sales +1,3 %, USA +0,8 %',summary:'McDonald’s meldete für Q2 2026 globale Comparable Sales von +1,3 %, davon +0,8 % in den USA. Umsatz stieg 4 %, bereinigtes EPS auf 3,38 USD. Skye Anderson wurde zur Präsidentin von McDonald’s USA ernannt, um die Ausführung im größten Markt zu beschleunigen.',impactText:'Gemischt bis leicht positiv; Stärke 2. Gewinn und globale Sales wachsen, die US-Dynamik bleibt jedoch weich und rechtfertigt weiter Vorsicht bei Traffic und Margen.',impact:1,source:'https://corporate.mcdonalds.com/corpmcd/our-stories/article/Q2-2026-results.html'};
      mcd.news=upsert(mcd.news,result,newsKey);
      const q3={date:'2026-11-04',title:'Q3-2026-Ergebnisse – vorläufiges Zeitfenster',background:'Im Fokus stehen US-Traffic, Comparable Sales, Value-Angebote, Restaurantmargen und Fortschritte unter der neuen US-Führung. Termin noch nicht offiziell bestätigt.',direction:'neutral',criteria:[1,0,0],source:'https://www.marketbeat.com/stocks/NYSE/MCD/',sourceName:'MarketBeat / Schätzung',status:'geschätzt'};
      mcd.triggers=upsert((mcd.triggers||[]).filter(t=>t.date!=='2026-08-04'),q3,triggerKey);
      [
        {house:'Citigroup',date:'2026-08-05',rating:'Buy',target:345,reason:'Kursziel von 335 auf 345 USD angehoben, Buy bestätigt. Die Revision folgt auf Q2 und reflektiert trotz weicher US-Sales weiter positives mittelfristiges Potenzial.',quality:'Historische Güte: n. v.',source:'https://www.marketscreener.com/quote/stock/MCDONALD-S-CORPORATION-4833/consensus/'},
        {house:'JPMorgan',date:'2026-08-05',rating:'Overweight',target:280,reason:'Kursziel von 305 auf 280 USD gesenkt, Overweight bestätigt. Die Senkung reflektiert schwächere kurzfristige US-Dynamik nach Q2.',quality:'Historische Güte: n. v.',source:'https://www.marketscreener.com/quote/stock/MCDONALD-S-CORPORATION-4833/consensus/'},
        {house:'Daiwa Securities',date:'2026-08-06',rating:'Outperform',target:293,reason:'Kursziel von 309 auf 293 USD gesenkt, Outperform bestätigt. Fokus bleibt auf einer Verbesserung der US-Ausführung nach dem weicheren Q2.',quality:'Historische Güte: n. v.',source:'https://www.marketscreener.com/quote/stock/MCDONALD-S-CORPORATION-4833/consensus/'}
      ].forEach(a=>{mcd.analysts=upsert(mcd.analysts,a,analystKey);});
      mcd.thesis='Defensives globales Franchise-Modell mit starker Marke, hoher Cash-Conversion und langjähriger Dividendentradition. Q2 2026 zeigte weiter positives globales Wachstum, aber mit nur +0,8 % Comparable Sales in den USA bleibt die Ausführung im größten Markt der zentrale kurzfristige Prüfpunkt.';
      mcd.adviceWhy='Q2 bestätigt Stabilität, aber noch keine klare US-Beschleunigung. Ein größerer Zukauf sollte auf bessere US-Kundenfrequenz, stabilere Comparable Sales und belastbare Margenverbesserung warten.';
      mcd.analystNote='Rollierendes Vier-Monats-Fenster, geprüft bis 24.08.2026 17:00 CEST. McDonald’s IR, MarketScreener und MarketBeat wurden geprüft; Post-Q2-Revisionen von Citigroup, JPMorgan und Daiwa ergänzt.';
      mcd.insiderNote='Rollierendes Vier-Monats-Fenster ab 24.04.2026 geprüft. Der 10b5-1-Verkauf vom 23.04. liegt nun außerhalb des Fensters; keine neue relevante Open-Market-Transaktion verifiziert.';
      mcd.changedSections=['Termin/Trigger','News','Analysten','Investment-Einordnung']; mcd.updateStatus='updated'; mcd.updateTag='AKTUALISIERT'; mcd.lastChangedAt=STAMP;
    }

    const jbl=holdings.find(h=>h.id==='JBL'); if(jbl){jbl.analystNote='Rollierendes Vier-Monats-Fenster, geprüft bis 24.08.2026 17:00 CEST. Jabil IR, MarketBeat/MarketScreener und frei zugängliche Analystenquellen geprüft; keine neuere materielle Revision nach UBS vom 12.08. verifiziert.';jbl.insiderNote='Rollierendes Vier-Monats-Fenster ab 24.04.2026 geprüft. SEC Form 4 geprüft; Gary Schicks Verkauf vom 15.07. bleibt als Rule-10b5-1-Transaktion eingeordnet. Keine neuere relevante Open-Market-Transaktion verifiziert.';}
    const lmt=holdings.find(h=>h.id==='LMT'); if(lmt){lmt.analystNote='Rollierendes Vier-Monats-Fenster, geprüft bis 24.08.2026 17:00 CEST. Lockheed Martin IR, MarketBeat/MarketScreener und frei zugängliche Analystenquellen geprüft; keine neuere materielle Einzelrevision nach dem vorhandenen Post-Q2-Bestand verifiziert.';lmt.insiderNote='Rollierendes Vier-Monats-Fenster ab 24.04.2026 geprüft. SEC Form 4 geprüft; keine neue relevante Open-Market-Transaktion verifiziert. Vergütungs-/Deferred-Compensation-Vorgänge bleiben ohne Handelssignal.';}
    const amzn=holdings.find(h=>h.id==='AMZN'); if(amzn){amzn.analystNote='Rollierendes Vier-Monats-Fenster, geprüft bis 24.08.2026 17:00 CEST. Amazon IR, MarketBeat/MarketScreener und frei zugängliche Analystenquellen geprüft; keine neuere materielle Einzelrevision gegenüber dem Post-Q2-Bestand verifiziert.';amzn.insiderNote='Rollierendes Vier-Monats-Fenster ab 24.04.2026 geprüft. SEC Form 4 geprüft; keine neue relevante diskretionäre Open-Market-Transaktion verifiziert. Plan-, Vesting- und Vergütungsvorgänge werden getrennt behandelt.';}
  }

  function badgeInto(el,label){if(el&&!el.querySelector('.update-badge'))el.insertAdjacentHTML('beforeend',` <span class="update-badge update-new">${label}</span>`);}
  function markChanges(){
    const chip=document.getElementById('content-state-chip'), text=document.getElementById('content-state');
    if(chip&&text){text.textContent=`Inhalte: ${formatStamp(STAMP)}`;chip.classList.remove('status-ok','status-partial','status-error','status-closed');chip.classList.add('status-partial');chip.title='Teilaktualisierung: Holdings.md bzw. eine neuere Holdings-Datei war im Repository nicht verfügbar; der bestätigte 9er-Sollbestand wurde technisch vollständig abgeglichen.';}
    document.querySelectorAll('.holding').forEach(card=>{card.classList.remove('content-changed','content-partial');const h=holdings.find(x=>x.id===card.dataset.id);if(CHANGED_IDS.has(card.dataset.id)){card.classList.add('content-changed');card.title=`Heute inhaltlich aktualisiert · ${(h?.changedSections||[]).join(', ')}`;}else if(CHECKED_IDS.has(card.dataset.id)){card.title=`Letzte Inhaltsprüfung: ${formatStamp(STAMP)} · Keine inhaltliche Änderung`;}});
    document.querySelectorAll('.update-badge').forEach(el=>el.remove());
    if(CHANGED_IDS.has(selected)){
      document.querySelectorAll('#tab-events .news-item').forEach(item=>{const t=item.textContent||'';if((selected==='CAT'&&t.includes('Rekordquartal'))||(selected==='MCD'&&t.includes('globale Comparable Sales')))badgeInto(item.querySelector('h4'),'AKTUALISIERT');});
      document.querySelectorAll('#tab-research tbody tr').forEach(row=>{const t=row.textContent||'';if((selected==='CAT'&&(t.includes('Evercore')||t.includes('Zacks')))||(selected==='MCD'&&(t.includes('Citigroup')||t.includes('JPMorgan')||t.includes('Daiwa'))))badgeInto(row.querySelector('td:first-child'),'NEU');});
    }
    const footer=document.querySelector('footer.shell'); if(footer)footer.textContent='Market Agent · Datenstand 24.08.2026 · 17:00 · Quellen in jedem Eintrag';
  }

  async function boot(){await new Promise(r=>setTimeout(r,520));persistPriorUpdates();applyCurrentRun();const pc=renderCards;renderCards=function(){pc();markChanges();};const pd=renderDetail;renderDetail=function(){pd();markChanges();};renderCards();renderDetail();markChanges();}
  boot().catch(()=>{const chip=document.getElementById('content-state-chip'),text=document.getElementById('content-state');if(chip){chip.classList.remove('status-ok','status-partial','status-closed');chip.classList.add('status-error');}if(text)text.textContent='Inhalte: letzter erfolgreicher Stand 21.08.2026 · 10:00 · Aktualisierung fehlgeschlagen';});
})();
