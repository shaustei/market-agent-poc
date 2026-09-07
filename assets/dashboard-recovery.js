(() => {
  const IDS = ['HNR1','EUNL','CAT','JBL','LMT','LHA','MCD','ALV','AMZN','MEDP','NTAP','RNG'];
  const RAW_BASE = 'https://raw.githubusercontent.com/shaustei/market-agent-poc/main/data/';
  let running = false;
  let recoveredOnce = false;

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function fetchJson(url) {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
    return r.json();
  }

  async function readHolding(id) {
    let lastError;
    const urls = [
      `/data/${id}.json?v=20260907-1410`,
      `${RAW_BASE}${id}.json?ref=20260907-1410`
    ];
    for (const url of urls) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const data = await fetchJson(url);
          if (!data || data.id !== id) throw new Error(`${id}: invalid payload`);
          return data;
        } catch (err) {
          lastError = err;
          await sleep(180 * (attempt + 1));
        }
      }
    }
    throw lastError || new Error(`${id}: load failed`);
  }

  function replayCurrentOverlays() {
    if (recoveredOnce) return;
    recoveredOnce = true;
    ['/assets/dashboard-us-20260904.js','/assets/dashboard-eu-20260907.js'].forEach((src, i) => {
      setTimeout(() => {
        const s = document.createElement('script');
        s.src = `${src}?recovery=20260907-1410`;
        s.async = false;
        document.body.appendChild(s);
      }, 150 + i * 220);
    });
  }

  async function waitForRuntime() {
    for (let i = 0; i < 40; i++) {
      if (typeof window.renderCards === 'function' && typeof window.renderDetail === 'function' && typeof window.load === 'function') return true;
      await sleep(100);
    }
    return false;
  }

  async function recover() {
    if (running) return;
    const root = document.getElementById('holdings');
    const currentHoldings = Array.isArray(window.holdings) ? window.holdings : [];
    const alreadyHealthy = currentHoldings.length === IDS.length && root && root.children.length === IDS.length;
    if (alreadyHealthy) return;

    running = true;
    try {
      const runtimeReady = await waitForRuntime();
      if (!runtimeReady) throw new Error('Dashboard-Runtime nicht verfügbar');

      const settled = await Promise.allSettled(IDS.map(readHolding));
      const failed = settled.map((r, i) => r.status === 'rejected' ? IDS[i] : null).filter(Boolean);
      if (failed.length) {
        const state = document.getElementById('data-state');
        if (state) state.textContent = `Dashboard-Daten konnten nicht geladen werden: ${failed.join(', ')}`;
        return;
      }

      window.holdings = settled.map(r => r.value);
      if (!IDS.includes(window.selected)) window.selected = window.holdings[0].id;
      const all = document.querySelector('[data-filter="ALL"]');
      if (all) all.textContent = `Alle ${window.holdings.length}`;

      window.renderCards();
      window.renderDetail();
      await window.load();
      replayCurrentOverlays();
    } catch (err) {
      const state = document.getElementById('data-state');
      if (state) state.textContent = `Dashboard-Daten konnten nicht geladen werden${err && err.message ? ': ' + err.message : ''}`;
    } finally {
      running = false;
    }
  }

  setTimeout(recover, 250);
  setTimeout(recover, 1800);
  setTimeout(recover, 5000);
  window.addEventListener('pageshow', () => setTimeout(recover, 200));
})();
