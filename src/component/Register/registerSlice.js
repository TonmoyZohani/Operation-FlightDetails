import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  progress: 0,
  pageNumber: 1,

  // general info
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeTermsCondition: 0,
  sharingInfo: 0,

  nid: null,

  otp: null,

  // company info
  company: null,
  address: null,
  city: null,
  state: null,
  postalCode: null,
  country: null,
  tinNumber: null,
  tradeLicenseNumber: null,
  tradeLicenseExpireDate: null,
  whatsAppNumber: null,
  whatsAppCheck: false,

  // required docs
  nidImage: null,
  tradeImage: null,
  tinImage: null,
  nidImageFile: null,
  tinImageFile: null,
  tradeImageFile: null,
  aviationImage: null,
  companyImage: null,
  signboardImage: null,
  officeImageOne: null,
  officeImageTwo: null,

  // login info
  // email: null,
  // password: null,
  // confirmPassword: null,

  // extra
  phoneVerified: false,
  emailVerified: false,
  isTerms: false,
  isShareInfo: false,

  district: null,
  agentId: null,
  primaryColor: null,
  secondaryColor: null,
  thirdColor: null,
  agentFare: 1,
  clientFare: 0,
  commissionFare: 0,
  joinAt: null,

  openDob: false,
  openTradeExp: false,

  signUpdrawerOpen: false,
  loginDrawerOpen: false,
  isLoggedIn: false,
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setUserDetails(state, action) {
      const {
        id,
        pageNumber,
        phoneVerified,
        firstName,
        lastName,
        gender,
        nid,
        dateOfBirth,
        company,
        city,
        country,
        stateState,
        postalCode,
        address,
        whatsAppNumber,
        nidImage,
        tinImage,
        tradeImage,
      } = action.payload;
      state.id = id;
      state.pageNumber = pageNumber;
      state.phoneVerified = phoneVerified;
      state.firstName = firstName;
      state.lastName = lastName;
      state.gender = gender;
      state.nid = nid;
      state.dateOfBirth = dateOfBirth;
      state.company = company;
      state.country = country;
      state.state = stateState;
      state.city = city;
      state.postalCode = postalCode;
      state.address = address;
      state.whatsAppNumber = whatsAppNumber;
      state.nidImage = nidImage;
      state.tinImage = tinImage;
      state.tradeImage = tradeImage;
    },
    setPhone(state, action) {
      state.phone = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setId(state, action) {
      state.id = action.payload;
    },
    setFirstName(state, action) {
      state.firstName = action.payload;
    },
    setLastName(state, action) {
      state.lastName = action.payload;
    },
    setGender(state, action) {
      state.gender = action.payload;
    },
    setNid(state, action) {
      state.nid = action.payload;
    },
    setDateOfBirth(state, action) {
      const selectedDate = new Date(action.payload);
      const formattedDate = selectedDate.toISOString().split("T")[0];
      state.dateOfBirth = formattedDate;
    },
    setPageNumber(state, action) {
      state.pageNumber = action.payload;
    },
    setAgencyName(state, action) {
      state.company = action.payload;
    },
    setCountry(state, action) {
      state.country = action.payload;
    },
    setState(state, action) {
      state.state = action.payload;
    },
    setPostalCode(state, action) {
      state.postalCode = action.payload;
    },
    setCity(state, action) {
      state.city = action.payload;
    },
    setAddress(state, action) {
      state.address = action.payload;
    },
    setWhatsAppNum(state, action) {
      state.whatsAppNumber = action.payload;
    },
    setPhoneVerify(state, action) {
      state.phoneVerified = action.payload;
    },
    setEmailVerify(state, action) {
      state.emailVerified = action.payload;
    },
    setNidFile(state, action) {
      state.nidImage = action.payload;
      if (action.payload) {
        const imageUrl = URL.createObjectURL(action?.payload);
        state.nidImageFile = imageUrl;
      }
    },
    setTinFile(state, action) {
      state.tinImage = action.payload;
      if (action.payload) {
        const imageUrl = URL.createObjectURL(action?.payload);
        state.tinImageFile = imageUrl;
      }
    },
    setTradeFile(state, action) {
      state.tradeImage = action.payload;
      if (action.payload) {
        const imageUrl = URL.createObjectURL(action?.payload);
        state.tradeImageFile = imageUrl;
      }
    },
    setSignUpDrawerOpen(state, action) {
      state.signUpdrawerOpen = action.payload;
    },
    setLoginDrawerOpen(state, action) {
      state.loginDrawerOpen = action.payload;
    },
    setWhatsAppCheck(state, action) {
      state.whatsAppCheck = action.payload;
    },
    setIsLoggedIn(state, action) {
      state.isLoggedIn = action?.payload;
    },
  },
});

export const {
  setEmail,
  setPhone,
  setId,
  setFirstName,
  setLastName,
  setNid,
  setGender,
  setDateOfBirth,
  setAgencyName,
  setCountry,
  setState,
  setCity,
  setAddress,
  setPostalCode,
  setWhatsAppNum,
  setPageNumber,
  setPhoneVerify,
  setEmailVerify,
  setNidFile,
  setTinFile,
  setTradeFile,
  setUserDetails,
  setSignUpDrawerOpen,
  setLoginDrawerOpen,
  setWhatsAppCheck,
  setIsLoggedIn,
} = registerSlice.actions;

export default registerSlice.reducer;
