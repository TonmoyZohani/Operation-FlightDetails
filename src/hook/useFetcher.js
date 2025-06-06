import axios from "axios";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { useAuth } from "../context/AuthProvider";

const baseUrl = process.env.REACT_APP_BASE_URL;

const useFetcher = () => {
  const { agentToken } = useAuth();
  const navigate = useNavigate();
  const token = secureLocalStorage.getItem("agent-token") || agentToken;

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const getFetcher = async (endPoint) => {
    const url = baseUrl + endPoint;

    try {
      const reponse = await axios.get(url, headers);

      return reponse?.data;
    } catch (e) {
      return e?.response?.data;
    }
  };

  const postFetcher = async ({
    endPoint,
    body,
    contentType = "application/json",
  }) => {
    const url = baseUrl + endPoint;

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (contentType !== "multipart/form-data") {
        headers["Content-Type"] = contentType;
      }

      const response = await axios.post(url, body, headers);

      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  };

  const patchFetcher = async ({
    endPoint,
    body,
    contentType = "application/json",
  }) => {
    const url = baseUrl + endPoint;

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (contentType !== "multipart/form-data") {
        headers["Content-Type"] = contentType;
      }

      const response = await axios.patch(url, body, {
        headers,
      });

      return response?.data;
    } catch (e) {
      console.error("API Error:", e);
      return e?.response?.data;
    }
  };

  const putFetcher = async ({ endPoint, body }) => {
    const url = baseUrl + endPoint;
    try {
      const reponse = await axios.put(url, JSON.stringify(body), headers);

      return reponse?.data;
    } catch (e) {
      return e?.response?.data;
    }
  };

  const delFetcher = async ({ endPoint, body }) => {
    const url = baseUrl + endPoint;

    try {
      const response = await axios.delete(url, {
        data: body,
        headers,
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  };

  const handle401 = () => {
    secureLocalStorage.removeItem("token");
    secureLocalStorage.removeItem("loggedInUser");
    navigate("/");
    window.location.reload();
  };

  return {
    token,
    baseUrl,
    getFetcher,
    postFetcher,
    patchFetcher,
    putFetcher,
    delFetcher,
    handle401,
  };
};

export default useFetcher;
