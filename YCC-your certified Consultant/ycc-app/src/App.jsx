import React, { useState } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";

function Shell() {
  const { user } = useAuth();
  const [view, setView] = useState("home"); // "home" | "dashboard" | "courses"
  const [authRole, setAuthRole] = useState(null); // null when modal closed

  return (
    <>
      <div className="topbar py-1">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex flex-wrap gap-3">
            <a href="mailto:mzhbd@gmx.co.uk">✉ mzhbd@gmx.co.uk</a>
            <a href="tel:004407903915367">☎ +44 07903 915367</a>
          </div>
          <div className="d-none d-md-block">Your career, your guidance — since day one.</div>
        </div>
      </div>

      <Navbar
        onOpenAuth={(role) => setAuthRole(role)}
        onGoDashboard={() => setView("dashboard")}
        onGoHome={() => setView("home")}
        onGoCourses={() => setView("courses")}
      />

      <main>
        {view === "dashboard" && user ? (
          <Dashboard onOpenAuth={(role) => setAuthRole(role)} onGoCourses={() => setView("courses")} />
        ) : view === "courses" ? (
          <Courses onOpenAuth={(role) => setAuthRole(role)} />
        ) : (
          <Home onOpenAuth={(role) => setAuthRole(role)} onGoCourses={() => setView("courses")} />
        )}
      </main>

      <Footer onOpenAuth={(role) => setAuthRole(role)} onGoCourses={() => setView("courses")} />

      {authRole && (
        <AuthModal
          initialRole={authRole}
          onClose={() => {
            setAuthRole(null);
          }}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}

