import { useEffect } from "react";
import useAuth from "./useAuth";
import { axiosAuth } from "../actions/axios";
import useRefresher from "./useRefreshToken";

const useAxiosAuth = () => {
  const { user } = useAuth();
  const refresher = useRefresher();

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          await refresher();
          prevRequest.headers["Authorization"] = `Bearer ${user.accessToken}`;
          return axiosAuth(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [user, refresher]);

  return axiosAuth;
};

export default useAxiosAuth;
