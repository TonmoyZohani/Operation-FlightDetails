import axios from "axios";
import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../Alert/CustomAlert";

const Logout = () => {
  const { agentToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_BASE_URL}/api/v1/agent/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${agentToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const responseData = response?.data;
        if (responseData?.success === true) {
          localStorage.removeItem("agentToken");
          CustomAlert({
            success: response?.data?.success,
            message: response?.data?.message,
          });
          navigate("/");
        }
      } catch (err) {
        console.error("Logout error:", err);
      }
    };

    if (agentToken) logout();
  }, []);

  return <></>;
};

export default Logout;
