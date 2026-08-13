(() => {
  const CONTENT_UPDATED_AT = '2026-08-13T10:00:00+02:00';
  const LAST_SUCCESSFUL_RUN_AT = '2026-08-13T10:00:00+02:00';
  const CHECKED_IDS = new Set(['HNR1','EUNL','LHA','ALV']);
  const FOUR_MONTH_CUTOFF = '2026-04-13';

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

    const hnr = holdings.find(h => h.id === 'HNR1');
    if (hnr) {
      hnr.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 13.08.2026 10:00 CEST. Hannover-Re-IR, FinanzNachrichten/dpa-AFX, MarketScreener und frei zugängliche Analyseübersichten wurden nach den Halbjahreszahlen erneut geprüft; bis zum Prüfzeitpunkt wurde keine neue belastbare Einzelanalyse mit Rating und Kursziel gegenüber dem vorhandenen Bestand verifiziert.';
      hnr.insiderNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 13.08.2026 10:00 CEST. Verifiziert bleibt der Open-Market-Kauf von Vorstand Clemens Jungsthöfel am 12.05.2026 über 1.000 Aktien zu 234,00 EUR auf Xetra. EQS/Directors’ Dealings und weitere Pflichtmeldungsquellen wurden erneut geprüft; keine neuere relevante Transaktion verifiziert.';
    }
    const lha = holdings.find(h => h.id === 'LHA');
    if (lha) {
      lha.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 13.08.2026 10:00 CEST. Lufthansa IR, FinanzNachrichten/dpa-AFX, MarketScreener, Yahoo Finance und Onvista wurden erneut geprüft; keine neue belastbare Einzelanalyse mit Rating und Kursziel gegenüber dem vorhandenen Bestand verifiziert.';
      lha.insiderNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 13.08.2026 10:00 CEST. Lufthansa IR/Directors’ Dealings und weitere Pflichtmeldungsquellen wurden erneut geprüft; keine neue verifizierte meldepflichtige Open-Market-Transaktion festgestellt.';
    }
    const alv = holdings.find(h => h.id === 'ALV');
    if (alv) {
      alv.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 13.08.2026 10:00 CEST. Allianz IR, FinanzNachrichten/dpa-AFX, MarketScreener und frei zugängliche Analyseübersichten wurden nach Q2 erneut geprüft; bis zum Prüfzeitpunkt wurde keine neue belastbare Einzelanalyse mit Rating und Kursziel gegenüber dem vorhandenen Bestand verifiziert.';
      alv.insiderNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 13.08.2026 10:00 CEST. Allianz Directors’ Dealings, EQS und weitere Pflichtmeldungsquellen wurden erneut geprüft. Die neun Vorstands-Eigeninvestments vom 11.05.2026 bleiben als vertragliche Eigeninvestments außerhalb eines Handelsplatzes klassifiziert; keine neuere relevante Transaktion verifiziert.';
    }
    const etf = holdings.find(h => h.id === 'EUNL');
    if (etf) {
      etf.analystNote = 'Nicht anwendbar: Ein ETF hat keine unternehmensspezifischen Sell-Side-Kursziele. Relevanter sind Indexbewertung, Gewinnrevisionen, Tracking Difference, Kosten und Allokation.';
      etf.insiderNote = 'Nicht anwendbar: Ein ETF hat keine Unternehmensinsider.';
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
    if (footer) footer.textContent = 'Market Agent · Datenstand 13.08.2026 · 10:00 · Quellen in jedem Eintrag';
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

    setTimeout(() => {
      const latestCards = renderCards;
      renderCards = function(){ latestCards(); markCurrentRun(); };
      const latestDetail = renderDetail;
      renderDetail = function(){ latestDetail(); markCurrentRun(); };
      markCurrentRun();
    }, 700);
  }

  boot().catch(() => {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip) { chip.classList.remove('status-ok','status-partial','status-closed'); chip.classList.add('status-error'); }
    if (text) text.textContent = 'Inhalte: letzter erfolgreicher Stand 12.08.2026 · 17:00 · Aktualisierung fehlgeschlagen';
  });
})();
