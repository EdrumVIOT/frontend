import React, { useEffect, useState, useContext } from "react";
import "../../Admin/Css/Admin.css";
import axiosInstance from "../../axiosInstance";
import { UserContext } from "../../UserContext";

function TeachContent() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.post("/teacher/getOwnCourses");
        // console.log("Fetched courses:", res.data);
        setCourses(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Сургалтуудыг авахад алдаа гарлаа"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div>Түр хүлээнэ үү...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="content-page">
      <h2>Контентууд</h2>
      <table className="content-table">
        <thead >
          <tr>
            <th>Сургалт</th>
            <th>Гүйцэтгэл</th>
            <th>Цалин</th>
            <th>Чансаа</th>
            <th>Сүүлд шинэчлэгдсэн</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                Сургалт олдсонгүй.
              </td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr key={course.id || course._id}>
                <td>{course.title}</td>
                <td>
                  {course.videos} Бичлэгүүд
                  <br />
                  {course.students} Сурагчид
                </td>
                <td className="paid">
                  ₮{(course.revenue || 0).toLocaleString()}
                </td>
                <td>{course.rating}</td>
                <td>{course.lastUpdated}</td>
                <td>
                  <button className="btn-edit">Видео нэмэх</button>
                  <button className="btn-delete">Дэлгэрэнгүй</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TeachContent;
