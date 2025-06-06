import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const ancillariesSlice = createSlice({
  name: "ancillaries",
  initialState,
  reducers: {
    setAncillary: (state, action) => {
      const { index, route, pax, ancillary } = action.payload;
      if (!ancillary || !ancillary.label || !ancillary.value) {
        console.error("Invalid ancillary data in action payload:", ancillary);
        return;
      }

      // Find the entry with the same index, route, and pax
      const existingEntry = state.find(
        (item) =>
          item.index === index &&
          item.route.departure === route.departure &&
          item.route.arrival === route.arrival &&
          item.pax.firstName === pax.firstName &&
          item.pax.lastName === pax.lastName
      );

      if (existingEntry) {
        const existingAncillary = existingEntry.ancillaries?.find(
          (a) => a.label === ancillary.label
        );

        if (existingAncillary) {
          existingAncillary.value = ancillary.value;
          existingAncillary.remarks = ancillary.remarks;
          existingAncillary.remarksValue = ancillary.remarksValue;
        } else {
          existingEntry.ancillaries.push({
            label: ancillary.label,
            value: ancillary.value,
            remarks: ancillary.remarks,
            remarksValue: ancillary.remarksValue,
          });
        }
      } else {
        state.push({
          index,
          route,
          pax,
          ancillaries: [
            {
              label: ancillary.label,
              value: ancillary.value,
              remarks: ancillary.remarks,
              remarksValue: ancillary.remarksValue,
            },
          ],
        });
      }
    },
    // New reducer for removing an ancillary
    removeAncillary: (state, action) => {
      const { index, route, pax, label } = action.payload;
      const existingEntry = state.find(
        (item) =>
          item.index === index &&
          item.route.departure === route.departure &&
          item.route.arrival === route.arrival &&
          item.pax.firstName === pax.firstName &&
          item.pax.lastName === pax.lastName
      );

      if (existingEntry) {
        // Filter out the ancillary with the matching label
        existingEntry.ancillaries = existingEntry.ancillaries.filter(
          (a) => a.label !== label
        );

        // Optionally, remove the entry if there are no ancillaries left
        if (existingEntry.ancillaries.length === 0) {
          const entryIndex = state.indexOf(existingEntry);
          state.splice(entryIndex, 1);
        }
      }
    },

    // New reducer for removing an ancillary
    removeSingleAncillary: (state, action) => {
      const { index, route, pax } = action.payload;
      const existingEntryIndex = state.findIndex(
        (item) =>
          item.index === index &&
          item.route.departure === route.departure &&
          item.route.arrival === route.arrival &&
          item.pax.firstName === pax.firstName &&
          item.pax.lastName === pax.lastName
      );

      if (existingEntryIndex !== -1) {
        // Remove the matching entry from the state
        state.splice(existingEntryIndex, 1);
      }
    },

    clearAncillaries: (state) => {
      return [];
    },
  },
});

export const {
  setAncillary,
  removeAncillary,
  removeSingleAncillary,
  clearAncillaries,
} = ancillariesSlice.actions;
export default ancillariesSlice.reducer;
