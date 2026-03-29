// ─── DATA FETCH ───────────────────────────────────────────────────────────────
async function loadData() {
  try {
    const res = await fetch('./data.json');
    return await res.json();
  } catch {
    // fallback demo data when running locally without a server
    return demoData();
  }
}

function demoData() {
  return {
    "packages": [
      {
        "name": "e-router",
        "version": "1.2.0",
        "description": "Tiny client-side router with zero dependencies. Hash and history mode support.",
        "tags": ["routing", "spa"],
        "snippets": {
          "script": "<script src=\"https://e-cdn.github.io/libs/e-router/1.2.0/e-router.min.js\"><\/script>",
          "esm": "import Router from 'https://e-cdn.github.io/libs/e-router/1.2.0/e-router.esm.js'"
        },
        "links": {
          "docs": "https://github.com/e-cdn/e-router",
          "npm": "https://npmjs.com/package/e-router"
        }
      },
      {
        "name": "e-fetch",
        "version": "0.9.1",
        "description": "Lightweight fetch wrapper with automatic retries, timeout, and JSON handling.",
        "tags": ["http", "utils"],
        "snippets": {
          "script": "<script src=\"https://e-cdn.github.io/libs/e-fetch/0.9.1/e-fetch.min.js\"><\/script>",
          "esm": "import { eFetch } from 'https://e-cdn.github.io/libs/e-fetch/0.9.1/e-fetch.esm.js'"
        },
        "links": {
          "docs": "https://github.com/e-cdn/e-fetch"
        }
      },
      {
        "name": "e-store",
        "version": "2.0.0",
        "description": "Reactive state store with subscriptions. No build step needed, works anywhere.",
        "tags": ["state", "reactive"],
        "snippets": {
          "script": "<script src=\"https://e-cdn.github.io/libs/e-store/2.0.0/e-store.min.js\"><\/script>",
          "esm": "import { createStore } from 'https://e-cdn.github.io/libs/e-store/2.0.0/e-store.esm.js'"
        },
        "links": {
          "docs": "https://github.com/e-cdn/e-store",
          "npm": "https://npmjs.com/package/e-store"
        }
      },
      {
        "name": "e-modal",
        "version": "1.0.3",
        "description": "Accessible modal dialogs with focus trap, animations, and keyboard navigation out of the box.",
        "tags": ["ui", "a11y"],
        "snippets": {
          "script": "<script src=\"https://e-cdn.github.io/libs/e-modal/1.0.3/e-modal.min.js\"><\/script>",
          "css": "<link rel=\"stylesheet\" href=\"https://e-cdn.github.io/libs/e-modal/1.0.3/e-modal.min.css\">"
        },
        "links": {
          "docs": "https://github.com/e-cdn/e-modal",
          "demo": "https://e-cdn.github.io/demo/e-modal"
        }
      },
      {
        "name": "e-animate",
        "version": "0.5.0",
        "description": "CSS animation helpers and a tiny JS API for chaining and sequencing transitions.",
        "tags": ["animation", "css"],
        "snippets": {
          "css": "<link rel=\"stylesheet\" href=\"https://e-cdn.github.io/libs/e-animate/0.5.0/e-animate.min.css\">",
          "esm": "import { animate } from 'https://e-cdn.github.io/libs/e-animate/0.5.0/e-animate.esm.js'"
        },
        "links": {
          "docs": "https://github.com/e-cdn/e-animate"
        }
      },
      {
        "name": "e-form",
        "version": "1.1.2",
        "description": "Form validation library with custom rules, async validators, and zero runtime deps.",
        "tags": ["forms", "validation"],
        "snippets": {
          "script": "<script src=\"https://e-cdn.github.io/libs/e-form/1.1.2/e-form.min.js\"><\/script>",
          "esm": "import { useForm } from 'https://e-cdn.github.io/libs/e-form/1.1.2/e-form.esm.js'"
        },
        "links": {
          "docs": "https://github.com/e-cdn/e-form",
          "npm": "https://npmjs.com/package/e-form"
        }
      }
    ]
  };
}

// ─── STATE ───────────────────────────────────────────────────────────────────
let allPackages = [];
let activeTag = null;
let searchQ = '';

// ─── RENDER ──────────────────────────────────────────────────────────────────
function getAllTags(packages) {
  const set = new Set();
  packages.forEach(p => (p.tags || []).forEach(t => set.add(t)));
  return [...set].sort();
}

