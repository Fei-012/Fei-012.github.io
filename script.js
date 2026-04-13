const titleOverlay = document.querySelector("#titleOverlay");
const menuToggle = document.querySelector("#menuToggle");
const menuClose = document.querySelector("#menuClose");
const sideMenu = document.querySelector("#sideMenu");

const setMenuState = (isOpen) => {
  if (!sideMenu || !menuToggle) {
    return;
  }

  sideMenu.classList.toggle("is-open", isOpen);
  sideMenu.setAttribute("aria-hidden", String(!isOpen));
  menuToggle.setAttribute("aria-expanded", String(isOpen));
};

if (titleOverlay && menuToggle) {
  titleOverlay.addEventListener("click", () => {
    titleOverlay.classList.add("is-hidden");
    menuToggle.classList.remove("is-hidden");
  });
} else if (menuToggle) {
  menuToggle.classList.remove("is-hidden");
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = !sideMenu.classList.contains("is-open");
    setMenuState(isOpen);
  });
}

if (menuClose) {
  menuClose.addEventListener("click", () => {
    setMenuState(false);
  });
}

if (sideMenu) {
  sideMenu.addEventListener("click", (event) => {
    if (event.target === sideMenu) {
      setMenuState(false);
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuState(false);
  }
});
