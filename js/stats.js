const statsSection = document.querySelector(".stats");

if (statsSection) {
  const counters = statsSection.querySelectorAll("[data-target]");

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target);
    const suffix = counter.dataset.suffix || "";
    const duration = 2000;

    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(target * easeOut);

      counter.textContent = `${currentValue}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = `${target}${suffix}`;
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          counters.forEach(animateCounter);

          observer.unobserve(statsSection);
        }
      });
    },
    {
      threshold: 0.4,
    },
  );

  observer.observe(statsSection);
}
