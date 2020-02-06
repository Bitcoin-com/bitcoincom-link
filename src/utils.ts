
export function fromFixed(number: string, decimals: number): number {
  return Number((Number(number) * Math.pow(10, decimals)).toString().split('.')[0]);
}
