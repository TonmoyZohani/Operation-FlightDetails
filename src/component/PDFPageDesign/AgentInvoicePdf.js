import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import HeaderImg from "../../images/int-header-logo.png";
import EmergencyImg from "../../images/emergengy.png";
import React, { useState } from "react";
import moment from "moment";

Font.register({
  family: "Mukta",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/mukta/v12/iJWZBXyXfDDVXbEOjFU3ViI.woff2",
      fontWeight: "normal",
    }, // Normal weight
    {
      src: "https://fonts.gstatic.com/s/mukta/v12/iJWUBXyXfDDVXbE0FvU.woff2",
      fontWeight: "bold",
    }, // Bold weight
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    paddingTop: 30,
    paddingBottom: 0,
    padding: 35,
    paddingHorizontal: 35,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "#f2f2f2",
    textAlign: "center",
    padding: 10,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 35,
    backgroundColor: "#dc143c",
    padding: 8,
  },
  content: {
    marginBottom: 60,
  },
  section: {
    margin: 3,
    padding: 0,
    flexGrow: 1,
  },
  mainHeader: {
    fontSize: 13,
    color: "#000000",
    fontWeight: "normal",
  },
  mainTitle: {
    fontSize: "10px",
    color: "#000000",
    fontWeight: "extrabold",
  },
  lightTitle: {
    fontSize: "7px",
    color: "#888888",
    fontWeight: "extrabold",
  },
  boldTitle: {
    fontSize: "7px",
    color: "#000000",
    fontWeight: "extrabold",
  },
  textHeader: {
    fontSize: "8px",
    color: "#202124",
    fontWeight: 200,
    marginTop: "3px",
  },
  borderTop: {
    borderTop: "1px solid #000000",
  },
  borderBottom: {
    borderBottom: "1px solid #A2A1A1",
  },
  boldText: {
    fontFamily: "Helvetica-Bold",
  },
  image: {
    width: 25,
    height: 25,
    borderRadius: "50%",
  },
});

