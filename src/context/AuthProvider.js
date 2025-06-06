// AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const token = secureLocalStorage.getItem("agent-token");
  const [agentToken, setAgentToken] = useState(token);
  const [isShowNotice, setIsShowNotice] = useState(false);

  useEffect(() => {
    setAgentToken(token);
  }, []);

  const jsonHeader = () => {
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${agentToken || token}`,
      },
    };
  };

  const formDataHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${agentToken || token}`,
        "Content-Type": "multipart/form-data",
      },
    };
  };

  return (
    <AuthContext.Provider
      value={{
        isShowNotice,
        setIsShowNotice,
        agentToken,
        setAgentToken,
        jsonHeader,
        formDataHeader,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
