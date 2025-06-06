import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  crrItenary: 0,
  advancedFlightData: null,
  advnacedModifiedBrands: [],
  selectedSeats: [],
  splitModifiedBrands: [],
  selectedSplitBrandsRed: [],
  alreadyButtonClicked: false,
  airPriceFlag: false,
  airPriceBody: {},
  accountPop: false,
  afterSearchState: null,
  shouldCallAirPrice: "",
  bookable: "",
  updateFareRules: [],
  key: null,
  advancedKey: null,
  filterValue: {},
  appliedFilters: [],
  cmsData: {},
  tabTypeRed: "selectfare",
  modifycheck: false,
  flightTab: "",
  isBookable: false,
  advancedFilter: "airlines",
  viewButtonShow: false,
};

const flightAfterSlice = createSlice({
  name: "flightafter",
  initialState,
  reducers: {
    setKey(state, action) {
      state.key = action.payload;
    },
    setCrrItenary(state, action) {
      state.crrItenary = action.payload;
    },
    setTabType(state, action) {
      state.tabTypeRed = action.payload;
    },
    setAdvancedKey(state, action) {
      state.advancedKey = action.payload;
    },
    setKeyNull(state) {
      state.key = null;
      state.advancedKey = null;
    },
    setFilterValue(state, action) {
      state.filterValue = action.payload;
    },
    setAppliedFilters(state, action) {
      state.appliedFilters = action.payload;
    },
    setAdvancedFilter(state, action) {
      state.advancedFilter = action?.payload;
    },
    setCmsData(state, action) {
      state.cmsData = action.payload;
    },
    setAirPriceBody(state, action) {
      state.airPriceFlag = true;
      state.airPriceBody = action.payload;
    },
    setAdvancedFlightData(state, action) {
      state.advancedFlightData = action.payload;
    },
    setAdvancedModifiedBrands(state, action) {
      state.advnacedModifiedBrands = action.payload;
    },
    setViewButtonShow(state, action) {
      state.viewButtonShow = action.payload;
    },
    setAlreadyButtonClicked(state, action) {
      state.alreadyButtonClicked = action?.payload;
    },
    setSelectedSeats(state, action) {
      state.selectedSeats = action.payload;
    },
    setModifiedSplitBarnds(state, action) {
      state.splitModifiedBrands = action.payload;
    },
    setSelectedSplitBrandsRed(state, action) {
      state.selectedSplitBrandsRed = action.payload;
    },
    setPriceFlagFalse(state) {
      state.airPriceFlag = false;
    },
    setModifyCheck(state, action) {
      state.modifycheck = action.payload;
    },
    setAccountPop(state, action) {
      state.accountPop = action.payload;
    },
    setShouldCallAirPrice(state, action) {
      state.shouldCallAirPrice = action.payload;
    },
    setBookable(state, action) {
      state.bookable = action.payload;
    },
    setAllFareRules(state, action) {
      state.updateFareRules = action.payload;
    },
    setUpdateFareRules(state, action) {
      state.updateFareRules = action.payload;
    },
    setFlightTab(state, action) {
      state.flightTab = action.payload;
    },
    setIsBookable(state, action) {
      state.isBookable = action.payload;
    },
  },
});

export const {
  setKey,
  setAdvancedKey,
  setKeyNull,
  setFilterValue,
  setAppliedFilters,
  setCmsData,
  setAirPriceBody,
  setPriceFlagFalse,
  setModifyCheck,
  setAccountPop,
  setShouldCallAirPrice,
  setBookable,
  setAdvancedFilter,
  setAllFareRules,
  setUpdateFareRules,
  setFlightTab,
  setIsBookable,
  setAdvancedFlightData,
  setAdvancedModifiedBrands,
  setSelectedSeats,
  setAlreadyButtonClicked,
  setViewButtonShow,
  setCrrItenary,
  setModifiedSplitBarnds,
  setSelectedSplitBrandsRed,
  setTabType,
} = flightAfterSlice.actions;

export default flightAfterSlice.reducer;
