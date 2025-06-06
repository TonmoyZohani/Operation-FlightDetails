import { createSlice } from "@reduxjs/toolkit";
import { initialFromData } from "../../shared/StaticData/flightData";
import { addDays, subDays } from "date-fns";
import moment from "moment";

const now = new Date();
const formatDate = (date) => moment(date).format("YYYY-MM-DD");

const initialFromDates = [...new Array(5)].map((_, index) =>
  formatDate(addDays(now, index * 3 + 1))
);
const initialToDates = [...new Array(5)].map((_, index) =>
  formatDate(addDays(now, index * 3 + 3))
);

const initialState = {
  adultCount: 1,
  childCount: [],
  infantCount: 0,
  value: "oneway",
  selectedAirlines: [],
  openTravel: false,
  cabin: "Economy",
  regularFare: false,
  studentFare: false,
  umrahFare: false,
  seamanFare: false,
  isLoading: false,
  isSameRoute: false,
  fromSegmentLists: [
    {
      id: 802,
      code: "DAC",
      name: "Hazrat Shahjalal Intl Airport",
      cityCode: "DAC",
      cityName: "Dhaka",
      countryName: "BANGLADESH",
      countryCode: "BD",
      address: "Dhaka",
    },
    {
      id: 4402,
      code: "CXB",
      name: "Cox's Bazar Airport",
      cityCode: "CXB",
      cityName: "Cox's Bazar",
      countryName: "BANGLADESH",
      countryCode: "BD",
      address: "Cox's Bazar",
    },
  ],
  toSegmentLists: [
    {
      id: 4402,
      code: "CXB",
      name: "Cox's Bazar Airport",
      cityCode: "CXB",
      cityName: "Cox's Bazar",
      countryName: "BANGLADESH",
      countryCode: "BD",
      address: "Cox's Bazar",
    },
    {
      id: 5,
      code: "JFK",
      name: "John F Kennedy Intl ",
      cityCode: "NYC",
      cityName: "New York",
      countryName: "UNITED STATES",
      countryCode: "US",
      address: "New York",
    },
  ],
  departureDates: initialFromDates,
  arrivalDates: initialToDates,
  segmentCount: 1,
  searchOptions: {
    fareType: "",
    searchType: "regular",
  },
  searchType: "regular",
  fareType: "regularFare",
  refetch: true,
};

