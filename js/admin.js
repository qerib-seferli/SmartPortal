// Bu fayl SmartPortal admin panelini real Supabase məlumatları ilə işlədən CRUD mərkəzidir.
import { money } from "./core.js";
import {
  createManualProject,
  deleteAdminRow,
  deleteCatalogItem,
  deleteProject,
  loadAdminCatalog,
  loadAdminProjects,
  loadAdminRows,
  saveAdminRow,
  saveCatalogOverride,
  saveCurrencyRate,
  updateProjectStatus
} from "./supabase-client.js";

const statuses = ["Lead", "Qualified", "Proposal", "Contract", "Development", "QA", "Live", "Support", "Renewal-Due", "Overdue"];
const managedTables = ["sp_clients", "sp_projects", "sp_project_modules", "sp_domains", "sp_mailboxes", "sp_subscriptions", "sp_invoices", "sp_notifications", "sp_support_tickets", "sp_push_tokens", "sp_catalog_items", "sp_currency_rates"];
let projectRows = [];
let catalogRows = [];

function by(selector) {
  return document.querySelector(selector);
}

function value(selector) {
  return by(selector)?.value?.trim() || "";
}

function numberValue(selector, fallback = 0) {
  const raw = value(selector);
  return raw === "" ? fallback : Number(raw);
}

function kpis(rows) {
  const pipeline = rows.reduce((sum, row) => sum + Number(row.total_azn || 0), 0);
  const mrr = rows.reduce((sum, row) => sum + Number(row.mrr_azn || 0), 0);
  const profit = rows.reduce((sum, row) => sum + Number(row.profit_azn || 0), 0);
  return {
    pipeline,
    mrr,
    arr: mrr * 12,
    profit,
    clients: new Set(rows.map((row) => row.client_id || row.sp_clients?.company_name || row.id)).size,
    renewals: rows.filter((row) => ["Renewal-Due", "Overdue"].includes(row.status)).length
  };
}

function renderKpis(rows) {
  const data = kpis(rows);
  const values = {
    pipeline: money(data.pipeline),
    mrr: money(data.mrr),
    arr: money(data.arr),
    profit: money(data.profit),
    clients: data.clients,
    renewals: data.renewals
  };
  Object.entries(values).forEach(([key, item]) => {
    const node = by(`[data-kpi="${key}"]`);
    if (node) node.textContent = item;
  });
}

