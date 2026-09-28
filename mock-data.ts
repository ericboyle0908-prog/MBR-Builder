import { GeoSubmission } from "./types";

export const seedSubmissions: GeoSubmission[] = [
  {
    id: "montreal-2026-09",
    geoId: "montreal",
    geoName: "Montreal",
    owner: "Montreal POC",
    month: "2026-09",
    status: "draft",
    previous: { aht: 327, hold: 9.25, qa: 99.12 },
    current: { aht: 303, hold: 5.15, qa: 99.3 },
    people: { attrition: 2, absences: 11 },
    narrative: {
      performanceSummary: "Performance improved across all three core KPIs.",
      keyHighlights: "Targeted 1-on-1 coaching and continuous follow-ups improved efficiency and hold performance.",
      actionItems: "Deploy targeted refresher modules for bottom-quartile agents and standardize call handling.",
      roadmap: "Roll out advanced coaching frameworks and tighter QA feedback loops.",
      recognition: "Add employee recognition notes or upload a recognition image for this month."
    },
    updatedAt: new Date().toISOString()
  },
  {
    id: "cebu-2026-09",
    geoId: "cebu",
    geoName: "Cebu",
    owner: "Cebu POC",
    month: "2026-09",
    status: "draft",
    previous: { aht: 346, hold: 6.11, qa: 96.64 },
    current: { aht: 340, hold: 5.15, qa: 97.03 },
    people: { attrition: 3, absences: 57 },
    digital: {
      previous: { aht: 222, averageHours: 6.86, chatsEngaged: 7724, cph: 14.11 },
      current: { aht: 285, averageHours: 6.85, chatsEngaged: 10173, cph: 12.4 }
    },
    narrative: {
      performanceSummary: "Core performance improved, while the digital workload increased materially.",
      keyHighlights: "Recognize top performers and sustain quality gains while reviewing chat workload.",
      actionItems: "Review chat handling efficiency and coach to workload management opportunities.",
      roadmap: "Continue KPI coaching and add targeted digital performance reviews.",
      recognition: "July and August top performers were recognized for consistent results."
    },
    updatedAt: new Date().toISOString()
  },
  {
    id: "cairo-2026-09",
    geoId: "cairo",
    geoName: "Cairo",
    owner: "Cairo POC",
    month: "2026-09",
    status: "not_started",
    previous: { aht: 324, hold: 7.3, qa: 96.85 },
    current: { aht: 301, hold: 4.9, qa: 98.7 },
    people: { attrition: 2, absences: 12 },
    narrative: {
      performanceSummary: "Targeted coaching and knowledge sharing improved all three core metrics.",
      keyHighlights: "Focused coaching sessions strengthened efficiency, hold control, and QA.",
      actionItems: "Run small-group reviews of complex call scenarios and process changes.",
      roadmap: "Continue focused coaching and productivity initiatives to sustain gains.",
      recognition: "Add agent recognition details for the current month."
    },
    updatedAt: new Date().toISOString()
  }
];
