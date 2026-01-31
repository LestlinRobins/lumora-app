const CARROTS_KEY = "lumora:carrots";

function safeParseInt(value: string | null): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getCarrots(): number {
  try {
    return safeParseInt(localStorage.getItem(CARROTS_KEY));
  } catch {
    return 0;
  }
}

export function setCarrots(value: number): void {
  const normalized = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  try {
    localStorage.setItem(CARROTS_KEY, String(normalized));
  } catch {
    // ignore
  }

  window.dispatchEvent(
    new CustomEvent("lumora:carrots-updated", { detail: { carrots: normalized } })
  );
}

export function addCarrots(amount: number): number {
  const current = getCarrots();
  const next = current + (Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0);
  setCarrots(next);
  return next;
}

export function onCarrotsChanged(handler: (carrots: number) => void): () => void {
  const onCustom = (event: Event) => {
    const custom = event as CustomEvent<{ carrots: number }>;
    const carrots = custom.detail?.carrots;
    if (typeof carrots === "number") handler(carrots);
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key === CARROTS_KEY) {
      handler(safeParseInt(event.newValue));
    }
  };

  window.addEventListener("lumora:carrots-updated", onCustom);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener("lumora:carrots-updated", onCustom);
    window.removeEventListener("storage", onStorage);
  };
}
