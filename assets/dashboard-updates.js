(() => {
  const CONTENT_UPDATED_AT = '2026-08-07T17:00:00+02:00';
  const LAST_SUCCESSFUL_RUN_AT = '2026-08-07T17:00:00+02:00';
  const EU_UPDATE_AT = '2026-08-07T10:00:00+02:00';
  const US_UPDATE_AT = '2026-08-07T17:00:00+02:00';
  const RUN_STATUS = 'ok';
  const CHECKED_IDS = new Set(['CAT','JBL','LMT','MCD','AMZN']);

  const formatStamp = value => new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(value)).replace(',', ' ·');

  function setContentChip() {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (!chip || !text) return;
    text.textContent = `Inhalte: ${formatStamp(CONTENT_UPDATED_AT)}`;
    chip.classList.remove('status-ok','status-partial','status-error','status-closed');
    chip.classList.add(RUN_STATUS === 'ok' ? 'status-ok' : RUN_STATUS === 'partial' ? 'status-partial' : RUN_STATUS === 'closed' ? 'status-closed' : 'status-error');
    chip.title = 'Letzter erfolgreich veröffentlichter Inhaltsstand';
  }

  function upsertByDate(items, entry) {
    return [entry].concat((items || []).filter(item => !(item.date === entry.date && item.title === entry.title)));
  }

  function applyEuUpdate() {
    const alv = holdings.find(h => h.id === 'ALV');
    if (!alv) return;
    alv.next = '12.11.2026 · Q3-Ergebnisse';
    alv.advice = 'Halten / selektiv zukaufen; operative Stärke bestätigt, Bewertung beachten.';
    alv.adviceWhy = 'Q2 brachte ein Rekord-Operativresultat, starke Kapitalisierung und Rekordzuflüsse im Asset Management. Der Rückgang des berichteten Nettoergebnisses beruht vor allem auf Restrukturierungsaufwendungen; die Jahresprognose bleibt bestätigt. Nach der starken Kursentwicklung bleibt die Bewertung der wichtigste kurzfristige Gegenpunkt.';
    alv.thesis = 'Global diversifizierter Versicherer und Asset Manager mit hoher Kapitalstärke, belastbarer Ertragsbasis und klarer Ausschüttungspolitik. Q2 2026 bestätigt den Investmentcase mit Rekord-Operativgewinn, 225 % Solvency-II-Quote und starken Asset-Management-Zuflüssen; Restrukturierungskosten drücken jedoch das berichtete Nettoergebnis.';
    alv.triggers = upsertByDate(alv.triggers, {
      date:'2026-08-07', title:'Q2 2026: Rekord-Operativgewinn, Jahresausblick bestätigt',
      background:'Operativer Gewinn 4,874 Mrd. EUR (+10,6 %), Gesamtgeschäftsvolumen 45,6 Mrd. EUR und Solvency-II-Quote 225 %. Das berichtete Aktionärs-Nettoergebnis sank auf 2,595 Mrd. EUR; Restrukturierungsaufwendungen belasteten. Der operative Gewinn-Ausblick von 17,4 Mrd. EUR ±1 Mrd. EUR bleibt bestätigt.',
      direction:'up', criteria:[1,1,1], source:'https://www.allianz.com/content/dam/onemarketing/azcom/Allianz_com/press/document/results/2026-2q/2q-2026-earnings-release-allianz.pdf', sourceName:'Allianz IR', status:'veröffentlicht'
    });
    alv.news = upsertByDate(alv.news, {
      date:'2026-08-07', sourceName:'Allianz IR', category:'Q2/H1-Ergebnis',
      title:'Rekord-Operativgewinn und stärkere Kapitalquote; Nettoergebnis durch Restrukturierung belastet',
      summary:'Allianz steigerte den operativen Gewinn im Q2 um 10,6 % auf 4,874 Mrd. EUR. Die Solvency-II-Quote erreichte 225 %. Asset Management erzielte 39 Mrd. EUR Nettozuflüsse. Das den Aktionären zurechenbare Nettoergebnis sank auf 2,595 Mrd. EUR; Restrukturierungsaufwendungen belasteten. Die Jahresprognose von 17,4 Mrd. EUR ±1 Mrd. EUR operativem Gewinn wurde bestätigt.',
      impactText:'Positiv; Stärke 3. Operativer Rekordgewinn, Kapitalstärke und starke Asset-Management-Zuflüsse bestätigen die Ertragsqualität; Restrukturierungskosten belasten das berichtete Nettoergebnis.', impact:3,
      source:'https://www.allianz.com/content/dam/onemarketing/azcom/Allianz_com/press/document/results/2026-2q/2q-2026-earnings-release-allianz.pdf'
    });
    alv.tailwinds = [
      'Q2 2026 erreichte mit 4,874 Mrd. EUR den höchsten operativen Quartalsgewinn; alle Segmente liegen über dem Halbjahres-Mittelpunkt ihrer Jahresziele.',
      'Asset Management erzielte im Q2 39 Mrd. EUR Nettozuflüsse und erhöhte die Dritt-AuM auf 2,161 Bio. EUR.',
      'Die Solvency-II-Quote stieg auf 225 % und schafft hohen Puffer für Ausschüttungen, Wachstum und unerwartete Großschäden.',
      'Die Übernahme von HSBC Life Singapore und die 15-jährige exklusive HSBC-Vertriebspartnerschaft erweitern Kundenreichweite und Wachstumspotenzial im asiatisch-pazifischen Raum.'
    ];
    alv.risks = [
      'Restrukturierungsaufwendungen von 643 Mio. EUR belasteten das Q2-Nettoergebnis; entscheidend ist, ob die IT-/AI-Investitionen künftig messbare Produktivitätsgewinne liefern.',
      'Der Kurs liegt nahe dem 52-Wochen-Hoch; dadurch ist die Sicherheitsmarge geringer.',
      'Naturkatastrophen, Schadeninflation und Reservestärkungen können die Combined Ratio und das Quartalsergebnis deutlich belasten.',
      'Kapitalmarktvolatilität und Abflüsse bei PIMCO oder AllianzGI würden Gebühreneinnahmen und Ergebnisqualität im Asset Management schwächen.'
    ];
    alv.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 07.08.2026 10:00 CEST. Bis zum Prüfzeitpunkt wurde keine belastbare neue Q2-Reaktion mit Rating und Kursziel verifiziert. Bestehende valide Einträge bleiben erhalten.';
    alv.insiderNote = 'Offizielle Allianz-Directors’-Dealings-Seite und EQS wurden bis 07.08.2026 10:00 CEST geprüft. Im rollierenden Vier-Monats-Fenster wurde keine klar verifizierte discretionary Open-Market-Transaktion gefunden.';
  }

  function applyUsUpdate() {
    const cat = holdings.find(h => h.id === 'CAT');
    if (cat) {
      cat.next = 'Q3 2026 · Termin noch unbestätigt';
      cat.advice = 'Halten; nach dem Kurssprung nicht hinterherlaufen.';
      cat.adviceWhy = 'Q2 übertraf Umsatz- und Ergebniserwartungen deutlich und die Jahresumsatzprognose wurde angehoben. Der positive operative Trend ist bestätigt; nach dem zweistelligen Tagesanstieg bleibt die Bewertung jedoch der zentrale Risikofaktor.';
      cat.thesis = 'Strukturelle Nachfrage nach Stromerzeugung, Rechenzentren und Infrastruktur stärkt einen hochwertigen Zykliker. Das Rekordquartal bestätigt den AI-/Power-Case; zugleich erhöht der starke Kursanstieg die Abhängigkeit von weiteren Gewinnrevisionen und sauberer Ausführung.';
      cat.triggers = upsertByDate(cat.triggers, {
        date:'2026-08-04', title:'Q2 2026: Rekordumsatz und angehobener Jahresausblick',
        background:'Umsatz 20,54 Mrd. USD (+24 %), bereinigtes EPS 8,17 USD. Caterpillar erwartet für 2026 nun Umsatzwachstum im mittleren bis hohen Zehnerprozentbereich. Im Fokus bleiben Backlog, Data-Center-/Power-Nachfrage, Margen und Zollkosten.',
        direction:'up', criteria:[1,1,1], source:'https://www.reuters.com/business/caterpillar-second-quarter-profit-jumps-strong-power-construction-equipment-2026-08-04/', sourceName:'Caterpillar / Reuters', status:'veröffentlicht'
      });
      cat.news = upsertByDate(cat.news, {
        date:'2026-08-04', sourceName:'Caterpillar / Reuters', category:'Q2-Ergebnis / Guidance',
        title:'Rekordumsatz, deutlicher Ergebnis-Beat und höherer Jahresausblick',
        summary:'Caterpillar steigerte den Q2-Umsatz um 24 % auf 20,54 Mrd. USD. Das bereinigte EPS von 8,17 USD lag deutlich über dem Marktkonsens. Die Prognose für das Umsatzwachstum 2026 wurde angehoben; erwartete Zollkosten wurden auf rund 2,2 Mrd. USD reduziert.',
        impactText:'Stark positiv; Stärke 3. Ergebnis, Segmentdynamik und Guidance bestätigen den strukturellen Power-/Data-Center-Case. Nach dem zweistelligen Kurssprung steigt jedoch das Bewertungs- und Erwartungsrisiko.', impact:3,
        source:'https://www.reuters.com/business/caterpillar-second-quarter-profit-jumps-strong-power-construction-equipment-2026-08-04/'
      });
      cat.tailwinds = ['Q2-Rekordumsatz und der angehobene Jahresausblick bestätigen breite operative Dynamik in Construction sowie Power & Energy.', ...(cat.tailwinds || []).filter(v => !v.startsWith('Data-Center- und Stromerzeugungsinvestitionen'))];
      cat.risks = ['Der zweistellige Kurssprung nach Q2 erhöht die Fallhöhe; weitere Kursgewinne setzen anhaltende Gewinnrevisionen und hohe Backlog-Umsetzung voraus.', ...(cat.risks || []).filter(v => !v.startsWith('Die anspruchsvolle Bewertung'))];
    }

    const mcd = holdings.find(h => h.id === 'MCD');
    if (mcd) {
      mcd.next = 'Q3 2026 · Termin noch unbestätigt';
      mcd.advice = 'Halten; operativen US-Turnaround abwarten.';
      mcd.adviceWhy = 'Das bereinigte EPS übertraf die Erwartungen, aber Umsatz und US-Comparable-Sales blieben schwach. Die neue US-Führung und erneuerte Value-Maßnahmen müssen erst steigende Kundenfrequenz und bessere Ausführung zeigen.';
      mcd.thesis = 'Defensives globales Franchise-Modell mit starker Marke, hoher Cash-Conversion und langjähriger Dividendentradition. Q2 bestätigte die Ertragsstabilität, zeigte aber zugleich schwache US-Kundenfrequenz und Ausführungsprobleme bei Value-Angeboten.';
      mcd.triggers = upsertByDate(mcd.triggers, {
        date:'2026-08-04', title:'Q2 2026: US-Wachstum schwach, neue US-Leitung',
        background:'Bereinigtes EPS 3,38 USD über Erwartung; Umsatz 7,1 Mrd. USD leicht unter Konsens. US-Comparable-Sales stiegen nur 0,8 %. Skye Anderson übernimmt die Leitung des US-Geschäfts. Entscheidend sind Traffic, Value-Umsetzung und Servicequalität.',
        direction:'down', criteria:[1,1,1], source:'https://corporate.mcdonalds.com/corpmcd/investors/financial-information.html', sourceName:'McDonald’s / Reuters', status:'veröffentlicht'
      });
      mcd.news = upsertByDate(mcd.news, {
        date:'2026-08-04', sourceName:'McDonald’s / Reuters', category:'Q2-Ergebnis / Management',
        title:'Gewinn über Erwartung, aber US-Comparable-Sales enttäuschen',
        summary:'McDonald’s erzielte im Q2 7,1 Mrd. USD Umsatz und 3,38 USD bereinigtes EPS. Globale Comparable Sales stiegen 1,3 %, in den USA jedoch nur 0,8 %. Skye Anderson wurde zur neuen Präsidentin des US-Geschäfts ernannt.',
        impactText:'Moderat negativ; Stärke 2. Die Ertragskraft bleibt robust, aber schwacher US-Traffic und Ausführungsprobleme im Kernmarkt begrenzen kurzfristige Gewinnrevisionen.', impact:-2,
        source:'https://www.reuters.com/business/mcdonalds-us-sales-disappoint-value-deals-fail-draw-enough-diners-2026-08-04/'
      });
      const ubs = {house:'UBS', date:'2026-07-27', rating:'Buy', target:340, reason:'Kursziel von 365 auf 340 USD gesenkt; Buy bestätigt. Makrodruck wird berücksichtigt, während Value-Angebote und Produktneuheiten Marktanteilspotenzial stützen.', quality:'Historische Güte: n. v.', source:'https://www.tipranks.com/stocks/mcd/forecast'};
      const btig = {house:'BTIG', date:'2026-07-24', rating:'Buy', target:350, reason:'Kursziel von 370 auf 350 USD gesenkt; Buy bestätigt. Value-Angebote, Produktinnovation und operative Effizienz stützen den langfristigen Case.', quality:'Historische Güte: n. v.', source:'https://www.marketbeat.com/instant-alerts/mcdonalds-nysemcd-price-target-lowered-to-35000-at-btig-research-2026-07-24/'};
      mcd.analysts = [ubs,btig].concat((mcd.analysts || []).filter(a => !((a.house === 'UBS' && (a.date === '2026-07-27' || a.date === '2026-08-03')) || (a.house === 'BTIG' && a.date === '2026-07-24'))));
      mcd.risks = ['US-Comparable-Sales von nur 0,8 % und rückläufige Besuche einkommensschwächerer Kunden zeigen kurzfristig begrenzte Preissetzung und schwache Value-Ausführung.', ...(mcd.risks || []).filter(v => !v.startsWith('Preissensible und einkommensschwächere Kunden'))];
      mcd.lastChangedAt = US_UPDATE_AT;
      mcd.changedSections = ['Analysten'];
      mcd.updateStatus = 'updated';
      mcd.updateTag = 'KORRIGIERT';
    }

    const lmt = holdings.find(h => h.id === 'LMT');
    if (lmt) {
      lmt.news = upsertByDate(lmt.news, {
        date:'2026-08-07', sourceName:'Reuters / Rheinmetall', category:'Munitionskapazität / ATACMS',
        title:'Geplante ATACMS-Produktion mit Rheinmetall unterstreicht Kapazitätsbedarf',
        summary:'Rheinmetall erwartet, dass der Hochlauf einer gemeinsamen ATACMS-Produktion mit Lockheed Martin Zeit benötigt. Die geplante Fertigung in Unterlüß wartet noch auf finale Freigabe; US-Regierungsunterstützung ist laut Rheinmetall vorhanden, erste Erlöse werden ab 2028 erwartet.',
        impactText:'Moderat positiv; Stärke 2. Zusätzliche europäische Produktionskapazität adressiert strukturell hohe Raketen-Nachfrage und knappe US-Bestände. Kurzfristig bleibt der Effekt begrenzt, da die Kooperation noch genehmigt werden muss und Erlöse erst ab 2028 erwartet werden.', impact:2,
        source:'https://www.reuters.com/business/aerospace-defense/rheinmetall-ceo-expects-atacms-revenues-2028-boxer-deal-by-year-end-2026-08-07/'
      });
      lmt.tailwinds = ['Die geplante ATACMS-Fertigung mit Rheinmetall würde zusätzliche europäische Produktionskapazität für stark nachgefragte Raketen schaffen; finale Genehmigung steht noch aus.', ...(lmt.tailwinds || []).filter(v => !v.startsWith('Die geplante ATACMS-Fertigung'))];
      lmt.lastChangedAt = US_UPDATE_AT;
      lmt.changedSections = ['News','Rückenwind/Risiken'];
      lmt.updateStatus = 'updated';
      lmt.updateTag = 'AKTUALISIERT';
    }
  }

  function enrichMetadata() {
    holdings.forEach(h => {
      if (!CHECKED_IDS.has(h.id)) return;
      h.lastCheckedAt = LAST_SUCCESSFUL_RUN_AT;
      h.lastChangedAt = h.lastChangedAt || null;
      const changedThisRun = Boolean(h.changedSections?.length) && h.lastChangedAt === US_UPDATE_AT;
      if (!changedThisRun) {
        h.changedSections = [];
        h.updateStatus = 'checked';
        delete h.updateTag;
      }
    });
  }

  function markCards() {
    document.querySelectorAll('.holding').forEach(card => {
      const h = holdings.find(x => x.id === card.dataset.id);
      const changed = Boolean(h?.changedSections?.length) && h?.lastChangedAt === US_UPDATE_AT;
      card.classList.toggle('content-changed', changed);
      card.classList.toggle('content-partial', h?.updateStatus === 'partial');
      if (h?.lastCheckedAt) card.title = `Letzte Inhaltsprüfung: ${formatStamp(h.lastCheckedAt)}${h.changedSections?.length ? ` · Geändert: ${h.changedSections.join(', ')}` : ' · Keine inhaltliche Änderung'}`;
    });
  }

  function badge(label) {
    const cls = label === 'KORRIGIERT' ? 'update-corrected' : label === 'AKTUALISIERT' ? 'update-updated' : 'update-new';
    return `<span class="update-badge ${cls}">${label}</span>`;
  }

  function markDetail() {
    const h = holdings.find(x => x.id === selected);
    if (!h?.updateTag || h?.lastChangedAt !== US_UPDATE_AT) return;
    const thesis = document.querySelector('#tab-overview .thesis');
    if (thesis && !thesis.querySelector('.update-badge')) thesis.insertAdjacentHTML('afterbegin', badge(h.updateTag) + ' ');
    if (h.changedSections?.includes('Termin/Trigger')) {
      const firstTrigger = document.querySelector('#tab-events .trigger');
      if (firstTrigger && !firstTrigger.querySelector('.update-badge')) firstTrigger.insertAdjacentHTML('afterbegin', badge(h.updateTag));
    }
    if (h.changedSections?.includes('News')) {
      const firstNews = document.querySelector('#tab-events .news-item');
      if (firstNews && !firstNews.querySelector('.update-badge')) firstNews.insertAdjacentHTML('afterbegin', badge(h.updateTag));
    }
    if (h.changedSections?.includes('Analysten')) {
      const firstAnalyst = document.querySelector('#tab-research tbody tr');
      if (firstAnalyst && !firstAnalyst.querySelector('.update-badge')) firstAnalyst.insertAdjacentHTML('afterbegin', badge(h.updateTag));
    }
  }

  function installWrappers() {
    const baseCards = renderCards;
    renderCards = function(){ baseCards(); markCards(); };
    const baseDetail = renderDetail;
    renderDetail = function(){ baseDetail(); markDetail(); };
  }

  async function boot() {
    setContentChip();
    for (let i = 0; i < 80 && (!Array.isArray(holdings) || holdings.length === 0); i++) await new Promise(r => setTimeout(r, 50));
    applyUsUpdate();
    applyEuUpdate();
    installWrappers();
    enrichMetadata();
    renderCards();
    renderDetail();
  }

  boot().catch(() => {
    const chip = document.getElementById('content-state-chip');
    chip?.classList.add('status-error');
    const text = document.getElementById('content-state');
    if (text) text.textContent = `Inhalte: ${formatStamp(LAST_SUCCESSFUL_RUN_AT)} · Warnung`;
  });
})();