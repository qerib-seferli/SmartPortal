// Bu fayl demo auth ekranında login, qeydiyyat və parolu unutdum tab-larını idarə edir.
import { applyLanguage, loadState } from "./core.js";
import { resetPassword, signIn, signUp, updatePassword } from "./supabase-client.js";

const authText = {
  az: {
    home: "Ana səhifə", portal: "Portal", eyebrow: "Müştəri girişi", title: "Giriş və qeydiyyat",
    login: "Daxil ol", register: "Qeydiyyat", forgot: "Parolu unutdum", newPassword: "Yeni parol",
    email: "Email", password: "Parol", fullName: "Ad Soyad", company: "Şirkət",
    loginAction: "Portala daxil ol", registerAction: "Hesab yarat", resetAction: "Reset link göndər", updateAction: "Parolu yenilə"
  },
  en: {
    home: "Home", portal: "Portal", eyebrow: "Client access", title: "Sign in or create account",
    login: "Sign in", register: "Register", forgot: "Forgot password", newPassword: "New password",
    email: "Email", password: "Password", fullName: "Full name", company: "Company",
    loginAction: "Open portal", registerAction: "Create account", resetAction: "Send reset link", updateAction: "Update password"
  },
  ru: {
    home: "Главная", portal: "Кабинет", eyebrow: "Доступ клиента", title: "Вход и регистрация",
    login: "Войти", register: "Регистрация", forgot: "Забыли пароль", newPassword: "Новый пароль",
    email: "Email", password: "Пароль", fullName: "Имя", company: "Компания",
    loginAction: "Открыть кабинет", registerAction: "Создать аккаунт", resetAction: "Отправить ссылку", updateAction: "Обновить пароль"
  },
  tr: {
    home: "Ana sayfa", portal: "Portal", eyebrow: "Müşteri girişi", title: "Giriş ve kayıt",
    login: "Giriş yap", register: "Kayıt", forgot: "Parolamı unuttum", newPassword: "Yeni parola",
    email: "Email", password: "Parola", fullName: "Ad Soyad", company: "Şirket",
    loginAction: "Portala gir", registerAction: "Hesap oluştur", resetAction: "Reset link gönder", updateAction: "Parolayı yenile"
  }
};

function localizeAuth(lang) {
  const dict = authText[lang] || authText.en;
  document.querySelectorAll("[data-auth-i18n]").forEach((node) => {
    node.textContent = dict[node.dataset.authI18n] || node.textContent;
  });
  document.querySelectorAll("[data-auth-placeholder]").forEach((node) => {
    node.placeholder = dict[node.dataset.authPlaceholder] || node.placeholder;
  });
}

function activateTab(id) {
  document.querySelectorAll("[data-tab-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.tabPanel === id));
  document.querySelectorAll("[data-tab]").forEach((button) => button.classList.toggle("primary", button.dataset.tab === id));
}

document.addEventListener("DOMContentLoaded", () => {
  const state = loadState();
  applyLanguage(state.lang);
  localizeAuth(state.lang);
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
