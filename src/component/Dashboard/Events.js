import FlightIcon from "@mui/icons-material/Flight";
import ErrorIcon from "@mui/icons-material/Error";
import DoneIcon from "@mui/icons-material/Done";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";

var today = new Date();
var y = today.getFullYear();
var m = today.getMonth();
var d = today.getDate();

export const eventsArray = [
  {
    id: 1,
    title: "Flight 2 new",
    start: new Date(2024, 9, 5),
    allDay: true,
    className: "bg-green",
    type: "flight",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: <FlightIcon sx={{ fontSize: "21px", transform: "rotate(45deg)" }} />,
  },
  {
    id: 1,
    title: "Settle Booking",
    start: new Date(2024, 9, 5),
    allDay: true,
    className: "bg-orange",
    type: "booking",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: <DriveFileMoveIcon sx={{ fontSize: "20px" }} />,
  },
  {
    id: 2,
    title: "Flight 1",
    start: new Date(2024, 9, 11),
    allDay: true,
    className: "bg-green",
    type: "flight",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: <FlightIcon sx={{ fontSize: "21px", transform: "rotate(45deg)" }} />,
  },
  {
    id: 3,
    title: "Notice",
    start: new Date(2024, 9, 11),
    allDay: true,
    className: "bg-dark",
    type: "notice",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: <ErrorIcon sx={{ fontSize: "22px" }} />,
  },
  {
    id: 3,
    title: "Notice",
    start: new Date(2024, 9, 1),
    allDay: true,
    className: "bg-dark",
    type: "notice",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: <ErrorIcon sx={{ fontSize: "22px" }} />,
  },
  {
    id: 3,
    title: "Notice",
    start: new Date(2024, 9, 2),
    allDay: true,
    className: "bg-dark",
    type: "notice",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: <ErrorIcon sx={{ fontSize: "22px" }} />,
  },
  {
    id: 3,
    title: "Notice",
    start: new Date(2024, 9, 3),
    allDay: true,
    className: "bg-dark",
    type: "notice",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: <ErrorIcon sx={{ fontSize: "22px" }} />,
  },
  {
    id: 3,
    title: "Notice",
    start: new Date(2024, 9, 4),
    allDay: true,
    className: "bg-dark",
    type: "notice",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: <ErrorIcon sx={{ fontSize: "22px" }} />,
  },
  {
    id: 5,
    title: "Settle Booking",
    start: new Date(2024, 9, 11),
    allDay: true,
    className: "bg-orange",
    type: "booking",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: <DriveFileMoveIcon sx={{ fontSize: "20px" }} />,
  },

  {
    id: 4,
    title: "Notice",
    start: new Date(2024, 9, 13),
    allDay: true,
    className: "bg-dark",
    type: "notice",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: <ErrorIcon sx={{ fontSize: "22px" }} />,
  },
  {
    id: 5,
    title: "Settle Booking",
    start: new Date(2024, 9, 1),
    allDay: true,
    className: "bg-orange",
    type: "booking",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: <DriveFileMoveIcon sx={{ fontSize: "20px" }} />,
  },
  {
    id: 6,
    title: "Flight 3",
    start: new Date(2024, 9, 1),
    allDay: true,
    className: "bg-green",
    type: "flight",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: <FlightIcon sx={{ fontSize: "21px", transform: "rotate(45deg)" }} />,
  },
  {
    id: 6,
    title: "Flight 1",
    start: new Date(2024, 9, 7),
    allDay: true,
    className: "bg-green",
    type: "flight",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: <FlightIcon sx={{ fontSize: "21px", transform: "rotate(45deg)" }} />,
  },
  {
    id: 6,
    title: "Flight 2",
    start: new Date(2024, 9, 8),
    allDay: true,
    className: "bg-green",
    type: "flight",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: <FlightIcon sx={{ fontSize: "21px", transform: "rotate(45deg)" }} />,
  },
  {
    id: 6,
    title: "Flight 3",
    start: new Date(2024, 9, 9),
    allDay: true,
    className: "bg-green",
    type: "flight",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: <FlightIcon sx={{ fontSize: "21px", transform: "rotate(45deg)" }} />,
  },
  {
    id: 7,
    title: "Notice",
    start: new Date(2024, 9, 5),
    allDay: true,
    className: "bg-dark",
    type: "notice",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: <ErrorIcon sx={{ fontSize: "22px" }} />,
  },
  {
    id: 7,
    title: "Notice",
    start: new Date(2024, 9, 29),
    allDay: true,
    className: "bg-dark",
    type: "notice",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: <ErrorIcon sx={{ fontSize: "22px" }} />,
  },
];
