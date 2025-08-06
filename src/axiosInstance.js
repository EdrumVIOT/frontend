import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.168:3000',
  // baseURL: "http://202.180.219.61:3000",

  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to set or remove the Authorization header dynamically
export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export default axiosInstance;
