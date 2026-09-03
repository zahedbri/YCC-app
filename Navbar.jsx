import React from "react";
import { useAuth } from "../AuthContext";

export default function Navbar({ onOpenAuth, onGoDashboard, onGoHome, onGoCourses }) {
  const { user, profile, signOut } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-ycc sticky-top py-2">
      <div className="container">
        <a className="navbar-brand" href="#" onClick={(e) => { e.preventDefault(); onGoHome(); }}>
          YCC<small>YOUR CERTIFIED CONSULTANT</small>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-1">
            <li className="nav-item"><a className="nav-link" href="#destinations" onClick={onGoHome}>Destinations</a></li>
            <li className="nav-item"><button className="nav-link btn btn-link" type="button" onClick={onGoCourses}>Courses</button></li>
            <li className="nav-item"><a className="nav-link" href="#how-we-work" onClick={onGoHome}>How We Work</a></li>
            <li className="nav-item"><a className="nav-link" href="#about" onClick={onGoHome}>About Us</a></li>
            <li className="nav-item"><a className="nav-link" href="#audiences" onClick={onGoHome}>Get Started</a></li>
            <li className="nav-item"><a className="nav-link" href="#contact" onClick={onGoHome}>Contact</a></li>
          </ul>
          <div className="d-flex flex-wrap gap-2 align-items-center">
            {user ? (
              <>
                <span className="small text-body-secondary">
                  {profile?.full_name || user.email} · <span className="text-capitalize">{profile?.role || "…"}</span>
                </span>
                <button className="btn btn-sm btn-outline-navy" onClick={onGoDashboard}>Dashboard</button>
                <button className="btn btn-sm btn-navy" onClick={signOut}>Log out</button>
              </>
            ) : (
              <>
                <button className="btn btn-sm btn-outline-navy" onClick={() => onOpenAuth("student")}>Student Login</button>
                <button className="btn btn-sm btn-outline-navy" onClick={() => onOpenAuth("agent")}>Agent Login</button>
                <button className="btn btn-sm btn-outline-navy" onClick={() => onOpenAuth("admin")}>Admin Login</button>
                <a href="#audiences" className="btn btn-sm btn-gold">Register Free</a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
