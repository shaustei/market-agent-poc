(() => {
  const STAMP = '2026-08-12T10:00:00+02:00';
  const CHANGED_IDS = new Set(['HNR1']);

  function applyChanges() {
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

    hnr.changedSections = ['Termin/Trigger','News','Analysten','Investment-Einordnung','Rückenwind/Risiken'];
    hnr.updateStatus = 'updated';
    hnr.updateTag = 'AKTUALISIERT';
    hnr.lastChangedAt = STAMP;
  }

  function addBadge(selector, label='AKTUALISIERT') {
    const el = document.querySelector(selector);
    if (el && !el.querySelector('.update-badge')) el.insertAdjacentHTML('beforeend', ` <span class="update-badge update-updated">${label}</span>`);
  }

  function markChanges() {
    document.querySelectorAll('.holding').forEach(card => {
      if (CHANGED_IDS.has(card.dataset.id)) {
        card.classList.add('content-changed');
        card.title = 'Heute inhaltlich aktualisiert · Hannover Re H1 2026';
      }
    });
    document.querySelectorAll('.update-badge').forEach(el => el.remove());
    if (selected !== 'HNR1') return;
    addBadge('#tab-overview .box:nth-child(1) h3');
    addBadge('#tab-overview .box:nth-child(2) h3');
    addBadge('#tab-overview .box:nth-child(3) h3');
    addBadge('#tab-events .box:nth-child(1) h3');
    addBadge('#tab-events .box:nth-child(2) h3');
    addBadge('#tab-research .box:nth-child(1) h3');
  }

  async function boot() {
    await new Promise(resolve => setTimeout(resolve, 500));
    applyChanges();
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
