const services = document.querySelector(".services");

if (services) {
  const tabs = [...services.querySelectorAll(".services-tab")];
  const panels = [...services.querySelectorAll(".services-panel")];

  function activateTab(tab, moveFocus = false) {
    const targetId = tab.getAttribute("aria-controls");
    const targetPanel = services.querySelector(`#${targetId}`);

    if (!targetPanel) return;

    tabs.forEach((item) => {
      const isActive = item === tab;

      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
      item.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    panels.forEach((panel) => {
      const isActive = panel === targetPanel;

      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });

    if (moveFocus) {
      tab.focus();
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activateTab(tab);
    });

    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;

      switch (event.key) {
        case "ArrowDown":
          nextIndex = (index + 1) % tabs.length;
          break;

        case "ArrowUp":
          nextIndex = (index - 1 + tabs.length) % tabs.length;
          break;

        case "Home":
          nextIndex = 0;
          break;

        case "End":
          nextIndex = tabs.length - 1;
          break;

        default:
          return;
      }

      event.preventDefault();
      activateTab(tabs[nextIndex], true);
    });
  });
}
