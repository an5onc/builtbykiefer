const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");

const root = path.resolve(__dirname, "../../../..");
const output = path.join(root, "docs/kiefer-built-vs-buildertrend-comparison.pptx");

const assets = {
  logo: path.join(root, "public/images/kiefer-k-logo.png"),
  hero: path.join(root, "public/images/project-1/exterior-1.jpg"),
  mountain: path.join(root, "public/images/project-2/exterior-front-facade.jpg"),
  interior: path.join(root, "public/images/project-3/interior-great-room-kitchen.jpg"),
  commercial: path.join(root, "public/images/kiefer-commercial-agfinity.jpg"),
};

for (const [name, file] of Object.entries(assets)) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing asset ${name}: ${file}`);
  }
}

const pptx = new pptxgen();
pptx.defineLayout({ name: "KIEFER_WIDE", width: 13.333, height: 7.5 });
pptx.layout = "KIEFER_WIDE";
pptx.author = "Nexgen Studio";
pptx.company = "Kiefer Built Contracting";
pptx.subject = "Kiefer Built Operations Platform vs Buildertrend";
pptx.title = "Kiefer Built Operations Platform vs Buildertrend";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "Arial",
  bodyFontFace: "Arial",
  lang: "en-US",
};
pptx.margin = 0;

const C = {
  black: "141414",
  charcoal: "222222",
  red: "CE2B1F",
  redDark: "9D2118",
  white: "FFFFFF",
  sand: "F3EEE6",
  cream: "FAF7F1",
  muted: "6E665C",
  line: "E5DED3",
  paleRed: "F9E5E2",
  green: "1F8A4C",
  amber: "A86A00",
  blueGray: "E8EEF4",
};

function addKLogo(slide, x = 0.42, y = 0.34, w = 0.34, h = 0.22) {
  slide.addImage({ path: assets.logo, x, y, w, h });
}

function addTopBar(slide, section, dark = false) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.82,
    fill: { color: dark ? C.black : C.white },
    line: { color: dark ? C.black : C.white },
  });
  addKLogo(slide, 0.42, 0.27, 0.35, 0.23);
  slide.addText("KIEFER BUILT CONTRACTING", {
    x: 0.92,
    y: 0.22,
    w: 3.6,
    h: 0.22,
    fontFace: "Arial",
    fontSize: 12,
    bold: true,
    color: dark ? C.white : C.black,
    margin: 0,
    breakLine: false,
  });
  slide.addText(section.toUpperCase(), {
    x: 9.45,
    y: 0.28,
    w: 3.35,
    h: 0.2,
    fontSize: 7.5,
    bold: true,
    color: dark ? "BEB7AE" : C.muted,
    charSpace: 2,
    align: "right",
    margin: 0,
  });
}

function addFooter(slide, dark = false) {
  slide.addShape(pptx.ShapeType.line, {
    x: 0.42,
    y: 7.05,
    w: 12.45,
    h: 0,
    line: { color: dark ? "3A3A3A" : C.line, transparency: 20, width: 1 },
  });
  slide.addText("Kiefer Built Operations Platform", {
    x: 0.42,
    y: 7.14,
    w: 3.5,
    h: 0.14,
    fontSize: 7,
    bold: true,
    color: dark ? "BEB7AE" : C.muted,
    charSpace: 1,
    margin: 0,
  });
  slide.addText("Prepared for Kiefer Built Contracting", {
    x: 9.25,
    y: 7.14,
    w: 3.6,
    h: 0.14,
    fontSize: 7,
    color: dark ? "9B948C" : C.muted,
    align: "right",
    margin: 0,
  });
}

function title(slide, text, opts = {}) {
  slide.addText(text, {
    x: opts.x ?? 0.72,
    y: opts.y ?? 1.18,
    w: opts.w ?? 5.7,
    h: opts.h ?? 1.35,
    fontFace: "Arial",
    fontSize: opts.size ?? 32,
    bold: true,
    color: opts.color ?? C.black,
    fit: "shrink",
    breakLine: false,
    margin: 0,
  });
}

function kicker(slide, text, x, y, w, color = C.red) {
  slide.addText(text.toUpperCase(), {
    x,
    y,
    w,
    h: 0.16,
    fontSize: 7.5,
    bold: true,
    color,
    charSpace: 2,
    margin: 0,
  });
}

function body(slide, text, x, y, w, h, opts = {}) {
  slide.addText(text, {
    x,
    y,
    w,
    h,
    fontSize: opts.size ?? 14,
    color: opts.color ?? C.muted,
    bold: opts.bold ?? false,
    breakLine: false,
    fit: "shrink",
    margin: opts.margin ?? 0,
    valign: opts.valign ?? "top",
  });
}

function bulletList(slide, items, x, y, w, opts = {}) {
  const color = opts.color ?? C.black;
  const muted = opts.muted ?? C.muted;
  const gap = opts.gap ?? 0.42;
  items.forEach((item, i) => {
    const yy = y + i * gap;
    slide.addShape(pptx.ShapeType.ellipse, {
      x,
      y: yy + 0.05,
      w: 0.11,
      h: 0.11,
      fill: { color: opts.dot ?? C.red },
      line: { color: opts.dot ?? C.red },
    });
    body(slide, item, x + 0.22, yy, w - 0.22, gap, {
      size: opts.size ?? 12.5,
      color: i === 0 && opts.firstBold ? color : muted,
      bold: i === 0 && opts.firstBold,
    });
  });
}

function card(slide, x, y, w, h, label, value, note, opts = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.06,
    fill: { color: opts.fill ?? C.white },
    line: { color: opts.line ?? C.line, width: 1 },
    shadow: opts.shadow ? { type: "outer", color: "000000", opacity: 0.12, blur: 1, angle: 45, distance: 1 } : undefined,
  });
  kicker(slide, label, x + 0.22, y + 0.22, w - 0.44, opts.kicker ?? C.red);
  body(slide, value, x + 0.22, y + 0.55, w - 0.44, 0.56, {
    size: opts.valueSize ?? 21,
    color: opts.valueColor ?? C.black,
    bold: true,
  });
  body(slide, note, x + 0.22, y + 1.16, w - 0.44, h - 1.32, {
    size: opts.noteSize ?? 10.5,
    color: opts.noteColor ?? C.muted,
  });
}

function drawComparisonTable(slide, rows, x, y, w, h) {
  const colW = [2.1, 3.55, 3.55, 2.05];
  const scale = w / colW.reduce((a, b) => a + b, 0);
  const widths = colW.map((v) => v * scale);
  const rowH = h / (rows.length + 1);
  const headers = ["Workflow", "Kiefer Platform", "Buildertrend", "Position"];
  let xx = x;
  headers.forEach((head, i) => {
    slide.addShape(pptx.ShapeType.rect, {
      x: xx,
      y,
      w: widths[i],
      h: rowH,
      fill: { color: C.black },
      line: { color: C.black },
    });
    body(slide, head, xx + 0.08, y + 0.13, widths[i] - 0.16, rowH - 0.16, {
      size: 8.4,
      color: C.white,
      bold: true,
    });
    xx += widths[i];
  });
  rows.forEach((row, r) => {
    xx = x;
    const yy = y + rowH * (r + 1);
    row.forEach((cell, c) => {
      slide.addShape(pptx.ShapeType.rect, {
        x: xx,
        y: yy,
        w: widths[c],
        h: rowH,
        fill: { color: r % 2 === 0 ? C.white : C.cream },
        line: { color: C.line, width: 0.5 },
      });
      body(slide, cell, xx + 0.08, yy + 0.08, widths[c] - 0.16, rowH - 0.14, {
        size: c === 0 ? 8.2 : 7.8,
        color: c === 3 ? C.redDark : c === 0 ? C.black : C.muted,
        bold: c === 0 || c === 3,
      });
      xx += widths[c];
    });
  });
}

function sectionNumber(slide, n, heading, text, y, dark = false) {
  slide.addText(String(n).padStart(2, "0"), {
    x: 0.72,
    y,
    w: 0.55,
    h: 0.3,
    fontSize: 18,
    bold: true,
    color: C.red,
    margin: 0,
  });
  body(slide, heading, 1.42, y + 0.02, 3.4, 0.32, {
    size: 12.2,
    color: dark ? C.white : C.black,
    bold: true,
  });
  body(slide, text, 4.92, y + 0.01, 6.95, 0.45, {
    size: 10.5,
    color: dark ? "CFC7BD" : C.muted,
  });
  slide.addShape(pptx.ShapeType.line, {
    x: 0.72,
    y: y + 0.56,
    w: 11.9,
    h: 0,
    line: { color: dark ? "3A3A3A" : C.line, transparency: 10, width: 1 },
  });
}

function addImageBand(slide, image, x, y, w, h) {
  slide.addImage({ path: image, x, y, w, h });
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w,
    h,
    fill: { color: "000000", transparency: 28 },
    line: { color: "000000", transparency: 100 },
  });
}

// Slide 1
{
  const slide = pptx.addSlide();
  slide.background = { color: C.black };
  addImageBand(slide, assets.hero, 5.95, 0, 7.38, 7.5);
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 7.2,
    h: 7.5,
    fill: { color: C.black, transparency: 3 },
    line: { color: C.black },
  });
  addKLogo(slide, 0.72, 0.58, 0.62, 0.41);
  kicker(slide, "Sales meeting deck", 0.72, 1.35, 3.1, "E6B2AD");
  title(slide, "Kiefer Built Operations Platform vs Buildertrend", {
    x: 0.72,
    y: 1.78,
    w: 5.7,
    h: 1.75,
    size: 34,
    color: C.white,
  });
  body(
    slide,
    "A Kiefer-owned path to replacing third-party construction software while keeping the transition familiar for employees, managers, clients, and trade partners.",
    0.74,
    3.72,
    5.25,
    0.95,
    { size: 14.2, color: "D8D1C7" },
  );
  card(slide, 0.74, 5.36, 1.72, 0.86, "Goal", "Own", "the platform", {
    fill: "1C1C1C",
    line: "333333",
    valueColor: C.white,
    noteColor: "CFC7BD",
    valueSize: 22,
  });
  card(slide, 2.65, 5.36, 1.72, 0.86, "Goal", "Replace", "Buildertrend dependency", {
    fill: "1C1C1C",
    line: "333333",
    valueColor: C.white,
    noteColor: "CFC7BD",
    valueSize: 18,
  });
  card(slide, 4.56, 5.36, 1.72, 0.86, "Goal", "Improve", "Kiefer workflows", {
    fill: "1C1C1C",
    line: "333333",
    valueColor: C.white,
    noteColor: "CFC7BD",
    valueSize: 19,
  });
  addFooter(slide, true);
}

// Slide 2
{
  const slide = pptx.addSlide();
  slide.background = { color: C.cream };
  addTopBar(slide, "Executive thesis");
  kicker(slide, "The right framing", 0.72, 1.23, 3.2);
  title(slide, "Do not pitch this as Buildertrend but cheaper.", { y: 1.55, w: 5.85, size: 30 });
  body(
    slide,
    "The stronger pitch is ownership: Kiefer Built controls the client experience, the workflow, the reporting, and the product roadmap.",
    0.74,
    3.05,
    5.35,
    0.82,
    { size: 14.2, color: C.muted },
  );
  card(slide, 6.72, 1.32, 2.05, 2.1, "Pillar 1", "Kiefer-owned", "Clients and employees see Kiefer Built, not a third-party software brand.", { shadow: true });
  card(slide, 8.98, 1.32, 2.05, 2.1, "Pillar 2", "Familiar", "Navigation mirrors common construction modules so the switch feels natural.", { shadow: true });
  card(slide, 11.24, 1.32, 1.7, 2.1, "Pillar 3", "Custom", "Reports and finance tools match Kiefer's actual decisions.", { shadow: true });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.72,
    y: 4.16,
    w: 6.2,
    h: 1.45,
    rectRadius: 0.08,
    fill: { color: C.black },
    line: { color: C.black },
  });
  body(
    slide,
    "Buildertrend is mature. The Kiefer platform wins when Kiefer wants the software to feel like part of its company instead of a rented operating system.",
    7.08,
    4.54,
    5.52,
    0.54,
    { size: 15.5, color: C.white, bold: true },
  );
  addFooter(slide);
}

// Slide 3
{
  const slide = pptx.addSlide();
  slide.background = { color: C.white };
  addTopBar(slide, "At-a-glance comparison");
  title(slide, "A practical replacement path, not a clone race.", { y: 1.18, w: 7.9, size: 25 });
  const rows = [
    ["Ownership", "Kiefer-branded and controlled", "Third-party SaaS brand", "Kiefer advantage"],
    ["Maturity", "Strong custom foundation", "Broader hardened SaaS", "Buildertrend today"],
    ["Client experience", "Kiefer portal and website intake", "Mature customer portal", "Kiefer brand advantage"],
    ["Financial control", "Kiefer-specific finance checks", "Broad financial modules", "Depends on workflow"],
    ["Roadmap", "Changed around Kiefer needs", "Vendor-controlled roadmap", "Kiefer advantage"],
    ["Cost story", "Owned asset after buildout", "Custom quote subscription", "Strategic decision"],
  ];
  drawComparisonTable(slide, rows, 0.72, 2.45, 11.9, 3.55);
  addFooter(slide);
}

// Slide 4
{
  const slide = pptx.addSlide();
  slide.background = { color: C.black };
  addTopBar(slide, "Respect the incumbent", true);
  addImageBand(slide, assets.mountain, 7.65, 0.82, 5.68, 6.68);
  kicker(slide, "Buildertrend is strong", 0.72, 1.28, 3.1, "E6B2AD");
  title(slide, "Mature advantages we should acknowledge.", { y: 1.62, w: 5.8, size: 31, color: C.white });
  bulletList(
    slide,
    [
      "Established mobile app workflows.",
      "Payments, takeoff, and deeper estimating maturity.",
      "Accounting integrations and SaaS support infrastructure.",
      "Years of edge-case hardening across permissions, mobile behavior, and field usage.",
    ],
    0.75,
    3.36,
    5.75,
    { color: C.white, muted: "D8D1C7", size: 13.4, gap: 0.56 },
  );
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.72,
    y: 5.82,
    w: 5.85,
    h: 0.76,
    rectRadius: 0.08,
    fill: { color: "241817" },
    line: { color: "3A2724" },
  });
  body(slide, "This honesty makes the pitch stronger. We can show exactly what is built, what is next, and where Kiefer gains control.", 1.02, 6.05, 5.25, 0.28, { size: 11.3, color: "E3D7D2" });
  addFooter(slide, true);
}

// Slide 5
{
  const slide = pptx.addSlide();
  slide.background = { color: C.sand };
  addTopBar(slide, "Kiefer advantages");
  title(slide, "Where Kiefer is already differentiated.", { y: 1.1, w: 5.7, size: 30 });
  addImageBand(slide, assets.interior, 7.45, 1.08, 5.25, 5.72);
  card(slide, 0.72, 2.28, 2.7, 1.25, "01", "Website feeds CRM", "Quote requests save into admin leads, reducing lost prospects.");
  card(slide, 3.62, 2.28, 2.7, 1.25, "02", "Kiefer portal", "Clients stay inside Kiefer Built instead of another software brand.");
  card(slide, 0.72, 3.86, 2.7, 1.25, "03", "Finance tools", "Accounting checks are packaged around Kiefer's daily review workflow.");
  card(slide, 3.62, 3.86, 2.7, 1.25, "04", "Roadmap control", "Fields, reports, PDFs, and workflows can change as Kiefer changes.");
  card(slide, 0.72, 5.28, 5.6, 1.2, "Positioning", "Premium and controlled", "The product makes Kiefer look organized, modern, and operationally serious.", { valueSize: 18 });
  addFooter(slide);
}

// Slide 6
{
  const slide = pptx.addSlide();
  slide.background = { color: C.white };
  addTopBar(slide, "Feature coverage");
  title(slide, "Core workflows are already in place.", { y: 1.02, w: 5.4, size: 28 });
  body(slide, "This is the slide to use when someone asks, \"But does it actually cover what Buildertrend does?\"", 6.82, 1.18, 5.45, 0.42, { size: 12.5, color: C.muted });
  const rows = [
    ["Sales", "Leads, quote intake, proposals", "Lead management, proposals", "Comparable core"],
    ["Jobs", "Project hub, tasks, schedule", "Jobs, tasks, schedule", "Built"],
    ["Field", "Daily logs, photos, files, RFIs", "Daily logs, docs, RFIs", "Built"],
    ["Decisions", "Selections, change orders, approvals", "Selections, change orders", "Built"],
    ["Financial", "Invoices, bills, POs, reports, finance tools", "Financial management", "Kiefer-tailored"],
    ["Client", "Authenticated portal and project view", "Customer portal", "Kiefer-branded"],
    ["Vendor", "Directory, assignments, workboard, submittals", "Sub portal", "Built foundation"],
  ];
  drawComparisonTable(slide, rows, 0.72, 2.0, 11.9, 4.35);
  addFooter(slide);
}

// Slide 7
{
  const slide = pptx.addSlide();
  slide.background = { color: C.cream };
  addTopBar(slide, "Client and vendor experience");
  title(slide, "The portal should feel like Kiefer Built, not rented software.", { y: 1.14, w: 6.7, size: 28 });
  card(slide, 0.72, 2.28, 3.6, 2.9, "Client portal", "Owner confidence", "Authenticated project access with needs-attention summary, approvals, photos, files, field reports, invoices, warranty, and punch-list visibility.", { valueSize: 20 });
  card(slide, 4.74, 2.28, 3.6, 2.9, "Vendor portal", "Trade coordination", "Assignments, shared docs, RFIs, responses, submittals, review statuses, and manager comments in one Kiefer-managed workboard.", { valueSize: 20 });
  card(slide, 8.76, 2.28, 3.6, 2.9, "Transition", "Familiar routes", "Navigation mirrors common Buildertrend categories while replacing the outside brand with Kiefer ownership.", { valueSize: 20 });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 1.52,
    y: 5.82,
    w: 10.3,
    h: 0.72,
    rectRadius: 0.08,
    fill: { color: C.black },
    line: { color: C.black },
  });
  body(slide, "The strategic difference: clients and trade partners interact with Kiefer's process, Kiefer's language, and Kiefer's brand.", 1.93, 6.05, 9.5, 0.25, { size: 12.5, color: C.white, bold: true });
  addFooter(slide);
}

// Slide 8
{
  const slide = pptx.addSlide();
  slide.background = { color: C.black };
  addTopBar(slide, "Financial operations", true);
  kicker(slide, "Management meeting value", 0.72, 1.2, 3.6, "E6B2AD");
  title(slide, "Finance tools should answer daily contractor questions.", { y: 1.55, w: 6.6, size: 31, color: C.white });
  body(slide, "Instead of generic calculators, the tools are branded as Kiefer Built planning checks and tied to project financial review.", 0.74, 3.0, 5.95, 0.58, { size: 13.5, color: "D8D1C7" });
  card(slide, 7.22, 1.35, 2.35, 1.45, "Built", "Cash flow", "Forecast job inflows and outflows.", { fill: "1C1C1C", line: "333333", valueColor: C.white, noteColor: "D8D1C7" });
  card(slide, 9.92, 1.35, 2.35, 1.45, "Built", "Margin risk", "Spot cost exposure and variance.", { fill: "1C1C1C", line: "333333", valueColor: C.white, noteColor: "D8D1C7" });
  card(slide, 7.22, 3.08, 2.35, 1.45, "Built", "Retainage", "Plan draw timing and holdback.", { fill: "1C1C1C", line: "333333", valueColor: C.white, noteColor: "D8D1C7" });
  card(slide, 9.92, 3.08, 2.35, 1.45, "Built", "NPV / IRR", "Evaluate project decision quality.", { fill: "1C1C1C", line: "333333", valueColor: C.white, noteColor: "D8D1C7" });
  card(slide, 7.22, 4.81, 5.05, 1.05, "Differentiator", "Custom reports can be changed", "Kiefer can decide what the weekly finance dashboard should say.", { fill: "241817", line: "3A2724", valueColor: C.white, noteColor: "E3D7D2", valueSize: 19 });
  addFooter(slide, true);
}

// Slide 9
{
  const slide = pptx.addSlide();
  slide.background = { color: C.white };
  addTopBar(slide, "Production readiness");
  title(slide, "Honest gaps before calling it a full replacement.", { y: 1.14, w: 8.9, size: 25 });
  const gaps = [
    ["01", "Deploy the site and CRM", "Move from local development to preview and production environments."],
    ["02", "Push and verify database migrations", "Confirm Supabase schema, RLS, storage, and access behavior."],
    ["03", "Finish client and vendor account management", "Add admin UI for linking real people to portal records."],
    ["04", "Decide payments and accounting integrations", "Choose Stripe, QuickBooks/Xero export, or separate accounting workflows."],
    ["05", "Mobile decision", "Use responsive web first, then build native field flows only if adoption demands it."],
  ];
  gaps.forEach((g, i) => sectionNumber(slide, g[0], g[1], g[2], 2.42 + i * 0.73));
  addFooter(slide);
}

// Slide 10
{
  const slide = pptx.addSlide();
  slide.background = { color: C.sand };
  addTopBar(slide, "Meeting talk track");
  title(slide, "Five lines to keep the meeting focused.", { y: 1.18, w: 8.6, size: 25 });
  const lines = [
    ["Your website now feeds your CRM.", "Quote requests can enter the lead pipeline without getting lost in email."],
    ["Your clients stay inside Kiefer Built.", "The portal reinforces Kiefer's brand and process."],
    ["Your managers get the numbers they use.", "Reports emphasize margin, cash flow, retainage, changes, and vendor commitments."],
    ["Your team gets familiar navigation.", "Module names and routes reduce retraining friction."],
    ["This can grow with your company.", "Kiefer can add fields, reports, approvals, and PDFs as the process matures."],
  ];
  lines.forEach((line, i) => sectionNumber(slide, i + 1, line[0], line[1], 2.42 + i * 0.73));
  addFooter(slide);
}

// Slide 11
{
  const slide = pptx.addSlide();
  slide.background = { color: C.black };
  addImageBand(slide, assets.commercial, 0, 0, 13.333, 7.5);
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: C.black, transparency: 15 },
    line: { color: C.black, transparency: 100 },
  });
  addTopBar(slide, "Decision path", true);
  title(slide, "Own the platform. Own the experience. Keep the workflow.", {
    y: 1.28,
    w: 7.2,
    size: 32,
    color: C.white,
  });
  const phases = [
    ["Phase 1", "Preview deployment", "Deploy the current site/CRM, push migrations, and test real access paths."],
    ["Phase 2", "Live pilot", "Run selected projects, clients, vendors, and quote intake through the platform."],
    ["Phase 3", "Production growth", "Add accounting/payment/mobile integrations only where they create real value."],
  ];
  phases.forEach((p, i) => {
    card(slide, 0.72 + i * 4.1, 3.22, 3.55, 1.72, p[0], p[1], p[2], {
      fill: i === 0 ? C.red : "1B1B1B",
      line: i === 0 ? C.red : "333333",
      kicker: i === 0 ? "FFFFFF" : "E6B2AD",
      valueColor: C.white,
      noteColor: i === 0 ? "FDEDEA" : "D8D1C7",
      shadow: true,
    });
  });
  body(
    slide,
    "Sources: Buildertrend product overview and pricing pages, Forbes Advisor Buildertrend review, and the current Kiefer Built CRM feature inventory.",
    0.75,
    6.54,
    8.8,
    0.25,
    { size: 8.5, color: "BEB7AE" },
  );
  addFooter(slide, true);
}

pptx.writeFile({ fileName: output });
