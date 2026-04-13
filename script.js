const dropdowns = document.querySelectorAll(".dropdown");

dropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector(".dropdown-toggle");

  if (!toggle) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = dropdown.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));

    dropdowns.forEach((otherDropdown) => {
      if (otherDropdown === dropdown) {
        return;
      }

      otherDropdown.classList.remove("is-open");
      const otherToggle = otherDropdown.querySelector(".dropdown-toggle");
      if (otherToggle) {
        otherToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
});

document.addEventListener("click", (event) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove("is-open");
      const toggle = dropdown.querySelector(".dropdown-toggle");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
      }
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("is-open");
      const toggle = dropdown.querySelector(".dropdown-toggle");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }
});
