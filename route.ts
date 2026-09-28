import { NextRequest } from "next/server";
import PptxGenJS from "pptxgenjs";
import path from "node:path";
import { GeoSubmission } from "@/lib/types";

export const runtime = "nodejs";

const C = { red: "ED1C24", navy: "003B7A", blue: "008FD3", teal: "14B8C8", green: "16A34A", ink: "0F172A", muted: "60758A", line: "D4E2EE", white: "FFFFFF", bg: "FDFDFF" };
const W = 13.333, H = 7.5;

function addBrand(slide: any) {
  slide.addImage({ path: path.resolve("public/brand/purolator.png"), x: .35, y: .18, w: 2.45, h: .55, transparency: 0 });
  slide.addText("in partnership with", { x: .36, y: .77, w: 1.15, h: .2, fontSize: 7.5, color: C.muted });
  slide.addImage({ path: path.resolve("public/brand/cp360.png"), x: 1.46, y: .71, w: 1.25, h: .38 });
}

function metricCard(slide: any, x: number, y: number, label: string, value: string, delta: string, good: boolean) {
  slide.addShape("roundRect", { x, y, w: 1.75, h: 1.12, rectRadius: .08, fill: { color: C.white }, line: { color: C.line, width: .8 } });
  slide.addText(label, { x: x+.14, y: y+.13, w: 1.4, h: .18, fontSize: 8.5, bold: true, color: C.muted });
  slide.addText(value, { x: x+.14, y: y+.37, w: 1.45, h: .35, fontSize: 21, bold: true, color: C.navy });
  slide.addText(delta, { x: x+.14, y: y+.81, w: 1.45, h: .2, fontSize: 8.5, bold: true, color: good ? C.green : C.red });
}

function textCard(slide: any, x: number, y: number, w: number, h: number, title: string, text: string, accent: string) {
  slide.addShape("roundRect", { x, y, w, h, rectRadius: .06, fill: { color: C.white }, line: { color: C.line, width: .7 } });
  slide.addShape("rect", { x, y, w: .05, h, fill: { color: accent }, line: { color: accent } });
  slide.addText(title, { x: x+.18, y: y+.13, w: w-.3, h: .2, fontSize: 8.5, bold: true, color: C.navy });
  slide.addText(text || "—", { x: x+.18, y: y+.38, w: w-.3, h: h-.48, fontSize: 8.4, color: C.ink, valign: "top", breakLine: false, margin: 0.01 });
}

