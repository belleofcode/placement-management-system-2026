import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  Link,
  NavLink,
  useNavigate,
  useLocation
} from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  BriefcaseBusiness,
  ClipboardList,
  UserRound,
  Building2,
  PlusCircle,
  Users,
  ShieldCheck,
  LogOut,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock3,
  XCircle,
  Trophy,
  Menu,
  X,
  BarChart3
} from "lucide-react";
import { api } from "./api";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("placement_user") || "null");
  } catch {
    return null;
  }
};

function saveSession(data) {
  localStorage.setItem("placement_token", data.token);
  localStorage.setItem("placement_user", JSON.stringify(data.user));
}

function clearSession() {
  localStorage.removeItem("placement_token");
  localStorage.removeItem("placement_user");
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/drives" element={<StudentDrives />} />
        <Route path="/student/applications" element={<StudentApplications />} />
        <Route path="/student/profile" element={<Profile />} />

        <Route path="/company" element={<CompanyDashboard />} />
        <Route path="/company/post" element={<PostOpportunity />} />
        <Route path="/company/opportunities" element={<CompanyOpportunities />} />
        <Route path="/company/applicants" element={<CompanyApplicants />} />
        <Route path="/company/profile" element={<Profile />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/companies" element={<AdminCompanies />} />
        <Route path="/admin/applications" element={<AdminApplications />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function ProtectedLayout() {
  const user = getStoredUser();
  if (!user || !localStorage.getItem("placement_token")) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardShell />;
}

function DashboardShell() {
  const user = getStoredUser();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    clearSession();
    navigate("/login");
  };

  const groups = {
    student: [
      ["/student", "Overview", LayoutDashboard],
      ["/student/drives", "Placement Drives", BriefcaseBusiness],
      ["/student/applications", "My Applications", ClipboardList],
      ["/student/profile", "My Profile", UserRound]
    ],
    company: [
      ["/company", "Overview", LayoutDashboard],
      ["/company/post", "Post Opportunity", PlusCircle],
      ["/company/opportunities", "My Opportunities", BriefcaseBusiness],
      ["/company/applicants", "Applicants", Users],
      ["/company/profile", "Company Profile", Building2]
    ],
    admin: [
      ["/admin", "Overview", LayoutDashboard],
      ["/admin/students", "Students", Users],
      ["/admin/companies", "Companies", Building2],
      ["/admin/applications", "Applications & Results", ClipboardList]
    ]
  };

  const links = groups[user.role];

  return (
    <div className="app">
      <header className="topbar">
        <Link className="brand" to={`/${user.role}`}>
          <span className="brand-icon"><GraduationCap size={21} /></span>
          <span>PlacementHub</span>
        </Link>

        <div className="top-actions">
          <div className="user-chip">
            <div className="avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
            <div className="user-meta">
              <strong>{user.name}</strong>
              <span>{user.role}</span>
            </div>
          </div>

          <button className="icon-button mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          <button className="logout-button" onClick={logout}>
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
          <div className="sidebar-heading">
            {user.role === "student" && "STUDENT"}
            {user.role === "company" && "RECRUITER"}
            {user.role === "admin" && "ADMINISTRATION"}
          </div>

          <nav className="sidebar-nav">
            {links.map(([to, label, Icon]) => (
              <NavLink
                key={to}
                to={to}
                end={to === `/${user.role}`}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Landing() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Link className="brand" to="/">
          <span className="brand-icon"><GraduationCap size={21} /></span>
          <span>PlacementHub</span>
        </Link>

        <div className="nav-buttons">
          <Link className="button secondary" to="/login">Login</Link>
          <Link className="button primary" to="/register">Register</Link>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">COLLEGE PLACEMENT MANAGEMENT</span>
          <h1>Turn placement chaos into a clean digital workflow.</h1>
          <p>
            Manage student eligibility, company opportunities, applications,
            shortlisting and final placement results from one professional web
            application.
          </p>

          <div className="hero-actions">
            <Link className="button primary large" to="/register">
              Get Started <ArrowRight size={18} />
            </Link>
            <Link className="button secondary large" to="/login">
              Sign In
            </Link>
          </div>
        </div>

        <div className="role-preview">
          <RoleCard
            icon={<GraduationCap />}
            title="Students"
            text="Register, maintain profiles, view eligible drives and apply."
          />
          <RoleCard
            icon={<Building2 />}
            title="Companies"
            text="Post jobs with CGPA, backlog, branch and year criteria."
          />
          <RoleCard
            icon={<ShieldCheck />}
            title="Administrator"
            text="Monitor candidates, applications and placement results."
          />
          <RoleCard
            icon={<CheckCircle2 />}
            title="Automatic Eligibility"
            text="Eligibility is calculated from each company's criteria."
          />
        </div>
      </section>
    </div>
  );
}

function RoleCard({ icon, title, text }) {
  return (
    <div className="role-card">
      <div className="role-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

function AuthPage({ mode }) {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    branch: "CST",
    year: 3,
    cgpa: 8,
    backlogs: 0,
    companyName: "",
    website: "",
    description: ""
  });

  const update = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data =
        mode === "login"
          ? await api.login({
              email: form.email,
              password: form.password,
              role
            })
          : await api.register({
              ...form,
              role
            });

      saveSession(data);
      navigate(`/${data.user.role}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Link className="auth-brand" to="/">
        <span className="brand-icon"><GraduationCap size={21} /></span>
        PlacementHub
      </Link>

      <div className="auth-card">
        <div className="auth-header">
          <span className="eyebrow">{mode === "login" ? "WELCOME BACK" : "GET STARTED"}</span>
          <h1>{mode === "login" ? "Sign in to PlacementHub" : "Create your account"}</h1>
          <p>
            {mode === "login"
              ? "Choose your profile and continue to your dashboard."
              : "Choose a profile and enter the details required for your placement portal."}
          </p>
        </div>

        <div className="profile-tabs">
          {[
            ["student", GraduationCap, "Student"],
            ["company", Building2, "Company"],
            ["admin", ShieldCheck, "Admin"]
          ].map(([value, Icon, label]) => (
            <button
              key={value}
              className={role === value ? "profile-tab active" : "profile-tab"}
              onClick={() => setRole(value)}
              type="button"
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </div>

        {role === "admin" && mode === "register" ? (
          <div className="admin-register-note">
            <ShieldCheck size={24} />
            <div>
              <strong>Administrator registration is disabled.</strong>
              <p>Use the administrator credentials configured in the backend `.env` file.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="form-stack">
            {mode === "register" && role !== "admin" && (
              <>
                <div className="field-grid">
                  <Field label={role === "company" ? "Contact Name" : "Full Name"}>
                    <input name="name" value={form.name} onChange={update} required placeholder={role === "company" ? "Recruiter name" : "Your full name"} />
                  </Field>
                  <Field label="Email">
                    <input type="email" name="email" value={form.email} onChange={update} required placeholder="you@example.com" />
                  </Field>
                </div>

                <div className="field-grid">
                  <Field label="Password">
                    <input type="password" name="password" value={form.password} onChange={update} required placeholder="Minimum 6 characters" minLength={6} />
                  </Field>
                  <Field label="Phone">
                    <input name="phone" value={form.phone} onChange={update} placeholder="Phone number" />
                  </Field>
                </div>

                {role === "student" ? (
                  <>
                    <div className="field-grid three">
                      <Field label="Branch">
                        <input name="branch" value={form.branch} onChange={update} placeholder="CST" />
                      </Field>
                      <Field label="Year">
                        <input type="number" name="year" value={form.year} onChange={update} min="1" max="6" />
                      </Field>
                      <Field label="CGPA">
                        <input type="number" step="0.1" name="cgpa" value={form.cgpa} onChange={update} min="0" max="10" />
                      </Field>
                    </div>

                    <Field label="Backlogs">
                      <input type="number" name="backlogs" value={form.backlogs} onChange={update} min="0" />
                    </Field>
                  </>
                ) : (
                  <>
                    <Field label="Company Name">
                      <input name="companyName" value={form.companyName} onChange={update} required placeholder="Company name" />
                    </Field>
                    <div className="field-grid">
                      <Field label="Website">
                        <input name="website" value={form.website} onChange={update} placeholder="https://company.com" />
                      </Field>
                      <Field label="About Company">
                        <input name="description" value={form.description} onChange={update} placeholder="Short company description" />
                      </Field>
                    </div>
                  </>
                )}
              </>
            )}

            {mode === "login" && (
              <>
                <Field label="Email">
                  <input type="email" name="email" value={form.email} onChange={update} required placeholder="you@example.com" />
                </Field>
                <Field label="Password">
                  <input type="password" name="password" value={form.password} onChange={update} required placeholder="Your password" />
                </Field>
              </>
            )}

            {error && <div className="error-message">{error}</div>}

            <button className="button primary full" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>
        )}

        <div className="auth-footer">
          {mode === "login" ? (
            <>New here? <Link to="/register">Create an account</Link></>
          ) : (
            <>Already registered? <Link to="/login">Sign in</Link></>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function StudentDashboard() {
  const user = getStoredUser();
  const [applications, setApplications] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    Promise.all([api.myApplications(), api.opportunities()])
      .then(([a, o]) => {
        setApplications(a);
        setOpportunities(o);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="STUDENT DASHBOARD"
        title={`Welcome, ${user.name}`}
        description="Track your placement journey from one place."
      />

      <div className="stats-grid">
        <StatCard icon={<GraduationCap />} value={user.branch || "—"} label="Branch" />
        <StatCard icon={<BarChart3 />} value={user.year || "—"} label="Year" />
        <StatCard icon={<Trophy />} value={user.cgpa ?? "—"} label="CGPA" />
        <StatCard icon={<XCircle />} value={user.backlogs ?? 0} label="Backlogs" />
      </div>

      <section className="dashboard-panel">
        <div>
          <div className="panel-icon"><BriefcaseBusiness /></div>
          <h2>Your placement journey</h2>
          <p>Browse eligible opportunities, apply before deadlines and track your results here.</p>
        </div>

        <div className="journey-actions">
          <Link className="button primary" to="/student/drives">
            Browse Placement Drives <ArrowRight size={17} />
          </Link>
          <Link className="button secondary" to="/student/applications">
            View My Applications ({applications.length})
          </Link>
        </div>
      </section>

      <div className="section-title-row">
        <div>
          <h2>Recommended drives</h2>
          <p>Opportunities that are currently available for students.</p>
        </div>
        <Link className="text-link" to="/student/drives">View all</Link>
      </div>

      <div className="mini-grid">
        {opportunities.filter(o => o.eligible).slice(0, 3).map(o => (
          <OpportunityCard key={o._id} opportunity={o} compact />
        ))}
        {!opportunities.filter(o => o.eligible).length && (
          <div className="empty-state">No eligible drives are available right now.</div>
        )}
      </div>
    </>
  );
}

function StudentDrives() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const load = () => api.opportunities().then(setItems).catch(e => setMessage(e.message));

  useEffect(() => { load(); }, []);

  const apply = async id => {
    setMessage("");
    try {
      await api.apply(id);
      setMessage("Application submitted successfully.");
    } catch (e) {
      setMessage(e.message);
    }
  };

  const filtered = items.filter(o =>
    `${o.title} ${o.company?.companyName || o.company?.name || ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <>
      <PageHeader
        eyebrow="OPPORTUNITIES"
        title="Placement Drives"
        description="Find opportunities that match your academic profile."
      />

      <div className="search-bar">
        <Search size={18} />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by company or role..." />
      </div>

      {message && <div className="success-message">{message}</div>}

      <div className="opportunity-list">
        {filtered.map(o => (
          <OpportunityCard key={o._id} opportunity={o} onApply={() => apply(o._id)} />
        ))}
        {!filtered.length && <div className="empty-state">No placement drives found.</div>}
      </div>
    </>
  );
}

function OpportunityCard({ opportunity: o, onApply, compact = false }) {
  const deadline = o.deadline ? new Date(o.deadline).toLocaleDateString() : "—";
  const company = o.company?.companyName || o.company?.name || "Company";

  return (
    <article className={`opportunity-card ${compact ? "compact" : ""}`}>
      <div className="opportunity-main">
        <div className="company-logo">{company.charAt(0)}</div>
        <div>
          <h3>{o.title}</h3>
          <p className="company-name">{company}</p>
        </div>
      </div>

      {!compact && (
        <>
          <p className="opportunity-description">{o.description}</p>

          <div className="opportunity-meta">
            <span><Building2 size={15} /> {o.location || "Not specified"}</span>
            <span><Trophy size={15} /> {o.package || "Not specified"}</span>
            <span><Clock3 size={15} /> Deadline: {deadline}</span>
          </div>

          <div className="eligibility">
            <strong>Eligibility</strong>
            <span>CGPA ≥ {o.eligibility?.minCGPA ?? 0}</span>
            <span>Backlogs ≤ {o.eligibility?.maxBacklogs ?? 0}</span>
            <span>Year ≥ {o.eligibility?.minYear ?? 1}</span>
            <span>{o.eligibility?.branches?.length ? o.eligibility.branches.join(", ") : "All branches"}</span>
          </div>
        </>
      )}

      <div className="opportunity-footer">
        {o.eligible !== undefined && (
          <span className={o.eligible ? "eligible-badge" : "not-eligible-badge"}>
            {o.eligible ? "Eligible" : "Not eligible"}
          </span>
        )}
        {onApply && (
          <button className="button primary" disabled={!o.eligible} onClick={onApply}>
            Apply Now <ArrowRight size={16} />
          </button>
        )}
      </div>
    </article>
  );
}

function StudentApplications() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.myApplications().then(setItems).catch(() => {});
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="APPLICATIONS"
        title="My Applications"
        description="Track every placement application and its current status."
      />

      <div className="application-list">
        {items.map(a => (
          <div className="application-card" key={a._id}>
            <div>
              <span className="eyebrow">{a.opportunity?.company?.companyName || "Company"}</span>
              <h3>{a.opportunity?.title}</h3>
              <p>Applied {new Date(a.appliedAt).toLocaleDateString()}</p>
            </div>
            <StatusBadge status={a.status} />
          </div>
        ))}

        {!items.length && <div className="empty-state">You have not submitted any applications yet.</div>}
      </div>
    </>
  );
}

function CompanyDashboard() {
  const user = getStoredUser();
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    Promise.all([api.myOpportunities(), api.companyApplications()])
      .then(([o, a]) => {
        setOpportunities(o);
        setApplications(a);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="RECRUITER DASHBOARD"
        title={`Welcome, ${user.companyName || user.name}`}
        description="Manage placement opportunities and candidate applications."
        action={
          <Link className="button primary" to="/company/post">
            <PlusCircle size={17} /> Post Opportunity
          </Link>
        }
      />

      <div className="stats-grid">
        <StatCard icon={<BriefcaseBusiness />} value={opportunities.length} label="Opportunities" />
        <StatCard icon={<Users />} value={applications.length} label="Applicants" />
        <StatCard icon={<CheckCircle2 />} value={applications.filter(a => a.status === "Selected").length} label="Selected" />
        <StatCard icon={<Clock3 />} value={applications.filter(a => a.status === "Shortlisted").length} label="Shortlisted" />
      </div>

      <section className="dashboard-panel">
        <div>
          <div className="panel-icon"><Users /></div>
          <h2>Candidate pipeline</h2>
          <p>Review applications, shortlist suitable candidates and update final results.</p>
        </div>
        <div className="journey-actions">
          <Link className="button secondary" to="/company/applicants">View Applicants</Link>
          <Link className="button secondary" to="/company/opportunities">Manage Drives</Link>
        </div>
      </section>
    </>
  );
}

function PostOpportunity() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    package: "",
    jobType: "Full Time",
    deadline: "",
    minCGPA: 7,
    maxBacklogs: 0,
    branches: "CST, CSE, ECE",
    minYear: 3
  });

  const update = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.createOpportunity(form);
      setMessage("Opportunity posted successfully.");
      setTimeout(() => navigate("/company/opportunities"), 700);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="RECRUITER"
        title="Post Opportunity"
        description="Create a placement drive and define clear eligibility criteria."
      />

      <form className="panel form-stack" onSubmit={submit}>
        <div className="form-section-title">
          <h2>Opportunity details</h2>
          <p>Give students enough information to understand the role.</p>
        </div>

        <div className="field-grid">
          <Field label="Job Title">
            <input name="title" value={form.title} onChange={update} required placeholder="Software Engineer" />
          </Field>
          <Field label="Job Type">
            <select name="jobType" value={form.jobType} onChange={update}>
              <option>Full Time</option>
              <option>Internship</option>
              <option>Internship + Full Time</option>
            </select>
          </Field>
        </div>

        <Field label="Description">
          <textarea name="description" value={form.description} onChange={update} required placeholder="Describe the role, responsibilities and required skills..." />
        </Field>

        <div className="field-grid">
          <Field label="Location">
            <input name="location" value={form.location} onChange={update} placeholder="Hyderabad / Remote" />
          </Field>
          <Field label="Package / Stipend">
            <input name="package" value={form.package} onChange={update} placeholder="₹8 LPA" />
          </Field>
        </div>

        <div className="field-grid">
          <Field label="Application Deadline">
            <input type="date" name="deadline" value={form.deadline} onChange={update} required />
          </Field>
          <Field label="Minimum Year">
            <input type="number" name="minYear" value={form.minYear} onChange={update} min="1" />
          </Field>
        </div>

        <div className="form-section-title">
          <h2>Eligibility criteria</h2>
          <p>Students will be marked eligible automatically.</p>
        </div>

        <div className="field-grid three">
          <Field label="Minimum CGPA">
            <input type="number" step="0.1" name="minCGPA" value={form.minCGPA} onChange={update} min="0" max="10" />
          </Field>
          <Field label="Maximum Backlogs">
            <input type="number" name="maxBacklogs" value={form.maxBacklogs} onChange={update} min="0" />
          </Field>
          <Field label="Branches">
            <input name="branches" value={form.branches} onChange={update} placeholder="CST, CSE, ECE" />
          </Field>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <button className="button primary submit-button">
          Publish Placement Drive <ArrowRight size={17} />
        </button>
      </form>
    </>
  );
}

function CompanyOpportunities() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const load = () => api.myOpportunities().then(setItems).catch(e => setMessage(e.message));

  useEffect(() => { load(); }, []);

  const remove = async id => {
    if (!confirm("Delete this opportunity and its applications?")) return;
    try {
      await api.deleteOpportunity(id);
      load();
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="RECRUITER"
        title="My Opportunities"
        description="Review and manage your placement drives."
        action={
          <Link className="button primary" to="/company/post">
            <PlusCircle size={17} /> New Drive
          </Link>
        }
      />

      {message && <div className="error-message">{message}</div>}

      <div className="opportunity-list">
        {items.map(o => (
          <article className="opportunity-card" key={o._id}>
            <div className="opportunity-main">
              <div className="company-logo"><BriefcaseBusiness size={20} /></div>
              <div>
                <h3>{o.title}</h3>
                <p className="company-name">{o.location} · {o.package}</p>
              </div>
            </div>
            <p className="opportunity-description">{o.description}</p>
            <div className="eligibility">
              <strong>Eligibility</strong>
              <span>CGPA ≥ {o.eligibility?.minCGPA}</span>
              <span>Backlogs ≤ {o.eligibility?.maxBacklogs}</span>
              <span>{o.eligibility?.branches?.join(", ") || "All branches"}</span>
            </div>
            <div className="opportunity-footer">
              <span className="status-open">{new Date(o.deadline) >= new Date() ? "Open" : "Closed"}</span>
              <button className="button danger" onClick={() => remove(o._id)}>Delete</button>
            </div>
          </article>
        ))}
        {!items.length && <div className="empty-state">You have not posted any opportunities yet.</div>}
      </div>
    </>
  );
}

function CompanyApplicants() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const load = () => api.companyApplications().then(setItems).catch(e => setMessage(e.message));

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.updateApplicationStatus(id, status);
      load();
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="RECRUITER"
        title="Applicants"
        description="Review students who applied to your placement drives."
      />

      {message && <div className="error-message">{message}</div>}

      <div className="table-panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Drive</th>
                <th>CGPA</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map(a => (
                <tr key={a._id}>
                  <td>
                    <strong>{a.student?.name}</strong>
                    <small>{a.student?.email}</small>
                  </td>
                  <td>{a.opportunity?.title}</td>
                  <td>{a.student?.cgpa}</td>
                  <td>{a.student?.branch}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td>
                    <div className="table-actions">
                      <button className="mini-button" onClick={() => updateStatus(a._id, "Shortlisted")}>Shortlist</button>
                      <button className="mini-button success" onClick={() => updateStatus(a._id, "Selected")}>Select</button>
                      <button className="mini-button danger" onClick={() => updateStatus(a._id, "Rejected")}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!items.length && <div className="empty-state">No applicants yet.</div>}
      </div>
    </>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    companies: 0,
    opportunities: 0,
    applications: 0,
    selected: 0
  });

  useEffect(() => {
    api.adminStats().then(setStats).catch(() => {});
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="ADMINISTRATION"
        title="Placement Overview"
        description="Monitor students, recruiters, applications and final placement outcomes."
      />

      <div className="stats-grid">
        <StatCard icon={<Users />} value={stats.students} label="Students" />
        <StatCard icon={<Building2 />} value={stats.companies} label="Companies" />
        <StatCard icon={<BriefcaseBusiness />} value={stats.opportunities} label="Placement Drives" />
        <StatCard icon={<Trophy />} value={stats.selected} label="Students Selected" />
      </div>

      <div className="admin-cards">
        <Link className="admin-card" to="/admin/students">
          <Users />
          <div><h3>Student Management</h3><p>View registered students and academic profiles.</p></div>
          <ArrowRight />
        </Link>
        <Link className="admin-card" to="/admin/companies">
          <Building2 />
          <div><h3>Company Management</h3><p>View recruiters and their placement drives.</p></div>
          <ArrowRight />
        </Link>
        <Link className="admin-card" to="/admin/applications">
          <ClipboardList />
          <div><h3>Applications & Results</h3><p>Monitor applications and final placement status.</p></div>
          <ArrowRight />
        </Link>
      </div>
    </>
  );
}

