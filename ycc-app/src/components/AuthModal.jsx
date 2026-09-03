import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const ROLE_COPY = {
  student: {
    label: "Student",
    hint: "Log in to check your application status, or create an account to start one.",
  },
  agent: {
    label: "Agent",
    hint: "Log in to your partner portal, or register your agency to get started.",
  },
  admin: {
    label: "Admin",
    hint: "Restricted to YCC staff. Sign in with your staff account below.",
  },
};

export default function AuthModal({ initialRole = "student", onClose }) {
  const [role, setRole] = useState(initialRole);
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    try {
      if (mode === "signup") {
        if (role === "admin") {
          throw new Error(
            "Admin accounts are created by an existing admin, not through self sign-up."
          );
        }
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, requested_role: role } },
        });
        if (signUpError) throw signUpError;

        // The profiles row is created by a database trigger (see supabase/schema.sql)
        // using requested_role from user metadata, defaulting to "student".
        if (data.user && !data.session) {
          setNotice("Account created — check your email to confirm, then log in.");
          setMode("login");
        } else {
          onClose();
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        onClose();
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      role="dialog"
      style={{ background: "rgba(8,38,70,.55)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header" style={{ background: "#0C3B6E", color: "#fff", border: "none" }}>
            <h5 className="modal-title">{mode === "signup" ? "Create account" : "Log in"}</h5>
            <button type="button" className="btn-close" style={{ filter: "invert(1)" }} onClick={onClose} aria-label="Close" />
          </div>
          <div className="modal-body p-4">
            <div className="d-flex gap-2 mb-3">
              {Object.entries(ROLE_COPY).map(([key, { label }]) => (
                <button
                  key={key}
                  type="button"
                  className={`btn btn-sm flex-fill ${role === key ? "text-white" : "border"}`}
                  style={role === key ? { background: "#0C3B6E", borderColor: "#0C3B6E" } : { borderColor: "#E3DFD3" }}
                  onClick={() => {
                    setRole(key);
                    if (key === "admin") setMode("login");
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="small text-body-secondary">{ROLE_COPY[role].hint}</p>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            {notice && <div className="alert alert-success py-2 small">{notice}</div>}

            <form onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Full name</label>
                  <input
                    className="form-control"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              )}
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="btn w-100 text-white"
                style={{ background: "#0C3B6E" }}
              >
                {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
              </button>
            </form>

            {role !== "admin" && (
              <p className="small text-center text-body-secondary mt-3 mb-0">
                {mode === "signup" ? (
                  <>
                    Already registered?{" "}
                    <button className="btn btn-link p-0 align-baseline" onClick={() => setMode("login")}>
                      Log in
                    </button>
                  </>
                ) : (
                  <>
                    New here?{" "}
                    <button className="btn btn-link p-0 align-baseline" onClick={() => setMode("signup")}>
                      Create an account
                    </button>
                  </>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
