// ANCHOR Site Bootstrapping
(function () {
  // SECTION HTML Injection
  async function inject(selector, url) {
    const host = document.querySelector(selector);
    if (!host) return;
    try {
      const res = await fetch(url, { credentials: "same-origin" });
      if (!res.ok) throw new Error("Failed to fetch " + url);
      host.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
    }
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

  // SECTION Desktop Layout Wrapper
  function wrapForDesktop() {
    const sidebar = document.getElementById("sidebar");
    const main = document.querySelector("main");
    if (!sidebar || !main) return;

    if (sidebar.parentElement.classList.contains("page-wrapper")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "page-wrapper";
    main.parentNode.insertBefore(wrapper, main);
    wrapper.appendChild(sidebar);
    wrapper.appendChild(main);
  }
  // /SECTION Desktop Layout Wrapper

  // SECTION Boot Sequence
  async function boot() {
    await Promise.all([
      inject("#include-nav", "/partials/nav.html"),
      inject("#include-footer", "/partials/footer.html"),
    ]);
    markCurrent();
    wrapForDesktop();
    sidebarEnhance();
  }

  document.addEventListener("DOMContentLoaded", boot);
  // TODO: consider restoring focus to the toggle when sidebar closes via backdrop.
  // /SECTION Boot Sequence
})();


