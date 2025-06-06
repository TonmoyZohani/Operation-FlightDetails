/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

const allDomesticCodes = [
  "DAC",
  "CGP",
  "ZYL",
  "CXB",
  "JSR",
  "BZL",
  "RJH",
  "SPD",
];

export const checkDomestic = (code) => allDomesticCodes.includes(code);

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isStrongPassword = (password) => {
  // At least one uppercase letter, one lowercase letter, one number, and one special character
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  return strongPasswordRegex.test(password);
};

export const numberToWords = (num) => {
  if (num === 0) return "Zero";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "Ten",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const thousands = ["", "Thousand", "Million", "Billion"];

  function convertChunk(num) {
    let result = "";

    if (num >= 100) {
      result += ones[Math.floor(num / 100)] + " Hundred ";
      num %= 100;
    }

    if (num >= 11 && num <= 19) {
      result += teens[num - 11] + " ";
      return result.trim();
    }

    if (num >= 10) {
      result += tens[Math.floor(num / 10)] + " ";
      num %= 10;
    }

    if (num > 0) {
      result += ones[num] + " ";
    }

    return result.trim();
  }

  function convertWholeNumber(num) {
    let result = "";
    let chunkIndex = 0;

    while (num > 0) {
      let chunk = num % 1000;
      if (chunk > 0) {
        result =
          convertChunk(chunk) +
          (thousands[chunkIndex] ? " " + thousands[chunkIndex] : "") +
          " " +
          result;
      }
      num = Math.floor(num / 1000);
      chunkIndex++;
    }

    return result.trim();
  }

  const [wholePart, decimalPart] = num.toString().split(".");
  const wholeText = convertWholeNumber(parseInt(wholePart, 10));
  const decimalText = decimalPart
    ? convertChunk(parseInt(decimalPart.padEnd(2, "0").slice(0, 2))) + " Cents"
    : "";

  return (wholeText + (decimalText ? " and " + decimalText : "")).trim();
};


export const handleCopyFlightData = async (flightData) => {
  if (!flightData) {
    console.error("Invalid flightData: ", flightData);
    return;
  }

  const {
    tripType,
    cityCount,
    goDeparture,
    goArrival,
    backArrival,
    departure,
    arrival,
  } = flightData;
  let destination = "";

  if (tripType === "multiCity") {
    destination = Array.from(
      new Set(
        cityCount?.reduce((acc, flight) => {
          if (flight?.departureLocation) acc.push(flight.departureLocation);
          if (flight?.arrivalLocation) acc.push(flight.arrivalLocation);
          return acc;
        }, []) || []
      )
    ).join(" - ");
  } else if (tripType === "roundway") {
    destination = [goDeparture, goArrival, backArrival]
      .filter(Boolean)
      .join(" - ");
  } else if (tripType === "oneway") {
    destination = [departure, arrival].filter(Boolean).join(" - ");
  } else {
    console.warn("Unknown trip type:", tripType);
  }

  return destination;
};

export const textFieldProps = (name, label, type = "text") => {
  return {
    variant: "outlined",
    fullWidth: true,
    size: "small",
    type,
    id: name,
    name,
    label,
  };
};

export const notify = (message, callback) => {
  toast(message, {
    className: "custom-toast",
    autoClose: 2000,
    onClose: callback,
  });
};

export const moneyReciptValidation = (type) =>
  Yup.string()
    .matches(/^[a-zA-Z0-9]*$/, "Only letters and numbers are allowed")
    .min(2, "Minimum length is 2 characters")
    .max(50, "Maximum length is 50 characters")
    .required(`${type} is required`);

export const amountValidation = (type) =>
  Yup.string()
    .matches(
      /^[1-9][0-9]*(\.[0-9]{1,2})?$/,
      "Only numbers are allowed, with up to two decimal places"
    )
    .min(1, "Minimum length is 1 character")
    .max(50, "Maximum length is 50 characters")
    .required(`${type} is required`);

