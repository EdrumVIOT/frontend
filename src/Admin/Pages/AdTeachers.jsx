import React, { useEffect, useState, useContext } from "react";
import Rating from "@mui/material/Rating";
import axiosInstance from "../../axiosInstance";
import { UserContext } from "../../UserContext";
import "../Css/admin.css";

const AdTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelMounted, setPanelMounted] = useState(false);
  const [contactTeacher, setContactTeacher] = useState(null);
  const [contactPanelVisible, setContactPanelVisible] = useState(false);
  const [contactPanelMounted, setContactPanelMounted] = useState(false);

  const { accessToken } = useContext(UserContext);

  useEffect(() => {
    const fetchTeachers = async () => {
      if (!accessToken) {
        console.error("No access token found.");
        return;
      }
      try {
        const response = await axiosInstance.post("/admin/getTeacherStat");

        if (response.data.status === "error") {
          throw new Error(response.data.error || "Failed to fetch teachers");
        }

        setTeachers(response.data.data);
      } catch (error) {
        console.error("Error fetching teacher stats:", error);
      }
    };

    fetchTeachers();
  }, [accessToken]);

  const openPanel = (teacher) => {
    setSelectedTeacher(teacher);
    setPanelMounted(true);
    setTimeout(() => setPanelVisible(true), 10);
  };

  const closePanel = () => {
    setPanelVisible(false);
    setTimeout(() => {
      setPanelMounted(false);
      setSelectedTeacher(null);
    }, 300);
  };

  const openContactPanel = (teacher) => {
    setContactTeacher(teacher);
    setContactPanelMounted(true);
    setTimeout(() => setContactPanelVisible(true), 10);
  };

  const closeContactPanel = () => {
    setContactPanelVisible(false);
    setTimeout(() => {
      setContactPanelMounted(false);
      setContactTeacher(null);
    }, 300);
  };

  return (
    <div className="content-page">
      <h2>Багш нарын лист</h2>
      <div className="responsive-table-wrapper">
        <table className="content-table">
          <thead>
            <tr>
              <th>Багш</th>
              <th>Гүйцэтгэл</th>
              {/* <th>Цалин</th> */}
              <th>Чансаа</th>
              <th>Бүртгүүлсэн</th>
              <th>Нэмэлт</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.teacherId}>
                <td>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <strong>{teacher.name}</strong>
                    <span style={{ fontSize: "13px", color: "#777" }}>
                      {teacher.email}
                    </span>
                  </div>
                </td>
                <td>
                  {teacher.courseCount} Сургалт
                  <br />
                  {teacher.totalStudents} Сурагч
                </td>
                {/* <td className="paid">
                  ₮{(teacher.totalRevenue || 0).toLocaleString()}
                </td> */}
                <td>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Rating
                      name={`rating-${teacher.teacherId}`}
                      value={parseFloat(teacher.avgRating) || 0}
                      precision={0.1}
                      readOnly
                      size="small"
                    />
                    <span style={{ marginLeft: 6 }}>
                      {teacher.avgRating || "N/A"}
                    </span>
                  </div>
                </td>
                <td>{new Date(teacher.joinedAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => openPanel(teacher)}
                  >
                    Профайл
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => openContactPanel(teacher)}
                  >
                    Холбогдох
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {panelMounted && (
        <>
          <div
            className={`teacher-profile-panel ${
              panelVisible ? "slide-in" : "slide-out"
            }`}
          >
            <button className="close-btn" onClick={closePanel}>
              ✕
            </button>

            <div className="teacher-profile-header">
              <div className="teacher-avatar">
                {selectedTeacher?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <h3>{selectedTeacher?.name}</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                  {selectedTeacher?.email}
                </p>
              </div>
            </div>

            <div className="profile-detail">
              <strong>Сургалт:</strong> {selectedTeacher?.courseCount}
            </div>
            <div className="profile-detail">
              <strong>Сурагч:</strong> {selectedTeacher?.totalStudents}
            </div>
            <div className="profile-detail">
              <strong>Цалин:</strong> ₮
              {(selectedTeacher?.totalRevenue || 0).toLocaleString()}
            </div>
            <div className="profile-detail">
              <strong>Огноо:</strong>{" "}
              {new Date(selectedTeacher?.joinedAt).toLocaleDateString()}
            </div>
            <div className="profile-detail">
              <strong>Чансаа:</strong>
              <Rating
                name={`rating-${selectedTeacher?.teacherId}`}
                value={parseFloat(selectedTeacher?.avgRating) || 0}
                precision={0.1}
                readOnly
                size="small"
              />
            </div>
          </div>

          <div
            className={`profile-backdrop ${panelVisible ? "active" : ""}`}
            onClick={closePanel}
          />
        </>
      )}

      {contactPanelMounted && (
        <>
          <div
            className={`teacher-profile-panel ${
              contactPanelVisible ? "slide-in" : "slide-out"
            }`}
            style={{
              width: "400px",
              padding: "24px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <button className="close-btn" onClick={closeContactPanel}>
              ✕
            </button>
            <h3>Багштай холбоо барих</h3>
            <p>
              <strong>Нэр:</strong> {contactTeacher?.name}
            </p>
            <p>
              <strong>И-мэйл:</strong> {contactTeacher?.email}
            </p>
            <p>
              <strong>Утас:</strong> {contactTeacher?.phoneNumber || "Мэдээлэл байхгүй"}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Contact form submitted!");
                closeContactPanel();
              }}
            >
              <label htmlFor="message">Зурвас:</label>
              <textarea
                id="message"
                rows="5"
                style={{
                  width: "100%",
                  marginTop: "8px",
                  marginBottom: "12px",
                }}
                required
              />
              <button type="submit" className="btn-edit">
                Илгээх
              </button>
            </form>
          </div>
          <div
            className="profile-backdrop active"
            onClick={closeContactPanel}
          />
        </>
      )}
    </div>
  );
};

export default AdTeachers;
