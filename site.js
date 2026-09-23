(()=> {
  const root = document.documentElement;
  const buttons = document.querySelectorAll("[data-language-button]");
  const storageKey = "foxlog-language";

  function savedLanguage() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === "hu" || saved === "en") return saved;
    } catch (_) {}
    return null;
  }

  function browserLanguage() {
    return (navigator.language || "").toLowerCase().startsWith("hu") ? "hu" : "en";
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

    if (persist) {
      try { localStorage.setItem(storageKey, value); } catch (_) {}
    }
  }

  setLanguage(savedLanguage() || browserLanguage(), false);

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