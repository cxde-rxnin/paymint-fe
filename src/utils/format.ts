export function formatDate(ts?: number) {
  if (!ts) return "-";
  const d = new Date(ts * 1000);
  return d.toLocaleString();
}

/**
 * Convert MIST to SUI (1 SUI = 1,000,000,000 MIST)
 */
export function mistToSui(mist: number): number {
  return mist / 1_000_000_000;
}

/**
 * Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
 */
export function suiToMist(sui: number): number {
  return Math.floor(sui * 1_000_000_000);
}

/**
 * Format amount in SUI with proper decimals
 */
export function formatSui(amount: number, decimals: number = 4): string {
  return amount.toFixed(decimals) + " SUI";
}

/**
 * Format amount converting from MIST to SUI
 */
export function formatMistAsSui(mist: number, decimals: number = 4): string {
  return formatSui(mistToSui(mist), decimals);
}

/**
 * Format currency amount with proper decimals
 */
export function formatCurrency(amount: number, decimals: number = 4): string {
  return amount.toFixed(decimals);
}
