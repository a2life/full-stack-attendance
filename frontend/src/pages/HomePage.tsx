import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home">
      <div className="home-hero">
        <h1 className="home-title">
          Track Attendance
          <br />
          <em>with Precision</em>
        </h1>
        <p className="home-subtitle">
          Create event sheets, mark attendance for all members, and review
          historical records — all in one place.
        </p>
        <div className="home-actions">
          <Link to="/new" className="btn-primary">
            <span>＋</span> Create New Event Sheet
          </Link>
          <Link to="/sheets" className="btn-secondary">
            View Past Sheets →
          </Link>
        </div>
      </div>

      <div className="home-cards">
        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>Event Sheets</h3>
          <p>
            Create attendance sheets for any event with auto-filled date and all
            members listed.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">✅</div>
          <h3>Presence Tracking</h3>
          <p>
            Mark each member present or absent, and add individual remarks per
            member.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>Historical Records</h3>
          <p>
            Browse all past sheets with timestamps and full attendance
            breakdowns.
          </p>
        </div>
      </div>
    </div>
  );
}
