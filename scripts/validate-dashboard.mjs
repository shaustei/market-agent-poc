#!/usr/bin/env node
// Preflight for future dashboard releases. Run before creating/pushing the release commit.
import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
const read=p=>fs.readFileSync(p,'utf8');
const fail=m=>{throw new Error('Dashboard integrity: '+m)};
const html=read('dashboard.html'),runtime=read('assets/dashboard.js'),symbols=read('netlify/functions/market-data.mts');
const ids=['HNR1','EUNL','CAT','JBL','LMT','LHA','MCD','ALV','AMZN','MEDP','NTAP','RNG'];
const actual=[...runtime.matchAll(/const ids=\[([^\]]+)\]/g)].flatMap(m=>[...m[1].matchAll(/'([^']+)'/g)].map(x=>x[1]));
if(JSON.stringify(actual)!==JSON.stringify(ids))fail('Holdings ID list differs from confirmed baseline; reconcile authoritative holdings first');
const symbolBlock=symbols.match(/const SYMBOLS[^=]*=\s*\{([\s\S]*?)\};/);
if(!symbolBlock)fail('SYMBOLS not found');
const symbolIds=[...symbolBlock[1].matchAll(/^\s*([A-Z0-9]+):/gm)].map(m=>m[1]);
if(ids.some(x=>!symbolIds.includes(x))||symbolIds.length!==ids.length)fail('SYMBOLS mismatch');
if(!/JBL:\s*["']JBL["']/.test(symbolBlock[1]))fail('Jabil ticker mismatch');
if(!html.includes('id="content-state-chip"')||!html.includes('id="content-state"'))fail('Content status chip missing');
const expected='Fundamentals 30, Technik 25, Bewertung/Analysten 20, News/Insider 15, Dividende/Portfoliorolle 10';
if(!html.includes(expected))fail('Scoring methodology changed');
for(const [token,max] of [['fundamental',30],['valuation',20],['news',15],['income',10]])if(!runtime.includes('p.'+token))fail('Score component missing: '+token);
if(!runtime.includes('total>=80')||!runtime.includes('total>=65')||!runtime.includes('total>=50')||!runtime.includes('total>=35'))fail('Score thresholds changed');
const references=[...html.matchAll(/<script\s+src="(\/assets\/dashboard-(?:eu|us)-\d{8}\.js)\?v=(\d{8})-(\d{4})"/g)];
const allRefs=[...html.matchAll(/<script\s+src="(\/assets\/dashboard-(?:eu|us)-\d{8}\.js)[^"]*"/g)];
if(references.length!==allRefs.length)fail('Missing or invalid cache buster on daily script');
const seen=new Set();
for(const [,url,date,time] of references){
 const path=url.slice(1),match=path.match(/dashboard-(eu|us)-(\d{8})\.js$/);
 if(match[2]!==date||time!==(match[1]==='eu'?'1000':'1700'))fail('Cache buster mismatch: '+path);
 if(seen.has(path))fail('Duplicate daily script: '+path);
 seen.add(path);
 if(!fs.existsSync(path))fail('Referenced daily file missing: '+path);
 new vm.Script(read(path),{filename:path});
}
const changed=(process.env.DASHBOARD_CHANGED_FILES||'').split(/\s+/).filter(Boolean);
const daily=changed.filter(p=>/^assets\/dashboard-(eu|us)-\d{8}\.js$/.test(p));
const htmlChanged=changed.includes('dashboard.html');
if(daily.length&&!htmlChanged)fail('New daily file without dashboard.html update in same release');
if(htmlChanged&&!daily.length&&changed.some(p=>p.startsWith('assets/dashboard-')))fail('Dashboard HTML changed without new daily file');
for(const path of daily){
 if(!seen.has(path))fail('New daily file not referenced: '+path);
 const body=read(path);
 if(!/lastSuccessfulRunAt/.test(body)||!/contentUpdatedAt/.test(body))fail('Release metadata missing: '+path);
 if(!/lastCheckedAt/.test(body)||!/changedSections/.test(body)||!/updateStatus/.test(body))fail('Holding metadata missing: '+path);
}
// Ensure that the release does not modify the established scoring/runtime or visual assets.
const protectedFiles=['assets/dashboard.js','assets/dashboard.css','assets/dashboard-updates.css','netlify/functions/market-data.mts'];
if(changed.some(p=>protectedFiles.includes(p))&&!process.env.DASHBOARD_ALLOW_REVIEWED_CORE_CHANGE)fail('Core/layout/market data changed: requires explicit reviewed override');
console.log('Dashboard preflight OK: '+ids.length+' holdings; '+references.length+' daily references; '+daily.length+' new daily files');
