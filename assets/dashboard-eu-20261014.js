(() => {
  'use strict';
  // Recovery artifact for the interrupted 14 Oct EU run. No invented research or success timestamp.
  const IDS=['HNR1','EUNL','LHA','ALV'];
  const MESSAGE='Holdings-Datei nicht erreichbar – letzter bestätigter Bestand verwendet.';
  function apply(){
    if(!Array.isArray(window.holdings)||window.holdings.length!==12||!IDS.every(id=>window.holdings.some(h=>h.id===id)))return false;
    // The earlier EU patch remains the source of verified changes; this file is a publication-integrity marker.
    for(const id of IDS){
      const h=window.holdings.find(x=>x.id===id);
      if(!h.changedSections)h.changedSections=[];
      if(!h.updateStatus)h.updateStatus='unverified';
      if(!Object.prototype.hasOwnProperty.call(h,'lastCheckedAt'))h.lastCheckedAt=null;
      if(!Object.prototype.hasOwnProperty.call(h,'lastChangedAt'))h.lastChangedAt=null;
    }
    const prev=window.marketAgentUpdateMeta||{};
    window.marketAgentUpdateMeta={
      ...prev,
      contentUpdatedAt:prev.contentUpdatedAt||null,
      lastSuccessfulRunAt:prev.lastSuccessfulRunAt||null,
      status:'partial',holdingsFallback:true,scope:'EU',
      researchCompleteness:'incomplete',
      recoveryFile:'assets/dashboard-eu-20261014.js',
      recoveryNotice:MESSAGE
    };
    const chip=document.getElementById('content-state-chip');
    if(chip)chip.title=MESSAGE+' EU-Lauf 14.10.2026 nicht vollständig abgeschlossen.';
    return true;
  }
  let tries=0;
  const timer=setInterval(()=>{if(apply()||++tries>=80)clearInterval(timer)},100);
})();
