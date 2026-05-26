// Bu fayl GLOBAL PRO ana səhifə, 480+ seçim kalkulyatoru və çoxdilli UI renderini idarə edir.
import { currencies, delivery, languages, serviceCatalog, stats, support } from "../data/catalog.js";
import { applyCatalogOverrides, applyLanguage, calculate, defaultState, loadState, money, payload, requestPushDemo, saveLead, saveState } from "./core.js";
import { loadCatalogOverrides, submitLeadToSupabase } from "./supabase-client.js";

let state = loadState();
const $ = (selector) => document.querySelector(selector);

const uiText = {
  az: { selected: "Seçilmiş modul", complexity: "Komplekslik", breadth: "Scope genişliyi", delivery: "Təhvil planı", support: "Aylıq dəstək", yearly: "İllik dəstək", ltv: "2 illik dəyər", noSupport: "Dəstək seçilməyib", profit: "Mənfəət", leadScore: "Lead score", days: "iş günü", platformHint: "Ana platforma tipini seçin.", groupHint: "seçim: lazım olan hər şeyi seçə bilərsiniz.", sending: "Lead göndərilir...", sent: "Lead Supabase CRM bazasına əlavə olundu.", demo: "Demo yaddaşa əlavə olundu.", name: "Ad Soyad", company: "Şirkət", phone: "Telefon", industry: "Sahə", notes: "Əlavə qeyd" },
  en: { selected: "Selected modules", complexity: "Complexity", breadth: "Scope breadth", delivery: "Delivery plan", support: "Monthly support", yearly: "Yearly support", ltv: "2-year value", noSupport: "No support selected", profit: "Profit", leadScore: "Lead score", days: "business days", platformHint: "Choose the main platform type.", groupHint: "options: select everything you need.", sending: "Sending lead...", sent: "Lead was added to Supabase CRM.", demo: "Added to demo storage.", name: "Full name", company: "Company", phone: "Phone", industry: "Industry", notes: "Notes" },
  tr: { selected: "Seçilen modül", complexity: "Karmaşıklık", breadth: "Scope genişliği", delivery: "Teslim planı", support: "Aylık destek", yearly: "Yıllık destek", ltv: "2 yıllık değer", noSupport: "Destek seçilmedi", profit: "Kâr", leadScore: "Lead skoru", days: "iş günü", platformHint: "Ana platform tipini seçin.", groupHint: "seçenek: ihtiyacınız olan her şeyi seçin.", sending: "Lead gönderiliyor...", sent: "Lead Supabase CRM'e eklendi.", demo: "Demo hafızaya eklendi.", name: "Ad Soyad", company: "Şirket", phone: "Telefon", industry: "Sektör", notes: "Notlar" },
  ru: { selected: "Выбранные модули", complexity: "Сложность", breadth: "Ширина scope", delivery: "План сдачи", support: "Ежемесячная поддержка", yearly: "Годовая поддержка", ltv: "Ценность за 2 года", noSupport: "Поддержка не выбрана", profit: "Прибыль", leadScore: "Оценка лида", days: "рабочих дней", platformHint: "Выберите тип платформы.", groupHint: "опций: выберите все нужное.", sending: "Отправка лида...", sent: "Лид добавлен в Supabase CRM.", demo: "Добавлено в demo storage.", name: "Имя", company: "Компания", phone: "Телефон", industry: "Сфера", notes: "Комментарий" }
};

const groupTranslations = {
  en: {
    platform: "Main platform", strategy: "Strategy and analysis", "ux-ui": "UI/UX system", frontend: "Frontend and motion", backend: "Backend and API", "auth-security": "Auth and security", "crm-sales": "CRM and sales", "client-portal": "Client portal", "erp-finance": "ERP and finance", ecommerce: "E-commerce", "ai-automation": "AI automation", "seo-growth": "SEO and growth", integrations: "Integrations", devops: "DevOps and performance", "content-media": "Content and media", industry: "Industry packages", advanced: "Global premium"
  },
  ru: {
    platform: "Основная платформа", strategy: "Стратегия и анализ", "ux-ui": "UI/UX система", frontend: "Frontend и анимация", backend: "Backend и API", "auth-security": "Auth и безопасность", "crm-sales": "CRM и продажи", "client-portal": "Кабинет клиента", "erp-finance": "ERP и финансы", ecommerce: "E-commerce", "ai-automation": "AI автоматизация", "seo-growth": "SEO и рост", integrations: "Интеграции", devops: "DevOps и производительность", "content-media": "Контент и медиа", industry: "Пакеты отраслей", advanced: "Global premium"
  },
  tr: {
    platform: "Ana platform", strategy: "Strateji ve analiz", "ux-ui": "UI/UX sistemi", frontend: "Frontend ve animasyon", backend: "Backend ve API", "auth-security": "Auth ve güvenlik", "crm-sales": "CRM ve satış", "client-portal": "Müşteri portalı", "erp-finance": "ERP ve finans", ecommerce: "E-ticaret", "ai-automation": "AI otomasyon", "seo-growth": "SEO ve growth", integrations: "Entegrasyonlar", devops: "DevOps ve performans", "content-media": "İçerik ve medya", industry: "Sektör paketleri", advanced: "Global premium"
  },
  fr: {
    platform: "Plateforme", strategy: "Stratégie", "ux-ui": "UI/UX", frontend: "Frontend", backend: "Backend/API", "auth-security": "Auth sécurité", "crm-sales": "CRM ventes", "client-portal": "Portail client", "erp-finance": "ERP finance", ecommerce: "E-commerce", "ai-automation": "Automatisation IA", "seo-growth": "SEO croissance", integrations: "Intégrations", devops: "DevOps", "content-media": "Contenu média", industry: "Industries", advanced: "Global premium"
  }
};

