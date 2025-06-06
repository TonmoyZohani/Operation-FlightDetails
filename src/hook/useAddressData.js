import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useAddressData = (isActive, endPoint) => {
  return useQuery({
    queryKey: [endPoint, isActive],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://flyfar-int-v2-user-panel.de.r.appspot.com/api/v1/common/locations/${endPoint}`
        // `${process.env.REACT_APP_BASE_URL}/user/profile`
      );

      return data?.data;
    },
    enabled: !!isActive,
  });
};

export default useAddressData;
