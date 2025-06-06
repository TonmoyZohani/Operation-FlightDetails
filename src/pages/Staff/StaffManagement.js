import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Box,
  Button,
  Drawer,
  FormControlLabel,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React, { useRef, useState } from "react";
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import CustomAlert from "../../component/Alert/CustomAlert";
import CustomLoadingAlert from "../../component/Alert/CustomLoadingAlert";
import CustomToast from "../../component/Alert/CustomToast";
import { columnObj } from "../../component/AllBookings/AirTicket";
import ServerError from "../../component/Error/ServerError";
import MobileHeader from "../../component/MobileHeader/MobileHeader";
import ApiNotFound from "../../component/NotFound/ApiNotFound";
import NotFound from "../../component/NotFound/NoFound";
import TableSkeleton from "../../component/SkeletonLoader/TableSkeleton";
import { useAuth } from "../../context/AuthProvider";
import useToast from "../../hook/useToast";
import PageTitle from "../../shared/common/PageTitle";
import Remarks from "../../shared/common/Remarks";
import useWindowSize from "../../shared/common/useWindowSize";
import DynamicTable from "../../shared/Tables/DynamicTable";
import { CustomSwitch } from "../OTPcontrol/OTPcontrol";
import StaffVerify from "./StaffVerify";
import BottomNavbar from "../../component/Navbar/BottomNavbar/BottomNavbar";

const StaffManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jsonHeader } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rowData, setRowData] = useState({});
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const titleRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [changeStatus, setChangeStatus] = useState({});
  const [remarks, setRemarks] = useState("");
  const { agentData } = useOutletContext();
  const [query, setQuery] = useState(1);
  const [searchById, setSearchById] = useState("");
  const { isMobile } = useWindowSize();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();

  //TODO:: Fetching data from api
  const {
    data: allStaff,
    isLoading,
    isError,
    error,
    status,
  } = useQuery({
    queryKey: ["staff", id, currentPage],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/staffs?page=${currentPage}&limit=${10}&status=${id}`,
        jsonHeader()
      );
      return data;
    },
    enabled: !!id,
  });

  const { mutate, status: activeStatus } = useMutation({
    mutationFn: async (id) => {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/staffs/${changeStatus?.status === "active" ? "deactivate" : "activate"}/${id}`,
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
    const result = await CustomAlert({
      success: "warning",
      message: "Are you sure? you want to Change Status?",
    });

    if (!result.isConfirmed) {
      return;
    }
    setDialogOpen(false);
    mutate(changeStatus?.id);
  };

  const ActionCell = ({ params }) => {
    const { status, id } = params;

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          width: "100%",
          justifyContent: "start",
          ml: "-10px",
          p: 0,
          position: "relative",
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
                position: "absolute",
                color: "white",
                fontSize: "13px",
                left: status === "active" ? "24px" : "36px",
                transform: "translateY(2%)",
              }}
            >
              {status === "active" ? "On" : "Off"}
            </Typography>
          }
          labelPlacement="start"
        />
      </Box>
    );
  };

  const columns = [
    {
      ...flexColumn("staffId", "Staff Id", 100),
      renderCell: ({ row }) => (
        <Button
          sx={{
            fontSize: "12px",
            bgcolor: "#e7f3f5",
            color: "#4D4B4B",
          }}
          onClick={() => {
            row?.isDraft
              ? navigate("/dashboard/staffManagement/staffDetails", {
                  state: { id: row?.id, isDraft: row?.isDraft, staffData: row },
                })
              : navigate(`/dashboard/staffManagement/update-staff/${row?.id}`);
          }}
        >
          {row?.staffId}
        </Button>
      ),
    },
    {
      ...flexColumn("name", "Name", 110),
      renderCell: ({ row }) => (
        <>
          {row?.tempUser
            ? `${row?.tempUser?.firstName} ${row?.tempUser?.lastName}`
            : `${row?.user?.firstName} ${row?.user?.lastName}`}
        </>
      ),
    },
    {
      ...flexColumn("gender", "Gender", 80),
      renderCell: ({ row }) => <>{row?.gender?.toUpperCase()}</>,
    },
    {
      ...flexColumn("dateOfBirth", "Date Of Birth", 120),
    },
    {
      ...flexColumn("nationality", "Nationality", 120),
    },
    {
      ...flexColumn("email", "Email"),
      renderCell: ({ row }) => (
        <> {row?.tempUser ? row?.tempUser?.email : row?.user?.email}</>
      ),
    },
    {
      ...flexColumn("phone", "Phone", 130),
      renderCell: ({ row }) => (
        <> {row?.tempUser ? row?.tempUser?.phone : row?.user?.phone}</>
      ),
    },
    {
      ...flexColumn("access", "Access", 100),
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
              `/dashboard/staffManagement/staff-access/${row?.staffId}`,
              {
                state: {
                  id: row?.id,
                  userId: row?.userId,
                  user: row?.user,
                  tempUser: row?.tempUser,
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
      ...flexColumn("activityLog", "Activity Log", 100),
      renderCell: ({ row }) => (
        <Button
          style={{
            fontSize: "10px",
            backgroundColor: "var(--primary-color)",
            color: "#fff",
            width: "100%",
          }}
          onClick={() => {
            navigate(`/dashboard/activityLog/all/staffId=${row.id}`);
          }}
        >
          Activity Log
        </Button>
      ),
    },
    ...(id !== "incomplete"
      ? [
          {
            ...flexColumn("status", "Status", 120),
            headerAlign: "left",
            renderCell: ({ row }) => <ActionCell params={row} />,
          },
        ]
      : []),
    ...(id !== "active" && id !== "deactivated"
      ? [
          {
            ...flexColumn("Action", "Action", 120),
            headerAlign: "center",
            align: "center",
            renderCell: (params) =>
              params?.row.isDraft === 0 ? (
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
                    setRowData(params?.row);
                    setIsDrawerOpen(true);
                  }}
                >
                  Verify
                </Button>
              ),
          },
        ]
      : []),
  ];

  const tabs = [
    { label: "active", onClick: () => {} },
    { label: "deactivated", onClick: () => {} },
    { label: "incomplete", onClick: () => {} },
  ];

  const processStaffsData = (staffs) => {
    return staffs.map((row) => {
      const tempUser = row?.tempUser
        ? `${row?.tempUser?.firstName} ${row?.tempUser?.lastName}`
        : `${row?.user?.firstName} ${row?.user?.lastName}`;

      return {
        ...row,
        name: tempUser,
      };
    });
  };

  const transformedStaffs = allStaff?.data?.data
    ? processStaffsData(allStaff?.data?.data)
    : [];

  return isMobile ? (
    <Box sx={{ mb: 10 }}>
      <MobileHeader
        title={"Staff Management"}
        subTitle={id}
        labelValue={id}
        labelType={"select"}
        options={tabs?.map((tab) => tab.label)}
        onChange={(e) =>
          navigate(`/dashboard/staffManagement/${e?.target?.value}`)
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

        {isError && (
          <Box
            sx={{
              bgcolor: "white",
              height: "calc(93vh - 150px)",
              borderRadius: "5px",
            }}
          >
            <ServerError message={error?.response?.data?.message} />
          </Box>
        )}

        {allStaff?.data?.data?.length > 0 ? (
          <>
            {allStaff?.data?.data?.map((staff, i) => (
              <React.Fragment key={i}>
                <MobileStaffCard data={staff} />
              </React.Fragment>
            ))}
          </>
        ) : (
          <Box sx={{ height: "65vh" }}>{!isLoading && <NotFound />}</Box>
        )}

        {/* <Box
          onClick={() => navigate("/dashboard/staffManagement/add-staff")}
          sx={mobileAddBtn()}
        >
          <AddIcon sx={{ color: "var(--white)", fontSize: "25px" }} />
        </Box> */}
      </Box>
      <BottomNavbar />
    </Box>
  ) : (
    <>
      <PageTitle
        title={"All Staff"}
        type={"dataGrid"}
        searchById={searchById}
        setSearchById={setSearchById}
      />

      {isLoading && (
        <Box sx={{ bgcolor: "white", borderRadius: "0 0 5px 5px" }}>
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
        <Box>
          <DynamicTable
            route={"/dashboard/staffManagement"}
            data={transformedStaffs}
            columns={columns}
            title="Staff Management"
            tabs={tabs}
            selectedTab={id}
            type={"staffTable"}
            accessData={agentData}
            setQuery={setQuery}
            setSearchById={setSearchById}
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
            <IconButton disabled={currentPage === 1}>
              <KeyboardArrowLeftIcon
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                  }
                }}
              />
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
            <IconButton
              disabled={currentPage === allStaff?.data?.meta?.totalPages}
            >
              <KeyboardArrowRightIcon
                onClick={() => {
                  if (currentPage < allStaff?.data?.meta?.totalPages) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
              />
            </IconButton>
          </Box>
        </Box>
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

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
        type="notification"
      />

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: { width: "50%" },
        }}
      >
        <StaffVerify
          setIsDrawerOpen={setIsDrawerOpen}
          email={rowData?.tempUser?.email}
          phone={rowData?.tempUser?.phone}
          id={rowData?.id}
          stage={"table"}
          emailVerified={rowData?.status}
          phoneVerified={rowData?.status}
          staff={rowData}
          setStaff={setRowData}
        />
      </Drawer>
      <CustomLoadingAlert
        open={activeStatus === "pending"}
        text="We Are Processing Your Staff Activity Request"
      />
    </>
  );
};

