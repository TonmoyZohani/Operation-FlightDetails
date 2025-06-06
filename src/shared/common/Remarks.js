import { Box, Button, Dialog, Typography } from "@mui/material";
import React from "react";
import Zoom from "@mui/material/Zoom";
import CloseIcon from "@mui/icons-material/Close";
import { actionBtn, dialogInputAndTextArea } from "./ApproveRejectDialog";

const ZoomTran = React.forwardRef(function ZoomTran(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

const Remarks = ({
  currentData,
  titleRef,
  handleChangeSwitch,
  open,
  setOpen,
  remarks,
  setRemarks,
}) => {
  const handleInputChange = (e) => {
    setRemarks(e.target.value);
  };
  return (
    <Dialog open={open} TransitionComponent={ZoomTran} maxWidth="sm" fullWidth>
      <Box
        sx={{
          px: 3,
          py: 2,
          "& input, & textarea": {
            ...dialogInputAndTextArea,
            bgcolor: "#F6F6F6",
          },
        }}
      >
        <Typography sx={{ fontSize: "0.99rem", mt: 2, fontWeight: 500 }}>
          Please Type Reason to complete this operations in the below section
        </Typography>
        <textarea
          ref={titleRef}
          placeholder="Type here..."
          rows={2}
          style={{ resize: "none" }}
          value={remarks}
          onChange={handleInputChange}
        />

        <Typography sx={{ fontSize: "14px", my: 1 }}>Action</Typography>

        <Box sx={{ display: "flex", gap: "10px", height: "45px" }}>
          <Button
            disabled={remarks?.length === 0}
            onClick={handleChangeSwitch}
            sx={{ ...actionBtn.approve, ...actionBtn, minWidth: "180px" }}
          >
            {currentData?.title}
          </Button>
          <Button
            onClick={() => {
              setRemarks("");
              setOpen(false);
            }}
            sx={{ ...actionBtn.reject, ...actionBtn, minWidth: "46px" }}
          >
            <CloseIcon sx={{ fontSize: "18px" }} />
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default Remarks;
