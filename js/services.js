const tabs = document.querySelectorAll(".services-tab");
const panels = document.querySelectorAll(".services-panel");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const targetId = tab.getAttribute("aria-controls");

    const targetPanel = document.getElementById(targetId);
    if (!targetPanel) return;

    tabs.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", false);
      item.setAttribute("tabindex", "0");
    });

    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    tab.setAttribute("tabindex", "0");

    panels.forEach((panel) => {
      panel.classList.remove("active");
      panel.hidden = true;
    });

    targetPanel.hidden = false;
    targetPanel.classList.add("active");
  });
});
