import cron from "node-cron"
import { reset } from "./services/reset.service"
import { ensureDb } from "./db/init"

// JST 03:00 = UTC 18:00 (UTC+9)
cron.schedule(
  "0 18 * * *",
  () => {
    try {
      ensureDb()
      reset()
    } catch (err) {
      console.error("[cron] daily reset failed:", err)
    }
  },
  { timezone: "UTC" }
)
