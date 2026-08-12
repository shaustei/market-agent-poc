(() => {
  const STAMP = '2026-08-12T17:00:00+02:00';
  const CHANGED_IDS = new Set(['JBL']);

  function applyPersistentHannoverUpdate() {
    const hnr = holdings.find(h => h.id === 'HNR1');
    if (!hnr) return;

    const h1News = {
      date:'2026-08-12', sourceName:'Hannover Re IR', category:'H1/Q2-Ergebnis',
      title:'H1-Konzernergebnis steigt auf 1,4 Mrd. EUR; Guidance für 2026 bestätigt',
      summary:'Hannover Re steigerte das Konzernergebnis im ersten Halbjahr um 7,0 % auf 1,4 Mrd. EUR. Der P&C-Combined-Ratio verbesserte sich auf 83,2 %, die annualisierte Eigenkapitalrendite lag bei 21,5 % und die Kapitalquote nach Solvency II bei 254 %. Der Kapitalanlageertrag von 3,7 % lag über dem Jahresziel von rund 3,5 %. Die Guidance von mindestens 2,7 Mrd. EUR Konzernergebnis wurde bestätigt.',
      impactText:'Positiv; Stärke 3. Underwriting, Kapitalanlageergebnis und Kapitalisierung liegen robust, die bestätigte Guidance begrenzt das Ergebnisrisiko. Gegenwind bleibt der Preisrückgang bei Renewals.',
      impact:3,
      source:'https://www.hannover-re.com/en/news/2026/hannover-re-generates-very-good-half-year-result-and-remains-on-track-to-achieve-full-year-guidance/'
    };
    hnr.news = [h1News].concat((hnr.news || []).filter(n => !(n.date === h1News.date && n.title === h1News.title)));

    const q3Trigger = {
      date:'2026-11-09', title:'Zwischenmitteilung zum 30. September 2026',
      background:'Nächster regulärer Ergebnis-Trigger. Im Fokus stehen Großschäden, Reserveentwicklung, Renewal-Preise, P&C-Combined-Ratio, Kapitalanlageergebnis und Fortschritt zur Guidance von mindestens 2,7 Mrd. EUR Konzernergebnis.',
      direction:'neutral', criteria:[1,1,0],
      source:'https://www.hannover-re.com/en/investors/events-and-presentations/', sourceName:'Hannover Re IR', status:'bestätigt'
    };
    hnr.triggers = [q3Trigger].concat((hnr.triggers || []).filter(t => !(t.date === q3Trigger.date && t.title === q3Trigger.title)));
    hnr.next = '09.11.2026 · Zwischenmitteilung Q3';

    const jp = {
      house:'JPMorgan', date:'2026-07-28', rating:'Neutral', target:270,
      reason:'Kamran Hossain setzte Hannover Rück vor den Halbjahreszahlen auf Negative Catalyst Watch und beließ Neutral sowie 270 EUR Kursziel. Begründung: Erwartung fortgesetzt schwacher Umsatztrends und Risiko, dass Konsensschätzungen diese noch nicht vollständig widerspiegeln.',
      quality:'Historische Güte: n. v.',
      source:'https://www.finanzen.net/analyse/hannover_rueck_neutral-jp_morgan_chase__co__1094699'
    };
    hnr.analysts = [jp].concat((hnr.analysts || []).filter(a => !(a.house === jp.house && a.date === jp.date)));

    hnr.thesis = 'Operativ robuste Rückversicherung mit hoher Ergebnisqualität und attraktivem Ausschüttungsprofil. H1 2026 bestätigt starke Underwriting- und Kapitalanlagebeiträge sowie eine komfortable Kapitalisierung. Der Investmentcase bleibt positiv, solange Schadenbudget, Reserven und Kapitalquote stabil bleiben; sinkende Renewal-Preise begrenzen jedoch das Margen- und Bewertungsupside.';
    hnr.advice = 'Halten; Rücksetzer selektiv nutzen.';
    hnr.adviceWhy = 'H1 2026 bestätigt die hohe Ergebnisqualität und die Guidance von mindestens 2,7 Mrd. EUR. Gleichzeitig zeigen risikoadjustiert um 4,5 % niedrigere Renewal-Preise zunehmenden Wettbewerbsdruck; deshalb bleibt ein selektiver statt aggressiver Zukauf angemessen.';
    hnr.tailwinds = [
      'H1-Konzernergebnis von 1,4 Mrd. EUR, 21,5 % annualisierte Eigenkapitalrendite und bestätigte Jahresguidance belegen hohe laufende Ertragskraft.',
      'Der P&C-Combined-Ratio von 83,2 % und Großschäden unter Budget stützen die Underwriting-Qualität.',
      'Solvency-II-Quote von 254 % schafft einen komfortablen Kapitalpuffer und unterstützt Ausschüttungsfähigkeit sowie Wachstum.',
      'Kapitalanlageertrag von 3,7 % liegt über dem Jahresziel von rund 3,5 % und verbreitert die Gewinnbasis.'
    ];
    hnr.risks = [
      'Bei den Juni-/Juli-Renewals sanken die Preise risikoadjustiert um 4,5 %; anhaltender Preisdruck kann Margen und Neugeschäftsprofitabilität normalisieren.',
      'Naturkatastrophen, Großschäden und geopolitische Risiken können das verbleibende Schadenbudget im zweiten Halbjahr stärker beanspruchen.',
      'Reserveverstärkungen in älteren Schadenjahren wären ein Warnsignal für die bisher hohe Ergebnisqualität.',
      'Währungseffekte belasteten H1; weitere starke Wechselkursbewegungen können ausgewiesene Ergebnisse und Umsatz verzerren.'
    ];
  }

  function applyJabilUpdate() {
    const jbl = holdings.find(h => h.id === 'JBL');
    if (!jbl) return;

    const analyst = {
      house:'UBS', date:'2026-08-12', rating:'Buy', target:430,
      reason:'David Vogt stuft Jabil von Neutral auf Buy hoch; Kursziel unverändert 430 USD. UBS erwartet einen mehrjährigen AI-Infrastrukturzyklus und rund 20,3 Mrd. USD AI-bezogenen Umsatz im FY2027 nach rund 13,5 Mrd. USD im FY2026, getragen unter anderem von Hyperscaler-Investitionen.',
      quality:'Analyst: David Vogt · historische Güte: n. v.',
      source:'https://www.barrons.com/articles/jabil-stock-buy-ai-amazon-658cd2cb'
    };
    jbl.analysts = [analyst].concat((jbl.analysts || []).filter(a => !(a.house === analyst.house && a.date === analyst.date)));

    const news = {
      date:'2026-08-12', sourceName:'UBS / Barron’s', category:'Analystenrevision',
      title:'UBS stuft Jabil auf Buy hoch; AI-Umsatz soll 2027 deutlich steigen',
      summary:'UBS hob Jabil von Neutral auf Buy an und beließ das Kursziel bei 430 USD. Analyst David Vogt erwartet für FY2027 rund 20,3 Mrd. USD AI-bezogenen Umsatz nach etwa 13,5 Mrd. USD im FY2026; als Treiber gelten Hyperscaler-Investitionen und Jabils Rolle bei Servern, Netzwerk- und Kühlungsinfrastruktur.',
      impactText:'Positiv; Stärke 2. Das Upgrade bestätigt den strukturellen AI-Nachfragecase und erhöht die Visibilität für den Umsatzmix, ohne wegen des unveränderten Kursziels eine fundamentale Neubewertung zu rechtfertigen.',
      impact:2,
      source:'https://www.barrons.com/articles/jabil-stock-buy-ai-amazon-658cd2cb'
    };
    jbl.news = [news].concat((jbl.news || []).filter(n => !(n.date === news.date && n.title === news.title)));

    jbl.changedSections = ['News','Analysten'];
    jbl.updateStatus = 'updated';
    jbl.updateTag = 'NEU';
    jbl.lastChangedAt = STAMP;
  }

  function badgeInto(el, label) {
    if (el && !el.querySelector('.update-badge')) el.insertAdjacentHTML('beforeend', ` <span class="update-badge update-new">${label}</span>`);
  }

  function markChanges() {
    document.querySelectorAll('.holding').forEach(card => {
      if (CHANGED_IDS.has(card.dataset.id)) {
        card.classList.add('content-changed');
        card.title = 'Heute inhaltlich aktualisiert · Jabil Analysten/News';
      }
    });
    document.querySelectorAll('.update-badge').forEach(el => el.remove());
    if (selected !== 'JBL') return;

    document.querySelectorAll('#tab-events .news-item').forEach(item => {
      const title = item.querySelector('h4');
      if (title?.textContent?.includes('UBS stuft Jabil auf Buy hoch')) badgeInto(title, 'NEU');
    });
    document.querySelectorAll('#tab-research tbody tr').forEach(row => {
      const text = row.textContent || '';
      if (text.includes('UBS') && text.includes('12.08.2026')) badgeInto(row.querySelector('td:first-child'), 'NEU');
    });
  }

  async function boot() {
    await new Promise(resolve => setTimeout(resolve, 500));
    applyPersistentHannoverUpdate();
    applyJabilUpdate();
    const priorCards = renderCards;
    renderCards = function(){ priorCards(); markChanges(); };
    const priorDetail = renderDetail;
    renderDetail = function(){ priorDetail(); markChanges(); };
    renderCards();
    renderDetail();
    markChanges();
  }

  boot();
})();
