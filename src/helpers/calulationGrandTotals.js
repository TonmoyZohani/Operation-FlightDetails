export function calculateGrandTotals(data) {
  return data.reduce(
    (totals, item) => {
      const totalBaseFare = item?.baseFare || 0;
      const totalTax = item?.tax;
      const finalAit = item?.finalAit;

      return {
        totalBaseFare: totals.totalBaseFare + totalBaseFare,
        totalTax: totals.totalTax + totalTax,
        finalAit: totals.finalAit + finalAit,
      };
    },
    { totalBaseFare: 0, totalTax: 0, finalAit: 0 }
  );
}
