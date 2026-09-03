import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";

const emptyEdu = () => ({ id: crypto.randomUUID(), institution: "", qualification: "", start: "", end: "" });
const emptyExp = () => ({ id: crypto.randomUUID(), employer: "", role: "", start: "", end: "", description: "" });

export default function ResumeBuilder() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    education: [emptyEdu()],
    experience: [emptyExp()],
    skills: "",
  });
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("resumes")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setForm({
            full_name: data.full_name || profile?.full_name || "",
            email: data.email || profile?.email || "",
            phone: data.phone || "",
            location: data.location || "",
            summary: data.summary || "",
            education: data.education?.length ? data.education : [emptyEdu()],
            experience: data.experience?.length ? data.experience : [emptyExp()],
            skills: data.skills || "",
          });
        } else {
          setForm((f) => ({ ...f, full_name: profile?.full_name || "", email: profile?.email || "" }));
        }
        setLoaded(true);
      });
  }, [user, profile]);

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function updateListItem(key, id, field, value) {
    setForm((f) => ({
      ...f,
      [key]: f[key].map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  }
  function addItem(key, factory) {
    setForm((f) => ({ ...f, [key]: [...f[key], factory()] }));
  }
  function removeItem(key, id) {
    setForm((f) => ({ ...f, [key]: f[key].filter((item) => item.id !== id) }));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await supabase.from("resumes").upsert(
      { user_id: user.id, ...form, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
    setSaving(false);
    setSaved(true);
  }

  function handlePrint() {
    window.print();
  }

  if (!loaded) {
    return <p className="text-body-secondary small">Loading your resume…</p>;
  }

  return (
    <div className="row g-4">
      {/* FORM */}
      <div className="col-lg-6 no-print">
        <div className="form-panel p-4">
          <h4 className="h5 mb-3">Build your resume</h4>

          <div className="row g-3 mb-3">
            <div className="col-md-6"><label className="form-label">Full name</label><input className="form-control" value={form.full_name} onChange={(e) => updateField("full_name", e.target.value)} /></div>
            <div className="col-md-6"><label className="form-label">Email</label><input className="form-control" value={form.email} onChange={(e) => updateField("email", e.target.value)} /></div>
            <div className="col-md-6"><label className="form-label">Phone</label><input className="form-control" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} /></div>
            <div className="col-md-6"><label className="form-label">Location</label><input className="form-control" value={form.location} onChange={(e) => updateField("location", e.target.value)} placeholder="City, Country" /></div>
            <div className="col-12">
              <label className="form-label">Personal summary</label>
              <textarea className="form-control" rows={3} value={form.summary} onChange={(e) => updateField("summary", e.target.value)} placeholder="2-3 sentences about who you are and what you're aiming for" />
            </div>
          </div>

          <hr />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="h6 mb-0">Education</h5>
            <button className="btn btn-sm btn-outline-navy" type="button" onClick={() => addItem("education", emptyEdu)}>+ Add</button>
          </div>
          {form.education.map((edu) => (
            <div key={edu.id} className="border rounded p-3 mb-2" style={{ borderColor: "var(--line)" }}>
              <div className="row g-2">
                <div className="col-md-6"><input className="form-control form-control-sm" placeholder="Institution" value={edu.institution} onChange={(e) => updateListItem("education", edu.id, "institution", e.target.value)} /></div>
                <div className="col-md-6"><input className="form-control form-control-sm" placeholder="Qualification" value={edu.qualification} onChange={(e) => updateListItem("education", edu.id, "qualification", e.target.value)} /></div>
                <div className="col-md-5"><input className="form-control form-control-sm" placeholder="Start (e.g. 2021)" value={edu.start} onChange={(e) => updateListItem("education", edu.id, "start", e.target.value)} /></div>
                <div className="col-md-5"><input className="form-control form-control-sm" placeholder="End (e.g. 2023 or Present)" value={edu.end} onChange={(e) => updateListItem("education", edu.id, "end", e.target.value)} /></div>
                <div className="col-md-2 d-flex align-items-center">
                  {form.education.length > 1 && <button className="btn btn-sm btn-outline-danger w-100" type="button" onClick={() => removeItem("education", edu.id)}>Remove</button>}
                </div>
              </div>
            </div>
          ))}

          <hr />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="h6 mb-0">Experience</h5>
            <button className="btn btn-sm btn-outline-navy" type="button" onClick={() => addItem("experience", emptyExp)}>+ Add</button>
          </div>
          {form.experience.map((exp) => (
            <div key={exp.id} className="border rounded p-3 mb-2" style={{ borderColor: "var(--line)" }}>
              <div className="row g-2">
                <div className="col-md-6"><input className="form-control form-control-sm" placeholder="Employer" value={exp.employer} onChange={(e) => updateListItem("experience", exp.id, "employer", e.target.value)} /></div>
                <div className="col-md-6"><input className="form-control form-control-sm" placeholder="Role" value={exp.role} onChange={(e) => updateListItem("experience", exp.id, "role", e.target.value)} /></div>
                <div className="col-md-5"><input className="form-control form-control-sm" placeholder="Start" value={exp.start} onChange={(e) => updateListItem("experience", exp.id, "start", e.target.value)} /></div>
                <div className="col-md-5"><input className="form-control form-control-sm" placeholder="End or Present" value={exp.end} onChange={(e) => updateListItem("experience", exp.id, "end", e.target.value)} /></div>
                <div className="col-md-2 d-flex align-items-center">
                  {form.experience.length > 1 && <button className="btn btn-sm btn-outline-danger w-100" type="button" onClick={() => removeItem("experience", exp.id)}>Remove</button>}
                </div>
                <div className="col-12"><textarea className="form-control form-control-sm" rows={2} placeholder="What did you do there?" value={exp.description} onChange={(e) => updateListItem("experience", exp.id, "description", e.target.value)} /></div>
              </div>
            </div>
          ))}

          <hr />
          <label className="form-label">Skills</label>
          <textarea className="form-control mb-3" rows={2} value={form.skills} onChange={(e) => updateField("skills", e.target.value)} placeholder="Comma-separated, e.g. MS Excel, Public Speaking, Python" />

          <div className="d-flex gap-2">
            <button className="btn btn-navy" disabled={saving} onClick={handleSave}>{saving ? "Saving…" : "Save resume"}</button>
            <button className="btn btn-outline-navy" onClick={handlePrint}>Print / Save as PDF</button>
          </div>
          {saved && <span className="ms-2 small text-success">Saved.</span>}
        </div>
      </div>

      {/* PREVIEW */}
      <div className="col-lg-6">
        <div id="resume-preview" className="form-panel p-4 p-md-5">
          <h2 className="h4 mb-0">{form.full_name || "Your name"}</h2>
          <p className="small text-body-secondary mb-3">
            {[form.location, form.email, form.phone].filter(Boolean).join(" · ")}
          </p>
          {form.summary && <p className="mb-3">{form.summary}</p>}

          {form.education.some((e) => e.institution || e.qualification) && (
            <>
              <h3 className="h6 fw-bold border-bottom pb-1 mb-2">Education</h3>
              {form.education.filter((e) => e.institution || e.qualification).map((e) => (
                <div key={e.id} className="mb-2">
                  <div className="d-flex justify-content-between">
                    <strong className="small">{e.institution}</strong>
                    <span className="small text-body-secondary">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                  </div>
                  <div className="small">{e.qualification}</div>
                </div>
              ))}
            </>
          )}

          {form.experience.some((e) => e.employer || e.role) && (
            <>
              <h3 className="h6 fw-bold border-bottom pb-1 mb-2 mt-3">Experience</h3>
              {form.experience.filter((e) => e.employer || e.role).map((e) => (
                <div key={e.id} className="mb-2">
                  <div className="d-flex justify-content-between">
                    <strong className="small">{e.role} {e.employer && `— ${e.employer}`}</strong>
                    <span className="small text-body-secondary">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                  </div>
                  {e.description && <div className="small">{e.description}</div>}
                </div>
              ))}
            </>
          )}

          {form.skills && (
            <>
              <h3 className="h6 fw-bold border-bottom pb-1 mb-2 mt-3">Skills</h3>
              <p className="small mb-0">{form.skills}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
