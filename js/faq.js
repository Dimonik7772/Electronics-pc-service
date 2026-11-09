const faqItems = document.querySelectorAll(".faq-item");

const openAnswer = (details) => {
  const answer = details.querySelector(".faq-answer");

  if (!answer) return;

  details.open = true;

  answer.style.height = "0px";

  requestAnimationFrame(() => {
    answer.style.height = `${answer.scrollHeight}px`;
  });

  answer.addEventListener(
    "transitionend",
    (event) => {
      if (event.propertyName !== "height") return;

      answer.style.height = "auto";
    },
    { once: true },
  );
};

const closeAnswer = (details) => {
  const answer = details.querySelector(".faq-answer");

  if (!answer) return;

  answer.style.height = `${answer.scrollHeight}px`;

  answer.offsetHeight;

  answer.style.height = "0px";

  answer.addEventListener(
    "transitionend",
    (event) => {
      if (event.propertyName !== "height") return;

      details.open = false;
    },
    { once: true },
  );
};

faqItems.forEach((details) => {
  const summary = details.querySelector(".faq-question");
  const answer = details.querySelector(".faq-answer");

  if (!summary || !answer) return;

  answer.style.height = details.open ? "auto" : "0px";

  summary.addEventListener("click", (event) => {
    event.preventDefault();

    if (details.open) {
      closeAnswer(details);
      return;
    }

    faqItems.forEach((item) => {
      if (item !== details && item.open) {
        closeAnswer(item);
      }
    });

    openAnswer(details);
  });
});
