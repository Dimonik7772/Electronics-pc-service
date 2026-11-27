const params = new URLSearchParams(window.location.search);
const status = params.get("success");

const toast = document.querySelector(".toast");

let toastTimer;

function showToast(message, type = "success") {
  if (!toast) return;

  clearTimeout(toastTimer);

  toast.textContent = message;

  toast.classList.remove("is-visible", "is-visible-error");

  const toastClass = type === "error" ? "is-visible-error" : "is-visible";

  toast.classList.add(toastClass);
  toast.setAttribute("aria-hidden", "false");

  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible", "is-visible-error");
    toast.setAttribute("aria-hidden", "true");
  }, 4000);
}

if (status === "1") {
  showToast(CONFIG.successMessage);
} else if (status === "0") {
  showToast("Sorry, something went wrong. Please try again.", "error");
}

if (status === "1" || status === "0") {
  params.delete("success");

  const query = params.toString();

  const newUrl = query
    ? `${window.location.pathname}?${query}${window.location.hash}`
    : `${window.location.pathname}${window.location.hash}`;

  window.history.replaceState({}, "", newUrl);
}
