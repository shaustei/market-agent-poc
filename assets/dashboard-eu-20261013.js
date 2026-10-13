(()=>{
'use strict';
const STAMP='2026-10-13T10:00:00+02:00',IDS=['HNR1','EUNL','LHA','ALV'];
const source={
ALV:'https://www.finanznachrichten.de/nachrichten-2026-10/69792548-jefferies-stuft-allianz-se-auf-hold-322.htm',
LHA:'https://live.deutsche-boerse.com/nachrichten/ANALYSE-FLASH-Bernstein-belaesst-Lufthansa-auf-Market-Perform---Ziel-9-Euro-9e65ac4f-45bb-47ba-8c2d-0a95e2f5eadc',
HNR1:'https://de.marketscreener.com/kurs/aktie/HANNOVER-RE-444736/analystenerwartungen/',
EUNL:'https://www.ishares.com/de/privatanleger/de/produkte/251882/ishares-msci-world-ucits-etf-acc-fund'};
function upsert(list,item){return [item,...(list||[]).filter(x=>!(x.house===item.house&&x.date===item.date&&x.rating===item.rating&&x.target===item.target))]}
function apply(){
if(!Array.isArray(window.holdings)||window.holdings.length!==12||!IDS.every(id=>window.holdings.some(h=>h.id===id)))return false;
const h=id=>window.holdings.find(x=>x.id===id);
for(const id of IDS){const x=h(id);x.lastCheckedAt=STAMP;x.changedSections=[];x.updateStatus='checked';delete x.updateTag;}
function changed(x,sections){x.changedSections=sections;x.lastChangedAt=STAMP;x.updateStatus='changed';x.updateTag='AKTUALISIERT'}
let x=h('ALV');x.analysts=upsert(x.analysts,{house:'Jefferies',date:'2026-10-08',rating:'Hold',target:440,reason:'Philip Kett erhöht das Kursziel von 420 auf 440 EUR. Realisierte Gewinne aus dem indischen Joint Venture werden in festverzinsliche Anlagen reinvestiert; Anleihemarktvolatilität bleibt Risiko.',quality:'Analyst: Philip Kett · historische Güte: n. v.',source:source.ALV});changed(x,['Analysten']);
x=h('LHA');x.analysts=upsert(x.analysts,{house:'Bernstein Research',date:'2026-10-06',rating:'Market-Perform',target:9,reason:'Alex Irving: robuste Nordatlantiknachfrage, aber höhere Kerosinkosten und Risiken für die Jahresziele.',quality:'Analyst: Alex Irving · historische Güte: n. v.',source:source.LHA});changed(x,['Analysten']);
x=h('HNR1');x.analysts=upsert(x.analysts,{house:'Goldman Sachs',date:'2026-10-07',rating:'Buy',target:304,reason:'Kursziel von 301 auf 304 EUR erhöht; detaillierte Originalstudie nicht frei verfügbar.',quality:'Analyst: n. v. · historische Güte: n. v.',source:source.HNR1});changed(x,['Analysten']);
x=h('EUNL');x.analystNote='Nicht anwendbar: ETF.';x.insiderNote='Nicht anwendbar: ETF.';x.thesis=(x.thesis||'').replace(/ Aktueller iShares-Stand:.*$/,'')+' Aktueller iShares-Stand: 1.249 Positionen, KGV 25,82, KBV 4,15; Anteilsklassenvermögen 149,26 Mrd. USD, Fondsvermögen 153,42 Mrd. USD (09.10.2026), TER 0,20 %, physisch/optimiert.';changed(x,['Stammdaten']);
window.marketAgentUpdateMeta={contentUpdatedAt:STAMP,lastSuccessfulRunAt:STAMP,status:'partial',marketStatus:'EU open',holdingsFallback:true,scope:'EU',researchCompleteness:'partial'};
if(typeof window.renderCards==='function')window.renderCards();if(typeof window.renderDetail==='function')window.renderDetail();
return true;
}
let attempts=0;const timer=setInterval(()=>{if(apply()||++attempts>=80)clearInterval(timer)},100);
})();