export function formatNumber(number: number): string {
  return Intl.NumberFormat("bn-BD").format(number);
}
