(() => {
  const STAMP='2026-09-21T17:00:00+02:00', CUTOFF='2026-05-21';
  const CHECKED=new Set(['CAT','JBL','LMT','MCD','AMZN','MEDP','NTAP','RNG']);
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const fmt=v=>new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(v)).replace(',',' ·');
  const analystKey=a=>`${a.house}|${a.date}|${a.rating}|${a.target??''}`;
  const upsert=(list,item,key)=>[item].concat((list||[]).filter(x=>key(x)!==key(item)));
  async function boot(){
    for(let i=0;i<80;i++){if(Array.isArray(window.holdings||holdings)&&typeof renderCards==='function'&&typeof renderDetail==='function')break;await sleep(150)}
    window.marketAgentUpdateMeta={contentUpdatedAt:STAMP,lastSuccessfulRunAt:STAMP,status:'partial',marketStatus:'US open',holdingsFallback:true};
    if(Array.isArray(holdings)) holdings.forEach(h=>{if(CHECKED.has(h.id)){h.analysts=(h.analysts||[]).filter(x=>!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||x.date>=CUTOFF);h.insiders=(h.insiders||[]).filter(x=>!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||x.date>=CUTOFF);h.lastCheckedAt=STAMP;h.changedSections=[];h.updateStatus='checked';delete h.updateTag}});
    const mcd=holdings.find(h=>h.id==='MCD');
    if(mcd){
      const ubs={house:'UBS',date:'2026-09-21',rating:'Buy',target:320,reason:'Dennis Geiger senkte das Kursziel von 340 auf 320 USD und bestätigte Buy. Begründet wurde die Anpassung mit schwächeren Bewertungen im Quick-Service-Restaurant-Sektor und Herausforderungen beim US-Umsatz; der Investor Day am 23.09. bleibt der nächste zentrale Trigger.',quality:'Analyst: Dennis Geiger · historische Güte: n. v.',source:'https://www.investing.com/news/stock-market-news/ubs-lowers-mcdonalds-stock-price-target-on-us-sales-challenges-93CH-4846096'};
      mcd.analysts=upsert(mcd.analysts,ubs,analystKey);mcd.changedSections=['Analysten'];mcd.lastChangedAt=STAMP;mcd.updateStatus='changed';mcd.updateTag='NEU';
      mcd.analystNote='Rollierendes Vier-Monats-Fenster ab 21.05.2026, geprüft bis 21.09.2026 17:00 CEST. Neu: UBS/Dennis Geiger bestätigt Buy und senkt das Kursziel von 340 auf 320 USD; weitere valide Einträge im Fenster bleiben erhalten.';
    }
    const c=document.getElementById('content-state-chip'),t=document.getElementById('content-state');if(c&&t){t.textContent=`Inhalte: ${fmt(STAMP)}`;c.classList.remove('status-ok','status-error','status-closed');c.classList.add('status-partial');c.title='Holdings-Datei nicht erreichbar – letzter bestätigter Bestand verwendet.'}
    const f=document.querySelector('footer.shell');if(f)f.textContent='Market Agent · Datenstand 21.09.2026 · 17:00 · Quellen in jedem Eintrag';
    renderCards();renderDetail();
    [500,1500,4000,8000,15000].forEach(ms=>setTimeout(()=>{const t=document.getElementById('content-state');if(t)t.textContent=`Inhalte: ${fmt(STAMP)}`},ms));
  }
  boot();
})();