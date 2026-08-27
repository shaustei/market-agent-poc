(() => {
  const STAMP = '2026-08-27T10:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-04-27';
  const CHECKED_IDS = new Set(['HNR1','EUNL','LHA','ALV']);
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

    const hnr = holdings.find(h => h.id === 'HNR1');
    if (hnr) {
      hnr.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 27.08.2026 10:00 CEST. Hannover-Re-IR sowie frei zugängliche Analystenquellen wurden erneut geprüft. Keine neue belastbar verifizierte Einzelanalyse gegenüber dem vorhandenen Stand übernommen.';
      hnr.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 27.04.2026 geprüft. Keine neuere relevante Open-Market-Directors’-Dealings-Transaktion gegenüber dem vorhandenen Bestand verifiziert.';
    }

    const lha = holdings.find(h => h.id === 'LHA');
    if (lha) {
      lha.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 27.08.2026 10:00 CEST. Lufthansa IR und frei zugängliche Analystenquellen wurden erneut geprüft; keine neuere belastbar verifizierte Einzelanalyse gegenüber dem vorhandenen Stand übernommen.';
      lha.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 27.04.2026 geprüft. Lufthansa Directors’ Dealings wurde erneut geprüft; keine neuere relevante Open-Market-Transaktion gegenüber dem vorhandenen Bestand verifiziert.';
    }

    const alv = holdings.find(h => h.id === 'ALV');
    if (alv) {
      alv.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 27.08.2026 10:00 CEST. Allianz IR sowie frei zugängliche Analystenquellen wurden erneut geprüft; keine neuere belastbar verifizierte Einzelanalyse gegenüber dem vorhandenen Stand übernommen.';
      alv.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 27.04.2026 geprüft. Öffentlich auffindbare Directors’-Dealings-Quellen wurden erneut geprüft; keine neuere relevante Open-Market-Transaktion gegenüber dem vorhandenen Bestand verifiziert.';
    }

    const etf = holdings.find(h => h.id === 'EUNL');
    if (etf) {
      etf.analystNote = 'Nicht anwendbar: Ein ETF hat keine unternehmensspezifischen Sell-Side-Kursziele. Produktmerkmale wurden zum 27.08.2026 gegen die iShares-Produktseite geprüft.';
      etf.insiderNote = 'Nicht anwendbar: Ein ETF hat keine Unternehmensinsider.';
    }
  }

  function markRun() {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip && text) {
      text.textContent = `Inhalte: ${formatStamp(STAMP)}`;
      chip.classList.remove('status-ok','status-partial','status-error','status-closed');
      chip.classList.add('status-partial');
      chip.title = 'Teilaktualisierung: Die neueste Holdings-Datei aus dem Projektchat Investment & Trading war in dieser Ausführung technisch nicht direkt lesbar. Der im Auftrag bestätigte 9er-Bestand wurde gegen Daten-JSONs, Dashboard-IDs und Marktdatensymbole geprüft; keine Position wurde entfernt.';
    }

    document.querySelectorAll('.update-badge').forEach(el => el.remove());
    document.querySelectorAll('.holding').forEach(card => {
      card.classList.remove('content-changed','content-partial');
      const h = holdings.find(x => x.id === card.dataset.id);
      if (h?.lastCheckedAt && CHECKED_IDS.has(h.id)) {
        card.title = `Letzte Inhaltsprüfung: ${formatStamp(h.lastCheckedAt)} · Keine inhaltliche Änderung`;
      }
    });

    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 27.08.2026 · 10:00 · Quellen in jedem Eintrag';
  }

  async function boot() {
    await new Promise(r => setTimeout(r, 1800));
    applyRun();
    const baseCards = renderCards;
    renderCards = function(){ baseCards(); markRun(); };
    const baseDetail = renderDetail;
    renderDetail = function(){ baseDetail(); markRun(); };
    renderCards();
    renderDetail();
    markRun();
  }

  boot().catch(() => {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip) { chip.classList.remove('status-ok','status-partial','status-closed'); chip.classList.add('status-error'); }
    if (text) text.textContent = 'Inhalte: letzter erfolgreicher Stand 26.08.2026 · 17:00 · Aktualisierung fehlgeschlagen';
  });
})();