function groupTitle(group) {
  return (groupTranslations[state.lang] || {})[group.id] || group.title;
}

function ui(key) {
  return (uiText[state.lang] || uiText.en)[key] || uiText.en[key] || key;
}

function renderTopControls() {
  document.querySelectorAll("[data-lang-select]").forEach((node) => {
    node.innerHTML = languages.map((lang) => `<option value="${lang.id}">${lang.name}</option>`).join("");
    node.value = state.lang;
  });
  const currency = $("[data-currency]");
  const deliveryNode = $("[data-delivery]");
  const supportNode = $("[data-support]");
  if (currency) currency.innerHTML = Object.keys(currencies).map((id) => `<option value="${id}">${id}</option>`).join("");
  if (deliveryNode) deliveryNode.innerHTML = delivery.map((item) => `<option value="${item.id}">${item.title}</option>`).join("");
  if (supportNode) supportNode.innerHTML = support.map((item) => `<option value="${item.id}">${item.title}</option>`).join("");
  if (currency) currency.value = state.currency;
  if (deliveryNode) deliveryNode.value = state.delivery;
  if (supportNode) supportNode.value = state.support;
}

function renderStats() {
  const s = stats();
  const root = $("[data-stats]");
  if (!root) return;
  root.innerHTML = [
    [s.modules, "Seçim və modul"],
    [s.groups, "Böyük bölmə"],
    [s.languages, "Dil"],
    [s.currencies, "Valyuta"]
  ].map(([value, label]) => `<article class="stat glass"><strong>${value}+</strong><span>${label}</span></article>`).join("");
}

function renderGroups() {
  const root = $("[data-groups]");
  if (!root) return;
  root.innerHTML = serviceCatalog.map((group) => {
    const selected = state.selected[group.id];
    const count = Array.isArray(selected) ? selected.length : selected ? 1 : 0;
    return `<button class="group-tab ${group.id === state.activeGroup ? "active" : ""}" data-group="${group.id}"><span>${group.icon} ${groupTitle(group)}</span><strong>${count}</strong></button>`;
  }).join("");
}

function renderOptions() {
  const group = serviceCatalog.find((item) => item.id === state.activeGroup) || serviceCatalog[0];
  const title = $("[data-group-title]");
  const hint = $("[data-group-hint]");
  const root = $("[data-options]");
  if (!title || !hint || !root) return;
  title.textContent = `${group.icon} ${groupTitle(group)}`;
  hint.textContent = group.type === "radio" ? ui("platformHint") : `${group.items.length} ${ui("groupHint")}`;
  root.innerHTML = group.items.map((item) => {
    const checked = group.type === "radio" ? state.selected[group.id] === item.id : (state.selected[group.id] || []).includes(item.id);
    return `
      <label class="option">
        <span class="option-title">
          <input type="${group.type}" name="${group.id}" value="${item.id}" ${checked ? "checked" : ""}>
          <span>${item.title}</span>
        </span>
        <span class="pills">
          <span class="pill">${money(item.price, state.currency)}</span>
          <span class="pill">${item.days} gün</span>
          <span class="pill">x${item.complexity}</span>
        </span>
      </label>
    `;
  }).join("");
}

