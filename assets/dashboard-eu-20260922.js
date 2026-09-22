(() => {
  const STAMP='2026-09-22T10:00:00+02:00', CUTOFF='2026-05-22';
  const CHECKED=new Set(['HNR1','EUNL','LHA','ALV']);
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const fmt=v=>new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(v)).replace(',',' ·');
  async function boot(){
    for(let i=0;i<50;i++){if(Array.isArray(window.holdings)&&window.holdings.length===12&&typeof window.renderCards==='function')break;await sleep(100)}
    if(!Array.isArray(window.holdings)||window.holdings.length!==12)return;
    window.marketAgentUpdateMeta={contentUpdatedAt:STAMP,lastSuccessfulRunAt:STAMP,status:'partial',marketStatus:'EU open',holdingsFallback:true};
    window.holdings.forEach(h=>{if(!CHECKED.has(h.id))return;h.analysts=(h.analysts||[]).filter(x=>!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||x.date>=CUTOFF);h.insiders=(h.insiders||[]).filter(x=>!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||x.date>=CUTOFF);h.lastCheckedAt=STAMP;h.changedSections=[];h.updateStatus='checked';delete h.updateTag});
    const hnr=window.holdings.find(h=>h.id==='HNR1');if(hnr){hnr.next='22.09.2026 · Baader Investment Conference';hnr.analystNote='Rollierendes Vier-Monats-Fenster ab 22.05.2026, geprüft bis 22.09.2026 10:00 CEST. Keine neue belastbar verifizierte Einzelrevision gegenüber dem Lauf vom 21.09.; bestehende valide Einträge bleiben erhalten.';hnr.insiderNote='Rollierendes Vier-Monats-Fenster ab 22.05.2026 geprüft; keine neue relevante diskretionäre Open-Market-Transaktion verifiziert.';}
    const etf=window.holdings.find(h=>h.id==='EUNL');if(etf){etf.analystNote='Nicht anwendbar: ETF. ISIN IE00B4L5Y983; Analysten- und Insiderfelder sind nicht anwendbar.';etf.insiderNote='Nicht anwendbar: Ein ETF hat keine Unternehmensinsider.';}
    const lha=window.holdings.find(h=>h.id==='LHA');if(lha){lha.analystNote='Rollierendes Vier-Monats-Fenster ab 22.05.2026, geprüft bis 22.09.2026 10:00 CEST. Keine neue belastbar verifizierte Einzelrevision gegenüber dem vorherigen EU-Lauf.';lha.insiderNote='Rollierendes Vier-Monats-Fenster ab 22.05.2026 geprüft; keine neue relevante diskretionäre Open-Market-Transaktion verifiziert.';}
    const alv=window.holdings.find(h=>h.id==='ALV');if(alv){alv.analystNote='Rollierendes Vier-Monats-Fenster ab 22.05.2026, geprüft bis 22.09.2026 10:00 CEST. Keine neue belastbar verifizierte Einzelrevision gegenüber dem Lauf vom 21.09.; bestehende valide Einträge bleiben erhalten.';alv.insiderNote='Rollierendes Vier-Monats-Fenster ab 22.05.2026 geprüft; keine neue relevante diskretionäre Open-Market-Transaktion verifiziert.';}
    window.renderCards();window.renderDetail();
    const t=document.getElementById('content-state'),c=document.getElementById('content-state-chip');if(t)t.textContent=`Inhalte: ${fmt(STAMP)}`;if(c){c.classList.remove('status-ok','status-error','status-closed');c.classList.add('status-partial');c.title='Holdings-Datei nicht erreichbar – letzter bestätigter Bestand verwendet.'}
    const f=document.querySelector('footer.shell');if(f)f.textContent='Market Agent · Datenstand 22.09.2026 · 10:00 · Quellen in jedem Eintrag';
  }
  boot();
})();