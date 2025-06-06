import { configureStore } from "@reduxjs/toolkit";
import flightReducer from "../component/FlightSearchBox/flightSearchSlice.js";
import flightAfterReducer from "../component/FlightSearchBox/flighAfterSearchSlice.js";
import registerReducer from "../component/Register/registerSlice.js";
import agentRegReducer from "../features/agentRegistrationSlice.js";
import registration from "../features/registrationSlice.js";
import flightBookingReducer from "../component/AirBooking/airbookingSlice.js";
import filterReducer from "../component/FlightAfterSearch/components/filterSlice.js";
import branchReducer from "../component/Branch/branchSlice.js";
import ancillariesSlice from "../component/AirBooking/components/ancillariesSlice.js";

const store = configureStore({
  reducer: {
    flight: flightReducer,
    flightAfter: flightAfterReducer,
    register: registerReducer,
    agentRegistration: agentRegReducer,
    flightBooking: flightBookingReducer,
    filter: filterReducer,
    addBranch: branchReducer,
    ancillaries: ancillariesSlice,
    registration: registration,
  },
});

export default store;
