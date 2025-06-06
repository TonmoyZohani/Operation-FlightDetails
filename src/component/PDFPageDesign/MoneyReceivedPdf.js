/* eslint-disable no-unused-vars */
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import moment from "moment";
// import AirplaneImg from "../assets/image/dummy/BG-Logo-R.png";
// import HeaderImg from "../../assets/logo/flyfarint-pdf-header.png";
import { useEffect, useState } from "react";

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
    height: 30,
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

const MoneyReceivedPdf = ({ depositData, depositType, imageSrc }) => {
  const [len, setLen] = useState(1);
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
  let bankName;
  let from;
  let to;
  if (depositType === "bankDeposit") {
    from = depositData?.adminBankAccount?.bankName;
    bankName = "Fly Far International";
  } else if (depositType === "bankTransferDeposit") {
    from = depositData?.userBankAccount?.bankName;
    bankName = depositData?.adminBankAccount?.bankName;
  } else if (depositType === "cashDeposit") {
    from = depositData?.adminBranch?.branchName;
    bankName = "Fly Far International";
  } else {
    from = depositData?.userBankAccount?.bankName;
    bankName = depositData?.adminBankAccount?.bankName;
  }

  return (
    <Document>
      <Page size="A4" style={styles?.page}>
        {/* Header */}
        {renderWithDynamicHeight(
          100,
          <View>
            <View style={{ marginBottom: "10px" }}>
              {/* <Image src={imageSrc} /> */}
            </View>
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text style={styles?.mainHeader}>
                REFERENCE: {depositData?.depositId}
              </Text>
              <Text style={{ color: "#CCCCCC" }}>MONEY RECEIPT</Text>
            </View>
          </View>
        )}

        {/* --- passenger info */}
        {renderWithDynamicHeight(
          100,
          <View style={{ marginTop: "10px" }}>
            <Text style={{ ...styles.mainTitle }}>NEED DATA</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ width: "30%", marginTop: "2px" }}>
                <Text style={{ ...styles.textHeader }}>AGENT: MASUD RANA</Text>
                <Text style={{ ...styles.textHeader }}>
                  EMAIL: masud@flyfar.tech
                </Text>
              </View>
              <View style={{ width: "30%", marginTop: "2px" }}>
                <Text style={{ ...styles.textHeader }}>REQUEST BY : AGENT</Text>
                <Text style={{ ...styles.textHeader }}>
                  REQUEST AT:{" "}
                  {moment(depositData?.createdAt).format("Do MMMM YYYY")}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* --- Transaction Details */}
        {renderWithDynamicHeight(
          len > 6 ? 50 : len > 4 ? 500 : len > 3 ? 400 : 100,
          <View style={{ marginTop: "20px" }}>
            <Text
              style={{
                ...styles?.mainTitle,
              }}
            >
              TRANSACTION DETAILS
            </Text>
            {new Array(len).fill().map((_, index) => (
              <View
                key={index}
                style={{
                  marginTop: "10px",
                  display: "flex",
                  flexDirection: "row",
                  gap: "15px",
                  padding: "5px 0",
                  ...styles?.borderTop,
                }}
              >
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
                        ...styles.mainTitle,
                        textTransform: "uppercase",
                      }}
                    >
                      {depositType} - {bankName}
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
                        <Text style={{ ...styles?.lightTitle, width: "30px" }}>
                          FROM
                        </Text>
                        <Text
                          style={{
                            ...styles.boldTitle,
                            textTransform: "uppercase",
                          }}
                        >
                          {from}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "10px",
                        }}
                      >
                        <Text style={{ ...styles?.lightTitle, width: "30px" }}>
                          TO{" "}
                        </Text>
                        <Text
                          style={{
                            ...styles.boldTitle,
                            textTransform: "uppercase",
                          }}
                        >
                          {bankName}
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
                        <Text style={{ ...styles?.lightTitle }}>
                          TRANSACTION DATE{" "}
                        </Text>
                        <Text
                          style={{ ...styles.boldTitle, marginLeft: "1px" }}
                        >
                          {moment(depositData?.transactionDate).format(
                            "Do MMMM YYYY"
                          )}
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
                        <Text style={{ ...styles?.lightTitle, width: "90px" }}>
                          TRANSACTION TYPE
                        </Text>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "10px",
                          }}
                        >
                          <Text style={{ ...styles.boldTitle }}>BEFTN</Text>
                        </View>
                      </View>

                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "20px",
                        }}
                      >
                        <Text style={{ ...styles?.lightTitle, width: "90px" }}>
                          {depositData?.reference
                            ? "TRANSACTION ID"
                            : "MONEY RECEIPT NUMBER"}
                        </Text>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "10px",
                          }}
                        >
                          <Text style={{ ...styles.boldTitle }}>
                            {depositData?.reference ||
                              depositData?.moneyReceiptNumber}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
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
              <Text
                style={{
                  ...styles?.mainTitle,
                }}
              >
                DEPOSIT DETAILS
              </Text>
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
                        Deposit Request Amount
                      </Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: "8px", color: "#272323" }}>
                        BDT {depositData?.amount?.toLocaleString("en-IN")}
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
                        Total Gateway Fee
                      </Text>
                      <Text
                        style={{
                          fontSize: "8px",
                          color: "#888888",
                          marginTop: "5px",
                        }}
                      >
                        (Gross Fare 0.3%)
                      </Text>
                    </View>
                    <Text style={{ fontSize: "8px", color: "#272323" }}>
                      BDT 0.00
                    </Text>
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
                        Approved Deposit Amount
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
                        BDT {depositData?.amount?.toLocaleString("en-IN")}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
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
              fontSize: "7px",
            }}
          >
            Ka-9/A, Haji Abdul Latif Mansion (2nd Floor), Bashundhara R/A Road ,
            Dhaka-1229
          </Text>
          <Text style={{ color: "#FFFFFF", fontSize: "7px" }}>
            +880 55815855815, 12561512554
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default MoneyReceivedPdf;
