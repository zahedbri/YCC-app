import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../AuthContext";

const MODULES = [
  {
    week: "Week 1",
    title: "Understanding IELTS — test format & scoring",
    lessons: [
      { title: "What is IELTS? Academic vs General explained", dur: "20 min" },
      { title: "How band scores are calculated", dur: "15 min" },
      { title: "UK university entry requirements by score", dur: "20 min" },
      { title: "Your personal target band planner (worksheet)", dur: "download" },
    ],
  },
  {
    week: "Week 2",
    title: "Listening — skills, strategies & practice",
    lessons: [
      { title: "Section types and question formats", dur: "25 min" },
      { title: "Note completion and table-filling techniques", dur: "30 min" },
      { title: "Listening for keywords and paraphrasing", dur: "30 min" },
      { title: "Practice test 1 with answer review", dur: "45 min" },
      { title: "Practice test 2 with answer review", dur: "45 min" },
    ],
  },
  {
    week: "Week 3",
    title: "Reading — speed, comprehension & techniques",
    lessons: [
      { title: "Skimming and scanning strategies", dur: "25 min" },
      { title: "True / False / Not Given — common mistakes", dur: "30 min" },
      { title: "Matching headings and sentence completion", dur: "30 min" },
      { title: "3 x full reading passages with timed practice", dur: "60 min" },
    ],
  },
  {
    week: "Weeks 4–5",
    title: "Writing — Task 1 & Task 2 mastery",
    lessons: [
      { title: "Task 1 Academic: charts, graphs, diagrams", dur: "35 min" },
      { title: "Task 1 General: formal and informal letters", dur: "30 min" },
      { title: "Task 2: essay structure and argument building", dur: "40 min" },
      { title: "Band 7+ vocabulary and cohesion techniques", dur: "30 min" },
      { title: "Submit essay — tutor feedback (premium)", dur: "assignment" },
    ],
  },
  {
    week: "Week 6",
    title: "Speaking — fluency, vocabulary & confidence",
    lessons: [
      { title: "Parts 1, 2 and 3 — structure and expectations", dur: "25 min" },
      { title: "Fluency fillers and natural pausing techniques", dur: "20 min" },
      { title: "Common topics: work, study, environment, culture", dur: "30 min" },
      { title: "Part 2 long turn — how to speak for 2 minutes", dur: "25 min" },
      { title: "Mock speaking session with feedback (premium)", dur: "30 min" },
    ],
  },
  {
    week: "Weeks 7–8",
    title: "Full mock exam & exam day preparation",
    lessons: [
      { title: "Mock test 1 — full timed exam (all 4 skills)", dur: "3 hrs" },
      { title: "Score analysis and weak-area review", dur: "45 min" },
      { title: "Mock test 2 — full timed exam (all 4 skills)", dur: "3 hrs" },
      { title: "Exam day checklist and last-minute tips", dur: "15 min" },
      { title: "YCC certificate of completion", dur: "on pass" },
    ],
  },
];

function EnrolCard({ plan, price, label, featured, blurb, onOpenAuth }) {
  const { user } = useAuth();
  const [status, setStatus] = useState(null); // null | 'saving' | 'enrolled' | 'error'
  const [existing, setExisting] = useState(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("course_enrolments")
      .select("plan, status")
      .eq("user_id", user.id)
      .eq("course_slug", "ielts-prep")
      .maybeSingle()
      .then(({ data }) => setExisting(data));
  }, [user]);

  async function enrol() {
    if (!user) {
      onOpenAuth("student");
      return;
    }
    setStatus("saving");
    const { error } = await supabase
      .from("course_enrolments")
      .upsert(
        { user_id: user.id, course_slug: "ielts-prep", plan, status: "pending" },
        { onConflict: "user_id,course_slug" }
      );
    if (error) setStatus("error");
    else {
      setStatus("enrolled");
      setExisting({ plan, status: "pending" });
    }
  }

  const alreadyThisPlan = existing?.plan === plan;

  return (
    <div className={`price-card-real p-4 ${featured ? "featured" : ""}`}>
      {featured && <span className="badge badge-blue mb-2">Recommended</span>}
      <p className="price-label mb-1">{label}</p>
      <p className="price-amount mb-2">{price}</p>
      <p className="price-note mb-3">{blurb}</p>
      {alreadyThisPlan ? (
        <button className="btn btn-outline-navy w-100" disabled>
          {existing.status === "confirmed" ? "Enrolled ✓" : "Enrolment pending review"}
        </button>
      ) : (
        <button className="btn btn-navy w-100" disabled={status === "saving"} onClick={enrol}>
          {status === "saving" ? "Saving…" : user ? "Enrol now" : "Log in to enrol"}
        </button>
      )}
      {status === "error" && <p className="small text-danger mt-2 mb-0">Something went wrong — please try again.</p>}
      {existing && existing.plan !== plan && (
        <p className="small text-body-secondary mt-2 mb-0">You're enrolled on the other plan.</p>
      )}
    </div>
  );
}

export default function Courses({ onOpenAuth }) {
  return (
    <div className="section">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-8">
            <span className="badge badge-gold mb-3">IELTS Prep</span>
            <h1 className="mb-2" style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", color: "var(--navy)" }}>
              IELTS Academic &amp; General — Complete Preparation Course
            </h1>
            <p className="lead-sub">
              Your career, your guidance. From band 5 to band 7+ with structured coaching across all four IELTS
              skills, test strategy, and full mock exams.
            </p>
          </div>
        </div>

        <div className="row g-2 mb-4">
          {[
            ["🕐", "8 weeks"],
            ["📚", "6 modules · 32 lessons"],
            ["👥", "All levels"],
            ["🎓", "YCC certificate"],
            ["🌐", "Online, self-paced"],
          ].map(([icon, label]) => (
            <div className="col-6 col-md-auto" key={label}>
              <span className="small text-body-secondary">{icon} <strong className="text-body">{label}</strong></span>
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="accordion mb-4" id="courseModules">
              {MODULES.map((mod, i) => (
                <div className="accordion-item" key={mod.title}>
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${i !== 0 ? "collapsed" : ""}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#mod-${i}`}
                    >
                      <span className="mod-num me-3">{i + 1}</span>
                      <span className="flex-grow-1">{mod.title}</span>
                      <span className="badge badge-blue ms-2">{mod.week}</span>
                    </button>
                  </h2>
                  <div id={`mod-${i}`} className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`} data-bs-parent="#courseModules">
                    <div className="accordion-body p-0">
                      {mod.lessons.map((l) => (
                        <div key={l.title} className="lesson-row">
                          <span className="lesson-title">{l.title}</span>
                          <span className="lesson-dur">{l.dur}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-4">
            <p className="small fw-semibold mb-2" style={{ color: "var(--navy)" }}>Suggested pricing</p>
            <div className="d-flex flex-column gap-3 mb-3">
              <EnrolCard
                plan="self-study"
                price="£49"
                label="Self-study (no feedback)"
                blurb="All videos + worksheets + mock tests"
                onOpenAuth={onOpenAuth}
              />
              <EnrolCard
                plan="premium"
                price="£99"
                label="Premium (with tutor feedback)"
                blurb="Everything + essay feedback + mock speaking session"
                featured
                onOpenAuth={onOpenAuth}
              />
            </div>
            <p className="small text-body-secondary">
              Enrolling reserves your place — an advisor will follow up by email with payment and access details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
