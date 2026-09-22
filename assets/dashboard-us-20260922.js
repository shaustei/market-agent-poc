(() => {
  const STAMP='2026-09-22T17:00:00+02:00', CUTOFF='2026-05-22';
  const CHECKED=new Set(['CAT','JBL','LMT','MCD','AMZN','MEDP','NTAP','RNG']);
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const fmt=v=>new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(v)).replace(',',' ·');
  const analystKey=a=>`${a.house}|${a.date}|${a.rating}|${a.target??''}`;
  const insiderKey=i=>`${i.date}|${i.name}|${i.type}|${i.shares??''}|${i.price??''}`;
  const upsert=(list,item,key)=>[item].concat((list||[]).filter(x=>key(x)!==key(item)));
  async function boot(){
    for(let i=0;i<80;i++){if(Array.isArray(window.holdings||holdings)&&typeof renderCards==='function'&&typeof renderDetail==='function')break;await sleep(150)}
    window.marketAgentUpdateMeta={contentUpdatedAt:STAMP,lastSuccessfulRunAt:STAMP,status:'partial',marketStatus:'US open',holdingsFallback:true};
    if(Array.isArray(holdings)) holdings.forEach(h=>{if(CHECKED.has(h.id)){h.analysts=(h.analysts||[]).filter(x=>!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||x.date>=CUTOFF);h.insiders=(h.insiders||[]).filter(x=>!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||x.date>=CUTOFF);h.lastCheckedAt=STAMP;h.changedSections=[];h.updateStatus='checked';delete h.updateTag}});
    const mcd=holdings.find(h=>h.id==='MCD');
    if(mcd){
      const ms={house:'Morgan Stanley',date:'2026-09-14',rating:'Equalweight',target:308,reason:'Kursziel von 319 auf 308 USD gesenkt. Morgan Stanley erwartet beim Investor Day Details zu NEXT, Timing und Kosten, sieht wegen schwacher kurzfristiger Nachfrage aber keinen zwingenden unmittelbaren positiven Katalysator.',quality:'Analyst: n. v. · historische Güte: n. v.',source:'https://finance.yahoo.com/markets/stocks/articles/mcdonald-apos-investor-day-details-151447452.html'};
      mcd.analysts=upsert(mcd.analysts,ms,analystKey);mcd.changedSections=['Analysten'];mcd.lastChangedAt=STAMP;mcd.updateStatus='changed';mcd.updateTag='NEU';
      mcd.analystNote='Rollierendes Vier-Monats-Fenster ab 22.05.2026, geprüft bis 22.09.2026 17:00 CEST. Morgan Stanley vom 14.09. ergänzt: Equalweight, Kursziel 308 USD nach 319 USD. UBS/Dennis Geiger vom 21.09. bleibt gültig.';
    }
    const medp=holdings.find(h=>h.id==='MEDP');
    if(medp){
      const t1={date:'2026-09-15',name:'August J. Troendle',type:'Verkauf · Open Market / Rule-10b5-1-Plan',shares:15971,price:620.84,volume:9915445.64,context:'President & CEO, Director und 10%-Owner. SEC Form 4; Verkauf am 15.09.2026. Fußnote des Filings verweist auf einen vorab eingerichteten Rule-10b5-1-Handelsplan; daher nicht als spontanes negatives Insidersignal gewertet.',source:'https://www.sec.gov/Archives/edgar/data/1622058/000162205826000012/xslF345X06/wk-form4_1789677576.xml'};
      const t2={date:'2026-09-16',name:'August J. Troendle',type:'Verkauf · Open Market / Rule-10b5-1-Plan',shares:8770,price:621.29,volume:5448713.30,context:'President & CEO, Director und 10%-Owner. SEC Form 4; Verkauf am 16.09.2026. Planbasierte Transaktion gemäß Filing-Fußnote; von discretionary Open-Market-Verkäufen getrennt eingeordnet.',source:'https://www.sec.gov/Archives/edgar/data/1622058/000162205826000012/xslF345X06/wk-form4_1789677576.xml'};
      medp.insiders=upsert(upsert(medp.insiders,t1,insiderKey),t2,insiderKey);medp.changedSections=['Insider'];medp.lastChangedAt=STAMP;medp.updateStatus='changed';medp.updateTag='NEU';
      medp.insiderNote='Rollierendes Vier-Monats-Fenster ab 22.05.2026. Neu verifiziert per SEC Form 4: CEO August J. Troendle verkaufte am 15.09. 15.971 Aktien zu durchschnittlich 620,84 USD und am 16.09. 8.770 Aktien zu durchschnittlich 621,29 USD. Filing-Fußnote: Rule-10b5-1-Plan; daher kein spontaner discretionary Verkauf.';
    }
    const ntap=holdings.find(h=>h.id==='NTAP');
    if(ntap){
      const ms={house:'Morgan Stanley',date:'2026-09-18',rating:'Equalweight',target:191,reason:'Equalweight bestätigt, Kursziel 191 USD. Die Einschätzung bleibt zurückhaltender als bei bullishen Häusern; die Bewertung wird gegen die weiterhin robuste Storage-/AI-Nachfrage abgewogen.',quality:'Analyst: Erik Woodring · historische Güte: n. v.',source:'https://stockanalysis.com/stocks/ntap/forecast/'};
      ntap.analysts=upsert(ntap.analysts,ms,analystKey);ntap.changedSections=['Analysten'];ntap.lastChangedAt=STAMP;ntap.updateStatus='changed';ntap.updateTag='NEU';
      ntap.analystNote='Rollierendes Vier-Monats-Fenster ab 22.05.2026, geprüft bis 22.09.2026 17:00 CEST. Neu ergänzt: Morgan Stanley/Erik Woodring, Equalweight, Ziel 191 USD vom 18.09.; bestehende valide Einträge bleiben erhalten.';
    }
    const c=document.getElementById('content-state-chip'),t=document.getElementById('content-state');if(c&&t){t.textContent=`Inhalte: ${fmt(STAMP)}`;c.classList.remove('status-ok','status-error','status-closed');c.classList.add('status-partial');c.title='Holdings-Datei nicht erreichbar – letzter bestätigter Bestand verwendet.'}
    const f=document.querySelector('footer.shell');if(f)f.textContent='Market Agent · Datenstand 22.09.2026 · 17:00 · Quellen in jedem Eintrag';
    renderCards();renderDetail();
    [500,1500,4000,8000,15000].forEach(ms=>setTimeout(()=>{const t=document.getElementById('content-state');if(t)t.textContent=`Inhalte: ${fmt(STAMP)}`},ms));
  }
  boot();
})();