// Store display rate. Prices remain stored and charged in DZD; USD is an approximate display only.
export const DZD_PER_USD = 130;

export const formatDzd = (amount: number) =>
  `${Math.round(amount).toLocaleString('ar-DZ')} دج`;

export const formatUsd = (amount: number) =>
  `$${(amount / DZD_PER_USD).toFixed(2)}`;
