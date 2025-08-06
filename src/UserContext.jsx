import React, { createContext, useState, useEffect, useRef } from "react";
import axiosInstance from "./axiosInstance";
import { setAuthToken } from "./axiosInstance";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logoutTimerRef = useRef(null);
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  // Load from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedAccessToken = localStorage.getItem("accessToken");
    const savedRefreshToken = localStorage.getItem("refreshToken");

    if (savedUser && savedAccessToken && savedRefreshToken) {
      setUser(JSON.parse(savedUser));
      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${savedAccessToken}`;
      startLogoutTimer(); // ✅ Start countdown on reload
    }

    setLoading(false);
  }, []);

  // Helper to start logout countdown
  const startLogoutTimer = () => {
    clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(() => {
      logout();
      alert("30 минут өнгөрсөн тул та системээс гарлаа.");
    }, SESSION_TIMEOUT);
  };

  const login = (userData, access, refresh) => {
    setUser(userData);
    setAccessToken(access);
    setRefreshToken(refresh);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${access}`;

    startLogoutTimer(); // ✅ Start timer on login
  };

const logout = () => {
  setUser(null);
  setAccessToken(null);
  setRefreshToken(null);

  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  localStorage.removeItem("cart_id");
  localStorage.removeItem("guest_cart_synced");
  localStorage.removeItem("last_synced_cart_id");

  delete axiosInstance.defaults.headers.common["Authorization"];

  clearTimeout(logoutTimerRef.current); 
};

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setAccessToken(storedToken);
      setAuthToken(storedToken); // ✅ Important!
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  return (
    <UserContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        setToken: setAccessToken,
      }}
    >
      {!loading && children}
    </UserContext.Provider>
  );
};