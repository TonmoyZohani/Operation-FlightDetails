import React, { useEffect, useState } from "react";
import SearchPage from "./SearchPage";
import { useAuth } from "../../context/AuthProvider";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const RecentSearch = () => {
  const { jsonHeader } = useAuth();
  const [recentSearch, setRecentSearch] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { agentData } = useOutletContext();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const fetchSearchHistory = async () => {
      setIsLoading(true);
      const url = `${process.env.REACT_APP_BASE_URL}/api/v1/user/search-history/frequent-search?date=${today}`;
      try {
        const response = await axios.get(url, jsonHeader());
        const sortedData =
          response.data?.data?.response?.map((entry) => ({
            ...entry,
            segmentsList: entry.segmentsList.sort(
              (a, b) => new Date(a.departureDate) - new Date(b.departureDate)
            ),
          })) || [];

        setRecentSearch(sortedData);
      } catch (error) {
        console.error("Error fetching search history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchHistory();
  }, []);

  return (
    <>
      <SearchPage
        accessData={agentData?.userAccess}
        recentSearch={recentSearch}
        selectedRoute={selectedRoute}
        setSelectedRoute={setSelectedRoute}
        isLoading={isLoading}
      />
    </>
  );
};

export default RecentSearch;
