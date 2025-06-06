import { createSlice } from "@reduxjs/toolkit";

const agentReg = {
  user: {
    id: "",
    uid: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    createdAt: "",
    status: "",
    updatedAt: "",
    verifiedAt: null,
    agentId: "",
    emailVerified: false,
    phoneVerified: false,
    agent: {
      id: "",
      uid: null,
      agentId: "",
      gender: "",
      dateOfBirth: "",
      whatsappNumber: "",
      nationality: "Bangladesh",
      userId: null,
      createdAt: "",
      updatedAt: "",
      ownerDocuments: {
        id: "",
        uid: null,
        agentId: "",
        createdAt: "",
        updatedAt: "",
        profileImage: null,
        nidFrontImage: null,
        nidBackImage: null,
        tinImage: null,
        signatureImage: null,
      },
      agencyInformation: {
        id: "",
        uid: null,
        agentId: "",
        agencyName: "",
        country: "",
        agencyType: "",
        phoneNumber: "",
        whatsappNumber: "",
        email: "",
        establishedDate: "",
        employeeCount: "",
        createdAt: "",
        updatedAt: "",
        documents: {
          id: "",
          uid: null,
          agencyId: "",
          logoImage: null,
          utilityImage: null,
          tradeImage: null,
          signBoardImage: null,
          createdAt: "",
          updatedAt: "",
        },
        certificates: {
          id: "",
          uid: null,
          agencyId: "",
          civilImage: null,
          iataImage: null,
          toabImage: null,
          atabImage: null,
          incorporationImage: null,
          createdAt: "",
          updatedAt: "",
        },
        addressDetails: {
          id: "",
          country: "",

          // for international
          state: "",
          cityName: "",
          policeStationZone: "",

          // for bd
          division: "",
          district: "",
          upazila: "",

          postalCode: "",
          address: "",
          createdAt: "",
          updatedAt: "",
        },
      },
      concernPerson: {
        id: "",
        uid: null,
        agentId: "",
        name: "",
        gender: "",
        dateOfBirth: "",
        nationality: "",
        email: "",
        phoneNumber: "",
        whatsappNumber: "",
        relation: "",
        othersRelation: "",
        nidFrontImage: null,
        nidBackImage: null,
        createdAt: "",
        updatedAt: "",
      },
      partners: [],
      submitInformation: [
        { createdAt: "", updatedAt: "", id: "", submittedAt: "" },
      ],
    },
  },
  metadata: { redirect: "", step: null },
  correctionFields: [],

  // extra states
  password: "",
  confirmPassword: "",
  agreeTermsCondition: false,
  sharingInfo: false,
  isActive: 0,
  isOpen: false,
  pageNumber: 1,
  accessToken: "",

  finalSubmit: false,
  cameFrom: "",
};

const initialState = { agentReg, agentLogin: { isOpen: false } };

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setAgentReg: (state, action) => {
      if (action.payload.field) {
        const { field, value } = action.payload;
        state.agentReg[field] = value;
      } else {
        state.agentReg = action.payload;
      }
    },

    setUser: (state, action) => {
      if (action.payload.field) {
        const { field, value } = action.payload;
        state.agentReg.user[field] = value;
      }
    },

    setAgent: (state, action) => {
      if (action.payload.field) {
        const { field, value } = action.payload;
        state.agentReg.user.agent[field] = value;
      } else {
        state.agentReg.user.agent = action.payload;
      }
    },

    setAgencyInformation: (state, action) => {
      if (action.payload.field) {
        const { field, value } = action.payload;
        state.agentReg.user.agent.agencyInformation[field] = value;
      } else {
        state.agentReg.user.agent.agencyInformation = action.payload;
      }
    },

    setAddressDetails: (state, action) => {
      if (action.payload.field) {
        const { field, value } = action.payload;
        state.agentReg.user.agent.agencyInformation.addressDetails[field] =
          value;
      } else {
        state.agentReg.user.agent.agencyInformation.addressDetails =
          action.payload;
      }
    },

    setOwnerDocuments: (state, action) => {
      if (action.payload.field) {
        const { field, value } = action.payload;
        state.agentReg.user.agent.ownerDocuments[field] = value;
      } else {
        state.agentReg.user.agent.ownerDocuments = action.payload;
      }
    },

    setPartners: (state, action) => {
      state.agentReg.user.agent.partners = action.payload;
    },

    setConcernPerson: (state, action) => {
      if (action.payload.field) {
        const { field, value } = action.payload;
        state.agentReg.user.agent.concernPerson[field] = value;
      } else {
        state.agentReg.user.agent.concernPerson = action.payload;
      }
    },

    setAgentLogin: (state, action) => {
      state.agentLogin = action.payload;
    },

    resetAgentReg: (state) => {
      state.agentReg = agentReg;
    },

    setSessionExpired: (state) => {
      state.agentReg = agentReg;
      state.agentLogin = { isOpen: true };
    },
  },
});

export const {
  setAgentReg,
  setAgentLogin,
  setUser,
  setAgent,
  setAgencyInformation,
  setAddressDetails,
  setOwnerDocuments,
  setPartners,
  setConcernPerson,
  resetAgentReg,
  setSessionExpired,
} = registrationSlice.actions;
export default registrationSlice.reducer;
