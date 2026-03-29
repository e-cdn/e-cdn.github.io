// === e-modal v1 (HTML-first, sin JS del usuario) ===
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
      transition: opacity .25s ease;
    }

    .e-modal {
      background: #1e1e1e;
      color: #fff;
      padding: 18px 20px;
      border-radius: 12px;
      min-width: 260px;
      max-width: 92%;
      transform: scale(.85);
      transition: transform .25s ease, opacity .25s ease;
      font-family: system-ui, Arial, sans-serif;
      box-shadow: 0 20px 60px rgba(0,0,0,.4);
    }

    .e-modal.light { background: #fff; color: #111; }
    .e-modal.glass {
      background: rgba(255,255,255,.12);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,.15);
    }

    .e-modal.show { transform: scale(1); }
    .e-modal-overlay.show { opacity: 1; }

    .e-modal.slide { transform: translateY(40px); }
    .e-modal.slide.show { transform: translateY(0); }

    .e-modal-header { font-size: 18px; margin-bottom: 8px; font-weight: 600; }
    .e-modal-body { margin-bottom: 14px; line-height: 1.4; }
    .e-modal-footer { text-align: right; }

    .e-btn {
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin-left: 6px;
      font-size: 14px;
    }

    .e-btn.primary { background: #4da3ff; color: #fff; }
    .e-btn.danger { background: #ff4d4d; color: #fff; }
    .e-btn.light { background: #ddd; color: #111; }
  `;
  document.head.appendChild(style);

  // =========================
  // CREAR MODAL
  // =========================
  function openModal(opts = {}) {

    const overlay = document.createElement("div");
    overlay.className = "e-modal-overlay";

    const modal = document.createElement("div");
    modal.className = "e-modal";

    if (opts.theme) modal.classList.add(opts.theme);
    if (opts.animation === "slide") modal.classList.add("slide");

    modal.innerHTML = `
      ${opts.title ? `<div class="e-modal-header">${opts.title}</div>` : ""}
      <div class="e-modal-body">${opts.content || ""}</div>
      <div class="e-modal-footer"></div>
    `;

    const footer = modal.querySelector(".e-modal-footer");

    // botones
    (opts.buttons || []).forEach(btn => {
      const b = document.createElement("button");
      b.className = "e-btn " + (btn.type || "");
      b.textContent = btn.text || "OK";

      b.onclick = () => {
        close();
      };

      footer.appendChild(b);
    });

    // botón default si no hay
    if (!opts.buttons || opts.buttons.length === 0) {
      const b = document.createElement("button");
      b.className = "e-btn primary";
      b.textContent = "OK";
      b.onclick = close;
      footer.appendChild(b);
    }

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.classList.add("show");
      modal.classList.add("show");
    }, 10);

    function close() {
      overlay.classList.remove("show");
      modal.classList.remove("show");
      setTimeout(() => overlay.remove(), 250);
    }

    // cerrar afuera
    if (opts.closeOutside !== "false") {
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
  // HTML → MODAL
  // =========================
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-modal]");
    if (!el) return;

    const title = el.dataset.title;
    const content = el.dataset.content;
    const theme = el.dataset.theme;
    const animation = el.dataset.animation;
    const closeOutside = el.dataset.closeOutside;

    // botones desde HTML:
    // data-buttons="Aceptar:primary,Cancelar:light"
    let buttons = [];
    if (el.dataset.buttons) {
      buttons = el.dataset.buttons.split(",").map(b => {
        const [text, type] = b.split(":");
        return { text: text.trim(), type: (type || "").trim() };
      });
    }

    openModal({
      title,
      content,
      theme,
      animation,
      closeOutside,
      buttons
    });
  });

  // =========================
  // API (opcional)
  // =========================
  window.eModal = {
    open: openModal
  };

})();
