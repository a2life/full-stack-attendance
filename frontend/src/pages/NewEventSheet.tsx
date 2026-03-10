import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fetchMembers, createEventSheet } from "../api";
import { Member, AttendanceEntry } from "../types";
import "./NewEventSheet.css";

export default function NewEventSheet() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [eventName, setEventName] = useState("");
  const today = format(new Date(), "yyyy-MM-dd");
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);

  useEffect(() => {
    fetchMembers()
      .then((data) => {
        setMembers(data);
        setAttendance(
          data.map((m) => ({
            memberId: m.memberId,
            memberName: m.name,
            present: false,
            remark: "",
          })),
        );
      })
      .catch(() => setError("Failed to load members. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  const togglePresent = (idx: number) => {
    setAttendance((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, present: !a.present } : a)),
    );
  };

  const setRemark = (idx: number, remark: string) => {
    setAttendance((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, remark } : a)),
    );
  };

  const markAll = (present: boolean) => {
    setAttendance((prev) => prev.map((a) => ({ ...a, present })));
  };

  const presentCount = attendance.filter((a) => a.present).length;

  const handleSave = async () => {
    if (!eventName.trim()) {
      setError("Please enter an event name.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await createEventSheet({
        eventName: eventName.trim(),
        eventDate: today,
        attendance,
      });
      navigate("/sheets");
    } catch {
      setError("Failed to save event sheet. Please try again.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Loading members…</p>
      </div>
    );
  }

  return (
    <div className="new-sheet">
      <div className="sheet-header">
        <div>
          <h1 className="sheet-title">New Event Sheet</h1>
          <p className="sheet-subtitle">
            Fill in the event details and mark attendance below.
          </p>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="sheet-meta-card">
        <div className="meta-row">
          <label className="meta-label">Event Name</label>
          <input
            className="meta-input"
            type="text"
            placeholder="e.g. Monthly General Meeting"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>
        <div className="meta-row">
          <label className="meta-label">Date</label>
          <div className="meta-date">
            <span className="date-badge">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </span>
            <span className="date-auto">(auto-filled)</span>
          </div>
        </div>
      </div>

      <div className="attendance-section">
        <div className="attendance-header">
          <div className="attendance-title">
            <h2>Members</h2>
            <span className="count-badge">
              {presentCount} / {attendance.length} present
            </span>
          </div>
          <div className="bulk-actions">
            <button className="bulk-btn" onClick={() => markAll(true)}>
              Mark All Present
            </button>
            <button className="bulk-btn" onClick={() => markAll(false)}>
              Mark All Absent
            </button>
          </div>
        </div>

        <div className="attendance-table-wrap">
          <table className="attendance-table">
            <thead>
              <tr>
                <th className="col-id">ID</th>
                <th className="col-name">Member Name</th>
                <th className="col-present">Present</th>
                <th className="col-remark">Remark</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((entry, idx) => (
                <tr
                  key={entry.memberId}
                  className={entry.present ? "row-present" : ""}
                >
                  <td className="col-id">
                    <span className="member-id">{entry.memberId}</span>
                  </td>
                  <td className="col-name">{entry.memberName}</td>
                  <td className="col-present">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={entry.present}
                        onChange={() => togglePresent(idx)}
                        className="checkbox"
                      />
                      <span className="checkbox-custom" />
                    </label>
                  </td>
                  <td className="col-remark">
                    <input
                      type="text"
                      className="remark-input"
                      placeholder="Add remark…"
                      value={entry.remark}
                      onChange={(e) => setRemark(idx, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sheet-footer">
        <button className="btn-cancel" onClick={() => navigate("/")}>
          Cancel
        </button>
        <button className="btn-save" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "💾 Save Event Sheet"}
        </button>
      </div>
    </div>
  );
}