function AdminStudents() {
  const [items, setItems] = useState([]);

  useEffect(() => { api.students().then(setItems).catch(() => {}); }, []);

  return (
    <>
      <PageHeader eyebrow="ADMINISTRATION" title="Students" description="Registered student profiles." />
      <div className="table-panel">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Branch</th><th>Year</th><th>CGPA</th><th>Backlogs</th></tr></thead>
            <tbody>
              {items.map(s => (
                <tr key={s._id}>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.email}</td>
                  <td>{s.branch}</td>
                  <td>{s.year}</td>
                  <td>{s.cgpa}</td>
                  <td>{s.backlogs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!items.length && <div className="empty-state">No students registered.</div>}
      </div>
    </>
  );
}

function AdminCompanies() {
  const [items, setItems] = useState([]);

  useEffect(() => { api.companies().then(setItems).catch(() => {}); }, []);

  return (
    <>
      <PageHeader eyebrow="ADMINISTRATION" title="Companies" description="Registered recruiter profiles." />
      <div className="table-panel">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Company</th><th>Contact</th><th>Email</th><th>Website</th></tr></thead>
            <tbody>
              {items.map(c => (
                <tr key={c._id}>
                  <td><strong>{c.companyName || c.name}</strong></td>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.website || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!items.length && <div className="empty-state">No companies registered.</div>}
      </div>
    </>
  );
}

function AdminApplications() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const load = () => api.allApplications().then(setItems).catch(e => setMessage(e.message));

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.updateApplicationStatus(id, status);
      load();
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <>
      <PageHeader eyebrow="ADMINISTRATION" title="Applications & Results" description="Monitor and update final placement results." />

      {message && <div className="error-message">{message}</div>}

      <div className="table-panel">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Student</th><th>Company</th><th>Role</th><th>CGPA</th><th>Status</th><th>Result</th></tr></thead>
            <tbody>
              {items.map(a => (
                <tr key={a._id}>
                  <td><strong>{a.student?.name}</strong><small>{a.student?.email}</small></td>
                  <td>{a.opportunity?.company?.companyName || a.opportunity?.company?.name}</td>
                  <td>{a.opportunity?.title}</td>
                  <td>{a.student?.cgpa}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td>
                    <div className="table-actions">
                      <button className="mini-button success" onClick={() => updateStatus(a._id, "Selected")}>Select</button>
                      <button className="mini-button danger" onClick={() => updateStatus(a._id, "Rejected")}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!items.length && <div className="empty-state">No applications yet.</div>}
      </div>
    </>
  );
}

function Profile() {
  const initial = getStoredUser();
  const [form, setForm] = useState(initial || {});
  const [message, setMessage] = useState("");
  const isStudent = initial?.role === "student";

  const update = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    try {
      const updated = await api.updateProfile(form);
      localStorage.setItem("placement_user", JSON.stringify({ ...initial, ...updated }));
      setMessage("Profile updated successfully.");
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow={isStudent ? "STUDENT PROFILE" : "COMPANY PROFILE"}
        title="My Profile"
        description="Keep your placement information accurate and up to date."
      />

      <form className="panel form-stack" onSubmit={submit}>
        <div className="profile-header">
          <div className="large-avatar">{form.name?.charAt(0)?.toUpperCase()}</div>
          <div>
            <h2>{form.name}</h2>
            <p>{form.email}</p>
          </div>
        </div>

        <div className="field-grid">
          <Field label="Name"><input name="name" value={form.name || ""} onChange={update} /></Field>
          <Field label="Phone"><input name="phone" value={form.phone || ""} onChange={update} /></Field>
        </div>

        {isStudent ? (
          <>
            <div className="field-grid three">
              <Field label="Branch"><input name="branch" value={form.branch || ""} onChange={update} /></Field>
              <Field label="Year"><input type="number" name="year" value={form.year || ""} onChange={update} /></Field>
              <Field label="CGPA"><input type="number" step="0.1" name="cgpa" value={form.cgpa || ""} onChange={update} /></Field>
            </div>
            <Field label="Backlogs"><input type="number" name="backlogs" value={form.backlogs ?? 0} onChange={update} /></Field>
          </>
        ) : (
          <>
            <Field label="Company Name"><input name="companyName" value={form.companyName || ""} onChange={update} /></Field>
            <Field label="Website"><input name="website" value={form.website || ""} onChange={update} /></Field>
            <Field label="Company Description"><textarea name="description" value={form.description || ""} onChange={update} /></Field>
          </>
        )}

        {message && <div className="success-message">{message}</div>}

        <button className="button primary submit-button">Save Changes</button>
      </form>
    </>
  );
}

function StatusBadge({ status }) {
  const config = {
    Applied: ["status-applied", Clock3],
    Shortlisted: ["status-shortlisted", CheckCircle2],
    Selected: ["status-selected", Trophy],
    Rejected: ["status-rejected", XCircle]
  };

  const [className, Icon] = config[status] || config.Applied;

  return (
    <span className={`status-badge ${className}`}>
      <Icon size={14} /> {status}
    </span>
  );
}

export default App;
