(() => {
  const STAMP='2026-10-05T10:00:00+02:00', CUTOFF='2026-06-05';
  const CHECKED=new Set(['HNR1','EUNL','LHA','ALV']);
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  async function boot(){
    for(let i=0;i<50;i++){if(Array.isArray(window.holdings)&&window.holdings.length===12&&typeof window.renderCards==='function')break;await sleep(100)}
    if(!Array.isArray(window.holdings)||window.holdings.length!==12)return;
    window.marketAgentUpdateMeta={contentUpdatedAt:STAMP,lastSuccessfulRunAt:STAMP,status:'partial',marketStatus:'EU open',holdingsFallback:true};
    window.holdings.forEach(h=>{if(!CHECKED.has(h.id))return;h.analysts=(h.analysts||[]).filter(x=>!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||x.date>=CUTOFF);h.insiders=(h.insiders||[]).filter(x=>!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||x.date>=CUTOFF);h.lastCheckedAt=STAMP;h.changedSections=[];h.updateStatus='checked';delete h.updateTag});
    const etf=window.holdings.find(h=>h.id==='EUNL');if(etf){etf.analystNote='Nicht anwendbar: ETF. ISIN IE00B4L5Y983; Analysten- und Insiderfelder sind nicht anwendbar.';etf.insiderNote='Nicht anwendbar: Ein ETF hat keine Unternehmensinsider.';etf.changedSections=['Stammdaten'];etf.lastChangedAt=STAMP;etf.updateStatus='changed';etf.updateTag='AKTUALISIERT';etf.thesis=(etf.thesis||'').replace(/ Aktueller iShares-Stand:.*$/,'')+' Aktueller iShares-Stand: 1.250 Positionen, KGV 25,65, KBV 4,13; Anteilsklassenvermögen 148,01 Mrd. USD und Fondsvermögen 152,14 Mrd. USD (02.10.2026), TER 0,20 %, physisch/optimiert.';}
    const hnr=window.holdings.find(h=>h.id==='HNR1');if(hnr){hnr.analystNote='Rollierendes Vier-Monats-Fenster ab 05.06.2026, geprüft bis 05.10.2026 10:00 CEST. Keine neue belastbar verifizierte Einzelrevision gegenüber dem vorherigen erfolgreichen EU-Lauf; bestehende valide Einträge bleiben erhalten.';hnr.insiderNote='Rollierendes Vier-Monats-Fenster ab 05.06.2026 geprüft; keine neue relevante diskretionäre Open-Market-Transaktion verifiziert.';}
    const lha=window.holdings.find(h=>h.id==='LHA');if(lha){lha.analystNote='Rollierendes Vier-Monats-Fenster ab 05.06.2026, geprüft bis 05.10.2026 10:00 CEST. Keine neue belastbar verifizierte Einzelrevision gegenüber dem vorherigen erfolgreichen EU-Lauf.';lha.insiderNote='Rollierendes Vier-Monats-Fenster ab 05.06.2026 geprüft; keine neue relevante diskretionäre Open-Market-Transaktion verifiziert.';}
    const alv=window.holdings.find(h=>h.id==='ALV');if(alv){alv.analystNote='Rollierendes Vier-Monats-Fenster ab 05.06.2026, geprüft bis 05.10.2026 10:00 CEST. Keine neue belastbar verifizierte Einzelrevision gegenüber dem vorherigen erfolgreichen EU-Lauf; bestehende valide Einträge bleiben erhalten.';alv.insiderNote='Rollierendes Vier-Monats-Fenster ab 05.06.2026 geprüft; keine neue relevante diskretionäre Open-Market-Transaktion verifiziert.';}
    window.renderCards();window.renderDetail();
    const t=document.getElementById('content-state'),c=document.getElementById('content-state-chip');if(t)t.textContent='Inhalte: 05.10.2026 · 10:00';if(c){c.classList.remove('status-ok','status-error','status-closed');c.classList.add('status-partial');c.title='Holdings-Datei nicht erreichbar – letzter bestätigter Bestand verwendet.'}
    const f=document.querySelector('footer.shell');if(f)f.textContent='Market Agent · Datenstand 05.10.2026 · 10:00 · Quellen in jedem Eintrag';
  }
  boot();
})();