export const personNameValidation = (type) =>
  Yup.string()
    .matches(/^[^\d]*$/, "Numbers are not allowed")
    .matches(/^[a-zA-Z].*$/, "Cannot start with any symbol or spaces")
    .matches(
      /^(?!.*([.\-\s])\1)(?!.*\s{2,})[a-zA-Z.\-\s]*$/,
      "No consecutive symbols or spaces allowed"
    )
    .matches(/^[a-zA-Z.\-\s]*[^\s.\\-]$/, "Cannot end with a symbol or space")
    .matches(
      /^[a-zA-Z.\-\s]*$/,
      "Only . and - are allowed as special characters"
    )
    .min(2, "Minimum length is 2 characters")
    .max(50, "Maximum length is 50 characters")
    .required(`${type} is required`);

export const companyNameValidation = (type) =>
  Yup.string()
    .matches(
      /^[^\s`~!@#$%^&*()_\-+=\\{}[\]|\\:;"'<>,.?/].*$/u,
      "Cannot start with a symbol or space"
    )
    .matches(
      /.*[^\s`~!@#$%^&*()_\-+=\\{}[\]|\\:;"'<>,.?/]$/u,
      "Cannot end with a symbol or space"
    )
    .matches(
      /^[^`~!@#$%^*()_+=\\{}[\]|\\:;"<>,.?/]*$/u,
      "Invalid characters used. Only specific symbols are allowed."
    )
    .matches(/^[^\d]*$/u, "Cannot contain any numbers")
    .min(2, "Minimum length is 2 characters")
    .max(50, "Maximum length is 50 characters")
    .required(`${type} name is required`);

// export const fileTypeValid = (message) => {
//   return Yup.mixed()
//     .test(
//       "is-string-or-object",
//       `${message} must be a valid file or a string`,
//       (value) => typeof value === "string" || value instanceof File
//     )
//     .required(`${message} is required`)
//     .test(
//       "fileSize",
//       "File Size is too large (max 2 MB)",
//       (value) =>
//         typeof value === "string" || (value && value.size <= 2 * 1024 * 1024)
//     )
//     .test(
//       "fileType",
//       "Unsupported File Format",
//       (value) =>
//         typeof value === "string" ||
//         (value &&
//           ["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(
//             value.type
//           ))
//     );
// };

export const fileTypeValid = (message, isRequired = true) => {
  let schema = Yup.mixed()
    .nullable() // Allow null or undefined values initially
    .test(
      "is-string-or-object",
      `${message} must be a valid file or a string`,
      (value) =>
        value === null || // Allow null for optional fields
        value === undefined || // Allow undefined
        typeof value === "string" ||
        value instanceof File
    )
    .test(
      "fileSize",
      "File Size is too large (max 2 MB)",
      (value) =>
        value === null ||
        value === undefined ||
        typeof value === "string" ||
        (value && value.size <= 2 * 1024 * 1024)
    )
    .test(
      "fileType",
      "Unsupported File Format",
      (value) =>
        value === null ||
        value === undefined ||
        typeof value === "string" ||
        (value &&
          ["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(
            value.type
          ))
    );

  if (isRequired) {
    schema = schema.required(`${message} is required`);
  }

  return schema;
};

export const phoneValidation = (type) =>
  Yup.string()
    // .matches(/^88/, `${type} Number must start with "88"`)
    .min(8, `${type} Number is invalid`)
    .max(18, `${type} Number must be maximum 18 characters`)
    .required(`${type} Number is required`);

export const emailValidation = (type) =>
  Yup.string()

    .email("Invalid email address")
    .required(`${type} Email Address is required`);

export const initialPartner = () => ({
  id: "",
  agentId: "",
  name: "",
  phoneNumber: "",
  email: "",
  whatsappNumber: "",
  dateOfBirth: "",
  gender: "",
  nationality: "Bangladesh",
  nidFront: null,
  nidBack: null,
  photo: null,
  tin: null,
  signature: null,
  priority: 0,
  accountCreator: 0,
  createdAt: "",
  updatedAt: "",
  isOpenCal: false,
  isSameNumber: false,
});

export function convertCamelToTitle(camelCaseStr) {
  return camelCaseStr
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

export const getOrdinal = (num) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const value = num % 100;
  return num + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
};

export const phoneInputProps = (name, value) => {
  return {
    inputProps: { id: name },
    inputStyle: { width: "100%", height: "100%" },
    value,
    country: "bd",
    countryCodeEditable: false,
  };
};

export const PassengerPriceBreakdown = ({ item, isNotEquals }) => {
  return (
    <Box sx={{ px: "12px", pb: "10px" }}>
      {/* Determine passenger type */}
      <Typography
        sx={{ color: "#3C4258", fontSize: "0.85rem", fontWeight: "500" }}
      >
        {/* {item?.paxType === "ADT" && `Adult`}
        {item?.paxType === "CNN" && <>{`Child`}</>}
        {item?.paxType === "INF" && `Infant`} */}
        {item?.firstName} {item?.lastName}{" "}
        <span style={{ fontSize: "0.6rem" }}>
          ({item?.paxType || item?.type})
        </span>
      </Typography>

      {/* Display Base Fare */}
      <Box sx={{ display: "flex", justifyContent: "space-between", pt: "4px" }}>
        <Typography
          sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
        >
          Base Fare
        </Typography>
        <Typography
          sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
        >
          {isNotEquals
            ? "Will be decided"
            : item?.baseFare?.toLocaleString("en-IN")}{" "}
          {isNotEquals ? "" : "BDT"}
        </Typography>
      </Box>

      {/* Display Tax */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
        >
          Tax
        </Typography>
        <Typography
          sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
        >
          {isNotEquals ? "Will be decided" : item?.tax?.toLocaleString("en-IN")}{" "}
          {isNotEquals ? "" : "BDT"}
        </Typography>
      </Box>
    </Box>
  );
};

export const PassengerMarkupPriceBreakdown = ({
  item,
  isNotEquals,
  markupData,
}) => {
  return (
    <Box sx={{ px: "12px", pb: "10px" }}>
      {/* Determine passenger type */}
      <Typography
        sx={{ color: "#3C4258", fontSize: "0.85rem", fontWeight: "500" }}
      >
        {item?.paxType === "ADT" && `Adult x${item?.paxCount}`}
        {item?.paxType === "CNN" && `Child x${item?.paxCount}`}
        {item?.paxType === "INF" && `Infant x${item?.paxCount}`}
      </Typography>

      {/* Display Markup */}
      <Box sx={{ display: "flex", justifyContent: "space-between", pt: "4px" }}>
        <Typography
          sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
        >
          Markup
        </Typography>
        <Typography
          sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
        >
          {isNotEquals
            ? "Will be decided"
            : markupData?.find((markup) => markup?.paxType === item?.paxType)
                ?.amount * item?.paxCount || 0}{" "}
          {isNotEquals ? "" : "BDT"}
        </Typography>
      </Box>
    </Box>
  );
};

export const RefundQuotationPassengerPriceBreakdown = ({ item }) => {
  return (
    <Box sx={{ px: "12px", pb: "10px" }}>
      {/* Determine passenger type */}
      <Typography
        sx={{ color: "#3C4258", fontSize: "0.85rem", fontWeight: "500" }}
      >
        {item?.paxType === "ADT" && `Adult x${item?.paxCount}`}
        {item?.paxType === "CNN" && (
          <>
            {`Child x${item?.paxCount} `}
            <span
              style={{ color: "var(--primary-color)", fontSize: "0.813rem" }}
            >
              {`[Age: ${item?.ages?.join(",")}]`}
            </span>
          </>
        )}
        {item?.paxType === "INF" && `Infant x${item?.paxCount}`}
      </Typography>

      {/* Display Base Fare */}
      <Box sx={{ display: "flex", justifyContent: "space-between", pt: "4px" }}>
        <Typography
          sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
        >
          Base Fare
        </Typography>
        <Typography
          sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
        >
          {item?.baseFare?.toLocaleString("en-IN")} BDT
        </Typography>
      </Box>

      {/* Display Tax */}
      <Box sx={{ display: "flex", justifyContent: "space-between", pt: "3px" }}>
        <Typography
          sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
        >
          Tax
        </Typography>
        <Typography
          sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
        >
          {item?.tax?.toLocaleString("en-IN")} BDT
        </Typography>
      </Box>
    </Box>
  );
};

export const FareRulesChargesData = ({ structure }) => {
  const reissueData = structure?.filter((item) =>
    item?.name?.toLowerCase()?.includes("reissue")
  );
  const refundData = structure?.filter((item) =>
    item?.name?.toLowerCase()?.includes("refund")
  );

  return (
    <Box sx={{ pb: "10px" }}>
      {/* Reissue Charges Section */}
      {reissueData?.length > 0 && (
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: "0.85rem",
            fontWeight: "500",
            mt: "10px",
            color: "var(--primary-color)",
          }}
        >
          Reissue Charges
        </Typography>
      )}
      {reissueData?.length > 0 &&
        reissueData?.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: "4px",
            }}
          >
            <Typography
              sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
            >
              {item?.name
                ?.replace(/Reissue\s*/i, "")
                .replace(/^./, (str) => str.toUpperCase())
                .trim()}
            </Typography>
            <Typography
              sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
            >
              {(item?.convertedAmount || 0).toLocaleString("en-IN")}{" "}
              {item?.convertedCurrencyCode}
            </Typography>
          </Box>
        ))}

      {/* Refund Charges Section */}
      {refundData?.length > 0 && (
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: "0.85rem",
            fontWeight: "500",
            mt: "10px",
            color: "var(--primary-color)",
          }}
        >
          Refund Charges
        </Typography>
      )}
      {refundData?.length > 0 &&
        refundData.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: "4px",
            }}
          >
            <Typography
              sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
            >
              <span>
                {item?.name
                  ?.replace(/Refund\s*/i, "")
                  .replace(/^./, (str) => str.toUpperCase())
                  .trim()}
              </span>
            </Typography>
            <Typography
              sx={{ color: "gray", fontSize: "0.813rem", fontWeight: "500" }}
            >
              {(item?.convertedAmount || 0).toLocaleString("en-IN")}{" "}
              {item.convertedCurrencyCode}
            </Typography>
          </Box>
        ))}
    </Box>
  );
};

export const calculateTransiteTime = (arrivalTime, departureTime) => {
  const segmentTwoDeparture = new Date(departureTime);
  const segmentOneArrival = new Date(arrivalTime);

  // Calculate the time difference in milliseconds
  const timeDifferenceMs = segmentTwoDeparture - segmentOneArrival;

  // Convert the time difference to hours and minutes
  const hours = Math.floor(timeDifferenceMs / (60 * 60 * 1000));
  const minutes = Math.floor(
    (timeDifferenceMs % (60 * 60 * 1000)) / (60 * 1000)
  );

  return `${hours}H ${minutes}Min`;
};

export const getFareAndTax = (
  passengers,
  priceDetails,
  setUpdatePassengerRow
) => {
  passengers.forEach((passenger) => {
    let baseFare = "N/A";
    let tax = "N/A";
    let discount = "N/A";
    let totalAmount = "N/A";

    if (passenger.type === "ADT" || passenger.type === "INF") {
      const matchingPrice = priceDetails.find(
        (price) => price.paxType === passenger.type
      );
      if (matchingPrice) {
        baseFare = matchingPrice.baseFare.toLocaleString("en-IN") + " ৳";
        tax = matchingPrice.tax.toLocaleString("en-IN") + " ৳";
        discount = matchingPrice.discount
          ? matchingPrice.discount.toLocaleString("en-IN") + " ৳"
          : "0 ৳";
        totalAmount = matchingPrice.totalAmount.toLocaleString("en-IN") + " ৳";
      }
    }

    if (passenger.type === "CNN") {
      const matchingPrice = priceDetails.find(
        (price) =>
          price.paxType === passenger.type &&
          (Array.isArray(price.age)
            ? price.age.includes(passenger.age)
            : price.age === passenger.age)
      );
      if (matchingPrice) {
        baseFare = matchingPrice.baseFare.toLocaleString("en-IN") + " ৳";
        tax = matchingPrice.tax.toLocaleString("en-IN") + " ৳";
        discount = matchingPrice.discount
          ? matchingPrice.discount.toLocaleString("en-IN") + " ৳"
          : "0 ৳";
        totalAmount = matchingPrice.totalAmount.toLocaleString("en-IN") + " ৳";
      }
    }

    const updatedPassenger = {
      ...passenger,
      baseFare,
      tax,
      discount,
      totalAmount,
    };
    setUpdatePassengerRow((prevRows) =>
      prevRows.map((row) =>
        row.id === updatedPassenger.id ? updatedPassenger : row
      )
    );
  });
};

export const transformArray = (main) => {
  const transformed = [];

  main.forEach((item) => {
    const { departure, arrival, hiddenStops, flightDuration, ...rest } = item;

    if (hiddenStops.length > 0) {
      const {
        cityCode,
        cityName,
        airportName,
        departureTime,
        departureDate,
        arrivalTime,
        arrivalDate,
        arrivalDateTime,
        departureDateTime,
        elapsedLayOverTime,
        elapsedTime,
        countryName,
        countryCode,
      } = hiddenStops[0];

      transformed.push({
        ...rest,
        departure,
        arrival: cityCode,
        arrivalCityCode: cityCode,
        arrivalCityName: cityName,
        arrivalAirport: airportName,
        arrivalTime,
        arrivalDate,
        arrivalDateTime,
        arrivalCountryName: countryName,
        elapsedLayOverTime: elapsedLayOverTime,
        hiddenStops,
        arrivalCountryCode: countryCode,
      });

      transformed.push({
        ...rest,
        departure: cityCode,
        departureCityCode: cityCode,
        departureCityName: cityName,
        arrival,
        departureAirport: airportName,
        departureTime,
        departureDate,
        departureDateTime,
        elapsedTime: elapsedTime,
        departureCountryName: countryName,
        departureCountryCode: countryCode,
        // elapsedLayOverTime: calculateTimeDifference(
        //   flightDuration,
        //   elapsedLayOverTime
        // ),
        elapsedLayOverTime: elapsedLayOverTime,
        dTerminal: "",
        aTerminal: "",
        hiddenStops: [],
      });
    } else {
      transformed.push(item);
    }
  });

  return transformed;
};

// function calculateTimeDifference(time1, time2) {
//   const [hours1, minutes1] = time1
//     .replace("H", "")
//     .replace("Min", "")
//     .trim()
//     .split(" ");
//   const [hours2, minutes2] = time2
//     .replace("H", "")
//     .replace("Min", "")
//     .trim()
//     .split(" ");

//   const totalMinutes1 = parseInt(hours1) * 60 + parseInt(minutes1);
//   const totalMinutes2 = parseInt(hours2) * 60 + parseInt(minutes2);

//   const difference = Math.abs(totalMinutes1 - totalMinutes2);

//   const hoursDiff = Math.floor(difference / 60);
//   const minutesDiff = difference % 60;

//   return `${hoursDiff}H ${minutesDiff}Min`;
// }

// Location

export const fetchAPI = async (url, jsonHeader) => {
  try {
    const response = await axios.get(url, jsonHeader());
    const responseData = response?.data;
    if (responseData?.success === true) {
      return responseData?.data;
    }
  } catch (err) {
    console.error(err.message);
  }
};

export const fetchDivisionData = async (setDivisions, jsonHeader) => {
  const divisionData = await fetchAPI(
    `${process.env.REACT_APP_BASE_URL}/api/v1/common/locations/divisions`,
    jsonHeader
  );
  return setDivisions(divisionData);
};

export const fetchDistrictData = async (division, setDistricts, jsonHeader) => {
  if (division) {
    const districtData = await fetchAPI(
      `${process.env.REACT_APP_BASE_URL}/api/v1/common/locations/districts?divisionName=${division}`,
      jsonHeader
    );
    return setDistricts(districtData);
  }
};

export const fetchUpazillaData = async (district, setUpazillas, jsonHeader) => {
  if (district) {
    const upazillaData = await fetchAPI(
      `${process.env.REACT_APP_BASE_URL}/api/v1/common/locations/upazillas?districtName=${district}`,
      jsonHeader
    );
    return setUpazillas(upazillaData);
  }
};

export const fetchPostCodeData = async (
  division,
  district,
  setPostalCodes,
  jsonHeader
) => {
  if (division && district) {
    const postalCodeData = await fetchAPI(
      `${process.env.REACT_APP_BASE_URL}/api/v1/common/locations/postcodes?divisionName=${division}&districtName=${district}`,
      jsonHeader
    );
    setPostalCodes(postalCodeData);
  }
};

// Document list
export const reqDocFields = [
  {
    label: "Concern Photo",
    name: "photo",
  },
  {
    label: "Concern NID Front",
    name: "nidFront",
  },
  {
    label: "Concern NID Back",
    name: "nidBack",
  },
  {
    label: "Company Logo",
    name: "logo",
  },
  {
    label: "Trade Licence",
    name: "tradeLicence",
  },
  {
    label: "Concern Tin Certificate",
    name: "utilityTin",
  },
  {
    label: "Office Image",
    name: "officeImage",
  },
  {
    label: "Office Signboard Image",
    name: "officeSignboardImage",
  },
];

export const maskEmail = (email) => {
  const [localPart, domain] = email.split("@");
  const [domainName, domainExt] = domain.split(".");

  const maskedLocal = `${localPart[0]}${"*".repeat(localPart.length - 1)}`;
  const maskedDomain = `${domainName[0]}${"*".repeat(domainName.length - 1)}.${domainExt}`;

  return `${maskedLocal}@${maskedDomain}`;
};

export const apiRequest = async ({
  url,
  method,
  data = {},
  params = {},
  headers = "",
}) => {
  try {
    const config = {
      url,
      method,
      headers,
      params,
      data,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "An unknown error occurred" };
  }
};

export const textToLogo = (text) => {
  if (!!text === false) return "FF";

  const textArr = text.split(" ");
  if (textArr.length > 1) {
    return (textArr[0][0] + textArr[1][0]).toUpperCase();
  } else {
    return (textArr[0][0] + textArr[0][1]).toUpperCase();
  }
};

const audioExtensions = [
  ".mp3",
  ".wav",
  ".ogg",
  ".flac",
  ".aac",
  ".m4a",
  ".wma",
  ".webm",
  ".opus",
  ".aiff",
  ".alac",
];

export const isAudio = (input) => {
  if (input instanceof File || input instanceof Blob) {
    return input.type.startsWith("audio/");
  }

  if (typeof input === "string") {
    const extension = input.substring(input.lastIndexOf(".")).toLowerCase();
    if (audioExtensions.includes(extension)) {
      return true;
    }

    const audio = new Audio();
    audio.src = input;
    return new Promise((resolve) => {
      audio.addEventListener("canplaythrough", () => resolve(true), {
        once: true,
      });
      audio.addEventListener("error", () => resolve(false), { once: true });
    });
  }

  return false;
};
