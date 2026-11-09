const animatedElements = document.querySelectorAll("[data-animation]");

const cardGroups = new Map();

document.querySelectorAll('[data-animation="card"]').forEach((card) => {
  const parent = card.parentElement;

  if (!cardGroups.has(parent)) {
    cardGroups.set(parent, []);
  }

  cardGroups.get(parent).push(card);
});

cardGroups.forEach((cards) => {
  cards.forEach((card, index) => {
    const delay = Math.min(index * 100, 500);

    card.style.setProperty("--animation-delay", `${delay}ms`);
  });
});

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

if (prefersReducedMotion.matches) {
  animatedElements.forEach((element) => {
    element.classList.add("is-visible");
  });
} else {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0,
      rootMargin: "0px",
    },
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}