const AgentInvoicePdf = ({
  singleBooking,
  ticket = false,
  passengerData,
  agentData,
}) => {
  const [len, setLen] = useState(singleBooking?.details?.cityCount[0]?.length);
  const pageHeight = 841.89; // A4 page height in points
  let accumulatedHeight = 0;

  const renderWithDynamicHeight = (height, children) => {
    accumulatedHeight += height;

    // Check if content exceeds the page height
    if (accumulatedHeight >= pageHeight) {
      accumulatedHeight = height; // Reset the height count for the new page
      return <View break>{children}</View>;
    }
    return <View>{children}</View>;
  };

  // Function to get the correct output
  function getFlightPath(flightSegments) {
    // Extract each departure except the last one
    const departures = flightSegments.map((segment) => segment.departure);

    // Extract the last arrival
    const lastArrival = flightSegments[flightSegments.length - 1].arrival;

    return `${departures.join(" - ")} - ${lastArrival}`;
  }

  return (
    <Document>
      <Page size="A4" style={styles?.page}>
        {/* Header */}
        {renderWithDynamicHeight(
          100,
          <View>
            <View style={{ marginBottom: "10px" }}>
              <Image src={HeaderImg} />
            </View>
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text style={styles?.mainHeader}>
                REFERENCE: {singleBooking?.bookingId}
              </Text>
              <Text style={{ color: "#CCCCCC" }}>AGENT INVOICE</Text>
            </View>
          </View>
        )}

        {/* --- passenger info */}
        {renderWithDynamicHeight(
          100,
          <View style={{ marginTop: "10px" }}>
            <Text
              style={{
                fontSize: "9px",
                marginTop: "15px",
                marginBottom: "3px",
              }}
            >
              PREPARED FOR
            </Text>
            <Text
              style={{
                ...styles.mainTitle,
                fontSize: "12px",
                marginBottom: "5px",
              }}
            >
              {agentData?.companyName}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ width: "30%", marginTop: "2px" }}>
                <Text
                  style={{ ...styles?.textHeader, textTransform: "uppercase" }}
                >
                  TRIPT TYPE: {singleBooking?.tripType}
                </Text>
                <Text style={{ ...styles.textHeader }}>
                  EMAIL: {singleBooking?.details?.contact?.email}
                </Text>
              </View>
              <View style={{ width: "30%", marginTop: "2px" }}>
                <Text style={{ ...styles?.textHeader }}>
                  ROUTE : {getFlightPath(singleBooking?.details?.route)}
                </Text>
                <Text style={{ ...styles.textHeader }}>
                  AIRLINES PNR: {singleBooking?.airlinePnr}
                </Text>
              </View>
              <View style={{ width: "40%", marginTop: "2px" }}>
                <Text
                  style={{ ...styles?.textHeader, textTransform: "uppercase" }}
                >
                  BOOKING DATE :{" "}
                  {moment(singleBooking?.createdAt).format("D MMMM YYYY")}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* --- flight details */}
        {renderWithDynamicHeight(
          len > 6 ? 50 : len > 4 ? 500 : len > 3 ? 400 : 100,
          <View style={{ marginTop: "20px" }}>
            <Text
              style={{
                ...styles?.mainTitle,
              }}
            >
              FLIGHT DETAILS
            </Text>
            {singleBooking?.details?.cityCount?.length > 0 &&
              singleBooking?.details?.cityCount[0]?.map((city, index) => (
                <View
                  key={index}
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    flexDirection: "row",
                    gap: "15px",
                    alignItems: "center",
                    padding: "5px 0",
                    ...styles?.borderTop,
                  }}
                >
                  {/* <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Image src={AirplaneImg} style={{ ...styles.image }} />
                    <Text
                      style={{
                        ...styles.mainTitle,
                        marginTop: "5px",
                        fontSize: "8px",
                      }}
                    >
                      {city?.marketingCarrier} {city?.airCraft}
                    </Text>
                  </View> */}
                  <View style={{ flexGrow: 1 }}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        ...styles?.borderBottom,
                        paddingBottom: "5px",
                      }}
                    >
                      <Text
                        style={{
                          ...styles?.mainTitle,
                          textTransform: "uppercase",
                        }}
                      >
                        OPERATED BY - {city?.marketingCarrierName}
                      </Text>
                      <Text
                        style={{
                          ...styles?.mainTitle,
                          textTransform: "uppercase",
                        }}
                      >
                        {city?.cabinCode}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        ...styles?.borderBottom,
                        paddingBottom: "5px",
                      }}
                    >
                      <View
                        style={{
                          width: "45%",
                          marginTop: "5px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "3px",
                        }}
                      >
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "10px",
                          }}
                        >
                          <Text style={{ ...styles?.lightTitle }}>FROM </Text>
                          <Text style={{ ...styles?.boldTitle }}>
                            {city?.departure} - {city?.departureAirport}
                          </Text>
                        </View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "10px",
                          }}
                        >
                          <Text
                            style={{ ...styles?.lightTitle, width: "23px" }}
                          >
                            TO{" "}
                          </Text>
                          <Text style={{ ...styles.boldTitle }}>
                            {city?.arrival} - {city?.arrivalAirport}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          width: "35%",
                          marginTop: "5px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "3px",
                        }}
                      >
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "10px",
                          }}
                        >
                          <Text style={{ ...styles?.lightTitle }}>DEPART </Text>
                          <Text
                            style={{
                              ...styles?.boldTitle,
                              marginLeft: "1px",
                              textTransform: "uppercase",
                            }}
                          >
                            {moment(city?.departureDateTime).format("HH:mm")}
                            {` - `}
                            {moment(city?.departureDateTime).format(
                              "dddd Do MMMM"
                            )}{" "}
                          </Text>
                        </View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "10px",
                          }}
                        >
                          <Text style={{ ...styles?.lightTitle }}>
                            ARRIVAL{" "}
                          </Text>
                          <Text
                            style={{
                              ...styles.boldTitle,
                              textTransform: "uppercase",
                            }}
                          >
                            {moment(city?.arrivalDateTime).format("HH:mm")}
                            {` - `}
                            {moment(city?.arrivalDateTime).format(
                              "dddd Do MMMM"
                            )}{" "}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          width: "20%",
                          marginTop: "5px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "3px",
                        }}
                      >
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "end",
                            justifyContent: "flex-end",
                            gap: "10px",
                          }}
                        >
                          <Text style={{ ...styles?.lightTitle }}>
                            TERMINAL
                          </Text>
                          <Text style={{ ...styles.boldTitle }}>
                            {city?.dTerminal && ` - ${city?.dTerminal}`}
                          </Text>
                        </View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "end",
                            justifyContent: "flex-end",
                            gap: "10px",
                          }}
                        >
                          <Text style={{ ...styles?.lightTitle }}>
                            TERMINAL
                          </Text>
                          <Text style={{ ...styles.boldTitle }}>
                            {city?.aTerminal && ` - ${city?.aTerminal}`}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingBottom: "5px",
                      }}
                    >
                      <View
                        style={{
                          width: "100%",
                          marginTop: "5px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "3px",
                        }}
                      >
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "20px",
                          }}
                        >
                          <Text
                            style={{ ...styles?.lightTitle, width: "70px" }}
                          >
                            CHECKIN BAGGAGE{" "}
                          </Text>

                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "10px",
                            }}
                          >
                            {city?.baggage?.map((pax, index) => (
                              <React.Fragment key={index}>
                                {pax.paxType === "ADT" && (
                                  <Text style={{ ...styles.boldTitle }}>
                                    ADULT - {pax?.baggage}{" "}
                                  </Text>
                                )}
                                {pax.paxType === "CNN" && (
                                  <Text style={{ ...styles.boldTitle }}>
                                    CHILD - {pax?.baggage}{" "}
                                  </Text>
                                )}
                                {pax.paxType === "INF" && (
                                  <Text style={{ ...styles.boldTitle }}>
                                    INFANT - {pax?.baggage}
                                  </Text>
                                )}
                              </React.Fragment>
                            ))}
                          </View>
                        </View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "20px",
                          }}
                        >
                          <Text
                            style={{ ...styles?.lightTitle, width: "70px" }}
                          >
                            CABIN BAGGAGE{" "}
                          </Text>
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "10px",
                            }}
                          >
                            {city?.baggage?.map((pax, index) => (
                              <React.Fragment key={index}>
                                {pax.paxType === "ADT" && (
                                  <Text
                                    style={{
                                      ...styles.boldTitle,
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    ADULT - {pax?.cabinBaggage}{" "}
                                  </Text>
                                )}
                                {pax.paxType === "CNN" && (
                                  <Text
                                    style={{
                                      ...styles.boldTitle,
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    CHILD - {pax?.cabinBaggage}{" "}
                                  </Text>
                                )}
                                {pax.paxType === "INF" && (
                                  <Text
                                    style={{
                                      ...styles.boldTitle,
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    INFANT - {pax?.cabinBaggage}
                                  </Text>
                                )}
                              </React.Fragment>
                            ))}
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        )}

        {/* passenger information  */}
        {renderWithDynamicHeight(
          200,
          <View style={{ marginTop: "15px" }}>
            <View
              style={{
                borderBottom: "2px solid #202124",
                paddingBottom: "8px",
              }}
            >
              <Text style={{ fontSize: "9.5px" }}>PASSENGER INFORMATION</Text>
            </View>

            {/* passenger information table */}

            <View style={{ width: "100%", paddingTop: "10px" }}>
              <View style={[styles.bordered, styles.section]}>
                <View
                  style={{
                    flexDirection: "row",
                    padding: "8px",
                    paddingRight: "5px",
                    alignItems: "center",
                    width: "100%",
                    border: "1px solid #202124",
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
                      DOB
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
                  {ticket && (
                    <View style={{ width: ticket ? "13%" : "15%" }}>
                      <Text style={{ ...styles.boldText, fontSize: "7.5px" }}>
                        TICKET NO.
                      </Text>
                    </View>
                  )}
                </View>

                {passengerData?.adult?.map((data, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      padding: "8px",
                      paddingRight: "5px",
                      alignItems: "center",
                      borderBottom: "1px solid #202124",
                      borderRight: "1px solid #202124",
                      borderLeft: "1px solid #202124",
                      width: "100%",
                    }}
                    gap={1}
                  >
                    <View style={{ width: "22%" }}>
                      <Text
                        style={{
                          fontSize: "7px",
                          textTransform: "uppercase",
                        }}
                      >
                        {data?.prefix} {data?.firstName} {data?.lastName}
                      </Text>
                    </View>
                    <View style={{ width: ticket ? "13%" : "15%" }}>
                      <Text
                        style={{
                          fontSize: "7px",
                          textTransform: "uppercase",
                        }}
                      >
                        {data?.gender} [{data?.type}]
                      </Text>
                    </View>

                    <View style={{ width: ticket ? "13%" : "15%" }}>
                      <Text
                        style={{
                          fontSize: "7px",
                          textTransform: "uppercase",
                        }}
                      >
                        {data?.dateOfBirth}
                      </Text>
                    </View>
                    <View style={{ width: ticket ? "13%" : "15%" }}>
                      <Text
                        style={{
                          fontSize: "7px",
                          textTransform: "uppercase",
                        }}
                      >
                        {data?.passportNation}
                      </Text>
                    </View>
                    <View style={{ width: ticket ? "13%" : "15%" }}>
                      <Text
                        style={{
                          fontSize: "7px",
                          textTransform: "uppercase",
                        }}
                      >
                        {data?.passportNumber}
                      </Text>
                    </View>
                    <View style={{ width: ticket ? "13%" : "15%" }}>
                      <Text
                        style={{
                          fontSize: "7px",
                          textTransform: "uppercase",
                        }}
                      >
                        {data?.passportExpire}
                      </Text>
                    </View>
                    {ticket && (
                      <View style={{ width: "10%" }}>
                        <Text
                          style={{
                            fontSize: "7px",
                            textTransform: "uppercase",
                          }}
                        >
                          JHFJDKFJ
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
                {passengerData?.child?.map((data, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      padding: "8px",
                      paddingRight: "5px",
                      alignItems: "center",
                      borderBottom: "1px solid #202124",
                      borderRight: "1px solid #202124",
                      borderLeft: "1px solid #202124",
                      width: "100%",
                    }}
                    gap={1}
                  >
                    <View style={{ width: "22%" }}>
                      <Text
                        style={{
                          fontSize: "7px",
                          textTransform: "uppercase",
                        }}
                      >
                        {data?.prefix} {data?.firstName} {data?.lastName}
                      </Text>
                    </View>
                    <View style={{ width: ticket ? "13%" : "15%" }}>
                      <Text
                        style={{
                          fontSize: "7px",
                          textTransform: "uppercase",
                        }}
                      >
                        {data?.gender} [{data?.type}]
                      </Text>
                    </View>

                    <View style={{ width: ticket ? "13%" : "15%" }}>
                      <Text
                        style={{
                          fontSize: "7px",
                          textTransform: "uppercase",
                        }}
                      >
                        {data?.dateOfBirth}
                      </Text>
                    </View>
                    <View style={{ width: ticket ? "13%" : "15%" }}>
                      <Text
                        style={{
                          fontSize: "7px",
                          textTransform: "uppercase",
                        }}
                      >
                        {data?.passportNation}
                      </Text>
                    </View>
                    <View style={{ width: ticket ? "13%" : "15%" }}>
                      <Text
                        style={{
                          fontSize: "7px",
                          textTransform: "uppercase",
                        }}
                      >
                        {data?.passportNumber}
                      </Text>
                    </View>
                    <View style={{ width: ticket ? "13%" : "15%" }}>
                      <Text
                        style={{
                          fontSize: "7px",
                          textTransform: "uppercase",
                        }}
                      >
                        {data?.passportExpire}
                      </Text>
                    </View>
                    {ticket && (
                      <View style={{ width: "10%" }}>
                        <Text
                          style={{
                            fontSize: "7px",
                            textTransform: "uppercase",
                          }}
                        >
                          JHFJDKFJ
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
                {passengerData?.infant?.map((data, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      padding: "8px",
                      paddingRight: "5px",
                      alignItems: "center",
                      borderBottom: "1px solid #202124",
                      borderRight: "1px solid #202124",
                      borderLeft: "1px solid #202124",
                      width: "100%",
                    }}
                    gap={1}
                  >
                    <View style={{ width: "22%" }}>
                      <Text
                        style={{
                          fontSize: "7px",
                          textTransform: "uppercase",
                        }}
                      >
                        {data?.prefix} {data?.firstName} {data?.lastName}
                      </Text>
                    </View>
                    <View style={{ width: ticket ? "13%" : "15%" }}>
                      <Text
                        style={{
                          fontSize: "7px",
                          textTransform: "uppercase",
                        }}
                      >
                        {data?.gender} [{data?.type}]
                      </Text>
                    </View>

                    <View style={{ width: ticket ? "13%" : "15%" }}>
                      <Text
                        style={{
                          fontSize: "7px",
                          textTransform: "uppercase",
                        }}
                      >
                        {data?.dateOfBirth}
                      </Text>
                    </View>
                    <View style={{ width: ticket ? "13%" : "15%" }}>
                      <Text
                        style={{
                          fontSize: "7px",
                          textTransform: "uppercase",
                        }}
                      >
                        {data?.passportNation}
                      </Text>
                    </View>
                    <View style={{ width: ticket ? "13%" : "15%" }}>
                      <Text
                        style={{
                          fontSize: "7px",
                          textTransform: "uppercase",
                        }}
                      >
                        {data?.passportNumber}
                      </Text>
                    </View>
                    <View style={{ width: ticket ? "13%" : "15%" }}>
                      <Text
                        style={{
                          fontSize: "7px",
                          textTransform: "uppercase",
                        }}
                      >
                        {data?.passportExpire}
                      </Text>
                    </View>
                    {ticket && (
                      <View style={{ width: "10%" }}>
                        <Text
                          style={{
                            fontSize: "7px",
                            textTransform: "uppercase",
                          }}
                        >
                          JHFJDKFJ
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* fare details  */}
        {renderWithDynamicHeight(
          len > 9 ? 250 : len > 6 ? 50 : len > 1 ? 200 : 100,
          <View style={{ marginTop: "20px" }}>
            <View
              style={{
                borderBottom: "2px solid #202124",
                paddingBottom: "8px",
              }}
            >
              <Text style={{ fontSize: "9.5px" }}>FARE DETAILS</Text>
            </View>

            {/* FARE INFORMATION table */}
            <View style={{ width: "100%", height: "110px" }}>
              <View>
                <View style={{ padding: "8px 0", gap: "8px" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <Text style={{ fontSize: "8px", color: "#272323" }}>
                        Total Gross Cost
                      </Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: "8px", color: "#272323" }}>
                        {singleBooking?.clientPrice.toLocaleString("en-IN")} BDT
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingBottom: "5px",
                      ...styles?.borderBottom,
                    }}
                  >
                    <View>
                      <Text style={{ fontSize: "8px", color: "#272323" }}>
                        Total Taxes
                      </Text>
                      {/* <Text
                        style={{
                          fontSize: "8px",
                          color: "#888888",
                          marginTop: "5px",
                        }}
                      >
                        (Gross Fare 0.3%)
                      </Text> */}
                    </View>
                    <Text style={{ fontSize: "8px", color: "#272323" }}>
                      {singleBooking?.taxes?.toLocaleString("en-IN")} BDT
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      ...styles?.borderBottom,
                      paddingBottom: "5px",
                    }}
                  >
                    <View>
                      <Text style={{ fontSize: "8px", color: "#272323" }}>
                        Total Discount
                      </Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: "8px", color: "#272323" }}>
                        {singleBooking?.commission.toLocaleString("en-IN")} BDT
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
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
                        Total Agent Cost
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
                        {singleBooking?.agentPrice?.toLocaleString("en-IN")} BDT
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Important Information */}
        {renderWithDynamicHeight(
          len > 9 ? 250 : len > 8 ? 10 : len > 6 ? 50 : len > 1 ? 200 : 100,
          <View style={{ marginTop: "15px" }}>
            <View
              style={{
                borderBottom: "2px solid #202124",
                paddingBottom: "10px",
              }}
            >
              <Text style={{ fontSize: "9.5px" }}>IMPORTANT INFORMATION</Text>
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
                  tickets will be treated as nonrefundable & nochangeable
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
        )}

        {/* Terms and Conditions */}
        {renderWithDynamicHeight(
          len > 8 ? 100 : len > 3 ? 300 : len > 0 ? 200 : 100,
          <View style={{ paddingTop: "15px", marginTop: "10px" }}>
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
                  border: "1px solid #000",
                  height: "120px",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "60px",
                    borderBottom: "1px solid #000",

                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      width: "20%",
                      height: "100%",
                      borderRight: "1px solid #000",
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
                        borderBottom: "1px solid #000",
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
                          borderRight: "1px solid #000",
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
                    borderBottom: "1px solid #000",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      width: "20%",
                      height: "100%",
                      borderRight: "1px solid #000",
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
                          borderRight: "1px solid #000",
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
                      borderRight: "1px solid #000",
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
                          borderRight: "1px solid #000",
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
        )}

        {/* Dangerous goods regulations */}
        {renderWithDynamicHeight(
          len > 8 ? 100 : len > 3 ? 300 : len > 0 ? 50 : 100,
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
                marginTop: "8px",
              }}
            >
              <Image
                style={{ height: "60%", width: "60%" }}
                src={EmergencyImg}
              />
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
        )}

        {/* Footer */}
        <View
          style={{
            ...styles.footer,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 30px",
          }}
          fixed
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: "8px",
            }}
          >
            Ka-9/A, Haji Abdul Latif Mansion (2nd Floor), Bashundhara R/A Road ,
            Dhaka-1229
          </Text>
          <Text style={{ color: "#FFFFFF", fontSize: "8px" }}>
            +880 55815855815, 12561512554
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default AgentInvoicePdf;
