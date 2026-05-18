const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

const repo = "/Users/ansoncordeiro/dev/builtbykiefer";
const output = path.join(repo, "docs/kiefer-built-vs-buildertrend-comparison.pptx");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Nexgen Studio";
pptx.company = "Kiefer Built Contracting";
pptx.subject = "Kiefer Built Operations Platform vs. Buildertrend";
pptx.title = "Kiefer Built Operations Platform vs. Buildertrend";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "en-US",
};
pptx.defineLayout({ name: "LAYOUT_WIDE", width: 13.333, height: 7.5 });

const C = {
  black: "151515",
  ink: "171717",
  red: "C9281C",
  redDark: "941D14",
  sand: "F4EFE7",
  sand2: "F9F6F0",
  gray: "655C52",
  line: "E0D8CE",
  white: "FFFFFF",
  green: "118246",
  amber: "A65F00",
};

const img = {
  logo: path.join(repo, "public/images/kiefer-k-logo.png"),
  hero: path.join(repo, "public/images/project-3/exterior-twilight-front.jpg"),
  home: path.join(repo, "public/images/project-1/exterior-1.jpg"),
  commercial: path.join(repo, "public/images/kiefer-commercial-agfinity.jpg"),
};

function addBg(slide, fill = C.sand) {
  slide.background = { color: fill };
}

function addHeader(slide, eyebrow = "KIEFER BUILT OPERATIONS PLATFORM") {
  slide.addImage({ path: img.logo, x: 0.42, y: 0.28, w: 0.34, h: 0.22 });
  slide.addText(eyebrow, {
    x: 0.85,
    y: 0.23,
    w: 6.3,
    h: 0.35,
    fontFace: "Aptos",
    fontSize: 8.5,
    bold: true,
    color: C.gray,
    charSpace: 1.8,
    margin: 0,
  });
  slide.addShape(pptx.ShapeType.line, {
    x: 0.42,
    y: 0.72,
    w: 12.5,
    h: 0,
    line: { color: C.line, width: 0.7 },
  });
}

function title(slide, text, opts = {}) {
  slide.addText(text, {
    x: opts.x ?? 0.55,
    y: opts.y ?? 1.0,
    w: opts.w ?? 7.7,
    h: opts.h ?? 1.05,
    fontFace: "Aptos Display",
    fontSize: opts.size ?? 30,
    bold: true,
    color: opts.color ?? C.ink,
    breakLine: false,
    fit: "shrink",
    margin: 0,
  });
}

function body(slide, text, opts = {}) {
  slide.addText(text, {
    x: opts.x ?? 0.55,
    y: opts.y ?? 2.05,
    w: opts.w ?? 5.5,
    h: opts.h ?? 0.9,
    fontFace: "Aptos",
    fontSize: opts.size ?? 15,
    color: opts.color ?? C.gray,
    fit: "shrink",
    breakLine: false,
    valign: "top",
    margin: 0,
    paraSpaceAfterPt: 8,
  });
}

function pill(slide, text, x, y, w, color = C.red, fill = "FCEBE8") {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.34,
    rectRadius: 0.06,
    fill: { color: fill },
    line: { color, transparency: 55 },
  });
  slide.addText(text, {
    x: x + 0.12,
    y: y + 0.075,
    w: w - 0.24,
    h: 0.16,
    fontSize: 7.5,
    bold: true,
    charSpace: 1.4,
    color,
    align: "center",
    margin: 0,
    fit: "shrink",
  });
}

function footer(slide, index) {
  slide.addText(`Kiefer Built comparison | ${String(index).padStart(2, "0")}`, {
    x: 10.75,
    y: 7.12,
    w: 2.1,
    h: 0.18,
    fontSize: 7,
    color: "8A8176",
    align: "right",
    margin: 0,
  });
}

function addImageCover(slide, imagePath, x, y, w, h, transparency = 0) {
  if (!fs.existsSync(imagePath)) return;
  slide.addImage({ path: imagePath, x, y, w, h, transparency });
}

function statCard(slide, value, label, x, y, w = 2.05, h = 1.05) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.06,
    fill: { color: C.white },
    line: { color: C.line, width: 0.6 },
  });
  slide.addText(value, { x: x + 0.18, y: y + 0.16, w: w - 0.36, h: 0.36, fontSize: 23, bold: true, color: C.red, margin: 0, fit: "shrink" });
  slide.addText(label, { x: x + 0.18, y: y + 0.61, w: w - 0.36, h: 0.25, fontSize: 7.5, bold: true, color: C.gray, charSpace: 1.1, margin: 0, fit: "shrink" });
}

