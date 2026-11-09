document.querySelectorAll("[data-slider]").forEach((slider) => {
  const track = slider.querySelector("[data-slider-track]");
  const prevButton = slider.querySelector("[data-slider-prev]");
  const nextButton = slider.querySelector("[data-slider-next]");

  if (!track || !prevButton || !nextButton) return;

  const getScrollStep = () => {
    const card = track.querySelector(".problem-card");

    if (!card) return 0;

    const gap = parseFloat(getComputedStyle(track).gap) || 0;

    return card.getBoundingClientRect().width + gap;
  };

  const updateButtons = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;

    prevButton.disabled = track.scrollLeft <= 1;
    nextButton.disabled = track.scrollLeft >= maxScroll - 1;
  };

  prevButton.addEventListener("click", () => {
    track.scrollBy({
      left: -getScrollStep(),
      behavior: "smooth",
    });
  });

  nextButton.addEventListener("click", () => {
    track.scrollBy({
      left: getScrollStep(),
      behavior: "smooth",
    });
  });

  track.addEventListener("scroll", updateButtons, { passive: true });

  window.addEventListener("resize", updateButtons);

  updateButtons();
});
