const prefixSet = new Set(['$', '€', '£', '¥']);

export function formatAmount(n: number, valuta: string): string {
  const amt = (Number(n) || 0).toFixed(2);
  const v = (valuta || '$').trim();
  if (prefixSet.has(v)) return `${v}${amt}`;
  return `${amt} ${v}`;
}

export function ordinalDay(
  input: string | number | null | undefined,
): string | null {
  const n = typeof input === 'string' ? parseInt(input, 10) : input ?? NaN;
  if (!Number.isInteger(n) || n < 1 || n > 31) return null;
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${n}th`;
  const last = n % 10;
  const suffix =
    last === 1 ? 'st' : last === 2 ? 'nd' : last === 3 ? 'rd' : 'th';
  return `${n}${suffix}`;
}

export function renewsLabel(billingDate?: string | null): string | null {
  const n = billingDate ? Number(billingDate) : NaN;
  if (!Number.isInteger(n) || n < 1 || n > 31) return null;
  const today = new Date().getDate();
  if (n === today) return 'Renews today';
  if ((((today + 1 - n) % 31) + 31) % 31 === 1 || n - today === 1)
    return 'Renews tomorrow';
  return `Renews on ${ordinalDay(n)}`;
}

export function parseFlexibleNumber(input: string): number {
  const t = input.trim().replace(/\s/g, '');
  if (!t) return NaN;

  const hasComma = t.includes(',');
  const hasDot = t.includes('.');

  if (hasComma && hasDot) {
    const lastComma = t.lastIndexOf(',');
    const lastDot = t.lastIndexOf('.');
    const decimalSep = lastComma > lastDot ? ',' : '.';
    const thousandsSep = decimalSep === ',' ? '.' : ',';
    const normalized = t
      .replace(new RegExp(`\\${thousandsSep}`, 'g'), '')
      .replace(decimalSep, '.');
    return Number(normalized);
  }

  if (hasComma) return Number(t.replace(',', '.'));
  return Number(t);
}

export function normalizeDecimalString(input: string): string {
  const t = input.trim().replace(/\s/g, '');
  if (!t) return '';
  const hasComma = t.includes(',');
  const hasDot = t.includes('.');
  if (hasComma && hasDot) {
    const lastComma = t.lastIndexOf(',');
    const lastDot = t.lastIndexOf('.');
    const decimalSep = lastComma > lastDot ? ',' : '.';
    const thousandsSep = decimalSep === ',' ? '.' : ',';
    return t
      .replace(new RegExp(`\\${thousandsSep}`, 'g'), '')
      .replace(decimalSep, '.');
  }
  return hasComma ? t.replace(',', '.') : t;
}
