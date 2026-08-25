(() => {
  const STAMP = '2026-08-25T10:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-04-25';
  const CHECKED_IDS = new Set(['HNR1','EUNL','LHA','ALV']);
  const CHANGED_IDS = new Set(['HNR1','LHA']);

  const upsert = (list, item, key) => [item].concat((list || []).filter(x => key(x) !== key(item)));
  const analystKey = a => `${a.house}|${a.date}|${a.rating}|${a.target ?? ''}`;
  const newsKey = n => `${n.date}|${n.title}`;
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
      const alphaValue = {
        house:'AlphaValue',
        date:'2026-08-24',
        rating:'n. v.',
        target:null,
        reason:'Neue öffentlich gelistete Research-Note „1H26 Reinsurance review: Good numbers, outlook still challenging“. Rating, Kursziel und Analyst sind im frei zugänglichen Teil nicht veröffentlicht und werden daher nicht ergänzt.',
        quality:'Analyst: n. v. · historische Güte: n. v.',
        source:'https://www.marketscreener.com/news/1h26-reinsurance-review-good-numbers-outlook-still-challenging-ce7858dbdc89f725'
      };
      hnr.analysts = upsert(hnr.analysts, alphaValue, analystKey);
      hnr.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 25.08.2026 10:00 CEST. Hannover-Re-IR, FinanzNachrichten/dpa-AFX, MarketScreener und frei zugängliche Analyseübersichten wurden geprüft. Neu aufgenommen wurde die AlphaValue-Research-Note vom 24.08.; Rating, Kursziel und Analyst sind öffentlich nicht verifizierbar und daher n. v.';
      hnr.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 25.04.2026 geprüft. Der verifizierte Open-Market-Kauf von Vorstand Clemens Jungsthöfel am 12.05.2026 bleibt gültig; keine neuere relevante Directors’-Dealings-Transaktion verifiziert.';
      hnr.changedSections = ['Analysten'];
      hnr.updateStatus = 'updated';
      hnr.updateTag = 'NEU';
      hnr.lastChangedAt = STAMP;
    }

    const lha = holdings.find(h => h.id === 'LHA');
    if (lha) {
      const shareholderNews = {
        date:'2026-08-24',
        sourceName:'Kuehne+Nagel / Lufthansa IR',
        category:'Aktionärsstruktur',
        title:'Klaus-Michael Kühne gestorben; Kühne Aviation hält 20 % der Lufthansa-Stimmrechte',
        summary:'Kuehne+Nagel meldete am 24.08. den Tod von Klaus-Michael Kühne im Alter von 89 Jahren. Die Lufthansa-IR weist Kühne Aviation GmbH zum 01.07.2026 weiterhin mit 20,00 % der Stimmrechte aus. Eine Veränderung oder Veräußerung dieser Beteiligung ist damit nicht belegt; relevant ist künftig die Nachfolge- und Eigentümerstruktur des Ankeraktionärs.',
        impactText:'Aktuell neutral; Stärke 1. Es liegt keine bestätigte Stimmrechtsänderung oder Transaktion vor. Wegen der 20-%-Beteiligung ist die künftige Eigentümer- und Nachfolgestruktur dennoch beobachtungsrelevant.',
        impact:0,
        source:'https://newsroom.kuehne-nagel.com/klaus-michael-kuehne-passed-away/'
      };
      lha.news = upsert(lha.news, shareholderNews, newsKey);
      lha.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 25.08.2026 10:00 CEST. Lufthansa IR, FinanzNachrichten/dpa-AFX, MarketScreener, Yahoo Finance und Onvista wurden geprüft; keine neuere verifizierbare Einzelanalyse nach Barclays vom 19.08. übernommen.';
      lha.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 25.04.2026 geprüft. Der Open-Market-Kauf von Vorstand Dieter Vranckx vom 07.08.2026 bleibt gültig; keine neuere relevante Directors’-Dealings-Transaktion verifiziert.';
      lha.changedSections = ['News'];
      lha.updateStatus = 'updated';
      lha.updateTag = 'NEU';
      lha.lastChangedAt = STAMP;
    }

    const alv = holdings.find(h => h.id === 'ALV');
    if (alv) {
      alv.analystNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 25.08.2026 10:00 CEST. Allianz IR, FinanzNachrichten/dpa-AFX, MarketScreener und frei zugängliche Analyseübersichten wurden geprüft; keine neuere belastbar verifizierte Einzelanalyse gegenüber dem vorhandenen Stand übernommen.';
      alv.insiderNote = 'Rollierendes Vier-Monats-Fenster ab 25.04.2026 geprüft. Allianz Directors’ Dealings/EQS wurden geprüft; keine neuere relevante Open-Market-Transaktion gegenüber dem vorhandenen Bestand verifiziert.';
    }

    const etf = holdings.find(h => h.id === 'EUNL');
    if (etf) {
      etf.analystNote = 'Nicht anwendbar: Ein ETF hat keine unternehmensspezifischen Sell-Side-Kursziele. Stammdaten und Produktmerkmale wurden zum 25.08.2026 gegen die iShares-Produktseite geprüft.';
      etf.insiderNote = 'Nicht anwendbar: Ein ETF hat keine Unternehmensinsider.';
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
      chip.title = 'Teilaktualisierung: Holdings.md bzw. eine neuere Holdings-Datei war nicht verfügbar. Der bestätigte 9er-Sollbestand wurde gegen Daten-JSONs, Dashboard-IDs und Marktdatensymbole geprüft; keine Position wurde entfernt.';
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

    if (selected === 'HNR1') {
      document.querySelectorAll('#tab-research tbody tr').forEach(row => {
        if ((row.textContent || '').includes('24.08.2026') && (row.textContent || '').includes('AlphaValue')) {
          badgeInto(row.querySelector('td:first-child'), 'NEU');
        }
      });
    }
    if (selected === 'LHA') {
      document.querySelectorAll('#tab-events .news-item').forEach(item => {
        if ((item.textContent || '').includes('Klaus-Michael Kühne')) badgeInto(item.querySelector('.news-meta'), 'NEU');
      });
    }

    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 25.08.2026 · 10:00 · Quellen in jedem Eintrag';
  }

  async function boot() {
    await new Promise(r => setTimeout(r, 1600));
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
    }, 1000);
  }

  boot().catch(() => {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip) { chip.classList.remove('status-ok','status-partial','status-closed'); chip.classList.add('status-error'); }
    if (text) text.textContent = 'Inhalte: letzter erfolgreicher Stand 24.08.2026 · 17:00 · Aktualisierung fehlgeschlagen';
  });
})();