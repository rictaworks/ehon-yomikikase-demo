import { createApp } from "./app";
import { DemoRepository } from "./db/repository";
import type { Env } from "./env";

const app = createApp();

export default {
  fetch: app.fetch,

  /** JST 03:00（UTC 18:00）の日次リセット。マスタ以外を削除する。 */
  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    try {
      await new DemoRepository(env.DB).purgeDemoData();
    } catch (err) {
      console.error("[scheduled] daily reset failed:", err);
      throw err;
    }
  }
};
