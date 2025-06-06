import { useNavigate } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthProvider";

const useUnAuthorized = () => {
  const navigate = useNavigate();
  const { jsonHeader } = useAuth();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/agent/auth/logout`,
        {},
        jsonHeader()
      );

      const responseData = response?.data;
      if (responseData?.success === true) {
        secureLocalStorage.removeItem("agent-token");
        navigate("/");
        window.location.reload();
        queryClient.removeQueries("agent-info/agent-profile");
      }
    } catch (err) {
      console.error("Logout error:", err?.response?.data?.message);
      secureLocalStorage.removeItem("agent-token");
      navigate("/");
      window.location.reload();
      queryClient.removeQueries("agent-info/agent-profile");
    }
  };

  const checkUnAuthorized = (error) => {
    if (error?.response?.status === 401 || error?.statusCode === 401) {
      handleLogout();
    }
  };

  return { checkUnAuthorized };
};

export default useUnAuthorized;
