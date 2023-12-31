import axios from "./axios";

export const loginUser = async (data) => {
  const response = await axios.post("/api/login", data);
  return response;
}

export const signupUser = async (credentials) => {
  const response = await axios.post("/api/users/signup", credentials);
  return response;
}

export const searchUsers = async (searchValue) => {
  const response = await axios.get(`/api/users?search=${searchValue}`);
  return response;
}