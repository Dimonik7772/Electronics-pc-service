const brandsTrack = document.querySelector("#brands-track");
const brandsControls = document.querySelectorAll(".brands-arrow");

if (brandsTrack && brandsControls.length) {
  const updateBrandsControls = () => {
    const maxScroll = brandsTrack.scrollWidth - brandsTrack.clientWidth;

    brandsControls.forEach((button) => {
      const direction = button.dataset.direction;

      button.disabled =
        direction === "prev"
          ? brandsTrack.scrollLeft <= 1
          : brandsTrack.scrollLeft >= maxScroll - 1;
    });
  };

  brandsControls.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.direction;
      const firstCard = brandsTrack.querySelector(".brand-card");

      if (!firstCard) return;

      const cardWidth = firstCard.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(brandsTrack).gap) || 0;

      brandsTrack.scrollBy({
        left: direction === "next" ? cardWidth + gap : -(cardWidth + gap),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
  });

  brandsTrack.addEventListener("scroll", updateBrandsControls, {
    passive: true,
  });

  window.addEventListener("resize", updateBrandsControls);

  updateBrandsControls();
}
