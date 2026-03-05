"use client";

import { useState, useEffect, useCallback } from "react";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  borough: string;
  preferred_date: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

type Application = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  borough: string;
  instagram: string | null;
  experience: string | null;
  availability: string | null;
  message: string | null;
  resume_url: string | null;
  video_url: string | null;
  status: string;
  created_at: string;
};

const leadStatuses = ["new", "contacted", "booked", "cancelled"];
const appStatuses = ["new", "reviewed", "interview", "hired", "rejected"];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"leads" | "applications">("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async (pw: string, currentTab: "leads" | "applications") => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin?pw=${encodeURIComponent(pw)}&tab=${currentTab}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to fetch");
        setAuthed(false);
        return;
      }
      setAuthed(true);
      if (currentTab === "leads") setLeads(json.data);
      else setApplications(json.data);
    } catch {
      setError("Network error");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchData(password, tab);
  }, [tab, authed, password, fetchData]);

  async function updateStatus(id: string, table: string, newStatus: string) {
    await fetch(`/api/admin?pw=${encodeURIComponent(password)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, table, status: newStatus }),
    });
    fetchData(password, tab);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    fetchData(password, tab);
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-xl border bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-center font-display text-2xl font-bold">Admin Login</h1>
          {error && <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-4 w-full rounded-lg border px-3 py-2.5 text-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
          <button type="submit" className="w-full rounded-full bg-charcoal py-2.5 text-sm font-semibold text-white">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setTab("leads")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === "leads" ? "bg-blush text-white" : "bg-white text-gray-600 border"
              }`}
            >
              Booking Requests
            </button>
            <button
              onClick={() => setTab("applications")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === "applications" ? "bg-purple-600 text-white" : "bg-white text-gray-600 border"
              }`}
            >
              Job Applications
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : tab === "leads" ? (
          <LeadsTable leads={leads} onStatusChange={(id, status) => updateStatus(id, "leads", status)} />
        ) : (
          <ApplicationsTable apps={applications} onStatusChange={(id, status) => updateStatus(id, "applications", status)} />
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    booked: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-500",
    reviewed: "bg-yellow-100 text-yellow-700",
    interview: "bg-purple-100 text-purple-700",
    hired: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-600",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function LeadsTable({ leads, onStatusChange }: { leads: Lead[]; onStatusChange: (id: string, status: string) => void }) {
  if (leads.length === 0) return <p className="text-center text-gray-400">No booking requests yet.</p>;

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Contact</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Service</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Borough</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Pref. Date</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-xs text-gray-500">{formatDate(lead.created_at)}</td>
              <td className="px-4 py-3 font-medium">{lead.name}</td>
              <td className="px-4 py-3">
                <div className="text-xs">{lead.email}</div>
                <div className="text-xs text-gray-500">{lead.phone}</div>
              </td>
              <td className="px-4 py-3">{lead.service}</td>
              <td className="px-4 py-3">{lead.borough}</td>
              <td className="px-4 py-3 text-xs">{lead.preferred_date || "—"}</td>
              <td className="px-4 py-3">
                <select
                  value={lead.status}
                  onChange={(e) => onStatusChange(lead.id, e.target.value)}
                  className="rounded border px-2 py-1 text-xs"
                >
                  {leadStatuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ApplicationsTable({ apps, onStatusChange }: { apps: Application[]; onStatusChange: (id: string, status: string) => void }) {
  if (apps.length === 0) return <p className="text-center text-gray-400">No applications yet.</p>;

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Contact</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Specialty</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Borough</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Experience</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Files</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {apps.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-xs text-gray-500">{formatDate(app.created_at)}</td>
              <td className="px-4 py-3">
                <div className="font-medium">{app.name}</div>
                {app.instagram && <div className="text-xs text-purple-600">@{app.instagram}</div>}
              </td>
              <td className="px-4 py-3">
                <div className="text-xs">{app.email}</div>
                <div className="text-xs text-gray-500">{app.phone}</div>
              </td>
              <td className="px-4 py-3">{app.specialty}</td>
              <td className="px-4 py-3">{app.borough}</td>
              <td className="px-4 py-3 text-xs">{app.experience || "—"}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  {app.resume_url && (
                    <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">
                      Resume
                    </a>
                  )}
                  {app.video_url && (
                    <a href={app.video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 underline">
                      Video
                    </a>
                  )}
                  {!app.resume_url && !app.video_url && <span className="text-xs text-gray-400">—</span>}
                </div>
              </td>
              <td className="px-4 py-3">
                <select
                  value={app.status}
                  onChange={(e) => onStatusChange(app.id, e.target.value)}
                  className="rounded border px-2 py-1 text-xs"
                >
                  {appStatuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
