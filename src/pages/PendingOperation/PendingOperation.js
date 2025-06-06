import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import pdfPlaceholder from "../../../src/assets/png/pdf.png";
import pngPlaceholder from "../../../src/assets/png/png.png";
import jpgPlaceholder from "../../../src/assets/png/jpg.png";
import TableSkeleton from "../../component/SkeletonLoader/TableSkeleton";
import ServerError from "../../component/Error/ServerError";
import MobileDeposit from "../../component/Accounts/Deposit/MobileDeposit";
import DynamicTable from "../../shared/Tables/DynamicTable";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { columnObj } from "../../component/AllBookings/AirTicket";
import { useAuth } from "../../context/AuthProvider";
import useWindowSize from "../../shared/common/useWindowSize";

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

const PendingOperation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jsonHeader } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const { isMobile } = useWindowSize();

  // Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
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
    data: depositAccounts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["depositAccounts", id, currentPage],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/deposit?status=${id}&page=${currentPage}`,
        jsonHeader()
      );
      setTotalPage(data?.data?.pagination?.totalPages);
      return data?.data?.deposits;
    },
    enabled: !!id,
  });

  const columns = [
    {
      ...columnObj("depositId", "Reffrence"),
      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            height: "100%",
            cursor: "pointer",
          }}
          onClick={() =>
            navigate("/dashboard/depositDetails", {
              state: { depositData: params?.row },
            })
          }
        >
          {params?.row?.depositId}
        </Typography>
      ),
    },
    {
      ...columnObj("depositType", "Staff Name "),
      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          {params?.row?.depositType === "cashDeposit"
            ? "Cash"
            : params?.row?.depositType === "bankTransferDeposit"
              ? "Bank Transfer"
              : params?.row?.depositType === "bankDeposit"
                ? "Bank"
                : "Cheque"}
        </Typography>
      ),
    },
    { ...columnObj("status", "Role") },
    {
      ...columnObj("branchName", "Branch Name", 180),
      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          {params?.row?.branchName === null ? "N/A" : params?.row?.branchName}
        </Typography>
      ),
    },
    {
      ...columnObj("amount", "Amount", 180),
      //   headerAlign: "right",
      renderCell: (params) => (
        <Typography fontSize={"13px"}>{params?.row?.amount} BDT</Typography>
      ),
    },
    { ...columnObj("transactionDate", "Transaction Date") },
    {
      ...columnObj("attatchment", "Attatchment"),
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          {params?.row?.attachment?.includes(".pdf") ? (
            <img
              src={pdfPlaceholder}
              style={{ height: "40px" }}
              onClick={() => {
                handleOpen();
                setSelectImage(params?.row?.attachment);
              }}
            />
          ) : params?.row?.attachment?.includes(".png") ? (
            <img
              src={pngPlaceholder}
              style={{ height: "40px" }}
              onClick={() => {
                handleOpen();
                setSelectImage(params?.row?.attachment);
              }}
            />
          ) : (
            <img
              src={jpgPlaceholder}
              style={{ height: "40px" }}
              onClick={() => {
                handleOpen();
                setSelectImage(params?.row?.attachment);
              }}
            />
          )}
        </Box>
      ),
    },
  ];

  const tabs = [
    { label: "all" },
    { label: "ancelaries" },
    { label: "partialTicket" },
    { label: "refund" },
    { label: "reissue" },
    { label: "supportTicket" },
    { label: "others" },
  ];

  if (isLoading) {
    return (
      <Box sx={{ bgcolor: "white", borderRadius: "5px" }}>
        <TableSkeleton />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          bgcolor: "white",
          height: "calc(93vh - 150px)",
          borderRadius: "5px",
        }}
      >
        <ServerError message={error?.response?.data?.message} />
      </Box>
    );
  }

  return isMobile ? (
    <MobileDeposit />
  ) : (
    <>
      <DynamicTable
        route={"/dashboard/pendingOperation"}
        data={depositAccounts || []}
        columns={columns}
        title="Pending Operations"
        tabs={tabs}
        // buttons={buttons}
        selectedTab={id}
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
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {selectImage?.includes(".pdf") ? (
            <iframe src={selectImage} width="100%" height="100%"></iframe>
          ) : (
            <img
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

export default PendingOperation;
