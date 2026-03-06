import express from "express";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/transactions", (req, res) => {
    // Mock transaction data
    const mockHistory = [
      {
        id: 1025,
        user_id: 1,
        amount: 500.00,
        payment_method: 'bkash',
        trx_id: 'TRX123456789',
        created_at: "2024-03-05T10:00:00Z",
        status: 'completed',
        desc: 'Added Money to Wallet'
      },
      {
        id: 1026,
        user_id: 1,
        amount: 45.00,
        payment_method: 'online',
        order_txid: 'ORD987654321',
        created_at: "2024-03-04T11:30:00Z",
        status: 'pending',
        desc: 'Mobile Legends - 50 Diamonds'
      }
    ];
    res.json(mockHistory);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static("dist"));
    // SPA fallback
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
