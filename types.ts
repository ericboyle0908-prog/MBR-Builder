export type GeoId = "montreal" | "cebu" | "cairo" | string;
export type MbrStatus = "not_started" | "draft" | "submitted" | "approved";

export type CoreKpis = {
  aht: number;
  hold: number;
  qa: number;
};

export type PeopleMetrics = {
  attrition: number;
  absences: number;
  attendance?: number;
  productiveHc?: number;
  trainingHc?: number;
};

export type DigitalMetrics = {
  aht?: number;
  averageHours?: number;
  chatsEngaged?: number;
  cph?: number;
};

export type Narrative = {
  performanceSummary: string;
  keyHighlights: string;
  actionItems: string;
  roadmap: string;
  recognition: string;
};

export type GeoSubmission = {
  id: string;
  geoId: GeoId;
  geoName: string;
  owner: string;
  month: string;
  status: MbrStatus;
  previous: CoreKpis;
  current: CoreKpis;
  people: PeopleMetrics;
  digital?: {
    previous: DigitalMetrics;
    current: DigitalMetrics;
  };
  narrative: Narrative;
  updatedAt: string;
};
