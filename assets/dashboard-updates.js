(() => {
  const CONTENT_UPDATED_AT = '2026-08-05T17:00:00+02:00';
  const LAST_SUCCESSFUL_RUN_AT = '2026-08-05T17:00:00+02:00';
  const US_UPDATE_AT = '2026-08-04T17:00:00+02:00';
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
        summary:'Caterpillar steigerte den Q2-Umsatz um 24 % auf 20,54 Mrd. USD. Das bereinigte EPS von 8,17 USD lag deutlich über dem Marktkonsens. Construction Industries wuchs 35 %, Power & Energy 17 %. Die Prognose für das Umsatzwachstum 2026 wurde auf einen mittleren bis hohen Zehnerprozentsatz angehoben; erwartete Zollkosten wurden auf rund 2,2 Mrd. USD reduziert.',
        impactText:'Stark positiv; Stärke 3. Ergebnis, Segmentdynamik und Guidance bestätigen den strukturellen Power-/Data-Center-Case. Nach dem zweistelligen Kurssprung steigt jedoch das Bewertungs- und Erwartungsrisiko.', impact:3,
        source:'https://www.reuters.com/business/caterpillar-second-quarter-profit-jumps-strong-power-construction-equipment-2026-08-04/'
      });
      cat.tailwinds = [
        'Q2-Rekordumsatz und der angehobene Jahresausblick bestätigen breite operative Dynamik in Construction sowie Power & Energy.',
        ...(cat.tailwinds || []).filter(v => !v.startsWith('Data-Center- und Stromerzeugungsinvestitionen'))
      ];
      cat.risks = [
        'Der zweistellige Kurssprung nach Q2 erhöht die Fallhöhe; weitere Kursgewinne setzen anhaltende Gewinnrevisionen und hohe Backlog-Umsetzung voraus.',
        ...(cat.risks || []).filter(v => !v.startsWith('Die anspruchsvolle Bewertung'))
      ];
      cat.lastCheckedAt = US_UPDATE_AT;
      cat.lastChangedAt = US_UPDATE_AT;
      cat.changedSections = ['Termin/Trigger','News','Investment-Einordnung','Rückenwind/Risiken'];
      cat.updateStatus = 'updated';
      cat.updateTag = 'AKTUALISIERT';
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
        summary:'McDonald’s erzielte im Q2 7,1 Mrd. USD Umsatz und 3,38 USD bereinigtes EPS. Globale Comparable Sales stiegen 1,3 %, in den USA jedoch nur 0,8 % und damit weniger als erwartet. Das Management verwies auf schwache Ausführung bei Value-Promotions und rückläufige Besuche einkommensschwächerer Kunden. Skye Anderson wurde zur neuen Präsidentin des US-Geschäfts ernannt.',
        impactText:'Moderat negativ; Stärke 2. Die Ertragskraft bleibt robust, aber schwacher US-Traffic und Ausführungsprobleme im Kernmarkt begrenzen kurzfristige Gewinnrevisionen.', impact:-2,
        source:'https://www.reuters.com/business/mcdonalds-us-sales-disappoint-value-deals-fail-draw-enough-diners-2026-08-04/'
      });
      const ubs = {
        house:'UBS', date:'2026-08-03', rating:'Buy', target:340,
        reason:'Kursziel von 365 auf 340 USD gesenkt. UBS sieht weiterhin Marktanteilspotenzial durch Value-Angebote und Produktneuheiten, berücksichtigt aber höheren makroökonomischen Druck.',
        quality:'Historische Güte: n. v.', source:'https://www.investopedia.com/here-is-how-much-mcdonalds-stock-is-expected-to-move-after-earnings-mcd-q2-fy2026-12031009'
      };
      mcd.analysts = [ubs].concat((mcd.analysts || []).filter(a => !(a.house === 'UBS' && a.date === '2026-08-03')));
      mcd.risks = [
        'US-Comparable-Sales von nur 0,8 % und rückläufige Besuche einkommensschwächerer Kunden zeigen kurzfristig begrenzte Preissetzung und schwache Value-Ausführung.',
        ...(mcd.risks || []).filter(v => !v.startsWith('Preissensible und einkommensschwächere Kunden'))
      ];
      mcd.lastCheckedAt = US_UPDATE_AT;
      mcd.lastChangedAt = US_UPDATE_AT;
      mcd.changedSections = ['Termin/Trigger','News','Analysten','Investment-Einordnung','Rückenwind/Risiken'];
      mcd.updateStatus = 'updated';
      mcd.updateTag = 'AKTUALISIERT';
    }
  }

  function enrichMetadata() {
    holdings.forEach(h => {
      if (CHECKED_IDS.has(h.id)) {
        h.lastCheckedAt = LAST_SUCCESSFUL_RUN_AT;
        h.lastChangedAt = h.lastChangedAt || null;
        h.changedSections = [];
        h.updateStatus = 'checked';
        delete h.updateTag;
      }
    });
  }

  function markCards() {
    document.querySelectorAll('.holding').forEach(card => {
      const h = holdings.find(x => x.id === card.dataset.id);
      const changed = Boolean(h?.changedSections?.length) && h?.lastChangedAt?.slice(0,10) === CONTENT_UPDATED_AT.slice(0,10);
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
    if (!h?.updateTag) return;
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