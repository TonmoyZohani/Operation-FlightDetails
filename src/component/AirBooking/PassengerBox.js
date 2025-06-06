import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Box,
  Collapse,
  FormControlLabel,
  Grid,
  IconButton,
  SwipeableDrawer,
  Typography,
  Modal,
  Alert,
  Skeleton,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import { addMonths } from "date-fns";
import { useEffect, useState } from "react";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { sharedInputStyles } from "../../shared/common/styles";
import ImageUploadFile from "../Modal/ImageUploadFile";
import axios from "axios";
import moment from "moment";
import { useAuth } from "../../context/AuthProvider";
import CustomCalendar from "../CustomCalendar/CustomCalendar";
import PassportScanModal from "../Modal/PassportScanModal";
import { options } from "../Register/Nationality";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  reissuePassengerData,
  setPassengerDateOfBirth,
  setPassengerDateOfExpiry,
  setPassengerDetails,
  setPassengerFirstName,
  setPassengerFrequentFlyer,
  setPassengerGender,
  setPassengerLastName,
  setPassengerPassportCopy,
  setPassengerPassportNation,
  setPassengerVisaInfo,
  setPassengerVisaLoading,
  setPassengerPassportNumber,
  setPassengerPrefix,
  setPassengerVisaCopy,
} from "./airbookingSlice";
import { getPassengerDetails } from "./BookingUtils";
import { GeneralDrawer } from "../FlightSearchBox/AllSearchDrawers";
import useWindowSize from "../../shared/common/useWindowSize";
import { useOutletContext } from "react-router-dom";
import AddClient from "../Manage/AddClient/AddClient";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    zIndex: 2,
    borderColor: state.isFocused ? "#8BB6CC" : provided.borderColor,
    boxShadow: state.isFocused ? "0 0 0 1px #8BB6CC" : provided.boxShadow,
    "&:hover": {
      borderColor: state.isFocused ? "#8BB6CC" : provided.borderColor,
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 100,
  }),
};

