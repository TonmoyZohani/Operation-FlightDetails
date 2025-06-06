export const groupAndCalculateCNN = (priceBreakdown) => {
  const groupedByAge = {
    "2-4": [],
    "5-11": [],
  };

  priceBreakdown.forEach((item) => {
    if (item.paxType === "CNN" && item.age && item.age.length > 0) {
      const age = item.age[0];
      if (age >= 2 && age <= 4) {
        groupedByAge["2-4"].push(item);
      } else if (age >= 5 && age <= 11) {
        groupedByAge["5-11"].push(item);
      }
    }
  });

  const calculateTotals = (group) => {
    const totals = group.reduce(
      (acc, item) => {
        acc.baseFare.push(item.baseFare || 0);
        acc.totalBaseFare += item.baseFare || 0;
        acc.totalAmount += item.totalAmount || 0;
        acc.totalTaxAmount += item.totalTaxAmount || 0;
        acc.tax += item.tax || 0;
        acc.serviceFee += item.serviceFee || 0;
        acc.paxCount += 1;
        acc.allTax = [...acc.allTax, ...(item.allTax || [])];
        return acc;
      },
      {
        baseFare: [],
        totalBaseFare: 0,
        totalAmount: 0,
        totalTaxAmount: 0,
        tax: 0,
        serviceFee: 0,
        paxCount: 0,
        allTax: [],
      }
    );

    return {
      baseFare: totals.baseFare,
      totalBaseFare: totals.totalBaseFare,
      totalAmount: totals.totalAmount,
      totalTaxAmount: totals.totalTaxAmount,
      tax: totals.tax,
      serviceFee: totals.serviceFee,
      paxCount: totals.paxCount,
      allTax: totals.allTax,
    };
  };

  const group2to4 = calculateTotals(groupedByAge["2-4"]);
  const group5to11 = calculateTotals(groupedByAge["5-11"]);

  const result = [];

  if (group2to4.paxCount > 0) {
    result.push({
      ageRange: "2-4",
      paxCount: group2to4.paxCount,
      baseFare: group2to4.baseFare,
      totalBaseFare: group2to4.totalBaseFare,
      totalAmount: group2to4.totalAmount,
      totalTaxAmount: group2to4.totalTaxAmount,
      tax: group2to4.tax,
      serviceFee: group2to4.serviceFee,
      paxType: "CNN",
    });
  }

  if (group5to11.paxCount > 0) {
    result.push({
      ageRange: "5-11",
      paxCount: group5to11.paxCount,
      baseFare: group5to11.baseFare,
      totalBaseFare: group5to11.totalBaseFare,
      totalAmount: group5to11.totalAmount,
      totalTaxAmount: group5to11.totalTaxAmount,
      tax: group5to11.tax,
      serviceFee: group5to11.serviceFee,
      paxType: "CNN",
    });
  }

  return result;
};
