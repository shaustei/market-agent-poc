(() => {
  const IDS = ['HNR1','EUNL','CAT','JBL','LMT','LHA','MCD','ALV','AMZN','MEDP','NTAP','RNG'];
  let running = false;

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function readHolding(id) {
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const r = await fetch('/data/' + id + '.json', { cache: 'no-store' });
        if (!r.ok) throw new Error(`${id}: HTTP ${r.status}`);
        const data = await r.json();
        if (!data || data.id !== id) throw new Error(`${id}: invalid payload`);
        return data;
      } catch (err) {
        lastError = err;
        await sleep(250 * (attempt + 1));
      }
    }
    throw lastError || new Error(`${id}: load failed`);
  }

  async function recover() {
    if (running) return;
    const root = document.getElementById('holdings');
    const alreadyHealthy = Array.isArray(holdings) && holdings.length === IDS.length && root && root.children.length === IDS.length;
    if (alreadyHealthy) return;

    running = true;
    try {
      const settled = await Promise.allSettled(IDS.map(readHolding));
      const failed = settled.map((r, i) => r.status === 'rejected' ? IDS[i] : null).filter(Boolean);
      if (failed.length) {
        const state = document.getElementById('data-state');
        if (state) state.textContent = `Dashboard-Daten konnten nicht geladen werden: ${failed.join(', ')}`;
        return;
      }

      holdings = settled.map(r => r.value);
      const all = document.querySelector('[data-filter="ALL"]');
      if (all) all.textContent = `Alle ${holdings.length}`;
      if (!IDS.includes(selected)) selected = holdings[0].id;

      renderCards();
      renderDetail();
      await load();
    } catch (err) {
      const state = document.getElementById('data-state');
      if (state) state.textContent = 'Dashboard-Daten konnten nicht geladen werden';
    } finally {
      running = false;
    }
  }

  setTimeout(recover, 300);
  setTimeout(recover, 2500);
  window.addEventListener('pageshow', () => setTimeout(recover, 200));
})();
