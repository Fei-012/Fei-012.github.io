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

const navTranslations = {
  en: {
    home: "Home",
    menu: "Menu",
    more: "More",
    "./project-overview.html": "Project Overview",
    "./curricular-activities.html": "Curricular Activities",
    "./stories.html": "Stories",
    "./grants.html": "Grant Applications",
    "./visuals.html": "Visuals",
  },
  zh: {
    home: "首页",
    menu: "菜单",
    more: "更多",
    "./project-overview.html": "项目概览",
    "./curricular-activities.html": "课程活动",
    "./stories.html": "故事",
    "./grants.html": "资助申请",
    "./visuals.html": "视觉资料",
  },
};

const pageTranslations = {
  "/index.html": {
    zh: {
      "home-subline": "一个安静展开的项目开场，以及它所打开的空间。",
      "home-intro-copy":
        "Future and Connection 介绍了一个以流动儿童为中心的教育项目，从氛围开始，再慢慢打开这项工作的具体材料与实践。",
      "home-paths-kicker": "项目路径",
      "home-paths-heading": "进入这项工作的三个方向。",
      "home-path-report": "项目概览",
      "home-path-report-copy": "对项目、它的目标、时间线以及不同年份发展过程的整体介绍。",
      "home-path-planning": "课程活动",
      "home-path-planning-copy": "一个放置工作坊、课堂想法与活动结构的空间，它们共同塑造了教育体验。",
      "home-path-projects": "故事",
      "home-path-projects-copy": "一个承载声音、反思与叙述的地方，让项目中更具人的一面被看见。",
      "home-footer-title": "保持联系。",
    },
  },
  "/": {
    zh: {
      "home-subline": "一个安静展开的项目开场，以及它所打开的空间。",
      "home-intro-copy":
        "Future and Connection 介绍了一个以流动儿童为中心的教育项目，从氛围开始，再慢慢打开这项工作的具体材料与实践。",
      "home-paths-kicker": "项目路径",
      "home-paths-heading": "进入这项工作的三个方向。",
      "home-path-report": "项目概览",
      "home-path-report-copy": "对项目、它的目标、时间线以及不同年份发展过程的整体介绍。",
      "home-path-planning": "课程活动",
      "home-path-planning-copy": "一个放置工作坊、课堂想法与活动结构的空间，它们共同塑造了教育体验。",
      "home-path-projects": "故事",
      "home-path-projects-copy": "一个承载声音、反思与叙述的地方，让项目中更具人的一面被看见。",
      "home-footer-title": "保持联系。",
    },
  },
};

const languageStorageKey = "future-and-connection:language";

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

  element.dataset.enContent = element.innerHTML;

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

const createLanguageSwitch = () => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "language-switch";
  button.setAttribute("aria-pressed", "false");
  document.body.append(button);
  return button;
};

const languageButton = createLanguageSwitch();

const applyNavTranslations = (language) => {
  const homeLink = document.querySelector('.top-nav a.nav-link-pill[href="./index.html"]');
  if (homeLink) {
    homeLink.textContent = navTranslations[language].home;
  }

  const menuToggle = document.getElementById("menuToggle");
  const moreToggle = document.getElementById("moreToggle");

  if (menuToggle) {
    menuToggle.textContent = navTranslations[language].menu;
  }

  if (moreToggle) {
    moreToggle.textContent = navTranslations[language].more;
  }

  document.querySelectorAll(".dropdown-panel a").forEach((link) => {
    const translatedLabel = navTranslations[language][link.getAttribute("href")];
    if (translatedLabel) {
      link.textContent = translatedLabel;
    }
  });
};

const applyPageTranslations = (language) => {
  const translations = pageTranslations[window.location.pathname]?.[language];

  editableElements.forEach((element) => {
    if (language === "zh" && translations?.[element.dataset.editable]) {
      element.innerHTML = translations[element.dataset.editable];
      return;
    }

    if (language === "en" && element.dataset.enContent) {
      element.innerHTML = element.dataset.enContent;
    }
  });
};

const applyLanguage = (language) => {
  applyNavTranslations(language);
  applyPageTranslations(language);
  languageButton.textContent = language === "zh" ? "English" : "中文";
  languageButton.setAttribute("aria-pressed", String(language === "zh"));
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  window.localStorage.setItem(languageStorageKey, language);
};

languageButton.addEventListener("click", () => {
  const nextLanguage =
    window.localStorage.getItem(languageStorageKey) === "zh" ? "en" : "zh";
  applyLanguage(nextLanguage);
});

applyLanguage(window.localStorage.getItem(languageStorageKey) === "zh" ? "zh" : "en");

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
