(() => {
  const STAMP = '2026-08-27T17:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-04-27';
  const CHECKED_IDS = new Set(['CAT','JBL','LMT','MCD','AMZN']);
  const CHANGED_IDS = new Set([]);

  const formatStamp = value => new Intl.DateTimeFormat('de-DE', {
    timeZone:'Europe/Berlin', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'
  }).format(new Date(value)).replace(',', ' ·');

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
      cat.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 27.08.2026 17:00 CEST. Caterpillar IR sowie mehrere frei zugängliche Analystenquellen wurden erneut geprüft; keine neue belastbar verifizierte materielle Einzelanalyse gegenüber dem vorhandenen Stand übernommen.';
      cat.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 27.04.2026 geprüft. SEC Form 4 und ergänzende Insiderquellen wurden geprüft; keine neue relevante Open-Market-Transaktion verifiziert.';
    }

    const jbl = holdings.find(h => h.id === 'JBL');
    if (jbl) {
      jbl.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 27.08.2026 17:00 CEST. Jabil IR, MarketBeat und ergänzende Ratingquellen wurden geprüft; UBS Buy/430 USD vom 11.08. bleibt die jüngste belastbar verifizierte fundamentale Sell-Side-Revision im vorhandenen Stand.';
      jbl.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 27.04.2026 geprüft. SEC Form 4 und ergänzende Insiderquellen wurden geprüft; keine neue relevante Open-Market-Transaktion verifiziert.';
    }

    const lmt = holdings.find(h => h.id === 'LMT');
    if (lmt) {
      lmt.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 27.08.2026 17:00 CEST. Lockheed-Martin-IR sowie mehrere Analystenquellen wurden geprüft; keine neue belastbar verifizierte materielle Sell-Side-Einzelanalyse gegenüber dem vorhandenen Stand übernommen.';
      lmt.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 27.04.2026 geprüft. SEC Form 4 und ergänzende Insiderquellen wurden geprüft; institutionelle 13F-Meldungen werden nicht als Insidertransaktionen gewertet. Keine neue relevante Open-Market-Transaktion verifiziert.';
    }

    const mcd = holdings.find(h => h.id === 'MCD');
    if (mcd) {
      mcd.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 27.08.2026 17:00 CEST. McDonald’s IR sowie mehrere frei zugängliche Ratingquellen wurden geprüft. Robert W. Baird Hold/285 USD vom 24.08. bleibt die jüngste im Dashboard verifizierte Einzelrevision; keine neue materielle Revision seit dem vorherigen Lauf.';
      mcd.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 27.04.2026 geprüft. SEC Form 4 und ergänzende Insiderquellen wurden geprüft; keine neue relevante Open-Market-Transaktion verifiziert.';
    }

    const amzn = holdings.find(h => h.id === 'AMZN');
    if (amzn) {
      amzn.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 27.08.2026 17:00 CEST. Amazon IR sowie mehrere frei zugängliche Analystenquellen wurden geprüft; keine neue belastbar verifizierte materielle Sell-Side-Einzelanalyse gegenüber dem vorhandenen Stand übernommen.';
      amzn.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 27.04.2026 geprüft. SEC Form 4 und ergänzende Insiderquellen wurden geprüft; keine neue relevante Open-Market-Transaktion verifiziert.';
    }
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

    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 27.08.2026 · 17:00 · Quellen in jedem Eintrag';
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
    if (text) text.textContent = 'Inhalte: letzter erfolgreicher Stand 27.08.2026 · 10:00 · Aktualisierung fehlgeschlagen';
  });
})();