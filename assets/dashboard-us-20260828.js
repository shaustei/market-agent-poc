(() => {
  const STAMP = '2026-08-28T17:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-04-28';
  const CHECKED_IDS = new Set(['CAT','JBL','LMT','MCD','AMZN']);
  const CHANGED_IDS = new Set(['MCD']);

  const formatStamp = value => new Intl.DateTimeFormat('de-DE', {
    timeZone:'Europe/Berlin', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'
  }).format(new Date(value)).replace(',', ' ·');
  const upsert = (list, item, key) => [item].concat((list || []).filter(x => key(x) !== key(item)));
  const analystKey = a => `${a.house}|${a.date}|${a.rating}|${a.target ?? ''}`;

  function applyRun() {
    window.marketAgentUpdateMeta = {
      contentUpdatedAt: STAMP,
      lastSuccessfulRunAt: STAMP,
      status: 'partial'
    };

    holdings.forEach(h => {
      if (!CHECKED_IDS.has(h.id)) return;
      h.analysts = (h.analysts || []).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date >= FOUR_MONTH_CUTOFF);
      h.insiders = (h.insiders || []).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date >= FOUR_MONTH_CUTOFF);
      h.lastCheckedAt = STAMP;
      h.changedSections = [];
      h.updateStatus = 'checked';
      delete h.updateTag;
    });

    const cat = holdings.find(h => h.id === 'CAT');
    if (cat) {
      cat.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 28.08.2026 17:00 CEST. Caterpillar IR sowie mehrere frei zugängliche Analystenquellen wurden erneut geprüft; keine neue belastbar verifizierte materielle Einzelanalyse gegenüber dem vorhandenen Stand übernommen.';
      cat.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 28.04.2026 geprüft. SEC Form 4 und ergänzende Insiderquellen wurden geprüft; keine neue relevante Open-Market-Transaktion verifiziert.';
    }

    const jbl = holdings.find(h => h.id === 'JBL');
    if (jbl) {
      jbl.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 28.08.2026 17:00 CEST. Jabil IR, MarketBeat und ergänzende Ratingquellen wurden erneut geprüft; UBS Buy/430 USD vom 11.08. bleibt die jüngste belastbar verifizierte fundamentale Sell-Side-Revision im vorhandenen Stand.';
      jbl.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 28.04.2026 geprüft. SEC Form 4 und ergänzende Insiderquellen wurden geprüft; keine neue relevante Open-Market-Transaktion verifiziert.';
    }

    const lmt = holdings.find(h => h.id === 'LMT');
    if (lmt) {
      lmt.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 28.08.2026 17:00 CEST. Lockheed-Martin-IR sowie mehrere Analystenquellen wurden erneut geprüft; keine neue belastbar verifizierte materielle Sell-Side-Einzelanalyse gegenüber dem vorhandenen Stand übernommen.';
      lmt.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 28.04.2026 geprüft. SEC Form 4 und ergänzende Insiderquellen wurden geprüft; institutionelle 13F-Meldungen werden nicht als Insidertransaktionen gewertet. Keine neue relevante Open-Market-Transaktion verifiziert.';
    }

    const mcd = holdings.find(h => h.id === 'MCD');
    if (mcd) {
      const argus = {
        house:'Argus', date:'2026-08-26', rating:'Buy', target:310,
        reason:'Argus senkte das Kursziel von 320 auf 310 USD und bestätigte Buy. Das niedrigere Ziel reflektiert vorsichtigere Erwartungen, während die grundsätzliche positive Empfehlung bestehen bleibt.',
        quality:'Haus 3/5 · Analyst John Staszak 2/5 laut MarketBeat',
        source:'https://www.marketbeat.com/instant-alerts/analyst-argus-has-lowered-expectations-for-mcdonalds-nyse-mcd-stock-price-2026-08-26/'
      };
      const redburn = {
        house:'Rothschild & Co Redburn', date:'2026-08-26', rating:'Neutral', target:285,
        reason:'Rothschild & Co Redburn stufte die Einschätzung auf Neutral ab und senkte das Kursziel von 306 auf 285 USD. Die Revision verschärft die kurzfristig vorsichtige Analystensicht nach schwächerer US-Traffic- und Value-Dynamik.',
        quality:'Historische Güte: n. v.',
        source:'https://www.marketscreener.com/quote/stock/MCDONALD-S-CORPORATION-4833/'
      };
      mcd.analysts = upsert(mcd.analysts, redburn, analystKey);
      mcd.analysts = upsert(mcd.analysts, argus, analystKey);
      mcd.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 28.08.2026 17:00 CEST. Neu verifiziert: Argus Buy/310 USD und Rothschild & Co Redburn Neutral/285 USD, beide vom 26.08. Der Analystenkonsens bleibt laut MarketBeat Moderate Buy, die jüngsten Zielrevisionen sind jedoch vorsichtiger.';
      mcd.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 28.04.2026 geprüft. SEC Form 4 und ergänzende Insiderquellen wurden geprüft; keine neue relevante Open-Market-Transaktion verifiziert.';
      mcd.changedSections = ['Analysten'];
      mcd.updateStatus = 'updated';
      mcd.updateTag = 'NEU';
      mcd.lastChangedAt = STAMP;
    }

    const amzn = holdings.find(h => h.id === 'AMZN');
    if (amzn) {
      amzn.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 28.08.2026 17:00 CEST. Amazon IR sowie mehrere frei zugängliche Analystenquellen wurden erneut geprüft; keine neue belastbar verifizierte materielle Sell-Side-Einzelanalyse gegenüber dem vorhandenen Stand übernommen.';
      amzn.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 28.04.2026 geprüft. SEC Form 4 und ergänzende Insiderquellen wurden geprüft; keine neue relevante Open-Market-Transaktion verifiziert.';
    }
  }

  function badgeInto(el, label) {
    if (el && !el.querySelector('.update-badge')) el.insertAdjacentHTML('beforeend', ` <span class="update-badge update-new">${label}</span>`);
  }

  function markRun() {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip && text) {
      text.textContent = `Inhalte: ${formatStamp(STAMP)}`;
      chip.classList.remove('status-ok','status-partial','status-error','status-closed');
      chip.classList.add('status-partial');
      chip.title = 'Teilaktualisierung: Der im aktuellen Auftrag bestätigte 9er-Bestand ist vollständig gegen Daten-JSONs, Dashboard-IDs und Marktdatensymbole abgeglichen. Die separate Holdings-Quelle im Projektchat ist in dieser Ausführung technisch nicht direkt lesbar.';
    }

    document.querySelectorAll('.update-badge').forEach(el => el.remove());
    document.querySelectorAll('.holding').forEach(card => {
      card.classList.remove('content-changed','content-partial');
      const h = holdings.find(x => x.id === card.dataset.id);
      if (CHANGED_IDS.has(card.dataset.id)) {
        card.classList.add('content-changed');
        card.title = `Heute inhaltlich aktualisiert · ${(h?.changedSections || []).join(', ')}`;
      } else if (h?.lastCheckedAt && CHECKED_IDS.has(h.id)) {
        card.title = `Letzte Inhaltsprüfung: ${formatStamp(h.lastCheckedAt)} · Keine inhaltliche Änderung`;
      }
    });

    if (selected === 'MCD') {
      document.querySelectorAll('#tab-research tbody tr').forEach(row => {
        const t = row.textContent || '';
        if ((t.includes('Argus') || t.includes('Rothschild & Co Redburn')) && t.includes('26.08.2026')) badgeInto(row.querySelector('td:first-child'), 'NEU');
      });
    }

    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 28.08.2026 · 17:00 · Quellen in jedem Eintrag';
  }

  async function boot() {
    await new Promise(r => setTimeout(r, 3400));
    applyRun();
    const baseCards = renderCards;
    renderCards = function(){ baseCards(); markRun(); };
    const baseDetail = renderDetail;
    renderDetail = function(){ baseDetail(); markRun(); };
    renderCards();
    renderDetail();
    markRun();

    setTimeout(() => {
      const latestCards = renderCards;
      renderCards = function(){ latestCards(); markRun(); };
      const latestDetail = renderDetail;
      renderDetail = function(){ latestDetail(); markRun(); };
      markRun();
    }, 1200);
  }

  boot().catch(() => {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip) { chip.classList.remove('status-ok','status-partial','status-closed'); chip.classList.add('status-error'); }
    if (text) text.textContent = 'Inhalte: letzter erfolgreicher Stand 28.08.2026 · 10:00 · Aktualisierung fehlgeschlagen';
  });
})();