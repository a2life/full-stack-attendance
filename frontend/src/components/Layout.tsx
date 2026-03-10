import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Layout.css";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const location = useLocation();

  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <span className="brand-icon">📋</span>
            <span className="brand-text">
              Attendance<em>Manager</em>
            </span>
          </Link>
          <nav className="nav">
            <Link
              to="/new"
              className={`nav-link ${location.pathname === "/new" ? "active" : ""}`}
            >
              New Sheet
            </Link>
            <Link
              to="/sheets"
              className={`nav-link ${location.pathname.startsWith("/sheets") ? "active" : ""}`}
            >
              Past Sheets
            </Link>
            <Link
              to="/members"
              className={`nav-link ${location.pathname === "/members" ? "active" : ""}`}
            >
              Members
            </Link>
          </nav>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <span>
          Attendance Manager — built with MongoDB, Express, React & TypeScript
        </span>
      </footer>
    </div>
  );
}
