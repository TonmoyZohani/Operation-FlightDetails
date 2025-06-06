export const getPrefixesData = (passengerType, gender, age) => {
  if (!passengerType || !gender) return []; // Handle invalid inputs

  const normalizedPassengerType = passengerType.toLowerCase();
  const normalizedGender = gender.toLowerCase();

  if (normalizedPassengerType === "adult") {
    if (age <= 29) {
      return normalizedGender === "male" ? "MR" : "MS";
    } else {
      return normalizedGender === "male" ? "MR" : "MS";
    }
  } else if (
    normalizedPassengerType === "child" ||
    normalizedPassengerType === "infant"
  ) {
    return normalizedGender === "male" ? "MASTER" : "MISS";
  }

  return "";
};
