// Bu fayl müştəri portalında domain, email, ödəniş, layihə və push xatırlatma kartlarını render edir.
import { demoCustomerAssets } from "../data/catalog.js";
import { applyLanguage, loadState, money, requestPushDemo } from "./core.js";

function list(root, rows, renderer) {
  const node = document.querySelector(root);
  if (node) node.innerHTML = rows.map(renderer).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  applyLanguage(loadState().lang);
  list("[data-domains]", demoCustomerAssets.domains, (item) => `<div class="list-item"><strong>${item.domain}</strong><p class="muted">Bitmə: ${item.expires} · SSL: ${item.ssl} · Hosting: ${item.hosting}</p></div>`);
  list("[data-emails]", demoCustomerAssets.emails, (item) => `<div class="list-item"><strong>${item.address}</strong><p class="muted">${item.storage} · ${item.status}</p></div>`);
  list("[data-payments]", demoCustomerAssets.payments, (item) => `<div class="list-item"><strong>${item.title}</strong><p class="muted">${item.due} · ${money(item.amount)} · ${item.status}</p></div>`);
  list("[data-projects]", demoCustomerAssets.projects, (item) => `<div class="list-item"><strong>${item.title}</strong><p class="muted">${item.status} · ${item.progress}%</p><div class="progress" style="--value:${item.progress}%"><span></span></div></div>`);
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-portal-push]")) requestPushDemo("Ödəniş xatırlatması", "Domain, hosting və SLA ödənişlərinizin vaxtı yaxınlaşır.");
  });
});
