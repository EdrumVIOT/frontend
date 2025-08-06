import React from "react";

function AdFinancial() {
  return (
    <div >
      <div className="stat-grid">
        {[1, 2, 3, 4].map((_, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-title">Нийт ашиг</div>
            <div className="stat-value">₮4.2M</div>
            <div className="stat-growth">Өмнөх сараас +12%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdFinancial;
