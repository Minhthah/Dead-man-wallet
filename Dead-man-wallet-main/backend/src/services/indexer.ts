import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const NETWORK = "testnet";
const client = new SuiClient({ url: getFullnodeUrl(NETWORK) });

// 6 tháng tính bằng mili-giây
const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;

export const checkWalletActivity = async (address: string) => {
  try {
    // Lấy giao dịch gần nhất của ví này
    const txs = await client.queryTransactionBlocks({
      filter: { FromAddress: address },
      limit: 1,
      order: "descending",
    });

    if (txs.data.length === 0) {
      return { active: false, reason: "No transaction found" };
    }

    const lastTxTime = Number(txs.data[0].timestampMs);
    const timeDiff = Date.now() - lastTxTime;

    // Logic kiểm tra
    if (timeDiff < SIX_MONTHS_MS) {
      return { 
        active: true, 
        lastActive: new Date(lastTxTime).toISOString(),
        message: "Owner is still active within 6 months" 
      };
    } else {
      return { 
        active: false, 
        lastActive: new Date(lastTxTime).toISOString(),
        message: "Inactive > 6 months. Unlock allowed." 
      };
    }
  } catch (error) {
    console.error("Indexer Error:", error);
    throw new Error("Failed to check blockchain activity");
  }
};