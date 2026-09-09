(() => {
  const STAMP = '2026-09-09T17:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-05-09';
  const CHECKED_IDS = new Set(['CAT','JBL','LMT','MCD','AMZN','MEDP','NTAP','RNG']);
  const CHANGED_IDS = new Set(['JBL','AMZN']);
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
  function addNews(h, entry) {
    h.news = upsert(h.news, entry, (a,b) => a.date === b.date && a.title === b.title && a.source === b.source);
  }
  function pushUnique(list, value) {
    const items = Array.isArray(list) ? list : [];
    return items.includes(value) ? items : [value].concat(items);
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

    for (const id of ['CAT','LMT','MCD','MEDP','NTAP','RNG']) {
      const h = holdings.find(x => x.id === id); if (!h) continue;
      h.analystNote = `Rollierendes Vier-Monats-Fenster ab 09.05.2026, geprüft bis 09.09.2026 17:00 CEST. Unternehmens-/IR- sowie mehrere frei zugängliche Analystenquellen wurden auf neue belastbar verifizierbare Einzelrevisionen geprüft; seit dem vorherigen US-Lauf wurde keine zusätzliche Einzelrevision übernommen.`;
      h.insiderNote = `Rollierendes Vier-Monats-Fenster ab 09.05.2026. SEC Form 4 und ergänzende Insiderquellen wurden auf neue relevante Transaktionen geprüft; seit dem vorherigen US-Lauf wurde keine zusätzliche belastbar verifizierte diskretionäre Open-Market-Transaktion übernommen.`;
    }

    const jbl = holdings.find(h => h.id === 'JBL');
    if (jbl) {
      jbl.analysts = (jbl.analysts || []).filter(a => a.house !== 'Goldman Sachs');
      addAnalyst(jbl,{house:'Goldman Sachs',analyst:'Mark Delaney',date:'2026-09-08',rating:'Buy',target:375,reason:'Buy bestätigt; Kursziel von 482 auf 375 USD gesenkt. Die Revision reduziert den Bewertungs-Upside deutlich, hält aber an der positiven Grundmeinung fest.',quality:'Analyst Mark Delaney · historische Güte: n. v.',source:'https://www.benzinga.com/quote/jbl/price-targets'});
      jbl.analystNote = 'Rollierendes Vier-Monats-Fenster ab 09.05.2026, geprüft bis 09.09.2026 17:00 CEST. Goldman Sachs/Mark Delaney vom 08.09. ergänzt: Buy bestätigt, Kursziel von 482 auf 375 USD reduziert; die ältere Goldman-Zielangabe wurde als durch diese Revision ersetzt entfernt.';
      jbl.insiderNote = 'SEC Form 4 und ergänzende Insiderquellen im Vier-Monats-Fenster geprüft; seit dem vorherigen US-Lauf keine neue belastbar verifizierte diskretionäre Open-Market-Transaktion übernommen.';
      jbl.lastChangedAt = STAMP; jbl.changedSections = ['Analysten']; jbl.updateStatus='updated'; jbl.updateTag='AKTUALISIERT';
    }

    const amzn = holdings.find(h => h.id === 'AMZN');
    if (amzn) {
      addNews(amzn,{date:'2026-09-09',sourceName:'Reuters',category:'Finanzierung / KI-Investitionen',title:'Amazon platziert erstmals Pfund-Anleihen über 4,25 Mrd. GBP',summary:'Amazon nahm über vier Laufzeiten insgesamt 4,25 Mrd. GBP auf. Die Emission diversifiziert die Finanzierung der kapitalintensiven Expansion; die Nachfrage lag laut Reuters bei mehr als 12 Mrd. GBP.',impact:0,impactText:'Neutral; Stärke 1. Die Finanzierung erhöht Liquiditätsflexibilität für AI-/Infrastrukturinvestitionen, unterstreicht zugleich den hohen Kapitalbedarf.',source:'https://www.reuters.com/business/finance/amazon-starts-selling-first-sterling-bonds-lead-managers-say-2026-09-09/'});
      addNews(amzn,{date:'2026-09-08',sourceName:'Qualcomm / Reuters',category:'AWS / AI-Infrastruktur',title:'Amazon und Qualcomm vereinbaren mehrjährige Zusammenarbeit für kundenspezifische AI-Chips',summary:'AWS und Qualcomm arbeiten über mehrere Generationen an kundenspezifischem Silizium für AI-Inferenz sowie an optischer Hochgeschwindigkeitsanbindung bis 1,6T. Reuters berichtet zusätzlich über einen langfristigen Beschaffungsrahmen und Warrants für Amazon.',impact:2,impactText:'Positiv; Stärke 2. Die Kooperation erweitert Amazons Optionen für eigene AI-Infrastruktur und kann Kosten-, Effizienz- und Lieferkettenflexibilität gegenüber reinem GPU-Bezug erhöhen.',source:'https://www.qualcomm.com/news/releases/2026/09/qualcomm-announces-multi-generational-product-collaboration-with'});
      amzn.tailwinds = pushUnique(amzn.tailwinds,'Mehrjährige Qualcomm-Kooperation erweitert AWS bei kundenspezifischem AI-Silizium und Hochgeschwindigkeitsvernetzung.');
      amzn.risks = pushUnique(amzn.risks,'Zusätzliche internationale Anleiheemissionen zeigen den weiter hohen Finanzierungsbedarf der sehr kapitalintensiven AI-Infrastrukturstrategie.');
      amzn.analystNote = 'Rollierendes Vier-Monats-Fenster ab 09.05.2026, geprüft bis 09.09.2026 17:00 CEST. Mehrere Analystenquellen geprüft; seit dem vorherigen US-Lauf keine zusätzliche belastbar verifizierte Einzelrevision übernommen.';
      amzn.insiderNote = 'SEC Form 4 im rollierenden Vier-Monats-Fenster geprüft. Seit dem vorherigen US-Lauf wurde keine zusätzliche belastbar verifizierte diskretionäre Open-Market-Transaktion übernommen.';
      amzn.lastChangedAt = STAMP; amzn.changedSections = ['News','Rückenwind/Risiken']; amzn.updateStatus='updated'; amzn.updateTag='NEU';
    }
  }

  function addBadge(el,label){ if(!el || el.querySelector('.update-badge')) return; const b=document.createElement('span'); b.className='update-badge'; b.textContent=label; el.prepend(b); }
  function markRun(){
    const chip=document.getElementById('content-state-chip'), text=document.getElementById('content-state');
    if(chip&&text){text.textContent=`Inhalte: ${formatStamp(STAMP)}`;chip.classList.remove('status-ok','status-partial','status-error','status-closed');chip.classList.add('status-partial');chip.title='US-Börsen regulär geöffnet. Acht US-Werte geprüft. Teilstatus nur deshalb, weil die angekündigte Datei Holdings (1)(1).md in dieser Conversation-Laufzeit nicht abrufbar war; der ausdrücklich bestätigte 12er-Bestand wurde technisch abgeglichen und keine Position entfernt.';}
    document.querySelectorAll('.update-badge').forEach(el=>el.remove());
    document.querySelectorAll('.holding').forEach(card=>{card.classList.remove('content-changed','content-partial');const h=holdings.find(x=>x.id===card.dataset.id);if(CHANGED_IDS.has(card.dataset.id)){card.classList.add('content-changed');card.title=`Heute inhaltlich aktualisiert · ${(h?.changedSections||[]).join(', ')}`;}else if(h&&CHECKED_IDS.has(h.id)){card.title=`Letzte Inhaltsprüfung: ${formatStamp(STAMP)} · Keine inhaltliche Änderung`;}});
    if(selected==='JBL'){document.querySelectorAll('#tab-research tbody tr').forEach(row=>{if(/Goldman Sachs/.test(row.textContent||'')) addBadge(row.querySelector('td'),'AKTUALISIERT');});}
    if(selected==='AMZN'){document.querySelectorAll('#tab-events .news-item').forEach(item=>{if(/Pfund-Anleihen|Qualcomm/.test(item.textContent||'')) addBadge(item.querySelector('.news-top'),'NEU');});}
    const footer=document.querySelector('footer.shell'); if(footer) footer.textContent='Market Agent · Datenstand 09.09.2026 · 17:00 · Quellen in jedem Eintrag';
  }
  async function boot(){const ready=await waitForHoldings();if(!ready)return;await sleep(14000);applyRun();renderCards();renderDetail();markRun();document.addEventListener('click',e=>{if(e.target.closest('.holding,.tab,.filter'))setTimeout(markRun,0)});document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest('.holding'))setTimeout(markRun,0)});window.addEventListener('pageshow',()=>setTimeout(markRun,0));}
  boot();
})();
