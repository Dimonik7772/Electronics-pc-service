const params = new URLSearchParams(window.location.search);
const status = params.get("success");

const toast = document.querySelector(".toast");

function showToast(message, type = "success") {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add(`is-visible${type === "error" ? "-error" : ""}`);
  toast.setAttribute("aria-hidden", "false");

  setTimeout(() => {
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
