import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { fetchEventSheet } from "../api";
import { EventSheet } from "../types";
import "./SheetDetail.css";

export default function SheetDetail() {
  const { id } = useParams<{ id: string }>();
  const [sheet, setSheet] = useState<EventSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchEventSheet(id)
      .then(setSheet)
      .catch(() => setError("Failed to load sheet."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Loading sheet…</p>
      </div>
    );
  }

  if (error || !sheet) {
    return (
      <div className="error-state">
        <p>{error || "Sheet not found."}</p>
        <Link to="/sheets">← Back to Sheets</Link>
      </div>
    );
  }

  const present = sheet.attendance.filter((a) => a.present).length;
  const absent = sheet.attendance.length - present;
  const pct = sheet.attendance.length
    ? Math.round((present / sheet.attendance.length) * 100)
    : 0;

  return (
    <div className="sheet-detail">
      <div className="detail-nav">
        <Link to="/sheets" className="back-link">
          ← Back to Past Sheets
        </Link>
      </div>

      <div className="detail-header">
        <div>
          <h1 className="detail-title">{sheet.eventName}</h1>
          <div className="detail-meta">
            <span className="date-chip">{sheet.eventDate}</span>
            <span className="time-chip">
              Saved on {format(new Date(sheet.createdAt), "MMMM d, yyyy")} at{" "}
              {format(new Date(sheet.createdAt), "h:mm a")}
            </span>
          </div>
        </div>
      </div>

      <div className="detail-stats">
        <div className="stat-card stat-present">
          <span className="stat-val">{present}</span>
          <span className="stat-lbl">Present</span>
        </div>
        <div className="stat-card stat-absent">
          <span className="stat-val">{absent}</span>
          <span className="stat-lbl">Absent</span>
        </div>
        <div className="stat-card stat-rate">
          <span className="stat-val">{pct}%</span>
          <span className="stat-lbl">Attendance Rate</span>
        </div>
      </div>

      <div className="detail-table-wrap">
        <table className="detail-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Member Name</th>
              <th>Status</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {sheet.attendance.map((entry) => (
              <tr
                key={entry.memberId}
                className={entry.present ? "row-present" : "row-absent"}
              >
                <td>
                  <span className="member-id">{entry.memberId}</span>
                </td>
                <td>{entry.memberName}</td>
                <td>
                  <span
                    className={`status-badge ${entry.present ? "badge-present" : "badge-absent"}`}
                  >
                    {entry.present ? "✓ Present" : "✗ Absent"}
                  </span>
                </td>
                <td className="remark-cell">
                  {entry.remark || <span className="no-remark">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
