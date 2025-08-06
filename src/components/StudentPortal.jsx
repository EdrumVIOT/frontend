import React, { useEffect, useState, useContext } from 'react';
import '../css/StudentPortal.css';
import axiosInstance from '../axiosInstance';
import { UserContext } from '../UserContext';

const StudentPortal = () => {
  const { token, user } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/user/getUser', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('getUser response:', res.data);

        const firstName = res.data?.user?.firstName;
        const lastName = res.data?.user?.lastName;

        if (firstName || lastName) {
          setUsername(`${firstName || ''} ${lastName || ''}`.trim());
        } else if (user?.firstName || user?.lastName) {
          setUsername(
            `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Хэрэглэгч'
          );
        } else if (user?.username) {
          setUsername(user.username);
        } else {
          setUsername('Хэрэглэгч');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);

        if (user?.firstName || user?.lastName) {
          setUsername(
            `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Хэрэглэгч'
          );
        } else if (user?.username) {
          setUsername(user.username);
        } else {
          setUsername('Хэрэглэгч');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [token, user]);

  return (
    <div className="student-portal">      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="user-section">
            <div className="user-avatar">
              <div className="avatar-inner"></div>
            </div>
            <span className="greeting">
              {isLoading ? 'Сайн уу, ...' : `Сайн уу, ${username}`}
            </span>
          </div>

          <div className="header-right">
            {/* Progress Circle */}
            <div className="progress-container">
              <div className="progress-circle">
                <svg width="100" height="100" className="progress-svg">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="6"
                    strokeDasharray={`${45 * 2 * Math.PI}`}
                    strokeDashoffset={`${45 * 2 * Math.PI * (1 - 0.45)}`}
                    strokeLinecap="round"
                    className="progress-bar"
                  />
                </svg>
                <div className="progress-text">
                  <span className="progress-percentage">45%</span>
                </div>
              </div>
              
              <div className="progress-info">
                <div className="progress-period">1 7хоног</div>
                <div className="progress-label">Сар</div>
                <div className="progress-score">80%</div>
              </div>
            </div>

            {/* Notification */}
            <div className="notification">
              <button className="notification-btn">
                <div className="notification-icon">🔔</div>
              </button>
              <div className="notification-badge"></div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="content-area">
          <div className="sections-container">
            {/* Recent Lessons */}
            <div className="section lessons-section">
              <div className="section-header">
                <h3 className="section-title">Сүүлд үзсэн хичээл</h3>
              </div>
              <div className="section-content">
                {['Видео хичээл 2', 'Видео хичээл 1', 'Видео хичээл 5', 'Видео хичээл 10'].map((lesson, index) => (
                  <div key={index} className="lesson-item">
                    <div className="lesson-content">
                      <div className="play-icon-container">
                        <div className="play-icon"></div>
                      </div>
                      <span className="lesson-title">{lesson}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="section activity-section">
              <div className="section-header">
                <h3 className="section-title">Recent Activity</h3>
              </div>
              <div className="section-content">
                <div className="activity-item blue">
                  <div className="activity-content">
                    <p className="activity-title">Amit commented on "Basic Rhythms" lesson</p>
                    <p className="activity-subtitle">Student feedback received</p>
                  </div>
                  <span className="activity-time">5 min ago</span>
                </div>
                
                <div className="activity-item green">
                  <div className="activity-content">
                    <p className="activity-title">New course</p>
                    <p className="activity-subtitle">Course material updated</p>
                  </div>
                  <span className="activity-time">5 min ago</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentPortal;