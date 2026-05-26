// Bu fayl admin panelində CRM lead-ləri, satılmış layihələri, müştəri assetlərini və maliyyə KPI-larını idarə edir.
import { loadLeads, money } from "./core.js";

const statuses = ["Lead", "Qualified", "Proposal", "Contract", "Development", "QA", "Live", "Support", "Renewal-Due", "Overdue"];

const demoDeals = [
  { client: "Caspian Retail", project: "Marketplace + ERP", status: "Development", total: 38500, mrr: 650, profit: 29100, domain: "caspianretail.az", renewal: "2026-06-12" },
  { client: "MedCloud", project: "Clinic SaaS", status: "QA", total: 46200, mrr: 1400, profit: 35200, domain: "medcloud.az", renewal: "2026-07-04" },
  { client: "LegalPro", project: "Corporate + Client Portal", status: "Live", total: 14800, mrr: 280, profit: 11200, domain: "legalpro.az", renewal: "2026-06-22" },
  { client: "EduNova", project: "LMS + Mobile PWA", status: "Support", total: 32200, mrr: 650, profit: 24600, domain: "edunova.com", renewal: "2026-08-01" },
  { client: "BuildMax", project: "Construction ERP", status: "Renewal-Due", total: 51800, mrr: 1400, profit: 39600, domain: "buildmax.az", renewal: "2026-06-02" }
];

function deals() {
  const leads = loadLeads().map((lead) => ({
    client: lead.client.company || lead.client.name || "Yeni lead",
    project: lead.selections[0]?.module_title || "Custom Project",
    status: lead.deal.status,
    total: lead.deal.total_azn,
    mrr: lead.deal.mrr_azn,
    profit: lead.deal.profit_azn,
    domain: "təyin edilməyib",
    renewal: "planlaşdırılır"
  }));
  const manual = JSON.parse(localStorage.getItem("sp_global_manual_deals") || "[]");
  return [...manual, ...leads, ...demoDeals];
}

function kpis(rows) {
  const pipeline = rows.reduce((s, r) => s + r.total, 0);
  const mrr = rows.reduce((s, r) => s + r.mrr, 0);
  const profit = rows.reduce((s, r) => s + r.profit, 0);
  return { pipeline, mrr, arr: mrr * 12, profit, clients: rows.length, renewals: rows.filter((r) => ["Renewal-Due", "Overdue"].includes(r.status)).length };
}

function renderKpis(rows) {
  const data = kpis(rows);
  const values = { pipeline: money(data.pipeline), mrr: money(data.mrr), arr: money(data.arr), profit: money(data.profit), clients: data.clients, renewals: data.renewals };
  Object.entries(values).forEach(([key, value]) => {
    const node = document.querySelector(`[data-kpi="${key}"]`);
    if (node) node.textContent = value;
  });
}

function renderTable(rows) {
  const body = document.querySelector("[data-ledger]");
  if (!body) return;
  body.innerHTML = rows.map((row, index) => `
    <tr>
      <td>${row.client}</td>
      <td>${row.project}</td>
      <td><span class="badge">${row.status}</span></td>
      <td>${money(row.total)}</td>
      <td>${money(row.mrr)}</td>
      <td>${money(row.profit)}</td>
      <td>${row.domain}</td>
      <td>${row.renewal}</td>
      <td><button class="btn" data-status="${index}">Status</button></td>
    </tr>
  `).join("");
}

function draw(canvas, rows) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * ratio;
  canvas.height = h * ratio;
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, w, h);
  const max = Math.max(...rows.map((r) => r.total), 1);
  const gap = 12;
  const bw = Math.max(18, (w - gap * (rows.length + 1)) / rows.length);
  rows.forEach((row, i) => {
    const bh = (row.total / max) * (h - 64);
    const x = gap + i * (bw + gap);
    const y = h - bh - 30;
    const g = ctx.createLinearGradient(0, y, 0, h);
    g.addColorStop(0, "#00e676");
    g.addColorStop(.55, "#00d5ff");
    g.addColorStop(1, "#8b5cf6");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, bw, bh);
    ctx.fillStyle = "#9fb4ca";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText(row.client.slice(0, 10), x, h - 8);
  });
}

function addManualDeal() {
  const form = document.querySelector("[data-admin-form]");
  if (!form) return;
  const data = Object.fromEntries(new FormData(form).entries());
  const rows = JSON.parse(localStorage.getItem("sp_global_manual_deals") || "[]");
  rows.unshift({
    client: data.client || "Manual Client",
    project: data.project || "Custom Project",
    status: data.status || "Lead",
    total: Number(data.total || 0),
    mrr: Number(data.mrr || 0),
    profit: Number(data.profit || 0),
    domain: data.domain || "domain.az",
    renewal: data.renewal || "2026-06-30"
  });
  localStorage.setItem("sp_global_manual_deals", JSON.stringify(rows));
  form.reset();
  refresh();
}

function refresh() {
  const rows = deals();
  renderKpis(rows);
  renderTable(rows);
  draw(document.querySelector("[data-chart]"), rows);
}

document.addEventListener("DOMContentLoaded", () => {
  refresh();
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-add-deal]")) addManualDeal();
    const status = event.target.closest("[data-status]");
    if (status) {
      const manual = JSON.parse(localStorage.getItem("sp_global_manual_deals") || "[]");
      const rows = deals();
      const row = rows[Number(status.dataset.status)];
      row.status = statuses[(statuses.indexOf(row.status) + 1) % statuses.length] || "Lead";
      manual.unshift(row);
      localStorage.setItem("sp_global_manual_deals", JSON.stringify(manual));
      refresh();
    }
  });
  window.addEventListener("resize", refresh);
});
