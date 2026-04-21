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
const editableStorageVersion = "v2";
let saveTimeout;
let activeLanguage = "en";
let isApplyingLanguage = false;

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
  "/project-overview.html": {
    zh: {
      "project-overview-label": "项目概览",
      "project-overview-title": "从 2025 年的第一份报告，到 2026 年的下一阶段。",
      "project-overview-intro":
        "这一部分把项目正式放进网站里：2025 页面现在展示第一期项目的背景、环境、活动与结果，而 2026 页面介绍下一阶段的发展方向与长期规划。",
      "project-overview-subpage-link-1": "2025 项目报告",
      "project-overview-subpage-label-1": "子页面",
      "project-overview-subpage-copy-1":
        "新的概览文档第一部分已经整理成网页内容：项目为什么开始、为什么选择嵩门、三天项目中发生了什么，以及学生们产生了哪些变化。",
      "project-overview-subpage-link-2": "2026 项目",
      "project-overview-subpage-label-2": "子页面",
      "project-overview-subpage-copy-2":
        "文档第二部分也已放入网站内容中，重点呈现下一阶段：更深的持续性、课外拓展、结构化的身心健康课程、影像叙事，以及更可持续的 2026 模式。",
      "project-overview-pdf-label": "嵌入文档",
      "project-overview-pdf-title": "网页介绍项目概览",
      "project-overview-pdf-copy":
        "完整 PDF 已嵌入在下方，方便直接在这个页面里阅读整个项目概览。",
      "project-overview-pdf-open": "在新标签页打开 PDF",
    },
  },
};

const createEditorToolbar = () => {
  const toolbar = document.createElement("div");
  toolbar.className = "editor-toolbar";

  const meta = document.createElement("div");
  meta.className = "editor-meta";

  const title = document.createElement("div");
  title.className = "editor-title";
  title.textContent = "Page editor";

  const hint = document.createElement("div");
  hint.className = "editor-hint";
  hint.textContent = "Click any highlighted text to edit. Changes save on this device.";

  const status = document.createElement("div");
  status.className = "editor-status";
  status.textContent = "Ready";

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "editor-button";
  saveButton.textContent = "Save";

  saveButton.addEventListener("click", () => {
    persistEditableContent();
  });

  meta.append(title, hint, status);
  toolbar.append(meta, saveButton);
  document.body.append(toolbar);

  return status;
};

const statusLabel = createEditorToolbar();

const editableStorageKey = (editableId) =>
  `${storagePrefix}${editableStorageVersion}:${editableId}:en`;

const persistEditableContent = () => {
  editableElements.forEach((element) => {
    const contentToStore =
      activeLanguage === "zh" && element.dataset.enContent
        ? element.dataset.enContent
        : element.innerHTML;

    localStorage.setItem(editableStorageKey(element.dataset.editable), contentToStore);
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
  element.dataset.enContent = element.dataset.defaultContent;

  const storedValue = localStorage.getItem(editableStorageKey(element.dataset.editable));
  if (storedValue !== null) {
    element.innerHTML = storedValue;
    element.dataset.enContent = storedValue;
  }

  element.addEventListener("input", () => {
    if (isApplyingLanguage) {
      return;
    }

    if (activeLanguage === "en") {
      element.dataset.enContent = element.innerHTML;
    }

    window.clearTimeout(saveTimeout);
    statusLabel.textContent = "Saving changes...";
    saveTimeout = window.setTimeout(persistEditableContent, 250);
  });

  element.addEventListener("blur", () => {
    if (isApplyingLanguage) {
      return;
    }

    if (activeLanguage === "en") {
      element.dataset.enContent = element.innerHTML;
    }

    persistEditableContent();
  });
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

  isApplyingLanguage = true;

  editableElements.forEach((element) => {
    if (language === "zh" && translations?.[element.dataset.editable]) {
      element.innerHTML = translations[element.dataset.editable];
      return;
    }

    if (language === "en" && element.dataset.enContent) {
      element.innerHTML = element.dataset.enContent;
    }
  });

  isApplyingLanguage = false;
};

const applyLanguage = (language) => {
  activeLanguage = language;
  applyNavTranslations(language);
  applyPageTranslations(language);
  languageButton.textContent = language === "zh" ? "English" : "中文";
  languageButton.setAttribute("aria-pressed", String(language === "zh"));
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
};

languageButton.addEventListener("click", () => {
  const nextLanguage = activeLanguage === "zh" ? "en" : "zh";
  applyLanguage(nextLanguage);
});

applyLanguage("en");
window.addEventListener("pageshow", () => {
  applyLanguage("en");
});

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