function renderTagFilter(packages) {
  const container = document.getElementById('tag-filter');
  const tags = getAllTags(packages);
  container.innerHTML = '';

  const all = document.createElement('button');
  all.className = 'tag-btn' + (activeTag === null ? ' active' : '');
  all.textContent = 'all';
  all.onclick = () => { activeTag = null; renderAll(); };
  container.appendChild(all);

  tags.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'tag-btn' + (activeTag === t ? ' active' : '');
    btn.textContent = t;
    btn.onclick = () => { activeTag = t; renderAll(); };
    container.appendChild(btn);
  });
}

function filteredPackages() {
  return allPackages.filter(p => {
    const q = searchQ.toLowerCase();
    const matchQ = !q ||
      p.name.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q));
    const matchTag = !activeTag || (p.tags || []).includes(activeTag);
    return matchQ && matchTag;
  });
}

function renderGrid() {
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  const count = document.getElementById('count-label');
  const packages = filteredPackages();

  count.textContent = `${packages.length} package${packages.length !== 1 ? 's' : ''}`;

  if (packages.length === 0) {
    grid.style.display = 'none';
    empty.style.display = 'block';
    document.getElementById('empty-q').textContent = searchQ;
    return;
  }

  grid.style.display = 'grid';
  empty.style.display = 'none';

  grid.innerHTML = packages.map((pkg, i) => `
    <div class="card" style="animation-delay:${i * 40}ms" onclick='openModal(${JSON.stringify(pkg)})'>
      <div class="card-top">
        <div class="card-name">${pkg.name}</div>
        ${pkg.version ? `<span class="card-version">v${pkg.version}</span>` : ''}
      </div>
      <p class="card-desc">${pkg.description || ''}</p>
      <div class="card-bottom">
        <div class="card-tags">
          ${(pkg.tags || []).map(t => `<span class="card-tag">${t}</span>`).join('')}
        </div>
        <span class="card-arrow">→</span>
      </div>
    </div>
  `).join('');
}

function renderAll() {
  renderTagFilter(allPackages);
  renderGrid();
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
function openModal(pkg) {
  const bg = document.getElementById('modal-bg');
  const name = document.getElementById('m-name');
  const tags = document.getElementById('m-tags');
  const desc = document.getElementById('m-desc');
  const snippets = document.getElementById('m-snippets');
  const links = document.getElementById('m-links');

  name.innerHTML = `${pkg.name}${pkg.version ? `<span class="version">v${pkg.version}</span>` : ''}`;
  tags.innerHTML = (pkg.tags || []).map(t => `<span class="card-tag">${t}</span>`).join('');
  desc.textContent = pkg.description || '';

  // Snippets
  snippets.innerHTML = '';
  if (pkg.snippets) {
    Object.entries(pkg.snippets).forEach(([type, code]) => {
      const label = { script: 'via script tag', esm: 'via esm import', css: 'css link' }[type] || type;
      snippets.innerHTML += `
        <p class="snippet-label">${label}</p>
        <div class="snippet-box">
          <code id="snip-${type}">${escHtml(code)}</code>
          <button class="copy-btn" onclick="copySnippet('${type}', '${escAttr(code)}')">copy</button>
        </div>
      `;
    });
  }

  // Links
  links.innerHTML = '';
  if (pkg.links) {
    if (pkg.links.docs) {
      links.innerHTML += `<a class="modal-link primary" href="${pkg.links.docs}" target="_blank">↗ docs / repo</a>`;
    }
    if (pkg.links.npm) {
      links.innerHTML += `<a class="modal-link" href="${pkg.links.npm}" target="_blank">npm</a>`;
    }
    if (pkg.links.demo) {
      links.innerHTML += `<a class="modal-link" href="${pkg.links.demo}" target="_blank">live demo</a>`;
    }
  }

  bg.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-bg').classList.remove('open');
  document.body.style.overflow = '';
}

function copySnippet(type, code) {
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.querySelector(`.copy-btn[onclick*="'${type}'"]`);
    if (btn) {
      btn.textContent = 'copied!';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('copied'); }, 1500);
    }
  });
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function escAttr(s) {
  return s.replace(/'/g,"\\'").replace(/\n/g,'\\n');
}

// ─── EVENTS ──────────────────────────────────────────────────────────────────
document.getElementById('modal-close').onclick = closeModal;
document.getElementById('modal-bg').onclick = (e) => { if (e.target === e.currentTarget) closeModal(); };
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

document.getElementById('search').addEventListener('input', (e) => {
  searchQ = e.target.value;
  renderAll();
});

// ─── INIT ────────────────────────────────────────────────────────────────────
loadData().then(data => {
  allPackages = data.packages || [];
  renderAll();
});