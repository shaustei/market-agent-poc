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
      `/data/${id}.json?v=20260904-1700`,
      `${RAW_BASE}${id}.json?ref=20260904-1700`
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
    ['/assets/dashboard-eu-20260904.js','/assets/dashboard-us-20260904.js'].forEach((src, i) => {
      setTimeout(() => {
        const s = document.createElement('script');
        s.src = `${src}?recovery=20260905-1541`;
        s.async = false;
        document.body.appendChild(s);
      }, 150 + i * 180);
    });
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
