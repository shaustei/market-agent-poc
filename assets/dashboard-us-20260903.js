(() => {
  const STAMP = '2026-09-03T17:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-05-03';
  const CHECKED_IDS = new Set(['CAT','JBL','LMT','MCD','AMZN']);
  const CHANGED_IDS = new Set(['CAT','AMZN']);
  const CAT_TITLE = 'FieldAI-Kooperation erweitert Caterpillars Physical-AI- und Autonomie-Strategie';
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

    const cat = holdings.find(h => h.id === 'CAT');
    if (cat) {
      const fieldAI = {
        date:'2026-09-02', sourceName:'Caterpillar IR', category:'Technologie / Strategie',
        title:CAT_TITLE,
        summary:'Caterpillar arbeitet mit FieldAI an Physical AI, Autonomie, Robotik und digitalen Zwillingen für Baustellen und Produktionsanlagen. Eingesetzt werden unter anderem NVIDIA-beschleunigte Rechenplattformen und Omniverse-Technologien. Finanzielle Konditionen oder ein quantifizierter Umsatzbeitrag wurden nicht veröffentlicht.',
        impactText:'Leicht positiv; Stärke 1. Strategisch erweitert die Kooperation Caterpillars Technologie- und Autonomieplattform, kurzfristig fehlt jedoch ein quantifizierter Ergebnis- oder Umsatzbeitrag.',
        impact:1,
        source:'https://investors.caterpillar.com/news/news-details/2026/Caterpillar-and-FieldAI-Advance-AI-Powered-Industrial-Innovation/default.aspx'
      };
      cat.news = upsert(cat.news, fieldAI, (a,b) => a.date === b.date && a.title === b.title);
      if (!(cat.tailwinds || []).some(x => x.includes('FieldAI'))) {
        cat.tailwinds = ['Die FieldAI-Kooperation erweitert Caterpillars Physical-AI-, Autonomie- und Digital-Twin-Fähigkeiten für Maschinen, Baustellen und Fertigung; kurzfristig ist noch kein finanzieller Beitrag quantifiziert.'].concat(cat.tailwinds || []);
      }
      cat.thesis = 'Caterpillar profitiert von hoher Nachfrage in Power & Energy, Infrastruktur- und Rechenzentrumsinvestitionen sowie einem starken Auftragsbestand. Die neue FieldAI-Kooperation verbreitert zusätzlich die Physical-AI-, Autonomie- und Digital-Twin-Strategie, ist kurzfristig aber noch nicht finanziell quantifiziert. Bewertung, Zyklik und die jüngste CEO-Aktienmonetarisierung nach Optionsausübung bleiben zentrale Gegenpunkte.';
      cat.analystNote = 'Rollierendes Vier-Monats-Fenster ab 03.05.2026, geprüft bis 03.09.2026 17:00 CEST. Caterpillar IR, MarketBeat/S&P-Global-Konsens und ergänzende Analystenquellen wurden geprüft; keine neue belastbar verifizierte Einzelrevision seit dem vorherigen US-Lauf übernommen.';
      cat.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 03.05.2026. SEC Form 4 erneut geprüft. Die am 02.09. erfassten Joseph-E.-Creed-Transaktionen vom 28.08. bleiben unverändert: Optionsausübung (M), Steuereinbehalt (F) und anschließender Open-Market-Verkauf (S); kein neuer relevanter diskretionärer Insidertrade seitdem verifiziert.';
      cat.lastChangedAt = STAMP;
      cat.changedSections = ['News','Rückenwind/Risiken','Investment-Einordnung'];
      cat.updateStatus = 'updated';
      cat.updateTag = 'NEU';
    }

    const jbl = holdings.find(h => h.id === 'JBL');
    if (jbl) {
      jbl.analystNote = 'Rollierendes Vier-Monats-Fenster ab 03.05.2026, geprüft bis 03.09.2026 17:00 CEST. Jabil IR sowie aktuelle Analysten-/Konsensquellen wurden geprüft. Die UBS-Hochstufung auf Buy vom 11.08. und die Zacks-Abstufung auf Hold vom 19.08. bleiben im Bestand; keine neue belastbar verifizierte Einzelrevision seit dem vorherigen US-Lauf.';
      jbl.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 03.05.2026. SEC Form 4 und ergänzende Insiderquellen wurden geprüft; keine neue relevante diskretionäre Open-Market-Transaktion seit dem vorherigen US-Lauf verifiziert.';
    }

    const lmt = holdings.find(h => h.id === 'LMT');
    if (lmt) {
      lmt.analystNote = 'Rollierendes Vier-Monats-Fenster ab 03.05.2026, geprüft bis 03.09.2026 17:00 CEST. Lockheed-Martin-IR, MarketBeat und ergänzende Analystenquellen wurden geprüft. Der aktuelle Konsens bleibt Hold; keine neue belastbar verifizierte Einzelrevision seit dem vorherigen US-Lauf übernommen.';
      lmt.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 03.05.2026. SEC Form 4 und ergänzende Quellen wurden geprüft; keine neue relevante diskretionäre Open-Market-Transaktion seit dem vorherigen US-Lauf verifiziert.';
    }

    const mcd = holdings.find(h => h.id === 'MCD');
    if (mcd) {
      mcd.analystNote = 'Rollierendes Vier-Monats-Fenster ab 03.05.2026, geprüft bis 03.09.2026 17:00 CEST. McDonald’s Corporate/IR, MarketBeat/S&P-Global-Konsens und ergänzende Analystenquellen wurden geprüft; keine neue belastbar verifizierte Einzelrevision seit dem vorherigen US-Lauf übernommen.';
      mcd.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 03.05.2026. SEC Form 4 und ergänzende Insiderquellen wurden geprüft; keine neue relevante diskretionäre Open-Market-Transaktion seit dem vorherigen US-Lauf verifiziert.';
    }

    const amzn = holdings.find(h => h.id === 'AMZN');
    if (amzn) {
      const wells = {
        house:'Wells Fargo', date:'2026-09-03', rating:'Overweight', target:338,
        reason:'Analyst Ken Gawrelski erhöhte das Kursziel von 328 auf 338 USD und bestätigte Overweight. MarketScreener bestätigte die Zielanhebung am selben Morgen. Eine ausführliche frei zugängliche Begründung der heutigen Revision wurde nicht veröffentlicht; der positive Wells-Fargo-Case basiert weiterhin vor allem auf AWS-Wachstum und KI-Kapazitätsausbau.',
        quality:'Analyst: Ken Gawrelski · belastbare historische Güte für diese konkrete Amazon-Empfehlungsserie öffentlich nicht einheitlich verifizierbar: n. v.',
        source:'https://www.streetinsider.com/Analyst+PT+Change/Amazon.com+%28AMZN%29+PT+Raised+to+%24338+at+Wells+Fargo/27021643.html'
      };
      amzn.analysts = upsert(amzn.analysts, wells, (a,b) => a.house === b.house && a.date === b.date && a.rating === b.rating && a.target === b.target);
      amzn.analystNote = 'Rollierendes Vier-Monats-Fenster ab 03.05.2026. Neu aufgenommen: Wells Fargo / Ken Gawrelski, Overweight, Kursziel 338 USD vom 03.09.2026 (zuvor 328 USD), bestätigt durch StreetInsider und MarketScreener. Amazon IR, MarketScreener sowie ergänzende Analystenquellen wurden geprüft.';
      amzn.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 03.05.2026. SEC Form 4 und ergänzende Quellen wurden geprüft; seit dem vorherigen US-Lauf wurde keine neue relevante diskretionäre Open-Market-Transaktion verifiziert. Rule-10b5-1-, Vesting- und Vergütungsvorgänge werden separat eingeordnet.';
      amzn.lastChangedAt = STAMP;
      amzn.changedSections = ['Analysten'];
      amzn.updateStatus = 'updated';
      amzn.updateTag = 'NEU';
    }
  }

  function addBadge(el, label) {
    if (!el || el.querySelector('.update-badge')) return;
    const badge = document.createElement('span');
    badge.className = 'update-badge update-new';
    badge.textContent = label;
    el.prepend(badge);
  }

  function markRun() {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip && text) {
      text.textContent = `Inhalte: ${formatStamp(STAMP)}`;
      chip.classList.remove('status-ok','status-partial','status-error','status-closed');
      chip.classList.add('status-partial');
      chip.title = 'Teilaktualisierung: In den verfügbaren Gesprächsdateien und im Repository war keine aktuelle Holdings.md auffindbar. Der bestätigte 9er-Bestand wurde gegen 9 Daten-JSONs, 9 Dashboard-IDs und 9 Marktdatensymbole abgeglichen; keine Position wurde entfernt.';
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

    if (selected === 'CAT') {
      document.querySelectorAll('#tab-events .news-item').forEach(item => {
        const t = item.textContent || '';
        if (t.includes(CAT_TITLE) && t.includes('02.09.2026')) addBadge(item.querySelector('h4'), 'NEU');
      });
    }
    if (selected === 'AMZN') {
      document.querySelectorAll('#tab-research tbody tr').forEach(row => {
        const t = row.textContent || '';
        if (t.includes('Wells Fargo') && t.includes('03.09.2026') && t.includes('338')) addBadge(row.querySelector('td:first-child'), 'NEU');
      });
    }

    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 03.09.2026 · 17:00 · Quellen in jedem Eintrag';
  }

  async function boot() {
    await new Promise(r => setTimeout(r, 11600));
    applyRun();
    renderCards();
    renderDetail();
    markRun();
    document.addEventListener('click', event => {
      if (event.target.closest('.holding,.tab,.filter')) setTimeout(markRun, 0);
    });
    document.addEventListener('keydown', event => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target.closest('.holding')) setTimeout(markRun, 0);
    });
    window.addEventListener('pageshow', () => setTimeout(markRun, 0));
  }

  boot().catch(() => {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip) { chip.classList.remove('status-ok','status-partial','status-closed'); chip.classList.add('status-error'); }
    if (text) text.textContent = 'Inhalte: letzter erfolgreicher Stand 03.09.2026 · 10:00 · Aktualisierung fehlgeschlagen';
  });
})();