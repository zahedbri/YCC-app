import React from "react";
import { useAuth } from "../AuthContext";

export default function Footer({ onOpenAuth, onGoCourses }) {
  const { user } = useAuth();
  return (
    <footer className="site-footer pt-5 pb-4">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <h5 className="text-white" style={{ fontFamily: "'Fraunces',serif" }}>YCC</h5>
            <p className="small mb-3" style={{ color: "#b9c6d6" }}>
              Your Certified Consultant — your career, your guidance. Independent education
              consultancy for students, agents, and institutions across the UK, Europe, Malaysia,
              the Middle East, Australia, the USA, and online.
            </p>
          </div>
          <div className="col-6 col-lg-2">
            <h6 className="mb-3">Explore</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="#destinations">Destinations</a></li>
              <li className="mb-2"><button className="btn btn-link p-0 text-decoration-none footer-link-btn" onClick={onGoCourses}>IELTS Prep Course</button></li>
              <li className="mb-2"><a href="#how-we-work">How We Work</a></li>
              <li className="mb-2"><a href="#about">About Us</a></li>
              <li className="mb-2"><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="col-6 col-lg-2">
            <h6 className="mb-3">Get started</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="#audiences">Student registration</a></li>
              <li className="mb-2"><a href="#audiences">Agent registration</a></li>
              <li className="mb-2"><a href="#audiences">Institution enquiry</a></li>
            </ul>
          </div>
          {!user && (
            <div className="col-6 col-lg-2">
              <h6 className="mb-3">Portal login</h6>
              <ul className="list-unstyled small">
                <li className="mb-2"><button className="btn btn-link p-0 text-decoration-none footer-link-btn" onClick={() => onOpenAuth("student")}>Student login</button></li>
                <li className="mb-2"><button className="btn btn-link p-0 text-decoration-none footer-link-btn" onClick={() => onOpenAuth("agent")}>Agent login</button></li>
                <li className="mb-2"><button className="btn btn-link p-0 text-decoration-none footer-link-btn" onClick={() => onOpenAuth("admin")}>Admin login</button></li>
              </ul>
            </div>
          )}
          <div className="col-6 col-lg-2">
            <h6 className="mb-3">Contact &amp; links</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="mailto:mzhbd@gmx.co.uk">mzhbd@gmx.co.uk</a></li>
              <li className="mb-2"><a href="mailto:applydash@gmail.com">applydash@gmail.com</a></li>
              <li className="mb-2"><a href="tel:004407903915367">+44 07903 915367</a></li>
              <li className="mb-2"><a href="https://github.com/zahedbri" target="_blank" rel="noopener noreferrer">GitHub / Portfolio ↗</a></li>
            </ul>
          </div>
        </div>
        <hr style={{ borderColor: "rgba(255,255,255,.12)" }} className="my-4" />
        <div className="d-flex flex-wrap justify-content-between gap-2 fine">
          <span>© {new Date().getFullYear()} YCC — Your Certified Consultant. All rights reserved.</span>
          <span>
            Designed &amp; built by the YCC team ·{" "}
            <a href="https://github.com/zahedbri" target="_blank" rel="noopener noreferrer">
              github.com/zahedbri
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
