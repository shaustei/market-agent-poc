const SYMBOLS: Record<string, string> = {
  HNR1: "HNR1.DE",
  EUNL: "EUNL.DE",
  CAT: "CAT",
  JBL: "JBL",
  LMT: "LMT",
  LHA: "LHA.DE",
  MCD: "MCD",
  ALV: "ALV.DE",
};

const FALLBACK: Record<string, { price: number | null; currency: string; previousClose: number | null; asOf: string }> = {
  HNR1: { price: 251.00, currency: "EUR", previousClose: 253.00, asOf: "2026-07-15T11:55:00+02:00" },
  EUNL: { price: null, currency: "EUR", previousClose: null, asOf: "2026-07-15T10:00:00+02:00" },
  CAT: { price: 903.51, currency: "USD", previousClose: null, asOf: "2026-07-14T16:00:00-04:00" },
  JBL: { price: 326.82, currency: "USD", previousClose: 321.96, asOf: "2026-07-14T16:00:00-04:00" },
  LMT: { price: 514.99, currency: "USD", previousClose: 520.66, asOf: "2026-07-14T16:00:00-04:00" },
  LHA: { price: 8.11, currency: "EUR", previousClose: null, asOf: "2026-07-15T10:00:00+02:00" },
  MCD: { price: 267.74, currency: "USD", previousClose: 273.46, asOf: "2026-07-17T16:00:00-04:00" },
  ALV: { price: 424.00, currency: "EUR", previousClose: 422.90, asOf: "2026-07-20T12:00:00+02:00" },
};

type Point = { t: number; v: number };
type SplitEvent = {
  date?: number;
  numerator?: number;
  denominator?: number;
  splitRatio?: string;
};

function compactSeries(values: Point[], maxPoints = 64) {
  if (values.length <= maxPoints) return values;
  const step = (values.length - 1) / (maxPoints - 1);
  return Array.from({ length: maxPoints }, (_, i) => values[Math.round(i * step)]);
}

function average(values: number[], count: number, end = values.length) {
  if (end < count) return null;
  const slice = values.slice(end - count, end);
  return slice.reduce((sum, value) => sum + value, 0) / slice.length;
}

function returnFor(values: number[], days: number) {
  if (values.length <= days || !values.at(-1) || !values.at(-(days + 1))) return null;
  return (values.at(-1)! / values.at(-(days + 1))! - 1) * 100;
}

function rsi(values: number[], period = 14) {
  if (values.length <= period) return null;
  let gains = 0;
  let losses = 0;
  const start = values.length - period;
  for (let i = start; i < values.length; i += 1) {
    const delta = values[i] - values[i - 1];
    if (delta >= 0) gains += delta;
    else losses -= delta;
  }
  if (losses === 0) return 100;
  const rs = (gains / period) / (losses / period);
  return 100 - 100 / (1 + rs);
}

function slopePercent(values: number[], window: number, lookback = 20) {
  const current = average(values, window);
  const prior = average(values, window, values.length - lookback);
  if (current == null || prior == null || prior === 0) return null;
  return (current / prior - 1) * 100;
}

function toSeries(timestamps: number[], closes: Array<number | null>): Point[] {
  return timestamps
    .map((t, index) => ({ t, v: closes[index] }))
    .filter((point): point is Point => Number.isFinite(point.v));
}

function dateKey(timestamp: number, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(timestamp * 1000));
}

function splitFactorBetween(events: Record<string, SplitEvent> | undefined, from: number, to: number) {
  let factor = 1;
  for (const event of Object.values(events ?? {})) {
    const eventTime = Number(event.date);
    if (!Number.isFinite(eventTime) || eventTime <= from || eventTime > to) continue;

    let numerator = Number(event.numerator);
    let denominator = Number(event.denominator);
    if ((!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) && event.splitRatio) {
      const [left, right] = event.splitRatio.split(":").map(Number);
      numerator = left;
      denominator = right;
    }
    if (Number.isFinite(numerator) && Number.isFinite(denominator) && denominator > 0 && numerator > 0) {
      factor *= numerator / denominator;
    }
  }
  return factor;
}

function priorTradingClose(
  rawSeries: Point[],
  marketTime: number,
  timeZone: string,
  splitEvents?: Record<string, SplitEvent>,
) {
  if (rawSeries.length < 2 || !Number.isFinite(marketTime)) return null;

  const lastIndex = rawSeries.length - 1;
  const latestBarIsCurrentSession = dateKey(rawSeries[lastIndex].t, timeZone) === dateKey(marketTime, timeZone);
  const priorIndex = latestBarIsCurrentSession ? lastIndex - 1 : lastIndex;
  if (priorIndex < 0) return null;

  const prior = rawSeries[priorIndex];
  const splitFactor = splitFactorBetween(splitEvents, prior.t, marketTime);
  const comparableClose = splitFactor > 0 ? prior.v / splitFactor : prior.v;
  return Number.isFinite(comparableClose) && comparableClose > 0 ? comparableClose : null;
}

async function loadChart(symbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1y&interval=1d&events=div%2Csplits`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; MarketAgentPOC/1.2)",
    },
  });
  if (!response.ok) throw new Error(`Market data ${response.status}`);
  const payload = await response.json();
  const result = payload?.chart?.result?.[0];
  if (!result) throw new Error("No chart result");

  const timestamps: number[] = result.timestamp ?? [];
  const rawCloses: Array<number | null> = result.indicators?.quote?.[0]?.close ?? [];
  const adjustedCloses: Array<number | null> = result.indicators?.adjclose?.[0]?.adjclose ?? rawCloses;
  const rawSeries = toSeries(timestamps, rawCloses);
  const adjustedSeries = toSeries(timestamps, adjustedCloses);
  const values = adjustedSeries.map((point) => point.v);
  const meta = result.meta ?? {};
  const marketTime = Number(meta.regularMarketTime ?? rawSeries.at(-1)?.t);
  const timeZone = meta.exchangeTimezoneName ?? "UTC";
  const price = Number(meta.regularMarketPrice ?? rawSeries.at(-1)?.v);
  let previousClose = priorTradingClose(rawSeries, marketTime, timeZone, result.events?.splits);

  // A move above 50% without a clean split adjustment is treated as invalid rather than displayed.
  if (Number.isFinite(price) && previousClose && Math.abs(price / previousClose - 1) > 0.5) {
    previousClose = null;
  }

  return {
    price: Number.isFinite(price) ? price : null,
    previousClose,
    currency: meta.currency ?? null,
    exchangeName: meta.exchangeName ?? null,
    marketState: meta.marketState ?? null,
    asOf: Number.isFinite(marketTime) ? new Date(marketTime * 1000).toISOString() : new Date().toISOString(),
    high52: values.length ? Math.max(...values) : null,
    low52: values.length ? Math.min(...values) : null,
    ma20: average(values, 20),
    ma50: average(values, 50),
    ma200: average(values, 200),
    ret20: returnFor(values, 20),
    ret60: returnFor(values, 60),
    ret120: returnFor(values, 120),
    rsi14: rsi(values, 14),
    ma50Slope20: slopePercent(values, 50, 20),
    ma200Slope20: slopePercent(values, 200, 20),
    series: compactSeries(adjustedSeries),
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
        ma20: null,
        ma50: null,
        ma200: null,
        ret20: null,
        ret60: null,
        ret120: null,
        rsi14: null,
        ma50Slope20: null,
        ma200Slope20: null,
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
    // Dated fallback stays visible in the UI.
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
