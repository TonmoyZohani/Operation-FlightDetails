import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const ensurePassengerDataInitialized = (state, passengerType, index) => {
  if (!state.passengerData[passengerType]) {
    state.passengerData[passengerType] = [];
  }

  if (!state.passengerData[passengerType][index]) {
    state.passengerData[passengerType][index] = {
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
      passportNation: {
        name: "Bangladesh",
        code: "BD",
      },
      passportNumber: null,
      passportExpire: null,
      prefix: "",
      frequentTraveler: false,
      passportImage: null,
      visaImage: null,
      ancillaries: [
        { type: "wheelChair", description: "", remarks: "" },
        { type: "meals", description: "", remarks: "" },
        { type: "vipMessage", description: "", remarks: "" },
      ],
      visaInfo: [],
      isVisaChecking: false,
    };
  }
};

const flightBookingSlice = createSlice({
  name: "flightBooking",
  initialState: {
    passengerData: {
      adult: [],
      child: [],
      infant: [],
    },
    clientContact: {
      clientEmail: "",
      clientPhoneNumber: "",
    },
    sendSms: false,
    sendEmail: false,
    isFareRules: true,
    isTermsCondition: true,
    preview: null,
    stepper: 1,
    tabStepper: 1,
    firstClick: false,
    partialData: null,
    partialChargeData: null,
  },
  reducers: {
    initializePassengerData: (state, action) => {
      const passengerDetails = action.payload;

      state.passengerData = {
        adult: [],
        child: [],
        infant: [],
      };

      const basePassenger = {
        firstName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "",
        passportNation: {
          name: "Bangladesh",
          code: "BD",
        },
        passportNumber: null,
        passportExpire: null,
        prefix: "",
        frequentTraveler: false,
        passportImage: null,
        visaImage: null,
        passportImageReader: null,
        visaImageReader: null,
        passportScanValidate: false,
        ancillaries: [
          { type: "wheelChair", description: "", remarks: "" },
          { type: "meals", description: "", remarks: "" },
          { type: "vipMessage", description: "", remarks: "" },
        ],
      };

      passengerDetails.forEach(({ type, count, age }) => {
        const passengerType = type.toLowerCase();
        for (let i = 0; i < count; i++) {
          state.passengerData[passengerType].push({
            ...basePassenger,
            type: type === "Adult" ? "ADT" : type === "Child" ? "CNN" : "INF",
            age: type === "Child" ? age || "" : undefined,
          });
        }
      });
    },

    reissuePassengerData: (state, action) => {
      const passengerArray = action.payload;
      // Reset passengerData to empty arrays
      state.passengerData = {
        adult: [],
        child: [],
        infant: [],
      };

      // Map the passenger array to the correct passenger type
      passengerArray.forEach((passenger) => {
        const {
          type,
          firstName,
          lastName,
          gender,
          dateOfBirth,
          passportNation,
          passportNumber,
          passportExpire,
          prefix,
          frequentTraveler,
          ancillaries,
          passportImage,
          visaImage,
        } = passenger;

        const passengerType =
          type === "ADT"
            ? "adult"
            : type === "CNN"
              ? "child"
              : type === "INF"
                ? "infant"
                : null;

        if (passengerType) {
          state.passengerData[passengerType].push({
            firstName,
            lastName,
            gender,
            dateOfBirth,
            passportNation: { code: passportNation },
            passportNumber,
            passportExpire,
            prefix,
            frequentTraveler,
            passportImage: null,
            visaImage: null,
            ancillaries: ancillaries
              ? ancillaries
              : [
                  { type: "wheelChair", description: "", remarks: "" },
                  { type: "meals", description: "", remarks: "" },
                  { type: "vipMessage", description: "", remarks: "" },
                ],
          });
        }
      });
    },

    setPassengerFirstName: (state, action) => {
      const { passengerType, index, firstName } = action.payload;
      ensurePassengerDataInitialized(state, passengerType, index);
      state.passengerData[passengerType][index].firstName = firstName;
      // state.passengerData[passengerType][index].firstName = firstName;
    },

    setPassengerLastName: (state, action) => {
      const { passengerType, index, lastName } = action.payload;
      ensurePassengerDataInitialized(state, passengerType, index);
      state.passengerData[passengerType][index].lastName = lastName;
    },

    setPassengerGender: (state, action) => {
      const { passengerType, index, gender } = action.payload;
      ensurePassengerDataInitialized(state, passengerType, index);
      state.passengerData[passengerType][index].gender = gender;
    },

    setPassengerPassportNation: (state, action) => {
      const { passengerType, index, passportNation } = action.payload;
      ensurePassengerDataInitialized(state, passengerType, index);
      state.passengerData[passengerType][index].passportNation = passportNation;
    },

    setPassengerVisaInfo: (state, action) => {
      const { passengerType, index, visaInfo } = action.payload;
      ensurePassengerDataInitialized(state, passengerType, index);
      state.passengerData[passengerType][index].visaInfo = visaInfo;
    },

    setPassengerVisaLoading: (state, action) => {
      const { passengerType, index, isLoading } = action.payload;
      ensurePassengerDataInitialized(state, passengerType, index);
      state.passengerData[passengerType][index].isVisaChecking = isLoading;
    },

    setPassengerPassportNumber: (state, action) => {
      const { passengerType, index, passportNumber } = action.payload;
      ensurePassengerDataInitialized(state, passengerType, index);
      state.passengerData[passengerType][index].passportNumber = passportNumber;
    },

    setPassengerPrefix: (state, action) => {
      const { passengerType, index, prefix } = action.payload;
      ensurePassengerDataInitialized(state, passengerType, index);
      state.passengerData[passengerType][index].prefix = prefix;
    },
    setPassengerDateOfBirth: (state, action) => {
      const { passengerType, index, dateOfBirth } = action.payload;
      ensurePassengerDataInitialized(state, passengerType, index);
      state.passengerData[passengerType][index].dateOfBirth = dateOfBirth;
    },

    setPassengerDateOfExpiry: (state, action) => {
      let { passengerType, index, passportExpire } = action.payload;
      let expiryDate = new Date(passportExpire);
      expiryDate.setDate(expiryDate.getDate() + 1);

      ensurePassengerDataInitialized(state, passengerType, index);
      state.passengerData[passengerType][index].passportExpire = expiryDate
        .toISOString()
        .split("T")[0];
    },
    setPassengerFrequentFlyer: (state, action) => {
      const { passengerType, count, frequentTraveler } = action.payload;
      const index = count - 1;
      ensurePassengerDataInitialized(state, passengerType, index);
      state.passengerData[passengerType][index].frequentTraveler =
        frequentTraveler;
    },
    setPassengerAncillaries: (state, action) => {
      const { passengerType, index, updatedAncillaries } = action.payload;
      ensurePassengerDataInitialized(state, passengerType, index);

      state.passengerData[passengerType][index].ancillaries =
        updatedAncillaries;
    },
    setPassengerPassportCopy: (state, action) => {
      const { passengerType, index, passportImage } = action.payload;

      ensurePassengerDataInitialized(state, passengerType, index);

      state.passengerData = {
        ...state.passengerData,
        [passengerType]: state.passengerData[passengerType].map(
          (passenger, idx) =>
            idx === index ? { ...passenger, passportImage } : passenger
        ),
      };
    },
    setPassengerVisaCopy: (state, action) => {
      const { passengerType, index, visaImage } = action.payload;
      ensurePassengerDataInitialized(state, passengerType, index);

      state.passengerData = {
        ...state.passengerData,
        [passengerType]: state.passengerData[passengerType].map(
          (passenger, idx) =>
            idx === index ? { ...passenger, visaImage } : passenger
        ),
      };
    },
    setPassportScanValidate: (state, action) => {
      const { passengerType, index, passportScanValidate } = action.payload;
      ensurePassengerDataInitialized(state, passengerType, index);
      state.passengerData[passengerType][index].passportScanValidate =
        passportScanValidate;
    },
    setClientContact: (state, action) => {
      const { clientEmail, clientPhoneNumber } = action.payload;
      if (clientEmail !== undefined) {
        state.clientContact.clientEmail = clientEmail;
      }
      if (clientPhoneNumber !== undefined) {
        state.clientContact.clientPhoneNumber = clientPhoneNumber;
      }
    },
    updateBookingOptions: (state, action) => {
      const { sendSms, sendEmail, isFareRules, isTermsCondition } =
        action.payload;
      if (sendSms !== undefined) state.sendSms = sendSms;
      if (sendEmail !== undefined) state.sendEmail = sendEmail;
      if (isFareRules !== undefined) state.isFareRules = isFareRules;
      if (isTermsCondition !== undefined)
        state.isTermsCondition = isTermsCondition;
    },

    updateStepper: (state, action) => {
      let toastTriggered = false;

      if (!state.isFareRules || !state.isTermsCondition) {
        if (!toastTriggered) {
          toast.error("Please accept the fare rules and terms & conditions", {
            theme: "colored",
            autoClose: 2000,
            onClose: () => {
              console.error("Not bookable");
            },
          });
        }
        return;
      }

      state.firstClick = true;
      const {
        updatedTotalPassenger,
        journeyType,
        immediateIssue,
        showPassport,
        showVisa,
      } = action.payload;
      const totalPassenger = updatedTotalPassenger;

      const baseRequiredFields = [
        "dateOfBirth",
        "firstName",
        "lastName",
        "gender",
        "passportNation",
        "prefix",
        "passportExpire",
        "passportNumber",
      ];

      const immediateIssueExcludedFields = ["passportImage", "visaImage"];

      const requiredFields = immediateIssue
        ? [...baseRequiredFields, ...immediateIssueExcludedFields]
        : baseRequiredFields;

      const {
        allAdultsComplete,
        allChildrenComplete,
        allInfantsComplete,
        missingLogs,
        duplicateFound,
      } = validatePassengers(
        state.passengerData,
        requiredFields,
        totalPassenger,
        journeyType,
        showPassport,
        showVisa
      );

      if (duplicateFound) {
        toast.error("Duplicate passenger name or passport number found", {
          theme: "colored",
          autoClose: 2000,
        });
        console.error(missingLogs.join("\n"));
        return;
      }

      if (!allAdultsComplete || !allChildrenComplete || !allInfantsComplete) {
        if (!toastTriggered) {
          toast.error("Missing required information", {
            theme: "colored",
            autoClose: 2000,
          });
          toastTriggered = true;
        }
        missingLogs.forEach((log) => console.error(log));
        return;
      }

      if (allAdultsComplete && allChildrenComplete && allInfantsComplete) {
        if (state.stepper < 4) {
          state.stepper += 1;
          state.tabStepper = state.stepper;
        }
      }
    },
    nextStepperPassenger: (state, action) => {
      let toastTriggered = false;

      if (!state.isFareRules || !state.isTermsCondition) {
        if (!toastTriggered) {
          toast.error("Please accept the fare rules and terms & conditions", {
            theme: "colored",
            autoClose: 2000,
            onClose: () => {
              console.error("Not bookable");
            },
          });
        }
        return;
      }

      state.firstClick = true;
      const {
        updatedTotalPassenger,
        journeyType,
        immediateIssue,
        showPassport,
        showVisa,
      } = action.payload;
      const totalPassenger = updatedTotalPassenger;

      const baseRequiredFields = [
        "dateOfBirth",
        "firstName",
        "lastName",
        "gender",
        "passportNation",
        "prefix",
        "passportExpire",
        "passportNumber",
      ];

      const immediateIssueExcludedFields = ["passportImage", "visaImage"];

      const requiredFields = immediateIssue
        ? [...baseRequiredFields, ...immediateIssueExcludedFields]
        : baseRequiredFields;

      const {
        allAdultsComplete,
        allChildrenComplete,
        allInfantsComplete,
        missingLogs,
        duplicateFound,
      } = validatePassengers(
        state.passengerData,
        requiredFields,
        totalPassenger,
        journeyType,
        showPassport,
        showVisa
      );

      if (duplicateFound) {
        toast.error("Duplicate passenger name or passport number found", {
          theme: "colored",
          autoClose: 2000,
        });
        console.error(missingLogs.join("\n"));
        return;
      }

      if (!allAdultsComplete || !allChildrenComplete || !allInfantsComplete) {
        if (!toastTriggered) {
          toast.error("Missing required information", {
            theme: "colored",
            autoClose: 2000,
          });
          toastTriggered = true;
        }
        missingLogs.forEach((log) => console.error(log));
        return;
      }

      if (allAdultsComplete && allChildrenComplete && allInfantsComplete) {
        if (action.payload.step <= state.stepper) {
          state.tabStepper = action.payload.step;
        }
      }
    },
    nextStepper: (state) => {
      if (state.stepper < 4) {
        state.stepper += 1;
        state.tabStepper = state.stepper;
      }
    },
    selectTabStepper: (state, action) => {
      if (action.payload <= state.stepper) {
        state.tabStepper = action.payload;
      } else {
        toast.error("Please,complete the booking information first.", {
          theme: "colored",
          autoClose: 2000,
          onClose: () => {
            console.error("Error toast closed in redux");
          },
        });
        state.tabStepper = state.stepper;
      }
    },
    setPassengerDetails: (state, action) => {
      const { passengerType, index, traveler } = action.payload;
      ensurePassengerDataInitialized(state, passengerType, index);
      state.passengerData[passengerType][index] = {
        ...traveler,
      };
    },
    setPartialData: (state, action) => {
      state.partialData = action.payload;
    },
    setPartialChargeData: (state, action) => {
      state.partialChargeData = action.payload;
    },
    setPreview: (state, action) => {
      state.preview = action.payload;
    },
    setPreviewNull: (state, action) => {
      state.preview = null;
    },
    setClearAllStates: (state) => {
      state.passengerData = {
        adult: [],
        child: [],
        infant: [],
      };
      state.visaImages = [];
      state.clientContact = {
        clientEmail: "",
        clientPhoneNumber: "",
      };
      state.sendSms = false;
      state.sendEmail = false;
      state.isFareRules = true;
      state.isTermsCondition = true;
      state.stepper = 1;
      state.tabStepper = 1;
      state.firstClick = false;
      state.partialData = null;
      state.partialChargeData = null;
    },
  },
});

