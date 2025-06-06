import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  branch: {
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    personalEmail: "",
    nationality: "",
    personalPhone: "",
    whatsappNumber: "",

    wingType: "branch",
    country: "",
    city: "",
    division: "",
    district: "",
    upazilla: "",
    postCode: null,
    location: "",

    contactEmail: "",
    contactNumber: "",
    contactWhatsappNumber: "",

    email: "",
    phone: "",
    password: "",

    photo: null,
    officeImage: null,
    officeSignboardImage: null,
    utilityTin: null,
    nidFront: null,
    nidBack: null,
    divisionId: "",
    districtId: "",
  },
};

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    setWingData: (state, action) => {
      if (action.payload.field) {
        const { field, value } = action.payload;

        state.branch[field] = value;
      } else {
        state.branch = action.payload;
      }
    },

    resetWingState() {
      return initialState;
    },
  },
});

export const { setWingData, resetWingState } = branchSlice.actions;
export default branchSlice.reducer;
