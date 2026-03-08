const API_URL = process.env.API_URL || process.env.DASHBOARD_API_URL || 'http://localhost:3001';

export async function getControl(): Promise<{ shouldRun: boolean }> {
  try {
    const res = await fetch(`${API_URL.replace(/\/$/, '')}/bot/control`, { method: 'GET' });
    if (res.ok) {
      const json = (await res.json()) as { success?: boolean; data?: { shouldRun?: boolean } };
      if (json?.data && json.data.shouldRun === false) {
        return { shouldRun: false };
      }
    }
  } catch {
    // API unreachable – keep running
  }
  return { shouldRun: true };
}
