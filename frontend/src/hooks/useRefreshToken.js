import { refreshUser } from "../actions/refresher,js";
import useAuth from "./useAuth";

const useRefresher = () => {
  const { setUser } = useAuth();

  const refresher = async () => {
    const response = await refreshUser();

    if (response.status === 200 && response.data.accessToken !== "") {
      setUser((prev) => {
        return {
          ...prev,
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          profilePhoto: response.data.profilePhoto,
          accessToken: response.data.accessToken,
        };
      });
    }
    return response.data.accessToken;
  };

  return refresher
};

export default useRefresher