function renderSummary() {
  const metrics = calculate(state);
  const total = $("[data-total]");
  const summary = $("[data-summary]");
  const score = $("[data-score]");
  const payloadNode = $("[data-payload]");
  if (total) total.textContent = money(metrics.total, state.currency);
  if (score) score.style.setProperty("--value", `${metrics.score}%`);
  if (payloadNode) payloadNode.value = JSON.stringify(payload(state), null, 2);
  const notes = document.querySelector("[name='notes']");
  if (notes && !notes.dataset.touched) {
    const scope = metrics.items.map((item) => `- ${item.title}`).join("\n");
    notes.value = scope ? `Seçilənlər:\n${scope}` : "";
  }
  if (!summary) return;
  const supportRows = metrics.mrr
    ? `
    <div class="summary-row"><span>${ui("support")}</span><strong>${money(metrics.mrr, state.currency)}</strong></div>
    <div class="summary-row"><span>${ui("yearly")}</span><strong>${money(metrics.arr, state.currency)}</strong></div>
    <div class="summary-row"><span>${ui("ltv")}</span><strong>${money(metrics.ltv, state.currency)}</strong></div>`
    : `<div class="summary-row"><span>${ui("support")}</span><strong>${ui("noSupport")}</strong></div>`;
  summary.innerHTML = `
    <div class="summary-row"><span>${ui("selected")}</span><strong>${metrics.items.length}</strong></div>
    <div class="summary-row"><span>${ui("complexity")}</span><strong>x${metrics.complexity}</strong></div>
    <div class="summary-row"><span>${ui("breadth")}</span><strong>x${metrics.breadth}</strong></div>
    <div class="summary-row"><span>${ui("delivery")}</span><strong>${metrics.deliveryDays} ${ui("days")}</strong></div>
    ${supportRows}
    <div class="summary-row"><span>${ui("profit")}</span><strong>${money(metrics.profit, state.currency)} · ${metrics.margin}%</strong></div>
    <div class="summary-row"><span>${ui("leadScore")}</span><strong>${metrics.score}/100</strong></div>
  `;
}

function renderPlaceholders() {
  const map = { name: "name", company: "company", phone: "phone", industry: "industry", notes: "notes" };
  Object.entries(map).forEach(([name, key]) => {
    const node = document.querySelector(`[name='${name}']`);
    if (node) node.placeholder = ui(key);
  });
}

function addCustom() {
  const name = $("[data-custom-name]");
  const price = $("[data-custom-price]");
  const days = $("[data-custom-days]");
  if (!name?.value.trim()) return;
  state.custom.push({ id: `custom-${Date.now()}`, title: name.value.trim(), price: Number(price.value || 0), days: Number(days.value || 0), complexity: 1.1 });
  name.value = "";
  price.value = "";
  days.value = "";
  saveState(state);
  renderAll();
}

async function submitLead() {
  const form = $("[data-lead-form]");
  const notice = $("[data-notice]");
  if (!form || !notice) return;
  state.client = Object.fromEntries(new FormData(form).entries());
  saveState(state);
  saveLead(state);
  notice.textContent = ui("sending");
  const result = await submitLeadToSupabase(payload(state));
  notice.textContent = result.ok
    ? ui("sent")
    : `${ui("demo")} Supabase: ${result.message || "bağlantı yoxdur"}`;
  renderSummary();
}

function bind() {
  document.addEventListener("click", (event) => {
    const group = event.target.closest("[data-group]");
    if (group) {
      state.activeGroup = group.dataset.group;
      saveState(state);
      renderAll();
    }
    if (event.target.closest("[data-add-custom]")) addCustom();
    if (event.target.closest("[data-submit-lead]")) submitLead();
    if (event.target.closest("[data-reset]")) {
      state = defaultState();
      saveState(state);
      renderTopControls();
      renderAll();
    }
    if (event.target.closest("[data-push-demo]")) {
      requestPushDemo("SmartPortal xatırlatma", "Domain və aylıq ödəniş vaxtı yaxınlaşır.");
    }
  });

  document.addEventListener("change", (event) => {
    const input = event.target;
    if (input.matches("[data-lang-select]")) state.lang = input.value;
    if (input.matches("[data-currency]")) state.currency = input.value;
    if (input.matches("[data-delivery]")) state.delivery = input.value;
    if (input.matches("[data-support]")) state.support = input.value;
    if (input.matches("[data-options] input")) {
      const group = serviceCatalog.find((item) => item.id === state.activeGroup);
      if (group?.type === "radio") state.selected[group.id] = input.value;
      if (group?.type === "checkbox") {
        const set = new Set(state.selected[group.id] || []);
        input.checked ? set.add(input.value) : set.delete(input.value);
        state.selected[group.id] = [...set];
      }
    }
    saveState(state);
    applyLanguage(state.lang);
    renderAll();
  });

  document.addEventListener("input", (event) => {
    if (event.target.matches("[name='notes']")) event.target.dataset.touched = "true";
  });
}

function renderAll() {
  applyLanguage(state.lang);
  renderGroups();
  renderOptions();
  renderSummary();
  renderPlaceholders();
}

document.addEventListener("DOMContentLoaded", async () => {
  applyCatalogOverrides(await loadCatalogOverrides());
  renderTopControls();
  renderStats();
  bind();
  renderAll();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("public/service-worker.js").catch(() => {});
});
