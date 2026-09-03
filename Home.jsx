import React, { useState } from "react";
import { StudentRegistrationForm, AgentRegistrationForm, InstitutionEnquiryForm } from "../components/RegistrationForms";

const DESTINATIONS = [
  { code: "UK", name: "United Kingdom", points: ["Russell Group & modern universities", "Graduate Route (PSW) guidance", "CAS & Student Route visa support"] },
  { code: "EU", name: "Europe", points: ["Germany, Ireland, Netherlands & more", "Low/no tuition public universities", "Blue Card & post-study pathways"] },
  { code: "MY", name: "Malaysia", points: ["Affordable branch-campus degrees", "Fast offer turnaround", "Halal-friendly, multicultural campuses"] },
  { code: "ME", name: "Middle East", points: ["UAE & Qatar international branch campuses", "Scholarship-heavy programmes", "Tax-free work exposure post-study"] },
  { code: "AU", name: "Australia", points: ["Group of Eight & TAFE pathways", "Post-study work visa (subclass 485)", "Regional-campus tuition savings"] },
  { code: "US", name: "United States", points: ["I-20 & F-1 visa preparation", "Scholarship & assistantship search", "OPT/CPT work-authorisation guidance"] },
  { code: "🌐", name: "Online / Distance", points: ["Accredited online degrees", "Study from home, work while you learn", "No relocation or visa required"] },
];

// Free-to-use photography (Unsplash License — free for commercial use, no attribution required)
const IMG = {
  bigBen: "https://images.unsplash.com/photo-1579500542868-08d375bb495f?auto=format&fit=crop&w=2000&q=80",
  oxford: "https://images.unsplash.com/photo-1612563958093-2c3bcfbd8760?auto=format&fit=crop&w=1200&q=80",
  cambridge: "https://images.unsplash.com/photo-1571443980293-c9f2c0323ddf?auto=format&fit=crop&w=1200&q=80",
  student: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1200&q=80",
};

const STEPS = [
  { title: "Free consultation", body: "We review your grades, budget, and goals, then shortlist realistic institutions across your preferred regions." },
  { title: "Application & offers", body: "We prepare your application, SOP, and references, and submit to every shortlisted institution on your behalf." },
  { title: "Funding & scholarships", body: "We match you against scholarships, education loans, and institution bursaries you actually qualify for." },
  { title: "Visa & compliance", body: "Document checks, financial evidence, and interview preparation, run against the specific rules of your destination country." },
  { title: "Pre-departure & settling in", body: "Accommodation, airport pickup guidance, and a check-in once you've landed — our work doesn't stop at the visa stamp." },
];

