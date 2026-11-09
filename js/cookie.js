const cookieConsent = document.querySelector("#cookieConsent");

const COOKIE_KEY = "cookie-consent";

const acceptButton = document.querySelector("#acceptCookies");
const rejectButton = document.querySelector("#rejectCookies");
const closeButton = document.querySelector("#closeCookies");

const savedConsent = localStorage.getItem(COOKIE_KEY);

if (savedConsent === null) {
  cookieConsent.hidden = false;
}

acceptButton?.addEventListener("click", () => {
  localStorage.setItem(COOKIE_KEY, "true");
  cookieConsent.hidden = true;
});

rejectButton?.addEventListener("click", () => {
  localStorage.setItem(COOKIE_KEY, "false");
  cookieConsent.hidden = true;
});

closeButton?.addEventListener("click", () => {
  cookieConsent.hidden = true;
});
