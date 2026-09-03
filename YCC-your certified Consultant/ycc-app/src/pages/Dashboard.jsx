import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../AuthContext";
import { StudentRegistrationForm, AgentRegistrationForm } from "../components/RegistrationForms";

function AdminTable({ title, table, columns, statusOptions }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    const { data, error } = await supabase
      .from(table)
      .select(table === "institution_enquiries" ? "*" : "*, profiles(full_name, email)")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setRows(data);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    await supabase.from(table).update({ status }).eq("id", id);
    load();
  }

  return (
    <div className="mb-5">
      <h4 className="h5 mb-3">{title} {rows && <span className="text-body-secondary small">({rows.length})</span>}</h4>
      {error && <div className="alert alert-danger small">{error}</div>}
      {!rows ? (
        <p className="text-body-secondary small">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-body-secondary small">No entries yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead>
              <tr>
                {columns.map((c) => <th key={c.key}>{c.label}</th>)}
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  {columns.map((c) => (
                    <td key={c.key} className="small">{c.render ? c.render(r) : r[c.key] || "—"}</td>
                  ))}
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                    >
                      {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminDashboard() {
  return (
    <div>
      <h2 className="h4 mb-4">Admin dashboard</h2>
      <AdminTable
        title="Student registrations"
        table="student_registrations"
        statusOptions={["pending", "approved", "rejected"]}
        columns={[
          { key: "name", label: "Student", render: (r) => r.profiles?.full_name || "—" },
          { key: "email", label: "Email", render: (r) => r.profiles?.email || "—" },
          { key: "preferred_destination", label: "Destination" },
          { key: "level_of_study", label: "Level" },
          { key: "target_intake", label: "Intake" },
        ]}
      />
      <AdminTable
        title="Agent registrations"
        table="agent_registrations"
        statusOptions={["pending", "approved", "rejected"]}
        columns={[
          { key: "name", label: "Agent", render: (r) => r.profiles?.full_name || "—" },
          { key: "email", label: "Email", render: (r) => r.profiles?.email || "—" },
          { key: "agency_name", label: "Agency" },
          { key: "country", label: "Country" },
        ]}
      />
      <AdminTable
        title="Institution enquiries"
        table="institution_enquiries"
        statusOptions={["pending", "contacted", "partnered", "declined"]}
        columns={[
          { key: "institution_name", label: "Institution" },
          { key: "contact_person", label: "Contact" },
          { key: "email", label: "Email" },
          { key: "enquiry_type", label: "Wants" },
        ]}
      />
    </div>
  );
}

export default function Dashboard({ onOpenAuth }) {
  const { profile, loading } = useAuth();

  if (loading || !profile) {
    return (
      <div className="container section text-center">
        <p className="text-body-secondary">Loading your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="container section">
      {profile.role === "student" && (
        <>
          <h2 className="h4 mb-4">Welcome back, {profile.full_name || "there"}</h2>
          <StudentRegistrationForm onOpenAuth={onOpenAuth} />
        </>
      )}
      {profile.role === "agent" && (
        <>
          <h2 className="h4 mb-4">Welcome back, {profile.full_name || "there"}</h2>
          <AgentRegistrationForm onOpenAuth={onOpenAuth} />
        </>
      )}
      {profile.role === "admin" && <AdminDashboard />}
    </div>
  );
}
