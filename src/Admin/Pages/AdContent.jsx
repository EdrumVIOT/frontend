import React, { useEffect, useState, useContext } from "react";
import Rating from "@mui/material/Rating";
import axiosInstance, { setAuthToken } from "../../axiosInstance";
import { UserContext } from "../../UserContext";
import "../Css/Admin.css";

const AdContent = () => {
  const [contentList, setContentList] = useState([]);
  const { accessToken } = useContext(UserContext);

  useEffect(() => {
    const fetchCourseStats = async () => {
      if (!accessToken) return;

      setAuthToken(accessToken);

      try {
        const response = await axiosInstance.post("/admin/getAllCourseStats");

        setContentList(response.data.data);
      } catch (error) {
        console.error("Error fetching course stats:", error);
      }
    };

    fetchCourseStats();
  }, [accessToken]);

  return (
    <div className="content-page">
      <h2>Контент</h2>
      <table className="content-table">
        <thead>
          <tr>
            <th>Сургалт</th>
            <th>Багш</th>
            <th>Төлөв</th>
            <th>Чансаа/5</th>
            <th>Сүүлд шинэчлэгдсэн</th>
          </tr>
        </thead>
        <tbody>
          {contentList.map((item, index) => (
            <tr key={item.courseId || index}>
              <td>{item.name}</td>
              <td>{item.teacher}</td>
              <td>{item.level || "Мэдээлэл байхгүй"}</td>
              {/* <td>₮{(item.totalRevenue || 0).toLocaleString()}</td> */}
              <td>
                <Rating
                  name={`read-only-${index}`}
                  value={parseFloat(item.avgRating) || 0}
                  precision={0.1}
                  readOnly
                />
              </td>
              <td>
                {item.latestUpdate
                  ? new Date(item.latestUpdate).toLocaleDateString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdContent;