const flightSlice = createSlice({
  name: "flight",
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    incrementAdult(state) {
      if (
        state.adultCount <
        9 - (state.childCount.length + state.infantCount)
      ) {
        state.adultCount += 1;
      }
    },
    decrementAdult(state) {
      if (state.adultCount > 1) {
        state.adultCount -= 1;
        if (state.infantCount > state.adultCount) {
          state.infantCount = state.adultCount;
        }
      }
    },

    incrementChild(state) {
      if (
        state.childCount.length <
        9 - (state.adultCount + state.infantCount)
      ) {
        state.childCount.push(5);
      }
    },
    setChildAge(state, action) {
      const { index, age } = action.payload;
      if (index < state.childCount.length) {
        state.childCount[index] = age;
      }
    },
    decrementChild(state) {
      if (state.childCount.length > 0) {
        state.childCount.pop();
      }
    },
    incrementInfant(state) {
      if (
        state.infantCount <
        9 - (state.adultCount + state.childCount.length)
      ) {
        if (state.infantCount < state.adultCount) {
          state.infantCount += 1;
        }
      }
    },
    decrementInfant(state) {
      if (state.infantCount > 0) {
        state.infantCount -= 1;
      }
    },
    setOpenTravel(state, action) {
      state.openTravel = action.payload;
    },
    setSelectedAirlines(state, action) {
      state.selectedAirlines = action.payload;
    },
    setCabin(state, action) {
      state.cabin = action.payload;
    },
    setSegmentCount(state, action) {
      state.segmentCount = action.payload;
    },
    incrementDate(state) {
      const newDepartureDate = formatDate(
        addDays(new Date(state.departureDates[0]), 1)
      );
      const newArrivalDate = formatDate(
        addDays(new Date(state.arrivalDates[0]), 1)
      );
      state.departureDates[0] = newDepartureDate;
      state.arrivalDates[0] = newArrivalDate;
    },
    decrementDate(state) {
      const newDepartureDate = formatDate(
        subDays(new Date(state.departureDates[0]), 1)
      );
      const newArrivalDate = formatDate(
        subDays(new Date(state.arrivalDates[0]), 1)
      );
      state.departureDates[0] = newDepartureDate;
      state.arrivalDates[0] = newArrivalDate;
    },
    updateFromSegmentList(state, action) {
      const { index, item } = action.payload;
      if (index >= 0 && index < state.fromSegmentLists.length) {
        state.fromSegmentLists[index] = item;
      }
    },
    updateMobileFromSegmentList(state, action) {
      state.fromSegmentLists = [action.payload];
    },
    updateMobileToSegmentList(state, action) {
      state.toSegmentLists = [action.payload];
    },
    updateMobileDepartureDate(state, action) {
      state.departureDates = [action.payload];
    },
    updateMobileArrivalDate(state, action) {
      state.arrivalDates = [action.payload];
    },
    updateToSegmentList(state, action) {
      const { index, item } = action.payload;
      if (index >= 0 && index < state.toSegmentLists.length) {
        state.toSegmentLists[index] = item;
        if (index + 1 < state.fromSegmentLists.length) {
          state.fromSegmentLists[index + 1] = item;
        }
      }
    },
    incrementSegment(state, action) {
      if (state.segmentCount < 5) {
        state.segmentCount += 1;

        const lastToSegment =
          state.toSegmentLists[state.toSegmentLists.length - 1];
        state.fromSegmentLists.push(lastToSegment);

        let newIndex = state.segmentCount - 1;

        if (initialFromData[newIndex]?.code === lastToSegment.code) {
          newIndex += 1;
        }

        if (newIndex < initialFromData.length) {
          state.toSegmentLists.push(initialFromData[newIndex]);
        }

        state.nextSegmentIndex = newIndex;
      }
    },
    decrementSegment(state, action) {
      const { index, segmentCount } = action.payload;

      if (index === 1 && segmentCount === 2) {
        state.value = "return";
        state.segmentCount = 1;
      }

      if (segmentCount > 2 && index >= 0 && index < segmentCount) {
        state.fromSegmentLists.splice(index, 1);
        state.toSegmentLists.splice(index, 1);
        state.segmentCount -= 1;
      }
    },
    setDepartureDate(state, action) {
      const { date, index } = action.payload;
      state.departureDates[index] = date;
      state.departureDates[index + 1] = formatDate(addDays(new Date(date), 2));
      state.arrivalDates[index] = formatDate(addDays(new Date(date), 2));
    },
    setArrivalDate(state, action) {
      const { date, index } = action.payload;
      state.arrivalDates[index] = date;
    },
    setValue(state, action) {
      state.value = action.payload;
    },
    setSearchOptions(state, action) {
      const { name, value } = action.payload;

      state.searchOptions = {
        ...state.searchOptions,
        [name]: value,
      };

      if (name === "searchType" && value === "advanced") {
        state.searchOptions.fareType = "";
      }

      if (name === "fareType" && value !== "") {
        state.childCount = [];
        state.infantCount = 0;
      }
    },
    setSearchType(state, action) {
      state.searchType = action.payload;
    },
    setFareType(state, action) {
      if (action.payload !== "regularFare" || action.payload !== "umrahFare") {
        state.childCount = [];
        state.infantCount = 0;
      }

      state.fareType = action.payload;
    },
    handleSwapFunc(state, action) {
      const index = action?.payload;

      if (
        index < 0 ||
        index >= state.fromSegmentLists.length ||
        index >= state.toSegmentLists.length
      ) {
        console.error("Invalid index for swapping");
        return;
      }

      const tempFromSegmentLists = [...state.fromSegmentLists];
      const tempToSegmentLists = [...state.toSegmentLists];

      [tempFromSegmentLists[index], tempToSegmentLists[index]] = [
        tempToSegmentLists[index],
        tempFromSegmentLists[index],
      ];

      state.fromSegmentLists = tempFromSegmentLists;
      state.toSegmentLists = tempToSegmentLists;
    },

    modifySearchState(state, action) {
      const {
        adultCount,
        childCount,
        infantCount,
        cabin,
        vendorPref,
        studentFare,
        selectedAirlines,
        umrahFare,
        seamanFare,
        searchOptions,
        fromSegmentLists,
        toSegmentLists,
        departureDates,
        arrivalDates,
        value,
      } = action?.payload;

      state.adultCount = adultCount;
      state.childCount = childCount;
      state.infantCount = infantCount;
      state.cabin = cabin;
      state.vendorPref = vendorPref;
      state.studentFare = studentFare;
      state.selectedAirlines = selectedAirlines;
      state.umrahFare = umrahFare;
      state.seamanFare = seamanFare;
      state.fromSegmentLists = fromSegmentLists;
      state.toSegmentLists = toSegmentLists;
      state.departureDates = departureDates;
      state.arrivalDates = arrivalDates;
      state.value = value;
    },
    setRefetch(state, action) {
      state.refetch = action?.payload;
    },
  },
});

export const {
  incrementAdult,
  decrementAdult,
  incrementChild,
  decrementChild,
  incrementInfant,
  decrementInfant,
  setOpenTravel,
  setSelectedAirlines,
  setCabin,
  setSegmentList,
  setSegmentCount,
  setValue,
  updateFromSegmentList,
  updateMobileFromSegmentList,
  updateToSegmentList,
  updateMobileToSegmentList,
  setDepartureDate,
  updateMobileDepartureDate,
  updateMobileArrivalDate,
  setArrivalDate,
  incrementSegment,
  decrementSegment,
  setSearchOptions,
  setIsLoading,
  incrementDate,
  decrementDate,
  handleSwapFunc,
  modifySearchState,
  setChildAge,
  setSearchType,
  setFareType,
  setRefetch,
} = flightSlice.actions;

export default flightSlice.reducer;
