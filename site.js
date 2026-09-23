(() => {
  const root = document.documentElement;
  const buttons = document.querySelectorAll("[data-language-button]");
  const storageKey = "foxlog-language";

  function queryLanguage() {
    const value = new URLSearchParams(window.location.search).get("lang");
    return value === "hu" || value === "en" ? value : null;
  }

  function savedLanguage() {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved === "hu" || saved === "en" ? saved : null;
    } catch (_) {
      return null;
    }
  }

  function browserLanguage() {
    return (navigator.language || "").toLowerCase().startsWith("hu") ? "hu" : "en";
  }

  function updateInternalLinks(language) {
    document.querySelectorAll('a[href]').forEach(link => {
      const raw = link.getAttribute("href");
      if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) return;

      try {
        const url = new URL(raw, window.location.href);
        if (url.origin !== window.location.origin) return;
        url.searchParams.set("lang", language);
        link.href = url.href;
      } catch (_) {}
    });
  }

  function setLanguage(language, persist = true) {
    const value = language === "en" ? "en" : "hu";
    root.dataset.language = value;
    root.lang = value;

    buttons.forEach(button => {
      const active = button.dataset.languageButton === value;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    updateInternalLinks(value);

    if (persist) {
      try { localStorage.setItem(storageKey, value); } catch (_) {}

      const current = new URL(window.location.href);
      current.searchParams.set("lang", value);
      history.replaceState(null, "", current);
    }
  }

  setLanguage(queryLanguage() || savedLanguage() || browserLanguage(), false);

  buttons.forEach(button => {
    button.addEventListener("click", () => setLanguage(button.dataset.languageButton));
  });

  document.querySelectorAll("[data-copy-email]").forEach(button => {
    button.addEventListener("click", async () => {
      const email = button.dataset.copyEmail;
      const original = button.innerHTML;
      try {
        await navigator.clipboard.writeText(email);
        button.textContent = root.dataset.language === "hu"
          ? (button.dataset.copiedHu || "Másolva")
          : (button.dataset.copiedEn || "Copied");
        button.classList.add("copied");
        setTimeout(() => {
          button.innerHTML = original;
          button.classList.remove("copied");
        }, 1600);
      } catch (_) {
        window.location.href = "mailto:" + email;
      }
    });
  });
})();