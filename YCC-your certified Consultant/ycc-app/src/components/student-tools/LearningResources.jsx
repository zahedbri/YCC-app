import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";

const RESOURCES = [
  {
    id: "bc-learnenglish",
    category: "General English",
    title: "British Council — LearnEnglish",
    url: "https://learnenglish.britishcouncil.org/",
    blurb: "Free grammar, vocabulary, listening, reading, writing and speaking practice at every level. No sign-up needed to use it.",
  },
  {
    id: "bbc-learningenglish",
    category: "General English",
    title: "BBC Learning English",
    url: "https://www.bbc.co.uk/learningenglish",
    blurb: "News-based lessons, 6 Minute English audio, and grammar explainers — great for building everyday vocabulary.",
  },
  {
    id: "bc-ielts-ready",
    category: "IELTS — Free Programme",
    title: "British Council — IELTS Ready",
    url: "https://takeielts.britishcouncil.org/take-ielts/prepare/ielts-ready",
    blurb: "Free official prep programme: guided modules, practice tests with feedback, and webinars, run by an official IELTS test provider.",
  },
  {
    id: "bc-ielts-practice-tests",
    category: "IELTS — Practice Tests",
    title: "British Council — Free IELTS Practice Tests",
    url: "https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-english-practice-tests",
    blurb: "Free timed Listening, Reading, Writing, and Speaking practice tests with answers, from an official IELTS test provider.",
  },
  {
    id: "ielts-org-sample",
    category: "IELTS — Official",
    title: "IELTS.org — Academic Sample Questions",
    url: "https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test",
    blurb: "The official IELTS website's own sample test questions — the best place to understand exact format and question types.",
  },
  {
    id: "idp-practice",
    category: "IELTS — Practice Tests",
    title: "IDP IELTS — Free Practice by Skill",
    url: "https://ielts.idp.com/prepare/all-test-types/all-skills/practice-test",
    blurb: "Free practice broken down by paper (Listening, Reading, Writing, Speaking) and question type — good for targeted weak-area practice.",
  },
  {
    id: "ielts-liz",
    category: "IELTS — Strategy & Tips",
    title: "IELTS Liz",
    url: "https://ieltsliz.com/",
    blurb: "A former IELTS examiner's free lessons and model answers — especially strong for Writing Task 1, Task 2, and Speaking.",
  },
];

const CATEGORY_ORDER = [
  "General English",
  "IELTS — Free Programme",
  "IELTS — Official",
  "IELTS — Practice Tests",
  "IELTS — Strategy & Tips",
];

export default function LearningResources({ onGoCourses }) {
  const { user } = useAuth();
  const [completed, setCompleted] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("learning_progress")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setCompleted(data?.completed_resources || []);
        setLoaded(true);
      });
  }, [user]);

  async function toggle(id) {
    const next = completed.includes(id) ? completed.filter((x) => x !== id) : [...completed, id];
    setCompleted(next);
    setSaving(true);
    await supabase
      .from("learning_progress")
      .upsert({ user_id: user.id, completed_resources: next, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    setSaving(false);
  }

  if (!loaded) return <p className="text-body-secondary small">Loading your progress…</p>;

  const pct = Math.round((completed.length / RESOURCES.length) * 100);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="h5 mb-0">Free IELTS &amp; English resources</h4>
        <span className="small text-body-secondary">{completed.length}/{RESOURCES.length} done {saving && "· saving…"}</span>
      </div>
      <div className="progress mb-4" style={{ height: 6 }}>
        <div className="progress-bar" role="progressbar" style={{ width: `${pct}%`, background: "var(--navy)" }} />
      </div>

      {CATEGORY_ORDER.map((cat) => (
        <div key={cat} className="mb-4">
          <h5 className="h6 kicker mb-2" style={{ color: "var(--sky)" }}>{cat.toUpperCase()}</h5>
          {RESOURCES.filter((r) => r.category === cat).map((r) => (
            <div key={r.id} className="form-panel p-3 mb-2 d-flex gap-3 align-items-start">
              <input
                type="checkbox"
                className="form-check-input mt-1"
                checked={completed.includes(r.id)}
                onChange={() => toggle(r.id)}
                aria-label={`Mark ${r.title} as done`}
              />
              <div className="flex-grow-1">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="fw-semibold small d-block mb-1">
                  {r.title} ↗
                </a>
                <p className="small text-body-secondary mb-0">{r.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      ))}

      <p className="small text-body-secondary mt-3 mb-0">
        These are free resources run by the British Council, IDP, and independent IELTS teachers — not YCC. We link to
        them because they're genuinely useful and cost nothing.
        {onGoCourses && (
          <> Want structured teaching and tutor feedback instead? <button className="btn btn-link p-0 align-baseline" onClick={onGoCourses}>See our 8-week IELTS Prep Course →</button></>
        )}
      </p>
    </div>
  );
}