export default function Home({ onOpenAuth, onGoCourses }) {
  const [tab, setTab] = useState("student");

  return (
    <>
      {/* HERO */}
      <header
        className="hero"
        id="top"
        style={{
          backgroundImage: `linear-gradient(rgba(8,38,70,.82), rgba(12,59,110,.88)), url(${IMG.bigBen})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container py-5 position-relative">
          <div className="row align-items-center py-4">
            <div className="col-lg-8">
              <p className="eyebrow-mono mb-3">British Council &amp; ICEF certified · 22+ years in student recruitment</p>
              <h1 className="mb-3">Your certified guide to studying abroad, from first question to first day of class.</h1>
              <p className="lede mb-4">
                YCC helps students plan, apply, and settle into universities and colleges across the UK, Europe,
                Malaysia, the Middle East, Australia, the USA, and fully online — with one advisor accountable for
                the whole journey.
              </p>
              <div className="d-flex flex-wrap gap-2 mb-4">
                <a href="#audiences" className="btn btn-gold btn-lg px-4" onClick={() => setTab("student")}>
                  Register as a Student
                </a>
                <a href="#audiences" className="btn btn-outline-light btn-lg px-4" onClick={() => setTab("agent")}>
                  Partner as an Agent
                </a>
              </div>
            </div>
          </div>
          <div className="row hero-stats pt-4 g-3">
            <div className="col-6 col-md-3 stat"><b>22+ yrs</b><span>in recruitment &amp; partnerships</span></div>
            <div className="col-6 col-md-3 stat"><b>7</b><span>study regions covered</span></div>
            <div className="col-6 col-md-3 stat"><b>B.C. / ICEF</b><span>certified team</span></div>
            <div className="col-6 col-md-3 stat"><b>1:1</b><span>dedicated advisor per student</span></div>
          </div>
        </div>
      </header>

      {/* DESTINATIONS */}
      <section className="section" id="destinations">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-7">
              <p className="kicker mb-2">WHERE YOU CAN STUDY</p>
              <h2 className="mb-3">Seven regions, one point of contact for the whole application.</h2>
              <p className="lead-sub">
                Every destination below is handled by advisors who know the visa rules, intake calendars, and
                institution requirements for that region specifically — not a generic checklist.
              </p>
            </div>
          </div>
          <div className="row g-3">
            {DESTINATIONS.map((d) => (
              <div className="col-sm-6 col-lg-4" key={d.code}>
                <div className="dest-card">
                  <div className="dest-body">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="dest-flag">{d.code}</div>
                      <h3>{d.name}</h3>
                    </div>
                    <ul>{d.points.map((p) => <li key={p}>{p}</li>)}</ul>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-sm-6 col-lg-4">
              <div className="dest-card h-100" style={{ background: "var(--navy)" }}>
                <div className="dest-body d-flex flex-column justify-content-center h-100 text-center">
                  <p className="text-white mb-3">Not sure which country fits your budget, grades, and goals?</p>
                  <a href="#audiences" className="btn btn-gold" onClick={() => setTab("student")}>Get matched to a country</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAMPUS STRIP — real photography for a professional, grounded feel */}
      <section className="campus-strip">
        <div className="campus-strip-grid">
          <div className="campus-tile campus-tile-wide" style={{ backgroundImage: `url(${IMG.oxford})` }}>
            <span>Oxford, England</span>
          </div>
          <div className="campus-tile" style={{ backgroundImage: `url(${IMG.cambridge})` }}>
            <span>Cambridge, England</span>
          </div>
          <div className="campus-tile" style={{ backgroundImage: `url(${IMG.student})` }}>
            <span>Students on campus</span>
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="section section-tight" id="how-we-work" style={{ background: "#fff" }}>
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-5">
              <p className="kicker mb-2">HOW WE WORK</p>
              <h2 className="mb-3">A five-step model built around one accountable advisor.</h2>
              <p className="lead-sub">No call centre hand-offs. The advisor who takes your first call is the one who sees your visa through to approval.</p>
            </div>
            <div className="col-lg-7">
              <div className="d-flex flex-column gap-4">
                {STEPS.map((s, i) => (
                  <div className="process-step" key={s.title}>
                    <div className="process-num">{i + 1}</div>
                    {i < STEPS.length - 1 && <div className="process-line"></div>}
                    <h4 className="h6 fw-semibold mb-1">{s.title}</h4>
                    <p className="text-body-secondary mb-0 small">{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <div
                className="about-photo-card"
                style={{
                  backgroundImage: `linear-gradient(rgba(8,38,70,.55), rgba(8,38,70,.92)), url(${IMG.oxford})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="init mb-3">YCC</div>
                <h3 className="text-white h4 mb-2">YCC</h3>
                <p className="mb-3" style={{ color: "#cfe0f4" }}>Your Certified Consultant</p>
                <p className="small mb-0" style={{ color: "#dbe6f3" }}>
                  British Council &amp; ICEF certified · MBA-qualified leadership · 22+ years across the UK, South
                  Asia, and the Middle East in student recruitment, B2B partnerships, and education marketing.
                </p>
              </div>
            </div>
            <div className="col-lg-7">
              <p className="kicker mb-2">ABOUT US</p>
              <h2 className="mb-3">We've sat on both sides of the recruitment table.</h2>
              <p className="lead-sub mb-3">
                YCC was founded after seeing the same problem from both sides of the desk: students getting generic,
                one-size-fits-all advice, and strong institutions unable to reach the students who'd actually thrive
                with them. Twenty-two years in international student recruitment, B2B partnerships, and education
                marketing — across the UK, South Asia, and the Middle East — taught us how to close that gap.
                Matched, not mass-marketed.
              </p>
              <p className="lead-sub mb-4">
                Today YCC works with students directly, with agents who represent students in their home countries,
                and with institutions who want honest, qualified representation abroad — all under one certified,
                accountable consultancy.
              </p>
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="quote-block">"Your career, your guidance." That's not a slogan — it's the order of priority in every conversation we have.</div>
                </div>
                <div className="col-sm-6 d-flex align-items-center">
                  <ul className="small text-body-secondary mb-0">
                    <li>MBA, Marketing</li>
                    <li>British Council certified</li>
                    <li>ICEF certified</li>
                    <li>UK · South Asia · Middle East network</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AUDIENCES */}
      <section className="section section-tight" id="audiences" style={{ background: "#fff" }}>
        <div
          className="audiences-banner mb-5"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(8,38,70,.9), rgba(8,38,70,.55)), url(${IMG.student})`,
          }}
        >
          <div className="container">
            <p className="kicker mb-2" style={{ color: "var(--sky-tint)" }}>GET STARTED</p>
            <h2 className="text-white mb-0">Whichever seat you're in, here's your way in.</h2>
          </div>
        </div>
        <div className="container">

          <ul className="nav nav-audience justify-content-center gap-2 mb-5">
            {[
              ["student", "For Students"],
              ["agent", "For Agents"],
              ["institution", "For Institutions"],
            ].map(([key, label]) => (
              <li className="nav-item" key={key}>
                <button className={`nav-link ${tab === key ? "active" : ""}`} onClick={() => setTab(key)} type="button">
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {tab === "student" && (
            <div className="row g-4">
              <div className="col-lg-5">
                <div className="role-card">
                  <div className="role-head d-flex align-items-center gap-3">
                    <div className="role-icon" style={{ background: "var(--sky-tint)", color: "var(--navy)" }}>🎓</div>
                    <h3 className="h5 mb-0">For Students</h3>
                  </div>
                  <div className="role-body">
                    <p className="text-body-secondary">Register once and get a dedicated advisor who manages your shortlist, applications, funding search, and visa file end to end — at no cost to you.</p>
                    <ul className="small text-body-secondary">
                      <li>Free country &amp; course shortlisting</li>
                      <li>Application &amp; SOP support</li>
                      <li>Scholarship and loan matching</li>
                      <li>Visa document checks &amp; interview prep</li>
                    </ul>
                    <p className="small mb-0">Need your IELTS score first? <button className="btn btn-link p-0 align-baseline" onClick={onGoCourses}>See our 8-week IELTS Prep Course →</button></p>
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                <StudentRegistrationForm onOpenAuth={onOpenAuth} />
              </div>
            </div>
          )}

          {tab === "agent" && (
            <div className="row g-4">
              <div className="col-lg-5">
                <div className="role-card">
                  <div className="role-head d-flex align-items-center gap-3">
                    <div className="role-icon" style={{ background: "var(--moss-tint)", color: "var(--moss)" }}>🤝</div>
                    <h3 className="h5 mb-0">For Agents</h3>
                  </div>
                  <div className="role-body">
                    <p className="text-body-secondary">Represent students through YCC's institution network and B2B partnerships, with dedicated support from our business development team.</p>
                    <ul className="small text-body-secondary">
                      <li>Access to our full partner-institution list</li>
                      <li>Co-branded marketing materials</li>
                      <li>Direct line to our BD team</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                <AgentRegistrationForm onOpenAuth={onOpenAuth} />
              </div>
            </div>
          )}

          {tab === "institution" && (
            <div className="row g-4">
              <div className="col-lg-5">
                <div className="role-card">
                  <div className="role-head d-flex align-items-center gap-3">
                    <div className="role-icon" style={{ background: "#f3e6c4", color: "var(--gold-deep)" }}>🏛️</div>
                    <h3 className="h5 mb-0">For Institutions</h3>
                  </div>
                  <div className="role-body">
                    <p className="text-body-secondary">Advertise your programmes to a qualified student pipeline, or let YCC represent your institution across our regional advisor and agent network.</p>
                    <ul className="small text-body-secondary">
                      <li>Featured placement on our destination pages</li>
                      <li>Representation through our agent network</li>
                      <li>Qualified, pre-screened applicant referrals</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                <InstitutionEnquiryForm />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section className="section" id="contact">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-5">
              <p className="kicker mb-2">CONTACT</p>
              <h2 className="mb-3">Have a quick question before you register?</h2>
              <p className="lead-sub mb-4">Reach us directly — a real advisor replies, not a queue.</p>
              <ul className="list-unstyled small">
                <li className="mb-2">✉ <a href="mailto:mzhbd@gmx.co.uk">mzhbd@gmx.co.uk</a></li>
                <li className="mb-2">✉ <a href="mailto:applydash@gmail.com">applydash@gmail.com</a> (applications desk)</li>
                <li className="mb-2">☎ <a href="tel:004407903915367">+44 07903 915367</a></li>
              </ul>
            </div>
            <div className="col-lg-7">
              <div className="form-panel p-4 p-md-5">
                <form action="https://formsubmit.co/mzhbd@gmx.co.uk" method="POST">
                  <input type="hidden" name="_subject" value="New message from YCC website contact form" />
                  <input type="hidden" name="_template" value="table" />
                  <div className="row g-3">
                    <div className="col-md-6"><label className="form-label">Name</label><input required className="form-control" name="Name" /></div>
                    <div className="col-md-6"><label className="form-label">Email</label><input required type="email" className="form-control" name="Email" /></div>
                    <div className="col-12"><label className="form-label">Message</label><textarea required className="form-control" rows={4} name="Message" /></div>
                  </div>
                  <button className="btn btn-navy mt-4 px-4" type="submit">Send message</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="portfolio-page py-5" id="portfolio">
        <div className="container py-4">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-7">
              <p className="kicker mb-2" style={{ color: "var(--sky-tint)" }}>BEHIND YCC</p>
              <h2 className="text-white mb-3">Built and maintained by YCC</h2>
              <p style={{ color: "#c6d5e7" }}>This site — and the rest of the YCC toolset — is designed and built in-house. Explore the code on GitHub, or get in touch directly.</p>
            </div>
          </div>
          <div className="row g-3 justify-content-center">
            <div className="col-sm-6 col-lg-4">
              <a className="card-link" href="https://github.com/zahedbri" target="_blank" rel="noopener noreferrer">
                <div className="portfolio-card p-4 h-100">
                  <h3 className="h6 text-white mb-1">GitHub — @zahedbri</h3>
                  <p className="small mb-0" style={{ color: "#b9c6d6" }}>github.com/zahedbri ↗</p>
                </div>
              </a>
            </div>
            <div className="col-sm-6 col-lg-4">
              <a className="card-link" href="mailto:mzhbd@gmx.co.uk">
                <div className="portfolio-card p-4 h-100">
                  <h3 className="h6 text-white mb-1">Email us directly</h3>
                  <p className="small mb-0" style={{ color: "#b9c6d6" }}>mzhbd@gmx.co.uk</p>
                </div>
              </a>
            </div>
            <div className="col-sm-6 col-lg-4">
              <a className="card-link" href="tel:004407903915367">
                <div className="portfolio-card p-4 h-100">
                  <h3 className="h6 text-white mb-1">Call or WhatsApp</h3>
                  <p className="small mb-0" style={{ color: "#b9c6d6" }}>+44 07903 915367</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
