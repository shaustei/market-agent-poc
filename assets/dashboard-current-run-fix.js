(() => {
  const STAMP = '2026-08-11T17:00:00+02:00';
  const CHANGED_IDS = new Set(['JBL','MCD']);

  function applyChanges() {
    const jbl = holdings.find(h => h.id === 'JBL');
    if (jbl) {
      jbl.changedSections = ['Insider'];
      jbl.updateStatus = 'updated';
      jbl.updateTag = 'AKTUALISIERT';
      jbl.lastChangedAt = STAMP;
      jbl.insiderNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 11.08.2026 17:00 CEST. Gary K. Schicks Verkauf vom 15.07.2026 erfolgte ausdrücklich gemäß Rule-10b5-1-Plan. Vier Open-Market-Verkäufe vom 08./10.04.2026 sind aus dem rollierenden Vier-Monats-Fenster gefallen und wurden entfernt.';
    }
    const mcd = holdings.find(h => h.id === 'MCD');
    if (mcd) {
      mcd.changedSections = ['Insider'];
      mcd.updateStatus = 'updated';
      mcd.updateTag = 'AKTUALISIERT';
      mcd.lastChangedAt = STAMP;
      mcd.insiderNote = 'Rollierendes Vier-Monats-Fenster, geprüft bis 11.08.2026 17:00 CEST. Keine neue relevante Open-Market-Transaktion verifiziert. Joseph Erlingers Verkauf vom 23.03.2026 ist aus dem Vier-Monats-Fenster gefallen und wurde entfernt.';
    }
  }

  function markChanges() {
    document.querySelectorAll('.holding').forEach(card => {
      if (CHANGED_IDS.has(card.dataset.id)) card.classList.add('content-changed');
    });
    document.querySelectorAll('.update-badge').forEach(el => el.remove());
    if (!CHANGED_IDS.has(selected)) return;
    const head = [...document.querySelectorAll('#tab-research .box h3')].find(el => el.textContent.includes('Insider'));
    if (head) head.insertAdjacentHTML('beforeend', ' <span class="update-badge update-updated">AKTUALISIERT</span>');
  }

  async function boot() {
    await new Promise(resolve => setTimeout(resolve, 500));
    applyChanges();
    const priorCards = renderCards;
    renderCards = function(){ priorCards(); markChanges(); };
    const priorDetail = renderDetail;
    renderDetail = function(){ priorDetail(); markChanges(); };
    renderCards();
    renderDetail();
    markChanges();
  }

  boot();
})();
