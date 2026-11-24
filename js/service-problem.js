const slider = document.querySelector("[data-slider]");

if (slider) {
  const track = slider.querySelector("[data-slider-track]");
  const prevButton = slider.querySelector("[data-slider-prev]");
  const nextButton = slider.querySelector("[data-slider-next]");
  const currentCounter = slider.querySelector("[data-slider-current]");

  if (track && prevButton && nextButton && currentCounter) {
    const cards = [...track.children];

    const getStep = () => {
      if (cards.length < 2) {
        return cards[0]?.getBoundingClientRect().width ?? 0;
      }

      return cards[1].offsetLeft - cards[0].offsetLeft;
    };

    const updateSlider = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const currentScroll = track.scrollLeft;

      prevButton.disabled = currentScroll <= 1;
      nextButton.disabled = currentScroll >= maxScroll - 1;

      const step = getStep();

      if (step > 0) {
        const currentIndex = Math.round(currentScroll / step);
        const currentCard = Math.min(currentIndex + 1, cards.length);

        currentCounter.textContent = String(currentCard).padStart(2, "0");
      }
    };

    prevButton.addEventListener("click", () => {
      track.scrollBy({
        left: -getStep(),
        behavior: "smooth",
      });
    });

    nextButton.addEventListener("click", () => {
      track.scrollBy({
        left: getStep(),
        behavior: "smooth",
      });
    });

    track.addEventListener("scroll", updateSlider, {
      passive: true,
    });

    window.addEventListener("resize", updateSlider);

    updateSlider();
  }
}
