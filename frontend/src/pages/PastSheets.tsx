import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fetchEventSheets, deleteEventSheet } from "../api";
import { EventSheet } from "../types";
import "./PastSheets.css";

export default function PastSheets() {
  const [sheets, setSheets] = useState<EventSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetchEventSheets()
      .then(setSheets)
      .catch(() => setError("Failed to load sheets."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteEventSheet(id);
      setSheets((prev) => prev.filter((s) => s._id !== id));
    } catch {
      alert("Failed to delete sheet.");
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Loading sheets…</p>
      </div>
    );
  }

  return (
    <div className="past-sheets">
      <div className="past-header">
        <div>
          <h1 className="past-title">Past Sheets</h1>
          <p className="past-subtitle">
            {sheets.length} event{sheets.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
        <Link to="/new" className="btn-new">
          ＋ New Sheet
        </Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {sheets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No sheets yet</h3>
          <p>Create your first event sheet to get started.</p>
          <Link to="/new" className="btn-primary-sm">
            Create Event Sheet
          </Link>
        </div>
      ) : (
        <div className="sheets-grid">
          {sheets.map((sheet) => {
            const present = sheet.attendance.filter((a) => a.present).length;
            const total = sheet.attendance.length;
            const pct = total ? Math.round((present / total) * 100) : 0;
            return (
              <div key={sheet._id} className="sheet-card">
                <div className="sheet-card-top">
                  <div className="sheet-card-info">
                    <h3 className="sheet-card-name">{sheet.eventName}</h3>
                    <div className="sheet-card-date">
                      <span className="date-chip">{sheet.eventDate}</span>
                      <span className="time-chip">
                        Saved{" "}
                        {format(
                          new Date(sheet.createdAt),
                          "MMM d, yyyy • h:mm a",
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="sheet-card-stat">
                    <div
                      className="stat-ring"
                      style={{ "--pct": `${pct}` } as React.CSSProperties}
                    >
                      <span className="stat-num">{pct}%</span>
                    </div>
                    <span className="stat-label">
                      {present}/{total} present
                    </span>
                  </div>
                </div>

                <div className="attendance-bar">
                  <div className="bar-fill" style={{ width: `${pct}%` }} />
                </div>

                <div className="sheet-card-actions">
                  <Link to={`/sheets/${sheet._id}`} className="btn-view">
                    View Details →
                  </Link>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(sheet._id, sheet.eventName)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
