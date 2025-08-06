import React, { useState, useContext } from "react";
import "../../css/Login.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { UserContext } from "../../UserContext";
import axiosInstance from "../../axiosInstance";

function AdLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(UserContext);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || "/admin/panel";

  const setAuthToken = (token) => {
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  };

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/admin/adminLogin", {
        phoneNumber: phoneNumber.trim(),
        password: password.trim(),
      });

      const { accessToken, refreshToken } = res.data;

      if (!accessToken || !refreshToken) {
        setError("Админ нэвтрэхэд алдаа гарлаа");
        setIsLoading(false);
        return;
      }

      setAuthToken(accessToken);

      const userRes = await axiosInstance.get("/user/getUser");

      const adminUser = userRes.data.user;

      login(adminUser, accessToken, refreshToken);
      // console.log("User role:", adminUser.role);

      if (adminUser.role === "teacher") {
        navigate("/teacher/panel", { replace: true });
      } else if (adminUser.role === "admin") {
        navigate("/admin/panel", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      const backendMsg =
        err.response?.data?.message || "Нэвтрэхэд алдаа гарлаа";

      // If backend returns "invalid credentials", replace with your Mongolian message
      if (backendMsg.toLowerCase().includes("invalid credentials")) {
        setError("Нууц үг буруу байна.");
      } else {
        setError(backendMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-container admin-login-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </button>

      <div className="login-box">
        <h2>Админ</h2>
        <p className="subtitle">Админ эрхээр нэвтэрнэ үү</p>

        <input
          type="text"
          placeholder="Утасны дугаар"
          className="input"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Нууц үг"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />

        {error && <div className="error-text">{error}</div>}

        <button
          className="login-btn" style={{marginTop:"15px"}}
          onClick={handleLogin}
          disabled={isLoading || !phoneNumber.trim() || !password.trim()}
        >
          {isLoading ? "Нэвтэрч байна..." : "Нэвтрэх"}
        </button>
      </div>
    </div>
  );
}

export default AdLogin;
