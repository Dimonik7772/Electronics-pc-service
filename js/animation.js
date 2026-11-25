function splitTextIntoLetters(element) {
  const textNodes = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    if (walker.currentNode.textContent.trim()) {
      textNodes.push(walker.currentNode);
    }
  }

  let charIndex = 0;

  const segmenter =
    typeof Intl.Segmenter === "function"
      ? new Intl.Segmenter(undefined, {
          granularity: "grapheme",
        })
      : null;

  textNodes.forEach((textNode) => {
    const fragment = document.createDocumentFragment();
    const parts = textNode.textContent.match(/\s+|[^\s]+/gu) || [];

    parts.forEach((part) => {
      if (/^\s+$/u.test(part)) {
        fragment.append(document.createTextNode(part));
        return;
      }

      const word = document.createElement("span");
      word.className = "letter-word";

      const characters = segmenter
        ? [...segmenter.segment(part)].map(({ segment }) => segment)
        : Array.from(part);

      characters.forEach((character) => {
        const char = document.createElement("span");

        char.className = "letter-char";
        char.textContent = character;
        char.style.setProperty("--char-index", charIndex++);

        word.append(char);
      });

      fragment.append(word);
    });

    textNode.replaceWith(fragment);
  });
}

document
  .querySelectorAll(
    '[data-animation="title"] .title-line-inner, [data-animation="description"] .letter-animation',
  )
  .forEach(splitTextIntoLetters);

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
const animatedElements = document.querySelectorAll(
  '[data-animation]:not([data-animation="image"])',
);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

function revealAllElements() {
  animatedElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}

if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
  revealAllElements();
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
      threshold: 0.05,
      rootMargin: "0px 0px -5% 0px",
    },
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}
