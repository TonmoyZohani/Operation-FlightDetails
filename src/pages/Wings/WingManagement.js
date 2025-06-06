import { useTheme } from "@emotion/react";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Dialog,
  Drawer,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import CustomAlert from "../../component/Alert/CustomAlert";
import CustomLoadingAlert from "../../component/Alert/CustomLoadingAlert";
import CustomToast from "../../component/Alert/CustomToast";
import { columnObj } from "../../component/AllBookings/AirTicket";
import ZoomTran from "../../component/Branch/components/ZoomTran";
import MobileHeader from "../../component/MobileHeader/MobileHeader";
import ApiNotFound from "../../component/NotFound/ApiNotFound";
import NotFound from "../../component/NotFound/NoFound";
import TableSkeleton from "../../component/SkeletonLoader/TableSkeleton";
import { useAuth } from "../../context/AuthProvider";
import useFetcher from "../../hook/useFetcher";
import useToast from "../../hook/useToast";
import PaginationBox from "../../shared/common/PaginationBox";
import Remarks from "../../shared/common/Remarks";
import useUnAuthorized from "../../shared/common/useUnAuthorized";
import useWindowSize from "../../shared/common/useWindowSize";
import DynamicTable from "../../shared/Tables/DynamicTable";
import { CustomSwitch } from "../../style/style";
import { MobileSkeleton } from "../Staff/StaffManagement";
import { WingDeleteRemarkModal } from "./WingDeleteRemarks";
import WingVerify from "./Wingverify";
import BottomNavbar from "../../component/Navbar/BottomNavbar/BottomNavbar";
import PageTitle from "../../shared/common/PageTitle";

