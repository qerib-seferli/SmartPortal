// Bu fayl müştəri portalında domain, email, ödəniş, layihə və push xatırlatma kartlarını render edir.
import { applyLanguage, loadState, money, requestPushNotification } from "./core.js";
import { getSession, loadMyPortal, signOut } from "./supabase-client.js";

const portalText = {
  az: {
    home: "Ana səhifə", login: "Daxil ol", logout: "Çıxış", eyebrow: "Müştəri kabineti", title: "Layihə məlumatları", push: "Bildirişləri aktiv et",
    domains: "🌐 Domain və SSL", emails: "✉️ Email ünvanları", payments: "💳 Ödənişlər", projects: "🚀 Layihələr", docs: "📄 Sənədlər",
    ticket: "Yeni ticket", ticketText: "Dəyişiklik və texniki dəstək.", docsText: "Müqavilə, invoice və təhvil faylları.",
    expires: "Bitmə", active: "Aktiv", waiting: "Gözləyir", soon: "Yaxınlaşır", empty: "Məlumat hələ əlavə edilməyib. Admin paneldən müştəri layihəsinə real məlumat bağlayın."
  },
  en: {
    home: "Home", login: "Sign in", logout: "Sign out", eyebrow: "Client portal", title: "Project details", push: "Enable reminders",
    domains: "🌐 Domains and SSL", emails: "✉️ Email accounts", payments: "💳 Payments", projects: "🚀 Projects", docs: "📄 Documents",
    ticket: "New ticket", ticketText: "Changes and technical support.", docsText: "Contracts, invoices and delivery files.",
    expires: "Expires", active: "Active", waiting: "Pending", soon: "Due soon", empty: "No data has been added yet. Connect real client records from the admin panel."
  },
  ru: {
    home: "Главная", login: "Войти", logout: "Выйти", eyebrow: "Кабинет клиента", title: "Данные проекта", push: "Включить уведомления",
    domains: "🌐 Домены и SSL", emails: "✉️ Почтовые ящики", payments: "💳 Платежи", projects: "🚀 Проекты", docs: "📄 Документы",
    ticket: "Новый тикет", ticketText: "Изменения и техническая поддержка.", docsText: "Договоры, счета и файлы сдачи.",
    expires: "Истекает", active: "Активно", waiting: "Ожидает", soon: "Скоро", empty: "Данные пока не добавлены. Подключите реальные записи клиента из админ-панели."
  },
  tr: {
    home: "Ana sayfa", login: "Giriş", logout: "Çıkış", eyebrow: "Müşteri paneli", title: "Proje bilgileri", push: "Bildirimleri etkinleştir",
    domains: "🌐 Domain ve SSL", emails: "✉️ Email hesapları", payments: "💳 Ödemeler", projects: "🚀 Projeler", docs: "📄 Belgeler",
    ticket: "Yeni ticket", ticketText: "Değişiklik ve teknik destek.", docsText: "Sözleşme, fatura ve teslim dosyaları.",
    expires: "Bitiş", active: "Aktif", waiting: "Bekliyor", soon: "Yaklaşıyor", empty: "Henüz veri eklenmedi. Admin panelinden gerçek müşteri kayıtlarını bağlayın."
  }
};

function p(lang, key) {
  return (portalText[lang] || portalText.en)[key] || portalText.en[key] || key;
}

function localizePortal(lang) {
  document.querySelectorAll("[data-portal-i18n]").forEach((node) => {
    node.textContent = p(lang, node.dataset.portalI18n);
  });
}

function list(root, rows, renderer) {
  const node = document.querySelector(root);
  if (!node) return;
  node.innerHTML = rows.length ? rows.map(renderer).join("") : `<div class="list-item empty-state">${p(loadState().lang, "empty")}</div>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const state = loadState();
  const lang = state.lang;
  applyLanguage(lang);
  localizePortal(lang);
  const session = await getSession();
  const portal = session ? await loadMyPortal() : { ok: false };
  const remote = Array.isArray(portal.data) ? portal.data[0] : portal.data;
  const domains = remote?.domains?.map((item) => ({ domain: item.domain, expires: item.expires_at || "-", ssl: item.ssl_status || "unknown", hosting: "Managed" })) || [];
  const emails = remote?.mailboxes?.map((item) => ({ address: item.email, storage: `${item.storage_used_mb || 0} MB / ${item.storage_limit_mb || 0} MB`, status: item.status })) || [];
  const payments = remote?.invoices?.map((item) => ({ title: item.invoice_no, due: item.due_at || "-", amount: item.amount_azn || 0, status: item.status })) || [];
  const projects = remote?.projects?.map((item) => ({ title: item.title, progress: item.progress || 0, status: item.status || "-" })) || [];
  list("[data-domains]", domains, (item) => `<div class="list-item"><strong>${item.domain}</strong><p class="muted">${p(lang, "expires")}: ${item.expires} · SSL: ${item.ssl} · Hosting: ${item.hosting}</p></div>`);
  list("[data-emails]", emails, (item) => `<div class="list-item"><strong>${item.address}</strong><p class="muted">${item.storage} · ${item.status}</p></div>`);
  list("[data-payments]", payments, (item) => `<div class="list-item"><strong>${item.title}</strong><p class="muted">${item.due} · ${money(item.amount)} · ${item.status}</p></div>`);
  list("[data-projects]", projects, (item) => `<div class="list-item"><strong>${item.title}</strong><p class="muted">${item.status} · ${item.progress}%</p><div class="progress" style="--value:${item.progress}%"><span></span></div></div>`);
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-portal-push]")) requestPushNotification("Ödəniş xatırlatması", "Domain, hosting və SLA ödənişlərinizin vaxtı yaxınlaşır.");
    if (event.target.closest("[data-sign-out]")) signOut().then(() => location.href = "auth.html");
  });
});
