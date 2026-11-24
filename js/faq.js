const faqItems = document.querySelectorAll(".faq-item");

const animations = new WeakMap();
const targetStates = new WeakMap();

const ANIMATION_DURATION = 300;
const ANIMATION_EASING = "ease-in-out";

const animateAnswer = (details, shouldOpen) => {
  const answer = details.querySelector(".faq-answer");

  if (!answer) return;

  const currentHeight = answer.getBoundingClientRect().height;

  const previousAnimation = animations.get(details);

  if (previousAnimation) {
    previousAnimation.cancel();
    animations.delete(details);
  }

  if (shouldOpen) {
    details.open = true;
  }

  answer.style.height = `${currentHeight}px`;

  const targetHeight = shouldOpen ? answer.scrollHeight : 0;

  const animation = answer.animate(
    [{ height: `${currentHeight}px` }, { height: `${targetHeight}px` }],
    {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
      fill: "forwards",
    },
  );

  animations.set(details, animation);

  animation.onfinish = () => {
    if (animations.get(details) !== animation) return;

    if (shouldOpen) {
      answer.style.height = "auto";
    } else {
      details.open = false;
      answer.style.height = "0px";
    }

    animations.delete(details);
  };
};

faqItems.forEach((details) => {
  const summary = details.querySelector(".faq-question");
  const answer = details.querySelector(".faq-answer");

  if (!summary || !answer) return;

  targetStates.set(details, details.open);

  answer.style.height = details.open ? "auto" : "0px";

  summary.addEventListener("click", (event) => {
    event.preventDefault();

    const shouldOpen = !(targetStates.get(details) ?? details.open);

    targetStates.set(details, shouldOpen);

    if (shouldOpen) {
      faqItems.forEach((item) => {
        if (item === details) return;

        const isTargetOpen = targetStates.get(item) ?? item.open;

        if (isTargetOpen) {
          targetStates.set(item, false);
          animateAnswer(item, false);
        }
      });
    }

    animateAnswer(details, shouldOpen);
  });
});
