export const calculateAllPriceBreak = (priceBreakdown) => {
  const totals = {
    baseFare: 0,
    totalBaseFare: 0,
    totalAmount: 0,
    totalTaxAmount: 0,
    tax: 0,
    serviceFee: 0,
    otherCharges: 0,
    allTax: [],
    paxCount: 0,
    finalAit: 0,
  };

  priceBreakdown.forEach((item) => {
    totals.baseFare += item.baseFare || 0;
    totals.totalBaseFare += item.totalBaseFare || 0;
    totals.totalAmount += item.totalAmount || 0;
    totals.totalTaxAmount += item.totalTaxAmount || 0;
    totals.tax += item.tax || 0;
    totals.serviceFee += item.serviceFee || 0;
    totals.otherCharges += item.otherCharges || 0;
    totals.paxCount += item.paxCount || 0;
    totals.finalAit += item.finalAit || 0;

    if (item.allTax) {
      totals.allTax = [...totals.allTax, ...item.allTax];
    }
  });

  return {
    baseFare: totals.baseFare,
    tax: totals.tax,
    totalBaseFare: totals.totalBaseFare,
    totalAmount: totals.totalAmount,
    totalTaxAmount: totals.totalTaxAmount,
    totalTax: totals.tax,
    serviceFee: totals.serviceFee,
    otherCharges: totals.otherCharges,
    allTax: totals.allTax,
    paxCount: totals.paxCount,
    finalAit: totals.finalAit,
  };
};