function twoColumnCompare(slide, leftTitle, leftBullets, rightTitle, rightBullets, y = 1.58) {
  const cols = [
    { x: 0.7, title: leftTitle, bullets: leftBullets, accent: C.red },
    { x: 6.85, title: rightTitle, bullets: rightBullets, accent: "2A2A2A" },
  ];
  for (const col of cols) {
    slide.addShape(pptx.ShapeType.roundRect, { x: col.x, y, w: 5.75, h: 4.95, rectRadius: 0.05, fill: { color: C.white }, line: { color: C.line, width: 0.7 } });
    slide.addShape(pptx.ShapeType.rect, { x: col.x, y, w: 5.75, h: 0.12, fill: { color: col.accent }, line: { color: col.accent } });
    slide.addText(col.title, { x: col.x + 0.34, y: y + 0.35, w: 5.05, h: 0.36, fontSize: 18, bold: true, color: C.ink, margin: 0 });
    col.bullets.forEach((b, i) => {
      slide.addShape(pptx.ShapeType.ellipse, { x: col.x + 0.36, y: y + 1.05 + i * 0.67, w: 0.11, h: 0.11, fill: { color: col.accent }, line: { color: col.accent } });
      slide.addText(b, { x: col.x + 0.58, y: y + 0.96 + i * 0.67, w: 4.72, h: 0.34, fontSize: 11, color: C.gray, margin: 0, fit: "shrink" });
    });
  }
}

function table(slide, rows, x, y, w, h, colW) {
  const rowH = h / rows.length;
  rows.forEach((r, i) => {
    const fill = i === 0 ? C.black : i % 2 === 0 ? C.white : C.sand2;
    const color = i === 0 ? C.white : C.ink;
    let cx = x;
    r.forEach((cell, j) => {
      slide.addShape(pptx.ShapeType.rect, { x: cx, y: y + i * rowH, w: colW[j], h: rowH, fill: { color: fill }, line: { color: C.line, width: 0.45 } });
      slide.addText(cell, {
        x: cx + 0.08,
        y: y + i * rowH + 0.08,
        w: colW[j] - 0.16,
        h: rowH - 0.14,
        fontSize: i === 0 ? 8.2 : 7.4,
        bold: i === 0 || j === 0,
        color,
        valign: "mid",
        fit: "shrink",
        margin: 0,
      });
      cx += colW[j];
    });
  });
}

// 1
{
  const s = pptx.addSlide();
  s.background = { color: C.black };
  addImageCover(s, img.hero, 0, 0, 13.333, 7.5, 28);
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: "000000", transparency: 28 }, line: { color: "000000", transparency: 100 } });
  s.addImage({ path: img.logo, x: 0.65, y: 0.52, w: 0.48, h: 0.32 });
  s.addText("KIEFER BUILT CONTRACTING", { x: 1.25, y: 0.5, w: 4.8, h: 0.28, fontSize: 14, bold: true, color: C.white, charSpace: 1.2, margin: 0 });
  s.addText("OPERATIONS PLATFORM", { x: 1.25, y: 0.84, w: 3.5, h: 0.18, fontSize: 7.5, color: "D8D1C8", charSpace: 2.4, margin: 0 });
  s.addText("A Kiefer-owned alternative to Buildertrend.", { x: 0.65, y: 2.25, w: 7.1, h: 1.1, fontSize: 38, bold: true, color: C.white, fit: "shrink", margin: 0 });
  s.addText("Built around Kiefer's brand, workflow, client portal, finance checks, and construction operations.", { x: 0.67, y: 3.62, w: 6.25, h: 0.56, fontSize: 16, color: "E7E0D6", fit: "shrink", margin: 0 });
  pill(s, "MEETING DECK", 0.67, 4.55, 1.45, C.red, "FCEBE8");
  pill(s, "MAY 2026", 2.28, 4.55, 1.25, C.white, "2A2A2A");
}

