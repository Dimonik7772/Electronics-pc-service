const faqItems = document.querySelectorAll(".faq-item");

const animateAnswer = (details, shouldOpen) => {
  const answer = details.querySelector(".faq-answer");

  if (!answer) return;

  // Скасовуємо попередню анімацію, якщо вона ще триває.
  answer.getAnimations().forEach((animation) => animation.cancel());

  if (shouldOpen) {
    details.open = true;

    answer.style.height = "0px";

    requestAnimationFrame(() => {
      answer.style.height = `${answer.scrollHeight}px`;
    });

    const onTransitionEnd = (event) => {
      if (event.propertyName !== "height") return;

      answer.style.height = "auto";
      answer.removeEventListener("transitionend", onTransitionEnd);
    };

    answer.addEventListener("transitionend", onTransitionEnd);

    return;
  }

  answer.style.height = `${answer.scrollHeight}px`;

  // Фіксуємо початкову висоту перед закриттям.
  answer.offsetHeight;

  answer.style.height = "0px";

  const onTransitionEnd = (event) => {
    if (event.propertyName !== "height") return;

    details.open = false;
    answer.removeEventListener("transitionend", onTransitionEnd);
  };

  answer.addEventListener("transitionend", onTransitionEnd);
};

faqItems.forEach((details) => {
  const summary = details.querySelector(".faq-question");
  const answer = details.querySelector(".faq-answer");

  if (!summary || !answer) return;

  answer.style.height = details.open ? `${answer.scrollHeight}px` : "0px";

  summary.addEventListener("click", (event) => {
    event.preventDefault();

    const shouldOpen = !details.open;

    if (shouldOpen) {
      faqItems.forEach((item) => {
        if (item !== details && item.open) {
          animateAnswer(item, false);
        }
      });
    }

    animateAnswer(details, shouldOpen);
  });
});
