const preloader = document.querySelector("#preloader");

window.addEventListener("load", () => {
  preloader?.classList.add("is-hidden");

  setTimeout(() => {
    document.body.classList.add("is-loaded");
  }, 250);
});
