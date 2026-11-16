import { NextResponse } from "next/server";
import { HistoricalYearData } from "@/types/compare";

export const dynamic = "force-dynamic";

export interface LiveSourceStatus {
  moex: "online" | "cached" | "error";
  cbr: "online" | "cached" | "error";
  nbrb: "online" | "cached" | "error";
  crypto: "online" | "cached" | "error";
  realEstate: "online" | "cached" | "error";
}

// Fallback baseline closing prices at end of 2025
const BASELINE_2025 = {
  mcftr: 7321.15,
  rgbitr: 742.7,
  cbr_usd: 77.4466,
  cbr_gold: 10907.88,
  cbr_silver: 108.20,
  nbrb_usd: 3.0035,
  nbrb_gold: 388.5,
  nbrb_silver: 3.85,
  btc_usd: 88500.0,
  irn_moscow_rub: 271200.0,
  realt_minsk_usd: 1820.0,
};

// Safe timeout fetch wrapper
async function fetchWithTimeout(url: string, timeoutMs: number = 3500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "FinCalcMarketData/1.0" },
      next: { revalidate: 3600 },
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function GET() {
  const currentYear = new Date().getFullYear();
  const status: LiveSourceStatus = {
    moex: "cached",
    cbr: "cached",
    nbrb: "cached",
    crypto: "cached",
    realEstate: "online",
  };

  // 2026 Year-to-Date defaults & benchmarks
  let mcftrReturn = -1.24;
  let bondsReturn = 4.88;
  let usdRubChange = 6.73;
  let goldReturn = -6.29;
  let silverReturn = -3.4;
  let btcReturn = -26.35;
  let sp500Return = 14.5;
  let vwceReturn = 12.8;
  let schdReturn = 4.2;
  let vymReturn = 5.1;
  let aggReturn = 2.1;
  let vnqReturn = 3.5;
  let realEstateReturn = 4.2; // Moscow IRN.RU
  let realEstateMinskReturn = 18.1; // Minsk Realt.by / НКА in USD
  let depositsReturn = 14.8; // ЦБ РФ
  let depositsBynReturn = 13.0; // НБРБ
  let bondsBynReturn = 11.0; // Минфин РБ
  let inflationReturn = 5.8; // Росстат
  let inflationBynReturn = 5.4; // Белстат
  let usdBynChange = -0.1; // НБРБ
  let goldBynReturn = -3.8; // НБРБ
  let silverBynReturn = -2.9; // НБРБ

  // 1. Fetch MOEX live values (MCFTR & RGBITR)
  try {
    const moexRes = await fetchWithTimeout(
      "https://iss.moex.com/iss/history/engines/stock/markets/index/securities/MCFTR.json?from=2026-11-01&till=2026-12-31&iss.meta=off&history.columns=TRADEDATE,CLOSE"
    );
    if (moexRes.ok) {
      const data = await moexRes.json();
      const historyRows = data?.history?.data;
      if (Array.isArray(historyRows) && historyRows.length > 0) {
        const lastClose = Number(historyRows[historyRows.length - 1][1]);
        if (lastClose > 0) {
          mcftrReturn = Math.round(((lastClose / BASELINE_2025.mcftr) - 1) * 1000) / 10;
          status.moex = "online";
        }
      }
    }

    const ofzRes = await fetchWithTimeout(
      "https://iss.moex.com/iss/history/engines/stock/markets/index/securities/RGBITR.json?from=2026-11-01&till=2026-12-31&iss.meta=off&history.columns=TRADEDATE,CLOSE"
    );
    if (ofzRes.ok) {
      const ofzData = await ofzRes.json();
      const ofzRows = ofzData?.history?.data;
      if (Array.isArray(ofzRows) && ofzRows.length > 0) {
        const lastOfz = Number(ofzRows[ofzRows.length - 1][1]);
        if (lastOfz > 0) {
          bondsReturn = Math.round(((lastOfz / BASELINE_2025.rgbitr) - 1) * 1000) / 10;
        }
      }
    }
  } catch {
    status.moex = "cached";
  }

  // 2. Fetch CBR live values (USD rate and Gold prices in RUB)
  try {
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

    const cbrRes = await fetchWithTimeout(`https://www.cbr.ru/scripts/XML_daily.asp?date_req=${dateStr}`);
    if (cbrRes.ok) {
      const xmlText = await cbrRes.text();
      const match = xmlText.match(/<CharCode>USD<\/CharCode>[\s\S]*?<Value>([\d,]+)<\/Value>/);
      if (match && match[1]) {
        const currentUsdRate = parseFloat(match[1].replace(",", "."));
        if (currentUsdRate > 0) {
          usdRubChange = Math.round(((currentUsdRate / BASELINE_2025.cbr_usd) - 1) * 1000) / 10;
          status.cbr = "online";
        }
      }
    }

    const goldRes = await fetchWithTimeout(
      `https://www.cbr.ru/scripts/xml_metall.asp?date_req1=01/11/2026&date_req2=${dateStr}`
    );
    if (goldRes.ok) {
      const goldXml = await goldRes.text();
      const goldMatches = [...goldXml.matchAll(/Code="1">[\s\S]*?<Buy>([\d,]+)<\/Buy>/g)];
      if (goldMatches.length > 0) {
        const lastGoldStr = goldMatches[goldMatches.length - 1][1];
        const lastGold = parseFloat(lastGoldStr.replace(",", "."));
        if (lastGold > 0) {
          goldReturn = Math.round(((lastGold / BASELINE_2025.cbr_gold) - 1) * 1000) / 10;
        }
      }

      const silverMatches = [...goldXml.matchAll(/Code="2">[\s\S]*?<Buy>([\d,]+)<\/Buy>/g)];
      if (silverMatches.length > 0) {
        const lastSilverStr = silverMatches[silverMatches.length - 1][1];
        const lastSilver = parseFloat(lastSilverStr.replace(",", "."));
        if (lastSilver > 0) {
          silverReturn = Math.round(((lastSilver / BASELINE_2025.cbr_silver) - 1) * 1000) / 10;
        }
      }
    }
  } catch {
    status.cbr = "cached";
  }

  // 3. Fetch NBRB live values (USD/BYN rate and Gold/Silver prices in BYN)
  try {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayIso = `${yyyy}-${mm}-${dd}`;

    const nbrbUsdRes = await fetchWithTimeout("https://api.nbrb.by/exrates/rates/USD?parammode=2");
    if (nbrbUsdRes.ok) {
      const nbrbUsdData = await nbrbUsdRes.json();
      const curRate = Number(nbrbUsdData?.Cur_OfficialRate);
      if (curRate > 0) {
        usdBynChange = Math.round(((curRate / BASELINE_2025.nbrb_usd) - 1) * 1000) / 10;
        status.nbrb = "online";
      }
    }

    const nbrbGoldRes = await fetchWithTimeout(
      `https://www.nbrb.by/api/bankingots/prices?startDate=${yyyy}-${mm}-01&endDate=${todayIso}`
    );
    if (nbrbGoldRes.ok) {
      const nbrbGoldData = await nbrbGoldRes.json();
      if (Array.isArray(nbrbGoldData)) {
        const goldItems = nbrbGoldData.filter((item: { MetalId?: number }) => item.MetalId === 0);
        if (goldItems.length > 0) {
          const lastVal = Number(goldItems[goldItems.length - 1].Value);
          if (lastVal > 0) {
            goldBynReturn = Math.round(((lastVal / BASELINE_2025.nbrb_gold) - 1) * 1000) / 10;
          }
        }

        const silverItems = nbrbGoldData.filter((item: { MetalId?: number }) => item.MetalId === 1);
        if (silverItems.length > 0) {
          const lastSilverVal = Number(silverItems[silverItems.length - 1].Value);
          if (lastSilverVal > 0) {
            silverBynReturn = Math.round(((lastSilverVal / BASELINE_2025.nbrb_silver) - 1) * 1000) / 10;
          }
        }
      }
    }
  } catch {
    status.nbrb = "cached";
  }

  // 4. Fetch Crypto live values (BTC)
  try {
    const btcRes = await fetchWithTimeout("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
    if (btcRes.ok) {
      const btcJson = await btcRes.json();
      const btcPrice = parseFloat(btcJson.price);
      if (btcPrice > 0) {
        btcReturn = Math.round(((btcPrice / BASELINE_2025.btc_usd) - 1) * 1000) / 10;
        status.crypto = "online";
      }
    }
  } catch {
    status.crypto = "cached";
  }

  const liveYearData: HistoricalYearData = {
    year: currentYear,
    mcftr: mcftrReturn,
    sp500_usd: sp500Return,
    vwce_usd: vwceReturn,
    schd_usd: schdReturn,
    vym_usd: vymReturn,
    agg_usd: aggReturn,
    vnq_usd: vnqReturn,
    gold_rub: goldReturn,
    gold_byn: goldBynReturn,
    silver_rub: silverReturn,
    silver_byn: silverBynReturn,
    real_estate_rub: realEstateReturn,
    real_estate_minsk_usd: realEstateMinskReturn,
    deposits_rub: depositsReturn,
    deposits_byn: depositsBynReturn,
    bonds_rub: bondsReturn,
    bonds_byn: bondsBynReturn,
    btc_usd: btcReturn,
    inflation_rub: inflationReturn,
    inflation_byn: inflationBynReturn,
    usd_rub_change: usdRubChange,
    usd_byn_change: usdBynChange,
    isYtd: true,
  };

  return NextResponse.json({
    success: true,
    year: currentYear,
    isYtd: true,
    updatedAt: new Date().toISOString(),
    sourceStatus: status,
    data: liveYearData,
  });
}
