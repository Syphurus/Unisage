"use client";

import { useMemo, useState } from "react";

type Entry = { id: number; name: string; email: string; createdAt: string };

export default function WaitlistViewer({
  initialEntries,
}: {
  initialEntries: Entry[];
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return initialEntries;
    return initialEntries.filter(
      (e) =>
        e.name.toLowerCase().includes(s) || e.email.toLowerCase().includes(s)
    );
  }, [q, initialEntries]);

  return (
    <div style={{ padding: "1rem 0" }}>
      <div style={{ marginBottom: "0.75rem" }}>
        <input
          autoFocus
          placeholder="Type to search name or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: "0.6rem 0.8rem", width: 420 }}
        />
        <span style={{ marginLeft: 12, color: "#556" }}>
          {filtered.length} results
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id}>
                <td style={td}>{e.id}</td>
                <td style={td}>{e.name}</td>
                <td style={td}>{e.email}</td>
                <td style={td}>{new Date(e.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "0.6rem 0.75rem",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
  color: "#223",
};

const td: React.CSSProperties = {
  padding: "0.6rem 0.75rem",
  borderBottom: "1px solid rgba(0,0,0,0.04)",
};
