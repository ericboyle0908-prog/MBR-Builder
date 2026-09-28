"use client";

import { useEffect, useMemo, useState } from "react";
import { loadSubmissions, resetSubmissions, saveSubmissions } from "@/lib/storage";
import { GeoSubmission, MbrStatus } from "@/lib/types";

const statusLabel: Record<MbrStatus, string> = {
  not_started: "Not started",
  draft: "Draft",
  submitted: "Submitted",
  approved: "Approved"
};

function delta(current: number, previous: number) {
  return current - previous;
}

function signed(n: number, suffix = "") {
  const rounded = Math.round(n * 100) / 100;
  return `${rounded > 0 ? "+" : ""}${rounded}${suffix}`;
}

function SummaryCards({ item }: { item: GeoSubmission }) {
  const aht = delta(item.current.aht, item.previous.aht);
  const hold = delta(item.current.hold, item.previous.hold);
  const qa = delta(item.current.qa, item.previous.qa);
  return (
    <div className="kpiGrid">
      <div className="kpiCard"><span>AHT</span><strong>{item.current.aht}s</strong><small className={aht <= 0 ? "good" : "bad"}>{signed(aht, "s")}</small></div>
      <div className="kpiCard"><span>Hold</span><strong>{item.current.hold.toFixed(2)}%</strong><small className={hold <= 0 ? "good" : "bad"}>{signed(hold, " pp")}</small></div>
      <div className="kpiCard"><span>QA</span><strong>{item.current.qa.toFixed(2)}%</strong><small className={qa >= 0 ? "good" : "bad"}>{signed(qa, " pp")}</small></div>
    </div>
  );
}

