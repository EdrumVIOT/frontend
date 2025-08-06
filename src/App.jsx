import React, { useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/register";
import OTPVerification from "./components/OTPVerification";
import Home from "./components/Home";
import Subject from "./components/Subject";

import Shop from "./Shop/Components/Shop";
import Description from "./Shop/Components/Description";
import ShoppingCart from "./Shop/Components/ShoppingCart";
import GuestOrderOTP from "./Shop/Components/GuestOrderOTP";
import StudentPortal from "./components/StudentPortal";
import LessonFree from "./components/LessonFree";
import Assignments from "./components/Assignments";
import ForgotPassword from "./components/ForgotPassword";

import AdAddUser from "./Admin/Pages/AdAddUser";
import AdContent from "./Admin/Pages/AdContent";
import AdDashboard from "./Admin/Pages/AdDashboard";
import AdLogin from "./Admin/Pages/AdLogin";
import AdSettings from "./Admin/Pages/AdSettings";
import AdShop from "./Admin/Pages/AdShop";
import AdTeachers from "./Admin/Pages/AdTeachers";
import AdminLayout from "./Admin/Components/AdminLayout";
import AdFinancial from "./Admin/Pages/AdFinancial";
import AdAllProducts from "./Admin/Pages/AdAllProducts";  // <-- Added import here
import AddProduct from "./Admin/Pages/AddProduct";

import TeachLayout from "./Teacher/components/TeachLayout";
import TeachDashboard from "./Teacher/pages/TeachDashboard";
import TeachContent from "./Teacher/pages/TeachContent";
import TeachStudent from "./Teacher/pages/TeachStudents";
import TeachSettings from "./Teacher/pages/TeachSettings";
import Beginner from "./Teacher/pages/Beginner";
import Intermediate from "./Teacher/pages/Intermediate";
import Pro from "./Teacher/pages/Professional";
import Advanced from "./Teacher/pages/Advanced";
import Sidebar from "./components/Sidebar";
 
import RequireAuth from "./RequireAuth";
import { useAxiosInterceptor } from "./axiosInterceptor";

const LayoutWithSidebar = () => (
  <div style={{ display: "flex" }}>
    <Sidebar />
    <div style={{ flex: 1 }}>
      <Outlet />
    </div>
  </div>
);

function App() {
  const location = useLocation();

  useAxiosInterceptor();

  useEffect(() => {
    if (
      location.pathname === "/login" ||
      location.pathname === "/register" ||
      location.pathname === "/otp-verification"
    ) {
      document.body.className = "login-page";
    } else {
      document.body.className = "home-page";
    }
  }, [location.pathname]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/otp-verification" element={<OTPVerification />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/cart" element={<ShoppingCart />} />
      <Route path="/description/:kitId" element={<Description />} />
      <Route path="/guest-verify" element={<GuestOrderOTP />} />
      <Route path="/subject" element={<Subject />} />

      {/* Admin routes - protected */}
      <Route
        path="/admin"
        element={
          <RequireAuth allowedRoles={["admin"]}>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route path="panel" element={<AdDashboard />} />
        <Route path="settings" element={<AdSettings />} />
        <Route path="addUser" element={<AdAddUser />} />
        <Route path="shop" element={<AdShop />} />
        <Route path="all-products" element={<AdAllProducts />} /> {/* <-- Added route */}
        <Route path="teacher" element={<AdTeachers />} />
        <Route path="content" element={<AdContent />} />
        <Route path="financial" element={<AdFinancial />} />
        <Route path="add-product" element={<AddProduct />} />
      </Route>

      {/* Admin login (public) */}
      <Route path="/admin/login" element={<AdLogin />} />

      {/* Teacher routes - protected */}
      <Route
        path="/teacher"
        element={
          <RequireAuth allowedRoles={["teacher"]}>
            <TeachLayout />
          </RequireAuth>
        }
      >
        <Route path="panel" element={<TeachDashboard />} />
        <Route path="content" element={<TeachContent />} />
        <Route path="student" element={<TeachStudent />} />
        <Route path="settings" element={<TeachSettings />} />
        <Route path="course/beginner" element={<Beginner />} />
        <Route path="course/intermediate" element={<Intermediate />} />
        <Route path="course/advanced" element={<Advanced />} />
        <Route path="course/professional" element={<Pro />} />
      </Route>

      {/* Protected routes with sidebar */}
      <Route
        element={
          <RequireAuth>
            <LayoutWithSidebar />
          </RequireAuth>
        }
      />
      <Route element={<LayoutWithSidebar />}>
        <Route path="/student-portal" element={<StudentPortal />} />
        <Route path="/lessons" element={<LessonFree />} />
        <Route path="/assignments" element={<Assignments />} />
      </Route>

      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