function renderTable(rows) {
  const body = by("[data-ledger]");
  if (!body) return;
  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="10" class="muted">Supabase-də hələ real layihə yoxdur. Yuxarıdakı formadan ilk müştəri layihəsini əlavə edin.</td></tr>`;
    return;
  }
  body.innerHTML = rows.map((row) => {
    const client = row.sp_clients?.company_name || row.sp_clients?.contact_name || "Müştəri";
    const domain = row.sp_domains?.[0]?.domain_name || "";
    const renewal = row.sp_domains?.[0]?.expires_at || "";
    return `
      <tr>
        <td>${client}</td>
        <td>${row.title || ""}</td>
        <td><span class="badge">${row.status || "Lead"}</span></td>
        <td>${money(Number(row.total_azn || 0))}</td>
        <td>${money(Number(row.mrr_azn || 0))}</td>
        <td>${money(Number(row.profit_azn || 0))}</td>
        <td>${domain}</td>
        <td>${renewal}</td>
        <td><button class="btn" data-status-id="${row.id}">Status</button></td>
        <td><button class="btn danger" data-delete-project="${row.id}">Sil</button></td>
      </tr>
    `;
  }).join("");
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
  if (!rows.length) {
    ctx.fillStyle = "#9fb4ca";
    ctx.font = "14px Inter, sans-serif";
    ctx.fillText("Real layihələr əlavə edildikcə gəlir qrafiki burada formalaşacaq.", 18, 42);
    return;
  }
  const max = Math.max(...rows.map((row) => Number(row.total_azn || 0)), 1);
  const gap = 12;
  const barWidth = Math.max(20, (w - gap * (rows.length + 1)) / rows.length);
  rows.forEach((row, index) => {
    const height = (Number(row.total_azn || 0) / max) * (h - 62);
    const x = gap + index * (barWidth + gap);
    const y = h - height - 30;
    const gradient = ctx.createLinearGradient(0, y, 0, h);
    gradient.addColorStop(0, "#00e676");
    gradient.addColorStop(.55, "#00d5ff");
    gradient.addColorStop(1, "#8b5cf6");
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, height);
    ctx.fillStyle = "#9fb4ca";
    ctx.font = "11px Inter, sans-serif";
    ctx.fillText((row.sp_clients?.company_name || row.title || "").slice(0, 10), x, h - 8);
  });
}

async function refreshProjects() {
  const result = await loadAdminProjects();
  projectRows = result.ok ? result.data : [];
  renderKpis(projectRows);
  renderTable(projectRows);
  draw(by("[data-chart]"), projectRows);
}

async function addProject() {
  const form = by("[data-admin-form]");
  const notice = by("[data-admin-notice]");
  if (!form) return;
  const data = Object.fromEntries(new FormData(form).entries());
  if (!data.client?.trim() || !data.project?.trim()) {
    if (notice) notice.textContent = "Müştəri və layihə adı mütləq daxil edilməlidir.";
    return;
  }
  const result = await createManualProject(data);
  if (notice) notice.textContent = result.ok ? "Layihə Supabase bazasına əlavə olundu." : `Əlavə edilmədi: ${result.message}`;
  if (result.ok) form.reset();
  await refreshProjects();
}

function parseJson(raw, fallback = {}) {
  if (!raw.trim()) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function fillCatalogForm(row = {}) {
  by("[data-catalog-id]").value = row.id || "";
  by("[data-catalog-group-key]").value = row.group_key || "";
  by("[data-catalog-group-title]").value = row.group_title || "";
  by("[data-catalog-group-type]").value = row.group_type || "checkbox";
  by("[data-catalog-icon]").value = row.icon || "▫";
  by("[data-catalog-module-key]").value = row.module_key || "";
  by("[data-catalog-title]").value = row.module_title || "";
  by("[data-catalog-price]").value = row.price_azn ?? "";
  by("[data-catalog-days]").value = row.days ?? "";
  by("[data-catalog-complexity]").value = row.complexity ?? 1;
  by("[data-catalog-sort]").value = row.sort_order ?? 0;
  by("[data-catalog-active]").checked = row.active !== false;
  by("[data-catalog-translations]").value = JSON.stringify(row.translations || {}, null, 2);
}

function renderCatalogSelect() {
  const select = by("[data-catalog-row]");
  if (!select) return;
  select.innerHTML = `<option value="">Yeni seçim əlavə et</option>` + catalogRows.map((row) => `<option value="${row.id}">${row.group_key} / ${row.module_title}</option>`).join("");
}

async function refreshCatalog() {
  const result = await loadAdminCatalog();
  catalogRows = result.ok ? result.data : [];
  renderCatalogSelect();
  if (!by("[data-catalog-id]")?.value) fillCatalogForm({});
}

async function saveCatalog() {
  const notice = by("[data-catalog-notice]");
  const payload = {
    id: value("[data-catalog-id]") || undefined,
    group_key: value("[data-catalog-group-key]"),
    group_title: value("[data-catalog-group-title]"),
    group_type: value("[data-catalog-group-type]") || "checkbox",
    icon: value("[data-catalog-icon]") || "▫",
    module_key: value("[data-catalog-module-key]"),
    module_title: value("[data-catalog-title]"),
    price_azn: numberValue("[data-catalog-price]"),
    days: numberValue("[data-catalog-days]"),
    complexity: numberValue("[data-catalog-complexity]", 1),
    sort_order: numberValue("[data-catalog-sort]"),
    active: by("[data-catalog-active]")?.checked !== false,
    translations: parseJson(value("[data-catalog-translations]"), {})
  };
  if (!payload.group_key || !payload.module_key || !payload.module_title) {
    if (notice) notice.textContent = "Qrup açarı, modul açarı və modul adı boş ola bilməz.";
    return;
  }
  const result = await saveCatalogOverride(payload);
  if (notice) notice.textContent = result.ok ? "Katalog sətiri saxlanıldı." : `Saxlanmadı: ${result.message}`;
  await refreshCatalog();
}

async function removeCatalog() {
  const id = value("[data-catalog-id]");
  const notice = by("[data-catalog-notice]");
  if (!id) {
    if (notice) notice.textContent = "Silmək üçün əvvəl katalog sətri seçin.";
    return;
  }
  const result = await deleteCatalogItem(id);
  if (notice) notice.textContent = result.ok ? "Katalog sətri silindi." : `Silinmədi: ${result.message}`;
  fillCatalogForm({});
  await refreshCatalog();
}

async function saveRate() {
  const notice = by("[data-rate-notice]");
  const payload = {
    code: value("[data-rate-code]").toUpperCase(),
    symbol: value("[data-rate-symbol]"),
    rate_to_azn: numberValue("[data-rate-value]", 1),
    active: by("[data-rate-active]")?.checked !== false,
    sort_order: numberValue("[data-rate-sort]")
  };
  if (!payload.code || !payload.symbol || !payload.rate_to_azn) {
    if (notice) notice.textContent = "Valyuta kodu, simvolu və AZN kursu mütləqdir.";
    return;
  }
  const result = await saveCurrencyRate(payload);
  if (notice) notice.textContent = result.ok ? "Valyuta kursu saxlanıldı." : `Saxlanmadı: ${result.message}`;
}

function setupDataManager() {
  const tableSelect = by("[data-admin-table]");
  if (!tableSelect) return;
  tableSelect.innerHTML = managedTables.map((table) => `<option value="${table}">${table}</option>`).join("");
}

async function loadManagerRows() {
  const result = await loadAdminRows(value("[data-admin-table]"));
  const output = by("[data-admin-json]");
  const notice = by("[data-manager-notice]");
  if (output) output.value = JSON.stringify(result.data || [], null, 2);
  if (notice) notice.textContent = result.ok ? "Cədvəl oxundu. Redaktə üçün bir obyekt saxlayın." : result.message;
}

async function saveManagerRow() {
  const row = parseJson(value("[data-admin-json]"), null);
  const notice = by("[data-manager-notice]");
  if (!row || Array.isArray(row)) {
    if (notice) notice.textContent = "Saxlamaq üçün textarea-da tək JSON obyekt olmalıdır.";
    return;
  }
  const result = await saveAdminRow(value("[data-admin-table]"), row);
  if (notice) notice.textContent = result.ok ? "Sətir saxlanıldı." : `Saxlanmadı: ${result.message}`;
}

async function deleteManagerRow() {
  const id = value("[data-admin-row-id]");
  const notice = by("[data-manager-notice]");
  if (!id) {
    if (notice) notice.textContent = "Silinən sətirin id dəyərini yazın.";
    return;
  }
  const result = await deleteAdminRow(value("[data-admin-table]"), id);
  if (notice) notice.textContent = result.ok ? "Sətir silindi." : `Silinmədi: ${result.message}`;
}

document.addEventListener("DOMContentLoaded", async () => {
  setupDataManager();
  await Promise.all([refreshProjects(), refreshCatalog()]);

  document.addEventListener("change", (event) => {
    if (event.target.matches("[data-catalog-row]")) {
      const row = catalogRows.find((item) => item.id === event.target.value);
      fillCatalogForm(row || {});
    }
  });

  document.addEventListener("click", async (event) => {
    if (event.target.closest("[data-add-deal]")) await addProject();
    if (event.target.closest("[data-save-catalog]")) await saveCatalog();
    if (event.target.closest("[data-new-catalog]")) fillCatalogForm({});
    if (event.target.closest("[data-delete-catalog]")) await removeCatalog();
    if (event.target.closest("[data-save-rate]")) await saveRate();
    if (event.target.closest("[data-load-table]")) await loadManagerRows();
    if (event.target.closest("[data-save-row]")) await saveManagerRow();
    if (event.target.closest("[data-delete-row]")) await deleteManagerRow();

    const statusButton = event.target.closest("[data-status-id]");
    if (statusButton) {
      const row = projectRows.find((item) => item.id === statusButton.dataset.statusId);
      const next = statuses[(statuses.indexOf(row?.status) + 1) % statuses.length] || "Lead";
      await updateProjectStatus(statusButton.dataset.statusId, next);
      await refreshProjects();
    }

    const deleteButton = event.target.closest("[data-delete-project]");
    if (deleteButton) {
      await deleteProject(deleteButton.dataset.deleteProject);
      await refreshProjects();
    }
  });

  window.addEventListener("resize", () => draw(by("[data-chart]"), projectRows));
});
