import {
  Box,
  Button,
  Skeleton,
  SwipeableDrawer,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import qs from "query-string";
import React, { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import jpgPlaceholder from "../../../../src/assets/png/jpg.png";
import pdfPlaceholder from "../../../../src/assets/png/pdf.png";
import pngPlaceholder from "../../../../src/assets/png/png.png";
import { useAuth } from "../../../context/AuthProvider";
import useToast from "../../../hook/useToast";
import PageTitle from "../../../shared/common/PageTitle";
import PaginationBox from "../../../shared/common/PaginationBox";
import useUnAuthorized from "../../../shared/common/useUnAuthorized";
import useWindowSize from "../../../shared/common/useWindowSize";
import DynamicTable from "../../../shared/Tables/DynamicTable";
import CustomToast from "../../Alert/CustomToast";
import { colorMap, columnObj } from "../../AllBookings/AirTicket";
import MobileHeader from "../../MobileHeader/MobileHeader";
import ImagePreviewModal from "../../Modal/ImagePreviewModal";
import ApiNotFound from "../../NotFound/ApiNotFound";
import TableSkeleton from "../../SkeletonLoader/TableSkeleton";
import DepositAdvancedFilter from "./DepositAdvancedFilter";
import NotFound from "../../NotFound/NoFound";
import BottomNavbar from "../../Navbar/BottomNavbar/BottomNavbar";

const DepositManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [totalPage, setTotalPage] = useState();
  const { jsonHeader } = useAuth();
  const { agentData } = useOutletContext();
  const [query, setQuery] = useState(1);
  const [isAdvanceFilter, setIsAdvanceFilter] = useState(false);
  const [filterQuery, setFilterQuery] = useState({});
  const [filterSearch, setFilterSearch] = useState(false);
  const [searchById, setSearchById] = useState("");
  const depositOperations = agentData?.userAccess?.deposit;
  const agentCms = agentData?.agentCms?.eligibleRangeCms ?? {};
  const { isMobile } = useWindowSize();
  const { checkUnAuthorized } = useUnAuthorized();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  const [imgUrl, setImgUrl] = useState(null);

  //TODO:: Fetching data from api
  const {
    data: depositAccounts,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "depositAccounts",
      id,
      query,
      searchById && searchById.length >= 6 ? searchById : null,
    ],
    queryFn: async () => {
      const { status, ...filteredQuery } = filterQuery;

      const cleanedQuery = Object.fromEntries(
        Object.entries(filteredQuery).filter(
          ([key, value]) => value !== "" && value !== undefined
        )
      );

      const queryString = qs.stringify(cleanedQuery);

      let url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/deposit?`;

      if (searchById && searchById.length >= 6) {
        url += `searchTerm=${searchById}`;
      } else {
        if (id && id !== "all" && id !== "undefined") {
          url += `status=${id}&`;
        }
        if (query) {
          url += `page=${query}&`;
        }
        if (queryString) {
          url += queryString;
        }
      }

      url = url.endsWith("&") || url.endsWith("?") ? url.slice(0, -1) : url;

      // Make the API request
      const { data } = await axios.get(url, jsonHeader());
      setTotalPage(data?.data?.meta);
      return data?.data?.deposits;
    },
    enabled: !!id,
    onError: (err) => {
      if (err?.response?.status === 401) {
        showToast("error", "You are unauthorized to access this site.");
        checkUnAuthorized(err);
      } else {
        showToast(
          "error",
          "An error occurred while fetching deposit accounts."
        );
        console.error("Error fetching deposit accounts:", err);
      }
    },
  });

  const columns = [
    {
      ...flexColumn("depositId", "Deposit Id", 130),
      renderCell: ({ row }) => (
        <Button
          sx={{ fontSize: "12px", bgcolor: "#e7f3f5", color: "#4D4B4B" }}
          onClick={() =>
            navigate("/dashboard/depositDetails", {
              state: { id: row?.id, depositType: row?.depositType },
            })
          }
        >
          {row?.depositId}
        </Button>
      ),
    },
    {
      ...flexColumn("depositType", "Deposit Type"),
      renderCell: ({ row }) =>
        row?.depositType === "cashDeposit"
          ? "Cash"
          : row?.depositType === "bankTransferDeposit"
            ? "Bank Transfer"
            : row?.depositType === "bankDeposit"
              ? "Bank Deposit"
              : "Cheque",
    },
    {
      ...flexColumn("status", "Status", 130),
      renderCell: ({ row }) => {
        const statusColors = {
          pending: "#B279B3",
          approved: "#52be5a",
          rejected: "red",
        };
        return (
          <Button
            sx={{
              fontSize: "10px",
              backgroundColor: statusColors[row?.status] || "red",
              ":hover": {
                backgroundColor: statusColors[row?.status] || "red",
              },
              color: "#fff",
            }}
          >
            {row?.status}
          </Button>
        );
      },
    },
    {
      ...flexColumn("transferType", "Transfer Type", 130),
      renderCell: ({ row }) => (row?.transferType ? row?.transferType : "N/A"),
    },
    {
      ...flexColumn("senderBankName", "Sender Bank Name", 160),
      renderCell: ({ row }) => row?.senderBankName || "N/A",
    },
    {
      ...flexColumn("receiverBankName", "Receiver Bank Name", 160),
      renderCell: ({ row }) =>
        row?.receiverBankName === null ? "N/A" : row?.receiverBankName,
    },

    flexColumn("transactionDate", "Transaction Date", 130),
    {
      ...flexColumn("attatchment", "Attatchment", 130),
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ ...justifyCenter, height: "100%", cursor: "pointer" }}>
          {params?.row?.attachment?.includes(".pdf") ? (
            <img
              alt="logo"
              src={pdfPlaceholder}
              style={{ height: "40px" }}
              onClick={() => {
                // handleOpen();
                setImgUrl(params?.row?.attachment);
                // setSelectImage(params?.row?.attachment);
              }}
            />
          ) : params?.row?.attachment?.includes(".png") ? (
            <img
              alt="logo"
              src={pngPlaceholder}
              style={{ height: "40px" }}
              onClick={() => {
                // handleOpen();
                // setSelectImage(params?.row?.attachment);
                setImgUrl(params?.row?.attachment);
              }}
            />
          ) : (
            <img
              alt="logo"
              src={jpgPlaceholder}
              style={{ height: "40px" }}
              onClick={() => {
                // handleOpen();
                // setSelectImage(params?.row?.attachment);
                setImgUrl(params?.row?.attachment);
              }}
            />
          )}
        </Box>
      ),
    },
    flexColumn("devicePlatform", "Platform", 100),
    {
      ...flexColumn("amount", "Amount", 100),
      headerAlign: "right",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            height: "100%",
          }}
        >
          <Typography fontSize={"13px"}>{params?.row?.amount} BDT</Typography>
        </Box>
      ),
    },
  ];

  const tabs = [
    { label: "all" },
    { label: "pending" },
    { label: "approved" },
    { label: "rejected" },
  ];

  const handleSearchClick = () => {
    setIsAdvanceFilter(false);
    setFilterSearch(true);
    navigate(`/dashboard/deposits/${filterQuery?.status}`);
    refetch();
  };

  const handlePageChange = (newPage) => {
    setQuery(newPage);
  };

  const handleAdvanceFilter = () => {
    setIsAdvanceFilter(!isAdvanceFilter);
  };

  const resetFilter = () => {
    setFilterQuery({});
    setFilterSearch(false);
    navigate(`/dashboard/deposits/all`);
    refetch();
  };

  const FilterQueryButton = () => {
    return (
      <Box
        sx={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          maxWidth: "100%",
        }}
      >
        {Object.keys(filterQuery)
          .filter((key) => filterQuery[key])
          .map((key, i) => {
            const value = filterQuery[key];
            const color = colorMap[key] || "#53828d";

            return (
              <Tooltip title={key.toUpperCase()} key={i}>
                <Button
                  style={{
                    color: "#fff",
                    backgroundColor: color,
                    flexBasis: "auto",
                    marginBottom: "8px",
                  }}
                  sx={{
                    fontSize: { lg: "11px", xs: "11px" },
                    minWidth: "fit-content",
                  }}
                >
                  {value}
                </Button>
              </Tooltip>
            );
          })}

        {/* Add a Refresh button */}
        <Button
          style={{
            backgroundColor: "#f9a168",
            color: "#fff",
            fontSize: "11px",
            marginBottom: "8px",
          }}
          onClick={() => {
            resetFilter();
          }}
        >
          Reset
        </Button>
      </Box>
    );
  };

  return isMobile ? (
    <Box sx={{ mb: 10 }}>
      <MobileHeader
        title="Deposit Management"
        subTitle={id}
        labelValue={id}
        labelType="select"
        options={tabs.map((tab) => tab.label)}
        onChange={(e) => navigate(`/dashboard/deposits/${e?.target?.value}`)}
      />

      <Box sx={{ width: "90%", mx: "auto", mt: 5 }}>
        {isLoading && <MobileCardSkeleton />}
        {isError && <ErrorComponent message={error?.response?.data?.message} />}

        {depositAccounts?.length > 0 ? (
          <>
            {depositAccounts?.map((deposit, i) => (
              <React.Fragment key={i}>
                <MobileDepositCard data={deposit} />
              </React.Fragment>
            ))}
          </>
        ) : (
          <Box sx={{ height: "65vh" }}>{!isLoading && <NotFound />}</Box>
        )}
      </Box>
      <BottomNavbar />
    </Box>
  ) : (
    <Box
      sx={{
        position: "relative",
        pb: 3,
        bgcolor: "white",
        borderRadius: "5px",
      }}
    >
      <PageTitle
        title="All Deposit Table"
        type="dataGrid"
        searchById={searchById}
        setSearchById={setSearchById}
      />
      {isLoading ? (
        <Box sx={{ bgcolor: "white", borderRadius: "5px" }}>
          <TableSkeleton />
        </Box>
      ) : isError ? (
        <ErrorComponent message={error?.response?.data?.message} />
      ) : (
        <>
          {filterSearch && (
            <Box
              sx={{
                position: "absolute",
                top: 65,
                left: 22,
                zIndex: 1,
              }}
            >
              <FilterQueryButton />
            </Box>
          )}
          <DynamicTable
            route="/dashboard/deposits"
            data={depositAccounts || []}
            columns={columns}
            title="Deposit Management"
            setQuery={setQuery}
            tabs={filterSearch ? [] : tabs}
            selectedTab={id}
            pagesRecord={totalPage}
            type="depositTable"
            setSearchById={setSearchById}
            accessData={depositOperations?.operations}
            handleAdvanceFilter={handleAdvanceFilter}
            agentCms={agentCms}
          />
          <PaginationBox
            currentPage={totalPage?.currentPage}
            totalPages={totalPage?.totalPages}
            totalRecords={totalPage?.totalRecords}
            onPageChange={handlePageChange}
            text={"Deposits"}
          />
          <SwipeableDrawer
            anchor="right"
            open={isAdvanceFilter}
            PaperProps={{
              sx: { width: "30%", zIndex: 999999999 },
            }}
          >
            <DepositAdvancedFilter
              setIsAdvanceFilter={setIsAdvanceFilter}
              filterQuery={filterQuery}
              setFilterQuery={setFilterQuery}
              handleSearchClick={handleSearchClick}
            />
          </SwipeableDrawer>
        </>
      )}

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
        type="notification"
      />

      {/* <Modal open={open} onClose={handleClose}>
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
      </Modal> */}
      <ImagePreviewModal
        open={imgUrl}
        imgUrl={imgUrl}
        onClose={setImgUrl}
        label={"Deposit Attachment"}
      />
    </Box>
  );
};

const MobileDepositCard = ({ data }) => {
  const navigate = useNavigate();
  return (
    <Box
      onClick={() =>
        navigate("/dashboard/depositDetails", {
          state: { id: data?.id, depositType: data?.depositType },
        })
      }
      sx={{
        bgcolor: "var(--white)",
        width: "100%",
        borderRadius: "4px",
        my: "10px",
        px: "15px",
        py: "15px",
        minHeight: "110px",
      }}
    >
      <Box sx={justifyBetween}>
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          <Typography
            sx={{ color: "#888888", fontSize: "11px", fontWeight: "500" }}
          >
            {data?.depositId}
          </Typography>
          <Typography
            sx={{
              color: "#18457b",
              fontWeight: 500,
              fontSize: "8px",
              bgcolor: "#c7e4ff",
              px: "5px",
              py: "2px",
              borderRadius: "3px",
              fontWeight: "500",
            }}
          >
            {data?.devicePlatform}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: "11px",
            color:
              data?.status === "approved"
                ? "#0E8749"
                : data?.status === "pending"
                  ? "var(--secondary-color)"
                  : "red",
            fontWeight: "500",
            textTransform: "capitalize",
          }}
        >
          {data?.status}
        </Typography>
      </Box>

      <Box sx={{ mt: "8px" }}>
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: "400",
            color: "var(--mateblack)",
          }}
        >
          {data?.depositType === "cashDeposit"
            ? "Cash"
            : data?.depositType === "bankTransferDeposit"
              ? "Bank Transfer"
              : data?.depositType === "bankDeposit"
                ? "Bank"
                : "Cheque"}{" "}
          Deposit
        </Typography>
        <Box>
          <Typography sx={{ fontSize: "9px", color: "#A2A1A1" }}>
            TRNX ID: {data?.moneyReceiptNumber} ,{" "}
            {moment(data?.createdAt).format("Do MMMM YYYY")}
            {data?.branchManagerName && (
              <span style={{ color: "var(--primary-color)" }}>
                {" "}
                , By {data?.branchManagerName}
              </span>
            )}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: "12px", ...justifyBetween }}>
        <Typography
          sx={{ fontSize: "11px", fontWeight: "500", color: "#888888" }}
        >
          ৳ {data?.amount?.toLocaleString("en-IN")}
        </Typography>
        <Typography sx={{ fontSize: "11px", color: "#888888" }}>
          {moment(data?.transactionDate).format("Do MMMM YYYY")}
        </Typography>
      </Box>
    </Box>
  );
};

export const MobileCardSkeleton = ({ height = "100px" }) => {
  const props = {
    sx: { borderRadius: "2px" },
    variant: "rectangular",
    animation: "wave",
    height: "20px",
  };
  return (
    <>
      {[...new Array(4)].map((_, i) => (
        <Box
          key={i}
          sx={{
            bgcolor: "var(--white)",
            borderRadius: "4px",
            my: "10px",
            px: "15px",
            py: "10px",
            height,
          }}
        >
          <Box sx={justifyBetween}>
            <Skeleton {...props} width={"84px"} height={"10px"} />
            <Skeleton {...props} width={"64px"} height={"10px"} />
          </Box>

          <Box sx={{ mt: "12px" }}>
            <Skeleton {...props} width={"110px"} height={"10px"} />
          </Box>

          <Box sx={{ mt: "12px" }}>
            <Skeleton {...props} width={"150px"} height={"10px"} />
          </Box>
          <Box sx={{ ...justifyBetween, mt: "12px" }}>
            <Skeleton {...props} width={"80px"} height={"10px"} />
            <Skeleton {...props} width={"100px"} height={"10px"} />
          </Box>
        </Box>
      ))}
    </>
  );
};

export const MobileCardBookingAirTickets = ({ height = "100px" }) => {
  const props = {
    sx: { borderRadius: "4px" },
    variant: "rectangular",
    animation: "wave",
    height: "20px",
  };
  return (
    <>
      {[...new Array(4)].map((_, i) => (
        <Box
          key={i}
          sx={{
            bgcolor: "var(--white)",
            borderRadius: "4px",
            my: "15px",
            px: "15px",
            py: "10px",
            height,
          }}
        >
          <Box sx={justifyBetween}>
            <Skeleton {...props} width={"84px"} height={"10px"} />
            <Skeleton {...props} width={"64px"} height={"10px"} />
          </Box>

          <Box sx={{ mt: "12px" }}>
            <Skeleton {...props} width={"110px"} height={"10px"} />
          </Box>

          <Box sx={{ mt: "12px" }}>
            <Skeleton {...props} width={"150px"} height={"10px"} />
          </Box>
          <Box sx={{ ...justifyBetween, mt: "12px" }}>
            <Skeleton {...props} width={"80px"} height={"10px"} />
            <Skeleton {...props} width={"100px"} height={"10px"} />
          </Box>
        </Box>
      ))}
    </>
  );
};

const ErrorComponent = ({ message }) => {
  return (
    <Box
      sx={{
        bgcolor: "white",
        height: "calc(93vh - 150px)",
        borderRadius: "5px",
      }}
    >
      <ApiNotFound label={message} />
    </Box>
  );
};

const flexColumn = (field, headerName, width = 150) => ({
  ...columnObj(field, headerName, width),
  flex: 1,
});

const justifyBetween = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const justifyCenter = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default DepositManagement;
