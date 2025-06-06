import { Box } from "@material-ui/core";
import { Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "react-date-range";
import useWindowSize from "../../shared/common/useWindowSize";
import { useLocation } from "react-router-dom";

const CustomCalendar = ({
  date,
  title = "",
  minDate,
  maxDate,
  handleChange,
}) => {
  const { isMobile } = useWindowSize();
  const location = useLocation();
  const isAirBooking = location.pathname === "/dashboard/airbooking";
  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState({
    day: "",
    month: "",
    year: "",
  });

  const handleChangeDate = (e, nextRef, maxLength) => {
    const { name, value: strValue } = e.target;

    // Prevent non-numeric input
    if (!/^\d*$/.test(strValue)) return;

    // Ensure value remains a string to keep leading zeros
    let value = strValue;

    // Create a new date object without converting to a number
    let newDate = { ...selectedDate, [name]: value };

    if (name === "day") {
      if (Number(value) > 31) return;

      if (selectedDate?.month === "02") {
        const isLeapYear =
          (Number(selectedDate.year) % 4 === 0 &&
            Number(selectedDate.year) % 100 !== 0) ||
          Number(selectedDate.year) % 400 === 0;
        if (Number(value) > (isLeapYear ? 29 : 28)) return;
      }

      if (
        ["04", "06", "09", "11"].includes(selectedDate?.month) &&
        Number(value) > 30
      ) {
        return;
      }

      newDate.day = value;

      if (strValue.length >= maxLength) {
        nextRef.current.focus();
      }
    }

    if (name === "month") {
      if (Number(value) > 12) return;
      newDate.month = value;

      if (selectedDate?.day) {
        if (value === "02") {
          const isLeapYear =
            (Number(selectedDate.year) % 4 === 0 &&
              Number(selectedDate.year) % 100 !== 0) ||
            Number(selectedDate.year) % 400 === 0;
          if (Number(selectedDate.day) > (isLeapYear ? 29 : 28)) {
            newDate.day = isLeapYear ? "29" : "28";
          }
        } else if (
          ["04", "06", "09", "11"].includes(value) &&
          Number(selectedDate.day) > 30
        ) {
          newDate.day = "30";
        }
      }

      if (strValue.length >= maxLength) {
        nextRef.current.focus();
      }
    }

    if (name === "year") {
      newDate.year = value;

      // Adjust February's days if the year changes
      if (selectedDate?.month === "02" && selectedDate?.day) {
        const isLeapYear =
          (Number(value) % 4 === 0 && Number(value) % 100 !== 0) ||
          Number(value) % 400 === 0;
        if (Number(selectedDate.day) > (isLeapYear ? 29 : 28)) {
          newDate.day = isLeapYear ? "29" : "28";
        }
      }
    }

    setSelectedDate(newDate);
  };

  useEffect(() => {
    const selectedFullDate = new Date(
      `${selectedDate?.month}/${selectedDate?.day}/${selectedDate?.year}`
    );

    if (
      selectedDate?.month &&
      selectedDate?.day &&
      String(selectedDate?.year).length === 4
    ) {
      if (minDate && maxDate) {
        if (minDate <= selectedFullDate && maxDate >= selectedFullDate) {
          handleChange(selectedFullDate);
        }
        return;
      }

      if (!minDate && maxDate) {
        if (maxDate >= selectedFullDate) {
          handleChange(selectedFullDate);
        }
        return;
      }

      if (!maxDate && minDate) {
        if (minDate <= selectedFullDate) {
          handleChange(selectedFullDate);
        }
        return;
      }

      if (!minDate && !maxDate) {
        handleChange(selectedFullDate);
        return;
      }
    }
  }, [selectedDate]);

  useEffect(() => {
    dayRef.current.focus();
  }, []);

  const handleChangeInputFocus = (e) => {
    const { key, target } = e;
    const { nextSibling, previousSibling } = target;

    if (key === "Backspace") {
      setSelectedDate({
        ...selectedDate,
        [target.name]: target.value,
      });

      if (!target.value && previousSibling) {
        previousSibling.focus();
      }
      return;
    }

    if (key === "ArrowRight" && nextSibling) {
      nextSibling.focus();
      // Move the cursor to the end of the input field
      nextSibling.setSelectionRange(
        nextSibling.value.length,
        nextSibling.value.length
      );
      return;
    }

    if (key === "ArrowLeft" && previousSibling) {
      previousSibling.focus();
      // Move the cursor to the end of the input field
      previousSibling.setSelectionRange(
        previousSibling.value.length,
        previousSibling.value.length
      );
      return;
    }
  };

  return (
    <div
      style={{
        boxShadow: isMobile ? "" : "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "3px",
        width: "100%",
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "10px",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          backgroundColor: "white",
        }}
      >
        {title && (
          <Typography
            sx={{
              fontSize: "14px !important",
              color: "var(--primary-color) !important",
            }}
          >
            {title}
          </Typography>
        )}

        <Box style={{ width: "60%" }}>
          <input
            ref={dayRef}
            style={{
              ...inputStyle,
            }}
            value={selectedDate?.day}
            placeholder="Day"
            type="text"
            name="day"
            onKeyDown={(e) => handleChangeInputFocus(e)}
            onChange={(e) => {
              const { value } = e.target;
              handleChangeDate(e, monthRef, value > 3 && value < 10 ? 1 : 2);
            }}
            autoComplete="off"
          />
          <input
            ref={monthRef}
            style={{
              ...inputStyle,
              borderRight: "none",
              borderLeft: "none",
            }}
            value={selectedDate?.month}
            placeholder="Month"
            type="text"
            name="month"
            onKeyDown={(e) => handleChangeInputFocus(e)}
            onChange={(e) => {
              const { value } = e.target;
              handleChangeDate(e, yearRef, value > 1 && value < 10 ? 1 : 2);
            }}
            autoComplete="off"
          />
          <input
            ref={yearRef}
            value={selectedDate?.year}
            style={{
              ...inputStyle,
              borderLeft: "none",
              borderRadius: "0 3px 3px 0",
            }}
            placeholder="Year"
            type="text"
            name="year"
            onKeyDown={(e) => handleChangeInputFocus(e)}
            onChange={(e) => {
              const { value } = e.target;
              if ((value.length < 5 && value > 0) || value === "") {
                handleChangeDate(e);
              }
            }}
            autoComplete="off"
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex" }}>
        <Calendar
          className="custom-calendar"
          color="var(--primary-color)"
          style={{
            backgroundColor: "white",
          }}
          date={date}
          months={1}
          onChange={(crrDate) => {
            handleChange(crrDate);
          }}
          minDate={minDate}
          maxDate={maxDate}
        />
      </Box>
    </div>
  );
};

const inputStyle = {
  width: "33%",
  outline: "none",
  padding: "6px 8px",
  border: "none",
};

// const style = document.createElement("style");
// style.innerHTML = `
//   .custom-calendar .rdrDay {
//     height: ${window.location.pathname === "/dashboard/airbooking" && "3em"} !important;
//   }
// `;
// document.head.appendChild(style);

export default CustomCalendar;
