const slider = document.querySelector(".testimonials-slider");

if (slider) {
  const track = slider.querySelector(".testimonials-track");
  const prevButton = slider.querySelector('[data-direction="prev"]');
  const nextButton = slider.querySelector('[data-direction="next"]');

  const updateButtons = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;

    prevButton.disabled = track.scrollLeft <= 1;
    nextButton.disabled = track.scrollLeft >= maxScroll - 1;
  };

  const scrollSlider = (direction) => {
    const card = track.querySelector(".testimonial-card");

    if (!card) return;

    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap) || 0;

    track.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  prevButton.addEventListener("click", () => scrollSlider(-1));
  nextButton.addEventListener("click", () => scrollSlider(1));

  track.addEventListener("scroll", updateButtons, { passive: true });

  window.addEventListener("resize", updateButtons);

  updateButtons();
}
