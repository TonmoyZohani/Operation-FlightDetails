import {
  Document,
  Page,
  Image as PdfImage,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import moment from "moment";
import React from "react";
import emergencyImg from "../..//images/emergengy.png";
import airplan from "../../images/logo/airplan.png";
import {
  calculateTransiteTime,
  convertCamelToTitle,
} from "../../shared/common/functions";

const PDFPageDesign = ({
  singleBooking,
  agentData,
  copy,
  passengers,
  paxType,
  quotation = false,
  ticket = false,
  newAgentPrice,
  bookingType = "",
  bookingTypeData = {},
}) => {
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#fff",
      padding: "30px 25px",
    },
    section: {
      margin: 3,
      padding: 0,
      flexGrow: 1,
    },
    bordered: {
      border: "1px solid #202124",
    },
    boldText: {
      fontFamily: "Helvetica-Bold",
    },
    image: {
      width: 30,
      height: 30,
    },
  });

  const individualPax = singleBooking?.details?.priceBreakdown?.find(
    (item) => item?.paxType === paxType
  );

  // numbers to word funcations
  function numberToWords(number) {
    const units = [
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
      "",
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

    function convertLessThanOneThousand(number) {
      let words = "";

      if (number >= 100) {
        words += units[Math.floor(number / 100)] + " Hundred ";
        number %= 100;
      }

      if (number % 100 < 10) {
        words += units[number % 100];
      } else if (number % 100 < 20) {
        words += teens[number % 10];
      } else {
        words += tens[Math.floor((number % 100) / 10)];
        if (number % 10 > 0) {
          words += ` ${units[number % 10]}`;
        }
      }

      return words;
    }

    function convert(number) {
      if (number === 0) return "Zero";

      let words = "";

      if (number < 0) {
        words += "Negative ";
        number = Math.abs(number);
      }

      if (number >= 1000000) {
        words += convert(Math.floor(number / 1000000)) + " Million ";
        number %= 1000000;
      }

      if (number >= 1000) {
        words += convert(Math.floor(number / 1000)) + " Thousand ";
        number %= 1000;
      }

      if (number > 0) {
        words += convertLessThanOneThousand(number);
      }

      return words.trim();
    }

    return convert(Math.round(number));
  }

  const clientFareTotalAmount = singleBooking?.agentPrice;
  const words = numberToWords(
    paxType ? individualPax?.singleAgentPrice : clientFareTotalAmount
  );

  return (
    <Document>
      <Page size="A4" style={styles?.page}>
        {/* --- header section start --- */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <View style={{ paddingTop: "5px" }}>
              <Text style={{ fontSize: "9px", marginBottom: "5px" }}>
                PREPARED BY
              </Text>
              <Text style={{ fontSize: "12px", fontWeight: 600 }}>
                {agentData?.agent?.agencyInformation?.agencyName}
              </Text>

              <Text style={{ fontSize: "7px", paddingTop: "3px" }}>
                Email: {agentData?.agent?.agencyInformation?.email}
              </Text>
              <Text style={{ fontSize: "7px", paddingTop: "3px" }}>
                Hotline: {agentData?.agent?.agencyInformation?.phoneNumber}
              </Text>
              <Text style={{ fontSize: "7px", paddingTop: "3px" }}>
                Address: {agentData?.userProfile?.bangladeshAddress?.address}
              </Text>
            </View>
          </View>
          <View style={{ textAlign: "right" }}>
            {/* <Text style={{ fontSize: "6px" }}>Scan to verify ticket</Text> */}
            <PdfImage
              style={{
                width: "70px",
                height: "65px",
                paddingTop: "5px",
                marginRight: "10px",
                paddingRight: "15px",
                objectFit: "fill",
              }}
              src={
                "https://storage.googleapis.com/flyfar-user-document-bucket/user-doc/PDF_QR.png"
              }
            />
          </View>
        </View>
        {/* --- header section end --- */}

        {/* --- Reference area start --- */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "9px 0",
            borderTop: "2px solid #000",
            marginTop: "10px",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Text
              style={{ ...styles.boldText, color: "#000", fontSize: "11px" }}
            >
              {quotation ? "TRIP TYPE:" : "REFERENCE :"}
            </Text>
            <Text
              style={{
                color: "#000",
                fontSize: "11px",
                textTransform: "uppercase",
              }}
            >
              {quotation
                ? singleBooking?.tripType
                : `${singleBooking?.bookingId} | ${singleBooking?.tripType}`}
            </Text>
          </View>
          {!quotation && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Text
                style={{ ...styles.boldText, color: "#000", fontSize: "11px" }}
              >
                AIRLINES PNR:
              </Text>
              <Text style={{ color: "#000", fontSize: "11px" }}>
                {singleBooking?.airlinePnr}
              </Text>
            </View>
          )}
        </View>
        {/* --- Reference area end --- */}
        {/* --- departure & arrival title here start --- */}

        {singleBooking?.details?.cityCount?.map((cities, index) => {
          return (
            <View key={index}>
              <View
                style={{
                  flexDirection: "row",
                  gap: "15px",
                  paddingTop: "8px",
                  borderTop: "2px solid #000",
                }}
              >
                <View>
                  <PdfImage
                    style={{ width: "25px", height: "25px" }}
                    src={airplan}
                  />
                </View>
                {singleBooking?.details &&
                  cities?.map((city, i) => (
                    <View style={{ flexDirection: "row", gap: "25px" }} key={i}>
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          {i === 0 && (
                            <Text style={{ color: "#000", fontSize: "10px" }}>
                              DEPARTURE:
                            </Text>
                          )}

                          <Text
                            style={{
                              ...styles.boldText,
                              color: "#000",
                              fontSize: "10px",
                              textTransform: "uppercase",
                            }}
                          >
                            {i === 0 && city?.departure}{" "}
                            {i === 0 &&
                              city?.departureDate &&
                              moment(city.departureDate).format("dddd D MMM")}
                          </Text>
                        </View>

                        {i === 0 && (
                          <Text
                            style={{
                              fontSize: "7.5px",
                              color: "#5F646C",
                              paddingTop: "3px",
                              textTransform: "uppercase",
                            }}
                          >
                            Please verify flight duration{" "}
                            <Text
                              style={{
                                ...styles.boldText,
                                color: "#000",
                                fontSize: "8px",
                                textTransform: "uppercase",
                              }}
                            >
                              {city?.totalFlightDuration}
                            </Text>{" "}
                            and details
                          </Text>
                        )}
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "5px",
                          paddingBottom: "15px",
                        }}
                      >
                        {i === 0 && (
                          <Text style={{ color: "#000", fontSize: "10px" }}>
                            ARRIVAL:
                          </Text>
                        )}
                        <Text
                          style={{
                            ...styles.boldText,
                            color: "#000",
                            fontSize: "10px",
                            marginRight: "-30px",
                            textTransform: "uppercase",
                          }}
                        >
                          {i === cities?.length - 1 && city?.arrival}{" "}
                          {i === cities?.length - 1 &&
                            city?.arrivalDate &&
                            moment(city.arrivalDate).format("dddd D MMM")}
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
              {/* --- departure & arrival title here end --- */}

              {/* --- depatrure pdf box start ---  */}
              <View style={{ marginTop: "5px", width: "100%" }}>
                {singleBooking?.details?.cityCount[index]?.map(
                  (data, i, arr) => (
                    <View key={i}>
                      <View
                        wrap={false}
                        style={{
                          width: "100%",
                          flexDirection: "row",
                          height: "150px",
                          marginBottom: i === arr?.length - 1 && "15px",
                        }}
                      >
                        {/* airlines box */}
                        <View style={{ width: "29%", height: "150px" }}>
                          <View
                            style={[
                              styles.bordered,
                              styles.section,
                              {
                                flexDirection: "column",
                                justifyContent: "space-between",
                                padding: "8px",
                                paddingRight: "5px",
                              },
                            ]}
                          >
                            <View>
                              <Text
                                style={{ ...styles.boldText, fontSize: "9px" }}
                              >
                                {data?.marketingCarrierName}
                              </Text>
                              <Text
                                style={{ fontSize: "8px", paddingTop: "5px" }}
                              >
                                {data?.marketingCarrier} {data?.marketingFlight}{" "}
                                {data?.flightDuration}
                              </Text>
                            </View>
                            <View
                              style={{
                                width: "35px",
                                height: "35px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <PdfImage
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  objectFit: "cover",
                                }}
                                // src={ImageImport({
                                //   url: `https://cdn.flyfarint.com/flogo/${data?.marketingCarrier}.png`,
                                // })}
                                src={`https://cdn.flyfarint.com/flogo/${data?.marketingCarrier}.png`}
                              />
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                gap: "15px",
                                alignItems: "center",
                                paddingTop: "15px",
                              }}
                            >
                              <View>
                                <Text
                                  style={{
                                    ...styles.boldText,
                                    fontSize: "8px",
                                  }}
                                >
                                  CLASS
                                </Text>
                                <Text
                                  style={{
                                    fontSize: "8px",
                                    paddingTop: "8px",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {data.cabinCode}
                                </Text>
                              </View>
                              {!quotation && (
                                <View>
                                  <Text
                                    style={{
                                      ...styles.boldText,
                                      fontSize: "8px",
                                    }}
                                  >
                                    STATUS
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: "8px",
                                      paddingTop: "8px",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {singleBooking?.status}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>

                        {/* destination box  */}
                        <View style={{ width: "71%", height: "150px" }}>
                          <View style={[styles.bordered, styles.section]}>
                            <View
                              style={{
                                flexDirection: "row",
                                width: "100%",
                                padding: "5px 0",
                                height: "50px",
                              }}
                            >
                              <View
                                style={{ width: "50%", paddingLeft: "8px" }}
                              >
                                <Text
                                  style={{
                                    ...styles.boldText,
                                    fontSize: "10px",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {data?.departure}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: "7.5px",
                                    paddingTop: "6px",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {data?.departureAirport}
                                </Text>
                                <Text
                                  style={{
                                    ...styles.boldText,
                                    fontSize: "7.5px",
                                    paddingTop: "2px",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {data?.departureCountryName}
                                </Text>
                              </View>
                              <View
                                style={{ width: "50%", paddingLeft: "8px" }}
                              >
                                <Text
                                  style={{
                                    ...styles.boldText,
                                    fontSize: "10px",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {data?.arrival}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: "7.5px",
                                    paddingTop: "6px",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {data?.arrivalAirport}
                                </Text>
                                <Text
                                  style={{
                                    ...styles.boldText,
                                    fontSize: "7.5px",
                                    paddingTop: "2px",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {data?.arrivalCountryName}
                                </Text>
                              </View>
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                borderTop: "1px solid #202124",
                                borderBottom: "1px solid #202124",
                                height: "70px",
                                width: "100%",
                              }}
                            >
                              <View
                                style={{
                                  padding: "8px",
                                  width: "50%",
                                  height: "100%",
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.boldText,
                                    fontSize: "8px",
                                  }}
                                >
                                  DEPART AT
                                </Text>
                                <Text
                                  style={{
                                    ...styles.boldText,
                                    fontSize: "9px",
                                    paddingTop: "6px",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {moment(data?.departureDateTime).format(
                                    "h:mm a, D MMM (dddd)"
                                  )}
                                </Text>
                                <Text
                                  style={{
                                    ...styles.boldText,
                                    fontSize: "8px",
                                    paddingTop: "4px",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {data?.departureTerminal}
                                </Text>
                              </View>
                              <View
                                style={{
                                  borderLeft: "1px solid #202124",
                                  padding: "8px",
                                  width: "50%",
                                  height: "100%",
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.boldText,
                                    fontSize: "8px",
                                  }}
                                >
                                  ARRIVAL AT
                                </Text>
                                <Text
                                  style={{
                                    ...styles.boldText,
                                    fontSize: "9px",
                                    paddingTop: "6px",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {moment(data?.arrivalDateTime).format(
                                    "h:mm a, D MMM (dddd)"
                                  )}
                                </Text>
                                <Text
                                  style={{
                                    ...styles.boldText,
                                    fontSize: "8px",
                                    paddingTop: "4px",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {data?.arrivalTerminal}
                                </Text>
                              </View>
                            </View>

                            <View
                              style={{
                                flexDirection: "column",
                                alignItems: "start",
                                width: "100%",
                                height: "30px",
                                marginTop: "7px",
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  width: "100%",
                                  padding: "0 8px",
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.boldText,
                                    fontSize: "7px",
                                  }}
                                >
                                  CHECK IN:{"  "}
                                </Text>
                                <Text
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {data?.baggage?.map((pax, index) => (
                                    <React.Fragment key={index}>
                                      {pax.paxType === "ADT" && (
                                        <Text style={{ fontSize: "7px" }}>
                                          ADULT {pax.baggage}{" "}
                                        </Text>
                                      )}
                                      {pax.paxType === "CNN" && (
                                        <Text style={{ fontSize: "7px" }}>
                                          || CHILD {pax.baggage}{" "}
                                        </Text>
                                      )}
                                      <br />
                                      {pax.paxType === "INF" && (
                                        <Text style={{ fontSize: "7px" }}>
                                          || INFANT {pax.baggage}
                                        </Text>
                                      )}
                                    </React.Fragment>
                                  ))}
                                </Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                  // borderLeft: "1px solid #202124",
                                  alignItems: "center",
                                  width: "100%",
                                  height: "100%",
                                  padding: "0 8px",
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.boldText,
                                    fontSize: "7px",
                                  }}
                                >
                                  CABIN :{" "}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: "7px",
                                    display: "flex",
                                    alignItems: "center",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {data?.baggage?.map((pax, index) => {
                                    return (
                                      <React.Fragment key={index}>
                                        {pax.paxType === "ADT" && (
                                          <Text style={{ fontSize: "7px" }}>
                                            ADULT {pax.cabinBaggage}{" "}
                                          </Text>
                                        )}
                                        {pax.paxType === "CNN" && (
                                          <Text style={{ fontSize: "7px" }}>
                                            || CHILD {pax.cabinBaggage}{" "}
                                          </Text>
                                        )}
                                        {pax.paxType === "INF" && (
                                          <Text style={{ fontSize: "7px" }}>
                                            || INFANT {pax.cabinBaggage}
                                          </Text>
                                        )}
                                      </React.Fragment>
                                    );
                                  })}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>

                      {i < arr?.length - 1 && (
                        <View
                          style={{
                            flexDirection: "row",
                            border: "1px solid #202124",
                            textAlign: "center",
                            height: "20px",
                            paddingLeft: "10px",
                            margin: "3px",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ ...styles.boldText, fontSize: "8px" }}>
                            TRANSIT :{" "}
                          </Text>
                          <Text style={{ fontSize: "8px" }}>
                            {" "}
                            CHANGE PLANES{" "}
                          </Text>{" "}
                          <Text
                            style={{
                              ...styles.boldText,
                              fontSize: "8px",
                              textTransform: "uppercase",
                            }}
                          >
                            {` ${arr[i]?.arrivalAirport} ${
                              arr[i + 1]?.departureCityName
                            }, ${arr[i + 1]?.departureCountryName}`}{" "}
                            | CONNECTING TIME:{" "}
                            {calculateTransiteTime(
                              arr[i]?.arrivalDateTime,
                              arr[i + 1]?.departureDateTime
                            )}
                          </Text>
                        </View>
                      )}
                    </View>
                  )
                )}
              </View>
            </View>
          );
        })}

        {/* --- depatrure pdf box end ---  */}

        {/* --- passenger information start --- */}
        {!quotation && (
          <View style={{ marginTop: "10px" }}>
            <View
              style={{
                borderBottom: "2px solid #202124",
                paddingBottom: "10px",
              }}
            >
              <Text style={{ fontSize: "9.5px" }}>PASSENGER INFORMATION</Text>
            </View>

            {/* --- passenger information table start --- */}

            <View style={{ width: "100%", paddingTop: "10px" }}>
              <View style={[styles.bordered, styles.section]}>
                <View
                  style={{
                    flexDirection: "row",
                    padding: "8px",
                    paddingRight: "5px",
                    alignItems: "center",
                    width: "100%",
                  }}
                  gap={1}
                >
                  <View style={{ width: "22%" }}>
                    <Text style={{ ...styles.boldText, fontSize: "7.5px" }}>
                      PASSENGER NAME
                    </Text>
                  </View>
                  <View style={{ width: ticket ? "13%" : "15%" }}>
                    <Text style={{ ...styles.boldText, fontSize: "7.5px" }}>
                      GENDER
                    </Text>
                  </View>

                  <View style={{ width: ticket ? "13%" : "15%" }}>
                    <Text style={{ ...styles.boldText, fontSize: "7.5px" }}>
                      PAX TYPE
                    </Text>
                  </View>
                  <View style={{ width: ticket ? "13%" : "15%" }}>
                    <Text style={{ ...styles.boldText, fontSize: "7.5px" }}>
                      NATIONALITY
                    </Text>
                  </View>
                  <View style={{ width: ticket ? "13%" : "15%" }}>
                    <Text style={{ ...styles.boldText, fontSize: "7.5px" }}>
                      PASSPORT NO.
                    </Text>
                  </View>

                  <View style={{ width: ticket ? "13%" : "15%" }}>
                    <Text style={{ ...styles.boldText, fontSize: "7.5px" }}>
                      EXPIRE DATE
                    </Text>
                  </View>

                  {singleBooking?.status === "ticketed" && (
                    <View style={{ width: ticket ? "13%" : "15%" }}>
                      <Text style={{ ...styles.boldText, fontSize: "7.5px" }}>
                        TICKET NO.
                      </Text>
                    </View>
                  )}
                </View>

                <>
                  {passengers?.map((passenger, index) => (
                    <View
                      key={passenger?.id || index}
                      style={{
                        flexDirection: "row",
                        padding: "8px",
                        paddingRight: "5px",
                        alignItems: "center",
                        borderTop: "1px solid #202124",
                        width: "100%",
                      }}
                    >
                      <View style={{ width: "22%" }}>
                        <Text
                          style={{
                            fontSize: "7px",
                            textTransform: "uppercase",
                          }}
                        >
                          {passenger?.prefix} {passenger?.firstName}{" "}
                          {passenger?.lastName}
                        </Text>
                      </View>
                      <View style={{ width: ticket ? "13%" : "15%" }}>
                        <Text
                          style={{
                            fontSize: "7px",
                            textTransform: "uppercase",
                          }}
                        >
                          {passenger?.gender}
                        </Text>
                      </View>
                      <View style={{ width: ticket ? "13%" : "15%" }}>
                        <Text
                          style={{
                            fontSize: "7px",
                            textTransform: "uppercase",
                          }}
                        >
                          {passenger?.type}
                        </Text>
                      </View>
                      <View style={{ width: ticket ? "13%" : "15%" }}>
                        <Text
                          style={{
                            fontSize: "7px",
                            textTransform: "uppercase",
                          }}
                        >
                          {passenger?.passportNation}
                        </Text>
                      </View>
                      <View style={{ width: ticket ? "13%" : "15%" }}>
                        <Text
                          style={{
                            fontSize: "7px",
                            textTransform: "uppercase",
                          }}
                        >
                          {singleBooking?.journeyType?.toLowerCase() ===
                            "outbound" ||
                          (singleBooking?.journeyType?.toLowerCase() ===
                            "inbound" &&
                            passenger?.passportNation?.toLowerCase() !== "bd")
                            ? passenger?.passportNumber
                            : "—"}
                        </Text>
                      </View>
                      <View style={{ width: ticket ? "13%" : "15%" }}>
                        <Text
                          style={{
                            fontSize: "7px",
                            textTransform: "uppercase",
                          }}
                        >
                          {singleBooking?.journeyType?.toLowerCase() ===
                            "outbound" ||
                          (singleBooking?.journeyType?.toLowerCase() ===
                            "inbound" &&
                            passenger?.passportNation?.toLowerCase() !== "bd")
                            ? passenger?.passportExpire
                            : "—"}
                        </Text>
                      </View>
                      {singleBooking?.status === "ticketed" && (
                        <View style={{ width: "10%" }}>
                          <Text
                            style={{
                              fontSize: "7px",
                              textTransform: "uppercase",
                            }}
                          >
                            {
                              singleBooking?.Tickets[0]?.passengers?.find(
                                (t) => t?.passengerId === passenger?.id
                              )?.ticketNumber
                            }
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </>
              </View>
            </View>
            {/* --- passenger information table end --- */}
          </View>
        )}
        {/* --- passenger information end --- */}

        {/* --- Fare information start --- */}
        {copy !== "without-copy" && (
          <View style={{ marginTop: "10px" }}>
            <View
              style={{
                borderBottom: "2px solid #202124",
                paddingBottom: "10px",
              }}
            >
              <Text style={{ fontSize: "9.5px" }}>FARE INFORMATION</Text>
            </View>
            {/* FARE INFORMATION table */}
            <View style={{ width: "100%", paddingTop: "10px" }}>
              <View
                style={{ width: "100%", flexDirection: "row", gap: "20px" }}
              >
                <View style={{ width: "100%", height: "100px" }}>
                  {" "}
                  <View style={[styles.bordered, styles.section]}>
                    {paxType ? (
                      <View style={{ padding: "8px", gap: "10px" }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <View>
                            <Text style={{ fontSize: "8px", color: "#272323" }}>
                              Base fare total amount
                            </Text>
                          </View>
                          <View>
                            <Text style={{ fontSize: "8px", color: "#272323" }}>
                              {individualPax?.baseFare} BDT
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingBottom: "10px",
                          }}
                        >
                          <Text style={{ fontSize: "8px", color: "#272323" }}>
                            Tax
                          </Text>
                          <Text style={{ fontSize: "8px", color: "#272323" }}>
                            {individualPax?.tax} BDT
                          </Text>
                        </View>

                        {copy === "agentInvoice" ? (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text style={{ fontSize: "8px", color: "#272323" }}>
                              Markup
                            </Text>
                            <Text style={{ fontSize: "8px", color: "#272323" }}>
                              00 BDT
                            </Text>
                          </View>
                        ) : (
                          ""
                        )}

                        {/* <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <View>
                            <Text style={{ fontSize: "8px", color: "#272323" }}>
                              Discount
                            </Text>
                          </View>
                          <View>
                            <Text style={{ fontSize: "8px", color: "#272323" }}>
                              {individualPax?.singleCommission} BDT
                            </Text>
                          </View>
                        </View> */}
                        <View></View>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                          }}
                        >
                          <View>
                            <Text
                              style={{
                                ...styles.boldText,
                                fontSize: "9px",
                                color: "#272323",
                              }}
                            >
                              Total Ticket fare Amount
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={{
                                ...styles.boldText,
                                fontSize: "9px",
                                color: "#272323",
                              }}
                            >
                              {individualPax?.singleAgentPrice} BDT
                            </Text>
                          </View>
                        </View>
                      </View>
                    ) : bookingType === "void" ||
                      bookingType === "refund" ||
                      bookingType === "reissue" ? (
                      <View style={{ padding: "8px", gap: "10px" }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={{ fontSize: "8px", color: "#272323" }}>
                            Paid Amount For this Ticket:
                          </Text>

                          <Text style={{ fontSize: 8, color: "#272323" }}>
                            {bookingTypeData?.currency || "BDT"}{" "}
                            {(bookingTypeData?.agentPrice || 0)?.toLocaleString(
                              "en-IN"
                            )}
                          </Text>
                        </View>

                        {bookingType !== "void" && (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text style={{ fontSize: "8px", color: "#272323" }}>
                              Airlines {convertCamelToTitle(bookingType)}{" "}
                              Charge:
                            </Text>

                            <Text style={{ fontSize: 8, color: "#272323" }}>
                              {bookingTypeData?.currency || "BDT"}{" "}
                              {(
                                bookingTypeData?.airlineCharge || 0
                              )?.toLocaleString("en-IN")}
                            </Text>
                          </View>
                        )}
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={{ fontSize: "8px", color: "#272323" }}>
                            Service Charge:
                          </Text>

                          <Text style={{ fontSize: 8, color: "#272323" }}>
                            {bookingTypeData?.currency || "BDT"}{" "}
                            {(
                              bookingTypeData?.totalServiceCharge || 0
                            )?.toLocaleString("en-IN")}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={{ fontSize: "8px", color: "#272323" }}>
                            {bookingType === "refund"
                              ? "Refundable"
                              : convertCamelToTitle(bookingType)}{" "}
                            Amount:
                          </Text>

                          <Text style={{ fontSize: 8, color: "#272323" }}>
                            {bookingTypeData?.currency || "BDT"}{" "}
                            {(bookingTypeData?.totalPrice || 0)?.toLocaleString(
                              "en-IN"
                            )}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View style={{ padding: "8px", gap: "10px" }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <View>
                            <Text style={{ fontSize: "8px", color: "#272323" }}>
                              Base Fare
                            </Text>
                          </View>
                          <View>
                            <Text style={{ fontSize: 8, color: "#272323" }}>
                              {singleBooking?.details?.priceBreakdown
                                ?.reduce(
                                  (acc, passenger) =>
                                    acc + (passenger.totalBaseFare || 0),
                                  0
                                )
                                .toLocaleString("en-IN") + " BDT" || "0 BDT"}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingBottom: "10px",
                          }}
                        >
                          <Text style={{ fontSize: "8px", color: "#272323" }}>
                            Tax
                          </Text>
                          <Text style={{ fontSize: "8px", color: "#272323" }}>
                            {singleBooking?.taxes} BDT
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={{ fontSize: 8, color: "#272323" }}>
                            Gross Fare
                          </Text>
                          <Text style={{ fontSize: 8, color: "#272323" }}>
                            {(
                              (singleBooking?.details?.priceBreakdown?.reduce(
                                (acc, passenger) =>
                                  acc + (passenger.totalBaseFare || 0),
                                0
                              ) || 0) + (singleBooking?.taxes || 0)
                            ).toLocaleString("en-IN")}{" "}
                            BDT
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={{ fontSize: 8, color: "#272323" }}>
                            Commission
                          </Text>
                          <Text style={{ fontSize: 8, color: "#272323" }}>
                            {(
                              (singleBooking?.details?.priceBreakdown?.reduce(
                                (acc, passenger) =>
                                  acc + (passenger.totalBaseFare || 0),
                                0
                              ) || 0) +
                              (singleBooking?.taxes || 0) -
                              (copy === "markup-copy"
                                ? newAgentPrice || 0
                                : singleBooking?.agentPrice || 0)
                            ).toLocaleString("en-IN")}{" "}
                            BDT
                          </Text>
                        </View>

                        {copy === "agentInvoice" ? (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text style={{ fontSize: "8px", color: "#272323" }}>
                              Markup
                            </Text>
                            <Text style={{ fontSize: "8px", color: "#272323" }}>
                              00 BDT
                            </Text>
                          </View>
                        ) : (
                          ""
                        )}

                        {/* <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <View>
                            <Text style={{ fontSize: "8px", color: "#272323" }}>
                              Discount
                            </Text>
                          </View>
                          <View>
                            <Text style={{ fontSize: "8px", color: "#272323" }}>
                              {singleBooking?.commission} BDT
                            </Text>
                          </View>
                        </View> */}
                        <View></View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                          }}
                        >
                          <View>
                            <Text
                              style={{
                                ...styles.boldText,
                                fontSize: "9px",
                                color: "#272323",
                              }}
                            >
                              Total Ticket fare Amount
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={{
                                ...styles.boldText,
                                fontSize: "9px",
                                color: "#272323",
                              }}
                            >
                              {copy === "markup-copy"
                                ? newAgentPrice
                                : singleBooking?.agentPrice}{" "}
                              BDT
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
                {/* <View style={{ width: "40%", gap: "10px", paddingTop: "10px" }}>
                  <Text style={{ fontSize: "9px", color: "#000" }}>NOTE</Text>
                  <Text style={{ color: "#767676", fontSize: "8px" }}>
                    All payment should be made in favor of "Fly Far
                    International".This Invoice will not be recognized as paid
                    unless supported by Company Official Receipt. 3% Bank Charge
                    will be add on total bill amount, if the bill Paid/settled
                    by Debit/Credit Card
                  </Text>
                </View> */}
              </View>
            </View>

            <View style={{ paddingTop: "5px", paddingLeft: "5px" }}>
              <Text style={{ color: "#003566", fontSize: "8px" }}>
                In words:{" "}
                {bookingType === "void" ||
                bookingType === "refund" ||
                bookingType === "reissue"
                  ? numberToWords(bookingTypeData?.totalPrice)
                  : words}
              </Text>
            </View>
          </View>
        )}

        {/* --- Fare information start --- */}

        <View>
          {/* Important Information */}

          <View style={{ marginTop: "15px" }}>
            <View
              style={{
                borderBottom: "2px solid #202124",
                paddingBottom: "10px",
              }}
            >
              <Text style={{ ...styles.boldText, fontSize: "9.5px" }}>
                IMPORTANT INFORMATION
              </Text>
            </View>
            {/* passenger information table */}
            <View style={{ width: "100%", paddingTop: "10px", gap: "13px" }}>
              <View>
                <Text style={{ fontSize: "8px" }}>
                  01.A passport with a minimum validity of 6 months is required,
                  with sufficient empty pages in the back
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: "8px" }}>
                  02. A valid visa for the country you are visiting. Also, check
                  if a transit visa is required if you are transiting between
                  other countries during your journey. Ensure all medical papers
                  for your journey (if required any)
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: "8px" }}>
                  03. Immigration authorities require airlines to provide
                  advance passenger information prior to departure, so please
                  ensure that your bookings have been updated prior to your
                  travel.
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: "8px" }}>
                  04. After taking a boarding pass, if the passenger fails to
                  report at the boarding gate without any valid reason, their
                  tickets will be treated as nonrefundable & nochargeable
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: "8px" }}>
                  05. Passengers reporting late for check-in may be refused to
                  board on flight. Please bring a valid photo ID.
                </Text>
              </View>
            </View>
          </View>

          {/* Terms and Conditions */}
          <View style={{ paddingTop: "15px" }}>
            <View>
              <Text
                style={{
                  ...styles.boldText,
                  fontSize: "11px",
                  color: "#000",
                }}
              >
                TERMS AND CONDITIONS
              </Text>
            </View>
            <View style={{ marginTop: "10px" }}>
              <Text style={{ fontSize: "8px", color: "#000" }}>
                Please be advised that you are required to produce various
                travel documents depending on your journey, destination and
                purpose of travel. The documents required may include the
                following:
              </Text>
            </View>

            <View style={{ paddingTop: "10px" }}>
              <View
                style={{
                  border: "1px solid #202124",
                  height: "120px",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "60px",
                    borderBottom: "1px solid #202124",

                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      width: "20%",
                      height: "100%",
                      borderRight: "1px solid #202124",
                      flexDirection: "row",
                      alignItems: "center",
                      padding: "10px",
                    }}
                  >
                    <Text style={{ fontSize: "8px", color: "#000" }}>
                      FLIGHT TYPE
                    </Text>
                  </View>
                  <View style={{ width: "80%", height: "100%" }}>
                    <View
                      style={{
                        height: "50%",
                        width: "100%",
                        borderBottom: "1px solid #202124",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          ...styles.boldText,
                          fontSize: "9px",
                          textAlign: "center",
                        }}
                      >
                        CHECK IN COUNTER
                      </Text>
                    </View>
                    <View
                      style={{
                        height: "50%",
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <View
                        style={{
                          width: "50%",
                          height: "100%",
                          borderRight: "1px solid #202124",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontSize: "8px", color: "#000" }}>
                          OPEN
                        </Text>
                      </View>
                      <View
                        style={{
                          fontSize: "8px",
                          width: "50%",
                          height: "100%",
                          color: "#000",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text>CLOSE</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    width: "100%",
                    height: "30px",
                    borderBottom: "1px solid #202124",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      width: "20%",
                      height: "100%",
                      borderRight: "1px solid #202124",
                      flexDirection: "row",
                      alignItems: "center",
                      padding: "5px",
                    }}
                  >
                    <Text style={{ fontSize: "8px", color: "#000" }}>
                      INTERNATIONAL
                    </Text>
                  </View>
                  <View style={{ width: "80%", height: "100%" }}>
                    <View
                      style={{
                        height: "100%",
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <View
                        style={{
                          width: "50%",
                          height: "100%",
                          borderRight: "1px solid #202124",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontSize: "8px", color: "#000" }}>
                          3 HOURS BEFORE DEPARTURE (STD)
                        </Text>
                      </View>
                      <View
                        style={{
                          fontSize: "8px",
                          width: "50%",
                          height: "100%",
                          color: "#000",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text>60 MINUTIES BEFORE DEPARTURE (STD)</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    width: "100%",
                    height: "30px",

                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      width: "20%",
                      height: "100%",
                      borderRight: "1px solid #202124",
                      flexDirection: "row",
                      alignItems: "center",
                      padding: "5px",
                    }}
                  >
                    <Text style={{ fontSize: "8px", color: "#000" }}>
                      DOMESTIC
                    </Text>
                  </View>
                  <View style={{ width: "80%", height: "100%" }}>
                    <View
                      style={{
                        height: "100%",
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <View
                        style={{
                          width: "50%",
                          height: "100%",
                          borderRight: "1px solid #202124",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontSize: "8px", color: "#000" }}>
                          3 HOURS BEFORE DEPARTURE (STD)
                        </Text>
                      </View>
                      <View
                        style={{
                          fontSize: "8px",
                          width: "50%",
                          height: "100%",
                          color: "#000",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text>60 MINUTIES BEFORE DEPARTURE (STD)</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ gap: "13px", paddingTop: "10px" }}>
              <View>
                <Text style={{ fontSize: "8px", color: "#000" }}>
                  01.In case of refund or Reissue the procedure need to be done
                  within ticket validating period (as per airlines polices)
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: "8px", color: "#000" }}>
                  02. Please reconfirm all flights at least 72 hours in advance
                  direct with the airline concerned. Failure to do so could
                  result in the cancellation of your reservation and possible
                  NO-SHOW charges
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: "8px", color: "#000" }}>
                  03. FBA- Free Baggage Allowance, can vary depending on your
                  class/fare purchased. You are requested to reconfirm. For the
                  purpose of easy identification, please label all baggage
                  inside and outside with your name and address. Please contact
                  “Lost&Found” section if you lost your baggage
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: "8px", color: "#000" }}>
                  04. The price of this ticket may include taxes, fees and
                  charges which are imposed on air transportation by the
                  government, concern authorities and the carrier. These taxes,
                  fees and charges which may represent as significant portion of
                  the cost of air travel, are either included in the fare or
                  shown separately in the “TAX” box(es) of this ticket. You may
                  also be required to pay taxes, fees and charges which were not
                  collected at the time of issuance
                </Text>
              </View>
            </View>
          </View>

          {/* Dangerous goods regulations */}
          <View style={{ marginTop: "20px" }}>
            <View>
              <Text
                style={{
                  ...styles.boldText,
                  fontSize: "11px",
                  color: "#000",
                }}
              >
                DANGEROUS GOODS REGULATIONS
              </Text>
            </View>
            <View style={{ paddingTop: "10px" }}>
              <Text style={{ fontSize: "8px", color: "#000" }}>
                For safety reasons. dangerous goods as defined in the
                International Air Transport Association (IATA) Dangerous Goods
                Regulations such as those listed below shall not be carried as,
                within or as part of your baggage:
              </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "30px",
                // height: "200px",
                // width: "500px",
              }}
            >
              <PdfImage style={{ width: "60%" }} src={emergencyImg} />
              <Text
                style={{
                  ...styles.boldText,
                  color: "#EF0230",
                  fontSize: "14px",
                  paddingTop: "10px",
                }}
              >
                NOT PERMITTERD ANYWHERE
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PDFPageDesign;
