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

const editableElements = document.querySelectorAll("[data-editable]");
const storagePrefix = `future-and-connection:${window.location.pathname}:`;
let saveTimeout;

const createEditorToolbar = () => {
  const toolbar = document.createElement("div");
  toolbar.className = "editor-toolbar";

  const status = document.createElement("div");
  status.className = "editor-status";
  status.textContent = "Editing enabled. Changes save automatically on this device.";

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "editor-button";
  saveButton.textContent = "Save";

  saveButton.addEventListener("click", () => {
    persistEditableContent();
  });

  toolbar.append(status, saveButton);
  document.body.append(toolbar);

  return status;
};

const statusLabel = createEditorToolbar();

const persistEditableContent = () => {
  editableElements.forEach((element) => {
    const key = `${storagePrefix}${element.dataset.editable}`;
    localStorage.setItem(key, element.innerHTML);
  });

  statusLabel.textContent = `Saved automatically at ${new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}.`;
};

editableElements.forEach((element) => {
  element.dataset.defaultContent = element.innerHTML;
  element.setAttribute("contenteditable", "true");
  element.setAttribute("spellcheck", "true");

  const storedValue = localStorage.getItem(`${storagePrefix}${element.dataset.editable}`);
  if (storedValue !== null) {
    element.innerHTML = storedValue;
  }

  element.addEventListener("input", () => {
    window.clearTimeout(saveTimeout);
    statusLabel.textContent = "Saving changes...";
    saveTimeout = window.setTimeout(persistEditableContent, 250);
  });

  element.addEventListener("blur", persistEditableContent);
});

if (editableElements.length > 0) {
  document.body.classList.add("editing-active");
}

const revealItems = document.querySelectorAll(".floating-panel, .detail-card");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.22,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => {
    item.classList.add("is-visible");
  });
}
