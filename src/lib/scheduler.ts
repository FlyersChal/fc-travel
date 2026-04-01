const INTERVAL = 3 * 60 * 60 * 1000; // 3시간

let started = false;

export function startScheduler() {
  if (started) return;
  started = true;

  console.log("[Scheduler] Started - checking scheduled posts every 3 hours");

  setInterval(async () => {
    try {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3001";
      const res = await fetch(`${baseUrl}/api/cron/publish`);
      const data = await res.json();
      if (data.published > 0) {
        console.log(`[Scheduler] Published ${data.published} scheduled post(s)`);
      }
    } catch (error) {
      // 서버 시작 중이면 무시
    }
  }, INTERVAL);
}
