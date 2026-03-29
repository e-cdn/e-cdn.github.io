// === e-core (app.js) ===
(() => {

  // =========================
  // SERVICE WORKER
  // =========================
  async function registerSW() {
    if (!('serviceWorker' in navigator)) return;

    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log("SW registrado");
    } catch (e) {
      console.warn("SW error:", e);
    }
  }

  // =========================
  // ROUTER
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
  // INIT
  // =========================
  async function init() {
    await registerSW();
    render();
  }

  init();

  // =========================
  // API
  // =========================
  window.eapp = {
    route,
    navigate
  };

})();
