import { useState, useEffect, useRef } from "react";

export const useToast = () => {
  const [openToast, setOpenToast] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const callbackRef = useRef(null);

  const showToast = (status, msg, cb) => {
    setSeverity(status);
    setMessage(msg);
    setOpenToast(true);
    callbackRef.current = cb;
  };

  useEffect(() => {
    if (openToast) {
      const handleBlur = () => {
        setOpenToast(false);
        if (callbackRef.current) {
          callbackRef.current();
        }
      };
      window.addEventListener("blur", handleBlur);

      return () => {
        window.removeEventListener("blur", handleBlur);
      };
    }
  }, []);

  const handleCloseToast = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenToast(false);
    if (callbackRef.current) {
      callbackRef.current();
    }
  };

  return { openToast, message, severity, showToast, handleCloseToast };
};

export default useToast;
