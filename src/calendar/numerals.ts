const TAMIL_DIGITS = ['௦', '௧', '௨', '௩', '௪', '௫', '௬', '௭', '௮', '௯'] as const;

export function toTamilNumerals(value: number | string): string {
  return String(value).replace(/\d/g, (digit) => TAMIL_DIGITS[Number(digit)]);
}
