import React, { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Box, IconButton, Typography } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Modal from "@mui/material/Modal";
import { useAuth } from "../../context/AuthProvider";
import TableSkeleton from "../../component/SkeletonLoader/TableSkeleton";
import ServerError from "../../component/Error/ServerError";
import DynamicTable from "../../shared/Tables/DynamicTable";
import { columnObj } from "../../component/AllBookings/AirTicket";
import { isMobile } from "../../shared/StaticData/Responsive";
import MobileHeader from "../../component/MobileHeader/MobileHeader";
import moment from "moment";
import { MobileSkeleton } from "../Staff/StaffManagement";
import ApiNotFound from "../../component/NotFound/ApiNotFound";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  height: "80%",
  width: "50%",
};

const SearchHistoryReport = () => {
  // const { id } = useParams();
  // const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const { jsonHeader } = useAuth();

  // Modal
  const [open, setOpen] = useState(false);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectImage, setSelectImage] = useState(null);

  const handleNext = () => {
    if (currentPage + 1 <= totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage - 1 > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  //TODO:: Fetching data from api
  const {
    data: searchHistory,
    status,
    error,
  } = useQuery({
    queryKey: ["searchHistory"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/search-history/history`,
        jsonHeader()
      );
      setTotalPage(data?.data?.pagination?.totalPages);
      setSelectImage();
      return data?.data;
    },
    // enabled: !!id,
  });

  const columns = [
    {
      ...columnObj("fareType", "Fare Type", 140),
      renderCell: ({ row }) => (
        <>
          {row?.seamanFare === true
            ? "Seaman Fare"
            : row?.studentFare === true
              ? "Student Fare"
              : "Regular Fare"}
        </>
      ),
    },
    {
      ...columnObj("tripType", "Trip Type", 130),
      renderCell: ({ row }) => (
        <>
          {row?.tripType === "oneWay"
            ? "One Way"
            : row?.tripType === "return"
              ? "Return"
              : "Multi City"}
        </>
      ),
    },
    {
      ...columnObj("route", "Route", 250),
      renderCell: ({ row }) => (
        <>
          {row?.segmentsList?.length > 0
            ? row?.segmentsList?.map((segment, index) => (
                <span style={dataHighlight} key={index}>
                  {segment?.departure}-{segment?.arrival}
                </span>
              ))
            : "N/A"}
        </>
      ),
    },
    {
      ...columnObj("travelDate", "Travel Date", 250),
      renderCell: ({ row }) => (
        <>
          {row?.segmentsList?.length > 0
            ? row?.segmentsList?.map((segment, index) => (
                <span style={dataHighlight} key={index}>
                  {segment?.departureDate}
                </span>
              ))
            : "N/A"}
        </>
      ),
    },
    {
      ...columnObj("passengerCount", "Passenger Count", 200),
      renderCell: ({ row }) => {
        return (
          <>
            {row?.passengers?.map((passenger, index) => (
              <span
                style={{
                  ...dataHighlight,
                  display: passenger?.count === 0 && "none",
                }}
                key={index}
              >
                {`${
                  passenger?.type === "ADT"
                    ? "Adult"
                    : passenger?.type === "CNN"
                      ? "Child"
                      : "Infant"
                } : ${passenger?.count}`}
              </span>
            ))}
          </>
        );
      },
    },
    {
      ...columnObj("class", "Class", 120),
      renderCell: ({ row }) => <> {row?.cabin}</>,
    },
  ];


  return (
    <>
      {isMobile && (
        <MobileHeader
          title={"Search History Report"}
          subTitle={"Search History"}
          labelValue={"Search History"}
          // labelType={"select"}
          // options={tabs.map((tab) => tab.label)}
        />
      )}

      {isMobile ? (
        <Box sx={{ px: "20px", mt: "15px" }}>
          {status === "pending" && (
            <>
              {[...new Array(4)].map((_, i) => (
                <React.Fragment key={i}>
                  <MobileSkeleton />
                </React.Fragment>
              ))}
            </>
          )}

          {status === "error" ? (
            <Box
              sx={{
                bgcolor: "white",
                height: "calc(93vh - 150px)",
                borderRadius: "5px",
              }}
            >
              <ServerError message={error?.response?.data?.message} />
            </Box>
          ) : (
            <>
              {searchHistory?.response?.map((history, i) => (
                <React.Fragment key={i}>
                  <MobileSearchHistoryCard data={history} />
                </React.Fragment>
              ))}
            </>
          )}
        </Box>
      ) : (
        <>
          {status === "pending" && (
            <Box sx={{ bgcolor: "white", borderRadius: "5px" }}>
              <TableSkeleton />
            </Box>
          )}

          {status === "error" && (
            <Box
              sx={{
                bgcolor: "white",
                height: "calc(93vh - 150px)",
                borderRadius: "5px",
              }}
            >
              <ApiNotFound label={error?.response?.data?.message} />
            </Box>
          )}

          {status === "success" && (
            <>
              <DynamicTable
                route={"/dashboard/searchreport"}
                data={searchHistory?.response || []}
                columns={columns}
                title="Search History Report"
                // tabs={tabs}
                // buttons={buttons}
                // selectedTab={id}
              />
              <Box
                sx={{
                  bgcolor: "white",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                  py: 1,
                }}
              >
                <IconButton onClick={() => handlePrev()}>
                  <KeyboardArrowLeftIcon />
                </IconButton>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      bgcolor: "var(--primary-color)",
                      color: "white",
                      borderRadius: "50%",
                      height: 30,
                      width: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {currentPage}
                  </Typography>
                </Box>
                <IconButton onClick={() => handleNext()}>
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Box>
            </>
          )}
        </>
      )}

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {selectImage?.includes(".pdf") ? (
            <iframe
              title="logo"
              src={selectImage}
              width="100%"
              height="100%"
            ></iframe>
          ) : (
            <img
              alt="logo"
              src={selectImage}
              style={{
                height: "100%",
                width: "100%",
              }}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

const MobileSearchHistoryCard = ({ data }) => {
  return (
    <Box
      sx={{
        bgcolor: "var(--white)",
        width: "100%",
        borderRadius: "4px",
        my: "15px",
        px: "15px",
        py: "10px",
      }}
    >
      <Box sx={justifyBetween}>
        <Typography
          sx={{ color: "#3D3A49", fontSize: "14px", fontWeight: "500" }}
        >
          {data?.tripType === "oneWay"
            ? "One Way"
            : data?.tripType === "return"
              ? "Return"
              : "Multi City"}
        </Typography>

        <Typography
          sx={{
            fontSize: "14px",
            color: "#0E8749",
            fontWeight: "500",
            textTransform: "capitalize",
          }}
        >
          {data?.cabin}
        </Typography>
      </Box>

      <Box sx={{ mt: "12px" }}>
        <Typography
          sx={{
            fontSize: "17px",
            fontWeight: "500",
            textTransform: "capitalize",
          }}
        >
          {data?.segmentsList?.map((segment, i, arr) => (
            <React.Fragment key={i}>
              <span
                style={{
                  display:
                    i > 0 &&
                    arr[i - 1]?.arrival === segment?.departure &&
                    "none",
                }}
              >
                {segment?.departure} -{" "}
              </span>
              <span>
                {segment?.arrival} {i < arr.length - 1 && " - "}
              </span>
            </React.Fragment>
          ))}
        </Typography>
        <Box>
          <Typography sx={{ fontSize: "12px", pt: "5px", color: "#888" }}>
            Travel Date:{" "}
            {data?.segmentsList?.map((segment, i) => (
              <React.Fragment key={i}>
                {i > 0 && ","}{" "}
                {moment(segment?.departureDate).format("Do MMM YYYY")}
              </React.Fragment>
            ))}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: "13.5px", ...justifyBetween }}>
        <Typography sx={{ fontSize: "11px", color: "#888" }}>
          {data?.passengers?.map((passenger, index) => (
            <span
              style={{ display: passenger?.count === 0 && "none" }}
              key={index}
            >
              {passenger?.type === "ADT"
                ? "Adult"
                : passenger?.type === "CNN"
                  ? "Child"
                  : "Infant"}{" "}
              {passenger?.count}
            </span>
          ))}
        </Typography>
        <Typography sx={{ fontSize: "11px", color: "#888" }}>
          {data?.seamanFare === true
            ? "Seaman Fare"
            : data?.studentFare === true
              ? "Student Fare"
              : "Regular Fare"}
        </Typography>
      </Box>
    </Box>
  );
};

const dataHighlight = {
  border: "1px solid var(--border)",
  marginRight: 8,
  padding: "2px 8px",
  borderRadius: "3px",
};

const justifyBetween = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export default SearchHistoryReport;
