import express from "express";
import cors from "cors";
import { checkWalletActivity } from "./services/indexer";

const app = express();
const PORT = 3000;

// Cho phép Frontend gọi vào
app.use(cors());
app.use(express.json());

// API: Kiểm tra hoạt động ví
app.get("/api/check-activity/:address", async (req, res) => {
  const { address } = req.params;
  
  if (!address) {
    return res.status(400).json({ error: "Address required" });
  }

  console.log(`🔍 Indexer is scanning: ${address}`);

  try {
    const result = await checkWalletActivity(address);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Indexer failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend Server is running at http://localhost:${PORT}`);
});