function addGeoSlide(pptx: PptxGenJS, item: GeoSubmission, monthLabel: string) {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  addBrand(slide);
  slide.addText(`${item.geoName.toUpperCase()} PERFORMANCE`, { x: .38, y: 1.18, w: 4.4, h: .35, fontSize: 19, bold: true, color: C.navy });
  slide.addText("Monthly operations dashboard", { x: .38, y: 1.52, w: 3.4, h: .22, fontSize: 9, color: C.muted });
  slide.addText(monthLabel.toUpperCase(), { x: 11.3, y: 1.22, w: 1.5, h: .25, fontSize: 11, bold: true, color: C.blue, align: "right" });
  slide.addText("Strong people. Great service. Moving forward.", { x: 9.05, y: 1.55, w: 3.75, h: .2, fontSize: 8.5, italic: true, color: C.muted, align: "right" });

  const a = item.current.aht - item.previous.aht;
  const h = item.current.hold - item.previous.hold;
  const q = item.current.qa - item.previous.qa;
  metricCard(slide, .4, 2.02, "AHT", `${item.current.aht} sec`, `${a>0?"+":""}${a} sec`, a <= 0);
  metricCard(slide, 2.32, 2.02, "Hold", `${item.current.hold.toFixed(2)}%`, `${h>0?"+":""}${h.toFixed(2)} pp`, h <= 0);
  metricCard(slide, 4.24, 2.02, "QA", `${item.current.qa.toFixed(2)}%`, `${q>0?"+":""}${q.toFixed(2)} pp`, q >= 0);

  slide.addText("PEOPLE", { x: 6.35, y: 2.02, w: 1.2, h: .2, fontSize: 8.5, bold: true, color: C.navy });
  slide.addShape("roundRect", { x: 6.35, y: 2.31, w: 2.65, h: .84, rectRadius: .05, fill: { color: C.white }, line: { color: C.line } });
  slide.addText(`Attrition\n${item.people.attrition}`, { x: 6.58, y: 2.48, w: .8, h: .48, fontSize: 9.5, bold: true, color: C.ink, breakLine: false, align: "center" });
  slide.addText(`Absences\n${item.people.absences}`, { x: 7.68, y: 2.48, w: .9, h: .48, fontSize: 9.5, bold: true, color: C.ink, breakLine: false, align: "center" });

  textCard(slide, .4, 3.45, 4.15, 1.2, "Core Performance", item.narrative.performanceSummary, C.green);
  textCard(slide, 4.75, 3.45, 4.05, 1.2, "Key Highlights", item.narrative.keyHighlights, "F4B400");
  textCard(slide, 9.0, 3.45, 3.92, 1.2, "Employee Recognition", item.narrative.recognition, C.red);
  textCard(slide, .4, 4.86, 6.05, 1.38, "Action Items", item.narrative.actionItems, C.red);
  textCard(slide, 6.65, 4.86, 6.27, 1.38, "Next Month Roadmap", item.narrative.roadmap, C.blue);

  if (item.digital) {
    slide.addShape("roundRect", { x: .4, y: 6.45, w: 12.52, h: .65, rectRadius: .04, fill: { color: "F3F9FC" }, line: { color: C.line } });
    const pv = item.digital.previous, cv = item.digital.current;
    slide.addText("DIGITAL / CHAT", { x: .58, y: 6.61, w: 1.25, h: .18, fontSize: 8, bold: true, color: C.blue });
    slide.addText(`AHT ${pv.aht ?? "—"} → ${cv.aht ?? "—"} sec    |    Avg hours ${pv.averageHours ?? "—"} → ${cv.averageHours ?? "—"}    |    Chats ${pv.chatsEngaged ?? "—"} → ${cv.chatsEngaged ?? "—"}    |    CPH ${pv.cph ?? "—"} → ${cv.cph ?? "—"}`, { x: 1.82, y: 6.58, w: 10.75, h: .22, fontSize: 8.2, color: C.ink });
  }
  slide.addText("Confidential | Prepared by ContactPoint360", { x: .4, y: 7.18, w: 3.1, h: .13, fontSize: 6.7, color: C.muted });
}

export async function POST(req: NextRequest) {
  const body = await req.json() as { month: string; submissions: GeoSubmission[] };
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "MBR Hub";
  pptx.company = "ContactPoint360";
  pptx.subject = "Monthly Business Review";
  pptx.title = `MBR ${body.month}`;
  pptx.lang = "en-CA";
  pptx.theme = { headFontFace: "Plus Jakarta Sans", bodyFontFace: "DejaVu Sans", lang: "en-CA" } as any;

  const cover = pptx.addSlide();
  cover.background = { color: C.bg };
  cover.addImage({ path: path.resolve("public/brand/deck-cover-reference.png"), x: 0, y: 0, w: W, h: H });
  cover.addText(new Date(`${body.month}-01T00:00:00`).toLocaleDateString("en-CA", { month: "long", year: "numeric" }), { x: .72, y: .38, w: 2.7, h: .22, fontSize: 10, color: C.muted });

  const monthLabel = new Date(`${body.month}-01T00:00:00`).toLocaleDateString("en-CA", { month: "long" });
  for (const item of body.submissions) addGeoSlide(pptx, item, monthLabel);

  const end = pptx.addSlide();
  end.background = { color: C.bg };
  end.addImage({ path: path.resolve("public/brand/purolator.png"), x: .35, y: .25, w: 2.4, h: .55 });
  end.addImage({ path: path.resolve("public/brand/cp360.png"), x: 10.6, y: .24, w: 1.75, h: .52 });
  end.addText("Q&A", { x: 4.2, y: 2.5, w: 4.9, h: 1.0, fontSize: 54, bold: true, color: C.navy, align: "center" });
  end.addText("Thank you", { x: 4.2, y: 3.65, w: 4.9, h: .45, fontSize: 23, color: C.blue, align: "center" });

  const out = await pptx.write({ outputType: "nodebuffer" } as any) as Buffer;
  return new Response(out, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": `attachment; filename="MBR-${body.month}.pptx"`
    }
  });
}
