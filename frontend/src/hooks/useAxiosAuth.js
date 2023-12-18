import { useEffect } from "react";
// import useRefreshToken from "./useRefreshToken";
// import { axiosAuth } from "../lib/axios";
// import useAuth from "./useAuth";

const useAxiosAuth = () => {
  // const { auth } = useAuth();
  // const refresher = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
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
          prevRequest.headers["Authorization"] = `Bearer ${auth.accessToken}`;
          return axiosAuth(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresher]);

  return axiosAuth;
};

export default useAxiosAuth;
