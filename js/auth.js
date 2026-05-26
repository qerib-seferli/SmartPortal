// Bu fayl demo auth ekranında login, qeydiyyat və parolu unutdum tab-larını idarə edir.
import { applyLanguage, loadState } from "./core.js";

function activateTab(id) {
  document.querySelectorAll("[data-tab-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.tabPanel === id));
  document.querySelectorAll("[data-tab]").forEach((button) => button.classList.toggle("primary", button.dataset.tab === id));
}

document.addEventListener("DOMContentLoaded", () => {
  applyLanguage(loadState().lang);
  activateTab("login");
  document.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-tab]");
    if (tab) activateTab(tab.dataset.tab);
    const action = event.target.closest("[data-auth-action]");
    if (action) {
      const notice = document.querySelector("[data-auth-notice]");
      if (notice) notice.textContent = "Demo rejim: Supabase Auth qoşulanda bu forma real sessiya yaradacaq.";
    }
  });
});
