// Bu modul GLOBAL PRO kalkulyatorunun qiymət, müddət, CRM payload və lokal ehtiyat data məntiqini idarə edir.
import { currencies, delivery, i18n, languages, serviceCatalog, support } from "../data/catalog.js";

// Başlanğıc seçim vəziyyəti bütün səhifələr üçün eyni localStorage açarı ilə saxlanılır.
export function defaultState() {
  return {
    lang: "az",
    currency: "AZN",
    delivery: "30d",
    support: "none",
    activeGroup: "platform",
    selected: {},
    custom: [],
    client: {},
    _schemaVersion: 3
  };
}

export function loadState() {
  const stored = JSON.parse(localStorage.getItem("sp_global_state") || "{}");
  const state = { ...defaultState(), ...stored };
  if (stored._schemaVersion !== 3) {
    state.support = "none";
    state.selected = {};
    state.custom = [];
    state._schemaVersion = 3;
  }
  return state;
}

export function saveState(state) {
  localStorage.setItem("sp_global_state", JSON.stringify(state));
}

export function t(lang, key) {
  return (i18n[lang] || i18n.en || i18n.az)[key] || i18n.en?.[key] || i18n.az[key] || key;
}

export function applyLanguage(lang) {
  const meta = languages.find((item) => item.id === lang) || languages[0];
  document.documentElement.lang = meta.id;
  document.body.dir = meta.dir;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(meta.id, node.dataset.i18n);
  });
}

export function applyCatalogOverrides(overrides = []) {
  serviceCatalog.length = 0;
  const groups = new Map();
  overrides
    .filter((item) => item?.active !== false)
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
    .forEach((item) => {
      const groupKey = item.group_key || "custom";
      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          id: groupKey,
          icon: item.icon || "▫",
          title: item.group_title || groupKey,
          type: item.group_type || (groupKey === "platform" ? "radio" : "checkbox"),
          translations: item.translations?.groups || {},
          items: []
        });
      }
      groups.get(groupKey).items.push({
        id: item.module_key,
        title: item.module_title,
        price: Number(item.price_azn || 0),
        days: Number(item.days || 0),
        complexity: Number(item.complexity || 1),
        translations: item.translations?.modules || item.translations || {}
      });
    });
  serviceCatalog.push(...groups.values());
}

export function applyCurrencyRates(rows = []) {
  rows.forEach((row) => {
    if (!row?.code || !row?.rate_to_azn) return;
    currencies[row.code] = {
      symbol: row.symbol || row.code,
      rate: 1 / Number(row.rate_to_azn)
    };
  });
}

export function money(value, currency = "AZN") {
  const meta = currencies[currency] || currencies.AZN;
  return `${meta.symbol}${Math.round(value * meta.rate).toLocaleString("az-AZ")}`;
}

export function selectedItems(state) {
  const items = [];
  serviceCatalog.forEach((group) => {
    const value = state.selected[group.id];
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach((id) => {
        const found = group.items.find((item) => item.id === id);
        if (found) items.push({ ...found, group: group.id, groupTitle: group.title });
      });
    } else {
      const found = group.items.find((item) => item.id === value);
      if (found) items.push({ ...found, group: group.id, groupTitle: group.title });
    }
  });
  state.custom.forEach((item) => items.push({ ...item, group: "custom", groupTitle: "Custom", complexity: 1.08 }));
  return items;
}

export function calculate(state) {
  const deliveryMode = delivery.find((item) => item.id === state.delivery) || delivery[2];
  const supportPlan = support.find((item) => item.id === state.support) || support[0];
  const items = selectedItems(state);
  const platformItems = items.filter((item) => item.group === "platform");
  const addonItems = items.filter((item) => item.group !== "platform");
  const platformRaw = platformItems.reduce((sum, item) => sum + item.price, 0);
  const addonRaw = addonItems.reduce((sum, item) => sum + item.price, 0);
  const raw = platformRaw + addonRaw;
  const days = items.reduce((sum, item) => sum + item.days, 0);
  const complexity = addonItems.length ? Math.min(3.8, addonItems.reduce((factor, item) => factor * (item.complexity || 1), 1)) : 1;
  const breadth = Math.min(1.9, 1 + Math.max(0, items.length - 18) * 0.018);
  const platformTotal = platformRaw;
  const addonTotal = addonRaw;
  const total = Math.round((platformTotal + addonTotal) * deliveryMode.multiplier);
  const calculatedDays = Math.ceil(days * deliveryMode.factor);
  const deliveryMinimums = { "7d": 7, "14d": 14, "30d": 30, "45d": 45, "60d": 60 };
  const deliveryDays = Math.max(deliveryMinimums[state.delivery] || 30, calculatedDays);
  const mrr = supportPlan.monthly;
  const arr = mrr * 12;
  const infrastructure = Math.round(total * 0.17 + items.length * 22 + mrr * 0.24);
  const profit = Math.max(0, total - infrastructure);
  const margin = total ? Number(((profit / total) * 100).toFixed(1)) : 0;
  const score = Math.min(100, Math.round(18 + items.length * 1.25 + total / 1200 + (mrr ? 9 : 0)));
  const ltv = Math.round(total + arr * 2.6);
  return { deliveryMode, supportPlan, items, raw, complexity: Number(complexity.toFixed(3)), breadth: Number(breadth.toFixed(3)), total, deliveryDays, mrr, arr, infrastructure, profit, margin, score, ltv };
}

export function payload(state) {
  const metrics = calculate(state);
  return {
    client: state.client,
    deal: {
      status: "Lead",
      score: metrics.score,
      currency: state.currency,
      total_azn: metrics.total,
      total_display: money(metrics.total, state.currency),
      delivery_days: metrics.deliveryDays,
      mrr_azn: metrics.mrr,
      arr_azn: metrics.arr,
      ltv_azn: metrics.ltv,
      profit_azn: metrics.profit,
      margin_percent: metrics.margin
    },
    selections: metrics.items.map((item) => ({
      group_key: item.group,
      group_title: item.groupTitle,
      module_key: item.id,
      module_title: item.title,
      price_azn: item.price,
      days: item.days,
      complexity: item.complexity
    })),
    portal_assets: {
      domains: [],
      emails: [],
      subscriptions: [],
      payment_reminders: []
    },
    contract: {
      payment_terms: "40% başlanğıc, 40% development milestone, 20% launch",
      warranty_days: 30,
      support_plan: metrics.supportPlan.title,
      scope_summary: metrics.items.map((item) => item.title).join("; ")
    },
    created_at: new Date().toISOString()
  };
}

export function saveLead(state) {
  const leads = JSON.parse(localStorage.getItem("sp_global_leads") || "[]");
  leads.unshift({ ...payload(state), local_id: crypto.randomUUID() });
  localStorage.setItem("sp_global_leads", JSON.stringify(leads));
}

export function loadLeads() {
  return JSON.parse(localStorage.getItem("sp_global_leads") || "[]");
}

export function requestPushNotification(title, body) {
  if (!("Notification" in window)) return Promise.resolve("unsupported");
  return Notification.requestPermission().then((permission) => {
    if (permission === "granted") new Notification(title, { body, icon: "public/assets/icon.svg" });
    return permission;
  });
}
