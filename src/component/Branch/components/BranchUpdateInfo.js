import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import jpgPlaceholder from "../../../assets/png/jpg.png";
import pdfPlaceholder from "../../../assets/png/pdf.png";
import pngPlaceholder from "../../../assets/png/png.png";
import ImagePreviewModal from "../../Modal/ImagePreviewModal";

const BranchUpdateInfo = ({ updateData }) => {
  const [openImage, setOpenImage] = useState({ value: "", label: "" });
  return (
    <Box sx={{ borderRadius: "5px", minHeight: "calc(100vh - 300px)", mt: 5 }}>
      <TableContainer sx={{ px: 1, border: "none", borderRadius: "5px" }}>
        <Table>
          <TableHead sx={{ borderTop: "1px solid var(--border)" }}>
            <TableRow>
              {["Label", "Value"].map((head, i) => (
                <TableCell
                  sx={{
                    width: "50%",
                    py: 0.7,
                    color: "var(--secondary-color)",
                    fontWeight: 600,
                    fontSize: "0.938rem",
                  }}
                  key={i}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {updateData?.map((data, index) => (
              <TableRow key={index}>
                <TableCell sx={{ width: "50%", textTransform: "capitalize" }}>
                  {data?.fieldName}
                </TableCell>
                <TableCell sx={{ width: "50%" }}>
                  <Typography sx={{ fontSize: "13px" }}>
                    <ShowImage
                      value={data?.value || "N/A"}
                      handleClick={() =>
                        setOpenImage({
                          label: data?.fieldName,
                          value: data?.value,
                        })
                      }
                    />
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ImagePreviewModal
        open={!!openImage?.value}
        onClose={() => setOpenImage({ value: "", label: "" })}
        imgUrl={openImage?.value}
        label={openImage?.label}
      />
    </Box>
  );
};

export const ShowImage = ({ value, handleClick }) => {
  return (
    <>
      {handleIsImage(value) ? (
        <span
          onClick={handleClick}
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            width: "max-content",
          }}
        >
          {value.includes(".pdf") ? (
            <img
              src={pdfPlaceholder}
              style={style.imgStyle}
              alt="PDF Placeholder"
            />
          ) : value?.includes(".png") ? (
            <img
              src={pngPlaceholder}
              style={style.imgStyle}
              alt="PNG Placeholder"
            />
          ) : (
            <img
              src={jpgPlaceholder}
              style={style.imgStyle}
              alt="JPG Placeholder"
            />
          )}
        </span>
      ) : (
        <span style={{ fontSize: "13px" }}>{value}</span>
      )}
    </>
  );
};

export const handleIsImage = (value) =>
  /https:|\.pdf|\.png|\.jpg|\.jpeg$/i.test(value);

export const style = {
  imgStyle: { width: "40px", height: "35px", cursor: "pointer" },
};

export default BranchUpdateInfo;