const PassengerBox = ({
  flightData,
  totalPassenger,
  reissuePassengers,
  flightAfterSearch,
}) => {
  const dispatch = useDispatch();
  const { isMobile, isMedium, isLarge } = useWindowSize();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openCalendars, setOpenCalendars] = useState({});
  const [openNationalities, setOpenNationalities] = useState({});
  const [openExpiryCalendars, setOpenExpiryCalendars] = useState({});
  const [openIndexes, setOpenIndexes] = useState([]);
  const [travelerLists, setTravelerLists] = useState([]);
  const [startY, setStartY] = useState(null);
  const agentData = useOutletContext();
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [frequentPax, setFrequentPax] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [adultFirstNameDuplicateError, setAdultFirstNameDuplicateError] =
    useState("");
  const [adultLastNameDuplicateError, setAdultLastNameDuplicateError] =
    useState("");
  const [childFirstNameDuplicateError, setChildFirstNameDuplicateError] =
    useState("");
  const [childLastNameDuplicateError, setChildLastNameDuplicateError] =
    useState("");
  const [infantFirstNameDuplicateError, setInfantFirstNameDuplicateError] =
    useState("");
  const [infantLastNameDuplicateError, setInfantLastNameDuplicateError] =
    useState("");

  const [
    adultPassportNumberDuplicateError,
    setAdultPassportNumberDuplicateError,
  ] = useState("");
  const [
    childPassportNumberDuplicateError,
    setChildPassportNumberDuplicateError,
  ] = useState("");
  const [
    infantPassportNumberDuplicateError,
    setInfantPassportNumberDuplicateError,
  ] = useState("");

  const [passportNumberError, setPassportNumberError] = useState("");

  const [paxIndex, setPaxIndex] = useState(null);
  const [paxNo, setPaxNo] = useState("");
  const [paxItemType, setPassengerType] = useState("");
  const { jsonHeader } = useAuth();

  //TODO:: Necessary date set up
  const cityCount = flightData?.cityCount.flat();
  const arrivalDate = cityCount[cityCount.length - 1]?.arrivalDate;
  const departureDate = cityCount[cityCount.length - 1]?.departureDate;
  let dateBeforeTwelveYears = addMonths(new Date(arrivalDate), -144);
  let dateBeforeTwoYears = addMonths(new Date(arrivalDate), -24);
  let passportExpiry = addMonths(new Date(departureDate), 6);
  let dateAfterTenYears = addMonths(new Date(departureDate), 120);

  // Add Client Modal
  const [openClientModal, setOpenClientModal] = useState(false);
  const [clientModalData, setClientModalData] = useState({});

  // TODO:: Modal
  const [open, setOpen] = useState(false);
  const handleOpen = (idx, paxTypeItem, paxNumber) => {
    setPassengerType(paxTypeItem);
    setPaxIndex(idx);
    setOpen(true);
    setPaxNo(idx - 1);
  };
  const handleClose = () => setOpen(false);

  const passengerData = useSelector(
    (state) => state.flightBooking.passengerData
  );

  const firstClick = useSelector((state) => state.flightBooking.firstClick);

  const passengerDetails = getPassengerDetails(totalPassenger);

  //TODO:: Input handle functions for passenger
  const handleFirstNameChange = (e, passengerType, index) => {
    const newFirstName = e.target.value.toUpperCase();
    const existingPassengers = passengerData[passengerType.toLowerCase()] || [];

    let hasDuplicate = false;

    if (existingPassengers[index - 1]) {
      hasDuplicate = existingPassengers.some(
        (passenger, i) =>
          i !== index - 1 &&
          passenger.firstName?.trim().toUpperCase() === newFirstName &&
          passenger.lastName?.trim().toUpperCase() ===
            existingPassengers[index - 1]?.lastName?.trim().toUpperCase()
      );
    }

    if (passengerType.toLowerCase() === "adult") {
      setAdultFirstNameDuplicateError(
        hasDuplicate ? "Duplicate first name detected." : ""
      );
    } else if (passengerType.toLowerCase() === "child") {
      setChildFirstNameDuplicateError(
        hasDuplicate ? "Duplicate first name detected." : ""
      );
    } else if (passengerType.toLowerCase() === "infant") {
      setInfantFirstNameDuplicateError(
        hasDuplicate ? "Duplicate first name detected." : ""
      );
    }

    setAdultLastNameDuplicateError("");
    setChildLastNameDuplicateError("");
    setInfantLastNameDuplicateError("");

    dispatch(
      setPassengerFirstName({
        passengerType: passengerType.toLowerCase(),
        index: index - 1,
        firstName: newFirstName,
      })
    );
  };

  const handleLastNameChange = (e, passengerType, index) => {
    const newLastName = e.target.value.toUpperCase();
    const existingPassengers = passengerData[passengerType.toLowerCase()] || [];

    let hasDuplicate = false;

    if (existingPassengers[index - 1]) {
      hasDuplicate = existingPassengers.some(
        (passenger, i) =>
          i !== index - 1 &&
          passenger.firstName?.trim().toLowerCase() ===
            existingPassengers[index - 1]?.firstName?.toLowerCase() &&
          passenger.lastName?.trim().toLowerCase() === newLastName.toLowerCase()
      );
    }

    if (passengerType.toLowerCase() === "adult") {
      setAdultLastNameDuplicateError(
        hasDuplicate ? "Duplicate last name detected." : ""
      );
    } else if (passengerType.toLowerCase() === "child") {
      setChildLastNameDuplicateError(
        hasDuplicate ? "Duplicate last name detected." : ""
      );
    } else if (passengerType.toLowerCase() === "infant") {
      setInfantLastNameDuplicateError(
        hasDuplicate ? "Duplicate last name detected." : ""
      );
    }

    setAdultFirstNameDuplicateError("");
    setChildFirstNameDuplicateError("");
    setInfantFirstNameDuplicateError("");

    dispatch(
      setPassengerLastName({
        passengerType: passengerType.toLowerCase(),
        index: index - 1,
        lastName: newLastName,
      })
    );
  };

  const handleGenderChange = (e, passengerType, index) => {
    dispatch(
      setPassengerGender({
        passengerType: passengerType.toLowerCase(),
        index: index - 1,
        gender: e.value,
      })
    );

    dispatch(
      setPassengerPrefix({
        passengerType: passengerType.toLowerCase(),
        index: index - 1,
        prefix:
          passengerType.toLowerCase() === "adult"
            ? e.value === "Male"
              ? "MR"
              : "MS"
            : e.value === "Female"
              ? "MISS"
              : "MASTER",
      })
    );
  };

  const handlePassportNationChange = (e, passengerType, index) => {
    dispatch(
      setPassengerPassportNation({
        passengerType: passengerType.toLowerCase(),
        index: index - 1,
        passportNation: {
          name: e.name,
          code: e.code,
        },
      })
    );
    handleCloseNationalities();
  };

  const handlePassportNumberChange = (e, passengerType, index) => {
    const newPassportNumber = e.target.value.trim();
    const existingPassengers = [
      ...(passengerData.adult || []),
      ...(passengerData.child || []),
      ...(passengerData.infant || []),
    ];

    let hasDuplicate = existingPassengers.some(
      (passenger, i) =>
        i !== index && passenger.passportNumber?.trim() === newPassportNumber
    );

    if (hasDuplicate) {
      if (passengerType.toLowerCase() === "adult") {
        setAdultPassportNumberDuplicateError(
          "Duplicate passport number detected."
        );
      } else if (passengerType.toLowerCase() === "child") {
        setChildPassportNumberDuplicateError(
          "Duplicate passport number detected."
        );
      } else if (passengerType.toLowerCase() === "infant") {
        setInfantPassportNumberDuplicateError(
          "Duplicate passport number detected."
        );
      }
    } else {
      if (passengerType.toLowerCase() === "adult") {
        setAdultPassportNumberDuplicateError("");
      } else if (passengerType.toLowerCase() === "child") {
        setChildPassportNumberDuplicateError("");
      } else if (passengerType.toLowerCase() === "infant") {
        setInfantPassportNumberDuplicateError("");
      }
    }

    dispatch(
      setPassengerPassportNumber({
        passengerType: passengerType.toLowerCase(),
        index: index - 1,
        passportNumber: newPassportNumber,
      })
    );
  };

  const handlePrefixClick = (prefix, passengerType, index) => {
    dispatch(
      setPassengerPrefix({
        passengerType: passengerType.toLowerCase(),
        index: index - 1,
        prefix: prefix,
      })
    );

    dispatch(
      setPassengerGender({
        passengerType: passengerType.toLowerCase(),
        index: index - 1,
        gender: prefix === "MR" || prefix === "MASTER" ? "Male" : "Female",
      })
    );
  };

  const getPrefixes = (passengerType) => {
    if (passengerType.toLowerCase() === "adult") {
      return ["MR", "MS"];
    } else {
      return ["MASTER", "MISS"];
    }
  };

  const handleFrequentFlyerChange = (passengerType, count) => {
    const currentFrequentTraveler =
      passengerData[passengerType]?.[count - 1]?.frequentTraveler ?? false;

    dispatch(
      setPassengerFrequentFlyer({
        passengerType,
        count,
        frequentTraveler: !currentFrequentTraveler,
      })
    );
  };

  const toggleBox = (index) => {
    setOpenIndexes((prevIndexes) =>
      prevIndexes.includes(index)
        ? prevIndexes.filter((i) => i !== index)
        : [...prevIndexes, index]
    );
    setPaxIndex(index);
  };

  // TODO:: Handle all necessary operations regarding date of birth by index
  const handleBirthDateChange = (date, passengerType, passengerCount) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const index = passengerCount - 1;

    dispatch(
      setPassengerDateOfBirth({
        passengerType: passengerType.toLowerCase(),
        index,
        dateOfBirth: formattedDate,
      })
    );
  };

  const handleCalendarOpen = (paxNo) => {
    setOpenCalendars((prevState) => ({
      ...prevState,
      [paxNo]: !prevState[paxNo],
    }));
  };

  const handleCalendarOpenNatiolality = (paxNo) => {
    setOpenNationalities((prevState) => ({
      ...prevState,
      [paxNo]: !prevState[paxNo],
    }));
  };

  const handleCloseNationalities = () => {
    setOpenNationalities({});
  };

  const handleCloseDob = () => {
    setOpenCalendars({});
  };

  // TODO:: Handle all necessary operations regarding expiry date
  const handleExpiryCalendarOpen = (paxNo) => {
    setOpenExpiryCalendars((prevState) => ({
      ...prevState,
      [paxNo]: !prevState[paxNo],
    }));
  };

  const handleExpiryDateChange = (date, passengerType, passengerCount) => {
    const formattedDate = date.toISOString().split("T")[0];
    const index = passengerCount - 1;

    dispatch(
      setPassengerDateOfExpiry({
        passengerType: passengerType.toLowerCase(),
        index,
        passportExpire: formattedDate,
      })
    );
  };
  // END:: Date of expiry operations

  const handlePassportUploadClick = (file, passengerType, passengerCount) => {
    const index = passengerCount - 1;
    // make empty all error states
    setFirstNameError("");
    setLastNameError("");

    dispatch(
      setPassengerPassportCopy({
        passengerType: passengerType.toLowerCase(),
        index,
        passportImage: file,
      })
    );
  };

  const handleVisaUploadClick = (file, passengerType, passengerCount) => {
    const index = passengerCount - 1;
    dispatch(
      setPassengerVisaCopy({
        passengerType: passengerType.toLowerCase(),
        index,
        visaImage: file,
      })
    );
  };

  const filterOption = (option, inputValue) => {
    return option.data.name.toLowerCase().includes(inputValue.toLowerCase());
  };

  const getSelectedOption = (passportNation) => {
    if (!Array.isArray(options)) return null;
    return (
      options.find(
        (option) =>
          option.name === passportNation || option.code === passportNation
      ) || null
    );
  };

  const getSelectedGender = (gender) => {
    const genderOptions = [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
    ];
    return genderOptions.find((option) => option.value === gender) || null;
  };

  const handleTravelerChange = (selectedOption, passengerType, index) => {
    if (selectedOption) {
      const newFirstName = selectedOption.firstName.trim().toUpperCase();
      const newLastName = selectedOption.lastName.trim().toUpperCase();

      const existingPassengers =
        passengerData[passengerType.toLowerCase()] || [];

      const isDuplicate = existingPassengers.some(
        (passenger, i) =>
          i !== index - 1 &&
          passenger.firstName.trim().toUpperCase() === newFirstName &&
          passenger.lastName.trim().toUpperCase() === newLastName
      );

      // Set the appropriate error messages based on passenger type
      if (passengerType.toLowerCase() === "adult") {
        setAdultFirstNameDuplicateError(
          isDuplicate ? "Duplicate first name detected." : ""
        );
        setAdultLastNameDuplicateError(
          isDuplicate ? "Duplicate last name detected." : ""
        );
      } else if (passengerType.toLowerCase() === "child") {
        setChildFirstNameDuplicateError(
          isDuplicate ? "Duplicate first name detected." : ""
        );
        setChildLastNameDuplicateError(
          isDuplicate ? "Duplicate last name detected." : ""
        );
      } else if (passengerType.toLowerCase() === "infant") {
        setInfantFirstNameDuplicateError(
          isDuplicate ? "Duplicate first name detected." : ""
        );
        setInfantLastNameDuplicateError(
          isDuplicate ? "Duplicate last name detected." : ""
        );
      }

      const traveler = {
        firstName: selectedOption.firstName.toUpperCase(),
        lastName: selectedOption.lastName.toUpperCase(),
        paxType: passengerType.toUpperCase(),
        passportNation: {
          name: "Bangladesh",
          code: "BD",
        },
        dateOfBirth: moment(selectedOption.dateOfBirth).format("YYYY-MM-DD"),
        email: selectedOption.email,
        phone: selectedOption.phone,
        gender: selectedOption.gender,
        // frequentTraveler: selectedOption.frequentTraveler,
        prefix: selectedOption.prefix,
        passportImage: null,
        visaImage: null,
        passportNumber: null,
        passportExpire: null,
        ancillaries: [
          { type: "wheelChair", description: "", remarks: "" },
          { type: "meals", description: "", remarks: "" },
          { type: "vipMessage", description: "", remarks: "" },
        ],
      };

      // make empty all error states
      setFirstNameError("");
      setLastNameError("");

      // Always update the state, even if there's an error
      dispatch(
        setPassengerDetails({
          passengerType: passengerType.toLowerCase(),
          index: index - 1,
          traveler,
        })
      );

      // handlePassportUploadClick(null, passengerType, index);
    }
  };

  const handleValidationAndOpenBox = (index, errorState) => {
    if (errorState && !openIndexes.includes(index)) {
      setOpenIndexes((prevIndexes) => [...prevIndexes, index]);
    }
  };

  const checkVisa = async ({ visaCode, countryCode }) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/booking/visa-required/${visaCode}/${countryCode}`,
        jsonHeader()
      );

      return data;
    } catch (e) {}
  };

  const handleCheckVisaInfo = async (passenger, selectedOption) => {
    const passengerType = passenger.type.toLowerCase();
    const passengerIndex = passenger.count - 1;

    dispatch(
      setPassengerVisaInfo({
        passengerType,
        index: passengerIndex,
        visaInfo: [],
      })
    );

    dispatch(
      setPassengerVisaLoading({
        passengerType,
        index: passengerIndex,
        isLoading: true,
      })
    );

    try {
      const promises = uniqueCity.map((item) =>
        checkVisa({
          visaCode: selectedOption?.code,
          countryCode: item?.arrivalCountryCode,
        }).then((data) => ({
          data,
          destination: item?.arrivalCountryCode,
        }))
      );

      const results = await Promise.all(promises);

      const visaInfoArray = results
        .filter((res) => res.data?.success)
        .map((res) => ({
          visa: res.data?.data?.visa,
          message: res.data?.data?.message,
          passport_code: res.data?.data?.passport_code,
          destination: res.data?.data?.destination,
        }));

      dispatch(
        setPassengerVisaInfo({
          passengerType,
          index: passengerIndex,
          visaInfo: visaInfoArray,
        })
      );
    } finally {
      dispatch(
        setPassengerVisaLoading({
          passengerType,
          index: passengerIndex,
          isLoading: false,
        })
      );
    }
  };

  useEffect(() => {
    const fetchTraveler = async () => {
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/clients?frequentTraveller=true&searchTerm=${searchTerm}`;
      try {
        const response = await axios.get(url, jsonHeader());

        const travelers = response?.data?.data?.data || [];

        const transformedData = travelers.reduce(
          (acc, traveler) => {
            const paxType = traveler.paxType;

            let prefix = "";
            if (paxType === "ADT") {
              prefix = traveler.gender === "Male" ? "MR" : "MS";
            } else if (paxType === "CNN" || paxType === "INF") {
              prefix = traveler.gender === "Male" ? "MASTER" : "MISS";
            }

            const updatedTraveler = {
              ...traveler,
              prefix,
            };

            if (!acc[paxType]) {
              acc[paxType] = [];
            }
            acc[paxType].push(updatedTraveler);

            return acc;
          },
          {
            ADT: [],
            CNN: [],
            INF: [],
          }
        );

        setTravelerLists(transformedData);
      } catch (error) {
        console.error("Error fetching traveler data:", error);
      }
    };

    fetchTraveler();
  }, [searchTerm]);

  useEffect(() => {
    if (flightAfterSearch === "reissue-search") {
      dispatch(reissuePassengerData(reissuePassengers));
    }
  }, []);

  // Captures the starting Y-coordinate when the user first touches the screen
  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

  // Detects touch movement and closes the drawer if the user swipes down
  const handleTouchMove = (e, passengerPaxNo) => {
    if (startY === null || !e.touches || e.touches.length === 0) return;
    const currentY = e.touches[0].clientY;
    if (currentY - startY > 90) {
      setOpenNationalities((prev) => ({ ...prev, [passengerPaxNo]: false }));
    }
  };

  const uniqueCity = Array.from(
    new Map(
      flightData?.cityCount
        ?.map((city) => city.filter((_, i, arr) => i === arr.length - 1))
        .flat()
        .map((item) => [item?.arrivalCountryCode, item])
    ).values()
  );

  useEffect(() => {
    const initialNationality = () => {
      passengerDetails?.map((passenger, index) => {
        const selectedOption = { name: "Bangladesh", code: "BD" };

        handlePassportNationChange(
          selectedOption,
          passenger.type,
          passenger.count
        );
        handleCheckVisaInfo(passenger, selectedOption);
      });
    };
    initialNationality();
  }, []);

  return (
    <Box sx={{ position: "relative" }}>
      {passengerDetails?.map((passenger, index) => {
        const type = passenger.type.toLowerCase();
        const passengerDataItem = passengerData[type]?.[passenger.count - 1];

        // Check for validation errors
        const hasFirstNameError = !passengerDataItem?.firstName && firstClick;
        const hasLastNameError = !passengerDataItem?.lastName && firstClick;
        const hasPassportExpireError =
          (flightData?.immediateIssue &&
            !passengerDataItem?.passportExpire &&
            firstClick) ||
          (flightData?.journeyType === "Inbound" &&
            passengerDataItem?.passportNation?.code !== "BD" &&
            !passengerDataItem?.passportExpire &&
            firstClick);
        const hasGenderError = !passengerDataItem?.gender && firstClick;
        const hasDateOfBirthError =
          !passengerDataItem?.dateOfBirth && firstClick;
        const hasPassportNationError =
          !passengerDataItem?.passportNation?.name && firstClick;
        const hasPassportNumberError =
          (flightData?.immediateIssue &&
            !passengerDataItem?.passportNumber &&
            firstClick) ||
          (flightData?.journeyType === "Inbound" &&
            passengerDataItem?.passportNation?.code !== "BD" &&
            !passengerDataItem?.passportNumber &&
            firstClick);
        const hasPrefixError = !passengerDataItem?.prefix && firstClick;
        const hasPassportCopyError =
          flightData?.immediateIssue &&
          !passengerDataItem?.passportImage &&
          firstClick;
        const hasVisaCopyError =
          flightData?.immediateIssue &&
          !passengerDataItem?.visaImage &&
          firstClick;

        if (
          hasFirstNameError ||
          hasLastNameError ||
          hasPassportExpireError ||
          hasGenderError ||
          hasDateOfBirthError ||
          hasPassportNationError ||
          hasPassportNumberError ||
          hasPrefixError ||
          hasPassportCopyError ||
          hasVisaCopyError
        ) {
          handleValidationAndOpenBox(index, true);
        }

        const travelerOptions = (
          passenger.type === "Adult"
            ? travelerLists.ADT
            : passenger.type === "Child"
              ? travelerLists.CNN
              : travelerLists.INF
        )?.map((traveler) => ({
          value: traveler,
          traveler,
        }));

        return (
          <Box
            key={index}
            sx={{
              width: {
                xs: "90%",
                lg: "100%",
              },
              bgcolor: "#fff",
              borderRadius: "5px",
              p: "20px 15px",
              mb: "10px",
              mx: "auto",
            }}
          >
            <Box
              sx={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
              }}
              onClick={() => toggleBox(index)}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "var(--secondary-color)",
                  fontWeight: "500",
                }}
              >
                {!passengerData[passenger.type.toLowerCase()]?.[
                  passenger.count - 1
                ]?.firstName &&
                  !passengerData[passenger.type.toLowerCase()]?.[
                    passenger.count - 1
                  ]?.lastName &&
                  "Passenger "}
                {`${
                  passengerData[passenger.type.toLowerCase()]?.[
                    passenger.count - 1
                  ]?.prefix || ""
                } ${
                  passengerData[passenger.type.toLowerCase()]?.[
                    passenger.count - 1
                  ]?.firstName?.toUpperCase() || ""
                } ${
                  passengerData[passenger.type.toLowerCase()]?.[
                    passenger.count - 1
                  ]?.lastName?.toUpperCase() || ""
                }`}{" "}
                [ {passenger.type} {passenger.count} ]
                {passenger.type === "Child" && (
                  <span
                    style={{ color: "var(--primary-color)", fontSize: "12px" }}
                  >
                    {" "}
                    [Age: {passenger.age}]
                  </span>
                )}
              </Typography>

              <Box className="dropdown-class">
                <ArrowDropDownIcon />
              </Box>
            </Box>

            <Collapse
              in={
                openIndexes?.length > 0
                  ? openIndexes.includes(index)
                  : index === 0
                    ? true
                    : false
              }
              timeout="auto"
              unmountOnExit
              sx={{ width: "100%", transition: "height 1s ease-in-out" }}
            >
              {/* Title & Traveler list portion */}
              <Grid
                container
                sx={{
                  mt: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Grid
                  container
                  item
                  lg={2.5}
                  xs={12}
                  md={2.5}
                  sx={{
                    display: "flex",
                    columnGap: "10px",
                  }}
                >
                  {getPrefixes(passenger.type).map((prefix) => {
                    const isPrefixMatch =
                      (passenger.type === "Adult" &&
                        passengerData.adult?.[passenger.count - 1]?.prefix ===
                          prefix) ||
                      (passenger.type === "Child" &&
                        passengerData.child?.[passenger.count - 1]?.prefix ===
                          prefix) ||
                      (passenger.type === "Infant" &&
                        passengerData.infant?.[passenger.count - 1]?.prefix ===
                          prefix);

                    const bgcolor = isPrefixMatch
                      ? "var(--primary-color)"
                      : "#EFF7FF";
                    const color = isPrefixMatch ? "#fff" : "#979797";

                    return (
                      <Grid
                        key={prefix}
                        item
                        xs={2}
                        lg={5.5}
                        md={3}
                        className="title-text prefix-box"
                        sx={{
                          bgcolor: bgcolor,
                          color: color,
                          transition: "background-color 0.3s ease",
                          "&:hover": {
                            bgcolor: "var(--primary-color)",
                            color: "#fff",
                          },
                        }}
                        onClick={
                          flightAfterSearch !== "reissue-search"
                            ? () =>
                                handlePrefixClick(
                                  prefix,
                                  passenger.type,
                                  passenger.count
                                )
                            : null
                        }
                      >
                        {prefix}
                      </Grid>
                    );
                  })}

                  {/* Display error message if prefix is missing */}
                  {hasPrefixError && (
                    <FormHelperText error>Prefix is required</FormHelperText>
                  )}
                </Grid>
                <Grid
                  item
                  lg={8}
                  sx={{
                    display: "flex",
                    gap: "20px",
                    justifyContent: "flex-end",
                    mt: isMobile ? 2 : 0,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: isMobile ? 0.5 : 2,
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    {flightAfterSearch !== "reissue-search" && (
                      <Box
                        sx={{
                          display: "flex",
                          columnGap: "10px",
                          borderRadius: "3px",
                        }}
                      >
                        <Box
                          onClick={() =>
                            handleOpen(
                              passenger?.count,
                              passenger?.type,
                              passenger?.paxNo
                            )
                          }
                          pl={0.5}
                          sx={{
                            width: "100%",
                            bgcolor: "#F0F2F5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderRadius: "4px",
                            cursor: "pointer",
                            gap: "10px",
                            transition: "background-color 0.3s ease",
                            px: "10px",
                            height: "41px",
                          }}
                        >
                          <CloudUploadIcon
                            sx={{ mb: "2px", color: "var(--primary-color)" }}
                          />
                          <Typography
                            sx={{
                              fontSize: "13px",
                              fontWeight: "500",
                              pt: "3px",
                              color: "var(--secondary-color)",
                            }}
                          >
                            Auto Fill With Passport
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {flightAfterSearch !== "reissue-search" && (
                      <Box
                        sx={{
                          mt: {
                            xs: "15px",
                            lg: "0px",
                            md: "0px",
                          },
                        }}
                      >
                        <Box sx={{ width: isMedium ? "298px" : "370px" }}>
                          <Select
                            options={travelerOptions || []}
                            getOptionLabel={(option) =>
                              `${option.traveler.prefix} ${option.traveler.firstName.toUpperCase()} ${option.traveler.lastName.toUpperCase()}`
                            }
                            formatOptionLabel={(option) => (
                              <Box sx={{ padding: "4px", borderRadius: "4px" }}>
                                <Typography
                                  sx={{
                                    fontSize: "14px",
                                    color: "var(--secondary-color)",
                                  }}
                                >
                                  {option.traveler.prefix}{" "}
                                  {option.traveler.firstName?.toUpperCase()}{" "}
                                  {option.traveler.lastName?.toUpperCase()}
                                </Typography>
                              </Box>
                            )}
                            placeholder="Select From The Saved Passengers"
                            isSearchable
                            isMulti={false}
                            styles={customStyles}
                            onChange={
                              flightAfterSearch !== "reissue-search"
                                ? (selectedOption) =>
                                    handleTravelerChange(
                                      selectedOption.value,
                                      passenger.type,
                                      passenger.count
                                    )
                                : null
                            }
                            onInputChange={(inputValue, { action }) => {
                              if (action === "input-change") {
                                setSearchTerm(inputValue);
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>

              <Grid container>
                <Grid
                  container
                  columnSpacing={2}
                  item
                  xs={12}
                  sx={{
                    mr: {
                      xs: "0px",
                      lg: "0px",
                    },
                    mt: "20px",
                  }}
                >
                  <Grid
                    item
                    lg={4}
                    xs={12}
                    sm={6}
                    md={4}
                    sx={{ mb: { xs: "20px", lg: "20px" } }}
                  >
                    <TextField
                      id={`firstName-${index}`}
                      name="firstName"
                      label="First Name"
                      variant="outlined"
                      size="small"
                      type="text"
                      value={
                        passengerData[passenger.type.toLowerCase()]?.[
                          passenger.count - 1
                        ]?.firstName?.toUpperCase() || ""
                      }
                      onChange={
                        flightAfterSearch !== "reissue-search"
                          ? (e) => {
                              const value = e.target.value;
                              const regex =
                                /^(?!\s)(?!.*([.\-])\1)(?!.*\s{2,})[a-zA-Z.\-\s]*$/;

                              if (value === "" || regex.test(value)) {
                                setFirstNameError("");
                                handleFirstNameChange(
                                  e,
                                  passenger.type,
                                  passenger.count
                                );
                              } else {
                                setFirstNameError(
                                  "First name must contain letters only."
                                );
                                handleValidationAndOpenBox(index, true);
                              }
                            }
                          : null
                      }
                      sx={sharedInputStyles}
                    />

                    {/* Required field error */}
                    {hasFirstNameError && (
                      <FormHelperText error>
                        First name is required
                      </FormHelperText>
                    )}

                    {/* Validation error */}
                    {firstNameError && (
                      <FormHelperText error>{firstNameError}</FormHelperText>
                    )}

                    {/* Duplicate name error */}
                    {passenger.type.toLowerCase() === "adult" &&
                      adultFirstNameDuplicateError && (
                        <FormHelperText error>
                          {adultFirstNameDuplicateError}
                        </FormHelperText>
                      )}
                    {passenger.type.toLowerCase() === "child" &&
                      childFirstNameDuplicateError && (
                        <FormHelperText error>
                          {childFirstNameDuplicateError}
                        </FormHelperText>
                      )}
                    {passenger.type.toLowerCase() === "infant" &&
                      infantFirstNameDuplicateError && (
                        <FormHelperText error>
                          {infantFirstNameDuplicateError}
                        </FormHelperText>
                      )}
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    xs={12}
                    sm={6}
                    md={4}
                    sx={{ mb: { xs: "20px", lg: 0 } }}
                  >
                    <TextField
                      id={`lastName-${index}`}
                      name="lastName"
                      label="Last Name"
                      variant="outlined"
                      size="small"
                      type="text"
                      value={
                        passengerData[passenger.type.toLowerCase()]?.[
                          passenger.count - 1
                        ]?.lastName?.toUpperCase() || ""
                      }
                      onChange={
                        flightAfterSearch !== "reissue-search"
                          ? (e) => {
                              const value = e.target.value;
                              const regex =
                                /^(?!\s)(?!.*([.\-])\1)(?!.*\s{2,})[a-zA-Z.\-\s]*$/;
                              if (value === "" || regex.test(value)) {
                                setLastNameError("");
                                handleLastNameChange(
                                  e,
                                  passenger.type,
                                  passenger.count
                                );
                              } else {
                                setLastNameError(
                                  "Last name must contain letters only."
                                );
                              }
                            }
                          : null
                      }
                      sx={sharedInputStyles}
                    />

                    {/* Required field error */}
                    {hasLastNameError && (
                      <FormHelperText error>
                        Last name is required
                      </FormHelperText>
                    )}

                    {/* Validation error */}
                    {lastNameError && (
                      <FormHelperText error>{lastNameError}</FormHelperText>
                    )}

                    {/* Duplicate name error */}
                    {passenger.type.toLowerCase() === "adult" &&
                      adultLastNameDuplicateError && (
                        <FormHelperText error>
                          {adultLastNameDuplicateError}
                        </FormHelperText>
                      )}
                    {passenger.type.toLowerCase() === "child" &&
                      childLastNameDuplicateError && (
                        <FormHelperText error>
                          {childLastNameDuplicateError}
                        </FormHelperText>
                      )}
                    {passenger.type.toLowerCase() === "infant" &&
                      infantLastNameDuplicateError && (
                        <FormHelperText error>
                          {infantLastNameDuplicateError}
                        </FormHelperText>
                      )}
                  </Grid>

                  <Grid item lg={4} xs={12} sm={6} md={4} sx={{ mr: 0 }}>
                    <Select
                      value={getSelectedGender(
                        passengerData[passenger.type.toLowerCase()]?.[
                          passenger.count - 1
                        ]?.gender
                      )}
                      onChange={
                        flightAfterSearch !== "reissue-search"
                          ? (e) =>
                              handleGenderChange(
                                e,
                                passenger.type,
                                passenger.count
                              )
                          : null
                      }
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                      ]}
                      isSearchable={true}
                      isMulti={false}
                      placeholder="SELECT GENDER"
                      styles={customStyles}
                    />

                    {hasGenderError && (
                      <FormHelperText error>Gender is required</FormHelperText>
                    )}
                  </Grid>

                  <Grid
                    item
                    sx={{ my: { xs: "20px", sm: "0px" } }}
                    lg={4}
                    xs={12}
                    sm={6}
                    md={4}
                  >
                    <Box sx={{ position: "relative" }}>
                      <TextField
                        id={`dob-${index}`}
                        name="dob"
                        label="Date Of Birth"
                        variant="outlined"
                        size="small"
                        sx={sharedInputStyles}
                        value={
                          passengerData[passenger.type.toLowerCase()]?.[
                            passenger.count - 1
                          ]?.dateOfBirth
                            ? moment(
                                passengerData[passenger.type.toLowerCase()]?.[
                                  passenger.count - 1
                                ]?.dateOfBirth
                              ).format("DD MMM YYYY")
                            : ""
                        }
                        onClick={
                          flightAfterSearch !== "reissue-search"
                            ? () => {
                                handleCalendarOpen(passenger.paxNo);
                                setOpenExpiryCalendars({});
                              }
                            : null
                        }
                        autoComplete="off"
                      />

                      {/* Display error message if date of birth is missing and firstClick is true */}
                      {hasDateOfBirthError && (
                        <FormHelperText error>
                          Date of birth is required
                        </FormHelperText>
                      )}

                      {!isMobile && openCalendars[passenger?.paxNo] && (
                        <Box
                          sx={{
                            display: {
                              md: "flex",
                              sm: "block",
                              xs: "block",
                            },
                            background: "var(--white)",
                            flexFlow: "column nowrap",
                            border: "1px solid var(--border)",
                            borderTop: "none",
                            width: "100%",
                            left: "0",
                          }}
                          className="new-dashboard-calendar"
                        >
                          <CustomCalendar
                            date={
                              passengerData[passenger.type.toLowerCase()]?.[
                                passenger.count - 1
                              ]?.dateOfBirth
                            }
                            maxDate={
                              passenger.type === "Adult"
                                ? new Date(dateBeforeTwelveYears)
                                : passenger.type === "Child"
                                  ? new Date(dateBeforeTwoYears)
                                  : new Date()
                            }
                            minDate={
                              passenger.type === "Child"
                                ? new Date(dateBeforeTwelveYears)
                                : passenger.type === "Infant"
                                  ? new Date(dateBeforeTwoYears)
                                  : undefined
                            }
                            title={"Date of birth"}
                            handleChange={(date) => {
                              handleBirthDateChange(
                                date,
                                passenger.type,
                                passenger.count
                              );
                              handleCalendarOpen(passenger.paxNo);
                            }}
                          />
                        </Box>
                      )}

                      {isMobile && (
                        <GeneralDrawer
                          isOpen={openCalendars[passenger?.paxNo]}
                          onClose={() => {
                            setOpenCalendars({});
                          }}
                        >
                          <Box
                            className="traveler-box"
                            sx={{ height: "120px" }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignContent: "center",
                                width: "90%",
                                py: 3.5,
                              }}
                            >
                              <ArrowBackIosNewIcon
                                sx={{ color: "white" }}
                                onClick={handleCloseDob}
                              />
                              <Typography
                                sx={{ fontSize: "18px", color: "#fff" }}
                              >
                                Select Date of Birth
                              </Typography>
                              <IconButton></IconButton>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mt: "40px",
                              mx: 2,
                              borderRadius: "5px",
                              width: "90%",
                              mx: "auto",
                            }}
                          >
                            <CustomCalendar
                              date={
                                passengerData[passenger.type.toLowerCase()]?.[
                                  passenger.count - 1
                                ]?.dateOfBirth
                              }
                              maxDate={
                                passenger.type === "Adult"
                                  ? new Date(dateBeforeTwelveYears)
                                  : passenger.type === "Child"
                                    ? new Date(dateBeforeTwoYears)
                                    : new Date()
                              }
                              minDate={
                                passenger.type === "Child"
                                  ? new Date(dateBeforeTwelveYears)
                                  : passenger.type === "Infant"
                                    ? new Date(dateBeforeTwoYears)
                                    : undefined
                              }
                              title={"Date of birth"}
                              handleChange={(date) => {
                                handleBirthDateChange(
                                  date,
                                  passenger.type,
                                  passenger.count
                                );
                                handleCalendarOpen(passenger.paxNo);
                              }}
                            />
                          </Box>
                        </GeneralDrawer>
                      )}
                    </Box>
                  </Grid>

                  <Grid
                    item
                    sx={{
                      my: { lg: "0px", md: "0px", sm: "20px", xs: "0px" },
                    }}
                    lg={4}
                    xs={12}
                    sm={6}
                    md={4}
                  >
                    <Select
                      value={
                        passenger.type === "Adult"
                          ? getSelectedOption(
                              passengerData.adult[passenger.count - 1]
                                ?.passportNation?.name ||
                                passengerData.adult[passenger.count - 1]
                                  ?.passportNation?.code ||
                                "BD"
                            )
                          : passenger.type === "Child"
                            ? getSelectedOption(
                                passengerData.child[passenger.count - 1]
                                  ?.passportNation?.name ||
                                  passengerData.child[passenger.count - 1]
                                    ?.passportNation?.code ||
                                  "BD"
                              )
                            : getSelectedOption(
                                passengerData.infant[passenger.count - 1]
                                  ?.passportNation?.name ||
                                  passengerData.infant[passenger.count - 1]
                                    ?.passportNation?.code ||
                                  "BD"
                              )
                      }
                      onChange={async (selectedOption) => {
                        if (flightAfterSearch !== "reissue-search") {
                          handlePassportNationChange(
                            selectedOption,
                            passenger.type,
                            passenger.count
                          );

                          handleCheckVisaInfo(passenger, selectedOption);
                        }
                      }}
                      onMenuOpen={() => {
                        if (isMobile) {
                          setIsDropdownOpen(true);
                        }
                      }}
                      onMenuClose={() => {
                        if (isMobile) {
                          setIsDropdownOpen(false);
                        }
                      }}
                      onFocus={(e) => {
                        if (isMobile) {
                          setOpenNationalities({ [passenger.paxNo]: true });
                        }
                      }}
                      onClick={() => {
                        if (isMobile) {
                          handleCalendarOpenNatiolality(passenger.paxNo);
                        }
                      }}
                      isSearchable={true}
                      options={options}
                      isMulti={false}
                      placeholder="SELECT NATIONALITY"
                      styles={customStyles}
                      filterOption={filterOption}
                    />

                    {hasPassportNationError && (
                      <FormHelperText error>
                        Passport nationality is required
                      </FormHelperText>
                    )}

                    {isMobile && (
                      <SwipeableDrawer
                        anchor="bottom"
                        open={openNationalities[passenger.paxNo]}
                        onClose={() =>
                          setOpenNationalities((prev) => ({
                            ...prev,
                            [passenger.paxNo]: false,
                          }))
                        }
                        onOpen={() => {}}
                        disableRestoreFocus
                        PaperProps={{
                          sx: {
                            borderRadius: "25px 25px 0 0",
                            mt: 1,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            maxHeight: "80vh",
                            overflowY: "auto",
                            overflow: "hidden",
                            bgcolor: "#fff",
                            borderRadius: "8px",
                            mx: 2,
                            mt: 2,
                          }}
                          onTouchStart={handleTouchStart}
                          onTouchMove={() => {
                            handleTouchMove(passenger.paxNo);
                          }}
                        >
                          <Select
                            value={
                              passenger.type === "Adult"
                                ? getSelectedOption(
                                    passengerData.adult[passenger.count - 1]
                                      ?.passportNation?.name ||
                                      passengerData.adult[passenger.count - 1]
                                        ?.passportNation?.code ||
                                      ""
                                  )
                                : passenger.type === "Child"
                                  ? getSelectedOption(
                                      passengerData.child[passenger.count - 1]
                                        ?.passportNation?.name ||
                                        passengerData.child[passenger.count - 1]
                                          ?.passportNation?.code ||
                                        ""
                                    )
                                  : getSelectedOption(
                                      passengerData.infant[passenger.count - 1]
                                        ?.passportNation?.name ||
                                        passengerData.infant[
                                          passenger.count - 1
                                        ]?.passportNation?.code ||
                                        ""
                                    )
                            }
                            onChange={(selectedOption) => {
                              if (flightAfterSearch !== "reissue-search") {
                                handlePassportNationChange(
                                  selectedOption,
                                  passenger.type,
                                  passenger.count
                                );
                                handleCheckVisaInfo(passenger, selectedOption);
                              }
                            }}
                            onMenuOpen={() => setIsDropdownOpen(true)}
                            onMenuClose={() => setIsDropdownOpen(false)}
                            onFocus={(e) => {
                              if (isMobile) {
                                setOpenNationalities({
                                  [passenger.paxNo]: true,
                                });
                              }
                            }}
                            onClick={() =>
                              handleCalendarOpenNatiolality(passenger.paxNo)
                            }
                            menuIsOpen={true}
                            isSearchable={true}
                            options={options}
                            isMulti={false}
                            placeholder="SELECT NATIONALITY"
                            filterOption={filterOption}
                            styles={{
                              ...customStyles,
                              control: (base) => ({
                                ...base,
                                marginBottom: "84vh",
                                overflow: "hidden",
                                boxShadow: "none",
                              }),
                              menuList: (base) => ({
                                ...base,
                                maxHeight: "80vh",
                              }),
                              menu: (base) => ({
                                ...base,
                                boxShadow: "none",
                              }),
                            }}
                          />
                        </Box>
                      </SwipeableDrawer>
                    )}
                  </Grid>

                  {(flightData?.journeyType === "Outbound" ||
                    (flightData?.journeyType === "Inbound" &&
                      passengerData[passenger.type.toLowerCase()][
                        passenger.count - 1
                      ]?.passportNation?.name &&
                      passengerData[passenger.type.toLowerCase()][
                        passenger.count - 1
                      ]?.passportNation?.name !== "Bangladesh")) && (
                    <Grid
                      item
                      lg={4}
                      md={4}
                      sm={6}
                      xs={12}
                      sx={{
                        my: {
                          xs: "20px",
                          lg: "0px",
                          md: "0px",
                        },
                      }}
                    >
                      <TextField
                        id={`passNo-${index}`}
                        name="passNo"
                        label="Passport No."
                        variant="outlined"
                        size="small"
                        type="text"
                        value={
                          passenger.type === "Adult"
                            ? (
                                passengerData.adult[passenger.count - 1]
                                  ?.passportNumber || ""
                              ).toUpperCase()
                            : passenger.type === "Child"
                              ? (
                                  passengerData.child[passenger.count - 1]
                                    ?.passportNumber || ""
                                ).toUpperCase()
                              : (
                                  passengerData.infant[passenger.count - 1]
                                    ?.passportNumber || ""
                                ).toUpperCase()
                        }
                        className="passportInput"
                        onChange={(e) => {
                          const value = e.target.value;

                          if (flightAfterSearch !== "reissue-search") {
                            if (/^[a-zA-Z0-9]*$/.test(value)) {
                              setPassportNumberError("");
                              handlePassportNumberChange(
                                e,
                                passenger.type,
                                passenger.count
                              );
                            } else {
                              setPassportNumberError(
                                "Passport number must contain only letters and digits."
                              );
                            }
                          }
                        }}
                        sx={sharedInputStyles}
                        focused={
                          passenger.type === "Adult"
                            ? passengerData.adult[passenger.count - 1]
                                ?.passportNumber
                              ? true
                              : false
                            : passenger.type === "Child"
                              ? passengerData.child[passenger.count - 1]
                                  ?.passportNumber
                                ? true
                                : false
                              : passengerData.infant[passenger.count - 1]
                                    ?.passportNumber
                                ? true
                                : false
                        }
                        autoComplete="off"
                      />

                      {/* Error for empty passport number */}
                      {hasPassportNumberError && (
                        <FormHelperText error>
                          Passport number is required
                        </FormHelperText>
                      )}

                      {/* Error for invalid input */}
                      {passportNumberError && (
                        <FormHelperText error>
                          {passportNumberError}
                        </FormHelperText>
                      )}

                      {/* Error for duplicate passport number */}
                      {passenger.type.toLowerCase() === "adult" &&
                        adultPassportNumberDuplicateError && (
                          <FormHelperText error>
                            {adultPassportNumberDuplicateError}
                          </FormHelperText>
                        )}
                      {passenger.type.toLowerCase() === "child" &&
                        childPassportNumberDuplicateError && (
                          <FormHelperText error>
                            {childPassportNumberDuplicateError}
                          </FormHelperText>
                        )}
                      {passenger.type.toLowerCase() === "infant" &&
                        infantPassportNumberDuplicateError && (
                          <FormHelperText error>
                            {infantPassportNumberDuplicateError}
                          </FormHelperText>
                        )}
                    </Grid>
                  )}

                  {/* Passport Expiry Date */}
                  {(flightData?.journeyType === "Outbound" ||
                    (flightData?.journeyType === "Inbound" &&
                      passengerData[passenger.type.toLowerCase()][
                        passenger.count - 1
                      ]?.passportNation?.name &&
                      passengerData[passenger.type.toLowerCase()][
                        passenger.count - 1
                      ]?.passportNation?.name !== "Bangladesh")) && (
                    <Grid
                      item
                      lg={4}
                      md={4}
                      sm={6}
                      xs={12}
                      sx={{ my: { lg: "20px", md: "20px" } }}
                    >
                      <Box sx={{ position: "relative" }}>
                        <TextField
                          id={`doe-${index}`}
                          name="doe"
                          label="Passport Expiry Date"
                          variant="outlined"
                          size="small"
                          sx={sharedInputStyles}
                          value={
                            passenger.type === "Adult"
                              ? passengerData.adult[passenger.count - 1]
                                  ?.passportExpire || ""
                              : passenger.type === "Child"
                                ? passengerData.child[passenger.count - 1]
                                    ?.passportExpire || ""
                                : passengerData.infant[passenger.count - 1]
                                    ?.passportExpire || ""
                          }
                          onClick={() => {
                            if (flightAfterSearch !== "reissue-search") {
                              handleExpiryCalendarOpen(passenger.paxNo);
                              setOpenCalendars({});
                            }
                          }}
                          autoComplete="off"
                        />

                        {hasPassportExpireError && (
                          <FormHelperText error>
                            Passport expiry date is required
                          </FormHelperText>
                        )}

                        {openExpiryCalendars[passenger.paxNo] && (
                          <Box
                            sx={{
                              display: {
                                md: "flex",
                                sm: "block",
                                xs: "block",
                              },
                              background: "var(--white)",
                              flexFlow: "column nowrap",
                              border: "1px solid var(--border)",
                              borderTop: "none",
                              width: "100%",
                              left: "0",
                            }}
                            className="new-dashboard-calendar"
                          >
                            <CustomCalendar
                              minDate={new Date(passportExpiry)}
                              maxDate={new Date(dateAfterTenYears)}
                              date={new Date(passportExpiry)}
                              title={"Expire Date"}
                              handleChange={(date) => {
                                handleExpiryDateChange(
                                  date,
                                  passenger.type,
                                  passenger.count,
                                  passenger.paxNo
                                );
                                handleExpiryCalendarOpen(passenger.paxNo);
                              }}
                            />
                          </Box>
                        )}

                        {isMobile && (
                          <GeneralDrawer
                            isOpen={openExpiryCalendars[passenger?.paxNo]}
                            onClose={() => {
                              setOpenExpiryCalendars({});
                            }}
                          >
                            <Box
                              className="traveler-box"
                              sx={{ height: "120px" }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignContent: "center",
                                  width: "90%",
                                }}
                              >
                                <ArrowBackIosNewIcon
                                  sx={{ color: "white" }}
                                  onClick={() => {
                                    setOpenExpiryCalendars({});
                                  }}
                                />
                                <Typography
                                  sx={{ fontSize: "18px", color: "#fff" }}
                                >
                                  Select Passport Expiry Date
                                </Typography>
                                <IconButton></IconButton>
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: "40px",
                                mx: 2,
                                borderRadius: "5px",
                                width: "90%",
                                mx: "auto",
                              }}
                            >
                              <Calendar
                                months={1}
                                minDate={new Date(passportExpiry)}
                                maxDate={new Date(dateAfterTenYears)}
                                date={new Date(passportExpiry)}
                                onChange={(date) => {
                                  handleExpiryDateChange(
                                    date,
                                    passenger.type,
                                    passenger.count,
                                    passenger.paxNo
                                  );
                                  handleExpiryCalendarOpen(passenger.paxNo);
                                }}
                              />
                            </Box>
                          </GeneralDrawer>
                        )}
                      </Box>
                    </Grid>
                  )}

                  {/* Documents upload portion */}
                  {(flightData?.journeyType === "Outbound" ||
                    (flightData?.journeyType === "Inbound" &&
                      passengerData[passenger.type.toLowerCase()][
                        passenger.count - 1
                      ]?.passportNation?.name &&
                      passengerData[passenger.type.toLowerCase()][
                        passenger.count - 1
                      ]?.passportNation?.name !== "Bangladesh")) &&
                    flightAfterSearch !== "reissue-search" && (
                      <Grid
                        container
                        item
                        lg={12}
                        xs={12}
                        columnSpacing={"20px"}
                        sx={{ mt: { lg: 0, xs: "15px" } }}
                        key={index}
                      >
                        {agentData?.agentData?.agentCms?.eligibilityCms
                          ?.passportRequiredForBooking && (
                          <Grid item lg={4.5} md={4.2} sm={5.8} xs={12}>
                            <Box sx={{ mb: { xs: 2, lg: 0 } }}>
                              <ImageUploadFile
                                id={`passportImage-${index}`}
                                label={"Passport Copy"}
                                onFileChange={(file) => {
                                  handlePassportUploadClick(
                                    file,
                                    passenger.type,
                                    passenger.count,
                                    passenger.paxNo
                                  );
                                }}
                                passengerType={passenger.type}
                                passengerCount={passenger.count}
                                paxNumber={passenger.paxNo}
                                documentType={
                                  passengerData[passenger.type.toLowerCase()][
                                    passenger.count - 1
                                  ]?.passportImage
                                    ? "passport"
                                    : null
                                }
                              />

                              {hasPassportCopyError && (
                                <FormHelperText error>
                                  Passport copy is required
                                </FormHelperText>
                              )}
                            </Box>
                          </Grid>
                        )}

                        {agentData?.agentData?.agentCms?.eligibilityCms
                          ?.visaRequiredForBooking && (
                          <Grid item lg={4.5} md={4.2} sm={5.8} xs={12}>
                            <Box sx={{ mb: { xs: 2, lg: 0 } }}>
                              <ImageUploadFile
                                id={`vidaImage-${index}`}
                                label={"Visa Copy"}
                                onFileChange={(file) =>
                                  handleVisaUploadClick(
                                    file,
                                    passenger.type,
                                    passenger.count,
                                    passenger.paxNo
                                  )
                                }
                                passengerType={passenger.type}
                                passengerCount={passenger.count}
                                paxNumber={passenger.paxNo}
                                documentType={
                                  passengerData[passenger.type.toLowerCase()][
                                    passenger.count - 1
                                  ]?.visaImage
                                    ? "visa"
                                    : null
                                }
                                // documentType={"visa"}
                              />

                              {hasVisaCopyError && (
                                <FormHelperText error>
                                  Visa copy is required
                                </FormHelperText>
                              )}
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    )}

                  {flightAfterSearch !== "reissue-search" && (
                    <Grid
                      item
                      lg={6}
                      md={4.2}
                      sm={5.8}
                      xs={12}
                      sx={{
                        mt: { xs: "15px", md: "10px" },
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{ p: "3px" }}
                            checked={
                              passengerData[passenger.type.toLowerCase()][
                                passenger.count - 1
                              ]?.frequentTraveler || false
                            }
                            onClick={() => {
                              setOpenClientModal(true);
                              setClientModalData(
                                passengerData[passenger.type.toLowerCase()][
                                  passenger.count - 1
                                ]
                              );
                              setFrequentPax({
                                type: passenger.type.toLowerCase(),
                                count: passenger.count,
                              });
                            }}
                          />
                        }
                        label={
                          <Typography
                            sx={{
                              fontSize: "13px",
                              fontWeight: "500",
                              color: "var(--gray)",
                              pt: "3px",
                            }}
                          >
                            Save The Passenger
                          </Typography>
                        }
                        sx={{
                          alignItems: "center",
                          gap: "5px",
                          m: 0,
                        }}
                      />
                    </Grid>
                  )}

                  {passengerDataItem && (
                    <Grid item xs={12}>
                      {passengerDataItem?.isVisaChecking ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            border: "1px solid red",
                            px: "10px",
                            height: "52px",
                            bgcolor: "#FDF5F5",
                            borderRadius: "4px",
                            gap: 1,
                            width: "100%",
                            mt: 2,
                          }}
                        >
                          <Skeleton
                            sx={{ borderRadius: "2px" }}
                            variant="rectangular"
                            width={"100%"}
                            height={"12px"}
                            animation="wave"
                          />
                          <Skeleton
                            sx={{ borderRadius: "2px" }}
                            variant="rectangular"
                            width={"100%"}
                            height={"12px"}
                            animation="wave"
                          />
                        </Box>
                      ) : (
                        <>
                          {Array.isArray(passengerDataItem?.visaInfo) &&
                            passengerDataItem.visaInfo
                              .filter((item) => item?.visa && item?.message)
                              .map((item, i) => (
                                <Box
                                  key={i}
                                  sx={{
                                    ".MuiSvgIcon-root": {
                                      color: "var(--primary-color)",
                                    },
                                    mt: 2,
                                  }}
                                >
                                  <Alert
                                    severity="info"
                                    sx={{
                                      border: "1px solid var(--primary-color)",
                                      bgcolor: "#FDF5F5",
                                      color: "var(--primary-color)",
                                      fontSize: "12px",
                                      padding: "0px 10px",
                                    }}
                                  >
                                    <span style={{ fontWeight: "600" }}>
                                      {item.visa}:
                                    </span>{" "}
                                    {item.message}
                                  </Alert>
                                </Box>
                              ))}
                        </>
                      )}
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Collapse>
          </Box>
        );
      })}

      <PassportScanModal
        open={open}
        handleClose={handleClose}
        index={paxIndex}
        paxType={paxItemType}
        handlePassportUploadClick={handlePassportUploadClick}
        paxNo={paxNo}
        departureDate={departureDate}
      />

      <Modal
        open={openClientModal}
        onClose={() => {
          setOpenClientModal(false);
        }}
      >
        <Box sx={clientModalStyle}>
          <AddClient
            from={"passengerBox"}
            clientModalData={clientModalData}
            handleFrequentFlyerChange={handleFrequentFlyerChange}
            frequentPax={frequentPax}
            setOpenClientModal={setOpenClientModal}
          />
        </Box>
      </Modal>
    </Box>
  );
};

const clientModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#fff",
  boxShadow: 24,
  width: "50%",
  height: "auto",
  borderRadius: "10px",
  overflow: "hidden",
};

export default PassengerBox;