// 2
{
  const s = pptx.addSlide(); addBg(s); addHeader(s); footer(s, 2);
  title(s, "The point is not to clone Buildertrend. It is to replace dependency with ownership.", { w: 8.9, h: 1.1 });
  body(s, "Buildertrend is broad and mature. Kiefer's advantage is a branded platform that can be shaped around the way its managers, clients, vendors, and accountants actually work.", { y: 2.12, w: 7.35, h: 0.72 });
  statCard(s, "Owned", "BRAND EXPERIENCE", 0.7, 3.3);
  statCard(s, "Direct", "WEBSITE TO CRM", 3.05, 3.3);
  statCard(s, "Tailored", "FINANCE + REPORTING", 5.4, 3.3);
  statCard(s, "Familiar", "BUILDER MODULES", 7.75, 3.3);
  statCard(s, "Expandable", "CUSTOM ROADMAP", 10.1, 3.3);
  s.addShape(pptx.ShapeType.roundRect, { x: 0.7, y: 5.25, w: 11.82, h: 0.82, rectRadius: 0.06, fill: { color: C.black }, line: { color: C.black } });
  s.addText("Meeting thesis: keep the familiar construction software structure, but make the experience unmistakably Kiefer Built.", { x: 1.0, y: 5.52, w: 11.2, h: 0.28, fontSize: 15, bold: true, color: C.white, margin: 0, fit: "shrink" });
}

// 3
{
  const s = pptx.addSlide(); addBg(s); addHeader(s, "EXECUTIVE COMPARISON"); footer(s, 3);
  title(s, "At-a-glance comparison", { y: 0.98, h: 0.52 });
  table(s, [
    ["Area", "Kiefer Built Platform", "Buildertrend"],
    ["Ownership", "Kiefer-owned brand and roadmap", "Third-party SaaS product"],
    ["Client experience", "Kiefer-branded portal and approvals", "Mature customer portal"],
    ["Sales intake", "Website form saves into CRM leads", "Lead management, integration needed"],
    ["Finance", "Custom planning checks + reports", "Broader financial modules"],
    ["Maturity", "Strong custom foundation", "Mature platform and mobile app"],
    ["Best fit", "Owned workflows and differentiation", "Broad ready-made system"],
  ], 0.72, 1.82, 11.92, 4.9, [1.9, 5.0, 5.02]);
}

// 4
{
  const s = pptx.addSlide(); addBg(s, C.black); footer(s, 4);
  addImageCover(s, img.home, 0, 0, 13.333, 7.5, 35);
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: "000000", transparency: 25 }, line: { color: "000000", transparency: 100 } });
  s.addImage({ path: img.logo, x: 0.62, y: 0.44, w: 0.42, h: 0.28 });
  s.addText("WHERE BUILDERTRAND IS STRONGER TODAY", { x: 1.15, y: 0.48, w: 4.6, h: 0.22, fontSize: 8.5, bold: true, color: "D8D1C8", charSpace: 1.6, margin: 0 });
  title(s, "Buildertrend sets the maturity bar.", { y: 1.15, w: 6.3, h: 0.75, color: C.white, size: 30 });
  const strengths = [
    ["Native mobile app", "Field workflows, photos, checklists, and app-based client communication are more mature."],
    ["Payments + accounting integrations", "Buildertrend has established payment processing and accounting connections."],
    ["Takeoff / estimating depth", "Broader estimating, bids, and takeoff capabilities exist out of the box."],
    ["Support infrastructure", "SaaS onboarding, training, help center, and support teams are already in place."],
  ];
  strengths.forEach((r, i) => {
    const y = 2.36 + i * 0.82;
    s.addShape(pptx.ShapeType.roundRect, { x: 0.72, y, w: 5.75, h: 0.62, rectRadius: 0.05, fill: { color: "FFFFFF", transparency: 8 }, line: { color: "FFFFFF", transparency: 88 } });
    s.addText(r[0], { x: 0.98, y: y + 0.13, w: 1.9, h: 0.18, fontSize: 11, bold: true, color: C.white, margin: 0, fit: "shrink" });
    s.addText(r[1], { x: 2.8, y: y + 0.1, w: 3.25, h: 0.28, fontSize: 8.5, color: "DED8CF", margin: 0, fit: "shrink" });
  });
}

// 5
{
  const s = pptx.addSlide(); addBg(s); addHeader(s, "WHERE KIEFER WINS"); footer(s, 5);
  title(s, "Kiefer's advantage is control.", { w: 6.5, h: 0.6 });
  body(s, "The custom platform can be shaped around the company, not the other way around.", { y: 1.72, w: 5.6, h: 0.4 });
  twoColumnCompare(
    s,
    "Kiefer-owned strengths",
    [
      "Client and vendor portals show Kiefer's brand",
      "Website quote form creates CRM leads",
      "Finance tools match Kiefer's decision flow",
      "Reports can change as management questions change",
      "Roadmap is controlled by Kiefer's priorities",
    ],
    "Buildertrend trade-off",
    [
      "Strong platform, but the experience is still Buildertrend",
      "Website intake depends on setup or integration",
      "Reports and modules follow SaaS product limits",
      "Feature changes depend on vendor roadmap",
      "Subscription model continues indefinitely",
    ],
    2.22,
  );
}