function NumberField({ label, value, onChange, step = 1 }: { label: string; value: number | undefined; onChange: (v: number) => void; step?: number }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="number" step={step} value={value ?? ""} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

export default function MbrHub() {
  const [items, setItems] = useState<GeoSubmission[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [month, setMonth] = useState("2026-09");

  useEffect(() => {
    const initial = loadSubmissions();
    setItems(initial);
    setSelectedId(initial[0]?.id ?? "");
  }, []);

  useEffect(() => {
    if (items.length) saveSubmissions(items);
  }, [items]);

  const visible = useMemo(() => items.filter((i) => i.month === month), [items, month]);
  const selected = items.find((i) => i.id === selectedId) ?? visible[0];

  function patch(next: Partial<GeoSubmission>) {
    if (!selected) return;
    setItems((all) => all.map((i) => i.id === selected.id ? { ...i, ...next, updatedAt: new Date().toISOString() } : i));
  }

  function patchNested<K extends keyof GeoSubmission>(key: K, value: GeoSubmission[K]) {
    patch({ [key]: value } as Partial<GeoSubmission>);
  }

  function autoDraft() {
    if (!selected) return;
    const a = selected.current.aht - selected.previous.aht;
    const h = selected.current.hold - selected.previous.hold;
    const q = selected.current.qa - selected.previous.qa;
    const text = `${selected.geoName} ${a <= 0 && h <= 0 && q >= 0 ? "improved across all three core KPIs" : "showed mixed core KPI movement"}: AHT ${a <= 0 ? "improved" : "increased"} by ${Math.abs(a)} sec, Hold ${h <= 0 ? "improved" : "increased"} by ${Math.abs(h).toFixed(2)} pp, and QA ${q >= 0 ? "improved" : "declined"} by ${Math.abs(q).toFixed(2)} pp.`;
    patchNested("narrative", { ...selected.narrative, performanceSummary: text });
  }

  async function exportDeck() {
    const response = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month, submissions: visible })
    });
    if (!response.ok) return alert("Deck export failed.");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MBR-${month}.pptx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!selected) return <main className="shell">Loading…</main>;

  return (
    <main className="appShell">
      <aside className="sidebar">
        <div className="brandBlock">
          <img src="/brand/purolator.png" alt="Purolator" />
          <div className="brandDivider" />
          <img src="/brand/cp360.png" alt="ContactPoint360" />
        </div>
        <h1>MBR Hub</h1>
        <p className="muted">Shared Monthly Business Review workspace</p>
        <label className="monthPicker">Reporting month<input type="month" value={month} onChange={(e) => setMonth(e.target.value)} /></label>
        <nav>
          {visible.map((geo) => (
            <button className={geo.id === selected.id ? "geoButton active" : "geoButton"} key={geo.id} onClick={() => setSelectedId(geo.id)}>
              <span>{geo.geoName}</span><small>{statusLabel[geo.status]}</small>
            </button>
          ))}
        </nav>
        <button className="exportButton" onClick={exportDeck}>Generate PowerPoint</button>
        <button className="ghostButton" onClick={() => { resetSubmissions(); location.reload(); }}>Reset demo data</button>
      </aside>

      <section className="content">
        <header className="topbar">
          <div><p className="eyebrow">{selected.geoName.toUpperCase()} PERFORMANCE</p><h2>Monthly operations dashboard</h2></div>
          <div className={`statusBadge ${selected.status}`}>{statusLabel[selected.status]}</div>
        </header>

        <SummaryCards item={selected} />

        <section className="panel">
          <div className="panelTitle"><div><p className="eyebrow">CORE PERFORMANCE</p><h3>Raw KPI input</h3></div><button className="smallButton" onClick={autoDraft}>Generate summary</button></div>
          <div className="twoCols">
            <div><h4>Previous month</h4><div className="formGrid">
              <NumberField label="AHT (sec)" value={selected.previous.aht} onChange={(v) => patchNested("previous", { ...selected.previous, aht: v })} />
              <NumberField label="Hold %" step={0.01} value={selected.previous.hold} onChange={(v) => patchNested("previous", { ...selected.previous, hold: v })} />
              <NumberField label="QA %" step={0.01} value={selected.previous.qa} onChange={(v) => patchNested("previous", { ...selected.previous, qa: v })} />
            </div></div>
            <div><h4>Current month</h4><div className="formGrid">
              <NumberField label="AHT (sec)" value={selected.current.aht} onChange={(v) => patchNested("current", { ...selected.current, aht: v })} />
              <NumberField label="Hold %" step={0.01} value={selected.current.hold} onChange={(v) => patchNested("current", { ...selected.current, hold: v })} />
              <NumberField label="QA %" step={0.01} value={selected.current.qa} onChange={(v) => patchNested("current", { ...selected.current, qa: v })} />
            </div></div>
          </div>
        </section>

        <section className="panel">
          <p className="eyebrow">PEOPLE</p><h3>Attendance & workforce</h3>
          <div className="formGrid four">
            <NumberField label="Attrition" value={selected.people.attrition} onChange={(v) => patchNested("people", { ...selected.people, attrition: v })} />
            <NumberField label="Absences" value={selected.people.absences} onChange={(v) => patchNested("people", { ...selected.people, absences: v })} />
            <NumberField label="Attendance %" step={0.01} value={selected.people.attendance} onChange={(v) => patchNested("people", { ...selected.people, attendance: v })} />
            <NumberField label="Productive HC" step={0.01} value={selected.people.productiveHc} onChange={(v) => patchNested("people", { ...selected.people, productiveHc: v })} />
          </div>
        </section>

        {selected.digital && (
          <section className="panel digitalPanel">
            <p className="eyebrow">DIGITAL</p><h3>Chat performance</h3>
            <div className="twoCols">
              <div><h4>Previous month</h4><div className="formGrid">
                <NumberField label="Chat AHT" value={selected.digital.previous.aht} onChange={(v) => patchNested("digital", { ...selected.digital!, previous: { ...selected.digital!.previous, aht: v } })} />
                <NumberField label="Average hours" step={0.01} value={selected.digital.previous.averageHours} onChange={(v) => patchNested("digital", { ...selected.digital!, previous: { ...selected.digital!.previous, averageHours: v } })} />
                <NumberField label="Chats engaged" value={selected.digital.previous.chatsEngaged} onChange={(v) => patchNested("digital", { ...selected.digital!, previous: { ...selected.digital!.previous, chatsEngaged: v } })} />
                <NumberField label="CPH" step={0.01} value={selected.digital.previous.cph} onChange={(v) => patchNested("digital", { ...selected.digital!, previous: { ...selected.digital!.previous, cph: v } })} />
              </div></div>
              <div><h4>Current month</h4><div className="formGrid">
                <NumberField label="Chat AHT" value={selected.digital.current.aht} onChange={(v) => patchNested("digital", { ...selected.digital!, current: { ...selected.digital!.current, aht: v } })} />
                <NumberField label="Average hours" step={0.01} value={selected.digital.current.averageHours} onChange={(v) => patchNested("digital", { ...selected.digital!, current: { ...selected.digital!.current, averageHours: v } })} />
                <NumberField label="Chats engaged" value={selected.digital.current.chatsEngaged} onChange={(v) => patchNested("digital", { ...selected.digital!, current: { ...selected.digital!.current, chatsEngaged: v } })} />
                <NumberField label="CPH" step={0.01} value={selected.digital.current.cph} onChange={(v) => patchNested("digital", { ...selected.digital!, current: { ...selected.digital!.current, cph: v } })} />
              </div></div>
            </div>
          </section>
        )}

        <section className="panel">
          <p className="eyebrow">COMMENTARY</p><h3>MBR bullet points</h3>
          <div className="textGrid">
            {([
              ["performanceSummary", "Performance summary"],
              ["keyHighlights", "Key highlights"],
              ["actionItems", "Action items"],
              ["roadmap", "Next month roadmap"],
              ["recognition", "Employee recognition"]
            ] as const).map(([key, label]) => (
              <label className="field textField" key={key}><span>{label}</span><textarea rows={4} value={selected.narrative[key]} onChange={(e) => patchNested("narrative", { ...selected.narrative, [key]: e.target.value })} /></label>
            ))}
          </div>
        </section>

        <section className="panel workflow">
          <div><p className="eyebrow">WORKFLOW</p><h3>Submission status</h3><p className="muted">Geo POCs can save drafts and submit. An MBR owner can approve after review.</p></div>
          <select value={selected.status} onChange={(e) => patch({ status: e.target.value as MbrStatus })}>
            <option value="not_started">Not started</option><option value="draft">Draft</option><option value="submitted">Submitted</option><option value="approved">Approved</option>
          </select>
        </section>
      </section>
    </main>
  );
}
