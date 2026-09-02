(() => {
  const STAMP = '2026-09-02T17:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-05-02';
  const CHECKED_IDS = new Set(['CAT','JBL','LMT','MCD','AMZN']);
  const CHANGED_IDS = new Set(['CAT','JBL']);
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
      const optionExercise = {
        date:'2026-08-28', name:'Joseph E. Creed (CEO)', type:'Optionsausübung', shares:44403, price:219.76, volume:9758003.28,
        context:'SEC Form 4 · Transaktionscode M. Ausübung von 44.403 Mitarbeiteroptionen aus dem 2021 gewährten Long-Term-Incentive-Plan. Kein Open-Market-Kauf; die Optionen waren vollständig ausübbar. Die Meldung kennzeichnet die Transaktion nicht als Rule-10b5-1-Plan.',
        source:'https://www.sec.gov/Archives/edgar/data/18230/000110465926104202/xslF345X06/tm2624382-1_4seq1.xml'
      };
      const taxWithholding = {
        date:'2026-08-28', name:'Joseph E. Creed (CEO)', type:'Steuereinbehalt', shares:12002, price:812.98, volume:9757385.96,
        context:'SEC Form 4 · Transaktionscode F. 12.002 Aktien wurden zur Begleichung von Steuerverpflichtungen im Zusammenhang mit der Optionsausübung einbehalten. Kein diskretionärer Open-Market-Verkauf und daher nicht als separates bearish Insider-Signal gewertet.',
        source:'https://www.sec.gov/Archives/edgar/data/18230/000110465926104202/xslF345X06/tm2624382-1_4seq1.xml'
      };
      const openMarketSale = {
        date:'2026-08-28', name:'Joseph E. Creed (CEO)', type:'Open-Market-Verkauf', shares:32401, price:808.98, volume:26211760.98,
        context:'SEC Form 4 · Transaktionscode S. Nach Optionsausübung und Steuereinbehalt verkaufte Creed 32.401 Aktien in mehreren Markttransaktionen zu gewichteten Durchschnittspreisen zwischen rund 800,19 und 813,72 USD; Gesamtwert rund 26,21 Mio. USD. Nach dem Verkauf hielt er 34.555 Aktien direkt. In der Form-4-Kopfzeile ist kein Rule-10b5-1-Kästchen markiert. Einordnung: materieller diskretionärer Verkauf, aber im Zusammenhang mit einer Optionsausübung; deshalb moderat negativ, nicht isoliert als Verkaufssignal.',
        source:'https://www.sec.gov/Archives/edgar/data/18230/000110465926104202/xslF345X06/tm2624382-1_4seq1.xml'
      };
      [optionExercise,taxWithholding,openMarketSale].forEach(entry => {
        cat.insiders = upsert(cat.insiders, entry, (a,b) => a.date === b.date && a.name === b.name && a.type === b.type);
      });
      cat.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 02.05.2026. Neu verifiziert: Joseph E. Creed, 28.08.2026. SEC Form 4 trennt Optionsausübung (M), Steuereinbehalt (F) und anschließenden Open-Market-Verkauf (S) von 32.401 Aktien. Kein Rule-10b5-1-Hinweis in der Form-4-Kopfzeile. Der Marktverkauf ist materiell, wird wegen des unmittelbaren Optionskontexts jedoch nur moderat negativ eingeordnet.';
      cat.lastChangedAt = STAMP;
      cat.changedSections = ['Insider'];
      cat.updateStatus = 'updated';
      cat.updateTag = 'NEU';
    }

    const jbl = holdings.find(h => h.id === 'JBL');
    if (jbl) {
      const ubs = {
        house:'UBS', date:'2026-08-11', rating:'Buy', target:430,
        reason:'Analyst David Vogt stufte Jabil von Neutral auf Buy hoch und bestätigte das Kursziel von 430 USD. Begründung: mehrjähriger KI-Infrastrukturzyklus, höhere Nachfrage von Hyperscalern, Healthcare-Kapazitätsausbau sowie Automation/Robotics; UBS hob FY2027/FY2028-EPS-Schätzungen auf 16,78 bzw. 20,24 USD an.',
        quality:'Analyst: David Vogt · belastbare historische Güte öffentlich nicht einheitlich verifizierbar: n. v.',
        source:'https://www.investing.com/news/analyst-ratings/jabil-stock-upgraded-to-buy-by-ubs-on-ai-growth-outlook-93CH-4850857'
      };
      const zacks = {
        house:'Zacks Research', date:'2026-08-19', rating:'Hold', target:null,
        reason:'Downgrade von Strong Buy auf Hold. Der breitere Sell-Side-Konsens bleibt positiv; die Revision spiegelt ein ausgewogeneres kurzfristiges Chance-Risiko-Verhältnis nach dem starken Lauf wider.',
        quality:'Historische Güte: n. v.',
        source:'https://www.marketbeat.com/instant-alerts/zacks-research-downgrades-jabil-nysejbl-to-hold-2026-08-19/'
      };
      jbl.analysts = upsert(jbl.analysts, ubs, (a,b) => a.house === b.house && a.date === b.date && a.rating === b.rating);
      jbl.analysts = upsert(jbl.analysts, zacks, (a,b) => a.house === b.house && a.date === b.date && a.rating === b.rating);
      jbl.analystNote = 'Rollierendes Vier-Monats-Fenster ab 02.05.2026. Ergänzt wurden die UBS-Hochstufung auf Buy vom 11.08.2026 (David Vogt, Ziel 430 USD) und die Zacks-Abstufung auf Hold vom 19.08.2026. MarketBeat weist den aktuellen Konsens weiterhin als Buy aus; weitere neue Einzelrevisionen bis 02.09.2026 17:00 CEST wurden nicht belastbar verifiziert.';
      jbl.lastChangedAt = STAMP;
      jbl.changedSections = ['Analysten'];
      jbl.updateStatus = 'updated';
      jbl.updateTag = 'NEU';
    }

    const lmt = holdings.find(h => h.id === 'LMT');
    if (lmt) {
      lmt.analystNote = 'Rollierendes Vier-Monats-Fenster ab 02.05.2026, geprüft bis 02.09.2026 17:00 CEST. Lockheed-Martin-IR, MarketBeat/MarketScreener und weitere frei zugängliche Analystenquellen wurden geprüft. MarketBeat führt den Konsens aktuell als Hold; keine neue belastbar verifizierte Einzelrevision seit dem vorherigen US-Lauf übernommen.';
      lmt.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 02.05.2026. SEC Form 4 und ergänzende Quellen wurden geprüft; keine neue relevante diskretionäre Open-Market-Transaktion seit dem vorherigen US-Lauf verifiziert. Vergütungs-/Vesting-Vorgänge werden nicht als gleichwertige Kauf- oder Verkaufssignale gewertet.';
    }

    const mcd = holdings.find(h => h.id === 'MCD');
    if (mcd) {
      mcd.analystNote = 'Rollierendes Vier-Monats-Fenster ab 02.05.2026, geprüft bis 02.09.2026 17:00 CEST. McDonald’s IR, MarketBeat/MarketScreener und ergänzende Analystenquellen wurden geprüft; die zuletzt verifizierten Revisionen bleiben im Bestand, keine neue belastbar verifizierte Einzelrevision seit dem vorherigen US-Lauf übernommen.';
      mcd.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 02.05.2026. SEC Form 4 und ergänzende Insiderquellen wurden geprüft; keine neue relevante diskretionäre Open-Market-Transaktion seit dem vorherigen US-Lauf verifiziert.';
    }

    const amzn = holdings.find(h => h.id === 'AMZN');
    if (amzn) {
      amzn.analystNote = 'Rollierendes Vier-Monats-Fenster ab 02.05.2026, geprüft bis 02.09.2026 17:00 CEST. Amazon IR, MarketBeat/MarketScreener, Yahoo Finance und ergänzende Quellen wurden geprüft; keine neue belastbar verifizierte Einzelrevision seit dem vorherigen US-Lauf übernommen. Der jüngste bereits erfasste Evercore-ISI-Hinweis bleibt gültig.';
      amzn.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 02.05.2026. SEC Form 4 und ergänzende Quellen wurden geprüft; aktuelle Vergütungs-/Vesting- und planbezogene Transaktionen werden separat von diskretionären Open-Market-Trades eingeordnet. Seit dem vorherigen US-Lauf wurde keine neue relevante diskretionäre Open-Market-Transaktion verifiziert.';
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
      document.querySelectorAll('#tab-research tbody tr').forEach(row => {
        const t = row.textContent || '';
        if (t.includes('Joseph E. Creed') && t.includes('28.08.2026')) addBadge(row.querySelector('td:first-child'), 'NEU');
      });
    }
    if (selected === 'JBL') {
      document.querySelectorAll('#tab-research tbody tr').forEach(row => {
        const t = row.textContent || '';
        if ((t.includes('UBS') && t.includes('11.08.2026')) || (t.includes('Zacks Research') && t.includes('19.08.2026'))) addBadge(row.querySelector('td:first-child'), 'NEU');
      });
    }

    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 02.09.2026 · 17:00 · Quellen in jedem Eintrag';
  }

  async function boot() {
    await new Promise(r => setTimeout(r, 11200));
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
    if (text) text.textContent = 'Inhalte: letzter erfolgreicher Stand 02.09.2026 · 10:00 · Aktualisierung fehlgeschlagen';
  });
})();