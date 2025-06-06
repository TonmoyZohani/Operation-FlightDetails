import CloseIcon from "@mui/icons-material/Close";
import { DialogTitle, IconButton, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import React, { useEffect } from "react";
import useWindowSize from "../../shared/common/useWindowSize";

const ImagePreviewModal = ({
  open,
  onClose,
  imgUrl,
  label,
  alt = "preview",
}) => {
  const { isMobile } = useWindowSize();
  const [safeUrl, setSafeUrl] = React.useState(null);

  const isPdf = (url) => {
    if (!url) return false;

    if (url instanceof File) {
      return url.type === "application/pdf";
    }

    if (typeof url === "string") {
      return url.endsWith(".pdf") || url.includes(".pdf");
    }

    return false;
  };

  const generateSafeUrl = (url) => {
    if (url instanceof File) {
      return URL.createObjectURL(url);
    }
    return url;
  };

  useEffect(() => {
    if (imgUrl) {
      const generatedUrl = generateSafeUrl(imgUrl);
      setSafeUrl(generatedUrl);

      return () => {
        if (generatedUrl.startsWith("blob:")) {
          URL.revokeObjectURL(generatedUrl);
        }
      };
    }
  }, [imgUrl]);

  const handleClose = () => {
    onClose(null);
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          width: {
            xs: "100%",
            sm: "800px",
          },
          minWidth: {
            xs: "100%",
            sm: "800px",
          },
          maxHeight: {
            xs: "50px",
          },
          height: {
            xs: "100%",
          },
          pb: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* <Typography
            sx={{
              fontSize: "1.2rem",
              color: "var(--secondary-color)",
              fontWeight: 500,
            }}
          >
            {label}
          </Typography> */}
          <p
            style={{
              fontSize: "1.2rem",
              color: "var(--secondary-color)",
              fontWeight: 500,
            }}
            dangerouslySetInnerHTML={{ __html: label }}
          />
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            width: "100%",
            height: {
              xs: "55vh",
              lg: "75vh",
              md: "75vh",
              sm: "65vh",
            },
            overflowY: "hidden",
          }}
        >
          {isPdf(imgUrl)
            ? safeUrl && (
                <iframe
                  src={safeUrl}
                  title="PDF Preview"
                  width="100%"
                  height="100%"
                ></iframe>
              )
            : safeUrl && (
                <img
                  src={safeUrl}
                  alt={alt}
                  style={{ height: "100%", width: "100%", objectFit: "fill" }}
                />
              )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default ImagePreviewModal;