const WingManagement = () => {
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { jsonHeader } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rowData, setRowData] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const titleRef = useRef();
  const [query, setQuery] = useState(1);
  const [refetch, setRefetch] = useState(false);
  const [changeStatusId, setChangeStatusId] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [searchById, setSearchById] = useState("");
  const { isMobile } = useWindowSize();
  const [branchData, setBranchData] = useState("");
  const [loading, setLoading] = useState(false);
  const [changeStatus, setChangeStatus] = useState({});
  const { delFetcher } = useFetcher();
  const theme = useTheme();
  const darkMode = theme?.palette?.mode === "dark";
  const { checkUnAuthorized } = useUnAuthorized();
  const [openRemarks, setOpenRemarks] = useState({
    id: "",
    open: false,
    remarks: "",
  });

  //TODO:: Fetching data from api
  const {
    data: allWing,
    isLoading,
    isError,
    error,
    status,
  } = useQuery({
    queryKey: ["allWing", id, query, refetch],
    queryFn: async () => {
      const url =
        id === "active"
          ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/branches?status=active&page=1&limit=20`
          : id === "waiting for approval"
            ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/branches?status=pending&page=1&limit=20`
            : id === "registration incomplete"
              ? `${process.env.REACT_APP_BASE_URL}/api/v1/user/branches?status=incomplete&page=1&limit=20`
              : `${process.env.REACT_APP_BASE_URL}/api/v1/user/branches?status=deactivated&page=1&limit=20`;
      const { data } = await axios.get(url, jsonHeader());
      return data;
    },
  });

  const { mutate, status: activeStatus } = useMutation({
    mutationFn: async (id) => {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/branches/${changeStatus?.status === "active" ? "deactivate" : "activate"}/${id}`,
        { remarks },
        jsonHeader()
      );
      return response.data;
    },
    onSuccess: (data) => {
      showToast("success", data?.message);
      queryClient.invalidateQueries(["staff"]);
      setRemarks("");
      setDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error updating status:", error);
    },
  });

  const handleAction = async () => {
    setDialogOpen(false);
    mutate(changeStatusId);
  };

  const ActionCell = ({ params }) => {
    const { status, id } = params;
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          px: 1,
          height: "100%",
        }}
      >
        <FormControlLabel
          onClick={async () => {
            if (status === "active") {
              setDialogOpen(true);
              setChangeStatus({ status, id });
            } else {
              setChangeStatus({ status, id });
              handleAction();
            }
          }}
          control={<CustomSwitch checked={status === "active"} />}
          label={
            <Typography
              sx={{
                textAlign: "right",
                width: { md: "50px", xs: "55px" },
                fontSize: { md: "13px", xs: "14px" },
                pr: 1,
              }}
            >
              {status === "active" ? "Active" : "Deactive"}
            </Typography>
          }
          labelPlacement="start"
        />
      </Box>
    );
  };

  const column = [
    {
      ...flexColumn("branchId", "Branch Id", 100),
      renderCell: ({ row }) => (
        <Button
          sx={{
            fontSize: "12px",
            bgcolor: "#e7f3f5",
            color: "#4D4B4B",
          }}
          disabled={id === "registration incomplete"}
          onClick={() =>
            navigate(`/dashboard/wingManagement/update-branch/${row?.id}`, {
              state: { branchStatus: id },
            })
          }
        >
          {row.branchId}
        </Button>
      ),
    },
    {
      ...flexColumn("branchName", "Branch Name"),
      renderCell: ({ row }) => (
        <>{row?.branchName ? row?.branchName : "Unknown Branch"}</>
      ),
    },
    {
      ...flexColumn("country", "Country", 80),
      renderCell: ({ row }) => (
        <>
          {row?.bangladeshBranchAddress?.bangladeshAddress?.country ||
            row?.internationalBranchAddress?.internationalAddress?.country}
        </>
      ),
    },
    ...(id === "incomplete" || id === "pending"
      ? [
          {
            ...flexColumn("name", "Concerned Person Name", 200),
            renderCell: ({ row }) => (
              <>
                {" "}
                {row?.firstName?.toUpperCase() +
                  " " +
                  row?.lastName?.toUpperCase()}
              </>
            ),
          },
        ]
      : []),
    {
      ...flexColumn("name", "Branch Manager Name", 220),
      renderCell: (params) => (
        <>
          {id === "waiting for approval" || id === "registration incomplete"
            ? params?.row?.tempUser?.firstName?.toUpperCase() +
              " " +
              params?.row?.tempUser?.lastName?.toUpperCase()
            : params?.row?.user?.firstName?.toUpperCase() +
              " " +
              params?.row?.user?.lastName?.toUpperCase()}
        </>
      ),
    },
    {
      ...flexColumn("email", "Branch Email", 220),
      renderCell: (params) => (
        <>
          {id === "waiting for approval" || id === "registration incomplete"
            ? params?.row?.tempUser?.email
            : params?.row?.user?.email}
        </>
      ),
    },
    {
      ...flexColumn("phone", "Branch Phone", 220),
      renderCell: (params) => (
        <>
          {id === "waiting for approval" || id === "registration incomplete"
            ? params?.row?.tempUser?.phone
            : params?.row?.user?.phone}
        </>
      ),
    },
    ...(id === "registration incomplete"
      ? [
          {
            ...flexColumn("action", "Verified Status"),
            headerAlign: "center",
            align: "center",
            renderCell: ({ row }) =>
              row?.status === "submitted" ? (
                <Button
                  sx={{
                    fontSize: "10px",
                    bgcolor: "var(--secondary-color)",
                    color: "#fff",
                    width: "100%",
                    "&:hover": {
                      bgcolor: "var(--secondary-color)",
                    },
                  }}
                >
                  Verified
                </Button>
              ) : (
                <Button
                  sx={{
                    fontSize: "10px",
                    bgcolor: "var(--green)",
                    color: "#fff",
                    width: "100%",
                    "&:hover": {
                      bgcolor: "var(--green)",
                    },
                  }}
                  onClick={() => {
                    setIsDrawerOpen(true);
                    setRowData(row);
                  }}
                >
                  Click to verify
                </Button>
              ),
          },
          {
            ...flexColumn("delete", "Verified Status"),
            headerAlign: "center",
            align: "center",
            renderCell: ({ row }) => (
              <Button
                variant="contained"
                size="small"
                startIcon={<DeleteIcon />}
                sx={{
                  bgcolor: "var(--primary-color)",
                  ":hover": {
                    bgcolor: "var(--primary-color)",
                  },
                }}
                onClick={() =>
                  setOpenRemarks({ id: row?.id, open: true, remarks: "" })
                }
              >
                Delete
              </Button>
            ),
          },
        ]
      : []),
    ...(id === "active"
      ? [
          {
            ...columnObj("access", "Access", 100),
            renderCell: ({ row }) => (
              <Button
                style={{
                  fontSize: "10px",
                  backgroundColor: "var(--secondary-color)",
                  color: "#fff",
                  width: "100%",
                }}
                onClick={() => {
                  navigate(
                    `/dashboard/wingManagement/status/single-branch-access/${id}`,
                    {
                      state: {
                        id: row?.id,
                        userId: row?.userId,
                        branchName: row?.branchName,
                      },
                    }
                  );
                }}
              >
                Access
              </Button>
            ),
          },
          {
            ...columnObj("activityLog", "Activity Log", 100),
            renderCell: ({ row }) => (
              <Button
                style={{
                  fontSize: "10px",
                  backgroundColor: "var(--primary-color)",
                  color: "#fff",
                  width: "100%",
                }}
                onClick={() => {
                  navigate(`/dashboard/activityLog/all/branchId=${row.id}`);
                }}
              >
                Activity Log
              </Button>
            ),
          },
        ]
      : []),
    ...(id === "active" || id === "deactive"
      ? [
          {
            ...flexColumn("status", "Status", 120),
            headerAlign: "center",
            renderCell: ({ row }) => <ActionCell params={row} />,
          },
        ]
      : []),
  ];

  const tabs = [
    { label: "active" },
    { label: "waiting for approval" },
    { label: "registration incomplete" },
    { label: "deactive" },
  ];

  const handlePageChange = (newPage) => {
    setQuery(newPage);
  };

  const handleDeleteWing = async (id, remarks) => {
    try {
      const result = await CustomAlert({
        success: "warning",
        message: "Are you sure? You want to delete this Branch?",
      });
      if (result?.isConfirmed) {
        setLoading(true);
        setOpenRemarks((prev) => ({ ...prev, open: false }));
        const response = await delFetcher({
          endPoint: `/api/v1/user/branches/delete/${id}`,
          body: { remarks },
        });

        if (response?.success) {
          showToast("success", response?.message);
          queryClient.invalidateQueries(["allWing"]);
          setOpenRemarks({});
        } else if (!response?.success && response?.statusCode === 401) {
          checkUnAuthorized(response?.error);
          showToast("error", response?.message);
        } else {
          showToast("error", response?.message);
        }
      }
    } catch (error) {
      setOpenRemarks({});
      showToast("error", error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const processBranchData = (branches) => {
    return branches.map((row) => {
      const status = row?.status || ""; 
      const firstName = status === "waiting for approval" || status === "registration incomplete"
        ? row?.tempUser?.firstName
        : row?.user?.firstName;
  
      const lastName = status === "waiting for approval" || status === "registration incomplete"
        ? row?.tempUser?.lastName
        : row?.user?.lastName;
  
      return {
        ...row,
        country:
          row?.bangladeshBranchAddress?.bangladeshAddress?.country ||
          row?.internationalBranchAddress?.internationalAddress?.country ||
          "N/A",
        name: `${firstName?.toUpperCase() || ""} ${lastName?.toUpperCase() || ""}`.trim()
      };
    });
  };
  

  const transformedBranch = allWing?.data?.data
    ? processBranchData(allWing?.data?.data)
    : [];

  return (
    <>
      {isMobile ? (
        <Box sx={{ mb: 10 }}>
          <MobileHeader
            title={"Branch Management"}
            subTitle={id}
            labelValue={id}
            labelType={"select"}
            options={tabs.map((tab) => tab.label)}
            onChange={(e) =>
              navigate(`/dashboard/wingManagement/status/${e?.target?.value}`)
            }
          />
          <Box
            sx={{
              width: {
                xs: "90%",
              },
              mx: "auto",
              mt: 5,
            }}
          >
            {isLoading && (
              <>
                {[...new Array(4)].map((_, i) => (
                  <React.Fragment key={i}>
                    <MobileSkeleton />
                  </React.Fragment>
                ))}
              </>
            )}

            {allWing?.data?.data?.length > 0 ? (
              <>
                {allWing?.data?.data?.map((wing, i) => (
                  <React.Fragment key={i}>
                    <MobileStaffCard data={wing} />
                  </React.Fragment>
                ))}
              </>
            ) : (
              <Box sx={{ height: "65vh" }}>{!isLoading && <NotFound />}</Box>
            )}

            {/* <Box
              onClick={() => navigate("/dashboard/wingManagement/add-Branch")}
              sx={mobileAddBtn()}
            >
              <AddIcon sx={{ color: "var(--white)", fontSize: "25px" }} />
            </Box> */}
          </Box>
          <BottomNavbar />
        </Box>
      ) : (
        <>
          {isLoading && (
            <Box sx={{ bgcolor: "white", borderRadius: "5px" }}>
              <TableSkeleton />
            </Box>
          )}

          {isError && (
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
            <Box sx={{ bgcolor: "#fff", pb: "10px", borderRadius: "3px" }}>
              <PageTitle
                title={"All Branch"}
                type={"dataGrid"}
                // setSearchById={setSearchById}
              />
              <DynamicTable
                route={"/dashboard/wingManagement/status"}
                data={transformedBranch}
                columns={column}
                title="Branch Management"
                tabs={tabs}
                selectedTab={id}
                type={"wingTable"}
                setQuery={setQuery}
                setSearchById={setSearchById}
              />

              <PaginationBox
                currentPage={allWing?.data?.meta?.currentPage}
                totalPages={allWing?.data.data?.meta?.totalPages}
                totalRecords={allWing?.data?.meta?.totalRecords || ""}
                onPageChange={handlePageChange}
              />
            </Box>
          )}
        </>
      )}

      <Remarks
        currentData={{ title: "Change Status" }}
        titleRef={titleRef}
        handleChangeSwitch={handleAction}
        open={dialogOpen}
        setOpen={setDialogOpen}
        remarks={remarks}
        setRemarks={setRemarks}
      />

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{ sx: { width: "50%" } }}
      >
        <WingVerify
          setIsDrawerOpen={setIsDrawerOpen}
          emailVerified={rowData?.status}
          phoneVerified={rowData?.status}
          stage={"table"}
          email={rowData?.tempUser?.email}
          phone={rowData?.tempUser?.phone}
          id={rowData?.id}
          setRefetch={setRefetch}
          branchData={rowData}
          setBranchData={setBranchData}
        />
      </Drawer>

      <Dialog
        open={openRemarks.open}
        TransitionComponent={ZoomTran}
        maxWidth={"sm"}
        fullWidth
      >
        <WingDeleteRemarkModal
          darkMode={darkMode}
          openRemarks={openRemarks}
          setOpenRemarks={setOpenRemarks}
          handleDeleteWing={handleDeleteWing}
        />
      </Dialog>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
        type="notification"
      />

      <CustomLoadingAlert
        open={loading || activeStatus === "pending"}
        text={`We Are Processing Your Branch ${activeStatus === "pending" ? "Activated" : "Delete"} Request`}
      />
    </>
  );
};

const MobileStaffCard = ({ data }) => {
  const { id } = useParams();
  return (
    <Box
      // onClick={() => {
      //   id === "active"
      //     ? navigate(`/dashboard/wingManagement/${data?.id}`, {
      //         state: data,
      //       })
      //     : navigate(`/dashboard/wingManagement/branch-wing`, {
      //         state: data,
      //       });
      // }}
      sx={{
        bgcolor: "var(--white)",
        width: "100%",
        borderRadius: "4px",
        my: "15px",
        px: "15px",
        py: "10px",
      }}
    >
      <Box>
        <Typography sx={{ fontSize: "14px", color: "#888" }}>
          {data?.branchName} Branch
        </Typography>
        <Typography
          sx={{
            fontSize: "13px",
            color: "#888",
          }}
        >
          {data?.branchManager?.nationality}
        </Typography>
        <Typography sx={{ fontSize: "12px", color: "#888", mt: "10px" }}>
          {id !== "pending" && (
            <>
              {data?.user?.firstName} {data?.user?.lastName}
            </>
          )}
        </Typography>
      </Box>
      <Box sx={justifyBetween}>
        <Typography
          sx={{ color: "#3D3A49", fontSize: "14px", fontWeight: "500" }}
        >
          {id === "pending" ? data?.uid : data?.uniqueCode}
        </Typography>

        <Typography
          sx={{
            fontSize: "14px",
            color: "#0E8749",
            fontWeight: "500",
            textTransform: "capitalize",
          }}
        >
          {id === "pending" ? (
            <span
              style={{
                color:
                  data?.approval?.toLowerCase() === "registration incomplete" &&
                  "red",
              }}
            >
              {data?.approval}
            </span>
          ) : (
            <>{data?.recordType}</>
          )}
        </Typography>
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: "17px",
            fontWeight: "500",
            textTransform: "capitalize",
          }}
        >
          {id === "pending" ? (
            <>{data?.companyName}</>
          ) : (
            <>
              {data?.firstName} {data?.lastName}
            </>
          )}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography sx={{ fontSize: "10px", color: "#888" }}>
              {id === "active" ? (
                <>Email: {data?.email}</>
              ) : (
                <>Remarks: {data?.remarks}</>
              )}
            </Typography>
            <Typography sx={{ fontSize: "10px", color: "#888" }}>
              Phone: {data?.phone}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "10px", color: "#888" }}>
            {data?.status
              ? data.status.charAt(0).toUpperCase() + data.status.slice(1)
              : ""}
          </Typography>
        </Box>
      </Box>

      <Box>
        {/* <Typography sx={{ fontSize: "11px", color: "#888" }}>
          {id === "active" ? (
            <> DOB: {moment(data?.dob).format("Do MMMM YYYY")}</>
          ) : (
            <>Updated At : {moment(data?.updatedAt).format("Do MMMM YYYY")}</>
          )}
        </Typography> */}
        {/* <Typography
          sx={{ fontSize: "11px", color: "#888", textAlign: "right" }}
        >
          {data?.status
            ? data.status.charAt(0).toUpperCase() + data.status.slice(1)
            : ""}
        </Typography> */}
      </Box>
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

export default WingManagement;
