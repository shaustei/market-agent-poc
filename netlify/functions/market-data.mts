const SYMBOLS: Record<string, string> = {
  HNR1: "HNR1.DE",
  EUNL: "EUNL.DE",
  CAT: "CAT",
  JBL: "JBL",
  LMT: "LMT",
  LHA: "LHA.DE",
};

const FALLBACK: Record<string, { price: number | null; currency: string; previousClose: number | null; asOf: string }> = {
  HNR1: { price: 251.00, currency: "EUR", previousClose: 253.00, asOf: "2026-07-15T11:55:00+02:00" },
  EUNL: { price: null, currency: "EUR", previousClose: null, asOf: "2026-07-15T10:00:00+02:00" },
  CAT: { price: 938.39, currency: "USD", previousClose: null, asOf: "2026-07-09T16:00:00-04:00" },
  JBL: { price: 326.82, currency: "USD", previousClose: 321.96, asOf: "2026-07-14T16:00:00-04:00" },
  LMT: { price: 514.99, currency: "USD", previousClose: 520.66, asOf: "2026-07-14T16:00:00-04:00" },
  LHA: { price: null, currency: "EUR", previousClose: null, asOf: "2026-07-15T10:00:00+02:00" },
};

function compactSeries(values: Array<{ t: number; v: number }>, maxPoints = 64) {
  if (values.length <= maxPoints) return values;
  const step = (values.length - 1) / (maxPoints - 1);
  return Array.from({ length: maxPoints }, (_, i) => values[Math.round(i * step)]);
}

function average(values: number[], count: number) {
  if (values.length < count) return null;
  const slice = values.slice(-count);
  return slice.reduce((sum, value) => sum + value, 0) / slice.length;
}

async function loadChart(symbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1y&interval=1d&events=div%2Csplits`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; MarketAgentPOC/1.0)",
    },
  });
  if (!response.ok) throw new Error(`Market data ${response.status}`);
  const payload = await response.json();
  const result = payload?.chart?.result?.[0];
  if (!result) throw new Error("No chart result");

  const timestamps: number[] = result.timestamp ?? [];
  const closes: Array<number | null> = result.indicators?.adjclose?.[0]?.adjclose
    ?? result.indicators?.quote?.[0]?.close
    ?? [];
  const series = timestamps
    .map((t, index) => ({ t, v: closes[index] }))
    .filter((point): point is { t: number; v: number } => Number.isFinite(point.v));
  const values = series.map((point) => point.v);
  const meta = result.meta ?? {};
  const price = Number(meta.regularMarketPrice ?? values.at(-1));
  const previousClose = Number(meta.previousClose ?? meta.chartPreviousClose ?? values.at(-2));
  const high52 = values.length ? Math.max(...values) : null;
  const low52 = values.length ? Math.min(...values) : null;
  const ma50 = average(values, 50);
  const ma200 = average(values, 200);

  return {
    price: Number.isFinite(price) ? price : null,
    previousClose: Number.isFinite(previousClose) ? previousClose : null,
    currency: meta.currency ?? null,
    exchangeName: meta.exchangeName ?? null,
    marketState: meta.marketState ?? null,
    asOf: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : new Date().toISOString(),
    high52,
    low52,
    ma50,
    ma200,
    series: compactSeries(series),
  };
}

export default async () => {
  const entries = await Promise.all(Object.entries(SYMBOLS).map(async ([key, symbol]) => {
    try {
      return [key, { ...(await loadChart(symbol)), symbol, source: "live" }];
    } catch (error) {
      const fallback = FALLBACK[key];
      return [key, {
        ...fallback,
        symbol,
        source: "fallback",
        error: error instanceof Error ? error.message : "Unknown error",
        high52: null,
        low52: null,
        ma50: null,
        ma200: null,
        series: [],
      }];
    }
  }));

  let usdToEur = 0.876;
  let fxSource = "fallback";
  try {
    const fx = await loadChart("EURUSD=X");
    if (fx.price && fx.price > 0) {
      usdToEur = 1 / fx.price;
      fxSource = "live";
    }
  } catch {
    // Keep the dated fallback; the UI labels the source explicitly.
  }

  return new Response(JSON.stringify({
    generatedAt: new Date().toISOString(),
    usdToEur,
    fxSource,
    quotes: Object.fromEntries(entries),
  }), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300, stale-while-revalidate=900",
    },
  });
};

export const config = { path: "/api/market-data" };
