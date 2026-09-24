(() => {
const STAMP='2026-09-24T17:00:00+02:00',CUTOFF='2026-05-24';
const CHECKED=new Set(['CAT','JBL','LMT','MCD','AMZN','MEDP','NTAP','RNG']);
const key=a=>`${a.house}|${a.date}|${a.rating}|${a.target??''}`;
const upsert=(list,item)=>[item].concat((list||[]).filter(x=>key(x)!==key(item)));
function run(){
window.marketAgentUpdateMeta={contentUpdatedAt:STAMP,lastSuccessfulRunAt:STAMP,status:'partial',marketStatus:'US open',holdingsFallback:true};
holdings.forEach(h=>{if(CHECKED.has(h.id)){h.analysts=(h.analysts||[]).filter(x=>!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||x.date>=CUTOFF);h.insiders=(h.insiders||[]).filter(x=>!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||x.date>=CUTOFF);h.lastCheckedAt=STAMP;h.changedSections=[];h.updateStatus='checked';delete h.updateTag}});
const mcd=holdings.find(h=>h.id==='MCD');
if(mcd){[
{house:'TD Cowen',date:'2026-09-24',rating:'Hold',target:270,reason:'Andrew Charles senkte das Kursziel nach dem Investor Day von 282 auf 270 USD; der Zeitpfad der operativen Erholung bleibt unklar.',quality:'Analyst: Andrew Charles · historische Güte: n. v.',source:'https://finance.yahoo.com/markets/stocks/articles/mcd-stock-rises-premarket-retail-080243148.html'},
{house:'Evercore ISI',date:'2026-09-24',rating:'Outperform',target:300,reason:'David Palmer bestätigte die positive Einstufung und senkte das Kursziel von 320 auf 300 USD.',quality:'Analyst: David Palmer · historische Güte: n. v.',source:'https://stockanalysis.com/stocks/mcd/forecast/'},
{house:'BMO Capital',date:'2026-09-24',rating:'Outperform',target:310,reason:'BMO senkte das Kursziel nach dem Investor Day von 335 auf 310 USD und bestätigte Outperform.',quality:'Analyst: Andrew Strelzik · historische Güte: n. v.',source:'https://finance.yahoo.com/markets/stocks/articles/bmo-capital-adjusts-pt-mcdonald-093334158.html'},
{house:'BTIG',date:'2026-09-24',rating:'Buy',target:295,reason:'Peter Saleh bestätigte Buy und senkte das Kursziel von 350 auf 295 USD.',quality:'Analyst: Peter Saleh · historische Güte: n. v.',source:'https://www.benzinga.com/quote/mcd/price-targets'},
{house:'Jefferies',date:'2026-09-24',rating:'Buy',target:325,reason:'Andy Barish bestätigte Buy und 325 USD; positiv wertet er die langfristig stärkere Margenexpansion.',quality:'Analyst: Andy Barish · historische Güte: n. v.',source:'https://www.streetinsider.com/Analyst+Comments/Jefferies+Reiterates+Buy+Rating+on+McDonalds+%28MCD%29/27098800.html'}
].forEach(a=>mcd.analysts=upsert(mcd.analysts,a));mcd.analystNote='Rollierendes Vier-Monats-Fenster, geprüft bis 24.09.2026 17:00 CEST. Neue Analystenreaktionen nach dem Investor Day ergänzt; historische Güte öffentlich nicht belastbar verfügbar.';mcd.changedSections=['Analysten'];mcd.lastChangedAt=STAMP;mcd.updateStatus='changed';mcd.updateTag='NEU'}
const t=document.getElementById('content-state'),c=document.getElementById('content-state-chip');if(t)t.textContent='Inhalte: 24.09.2026 · 17:00';if(c){c.classList.remove('status-ok','status-error','status-closed');c.classList.add('status-partial');c.title='Holdings-Datei nicht erreichbar – letzter bestätigter Bestand verwendet.'}const f=document.querySelector('footer.shell');if(f)f.textContent='Market Agent · Datenstand 24.09.2026 · 17:00 · Quellen in jedem Eintrag';renderCards();renderDetail();}
let n=0,i=setInterval(()=>{if(Array.isArray(window.holdings||holdings)&&typeof renderCards==='function'){clearInterval(i);run()}else if(++n>80)clearInterval(i)},150);
})();