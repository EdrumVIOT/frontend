import React, { useEffect, useState } from "react";
import "../../Admin/Css/Admin.css";
import "../css/Teacher.css";
import axiosInstance from "../../axiosInstance"; // adjust path if needed

function TeachStudent() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.post("/teacher/getStudents");
        console.log("Response from backend:", response.data);
        setStudents(response.data.students || []);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="content-page">
      <h2>Сурагчид</h2>
      <div className="student-section">
        <table className="content-table styled-table">
          <thead>
            <tr>
              <th>Нэр</th>
              <th>Сургалт</th>
              <th>Бүртгүүлсэн огноо</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.course}</td>
                <td>{student.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="appointment-box enhanced-box">
          <h3>Цаг захиалсан</h3>
          <ul>
            {students.map((student) => (
              <li key={student.id}>
                <strong>{student.name}</strong> – <span>{student.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TeachStudent;
