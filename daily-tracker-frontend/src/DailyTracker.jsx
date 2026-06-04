import { useState, useEffect, useMemo } from "react";

const SUBJECTS = ["DSA", "OS", "DBMS", "CN", "OOP", "System Design", "Other"];

const defaultForm = {
  date: new Date().toISOString().slice(0, 10),
  dsa_questions: "",
  core_subject: SUBJECTS[0],
  core_hours: "",
  development_hours: "",
  sleep_hours: "",
  notes: "",
};

function StatCard({ label, value, sub, color }) {
  const colors = {
    amber: { bg: "#FFF8ED", text: "#854F0B", border: "#FAC775" },
    teal:  { bg: "#E8F7F2", text: "#0F6E56", border: "#5DCAA5" },
    blue:  { bg: "#E6F1FB", text: "#185FA5", border: "#85B7EB" },
    coral: { bg: "#FAF0EC", text: "#993C1D", border: "#F0997B" },
    purple:{ bg: "#EEEDFE", text: "#3C3489", border: "#AFA9EC" },
  };
  const c = colors[color] || colors.teal;
  return (
    <div style={{
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: 12, padding: "16px 20px", flex: "1 1 140px"
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: c.text, marginBottom: 6, opacity: 0.7 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: c.text, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: c.text, opacity: 0.6, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Tag({ children, color }) {
  const colors = {
    teal:  { bg: "#E1F5EE", text: "#0F6E56" },
    amber: { bg: "#FAEEDA", text: "#854F0B" },
    blue:  { bg: "#E6F1FB", text: "#185FA5" },
  };
  const c = colors[color] || colors.teal;
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "2px 8px",
      borderRadius: 20, background: c.bg, color: c.text
    }}>{children}</span>
  );
}

export default function DailyTracker() {
  const [logs, setLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("daily_logs") || "[]"); } catch { return []; }
  });
  const [tab, setTab] = useState("entry");
  const [form, setForm] = useState(defaultForm);
  const [saved, setSaved] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("daily_logs", JSON.stringify(logs));
  }, [logs]);

  const stats = useMemo(() => {
    if (!logs.length) return { streak: 0, totalDSA: 0, totalCore: 0, totalDev: 0, avgSleep: 0 };
    const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
    let streak = 0;
    const today = new Date().toISOString().slice(0, 10);
    let cur = today;
    for (const log of sorted) {
      if (log.date === cur) { streak++; const d = new Date(cur); d.setDate(d.getDate() - 1); cur = d.toISOString().slice(0, 10); }
      else if (log.date < cur) break;
    }
    return {
      streak,
      totalDSA: logs.reduce((s, l) => s + (+l.dsa_questions || 0), 0),
      totalCore: +logs.reduce((s, l) => s + (+l.core_hours || 0), 0).toFixed(1),
      totalDev: +logs.reduce((s, l) => s + (+l.development_hours || 0), 0).toFixed(1),
      avgSleep: logs.length ? +(logs.reduce((s, l) => s + (+l.sleep_hours || 0), 0) / logs.length).toFixed(1) : 0,
    };
  }, [logs]);

  const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.date) return;
    if (editId !== null) {
      setLogs(logs.map(l => l.id === editId ? { ...form, id: editId } : l));
      setEditId(null);
    } else {
      const existing = logs.find(l => l.date === form.date);
      if (existing) {
        if (!window.confirm(`Entry for ${form.date} already exists. Overwrite?`)) return;
        setLogs(logs.map(l => l.date === form.date ? { ...form, id: l.id } : l));
      } else {
        setLogs([...logs, { ...form, id: Date.now() }]);
      }
    }
    setForm(defaultForm);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setTab("dashboard");
  };

  const handleEdit = (log) => {
    setForm({ ...log });
    setEditId(log.id);
    setTab("entry");
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this entry?")) setLogs(logs.filter(l => l.id !== id));
  };

  const sortedLogs = useMemo(() => [...logs].sort((a, b) => b.date.localeCompare(a.date)), [logs]);

  const inputStyle = {
    width: "100%", padding: "9px 12px", fontSize: 14,
    border: "1px solid #D3D1C7", borderRadius: 8,
    background: "var(--color-background-primary)",
    color: "var(--color-text-primary)", outline: "none", boxSizing: "border-box"
  };
  const labelStyle = { fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--color-text-secondary)", display: "block", marginBottom: 5 };

  const tabs = [
    { id: "entry", icon: "✏️", label: "Log Today" },
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "history", icon: "📋", label: "History" },
  ];

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", fontFamily: "system-ui, sans-serif", padding: "0 0 2rem" }}>
      {/* Header */}
      <div style={{ padding: "24px 0 0", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#1D9E75", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18 }}>⚡</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)" }}>Daily Grind Tracker</h1>
            <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>Track. Reflect. Ship.</p>
          </div>
          {stats.streak > 0 && (
            <div style={{ marginLeft: "auto", background: "#FAEEDA", color: "#854F0B", borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 700 }}>
              🔥 {stats.streak} day streak
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "var(--color-background-secondary)", borderRadius: 10, padding: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600,
            background: tab === t.id ? "var(--color-background-primary)" : "transparent",
            color: tab === t.id ? "var(--color-text-primary)" : "var(--color-text-secondary)",
            boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.15s"
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Entry Tab */}
      {tab === "entry" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Date</label>
              <input type="date" value={form.date} onChange={e => handleChange("date", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>DSA Questions Solved</label>
              <input type="number" min="0" placeholder="0" value={form.dsa_questions} onChange={e => handleChange("dsa_questions", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Core Subject</label>
              <select value={form.core_subject} onChange={e => handleChange("core_subject", e.target.value)} style={inputStyle}>
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Core Study Hours</label>
              <input type="number" min="0" max="24" step="0.5" placeholder="0" value={form.core_hours} onChange={e => handleChange("core_hours", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Development Hours</label>
              <input type="number" min="0" max="24" step="0.5" placeholder="0" value={form.development_hours} onChange={e => handleChange("development_hours", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Sleep Hours</label>
              <input type="number" min="0" max="24" step="0.5" placeholder="7" value={form.sleep_hours} onChange={e => handleChange("sleep_hours", e.target.value)} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Notes (optional)</label>
              <textarea rows={3} placeholder="What did you learn today? Any blockers?" value={form.notes} onChange={e => handleChange("notes", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
          </div>
          <button onClick={handleSubmit} style={{
            width: "100%", padding: "12px", background: "#1D9E75", color: "#fff",
            border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer"
          }}>
            {saved ? "✅ Saved!" : editId ? "Update Entry" : "Save Today's Entry →"}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setForm(defaultForm); }} style={{
              width: "100%", marginTop: 8, padding: "10px", background: "transparent",
              color: "var(--color-text-secondary)", border: "1px solid #D3D1C7",
              borderRadius: 10, fontSize: 14, cursor: "pointer"
            }}>Cancel Edit</button>
          )}
        </div>
      )}

      {/* Dashboard Tab */}
      {tab === "dashboard" && (
        <div>
          {logs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "var(--color-text-secondary)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <div style={{ fontWeight: 600 }}>No entries yet</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Start logging your daily grind!</div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
                <StatCard label="🔥 Current Streak" value={`${stats.streak}d`} sub="consecutive days" color="amber" />
                <StatCard label="🧠 Total DSA" value={stats.totalDSA} sub="questions solved" color="teal" />
                <StatCard label="📚 Core Hours" value={`${stats.totalCore}h`} sub="total studied" color="blue" />
                <StatCard label="💻 Dev Hours" value={`${stats.totalDev}h`} sub="total built" color="coral" />
                <StatCard label="😴 Avg Sleep" value={`${stats.avgSleep}h`} sub="per night" color="purple" />
              </div>

              {/* Last 7 days mini chart */}
              <div style={{ background: "var(--color-background-secondary)", borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 14 }}>Last 7 Days — DSA</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 60 }}>
                  {Array.from({ length: 7 }, (_, i) => {
                    const d = new Date(); d.setDate(d.getDate() - (6 - i));
                    const ds = d.toISOString().slice(0, 10);
                    const log = logs.find(l => l.date === ds);
                    const val = log ? +log.dsa_questions || 0 : 0;
                    const max = Math.max(...Array.from({ length: 7 }, (_, j) => {
                      const dd = new Date(); dd.setDate(dd.getDate() - (6 - j));
                      const ll = logs.find(l => l.date === dd.toISOString().slice(0, 10));
                      return ll ? +ll.dsa_questions || 0 : 0;
                    }), 1);
                    const h = Math.max((val / max) * 52, val > 0 ? 4 : 2);
                    return (
                      <div key={ds} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ fontSize: 10, color: "var(--color-text-secondary)", fontWeight: 600 }}>{val > 0 ? val : ""}</div>
                        <div style={{ width: "100%", height: `${h}px`, background: val > 0 ? "#1D9E75" : "#D3D1C7", borderRadius: 4, transition: "height 0.3s" }} />
                        <div style={{ fontSize: 9, color: "var(--color-text-secondary)" }}>{["Su","Mo","Tu","We","Th","Fr","Sa"][d.getDay()]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* History Tab */}
      {tab === "history" && (
        <div>
          {sortedLogs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "var(--color-text-secondary)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🗂️</div>
              <div style={{ fontWeight: 600 }}>No history yet</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {sortedLogs.map(log => (
                <div key={log.id} style={{
                  background: "var(--color-background-primary)", border: "1px solid #D3D1C7",
                  borderRadius: 12, padding: "14px 16px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--color-text-primary)" }}>
                      {new Date(log.date + "T12:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleEdit(log)} style={{ fontSize: 12, padding: "3px 10px", background: "#E6F1FB", color: "#185FA5", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>Edit</button>
                      <button onClick={() => handleDelete(log.id)} style={{ fontSize: 12, padding: "3px 10px", background: "#FCEBEB", color: "#A32D2D", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>Delete</button>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: log.notes ? 10 : 0 }}>
                    <Tag color="teal">🧠 {log.dsa_questions || 0} DSA</Tag>
                    <Tag color="amber">📚 {log.core_subject} · {log.core_hours || 0}h</Tag>
                    <Tag color="blue">💻 Dev {log.development_hours || 0}h</Tag>
                    <Tag color="teal">😴 Sleep {log.sleep_hours || 0}h</Tag>
                  </div>
                  {log.notes && (
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 6, fontStyle: "italic", borderTop: "1px solid #F1EFE8", paddingTop: 8 }}>
                      "{log.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
