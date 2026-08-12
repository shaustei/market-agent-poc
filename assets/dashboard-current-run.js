(() => {
  const CONTENT_UPDATED_AT = '2026-08-12T17:00:00+02:00';
  const LAST_SUCCESSFUL_RUN_AT = '2026-08-12T17:00:00+02:00';
  const CHECKED_IDS = new Set(['CAT','JBL','LMT','MCD','AMZN']);
  const FOUR_MONTH_CUTOFF = '2026-04-12';

  const formatStamp = value => new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(value)).replace(',', ' ·');

  function applyCurrentRun() {
    window.marketAgentUpdateMeta = {
      contentUpdatedAt: CONTENT_UPDATED_AT,
      lastSuccessfulRunAt: LAST_SUCCESSFUL_RUN_AT,
      status: 'partial'
    };

    holdings.forEach(h => {
      if (!CHECKED_IDS.has(h.id)) return;
      h.analysts = (h.analysts || []).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date >= FOUR_MONTH_CUTOFF);
      h.insiders = (h.insiders || []).filter(x => !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || x.date >= FOUR_MONTH_CUTOFF);
      h.lastCheckedAt = CONTENT_UPDATED_AT;
      h.changedSections = [];
      h.updateStatus = 'checked';
      delete h.updateTag;
    });

    const cat = holdings.find(h => h.id === 'CAT');
    if (cat) {
      cat.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 12.08.2026 17:00 CEST. Caterpillar IR sowie MarketBeat, frei zugängliche Analystenübersichten und aktuelle Nachrichtenquellen wurden erneut geprüft; gegenüber dem vorhandenen Stand wurde bis zum Prüfzeitpunkt keine neue belastbare Einzelanalyse mit Rating und Kursziel verifiziert.';
      cat.insiderNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 12.08.2026 17:00 CEST. SEC-/Insiderquellen wurden erneut geprüft; keine neue verifizierte relevante Open-Market-Transaktion gegenüber dem vorhandenen Bestand festgestellt.';
    }
    const jbl = holdings.find(h => h.id === 'JBL');
    if (jbl) {
      jbl.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 12.08.2026 17:00 CEST. Neu berücksichtigt: UBS/David Vogt vom 12.08.2026, Upgrade von Neutral auf Buy bei unverändertem Kursziel 430 USD; Begründung ist ein mehrjähriger AI-Infrastrukturzyklus mit deutlich höherer AI-Umsatzerwartung. Jabil IR und weitere Analystenquellen wurden gegengeprüft.';
      jbl.insiderNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 12.08.2026 17:00 CEST. Gary K. Schicks Verkauf vom 15.07.2026 bleibt als Rule-10b5-1-Transaktion klassifiziert. SEC-/Insiderquellen wurden erneut geprüft; keine neuere verifizierte relevante Open-Market-Transaktion gefunden.';
    }
    const lmt = holdings.find(h => h.id === 'LMT');
    if (lmt) {
      lmt.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 12.08.2026 17:00 CEST. Lockheed-Martin-IR, SEC sowie frei zugängliche Analystenquellen wurden erneut geprüft; keine neue belastbare Einzelanalyse mit Rating und Kursziel gegenüber dem vorhandenen Stand verifiziert.';
      lmt.insiderNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 12.08.2026 17:00 CEST. Die SEC-Filings zeigen als jüngste relevante Form-4-Meldungen weiterhin Einträge vor dem aktuellen Lauf; keine neue verifizierte relevante Open-Market-Transaktion gefunden.';
    }
    const mcd = holdings.find(h => h.id === 'MCD');
    if (mcd) {
      mcd.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 12.08.2026 17:00 CEST. McDonald’s IR sowie frei zugängliche Analystenquellen wurden erneut geprüft; keine neue belastbare Einzelanalyse mit Rating und Kursziel gegenüber dem vorhandenen Stand verifiziert.';
      mcd.insiderNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 12.08.2026 17:00 CEST. SEC-/Insiderquellen wurden erneut geprüft; keine neue verifizierte relevante Open-Market-Transaktion festgestellt.';
    }
    const amzn = holdings.find(h => h.id === 'AMZN');
    if (amzn) {
      amzn.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 12.08.2026 17:00 CEST. Amazon IR sowie mehrere frei zugängliche Analystenquellen wurden erneut geprüft; die jüngsten verifizierbaren Einträge bleiben die Post-Q2-Updates vom 07.08.2026. Keine neuere belastbare Einzelanalyse mit Rating und Kursziel wurde bis zum Prüfzeitpunkt verifiziert.';
      amzn.insiderNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 12.08.2026 17:00 CEST. SEC-/Insiderquellen wurden erneut geprüft; keine neue verifizierte relevante discretionary Open-Market-Transaktion gegenüber dem vorhandenen Bestand festgestellt.';
    }
  }

  function markCurrentRun() {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip && text) {
      text.textContent = `Inhalte: ${formatStamp(CONTENT_UPDATED_AT)}`;
      chip.classList.remove('status-ok','status-partial','status-error','status-closed');
      chip.classList.add('status-partial');
      chip.title = 'Teilaktualisierung: Holdings.md bzw. eine neuere Holdings-Datei war im Repository nicht verfügbar; der bestätigte 9er-Sollbestand wurde gegen Dashboard-IDs, Daten-JSONs und Marktdatensymbole geprüft.';
    }
    document.querySelectorAll('.update-badge').forEach(el => el.remove());
    document.querySelectorAll('.holding').forEach(card => {
      card.classList.remove('content-changed','content-partial');
      const h = holdings.find(x => x.id === card.dataset.id);
      if (h?.lastCheckedAt && CHECKED_IDS.has(h.id)) card.title = `Letzte Inhaltsprüfung: ${formatStamp(h.lastCheckedAt)} · Keine inhaltliche Änderung`;
    });
    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 12.08.2026 · 17:00 · Quellen in jedem Eintrag';
  }

  async function boot() {
    await new Promise(r => setTimeout(r, 320));
    applyCurrentRun();
    const baseCards = renderCards;
    renderCards = function(){ baseCards(); markCurrentRun(); };
    const baseDetail = renderDetail;
    renderDetail = function(){ baseDetail(); markCurrentRun(); };
    renderCards();
    renderDetail();
    markCurrentRun();
  }

  boot().catch(() => {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip) { chip.classList.remove('status-ok','status-partial','status-closed'); chip.classList.add('status-error'); }
    if (text) text.textContent = 'Inhalte: letzter erfolgreicher Stand 12.08.2026 · 10:00 · Aktualisierung fehlgeschlagen';
  });
})();
