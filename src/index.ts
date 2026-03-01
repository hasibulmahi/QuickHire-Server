import "dotenv/config";
import dns from "dns";

// Use Google DNS so Atlas SRV lookup works when system DNS blocks it (e.g. querySrv ECONNREFUSED)
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import jobsRouter from "./routes/jobs";
import applicationsRouter from "./routes/applications";

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "10mb" }));

app.use("/api/jobs", jobsRouter);
app.use("/api/applications", applicationsRouter);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Startup error:", err);
  process.exit(1);
});
