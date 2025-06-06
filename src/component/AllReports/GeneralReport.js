import {
  Box,
  Button,
  SwipeableDrawer,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import qs from "query-string";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import PageTitle from "../../shared/common/PageTitle";
import PaginationBox from "../../shared/common/PaginationBox";
import useWindowSize from "../../shared/common/useWindowSize";
import DynamicTable from "../../shared/Tables/DynamicTable";
import { MobileCardSkeleton } from "../Accounts/Deposit/Deposit";
import { colorMap } from "../AllBookings/AirTicket";
import MobileHeader from "../MobileHeader/MobileHeader";
import ApiNotFound from "../NotFound/ApiNotFound";
import TableSkeleton from "../SkeletonLoader/TableSkeleton";
import ReportAdvancedFilter from "./ReportAdvancedFilter";
import BottomNavbar from "../Navbar/BottomNavbar/BottomNavbar";
import NotFound from "../NotFound/NoFound";
import Select from "react-select";

const GeneralReport = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { jsonHeader } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdvanceFilter, setIsAdvanceFilter] = useState(false);
  const [filterQuery, setFilterQuery] = useState({
    bankDeposit: true,
    bankTransferDeposit: true,
    cashDeposit: true,
    chequeDeposit: true,
    balanceTransfer: true,
    booking: true,
    module: "",
  });
  const [filterSearch, setFilterSearch] = useState(false);
  const [searchById, setSearchById] = useState("");
  const { isMobile } = useWindowSize();

  //TODO:: Fetching data from api
  const {
    data: generalLedger,
    status,
    error,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      "generalLedger",
      currentPage,
      id,
      searchById && searchById.length >= 5 ? searchById : null,
    ],
    queryFn: async () => {
      const { status, module, ...filteredQuery } = filterQuery;

      const cleanedQuery = Object.fromEntries(
        Object.entries(filteredQuery).filter(
          ([key, value]) => value !== "" && value !== undefined
        )
      );
      const queryString = qs.stringify(cleanedQuery);
      let url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/ledger?page=${currentPage}`;

      if (searchById && searchById.length >= 5) {
        url += `&searchTerm=${searchById}`;
      }

      if (
        id?.toLowerCase() &&
        id?.toLowerCase() !== "undefined" &&
        id?.toLowerCase() !== "all"
      ) {
        url += `&transactionType=${id?.split("-").join(" ").toLowerCase()}`;
      }

      if (queryString) {
        const queryParams = new URLSearchParams(queryString);
        if (!queryParams.has("transactionType")) {
          url += `&${queryString}`;
        } else {
          queryParams.delete("transactionType");
          url += `&${queryParams.toString()}`;
        }
      }

      url = url.endsWith("&") || url.endsWith("?") ? url.slice(0, -1) : url;

      const { data } = await axios.get(url, jsonHeader());
      return data?.data;
    },
    enabled: !!id,
  });

  const columns = [
    {
      field: "tranxId",
      headerName: "Transaction Id",
      width: 120,
      renderCell: ({ row }) => (
        <Button
          sx={{
            fontSize: "12px",
            bgcolor: "#e7f3f5",
            color: "#4D4B4B",
          }}
          onClick={() =>
            row?.ledgerRecord?.type === "booking"
              ? navigate(
                  `/dashboard/booking/airtickets/all/${row?.ledgerRecord?.id}`
                )
              : navigate("/dashboard/depositDetails", {
                  state: {
                    id: row?.ledgerRecord?.id,
                    depositType: row?.ledgerRecord?.type.replace(
                      /-([a-z])/g,
                      (_, letter) => letter.toUpperCase()
                    ),
                  },
                })
          }
        >
          {row?.tranxId}
        </Button>
      ),
    },

    {
      field: "operationType",
      headerName: "Operation Type",
      width: 150,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography
            sx={{
              fontSize: "13px",
              textTransform: "capitalize",
              px: "10px",
              py: "3px",
              color: "#fff",
              borderRadius: "3px",
              bgcolor:
                row?.reference === "deposit"
                  ? " #B279B3"
                  : row?.reference === "transfer"
                    ? " #2b8fd9"
                    : row?.reference === "void"
                      ? " #4782de"
                      : row?.reference === "refund"
                        ? " #4999d4"
                        : row?.reference === "reissue"
                          ? " #cf45d8"
                          : row?.reference === "return"
                            ? " #d84564"
                            : row?.reference === "issue request"
                              ? " var(--primary-color)"
                              : row?.reference === "ticketed"
                                ? " #f9a168"
                                : row?.reference === "issue rejected"
                                  ? " #53828d"
                                  : row?.reference === "ancillary approve"
                                    ? " #f56231"
                                    : " #31f5d1",
            }}
          >
            {row?.reference}
          </Typography>
        </Box>
      ),
    },
    { field: "remarks", headerName: "Remarks", flex: 1 },
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      width: 150,
      renderCell: ({ row }) => (
        <>{moment(row?.transactionDate).format("DD-MMM-YYYY")}</>
      ),
    },
    {
      field: "transactionType",
      headerName: "Transaction Type",
      width: 150,
      renderCell: ({ row }) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography
              color={
                row?.ledgerType?.toLowerCase() === "credit" ? "green" : "red"
              }
              sx={{ fontSize: "13px" }}
            >
              {row?.ledgerType?.toUpperCase()}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,
      headerAlign: "right",
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            height: "100%",
          }}
        >
          <Box display="flex" alignItems="center" fontSize="13px">
            <Typography
              color={
                row?.ledgerType?.toLowerCase() === "credit" ? "green" : "red"
              }
              fontWeight="bold"
              fontSize="14px"
            >
              {row?.ledgerType === "credit" ? "+" : "-"}
            </Typography>
            <Typography sx={{ fontSize: "13px" }} marginLeft="4px">
              {row.amount.toFixed(3)} BDT
            </Typography>
          </Box>
        </Box>
      ),
    },
  ];

  const handleAdvanceFilter = () => {
    setIsAdvanceFilter(!isAdvanceFilter);
  };

  const handleSearchClick = () => {
    setIsAdvanceFilter(false);
    setFilterSearch(true);
    navigate(`/dashboard/generalreport/${filterQuery?.transactionType}`);
    refetch();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const resetFilter = () => {
    setFilterQuery({});
    setFilterSearch(false);
    navigate(`/dashboard/generalreport/All`);
    refetch();
  };

  const GeneralLedgerTableOptions = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const selectedValue = id
      ? tabs.find(
          (tab) =>
            tab?.value?.toLowerCase() === id.split("-").join(" ").toLowerCase()
        ) || { label: "All", value: "All" }
      : { label: "All", value: "All" };

    return (
      <>
        <Box sx={{ ".MuiOutlinedInput-notchedOutline": { border: "none" } }}>
          {!filterSearch && (
            <Select
              options={tabs}
              value={selectedValue}
              onChange={(select) =>
                navigate(
                  `/dashboard/generalreport/${select?.value
                    ?.split(" ")
                    ?.join("-")}`
                )
              }
              styles={{
                control: (provided) => ({
                  ...provided,
                  width: "150px",
                  minHeight: "30px",
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                  boxShadow: "none",
                  border: "none",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "#fff",
                }),
                option: (provided, state) => ({
                  ...provided,
                  color: state.isSelected ? "white" : "#555",
                }),
                menuList: (provided) => ({
                  ...provided,
                  maxHeight: "150px",
                  overflowY: "auto",
                  "::-webkit-scrollbar": {
                    width: "2px !important",
                  },
                }),
              }}
              isSearchable={false}
              components={{
                IndicatorSeparator: null,
                DropdownIndicator: null,
              }}
            ></Select>
          )}
        </Box>
      </>
    );
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
                  {typeof value === "boolean" ? key : value}
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

  return (
    <Box>
      <PageTitle
        title={"General Ledger Report"}
        type={"dataGrid"}
        searchById={searchById}
        setSearchById={setSearchById}
      />
      {isMobile && (
        <>
          <MobileHeader
            title={"Main Ledger Report"}
            subTitle={id}
            labelValue={tabs?.find((item) => item?.label === id)}
            labelType={"select"}
            options={tabs.map((tab) => tab)}
            onChange={(select) =>
              navigate(`/dashboard/generalreport/${select?.value}`)
            }
          />
        </>
      )}

      {status === "pending" && (
        <>
          {isMobile ? (
            <Box sx={{ px: "5.1%", mt: 5 }}>
              <MobileCardSkeleton />
            </Box>
          ) : (
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: "4px",
                height: "calc(100vh - 150px)",
              }}
            >
              <TableSkeleton />
            </Box>
          )}
        </>
      )}
      {status === "error" && (
        <Box sx={{ mt: { xs: "15px", md: "0" }, px: { xs: "15px", md: "0" } }}>
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: "4px",
              height: "calc(100vh - 150px)",
            }}
          >
            {/* <ServerError message={error?.response?.data?.message} /> */}
            <ApiNotFound label={error?.response?.data?.message} />
          </Box>
        </Box>
      )}
      {status === "success" && (
        <>
          {isMobile ? (
            <Box sx={{ width: "90%", mx: "auto", mt: 5, mb: 10 }}>
              {generalLedger?.data?.length > 0 ? (
                <>
                  {generalLedger?.data?.map((ledger, i) => (
                    <React.Fragment key={i}>
                      <MobileLedgerCard ledger={ledger} />
                    </React.Fragment>
                  ))}
                </>
              ) : (
                <Box sx={{ height: "65vh" }}>{!isLoading && <NotFound />}</Box>
              )}
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
              {filterSearch && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 20,
                    left: 22,
                    zIndex: 1,
                  }}
                >
                  <FilterQueryButton />
                </Box>
              )}
              <DynamicTable
                data={generalLedger?.data || []}
                columns={columns}
                title="Main Ledger Report"
                type={"generalLedgerTable"}
                SelectBtn={GeneralLedgerTableOptions}
                handleAdvanceFilter={handleAdvanceFilter}
                setSearchById={setSearchById}
                filterSearch={filterSearch}
              />

              <PaginationBox
                currentPage={generalLedger?.meta?.currentPage}
                totalPages={generalLedger?.meta?.totalPages}
                totalRecords={generalLedger?.meta?.totalRecords}
                onPageChange={handlePageChange}
                text={"Bookings"}
              />
            </Box>
          )}
        </>
      )}

      <BottomNavbar />

      <SwipeableDrawer
        anchor="right"
        open={isAdvanceFilter}
        PaperProps={{
          sx: { width: "30%", zIndex: 999999999 },
        }}
      >
        <ReportAdvancedFilter
          setIsAdvanceFilter={setIsAdvanceFilter}
          filterQuery={filterQuery}
          setFilterQuery={setFilterQuery}
          handleSearchClick={handleSearchClick}
        />
      </SwipeableDrawer>
    </Box>
  );
};

const MobileLedgerCard = ({ ledger }) => {
  const navigate = useNavigate();
  return (
    <Box
      onClick={() =>
        ledger?.ledgerRecord?.type === "booking"
          ? navigate(
              `/dashboard/booking/airtickets/all/${ledger?.ledgerRecord?.id}`
            )
          : navigate("/dashboard/depositDetails", {
              state: {
                id: ledger?.ledgerRecord?.id,
                depositType: ledger?.ledgerRecord?.type.replace(
                  /-([a-z])/g,
                  (_, letter) => letter.toUpperCase()
                ),
              },
            })
      }
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
          sx={{ color: "#3D3A49", fontSize: "11px", fontWeight: "500" }}
        >
          {ledger?.tranxId}
        </Typography>

        <Typography
          sx={{
            fontSize: "11px",
            color:
              ledger?.ledgerType?.toLowerCase() === "credit"
                ? "red"
                : "#0E8749",
            fontWeight: "500",
            textTransform: "capitalize",
          }}
        >
          {ledger?.ledgerType}
        </Typography>
      </Box>

      <Box sx={{ mt: "12px" }}>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: "500",
            textTransform: "capitalize",
          }}
        >
          {ledger?.transactionType}
        </Typography>
        <Box>
          <Typography sx={{ fontSize: "11px", pt: "5px", color: "#888" }}>
            <i>
              {ledger?.remarks?.slice(0, 105)}
              {ledger?.remarks?.length > 105 && "..."}
            </i>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: "13px", ...justifyBetween }}>
        <Typography
          sx={{ fontSize: "11px", fontWeight: "500", color: "#444542" }}
        >
          ৳ {ledger?.amount?.toLocaleString("en-IN")}{" "}
          <span
            style={{
              color:
                ledger?.ledgerType?.toLowerCase() === "credit"
                  ? "green"
                  : "red",
            }}
          >
            {ledger?.ledgerType === "credit" ? "+" : "-"}
          </span>
        </Typography>
        <Typography sx={{ fontSize: "11px", color: "#888" }}>
          {moment(ledger?.transactionDate).format("Do MMMM YYYY")}
        </Typography>
      </Box>
    </Box>
  );
};

const justifyBetween = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const tabs = [
  {
    label: "All",
    value: "All",
  },
  {
    label: "Deposit",
    value: "Deposit",
  },
  {
    label: "Transfer",
    value: "Transfer",
  },
  {
    label: "Void",
    value: "Void",
  },
  {
    label: "Refund",
    value: "Refund",
  },
  {
    label: "Reissue",
    value: "Reissue",
  },
  {
    label: "Return",
    value: "cash return",
  },
  {
    label: "Issue Request",
    value: "Issue Request",
  },
  {
    label: "Ticketed",
    value: "Ticketed",
  },
  {
    label: "Issue Rejected",
    value: "Issue Reject",
  },
  {
    label: "Ancillary Approve",
    value: "Ancillary Approve",
  },
  {
    label: "Ancillary Reject",
    value: "Ancillary Reject",
  },
];

export default GeneralReport;
