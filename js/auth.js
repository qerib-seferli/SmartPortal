// Bu fayl demo auth ekranında login, qeydiyyat və parolu unutdum tab-larını idarə edir.
import { applyLanguage, loadState } from "./core.js";
import { resetPassword, signIn, signUp, updatePassword } from "./supabase-client.js";

function activateTab(id) {
  document.querySelectorAll("[data-tab-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.tabPanel === id));
  document.querySelectorAll("[data-tab]").forEach((button) => button.classList.toggle("primary", button.dataset.tab === id));
}

document.addEventListener("DOMContentLoaded", () => {
  applyLanguage(loadState().lang);
  activateTab("login");
  document.addEventListener("click", async (event) => {
    const tab = event.target.closest("[data-tab]");
    if (tab) activateTab(tab.dataset.tab);
    const action = event.target.closest("[data-auth-action]");
    if (action) {
      const notice = document.querySelector("[data-auth-notice]");
      if (!notice) return;
      const active = document.querySelector("[data-tab-panel].active");
      const data = Object.fromEntries(new FormData(active).entries());
      notice.textContent = "Sorğu göndərilir...";
      let result;
      if (active?.dataset.tabPanel === "login") result = await signIn(data);
      if (active?.dataset.tabPanel === "register") result = await signUp(data);
      if (active?.dataset.tabPanel === "forgot") result = await resetPassword(data.email);
      if (active?.dataset.tabPanel === "update") result = await updatePassword(data.password);
      notice.textContent = result?.message || "Əməliyyat tamamlandı.";
      if (result?.ok && active?.dataset.tabPanel === "login") location.href = "portal.html";
    }
  });
});
