// === MINI FRAMEWORK SPA + OFFLINE ===
(() => {

  const VERSION = "v1";
  const CACHE = "eapp-cache-" + VERSION;

  // =========================
  // SERVICE WORKER INLINE
  // =========================
  async function registerSW() {
    if (!('serviceWorker' in navigator)) return;

    const swCode = `
      const CACHE = "${CACHE}";

      self.addEventListener("install", e => {
        self.skipWaiting();
      });

      self.addEventListener("activate", e => {
        e.waitUntil(clients.claim());
      });

      self.addEventListener("fetch", e => {
        const url = new URL(e.request.url);

        // evitar cachear APIs
        if (url.pathname.startsWith("/api")) return;

        e.respondWith(
          caches.match(e.request).then(res => {
            return res || fetch(e.request).then(fetchRes => {
              return caches.open(CACHE).then(cache => {
                cache.put(e.request, fetchRes.clone());
                return fetchRes;
              });
            }).catch(() => {
              // fallback offline básico
              if (e.request.destination === "document") {
                return new Response("<h1>Offline</h1>", {
                  headers: { "Content-Type": "text/html" }
                });
              }
            });
          })
        );
      });
    `;

    const blob = new Blob([swCode], { type: "text/javascript" });
    const swURL = URL.createObjectURL(blob);

    try {
      await navigator.serviceWorker.register(swURL);
    } catch (e) {
      console.warn("SW error:", e);
    }
  }

  // =========================
  // ROUTER SPA
  // =========================
  const routes = {};

  function route(path, render) {
    routes[path] = render;
  }

  function render() {
    const root = getRoot();
    const path = location.pathname;

    if (routes[path]) {
      root.innerHTML = routes[path]();
    } else {
      root.innerHTML = "<h1>404</h1>";
    }
  }

  function navigate(path) {
    history.pushState({}, "", path);
    render();
  }

  window.navigate = navigate;

  window.addEventListener("popstate", render);

  // =========================
  // ROOT
  // =========================
  function getRoot() {
    let el = document.getElementById("app");

    if (!el) {
      el = document.createElement("div");
      el.id = "app";
      document.body.appendChild(el);
    }

    return el;
  }

  // =========================
  // COMPONENTES SIMPLES
  // =========================
  function component(fn) {
    return fn;
  }

  // =========================
  // AUTO INIT
  // =========================
  async function init() {
    await registerSW();

    // rutas básicas por defecto
    route("/", () => "<h1>Home</h1>");
    route("/about", () => "<h1>About</h1>");

    render();
  }

  init();

  // =========================
  // API GLOBAL
  // =========================
  window.eapp = {
    route,
    navigate,
    component
  };

})();
