import { Box, Collapse, Typography } from "@mui/material";
import React, { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { useQuery } from "@tanstack/react-query";

import moment from "moment";
import axios from "axios";
import { useAuth } from "../../../context/AuthProvider";

const PNRhistory = ({ singleBookingData }) => {
  const { jsonHeader } = useAuth();

  const [open, setOpen] = useState(false);

  const { data: bookingLogs, status } = useQuery({
    queryKey: ["booking/log"],
    queryFn: () => {},
    // queryFn: () =>
    //   getFetcher(`/api/v1/admin/international/booking/${bookingData?.id}/log`),

    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/activities/booking/${singleBookingData?.data?.id}`,
        jsonHeader()
      );
      return data;
    },
    // enabled: false,
  });


  return (
    <>
      <Box
        sx={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "5px 5px 0 0",
          bgcolor: "white",
          p: 2,
        }}
        onClick={() => setOpen(!open)}
      >
        <Typography
          sx={{ color: "#3C4258", fontSize: "0.85rem", fontWeight: "500" }}
        >
          PNR History
        </Typography>

        <ArrowDropDownIcon
          sx={{
            transition: "transform 0.3s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            bgcolor: "white",
            borderRadius: "50%",
          }}
        />
      </Box>

      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        sx={{
          width: "100%",
          transition: "height 1s ease-in-out",
        }}
      >
        <Box
          bgcolor={"white"}
          sx={{ borderRadius: "0 0 5px 5px", p: 2, pt: 0 }}
        >
          <Typography sx={{ color: "gray", fontSize: "0.75rem" }}>
            Track Your Ticket in Every Step of Operations
          </Typography>

          {status === "success" && (
            <Box mt={3}>
              {bookingLogs?.data.map((item, i) => {
                const activityLog = item?.activityLog;

                const activitiesArray =
                  activityLog?.userActivities?.length > 0
                    ? activityLog?.userActivities
                    : activityLog?.adminActivities;

                const activitiesObj = activitiesArray?.at(0) || {};

                return (
                  <Box key={i}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Box
                        sx={{
                          height: "18px",
                          width: "18px",
                          borderRadius: "50%",
                          bgcolor: "var(--secondary-color)",
                        }}
                      />

                      <Typography
                        sx={{
                          textTransform: "capitalize",
                          color: "#3C4258",
                          fontWeight: "600",
                          fontSize: "15px",
                          color: "var(--secondary-color)",
                        }}
                      >
                        {activityLog?.operationName}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: "20px",
                        height: "80px",
                        my: "4px",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: "5px",
                          bgcolor: "var(--primary-color)",
                          ml: "7px",
                          borderRadius: "5px",
                        }}
                      />
                      <Box pt={1}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            lineHeight: 1.2,
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "var(--primary-color)",
                          }}
                        >
                          {activitiesObj?.user
                            ? activitiesObj?.user?.agent?.agencyInformation
                                ?.agencyName
                            : "Fly Far International"}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "var(--secondary-color)",
                            color: "#3C4258",
                          }}
                        >
                          {activitiesObj?.user ? (
                            <>
                              {activitiesObj?.user?.firstName}{" "}
                              {activitiesObj?.user?.lastName}
                            </>
                          ) : (
                            activitiesObj?.admin?.name
                          )}
                        </Typography>
                        {/* <Typography sx={{ lineHeight: 1.2 }}>
                          {activitiesObj?.user ? (
                            ""
                          ) : (
                            <>
                              {activitiesObj?.admin?.designation} /{" "}
                              {activitiesObj?.admin?.department}
                            </>
                          )}
                        </Typography> */}
                        <Typography
                          sx={{
                            fontSize: "12px",
                            textTransform: "capitalize",
                            color: "#3C4258",
                          }}
                        >
                          {activitiesObj?.user?.type}
                        </Typography>
                        <Typography
                          sx={{
                            lineHeight: 1.5,
                            color: "gray",
                            fontSize: "12px",
                          }}
                        >
                          {moment(
                            activityLog?.createdAt,
                            "YYYY-MM-DD HH:mm:ss"
                          ).format("DD MMM YYYY hh:mm:ss A")}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Collapse>
    </>
  );
};

export default PNRhistory;
