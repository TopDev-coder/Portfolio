(function () {
  "use strict";

  const D = window.PORTFOLIO;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Icons (inline SVG paths, stroke-based) ---------- */
  const ICONS = {
    ai: '<path d="M12 3a3 3 0 0 0-3 3v1H8a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6v1a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-1a3 3 0 0 0 0-6v-1a3 3 0 0 0-3-3h-1V6a3 3 0 0 0-3-3z"/><circle cx="9.5" cy="13" r="1"/><circle cx="14.5" cy="13" r="1"/><path d="M9.5 17h5"/>',
    system: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6"/>',
    web: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 9h20M6 6.5h.01M9 6.5h.01M9 14l-2 2 2 2M15 14l2 2-2 2"/>',
    android: '<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M10 18h4"/><path d="M9 7l2 2 4-4"/>',
    cloud: '<path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.34 9.5 4.75 4.75 0 0 0 6.5 19z"/>',
    lead: '<circle cx="9" cy="7" r="4"/><path d="M2 21v-1a7 7 0 0 1 14 0v1M16 3.13a4 4 0 0 1 0 7.75M22 21v-1a7 7 0 0 0-4-6.32"/>',
    github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
    link: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>'
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ""}</svg>`;

  const CATEGORY = {
    ai: { label: "AI", c1: "#6366f1", c2: "#a855f7" },
    system: { label: "Systems", c1: "#0f766e", c2: "#0ea5e9" },
    web: { label: "Web", c1: "#2563eb", c2: "#06b6d4" },
    android: { label: "Android", c1: "#16a34a", c2: "#84cc16" }
  };

  /* ---------- Simple bindings ---------- */
  const p = D.profile;
  $$("[data-bind]").forEach((el) => {
    const v = p[el.dataset.bind];
    if (v != null) el.textContent = v;
  });
  $$("[data-bind-href='mailto']").forEach((el) => (el.href = `mailto:${p.email}`));
  $("#year").textContent = new Date().getFullYear();
  document.title = `${p.name} — ${p.role}`;

  const socialsHTML = p.socials
    .map((s) => {
      const external = !s.url.startsWith("mailto:");
      return `<li><a href="${esc(s.url)}" aria-label="${esc(s.label)}" title="${esc(s.label)}"${
        external ? ' target="_blank" rel="noopener"' : ""
      }>${icon(s.icon)}</a></li>`;
    })
    .join("");
  $("#heroSocials").innerHTML = socialsHTML;
  $("#contactSocials").innerHTML = socialsHTML;

  /* ---------- Sections ---------- */
  $("#stats").innerHTML = D.stats
    .map((s) => `<li class="reveal"><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></li>`)
    .join("");

  $("#aboutText").innerHTML = D.about.map((t) => `<p class="reveal">${esc(t)}</p>`).join("");

  $("#education").innerHTML = D.education
    .map(
      (e) =>
        `<li class="reveal"><div><strong>${esc(e.title)}</strong><small>${esc(e.place)}</small></div><span class="year">${esc(e.year)}</span></li>`
    )
    .join("");

  const tagList = (arr) => `<div class="tags">${arr.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>`;

  $("#expertiseGrid").innerHTML = D.expertise
    .map(
      (x) => `
      <article class="card reveal">
        <div class="xp-icon">${icon(x.icon)}</div>
        <h3>${esc(x.title)}</h3>
        <p>${esc(x.desc)}</p>
        ${tagList(x.tags)}
      </article>`
    )
    .join("");

  const cover = (proj, featuredBadge) => {
    const cat = CATEGORY[proj.categories[0]] || CATEGORY.web;
    return `<div class="project__cover" style="--c1:${cat.c1};--c2:${cat.c2}">
      ${featuredBadge && proj.featured ? '<span class="badge-feat">★ Featured</span>' : ""}
      ${icon(proj.categories[0])}
    </div>`;
  };

  // Featured projects first, then by year (newest first)
  const projects = [...D.projects].sort((a, b) => (b.featured - a.featured) || String(b.year).localeCompare(String(a.year)));

  $("#projectGrid").innerHTML = projects
    .map(
      (pr, i) => `
      <button class="card project reveal" data-index="${i}" data-cats="${pr.categories.join(" ")}" aria-haspopup="dialog">
        ${cover(pr, true)}
        <div class="project__body">
          <div class="project__meta"><span>${pr.categories.map((c) => CATEGORY[c]?.label).join(" · ")}</span><span>${esc(pr.year)}</span></div>
          <h3>${esc(pr.title)}</h3>
          <p class="muted">${esc(pr.summary)}</p>
          <p class="project__impact">▲ ${esc(pr.impact[0])}</p>
          ${tagList(pr.stack.slice(0, 4))}
          <span class="project__more">Read case study →</span>
        </div>
      </button>`
    )
    .join("");

  $("#timeline").innerHTML = D.experience
    .map(
      (e) => `
      <li class="reveal">
        <div class="card">
          <div class="tl__head">
            <h3>${esc(e.role)} <span>@ ${esc(e.company)}</span></h3>
            <span class="tl__period">${esc(e.period)} · ${esc(e.location)}</span>
          </div>
          <p class="muted" style="margin:0">${esc(e.summary)}</p>
          <ul class="tl__list">${e.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
          ${tagList(e.stack)}
        </div>
      </li>`
    )
    .join("");

  $("#skillsGrid").innerHTML = Object.entries(D.skills)
    .map(([group, items]) => `<div class="card reveal"><h3>${esc(group)}</h3>${tagList(items)}</div>`)
    .join("");

  $("#principleGrid").innerHTML = D.principles
    .map(
      (t, i) => `
      <article class="card principle reveal">
        <span class="principle__num">${String(i + 1).padStart(2, "0")}</span>
        <h3>${esc(t.title)}</h3>
        <p>${esc(t.text)}</p>
      </article>`
    )
    .join("");

  /* ---------- Project filter ---------- */
  $("#filters").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    const f = btn.dataset.filter;
    $$("#filters .chip").forEach((c) => {
      const on = c === btn;
      c.classList.toggle("is-active", on);
      c.setAttribute("aria-selected", on);
    });
    $$("#projectGrid .project").forEach((card) => {
      card.classList.toggle("is-hidden", f !== "all" && !card.dataset.cats.split(" ").includes(f));
    });
  });

  /* ---------- Project modal ---------- */
  const modal = $("#projectModal");
  const openProject = (pr) => {
    const links = [
      pr.links?.live && `<a class="btn btn--primary" href="${esc(pr.links.live)}" target="_blank" rel="noopener">Live demo ${icon("link")}</a>`,
      pr.links?.code && `<a class="btn btn--ghost" href="${esc(pr.links.code)}" target="_blank" rel="noopener">Source code</a>`
    ].filter(Boolean);
    $("#modalBody").innerHTML = `
      ${cover(pr, false)}
      <div class="modal__content">
        <div class="project__meta"><span>${pr.categories.map((c) => CATEGORY[c]?.label).join(" · ")}</span><span>${esc(pr.year)}</span></div>
        <h3 id="modalTitle">${esc(pr.title)}</h3>
        <p>${esc(pr.summary)}</p>
        <ul class="facts">
          ${pr.role ? `<li><span>Role</span>${esc(pr.role)}</li>` : ""}
          ${pr.duration ? `<li><span>Timeline</span>${esc(pr.duration)}</li>` : ""}
        </ul>
        <h4>The problem</h4><p>${esc(pr.problem)}</p>
        <h4>What I built</h4><p>${esc(pr.solution)}</p>
        ${pr.architecture ? `<h4>Architecture</h4><ol class="flow">${pr.architecture.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>` : ""}
        ${pr.decisions ? `<h4>Key decisions</h4><ul class="decisions">${pr.decisions.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        <h4>Impact</h4><ul class="impact-list">${pr.impact.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <h4>Stack</h4>${tagList(pr.stack)}
        ${links.length ? `<div class="modal__links">${links.join("")}</div>` : ""}
      </div>`;
    modal.showModal();
    modal.scrollTop = 0;
  };
  window.openProjectByTitle = (title) => {
    const pr = projects.find((x) => x.title === title);
    if (pr) openProject(pr);
  };
  $("#projectGrid").addEventListener("click", (e) => {
    const card = e.target.closest(".project");
    if (card) openProject(projects[+card.dataset.index]);
  });
  $("#modalClose").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close(); // backdrop click
  });

  /* ---------- Theme ---------- */
  $("#themeToggle").addEventListener("click", () => {
    const root = document.documentElement;
    const current = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });

  /* ---------- Nav: scroll state, mobile menu, active link ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const menuBtn = $("#menuToggle");
  const links = $("#navLinks");
  const setMenu = (open) => {
    links.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", open);
  };
  menuBtn.addEventListener("click", () => setMenu(!links.classList.contains("is-open")));
  links.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));

  const navAnchors = $$("#navLinks a:not(.btn)");
  const spy = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navAnchors.forEach((a) => a.classList.toggle("is-current", a.hash === `#${en.target.id}`));
      }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  $$("main section[id]").forEach((s) => spy.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const reveal = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          reveal.unobserve(en.target);
        }
      }),
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 70}ms`;
    reveal.observe(el);
  });

  /* ---------- Hero terminal typing ---------- */
  const firstName = p.name.split(" ")[0];
  const code = [
    ["k", "const "], ["p", "engineer"], ["", " = {\n"],
    ["", "  name: "], ["s", `"${firstName}"`], ["", ",\n"],
    ["", "  experience: "], ["s", '"11+ years"'], ["", ",\n"],
    ["", "  focus: ["], ["s", '"AI"'], ["", ", "], ["s", '"Systems"'], ["", ",\n"],
    ["", "          "], ["s", '"Web"'], ["", ", "], ["s", '"Android"'], ["", "],\n"],
    ["", "  stack: ["], ["s", '"TS"'], ["", ", "], ["s", '"Python"'], ["", ", "], ["s", '"Go"'], ["", ", "], ["s", '"Kotlin"'], ["", "],\n"],
    ["", "  ships: "], ["k", "true"], ["", ",\n"],
    ["", "};\n\n"],
    ["c", "// let's build something together\n"],
    ["p", "engineer"], ["", "."], ["k", "hire"], ["", "();"]
  ];
  const term = $("#termCode");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const render = (n) => {
    let left = n, html = "";
    for (const [cls, txt] of code) {
      if (left <= 0) break;
      const part = esc(txt.slice(0, left));
      left -= txt.length;
      html += cls ? `<span class="tk-${cls}">${part}</span>` : part;
    }
    term.innerHTML = html + '<span class="caret"></span>';
  };
  const total = code.reduce((n, [, t]) => n + t.length, 0);
  if (reduced) render(total);
  else {
    let i = 0;
    const tick = () => {
      render((i += 2));
      if (i < total) setTimeout(tick, 22);
    };
    setTimeout(tick, 400);
  }

  /* ---------- Contact form (opens the visitor's mail client) ---------- */
  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const note = $("#formNote");
    let ok = true;
    $$("[required]", form).forEach((f) => {
      const bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle("is-invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) {
      note.textContent = "Please fill in all fields with a valid email.";
      return;
    }
    const d = Object.fromEntries(new FormData(form));
    const body = `${d.message}\n\n— ${d.name} (${d.email})`;
    location.href = `mailto:${p.email}?subject=${encodeURIComponent(`[Portfolio] ${d.subject}`)}&body=${encodeURIComponent(body)}`;
    note.textContent = "Opening your email app… Thanks for reaching out!";
    form.reset();
  });
})();
