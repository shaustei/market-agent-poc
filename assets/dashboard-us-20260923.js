(() => {
  const STAMP='2026-09-23T17:00:00+02:00', CUTOFF='2026-05-23';
  const CHECKED=new Set(['CAT','JBL','LMT','MCD','AMZN','MEDP','NTAP','RNG']);
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const fmt=v=>new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(v)).replace(',',' ·');
  const newsKey=n=>`${n.date}|${n.title}`, triggerKey=t=>`${t.date}|${t.title}`;
  const upsert=(list,item,key)=>[item].concat((list||[]).filter(x=>key(x)!==key(item)));
  async function boot(){
    for(let i=0;i<80;i++){if(Array.isArray(window.holdings||holdings)&&typeof renderCards==='function'&&typeof renderDetail==='function')break;await sleep(150)}
    window.marketAgentUpdateMeta={contentUpdatedAt:STAMP,lastSuccessfulRunAt:STAMP,status:'partial',marketStatus:'US open',holdingsFallback:true};
    if(Array.isArray(holdings)) holdings.forEach(h=>{if(CHECKED.has(h.id)){h.analysts=(h.analysts||[]).filter(x=>!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||x.date>=CUTOFF);h.insiders=(h.insiders||[]).filter(x=>!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||x.date>=CUTOFF);h.lastCheckedAt=STAMP;h.changedSections=[];h.updateStatus='checked';delete h.updateTag}});
    const mcd=holdings.find(h=>h.id==='MCD');
    if(mcd){
      const n={date:'2026-09-23',sourceName:"McDonald's / SEC 8-K",category:'Investor Day / Strategie',title:"McDonald's > NEXT: neue 2030-Ziele und 8,5 Mrd. USD Franchisee-Unterstützung",summary:'McDonald’s stellte beim Investor Day die NEXT-Strategie vor. Bis 2030 werden eine operative Marge im niedrigen bis mittleren 50%-Bereich, jeweils 1,5 Prozentpunkte Marktanteilsgewinn bei Chicken und Beverages sowie rund 250 Basispunkte Effizienzgewinn auf Restaurant-Bruttoebene angestrebt. Zusätzlich sind rund 8,5 Mrd. USD Unterstützung für Franchisees bis 2036 vorgesehen.',impactText:'Gemischt bis positiv; Stärke 3. Die langfristigen Margen-, Marktanteils- und Effizienzziele stärken den strategischen Case, während die hohe Franchisee-Unterstützung den kurzfristigen Cashflow belastet und die Umsetzung entscheidend bleibt.',impact:2,source:'https://www.sec.gov/Archives/edgar/data/63908/'};
      mcd.news=upsert(mcd.news,n,newsKey);mcd.next='Q3 2026 · Termin noch zu bestätigen';mcd.changedSections=['News','Trigger','Investment-Einordnung'];mcd.lastChangedAt=STAMP;mcd.updateStatus='changed';mcd.updateTag='NEU';
    }
    const medp=holdings.find(h=>h.id==='MEDP');
    if(medp){
      const t={date:'2026-10-21',title:'Q3-2026-Ergebnisse',background:'Medpace kündigte die Veröffentlichung der Q3-Zahlen nach US-Börsenschluss am 21.10.2026 an; Conference Call am 22.10. um 09:00 ET. Im Fokus stehen Umsatzwachstum, Backlog, Book-to-Bill und Stornoentwicklung.',direction:'neutral',criteria:[1,1,1],source:'https://investor.medpace.com/',sourceName:'Medpace IR',status:'bestätigt'};
      medp.triggers=upsert(medp.triggers,t,triggerKey);medp.next='21.10.2026 · Q3-Ergebnisse';medp.changedSections=['Termin/Trigger'];medp.lastChangedAt=STAMP;medp.updateStatus='changed';medp.updateTag='NEU';
    }
    const lmt=holdings.find(h=>h.id==='LMT');
    if(lmt){
      const n={date:'2026-09-23',sourceName:'Lockheed Martin',category:'Auftrag / C-130J',title:'Mexiko erweitert C-130J-Flotte um zweites Flugzeug',summary:'Die mexikanische Luftwaffe hat ein zweites C-130J-30 Super Hercules erworben. Die Erweiterung folgt auf die erste Bestellung vom Januar 2026 und stärkt die C-130J-Präsenz in Lateinamerika.',impactText:'Positiv; Stärke 1. Zusätzlicher Auftrag und Referenzwirkung für die Plattform sind positiv, die Einzelbestellung ist gemessen an Lockheed Martins Konzernvolumen jedoch nicht materiell.',impact:1,source:'https://news.lockheedmartin.com/2026-09-23-Mexico-Expands-C-130J-Super-Hercules-Fleet-with-Second-Aircraft'};
      lmt.news=upsert(lmt.news,n,newsKey);lmt.changedSections=['News'];lmt.lastChangedAt=STAMP;lmt.updateStatus='changed';lmt.updateTag='NEU';
    }
    const c=document.getElementById('content-state-chip'),t=document.getElementById('content-state');if(c&&t){t.textContent=`Inhalte: ${fmt(STAMP)}`;c.classList.remove('status-ok','status-error','status-closed');c.classList.add('status-partial');c.title='Holdings-Datei nicht erreichbar – letzter bestätigter Bestand verwendet.'}
    const f=document.querySelector('footer.shell');if(f)f.textContent='Market Agent · Datenstand 23.09.2026 · 17:00 · Quellen in jedem Eintrag';
    renderCards();renderDetail();
  }
  boot();
})();