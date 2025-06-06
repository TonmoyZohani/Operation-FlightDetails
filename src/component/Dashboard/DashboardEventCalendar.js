import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FlightIcon from "@mui/icons-material/Flight";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import WorkIcon from "@mui/icons-material/Work";

const DashboardEventCalendar = ({
  pendingData,
  selectedEvents,
  setSelectedEvents,
}) => {
  const calendarRef = useRef();

  const pendingOperation =
    pendingData?.pendingOperation?.map((operation) => {
      const title = operation?.operationName?.toLowerCase();
      const colors =
        title === "booking validity ending"
          ? "#22a6b3"
          : title === "ancillary service confirmation"
          ? "#be2edd"
          : title === "refund confirmation"
          ? "#f0932b"
          : title === "reissue confirmation"
          ? "#8c7ae6"
          : title === "due payment deadline"
          ? "#dc143c"
          : title === "flight depart"
          ? "#003566"
          : "#202124";

      return {
        id: operation?.id,
        bookingId: operation?.bookingId,
        start: new Date(moment(operation?.timeLimit).format("YYYY-MM-DD")),
        title,
        description: operation?.bookingDetails,
        colors,
        timeLimit: operation?.timeLimit,
      };
    }) || [];

  useEffect(() => {
    if (pendingData?.pendingOperation.length > 0) {
      handleDateClick({ dateStr: new Date() });
    }
  }, [pendingData]);

  const handleDateClick = (arg) => {
    const eventsOnDate = pendingOperation.filter((event) => {
      return (
        moment(event.start).format("YYYY-MM-DD") ===
        moment(arg.dateStr).format("YYYY-MM-DD")
      );
    });

    setSelectedEvents({
      events: eventsOnDate,
      date: moment(arg.dateStr).format("YYYY-MM-DD"),
    });
  };

  return (
    <Box
      sx={{
        ".fc-header-toolbar": { margin: "0 !important" },
        ".fc-col-header-cell-cushion": { color: "var(--dark-gray)" },
        ".fc-day-today": { backgroundColor: "white !important" },
        ".fc-daygrid-day-frame": {
          height: "100px",
          ":hover": { backgroundColor: "#f8f8f8" },
          cursor: "pointer",
        },
        ".fc-toolbar-title": {
          fontSize: "18px",
          margin: "10px 0",
          color: "var(--primary-color)",
        },
        ".fc-h-event": { border: "none", backgroundColor: "transparent" },
        ".fc-daygrid-day-events": {
          display: "flex",
          margin: "0 !important",
          marginTop: "25px !important",
          paddingLeft: "5px !important",
        },

        ".selected-date": {
          ".fc-daygrid-day-frame": { border: "1px solid var(--primary-color)" },
          ".fc-highlight": { backgroundColor: "#f8f8f8" },
        },
        ".fc-daygrid-event-harness": {
          marginTop: "0px !important",
        },
      }}
    >
      <ChangeMonthArrows calendarRef={calendarRef} />

      <FullCalendar
        contentHeight="auto"
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        editable={false}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={5}
        weekends={true}
        initialView="dayGridMonth"
        headerToolbar={{ start: "title", center: "", end: "" }}
        events={pendingOperation}
        dateClick={handleDateClick}
        // select={handleDateSelect}
        eventContent={renderEventContent}
        eventAdd={function () {
          // console.log("Event Added");
        }}
        eventChange={function () {
          // console.log("Event Changed");
        }}
        eventRemove={function () {
          // console.log("Event Removed");
        }}
        dayCellClassNames={(arg) => {
          const isCurrentDate =
            moment(arg.date).format("YYYY-MM-DD") ===
            moment(selectedEvents?.date).format("YYYY-MM-DD");
          return isCurrentDate ? "selected-date" : "";
        }}
      />
    </Box>
  );
};

const ChangeMonthArrows = ({ calendarRef }) => {
  const [changeArrow, setChangeArrow] = useState("next");

  return (
    <Box
      sx={{
        position: "absolute",
        top: "0",
        right: "0",
        display: "flex",
        gap: "5px",
      }}
    >
      <KeyboardArrowLeftIcon
        onClick={() => {
          let calendar = calendarRef.current.getApi();
          calendar.prev();
          setChangeArrow("prev");
        }}
        sx={iconStyle(changeArrow === "prev")}
      />
      <KeyboardArrowRightIcon
        onClick={() => {
          let calendar = calendarRef.current.getApi();
          calendar.next();
          setChangeArrow("next");
        }}
        sx={iconStyle(changeArrow === "next")}
      />
    </Box>
  );
};

function renderEventContent(eventInfo) {
  const { colors } = eventInfo.event.extendedProps;
  const { title } = eventInfo.event;
  return (
    <Box
      sx={{
        height: "22px",
        width: "22px",
        bgcolor: colors,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {title === "booking validity ending" ? (
        <HourglassEmptyIcon sx={{ color: "white", fontSize: "16px" }} />
      ) : title === "ancillary service confirmation" ? (
        <WorkIcon sx={{ color: "white", fontSize: "16px" }} />
      ) : title === "refund confirmation" ? (
        <AccessTimeIcon sx={{ color: "white", fontSize: "16px" }} />
      ) : title === "reissue confirmation" ? (
        <AccessTimeIcon sx={{ color: "white", fontSize: "16px" }} />
      ) : title === "due payment deadline" ? (
        <AttachMoneyIcon sx={{ color: "white", fontSize: "16px" }} />
      ) : title === "flight depart" ? (
        <FlightIcon sx={{ color: "white", fontSize: "16px" }} />
      ) : (
        <AccessTimeIcon sx={{ color: "white", fontSize: "16px" }} />
      )}
    </Box>
  );
}

const iconStyle = (isActive) => ({
  color: isActive ? "white" : "var(--primary-color)",
  fontSize: "26px",
  cursor: "pointer",
  bgcolor: isActive ? "#202124" : "#f8f8f8",
  borderRadius: "4px",
});

export default DashboardEventCalendar;
