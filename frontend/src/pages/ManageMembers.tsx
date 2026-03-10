import { useState, useEffect } from "react";
import { fetchMembers, createMember, updateMember, deleteMember } from "../api";
import { Member } from "../types";
import "./ManageMembers.css";

type FormMode = "add" | "edit";

export default function ManageMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formMemberId, setFormMemberId] = useState("");
  const [formName, setFormName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () =>
    fetchMembers()
      .then(setMembers)
      .catch(() => setError("Failed to load members."))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const nextMemberId = () => {
    const nums = members
      .map((m) => parseInt(m.memberId.replace(/\D/g, ""), 10))
      .filter((n) => !isNaN(n));
    const max = nums.length ? Math.max(...nums) : 0;
    return `M${String(max + 1).padStart(3, "0")}`;
  };

  const openAdd = () => {
    setFormMode("add");
    setFormMemberId(nextMemberId());
    setFormName("");
    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEdit = (member: Member) => {
    setFormMode("edit");
    setFormMemberId(member.memberId);
    setFormName(member.name);
    setEditingId(member._id);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async () => {
    if (!formMemberId.trim() || !formName.trim()) {
      setError("Both Member ID and Name are required.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      if (formMode === "add") {
        await createMember({ memberId: formMemberId.trim(), name: formName.trim() });
        setSuccess(`Member "${formName.trim()}" added successfully.`);
      } else if (editingId) {
        await updateMember(editingId, { memberId: formMemberId.trim(), name: formName.trim() });
        setSuccess(`Member updated successfully.`);
      }
      setShowForm(false);
      setEditingId(null);
      await load();
    } catch (err: any) {
      const msg = err?.response?.data?.error;
      setError(msg === "Member ID already exists" ? "That Member ID is already taken." : "Failed to save member.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member: Member) => {
    if (!confirm(`Delete "${member.name}" (${member.memberId})? This cannot be undone.`)) return;
    setDeletingId(member._id);
    setError("");
    setSuccess("");
    try {
      await deleteMember(member._id);
      setSuccess(`Member "${member.name}" deleted.`);
      await load();
    } catch {
      setError("Failed to delete member.");
    } finally {
      setDeletingId(null);
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
    <div className="manage-members">
      <div className="mm-header">
        <div>
          <h1 className="mm-title">Manage Members</h1>
          <p className="mm-subtitle">Add, edit, or remove members from the roster.</p>
        </div>
        {!showForm && (
          <button className="btn-add" onClick={openAdd}>
            + Add Member
          </button>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && !showForm && <div className="success-banner">{success}</div>}

      {showForm && (
        <div className="member-form-card">
          <h2 className="form-title">{formMode === "add" ? "New Member" : "Edit Member"}</h2>
          <div className="form-row">
            <div className="form-field">
              <label className="field-label">Member ID</label>
              <input
                className="field-input"
                type="text"
                placeholder="e.g. M011"
                value={formMemberId}
                onChange={(e) => setFormMemberId(e.target.value)}
              />
            </div>
            <div className="form-field form-field--grow">
              <label className="field-label">Full Name</label>
              <input
                className="field-input"
                type="text"
                placeholder="e.g. Jane Smith"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
          </div>
          {error && <div className="error-banner form-error">{error}</div>}
          <div className="form-actions">
            <button className="btn-cancel" onClick={cancelForm}>
              Cancel
            </button>
            <button className="btn-save" onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving…" : formMode === "add" ? "Add Member" : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {members.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No members yet</h3>
          <p>Add your first member to get started.</p>
          <button className="btn-add" onClick={openAdd}>
            + Add Member
          </button>
        </div>
      ) : (
        <div className="members-table-wrap">
          <table className="members-table">
            <thead>
              <tr>
                <th className="col-id">ID</th>
                <th>Name</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id} className={editingId === member._id ? "row-editing" : ""}>
                  <td className="col-id">
                    <span className="member-id">{member.memberId}</span>
                  </td>
                  <td className="col-name">{member.name}</td>
                  <td className="col-actions">
                    <button
                      className="btn-edit"
                      onClick={() => openEdit(member)}
                      disabled={deletingId === member._id}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(member)}
                      disabled={deletingId === member._id}
                    >
                      {deletingId === member._id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-footer">
            {members.length} member{members.length !== 1 ? "s" : ""} total
          </div>
        </div>
      )}
    </div>
  );
}
