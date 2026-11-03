// Single guarded service-worker registrar. Never registers in dev, iframes or Lovable previews.
const SW_URL = "/sw.js";

function isRefusedContext(): boolean {
  if (!import.meta.env.PROD) return true;
  try {
    if (window.self !== window.top) return true;
  } catch {
    return true;
  }
  const host = window.location.hostname.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  if (params.get("sw") === "off") return true;
  const label = host.split(".")[0];
  const previewDomain = /\.(lovable\.app|gpt-eng\.com|gptengineer\.run)$/.test(host);
  if (previewDomain && /^(?:id-preview|preview)(?:-[a-z0-9]+)?--.+$/.test(label)) return true;
  if (previewDomain && /^project--.+-dev$/.test(label)) return true;
  if (/(^|\.)lovableproject(-dev)?\.com$/.test(host)) return true;
  if (/(^|\.)beta\.lovable\.dev$/.test(host)) return true;
  return false;
}

async function unregisterAppSW() {
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.allSettled(
    regs
      .filter((r) => (r.active || r.installing || r.waiting)?.scriptURL.endsWith(SW_URL))
      .map((r) => r.unregister()),
  );
}

export function registerAppServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  if (isRefusedContext()) {
    void unregisterAppSW();
    return;
  }
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(SW_URL, { scope: "/" }).catch(() => {});
  });
  if (document.readyState === "complete") {
    navigator.serviceWorker.register(SW_URL, { scope: "/" }).catch(() => {});
  }
}
