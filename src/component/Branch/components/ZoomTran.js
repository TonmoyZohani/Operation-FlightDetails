import React from "react";
import Zoom from "@mui/material/Zoom";

const ZoomTran = React.forwardRef(function ZoomTran(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

export default ZoomTran;
