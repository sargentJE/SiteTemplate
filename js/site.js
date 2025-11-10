// ANCHOR Site Bootstrapping
(function () {
  // SECTION HTML Injection
  async function inject(selector, url) {
    const mount = document.querySelector(selector);
    if (!mount) return;

    const res = await fetch(url, { credentials: "same-origin" });
    if (!res.ok) throw new Error("Failed to fetch " + url);
    mount.innerHTML = await res.text();
    return mount;
  }
  // /SECTION HTML Injection

  // SECTION Active Link Highlight
  function markCurrent() {
    const path = location.pathname.replace(/\/index\.html$/, "/");
    const links = document.querySelectorAll(".sidebar-nav a, .primary-nav a");
    links.forEach((link) => {
      const sanitized = (link.getAttribute("href") || "").replace(/\/index\.html$/, "/");
      if (sanitized === path) link.setAttribute("aria-current", "page");
    });
  }
  // /SECTION Active Link Highlight

  // SECTION Sidebar Behaviour
  function sidebarEnhance() {
    const sidebar = document.getElementById("sidebar");
    const toggle = document.getElementById("navToggle");
    if (!sidebar || !toggle) return;

    const backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    document.body.appendChild(backdrop);

    const open = () => {
      sidebar.classList.add("open");
      backdrop.classList.add("active");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close navigation");
      document.body.classList.add("no-scroll");
    };

    const close = () => {
      sidebar.classList.remove("open");
      backdrop.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      document.body.classList.remove("no-scroll");
    };

    toggle.addEventListener("click", () => {
      sidebar.classList.contains("open") ? close() : open();
    });

    backdrop.addEventListener("click", close);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && sidebar.classList.contains("open")) {
        close();
      }
    });
  }
  // /SECTION Sidebar Behaviour

  // SECTION Footer Year Stamp
  function stampYear() {
    const yearNode = document.getElementById("year");
    if (yearNode) {
      yearNode.textContent = new Date().getFullYear();
    }
  }
  // /SECTION Footer Year Stamp

  // SECTION Layout Composition
  function composeShell() {
    const appShell = document.querySelector(".app-shell");
    const layoutRoot = document.querySelector("[data-layout-root]");
    const navMount = document.getElementById("include-nav");
    if (!appShell || !layoutRoot || !navMount) return;

    const header = navMount.querySelector(".site-header");
  const sidebar = navMount.querySelector(".site-sidebar");
  const main = layoutRoot.querySelector("main");

    if (header) {
      appShell.insertBefore(header, layoutRoot);
    }

    if (sidebar && main) {
      layoutRoot.insertBefore(sidebar, main);
    } else if (sidebar) {
      layoutRoot.insertBefore(sidebar, layoutRoot.firstChild || null);
    }

    navMount.remove();
  }

  function composeFooter() {
    const footerMount = document.getElementById("include-footer");
    if (!footerMount) return;

    const footer = footerMount.querySelector(".site-footer");
    if (footer) {
      footerMount.parentNode.insertBefore(footer, footerMount);
    }

    footerMount.remove();
  }
  // /SECTION Layout Composition

  // SECTION Boot Sequence
  async function boot() {
    try {
      await Promise.all([
        inject("#include-nav", "/partials/nav.html"),
        inject("#include-footer", "/partials/footer.html"),
      ]);
    } catch (err) {
      console.error(err);
    }

    composeShell();
    composeFooter();
    markCurrent();
    sidebarEnhance();
    stampYear();
  }

  document.addEventListener("DOMContentLoaded", () => {
    boot().catch((err) => console.error(err));
  });
  // TODO: consider restoring focus to the toggle when sidebar closes via backdrop.
  // /SECTION Boot Sequence
})();


