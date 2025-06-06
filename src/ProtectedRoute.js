import axios from "axios";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";

const ProtectedRoute = ({ token, children }) => {
  const { jsonHeader } = useAuth();

  useEffect(() => {
    const handleAuthCheck = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/auth/auth-check`,
        jsonHeader()
      );
    };

    if (token) {
      // handleAuthCheck();
    }
  }, []);

  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
