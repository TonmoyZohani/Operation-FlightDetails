export const getAgeCategoryFromDOB = (dateOfBirth) => {
  if (!dateOfBirth) return "Adult";

  const dob = new Date(dateOfBirth);
  const today = new Date();

  // Calculate the difference in years, months, and days
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  // Adjust for negative months
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Adjust for negative days
  if (days < 0) {
    months -= 1;
    const daysInPreviousMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    ).getDate();
    days += daysInPreviousMonth;
  }

  // Determine category based on age
  if (years < 1 || (years === 1 && months === 11 && days <= 29))
    return "Infant";
  if (years < 11 || (years === 11 && months === 11 && days <= 29))
    return "Child";
  return "Adult";
};
