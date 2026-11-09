import CONFIG from "../config/config.js";

function applyConfig() {
  const page = document.body.dataset.page;

  document.title = CONFIG.pageTitles[page] ?? CONFIG.title;
  document.querySelectorAll("[data-logo]").forEach((el) => {
    el.textContent = CONFIG.logo;
  });

  document.querySelectorAll("[data-email]").forEach((el) => {
    el.textContent = CONFIG.email;

    if (el.tagName === "A") {
      el.href = `mailto:${CONFIG.email}`;
    }
  });

  document.querySelectorAll("[data-disclaimer]").forEach((el) => {
    el.textContent = CONFIG.disclaimer;
  });
}
applyConfig();
