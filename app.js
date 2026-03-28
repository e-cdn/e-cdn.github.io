(async () => {
  // Registrar service worker
  if ('serviceWorker' in navigator) {
    await navigator.serviceWorker.register('/sw.js');
  }

  // Crear root si no existe
  let root = document.getElementById('app');
  if (!root) {
    root = document.createElement('div');
    root.id = 'app';
    document.body.appendChild(root);
  }

  // Router básico
  const routes = {
    "/": () => "<h1>Inicio</h1>",
    "/about": () => "<h1>About</h1>"
  };

  function render() {
    const path = location.pathname;
    root.innerHTML = (routes[path] || (() => "404"))();
  }

  window.addEventListener("popstate", render);

  window.navigate = (path) => {
    history.pushState({}, "", path);
    render();
  };

  render();
})();
