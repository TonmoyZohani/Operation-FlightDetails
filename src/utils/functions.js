export const getFilterOptionArray = (optionArr) => {
  return optionArr.map((option) => ({ label: option, value: option }));
};

// Define the order for sorting
const paxTypeOrder = ["ADT", "CNN", "INF"];

// Helper function to sort data
export const sortByPaxType = (data) => {
  return [...data]?.sort((a, b) => {
    return paxTypeOrder.indexOf(a.paxType) - paxTypeOrder.indexOf(b.paxType);
  });
};

export function isDateWithinRange(dateStr) {
  const givenDate = new Date(dateStr);
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  const diffInDays = Math.ceil((givenDate - now) / oneDay);

  // Check if the  5 days
  return diffInDays > 5;
}

export const getDayDifference = (dep, arr) => {
  if (!dep || !arr) return "";
  const depDate = new Date(dep);
  const arrDate = new Date(arr);
  depDate.setHours(0, 0, 0, 0);
  arrDate.setHours(0, 0, 0, 0);
  if (isNaN(depDate) || isNaN(arrDate)) return "";
  const diffDays = Math.floor((arrDate - depDate) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "";
  return `+ ${diffDays} Day${diffDays !== 1 ? "s" : ""}`;
};

export function trimAddresses(data) {
  const trim = (address) => address?.split(",")[0];

  return {
    ...data,
    result: {
      ...data.result,
      address: trim(data.result.address),
    },
    suggestion: data.suggestion.map((item) => ({
      ...item,
      address: trim(item.address),
    })),
  };
}