const MobileStaffCard = ({ data }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleClick = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

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
          sx={{ color: "#3D3A49", fontSize: "15px", fontWeight: "500" }}
        >
          {data?.staffId}
        </Typography>

        <Typography
          sx={{
            fontSize: "11px",
            color: "#0E8749",
            fontWeight: "500",
            textTransform: "capitalize",
          }}
        >
          {data?.department || data?.wings}
        </Typography>
      </Box>

      <Box sx={{ mt: "12px" }}>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 500,
            textTransform: "capitalize",
          }}
        >
          {data?.owner?.firstName} {data?.owner?.lastName}
        </Typography>
        <Box>
          <Typography sx={{ fontSize: "11px", pt: "5px", color: "#888" }}>
            {data?.designation || data?.nationality}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: "13.5px", ...justifyBetween }}>
        <Tooltip
          open={open}
          onClose={() => setOpen(false)}
          placement="right"
          title={
            <>
              <Typography sx={{ fontSize: "13px", color: "#fff" }}>
                Phone: {data?.phone}
              </Typography>
              <Typography sx={{ fontSize: "13px", color: "#fff" }}>
                Email: {data?.email}
              </Typography>
            </>
          }
          PopperProps={{ sx: { zIndex: 1500 } }}
        >
          <Box onClick={handleClick} sx={{ ...justifyBetween, gap: "10px" }}>
            <Box sx={{ ...justifyBetween, height: "25px" }}>
              <FaPhone style={{ fontSize: "15px", color: "#888888" }} />
            </Box>
            <Box sx={{ ...justifyBetween, height: "25px" }}>
              <MdEmail style={{ fontSize: "18px", color: "#888888" }} />
            </Box>
          </Box>
        </Tooltip>
        <Typography sx={{ fontSize: "11px", color: "#888888" }}>
          DOB: {moment(data?.dateOfBirth).format("Do MMMM YYYY")}
        </Typography>
      </Box>
      <Box></Box>
    </Box>
  );
};

export const MobileSkeleton = () => {
  const props = {
    sx: { borderRadius: "2px" },
    variant: "rectangular",
    animation: "wave",
    height: "20px",
  };
  return (
    <Box>
      <Box
        sx={{
          bgcolor: "var(--white)",
          borderRadius: "4px",
          my: "15px",
          px: "15px",
          py: "11px",
          height: "105px",
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
          <Skeleton {...props} width={"180px"} height={"10px"} />
        </Box>
        <Box sx={{ ...justifyBetween, mt: "12px" }}>
          <Skeleton {...props} width={"44px"} height={"10px"} />
          <Skeleton {...props} width={"100px"} height={"10px"} />
        </Box>
      </Box>
    </Box>
  );
};

const flexColumn = (field, headerName, width = 150) => ({
  ...columnObj(field, headerName, width),
  flex: 1,
});

export const justifyBetween = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export default StaffManagement;
