import { Box, Button, Dialog, Zoom } from "@mui/material";
import React, { useState } from "react";
import { BsChatSquareFill } from "react-icons/bs";
import NewChat from "./component/NewChat";
import AllMessage from "./component/AllMessage";
import ChatHistory, { isPdf } from "./component/ChatHistory";
import docIcon from "../../../assets/png/doc.png";
import pdfIcon from "../../../assets/png/pdf.png";


const LiveSupport = () => {
  const [id, setId] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedMsj, setSelectedMsj] = useState({});

  const [openImages, setOpenImages] = useState([]);
  const [crrImgIndex, setCrrImgIndex] = useState(null);

  return (
    <>
      <Button onClick={() => setOpen(!open)} sx={floatBtn}>
        <BsChatSquareFill
          style={{ color: "var(--white)", fontSize: "22px", marginTop: "4px" }}
        />
      </Button>

      <Dialog
        open={openImages?.length > 0}
        TransitionComponent={Zoom}
        maxWidth="md"
        fullWidth
        onClose={() => {
          setOpenImages([]);
          setCrrImgIndex(null);
        }}
      >
        <Box sx={{ px: 3, py: 2 }}>
          <Box sx={{ height: "450px" }}>
            {isPdf(openImages?.at(crrImgIndex)?.attachment) ? (
              <iframe
                src={openImages?.at(crrImgIndex)?.attachment}
                title="PDF Preview"
                width="100%"
                height={"100%"}
              ></iframe>
            ) : (
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "5px",
                  objectFit: "contain",
                }}
                src={openImages?.at(crrImgIndex)?.attachment}
                alt="attachment"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${docIcon}`;
                }}
              />
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              flexWrap: "wrap",
              mt: 2,
            }}
          >
            {openImages.map((image, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    border: "1px solid var(--border)",
                    borderColor:
                      index === crrImgIndex
                        ? "var(--primary-color)"
                        : "var(--border)",
                    width: "50px",
                    height: "50px",
                    borderRadius: "5px",
                    position: "relative",
                    cursor: "pointer",
                    p: "4px",
                  }}
                  onClick={() => {
                    setCrrImgIndex(index);
                  }}
                >
                  <img
                    src={isPdf(image?.attachment) ? pdfIcon : image?.attachment}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "5px",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `${docIcon}`;
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>
      </Dialog>

      <Zoom in={open} style={{ transformOrigin: "bottom right" }}>
        <Box
          sx={{
            position: "fixed",
            bottom: "35px",
            right: "15px",
            width: "450px",
            height: "586px",
            maxHeight: "586px",
            bgcolor: "white",
            zIndex: "1000",
            boxShadow: "0px 0px 5px 2px rgba(0,0,0,0.14)",
            borderRadius: "18px",
          }}
        >
          {id === 1 && (
            <AllMessage
              open={open}
              setId={setId}
              setOpen={setOpen}
              setSelectedMsj={setSelectedMsj}
            />
          )}
          {id === 2 && (
            <ChatHistory
              roomId={selectedMsj?.supportTextRoomId}
              selectedMsj={selectedMsj}
              setId={setId}
              setOpen={setOpen}
              setCrrImgIndex={setCrrImgIndex}
              setOpenImages={setOpenImages}
            />
          )}
          {id === 3 && <NewChat setId={setId} setOpen={setOpen} />}
        </Box>
      </Zoom>
    </>
  );
};

export const floatBtn = {
  bgcolor: "var(--secondary-color)",
  minWidth: "52px",
  height: "52px",
  display: { xs: "none", lg: "flex" },
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  position: "fixed",
  zIndex: "1000",
  right: "20px",
  bottom: "40px",
  ":hover": { bgcolor: "var(--secondary-color)" },
  padding: "0",
};


export const iconBox = {
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  backgroundColor: "var(--primary-color)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
};

export const labelStyle = {
  color: "#fff",
  fontSize: "14px",
  fontWeight: "500",
};

export const boxContainer = {
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  height: "100%",
};

export const titleBoxContainer = {
  bgcolor: "var(--secondary-color)",
  p: 2.5,
  borderRadius: "18px 18px 0 0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export default LiveSupport;
