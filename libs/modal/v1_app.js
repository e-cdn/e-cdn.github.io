// === e-modal.js ===
(() => {

  // =========================
  // CSS INYECTADO
  // =========================
  const style = document.createElement("style");
  style.innerHTML = `
    .e-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .e-modal {
      background: #1e1e1e;
      color: white;
      padding: 20px;
      border-radius: 12px;
      min-width: 250px;
      max-width: 90%;
      transform: scale(0.8);
      transition: all 0.3s;
      font-family: Arial;
    }

    .e-modal.light {
      background: white;
      color: black;
    }

    .e-modal.glass {
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
    }

    .e-modal.show {
      transform: scale(1);
    }

    .e-modal-overlay.show {
      opacity: 1;
    }

    .e-modal.slide {
      transform: translateY(50px);
    }

    .e-modal.slide.show {
      transform: translateY(0);
    }

    .e-modal-header {
      font-size: 20px;
      margin-bottom: 10px;
    }

    .e-modal-body {
      margin-bottom: 15px;
    }

    .e-modal-footer {
      text-align: right;
    }

    .e-btn {
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin-left: 5px;
    }

    .e-btn.primary {
      background: #4da3ff;
      color: white;
    }

    .e-btn.danger {
      background: #ff4d4d;
      color: white;
    }
  `;
  document.head.appendChild(style);

  // =========================
  // CREAR MODAL
  // =========================
  function createModal(opts = {}) {

    const overlay = document.createElement("div");
    overlay.className = "e-modal-overlay";

    const modal = document.createElement("div");
    modal.className = "e-modal";

    // temas
    if (opts.theme) modal.classList.add(opts.theme);

    // animaciones
    if (opts.animation === "slide") modal.classList.add("slide");

    modal.innerHTML = `
      <div class="e-modal-header">${opts.title || ""}</div>
      <div class="e-modal-body">${opts.content || ""}</div>
      <div class="e-modal-footer"></div>
    `;

    const footer = modal.querySelector(".e-modal-footer");

    // botones
    (opts.buttons || []).forEach(btn => {
      const b = document.createElement("button");
      b.className = "e-btn " + (btn.type || "");
      b.innerText = btn.text;

      b.onclick = () => {
        if (btn.onClick) btn.onClick();
        close();
      };

      footer.appendChild(b);
    });

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // mostrar animación
    setTimeout(() => {
      overlay.classList.add("show");
      modal.classList.add("show");
    }, 10);

    function close() {
      overlay.classList.remove("show");
      modal.classList.remove("show");

      setTimeout(() => {
        overlay.remove();
      }, 300);
    }

    // cerrar al hacer click afuera
    if (opts.closeOutside !== false) {
      overlay.onclick = (e) => {
        if (e.target === overlay) close();
      };
    }

    // ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    return { close };
  }

  // =========================
  // API GLOBAL
  // =========================
  window.eModal = {
    open: createModal
  };

})();
