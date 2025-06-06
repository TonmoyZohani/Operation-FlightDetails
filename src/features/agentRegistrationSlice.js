import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  agent: {
    // Aditional States start
    previousEmail: "",
    previousPhone: "",
    isEditEmail: false,
    isEditPhone: false,
    // isFinalSubmit: 0,
    districtId: "",
    divisionId: "",
    // Aditional States end

    isOpen: false,
    finalSubmit: 0,
    id: null,
    progress: 0,
    pageNumber: 1,
    accessToken: "",

    //  Step 1 ---- General Information
    // agencyName: "",
    // agencyType: "",
    // agreeTermsCondition: false,
    // confirmPassword: "",
    // dateOfBirth: "",
    // email: "",
    // firstName: "",
    // gender: "",
    // lastName: "",
    // nationality: "Bangladesh",
    // password: "",
    // phone: "",
    // sharingInfo: false,
    // whatsappNumber: "",

    firstName: "Kamrul Hasan",
    lastName: "Antor",
    gender: "male",
    dateOfBirth: "1991-08-21",
    nationality: "Bangladesh",
    phone: "8801975429584",
    whatsappNumber: "8801975429584",
    agencyType: "partnership",
    agencyName: "Fly Far Ladies",
    email: "kamrul@flyfar.tech",
    // email: "kamrulhasan.antor95@gmail.com",
    password: "Az12345@",
    confirmPassword: "Az12345@",
    agreeTermsCondition: true,
    sharingInfo: true,

    //  Step 2 ---- Verification
    emailVerified: false,
    phoneVerified: false,
    isActive: 0,
    createdAt: null,

    //  Step 3 and 4 ---- Owner Information and Owner Documents

    ownership: {
      propietorship: [],
      partnership: [],
      limited: [],
    },

    //  Step 5 ---- Company Information
    establishedDate: "",
    employeeCount: "",
    country: "Bangladesh",
    state: "",
    city: "",
    zone: "",
    postalCode: "",
    address: "",
    agencyEmail: "",
    agencyPhone: "",
    agencyWhatsapp: "",
    isIataProvide: 0,
    isToabProvide: 0,
    isAtabProvide: 0,
    isAviationCertificateProvide: 0,

    //  Step 6 ---- Company Documents
    agencyLogo: null,
    utilitiesBill: null,
    signBoard: null,
    tradeLicense: null,
    aviationCertificate: null,
    iataCertificate: null,
    toabCertificate: null,
    atabCertificate: null,
    incorporationCertificate: null,

    //  Step 7 ---- Concern Person Information
    personName: "",
    personGender: "",
    personDob: "",
    personNationality: "Bangladesh",
    personRelation: "",
    personNumber: "",
    personEmail: "",
    personWhatsappNumber: "",
    personAddress: "",
    // personUtilityBill: null,
    // personTin: null,
    personNidFront: null,
    personNidBack: null,
  },

  agentLogin: { isOpen: false },
};

const agentRegistrationSlice = createSlice({
  name: "agentRegister",
  initialState,
  reducers: {
    setAgentData: (state, action) => {
      if (action.payload.field) {
        const { field, value } = action.payload;
        state.agent[field] = value;
      } else {
        state.agent = action.payload;
      }
    },

    setAgentLogin: (state, action) => {
      state.agentLogin = action.payload;
    },

    resetAgentState() {
      return initialState;
    },
  },
});

export const { setAgentData, setAgentLogin, resetAgentState } =
  agentRegistrationSlice.actions;
export default agentRegistrationSlice.reducer;
