import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../AuthContext";

function StatusBadge({ status }) {
  const map = {
    pending: "bg-warning text-dark",
    approved: "bg-success",
    rejected: "bg-danger",
    contacted: "bg-info text-dark",
    partnered: "bg-success",
    declined: "bg-danger",
  };
  return <span className={`badge ${map[status] || "bg-secondary"} text-capitalize`}>{status}</span>;
}

export function StudentRegistrationForm({ onOpenAuth }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    preferred_destination: "United Kingdom",
    level_of_study: "Undergraduate",
    target_intake: "",
    notes: "",
  });
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("student_registrations")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setForm({
            preferred_destination: data.preferred_destination || "United Kingdom",
            level_of_study: data.level_of_study || "Undergraduate",
            target_intake: data.target_intake || "",
            notes: data.notes || "",
          });
          setStatus(data.status);
        }
      });
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await supabase
      .from("student_registrations")
      .upsert({ user_id: user.id, ...form, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    setSaving(false);
    setSaved(true);
    setStatus((s) => s || "pending");
  }

  if (!user) {
    return (
      <div className="form-panel p-4 p-md-5 text-center">
        <p className="mb-3">Create a free account to start your student registration.</p>
        <button className="btn btn-navy px-4" onClick={() => onOpenAuth("student")}>
          Create student account
        </button>
      </div>
    );
  }

  return (
    <div className="form-panel p-4 p-md-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="h5 mb-0">Your student registration</h4>
        {status && <StatusBadge status={status} />}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Preferred destination</label>
            <select
              className="form-select"
              value={form.preferred_destination}
              onChange={(e) => setForm({ ...form, preferred_destination: e.target.value })}
            >
              {["United Kingdom", "Europe", "Malaysia", "Middle East", "Australia", "USA", "Online", "Not sure yet"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Level of study</label>
            <select
              className="form-select"
              value={form.level_of_study}
              onChange={(e) => setForm({ ...form, level_of_study: e.target.value })}
            >
              {["Foundation", "Undergraduate", "Postgraduate", "PhD"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Target intake</label>
            <input
              className="form-control"
              placeholder="e.g. Sept 2026"
              value={form.target_intake}
              onChange={(e) => setForm({ ...form, target_intake: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Anything else we should know?</label>
            <textarea
              className="form-control"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>
        <button className="btn btn-navy mt-4 px-4" disabled={saving} type="submit">
          {saving ? "Saving…" : "Save registration"}
        </button>
        {saved && <span className="ms-3 small text-success">Saved.</span>}
      </form>
    </div>
  );
}

export function AgentRegistrationForm({ onOpenAuth }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    agency_name: "",
    country: "",
    years_experience: "",
    students_per_year: "",
    notes: "",
  });
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("agent_registrations")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setForm({
            agency_name: data.agency_name || "",
            country: data.country || "",
            years_experience: data.years_experience || "",
            students_per_year: data.students_per_year || "",
            notes: data.notes || "",
          });
          setStatus(data.status);
        }
      });
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await supabase
      .from("agent_registrations")
      .upsert({ user_id: user.id, ...form, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    setSaving(false);
    setSaved(true);
    setStatus((s) => s || "pending");
  }

  if (!user) {
    return (
      <div className="form-panel p-4 p-md-5 text-center">
        <p className="mb-3">Create a free agent account to submit your partnership details.</p>
        <button className="btn btn-navy px-4" onClick={() => onOpenAuth("agent")}>
          Create agent account
        </button>
      </div>
    );
  }

  return (
    <div className="form-panel p-4 p-md-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="h5 mb-0">Your agent / partner registration</h4>
        {status && <StatusBadge status={status} />}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Agency name</label>
            <input className="form-control" value={form.agency_name} onChange={(e) => setForm({ ...form, agency_name: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Country of operation</label>
            <input className="form-control" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Years representing students</label>
            <input className="form-control" value={form.years_experience} onChange={(e) => setForm({ ...form, years_experience: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Average students placed / year</label>
            <input className="form-control" value={form.students_per_year} onChange={(e) => setForm({ ...form, students_per_year: e.target.value })} />
          </div>
          <div className="col-12">
            <label className="form-label">Tell us about your student base</label>
            <textarea className="form-control" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
        <button className="btn btn-navy mt-4 px-4" disabled={saving} type="submit">
          {saving ? "Saving…" : "Save registration"}
        </button>
        {saved && <span className="ms-3 small text-success">Saved.</span>}
      </form>
    </div>
  );
}

export function InstitutionEnquiryForm() {
  const [form, setForm] = useState({
    institution_name: "",
    contact_person: "",
    email: "",
    phone: "",
    country: "",
    enquiry_type: "Advertise programmes with YCC",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("institution_enquiries").insert(form);
    setSaving(false);
    if (!error) {
      setSaved(true);
      setForm({
        institution_name: "",
        contact_person: "",
        email: "",
        phone: "",
        country: "",
        enquiry_type: "Advertise programmes with YCC",
        notes: "",
      });
    }
  }

  return (
    <div className="form-panel p-4 p-md-5">
      <h4 className="h5 mb-3">Advertise or represent your institution</h4>
      {saved ? (
        <div className="alert alert-success">Thanks — your enquiry has been sent to our admissions team for review.</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">Institution name</label><input required className="form-control" value={form.institution_name} onChange={(e) => setForm({ ...form, institution_name: e.target.value })} /></div>
            <div className="col-md-6"><label className="form-label">Contact person</label><input required className="form-control" value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} /></div>
            <div className="col-md-6"><label className="form-label">Email</label><input required type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="col-md-6"><label className="form-label">Phone</label><input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="col-md-6"><label className="form-label">Country</label><input className="form-control" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
            <div className="col-md-6">
              <label className="form-label">What do you need?</label>
              <select className="form-select" value={form.enquiry_type} onChange={(e) => setForm({ ...form, enquiry_type: e.target.value })}>
                <option>Advertise programmes with YCC</option>
                <option>Be represented by YCC agents</option>
                <option>Both</option>
              </select>
            </div>
            <div className="col-12"><label className="form-label">Tell us about the institution</label><textarea className="form-control" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <button className="btn btn-navy mt-4 px-4" disabled={saving} type="submit">
            {saving ? "Sending…" : "Submit enquiry"}
          </button>
        </form>
      )}
    </div>
  );
}

export { StatusBadge };
