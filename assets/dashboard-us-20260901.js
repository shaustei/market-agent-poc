(() => {
  const STAMP = '2026-09-01T17:00:00+02:00';
  const FOUR_MONTH_CUTOFF = '2026-05-01';
  const CHECKED_IDS = new Set(['CAT','JBL','LMT','MCD','AMZN']);
  const AMZN_TITLE = 'FTC und 22 US-Bundesstaaten verklagen Amazon wegen Sponsored-Ads-Auktionspraxis';
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

    const amzn = holdings.find(h => h.id === 'AMZN');
    if (amzn) {
      const ftc = {
        date:'2026-09-01', sourceName:'FTC / Amazon / Reuters', category:'Regulierung / Werbung',
        title:AMZN_TITLE,
        summary:'Die FTC und 22 US-Bundesstaaten werfen Amazon vor, Preise in Sponsored-Ads-Auktionen über nicht offengelegte Reserve-/Aufschlagsmechanismen künstlich erhöht und Werbekunden über die Auktionslogik getäuscht zu haben. Die FTC spricht von potenziell zweistelligen Milliardenbeträgen. Amazon weist die Vorwürfe zurück und argumentiert, durchschnittliche CPCs seien inflationsbereinigt stabil geblieben, Conversion-Raten gestiegen und Werbekunden hätten durch die Relevanzlogik profitiert.',
        impactText:'Negativ; Stärke 3. Das Verfahren trifft ein margenstarkes Wachstumssegment und schafft potenziell hohe Schadenersatz-, Verhaltensauflagen- und Reputationsrisiken. Die Vorwürfe sind bislang nicht gerichtlich festgestellt; Amazons Gegenposition ist dokumentiert.',
        impact:-3,
        source:'https://www.ftc.gov/news-events/news/press-releases/2026/08/ftc-states-sue-amazon-over-secret-ad-surcharge-scheme'
      };
      amzn.news = upsert(amzn.news, ftc, (a,b) => a.date === b.date && a.title === b.title);
      const risk = 'FTC-Klage vom 01.09.2026 gegen die Sponsored-Ads-Auktionspraxis: mögliches Schadenersatz-, Verhaltensauflagen- und Margenrisiko für das stark wachsende Werbegeschäft; Amazon bestreitet die Vorwürfe.';
      if (!(amzn.risks || []).includes(risk)) amzn.risks = [risk].concat(amzn.risks || []);
      amzn.thesis = 'Amazon verbindet starkes AWS-Wachstum, ein margenstarkes Werbegeschäft und Skaleneffekte im Handel. Q2 2026 bestätigte die KI-Nachfrage, gleichzeitig bleibt der Case kapitalintensiv. Neu hinzu kommt ein materielles regulatorisches Risiko im Werbegeschäft: Die FTC und 22 Bundesstaaten greifen die Sponsored-Ads-Auktionspraxis an; Amazon bestreitet die Vorwürfe. Für den Investment-Case ist entscheidend, ob daraus finanzielle Belastungen oder Änderungen der Werbemonetarisierung entstehen.';
      amzn.lastChangedAt = STAMP;
      amzn.changedSections = ['News','Rückenwind/Risiken','Investment-Einordnung'];
      amzn.updateStatus = 'updated';
      amzn.updateTag = 'NEU';
    }
  }

  function markRun() {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip && text) {
      text.textContent = `Inhalte: ${formatStamp(STAMP)}`;
      chip.classList.remove('status-ok','status-partial','status-error','status-closed');
      chip.classList.add('status-partial');
      chip.title = 'Teilaktualisierung: 9 Dashboard-Datensätze, 9 Dashboard-IDs und 9 Marktdatensymbole sind konsistent. Eine separate Holdings.md bzw. neuere Holdings-Datei ist im Repository nicht vorhanden; daher wurde der im Auftrag bestätigte 9er-Bestand verwendet und keine Position entfernt.';
    }

    document.querySelectorAll('.holding').forEach(card => {
      card.classList.remove('content-changed','content-partial');
      const h = holdings.find(x => x.id === card.dataset.id);
      if (h?.id === 'AMZN') {
        card.classList.add('content-changed');
        card.title = 'Heute inhaltlich aktualisiert · News, Rückenwind/Risiken, Investment-Einordnung';
      } else if (h?.lastCheckedAt && CHECKED_IDS.has(h.id)) {
        card.title = `Letzte Inhaltsprüfung: ${formatStamp(h.lastCheckedAt)} · Keine inhaltliche Änderung`;
      }
    });

    document.querySelectorAll('.update-badge').forEach(el => el.remove());
    if (selected === 'AMZN') {
      document.querySelectorAll('#tab-events .news-item').forEach(item => {
        const h4 = item.querySelector('h4');
        if (h4 && h4.textContent.trim() === AMZN_TITLE) {
          const badge = document.createElement('span');
          badge.className = 'update-badge update-new';
          badge.textContent = 'NEU';
          h4.prepend(badge);
        }
      });
    }
    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 01.09.2026 · 17:00 · Quellen in jedem Eintrag';
  }

  async function boot() {
    await new Promise(r => setTimeout(r, 6200));
    applyRun();
    renderCards();
    renderDetail();
    markRun();
    [250, 1200, 2600].forEach(delay => setTimeout(markRun, delay));
    document.addEventListener('click', event => {
      if (event.target.closest('.holding') || event.target.closest('.tab')) setTimeout(markRun, 0);
    });
  }

  boot().catch(() => {
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (chip) { chip.classList.remove('status-ok','status-partial','status-closed'); chip.classList.add('status-error'); }
    if (text) text.textContent = 'Inhalte: letzter erfolgreicher Stand 01.09.2026 · 10:00 · Aktualisierung fehlgeschlagen';
  });
})();
