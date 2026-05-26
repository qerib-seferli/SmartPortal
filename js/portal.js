// Bu fayl müştəri portalında domain, email, ödəniş, layihə və push xatırlatma kartlarını render edir.
import { demoCustomerAssets } from "../data/catalog.js";
import { applyLanguage, loadState, money, requestPushDemo } from "./core.js";
import { getSession, loadMyPortal, signOut } from "./supabase-client.js";

function list(root, rows, renderer) {
  const node = document.querySelector(root);
  if (node) node.innerHTML = rows.map(renderer).join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  applyLanguage(loadState().lang);
  const session = await getSession();
  const portal = session ? await loadMyPortal() : { ok: false };
  const remote = Array.isArray(portal.data) ? portal.data[0] : portal.data;
  const domains = remote?.domains?.map((item) => ({ domain: item.domain, expires: item.expires_at || "planlaşdırılır", ssl: item.ssl_status || "unknown", hosting: "Managed" })) || demoCustomerAssets.domains;
  const emails = remote?.mailboxes?.map((item) => ({ address: item.email, storage: `${item.storage_used_mb || 0} MB / ${item.storage_limit_mb || 0} MB`, status: item.status })) || demoCustomerAssets.emails;
  const payments = remote?.invoices?.map((item) => ({ title: item.invoice_no, due: item.due_at || "planlaşdırılır", amount: item.amount_azn || 0, status: item.status })) || demoCustomerAssets.payments;
  list("[data-domains]", domains, (item) => `<div class="list-item"><strong>${item.domain}</strong><p class="muted">Bitmə: ${item.expires} · SSL: ${item.ssl} · Hosting: ${item.hosting}</p></div>`);
  list("[data-emails]", emails, (item) => `<div class="list-item"><strong>${item.address}</strong><p class="muted">${item.storage} · ${item.status}</p></div>`);
  list("[data-payments]", payments, (item) => `<div class="list-item"><strong>${item.title}</strong><p class="muted">${item.due} · ${money(item.amount)} · ${item.status}</p></div>`);
  list("[data-projects]", demoCustomerAssets.projects, (item) => `<div class="list-item"><strong>${item.title}</strong><p class="muted">${item.status} · ${item.progress}%</p><div class="progress" style="--value:${item.progress}%"><span></span></div></div>`);
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-portal-push]")) requestPushDemo("Ödəniş xatırlatması", "Domain, hosting və SLA ödənişlərinizin vaxtı yaxınlaşır.");
    if (event.target.closest("[data-sign-out]")) signOut().then(() => location.href = "auth.html");
  });
});
