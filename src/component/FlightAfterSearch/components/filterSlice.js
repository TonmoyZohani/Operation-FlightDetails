import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: {
    popular: null,
    stop: null,
    price: { min: 0, max: 100000 },
    rating: null,
    fareType: null,
    departTime: { start: "0:00", end: "24:00" },
    arrivalTime: { start: "0:00", end: "24:00" },
    layoverTime: { start: "0:00", end: "72:00" },
    baggages: [],
    airlines: [],
    layoverAirports: [],
  },
  filteredItems: [],
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    // setFilter(state, action) {
    //   const { filterType, value } = action.payload;

    //   state.filters[filterType] = value;

    //   state.filteredItems = state.filteredItems.filter(
    //     (item) => item.filterType !== filterType
    //   );

    //   // Add the new filter if it meets the criteria
    //   if (
    //     value !== null &&
    //     value !== "" &&
    //     (filterType === "price"
    //       ? typeof value === "object" &&
    //         value.min !== undefined &&
    //         value.max !== undefined
    //       : typeof value !== "object" || (value.start && value.end))
    //   ) {
    //     state.filteredItems.push({ filterType, value });
    //   }
    // },

    setFilter(state, action) {
      const { filterType, value } = action.payload;

      // Update the filter in the state
      state.filters[filterType] = value;

      // Remove the existing filter of the same type from filteredItems
      state.filteredItems = state.filteredItems.filter(
        (item) => item.filterType !== filterType
      );

      // Determine if the filter should be added
      let shouldPush = false;

      if (filterType === "baggages") {
        // For 'baggages', always push if value is an array
        shouldPush = Array.isArray(value) && value.length > 0;
      } else if (filterType === "layoverAirports") {
        // For 'layouver airports', always push if value is an array
        shouldPush = Array.isArray(value) && value.length > 0;
      } else if (filterType === "airlines") {
        // For 'airlines', always push if value is an array
        shouldPush = Array.isArray(value) && value.length > 0;
      } else if (filterType === "price") {
        // For 'price', value must be an object with min and max
        shouldPush =
          typeof value === "object" &&
          value.min !== undefined &&
          value.max !== undefined;
      } else {
        // For other types, value must not be null or empty and must have required properties
        shouldPush =
          value !== null &&
          value !== "" &&
          (typeof value !== "object" || (value.start && value.end));
      }

      if (shouldPush) {
        state.filteredItems.push({ filterType, value });
      }
    },

    removeFilter(state, action) {
      const filterType = action.payload;

      // Reset the specific filter to its initial state
      state.filters[filterType] =
        filterType === "price"
          ? { min: 0, max: 100000 }
          : filterType === "departTime" ||
            filterType === "arrivalTime" ||
            filterType === "layoverTime"
          ? { start: "0:00", end: "24:00" }
          : filterType === "baggages"
          ? []
          : filterType === "airlines"
          ? []
          : filterType === "layoverAirports"
          ? []
          : null;

      // Remove the filter from filteredItems
      state.filteredItems = state.filteredItems.filter(
        (item) => item.filterType !== filterType
      );
    },

    clearAllFilters(state) {
      // Reset all filters to their initial state
      Object.keys(state.filters).forEach((key) => {
        state.filters[key] =
          key === "price"
            ? { min: 0, max: 1000 }
            : key === "departTime" || key === "arrivalTime"
            ? { start: "0:00", end: "24:00" }
            : key === "layoverTime"
            ? { start: "0:00", end: "72:00" }
            : key === "baggages"
            ? []
            : key === "airlines"
            ? []
            : key === "layoverAirports"
            ? []
            : null;
      });
      state.filteredItems = [];
    },
  },
});

export const { setFilter, removeFilter, clearAllFilters } = filterSlice.actions;

export default filterSlice.reducer;