const validatePassengers = (
  passengerData,
  requiredFields,
  totalPassenger,
  journeyType,
  showPassport,
  showVisa
) => {
  let allAdultsComplete = true;
  let allChildrenComplete = true;
  let allInfantsComplete = true;
  let missingLogs = [];

  let nameSet = new Set();
  let passportSet = new Set();
  let duplicateFound = false;

  const getMissingFields = (passenger, type, index) => {
    const missingFields = [];

    requiredFields.forEach((field) => {
      if (
        (field === "passportImage" ||
          field === "passportNumber" ||
          field === "passportExpire") &&
        (!showPassport ||
          (journeyType === "Inbound" &&
            passenger?.passportNation?.code === "BD"))
      ) {
        return;
      }

      if (
        field === "visaImage" &&
        (!showVisa ||
          (journeyType === "Inbound" &&
            passenger?.passportNation?.code === "BD"))
      ) {
        return;
      }

      const value = passenger[field];
      if (
        !value ||
        (typeof value === "object" &&
          !(value instanceof File) &&
          Object.keys(value).length === 0)
      ) {
        missingFields.push(`${type} ${index + 1}'s ${field} is missing`);
      }
    });

    return missingFields;
  };

  const checkDuplicate = (passenger, type, index) => {
    const fullName = `${passenger.firstName} ${passenger.lastName}`.trim();
    const passportNumber = passenger.passportNumber?.trim();

    if (fullName !== "" && nameSet.has(fullName)) {
      missingLogs.push(`Duplicate name found: ${fullName} in ${type}`);
      duplicateFound = true;
    } else {
      nameSet.add(`${fullName}_${type}`);
    }

    if (passportNumber && passportSet.has(passportNumber)) {
      missingLogs.push(`Duplicate passport number found: ${passportNumber}`);
      duplicateFound = true;
    } else {
      passportSet.add(passportNumber);
    }
  };

  const validateCategory = (type, count) => {
    if (passengerData[type].length === count) {
      passengerData[type].forEach((passenger, index) => {
        const missingFields = getMissingFields(passenger, type, index);
        if (missingFields.length > 0) {
          missingLogs = missingLogs.concat(missingFields);
          if (type === "adult") allAdultsComplete = false;
          if (type === "child") allChildrenComplete = false;
          if (type === "infant") allInfantsComplete = false;
        }
        checkDuplicate(passenger, type, index);
      });
    } else {
      missingLogs.push(`${type} passengers are incomplete`);
      if (type === "adult") allAdultsComplete = false;
      if (type === "child") allChildrenComplete = false;
      if (type === "infant") allInfantsComplete = false;
    }
  };

  validateCategory("adult", totalPassenger.adultCount);
  validateCategory("child", totalPassenger.childCount);
  validateCategory("infant", totalPassenger.infantCount);

  return {
    allAdultsComplete,
    allChildrenComplete,
    allInfantsComplete,
    missingLogs,
    duplicateFound,
  };
};

export const {
  initializePassengerData,
  setPassengerFirstName,
  setPassengerLastName,
  setPassengerGender,
  setPassengerPassportNation,
  setPassengerVisaInfo,
  setPassengerVisaLoading,
  setPassengerPassportNumber,
  setPassengerPrefix,
  setPassengerDateOfBirth,
  setPassengerDateOfExpiry,
  setPassengerFrequentFlyer,
  setPassengerAncillaries,
  setPassengerPassportCopy,
  setPassengerVisaCopy,
  setPassportScanValidate,
  setClientContact,
  updateBookingOptions,
  updateStepper,
  selectTabStepper,
  nextStepper,
  nextStepperPassenger,
  setPassengerDetails,
  setClearAllStates,
  reissuePassengerData,
  setPartialData,
  setPartialChargeData,
  setPreview,
  setPreviewNull,
} = flightBookingSlice.actions;

export default flightBookingSlice.reducer;
