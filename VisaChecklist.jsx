import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";

const CHECKLIST = [
  {
    phase: "Before you apply",
    items: [
      { id: "valid-passport", label: "Valid passport with at least 6 months' validity beyond your intended travel date" },
      { id: "academic-docs", label: "Certified copies of academic transcripts and certificates" },
      { id: "english-test", label: "English proficiency test booked or completed (IELTS, TOEFL, PTE, etc.)" },
      { id: "sop-draft", label: "Statement of purpose / personal statement drafted" },
    ],
  },
  {
    phase: "Application & offer",
    items: [
      { id: "offer-letter", label: "Offer letter / CAS / I-20 / confirmation of enrolment received from the institution" },
      { id: "financial-evidence", label: "Proof of funds gathered (bank statements, sponsor letters, loan approval, etc.)" },
      { id: "visa-form", label: "Visa application form completed" },
      { id: "visa-fee", label: "Visa fee paid and receipt saved" },
      { id: "photos", label: "Passport-style photographs taken to the destination's exact specification" },
    ],
  },
  {
    phase: "Before you travel",
    items: [
      { id: "medical-exam", label: "Medical exam / TB test completed, if required for your destination" },
      { id: "health-insurance", label: "Health insurance or OSHC arranged (compulsory in some countries, e.g. Australia)" },
      { id: "accommodation", label: "Accommodation booked or confirmed" },
      { id: "flights", label: "Flights booked with dates matching your visa validity" },
      { id: "police-clearance", label: "Police clearance certificate obtained, if required" },
    ],
  },
  {
    phase: "On arrival",
    items: [
      { id: "biometrics", label: "Biometric residence permit / arrival card collected, if applicable" },
      { id: "register-institution", label: "Registered / checked in with your institution's international office" },
      { id: "bank-account", label: "Local bank account opened, if needed" },
      { id: "visa-conditions", label: "Read and understood your visa's work-hour limits and reporting conditions" },
    ],
  },
];

const ALL_IDS = CHECKLIST.flatMap((phase) => phase.items.map((i) => i.id));

export default function VisaChecklist() {
  const { user } = useAuth();
  const [checked, setChecked] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("visa_checklist_progress")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setChecked(data?.checked_items || []);
        setLoaded(true);
      });
  }, [user]);

  async function toggle(id) {
    const next = checked.includes(id) ? checked.filter((x) => x !== id) : [...checked, id];
    setChecked(next);
    setSaving(true);
    await supabase
      .from("visa_checklist_progress")
      .upsert({ user_id: user.id, checked_items: next, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    setSaving(false);
  }

  if (!loaded) return <p className="text-body-secondary small">Loading your checklist…</p>;

  const pct = Math.round((checked.length / ALL_IDS.length) * 100);

  return (
    <div>
      <div className="alert alert-warning small mb-4">
        <strong>This is a general checklist, not immigration advice.</strong> Exact document requirements differ by
        destination country, visa type, and can change without notice. Always confirm the current, official
        requirements with your advisor and the destination country's official immigration website before you apply.
      </div>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="h5 mb-0">Student visa compliance checklist</h4>
        <span className="small text-body-secondary">{checked.length}/{ALL_IDS.length} done {saving && "· saving…"}</span>
      </div>
      <div className="progress mb-4" style={{ height: 6 }}>
        <div className="progress-bar" role="progressbar" style={{ width: `${pct}%`, background: "var(--navy)" }} />
      </div>

      {CHECKLIST.map((phase) => (
        <div key={phase.phase} className="mb-4">
          <h5 className="h6 kicker mb-2" style={{ color: "var(--sky)" }}>{phase.phase.toUpperCase()}</h5>
          <div className="form-panel p-3">
            {phase.items.map((item) => (
              <div key={item.id} className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={item.id}
                  checked={checked.includes(item.id)}
                  onChange={() => toggle(item.id)}
                />
                <label className="form-check-label small" htmlFor={item.id}>{item.label}</label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