// 6
{
  const s = pptx.addSlide(); addBg(s); addHeader(s, "FEATURE COVERAGE"); footer(s, 6);
  title(s, "Core replacement path is already visible.", { w: 7.5, h: 0.55 });
  table(s, [
    ["Workflow", "Kiefer status", "Buildertrend status", "Readout"],
    ["Leads + proposals", "Built", "Mature", "Kiefer has direct website intake advantage"],
    ["Projects + schedule", "Built", "Mature", "Buildertrend stronger for Gantt/mobile today"],
    ["Daily logs + RFIs", "Built", "Mature", "Comparable core workflow"],
    ["Selections + COs", "Built", "Mature", "Client approvals already in portal"],
    ["Files + photos", "Built", "Mature", "Kiefer has branded gallery; mobile annotation later"],
    ["Vendor portal", "Built foundation", "Mature", "Kiefer-specific submittals and review comments"],
    ["Finance + reports", "Built custom", "Broad", "Kiefer has tailored margin/cash-flow checks"],
  ], 0.62, 1.72, 12.1, 5.05, [2.05, 2.5, 2.45, 5.1]);
}

// 7
{
  const s = pptx.addSlide(); addBg(s, "1E1E1E"); footer(s, 7);
  addHeader(s, "CLIENT + VENDOR EXPERIENCE");
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0.75, w: 13.333, h: 6.75, fill: { color: "1E1E1E" }, line: { color: "1E1E1E" } });
  addImageCover(s, img.commercial, 0.62, 1.18, 5.5, 3.4, 0);
  title(s, "Portals should make Kiefer look organized, not outsourced.", { x: 6.55, y: 1.28, w: 5.8, h: 0.95, color: C.white, size: 26 });
  body(s, "The client portal, project pages, vendor workboard, approvals, files, photos, RFIs, and submittal reviews keep external stakeholders inside a Kiefer-branded workflow.", { x: 6.57, y: 2.55, w: 5.35, h: 0.78, color: "D8D1C8", size: 13 });
  ["Authenticated client project access", "Needs-attention owner dashboard", "Vendor RFI responses + submittals", "Manager review comments visible to vendors"].forEach((text, i) => {
    pill(s, text.toUpperCase(), 6.58, 3.65 + i * 0.46, 4.4, i === 0 ? C.red : C.white, i === 0 ? "FCEBE8" : "2A2A2A");
  });
}

// 8
{
  const s = pptx.addSlide(); addBg(s); addHeader(s, "FINANCE + REPORTING"); footer(s, 8);
  title(s, "Kiefer's finance layer is more than invoices.", { w: 7.8, h: 0.55 });
  body(s, "Buildertrend has broad financial modules. Kiefer's platform adds manager-facing checks that answer specific operating questions.", { y: 1.7, w: 6.8, h: 0.45 });
  const cards = [
    ["Draw + retainage", "What can we collect now, and what remains held?"],
    ["NPV / IRR", "Should we buy this truck, equipment, or tool?"],
    ["Change impact", "Does this change order protect target margin?"],
    ["Job cost variance", "Are actuals + commitments drifting beyond budget?"],
    ["Cash-flow forecast", "Will receipts cover vendor, payroll, and overhead pressure?"],
    ["Snapshots", "Can we export a dated Kiefer Built review packet?"],
  ];
  cards.forEach((c, i) => {
    const x = 0.72 + (i % 3) * 4.08;
    const y = 2.55 + Math.floor(i / 3) * 1.48;
    s.addShape(pptx.ShapeType.roundRect, { x, y, w: 3.62, h: 1.08, rectRadius: 0.05, fill: { color: C.white }, line: { color: C.line } });
    s.addText(c[0], { x: x + 0.22, y: y + 0.18, w: 3.1, h: 0.24, fontSize: 13, bold: true, color: C.red, margin: 0, fit: "shrink" });
    s.addText(c[1], { x: x + 0.22, y: y + 0.52, w: 3.1, h: 0.34, fontSize: 8.2, color: C.gray, margin: 0, fit: "shrink" });
  });
}

