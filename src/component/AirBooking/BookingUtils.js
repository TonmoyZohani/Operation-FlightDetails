export const getPassengerDetails = (totalPassenger) => {
  const passengerDetails = [];
  let paxNo = 0;

  for (let i = 0; i < totalPassenger.adultCount; i++) {
    passengerDetails.push({
      type: "Adult",
      count: i + 1,
      paxNo: paxNo++,
    });
  }

  for (let i = 0; i < totalPassenger.childCount.length; i++) {
    passengerDetails.push({
      type: "Child",
      count: i + 1,
      age: totalPassenger.childCount[i],
      paxNo: paxNo++,
    });
  }

  for (let i = 0; i < totalPassenger.infantCount; i++) {
    passengerDetails.push({
      type: "Infant",
      count: i + 1,
      paxNo: paxNo++,
    });
  }

  return passengerDetails;
};

export const wheelChairOptions = [
  {
    id: 1,
    description: "Passenger requires assistance with stairs",
  },
  {
    id: 2,
    description:
      "Passenger can walk short distances, but needs assistance with stairs",
  },
  {
    id: 3,
    description:
      "Passenger is unable to walk and needs an aisle chair for boarding",
  },
  {
    id: 4,
    description: "An aisle wheelchair is needed for the passenger on board",
  },
  {
    id: 5,
    description: "Passenger is using a manual wheelchair",
  },
  {
    id: 6,
    description:
      "Passenger is using a wheelchair powered by dry cell batteries",
  },
  {
    id: 7,
    description:
      "Passenger is using a wheelchair powered by wet cell batteries",
  },
];

export const mealOptions = [
  {
    id: 1,
    description: "Asian Vegetarian Meal",
  },
  {
    id: 2,
    description: "Infant/baby Food",
  },
  {
    id: 3,
    description: "Child Meal",
  },
  {
    id: 4,
    description: "Diabetic Meal",
  },
  {
    id: 5,
    description: "Sea Food Meal",
  },
  {
    id: 6,
    description: "Muslim Meal",
  },
];
