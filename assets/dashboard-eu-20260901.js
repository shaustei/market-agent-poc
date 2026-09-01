(() => {
  const STAMP = '2026-09-01T10:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-05-01';
  const CHECKED_IDS = new Set(['HNR1','EUNL','LHA','ALV']);
  const HNR_TITLE = 'H1 2026: Konzerngewinn +7 % auf 1,4 Mrd. EUR; Jahresziel bestätigt';
  const LHA_TITLE = 'Q2 2026: Umsatz +8 %, Adjusted EBIT fällt auf 383 Mio. EUR; Guidance als Bandbreite';
  const formatStamp = value => new Intl.DateTimeFormat('de-DE', {
    timeZone:'Europe/Berlin', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'
  }).format(new Date(value)).replace(',', ' ·');
  const upsert = (items, entry, same) => [entry].concat((items || []).filter(item => !same(item, entry)));

  function applyRun() {
    window.marketAgentUpdateMeta = { contentUpdatedAt: STAMP, lastSuccessfulRunAt: STAMP, status: 'partial' };

    holdings.forEach(h => {
      if (!CHECKED_IDS.has(h.id)) return;
      h.analysts = (h.analysts || []).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date >= FOUR_MONTH_CUTOFF);
      h.insiders = (h.insiders || []).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date >= FOUR_MONTH_CUTOFF);
      h.lastCheckedAt = STAMP;
      h.changedSections = [];
      h.updateStatus = 'checked';
      delete h.updateTag;
    });

    const hnr = holdings.find(h => h.id === 'HNR1');
    if (hnr) {
      const h1 = {
        date:'2026-08-12', sourceName:'Hannover Re IR', category:'H1-Ergebnis',
        title:HNR_TITLE,
        summary:'Hannover Rück steigerte den Konzerngewinn im ersten Halbjahr 2026 um 7,0 % auf 1,4 Mrd. EUR und bestätigte das Gewinnziel für 2026. Treiber waren Großschäden unter Erwartung, profitables Rückversicherungswachstum und Kapitalanlageerträge über Ziel.',
        impactText:'Positiv; Stärke 3. Ergebnisqualität und Guidance sind bestätigt. Gegenpunkt bleibt die Normalisierung der Renewal-Preise.',
        impact:3,
        source:'https://www.hannover-re.com/de/'
      };
      hnr.news = upsert(hnr.news, h1, (a,b) => a.date === b.date && a.title === b.title);
      hnr.next = '07.09.2026 · Monte Carlo Pressefrühstück';
      hnr.adviceWhy = 'Das starke Halbjahr mit 1,4 Mrd. EUR Konzerngewinn und bestätigtem Jahresziel stützt den Qualitäts- und Dividenden-Case. Selektive Zukäufe bleiben bei Rücksetzern attraktiver, da die Renewal-Preise weiter normalisieren können.';
      hnr.analystNote = 'Rollierendes Vier-Monats-Fenster ab 01.05.2026, geprüft bis 01.09.2026 10:00 CEST. Hannover-Re-IR, dpa-AFX/FinanzNachrichten und MarketScreener wurden geprüft; keine neuere belastbar verifizierte Einzelanalyse als der vorhandene Bestand übernommen.';
      hnr.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 01.05.2026 geprüft. Keine neue verifizierte relevante Directors’-Dealings-Transaktion gegenüber dem vorhandenen Bestand gefunden.';
      hnr.lastChangedAt = STAMP;
      hnr.changedSections = ['Termin/Trigger','News','Investment-Einordnung'];
      hnr.updateStatus = 'corrected';
      hnr.updateTag = 'KORRIGIERT';
    }

    const lha = holdings.find(h => h.id === 'LHA');
    if (lha) {
      const q2 = {
        date:'2026-08-04', sourceName:'Lufthansa Group', category:'Q2/H1-Ergebnis',
        title:LHA_TITLE,
        summary:'Der Q2-Umsatz stieg um 8 % auf 11,1 Mrd. EUR. Adjusted EBIT sank von 870 Mio. EUR auf 383 Mio. EUR; höhere Treibstoffkosten belasteten gegenüber Vorjahr um rund 750 Mio. EUR, Streiks um mindestens 150 Mio. EUR. Für 2026 erwartet Lufthansa nun 1,7–2,2 Mrd. EUR Adjusted EBIT; der Free-Cashflow-Ausblick von rund 0,9 Mrd. EUR blieb bestehen.',
        impactText:'Negativ; Stärke 3. Nachfrage und Yields sind robust, aber Treibstoff- und Streikkosten drücken Marge und Ergebnis deutlich; die Bandbreiten-Guidance erhöht die Unsicherheit.',
        impact:-3,
        source:'https://newsroom.lufthansagroup.com/en/lufthansa-group-benefits-from-strong-demand-for-air-travel-and-achieves-an-operating-profit-of-383-million-euros-despite-significantly-higher-fuel-costs/'
      };
      lha.news = upsert(lha.news, q2, (a,b) => a.date === b.date && a.title === b.title);
      lha.next = '02.09.2026 · Commerzbank & ODDO BHF Conference';
      lha.triggers = upsert(lha.triggers, {
        date:'2026-09-02', title:'Commerzbank & ODDO BHF Conference',
        background:'Management-/IR-Kommentare nach dem schwachen Q2 sind relevant für Treibstoffkosten, Nachfrage, Yield, Kapazität und die neue Adjusted-EBIT-Bandbreite von 1,7–2,2 Mrd. EUR.',
        direction:'neutral', criteria:[1,1,1],
        source:'https://investor-relations.lufthansagroup.com/en/events/financial-calendar.html',
        sourceName:'Lufthansa IR', status:'bestätigt'
      }, (a,b) => a.date === b.date && a.title === b.title);
      lha.advice = 'Halten; erst bei klarerer Margenstabilisierung aufstocken.';
      lha.adviceWhy = 'Robuste Nachfrage, Cargo und Technik stützen, aber Q2 zeigte starken Ergebnisdruck durch Kerosin und Streiks. Die neue Bandbreiten-Guidance erhöht die Unsicherheit; ein Zukauf benötigt mehr Sichtbarkeit bei Kosten und Marge.';
      lha.analystNote = 'Rollierendes Vier-Monats-Fenster ab 01.05.2026, geprüft bis 01.09.2026 10:00 CEST. Lufthansa IR, dpa-AFX/FinanzNachrichten und MarketScreener wurden geprüft; keine neue belastbar verifizierte Einzelanalyse seit dem vorherigen Lauf übernommen.';
      lha.insiderNote = 'Lufthansa IR Directors’ Dealings wurde geprüft. Im rollierenden Vier-Monats-Fenster ab 01.05.2026 wurde keine neue meldepflichtige Transaktion gefunden; die IR-Seite weist als jüngste Meldungen Vorgänge aus 03/2026 aus.';
      lha.lastChangedAt = STAMP;
      lha.changedSections = ['Termin/Trigger','News','Investment-Einordnung'];
      lha.updateStatus = 'corrected';
      lha.updateTag = 'KORRIGIERT';
    }

    const etf = holdings.find(h => h.id === 'EUNL');
    if (etf) {
      etf.analystNote = 'Nicht anwendbar: ETF. Produktmerkmale am 01.09.2026 gegen iShares geprüft: ISIN IE00B4L5Y983, thesaurierend, TER 0,20 %, UCITS; 1.279 Fondspositionen per 28.08.2026.';
      etf.insiderNote = 'Nicht anwendbar: Ein ETF hat keine Unternehmensinsider.';
    }

    const alv = holdings.find(h => h.id === 'ALV');
    if (alv) {
      const tx = [
        ['Dr. Klaus-Peter Röhler',338,124824.63,'https://www.eqs-news.com/de/news/directors-dealings/allianz-se-dr-klaus-peter-roehler-kauf-als-eigeninvestment-der-vorstaende-entsprechend-dem-vorstandsdienstvertrag/17d490e8-1de2-4832-8bd0-d740865dbfcc_de'],
        ['Dr. Andreas Wimmer',338,124824.63,'https://www.eqs-news.com/news/directors-dealings/allianz-se-dr-andreas-wimmer-acquisition-as-own-investment-of-the-members-of-the-board-of-management-according-to-the-contract-of-employment-as-a-member-of-the-board-of-management/9985a4c2-1ca5-4054-921a-f6bede13b347_en'],
        ['Christopher George Townsend',338,124824.63,'https://www.eqs-news.com/news/directors-dealings/allianz-se-christopher-george-townsend-kauf-als-eigeninvestment-der-vorstaende-entsprechend-dem-vorstandsdienstvertrag/a1ca5923-a63a-4759-bda1-edf6d60e97a0_de'],
        ['Dr. Barbara Karuth-Zelle',338,124824.63,'https://www.eqs-news.com/de/news/directors-dealings/allianz-se-dr-barbara-karuth-zelle-kauf-als-eigeninvestment-der-vorstaende-entsprechend-dem-vorstandsdienstvertrag/af819789-4d14-41e0-bdee-7b0e8eea68df_de'],
        ['Sirma Boshnakova',338,124824.63,'https://www.eqs-news.com/news/directors-dealings/allianz-se-sirma-boshnakova-acquisition-as-own-investment-of-the-members-of-the-board-of-management-according-to-the-contract-of-employment-as-a-member-of-the-board-of-management/c88448ff-cecc-4020-aa32-a35ba424c76b_en'],
        ['Renate Wagner',338,124824.63,'https://www.eqs-news.com/de/news/directors-dealings/allianz-se-renate-wagner-kauf-als-eigeninvestment-der-vorstaende-entsprechend-dem-vorstandsdienstvertrag/60e2c8ce-1782-4813-9c34-c733c06600bd_de'],
        ['Claire-Marie Anne Coste-Lepoutre',1455,537336.81,'https://www.eqs-news.com/news/directors-dealings/allianz-se-claire-marie-anne-coste-lepoutre-kauf-als-eigeninvestment-der-vorstaende-entsprechend-dem-vorstandsdienstvertrag/461c0951-9bd3-41b5-93fc-a3971d022a7e_de'],
        ['Dr. Günther Thallinger',338,124824.63,'https://www.eqs-news.com/de/news/directors-dealings/allianz-se-dr-gunther-thallinger-kauf-als-eigeninvestment-der-vorstande-entsprechend-dem-vorstandsdienstvertrag/39ca44fd-0503-4cc9-ae5a-ea8479032889'],
        ['Oliver Bäte',1327,490065.94,'https://www.eqs-news.com/news/directors-dealings/allianz-se-oliver-baete-kauf-als-eigeninvestment-der-vorstaende-entsprechend-dem-vorstandsdienstvertrag/d329f168-9779-4171-9118-9f6433d8ef3e_de']
      ].map(([name,shares,volume,source]) => ({
        date:'2026-05-11', name, type:'Vertragliches Eigeninvestment', shares, price:369.30365, volume,
        context:'Vorstand · Initialmeldung nach Art. 19 MAR · Erwerb als vertraglich vorgesehenes Eigeninvestment gemäß Vorstandsdienstvertrag · außerhalb eines Handelsplatzes. Kein discretionary Open-Market-Kauf; daher nicht als gleichwertiges Kaufsignal interpretieren.',
        source
      }));
      tx.forEach(entry => { alv.insiders = upsert(alv.insiders, entry, (a,b) => a.date === b.date && a.name === b.name && a.type === b.type); });
      alv.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 01.05.2026. EQS weist neun Vorstandstransaktionen vom 11.05.2026 aus. Alle waren vertraglich vorgesehene Eigeninvestments außerhalb eines Handelsplatzes und werden ausdrücklich nicht als discretionary Open-Market-Käufe gewertet.';
      alv.lastChangedAt = STAMP;
      alv.changedSections = ['Insider'];
      alv.updateStatus = 'corrected';
      alv.updateTag = 'KORRIGIERT';
    }
  }

  function markBadges() {
    document.querySelectorAll('.update-badge').forEach(el => el.remove());
    document.querySelectorAll('.news-item h4').forEach(h4 => {
      if (![HNR_TITLE,LHA_TITLE].includes(h4.textContent.trim())) return;
      const badge = document.createElement('span');
      badge.className = 'update-badge';
      badge.textContent = 'KORRIGIERT';
      h4.prepend(badge);
    });
    if (selected === 'ALV') {
      const heads = document.querySelectorAll('#tab-research h3');
      const insiderHead = heads[1];
      if (insiderHead) {
        const badge = document.createElement('span');
        badge.className = 'update-badge';
        badge.textContent = 'KORRIGIERT';
        insiderHead.appendChild(badge);
      }
    }
  }

  function markRun() {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip && text) {
      text.textContent = `Inhalte: ${formatStamp(STAMP)}`;
      chip.classList.remove('status-ok','status-partial','status-error','status-closed');
      chip.classList.add('status-partial');
      chip.title = 'Teilaktualisierung: Der bestätigte 9er-Bestand ist gegen Daten-JSONs, Dashboard-IDs und Marktdatensymbole konsistent. Die separate Holdings-Datei aus dem Projektchat ist in dieser Laufzeit nicht direkt abrufbar; daher keine Bestandslöschung.';
    }
    document.querySelectorAll('.holding').forEach(card => {
      card.classList.remove('content-changed','content-partial');
      const h = holdings.find(x => x.id === card.dataset.id);
      if (['corrected','updated'].includes(h?.updateStatus)) {
        card.classList.add('content-changed');
        card.title = `Inhaltlich aktualisiert: ${formatStamp(h.lastChangedAt)} · ${h.changedSections.join(', ')}`;
      } else if (h?.lastCheckedAt && CHECKED_IDS.has(h.id)) {
        card.title = `Letzte Inhaltsprüfung: ${formatStamp(h.lastCheckedAt)} · Keine inhaltliche Änderung`;
      }
    });
    markBadges();
    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 01.09.2026 · 10:00 · Quellen in jedem Eintrag';
  }

  async function boot() {
    await new Promise(r => setTimeout(r, 2500));
    applyRun();
    const baseCards = renderCards;
    renderCards = function(){ baseCards(); markRun(); };
    const baseDetail = renderDetail;
    renderDetail = function(){ baseDetail(); markRun(); };
    renderCards(); renderDetail(); markRun();
  }

  boot().catch(() => {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip) { chip.classList.remove('status-ok','status-partial','status-closed'); chip.classList.add('status-error'); }
    if (text) text.textContent = 'Inhalte: letzter erfolgreicher Stand 31.08.2026 · 17:10 · Aktualisierung fehlgeschlagen';
  });
})();