// 9
{
  const s = pptx.addSlide(); addBg(s); addHeader(s, "PRODUCTION ROADMAP"); footer(s, 9);
  title(s, "Honest gap list before calling it a full replacement.", { w: 8.6, h: 0.55 });
  const steps = [
    ["01", "Deploy production", "Put the site and CRM on a stable hosted environment."],
    ["02", "Push migrations", "Apply pending Supabase client portal and quote-lead capture migrations."],
    ["03", "Client access UI", "Let managers link client records to Supabase Auth users."],
    ["04", "Lead alerts", "Add Resend or another notification path for new website leads."],
    ["05", "Decide integrations", "Payments, QuickBooks/Xero, mobile app, and takeoff should be deliberate choices."],
  ];
  steps.forEach((step, i) => {
    const y = 1.75 + i * 0.92;
    s.addText(step[0], { x: 0.78, y, w: 0.55, h: 0.3, fontSize: 18, bold: true, color: C.red, margin: 0 });
    s.addShape(pptx.ShapeType.line, { x: 1.55, y: y + 0.14, w: 0.9, h: 0, line: { color: C.line, width: 1.2 } });
    s.addText(step[1], { x: 2.7, y: y - 0.01, w: 2.5, h: 0.24, fontSize: 14, bold: true, color: C.ink, margin: 0 });
    s.addText(step[2], { x: 5.38, y: y + 0.01, w: 6.2, h: 0.26, fontSize: 10.5, color: C.gray, margin: 0, fit: "shrink" });
  });
}

// 10
{
  const s = pptx.addSlide(); addBg(s); addHeader(s, "MEETING TALK TRACK"); footer(s, 10);
  title(s, "Five lines that make the pitch land.", { w: 7.2, h: 0.55 });
  const lines = [
    ["Your website now feeds your CRM.", "No prospect gets lost in an inbox."],
    ["Your clients stay inside Kiefer Built.", "The portal strengthens the contractor's brand, not a vendor's."],
    ["Your managers see the numbers they use.", "Margin, cash flow, retainage, commitments, and exposure."],
    ["Your team gets familiar navigation.", "Buildertrend-style categories without Buildertrend dependency."],
    ["The product grows with the company.", "Kiefer owns the roadmap."],
  ];
  lines.forEach((l, i) => {
    const y = 1.72 + i * 0.88;
    s.addShape(pptx.ShapeType.roundRect, { x: 0.72, y, w: 11.85, h: 0.62, rectRadius: 0.05, fill: { color: i === 0 ? "FCEBE8" : C.white }, line: { color: i === 0 ? "EAC5BE" : C.line } });
    s.addText(l[0], { x: 1.0, y: y + 0.14, w: 4.25, h: 0.2, fontSize: 12.5, bold: true, color: i === 0 ? C.red : C.ink, margin: 0, fit: "shrink" });
    s.addText(l[1], { x: 5.52, y: y + 0.14, w: 6.42, h: 0.2, fontSize: 10.3, color: C.gray, margin: 0, fit: "shrink" });
  });
}

// 11
{
  const s = pptx.addSlide(); addBg(s, C.black); footer(s, 11);
  s.addImage({ path: img.logo, x: 0.68, y: 0.58, w: 0.52, h: 0.35 });
  s.addText("DECISION FRAME", { x: 1.33, y: 0.62, w: 3.0, h: 0.22, fontSize: 8.5, bold: true, color: "D8D1C8", charSpace: 1.7, margin: 0 });
  title(s, "Own the operating system, not just the website.", { x: 0.72, y: 1.42, w: 7.65, h: 0.95, color: C.white, size: 34 });
  body(s, "Buildertrend is a mature benchmark. The Kiefer Built platform is the path to a branded, tailored, and expandable construction operations product.", { x: 0.74, y: 2.72, w: 6.8, h: 0.58, color: "D8D1C8", size: 14 });
  const asks = [
    "Approve production deployment path",
    "Apply pending Supabase migrations",
    "Test one real quote request into leads",
    "Prioritize client access management",
    "Decide payment/accounting/mobile scope",
  ];
  asks.forEach((a, i) => {
    s.addText(`0${i + 1}`, { x: 8.2, y: 1.28 + i * 0.72, w: 0.46, h: 0.22, fontSize: 12, bold: true, color: C.red, margin: 0 });
    s.addText(a, { x: 8.82, y: 1.28 + i * 0.72, w: 3.58, h: 0.22, fontSize: 11.2, color: C.white, margin: 0, fit: "shrink" });
  });
  s.addShape(pptx.ShapeType.line, { x: 8.04, y: 1.08, w: 0, h: 3.85, line: { color: "4A4A4A", width: 1.2 } });
}

pptx.writeFile({ fileName: output });
console.log(output);
