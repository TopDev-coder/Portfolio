/* Live demos: AI retrieval, token-bucket rate limiter, offline-first sync.
   Pure browser code, no dependencies. */
(function () {
  "use strict";

  const D = window.PORTFOLIO;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =====================================================================
     Tabs
     ===================================================================== */
  const tabs = $$(".demo-tab");
  const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
  const selectTab = (i) => {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      panels[j].hidden = !on;
    });
    document.dispatchEvent(new CustomEvent("demo:shown", { detail: panels[i].id }));
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(i));
    t.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const next = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      selectTab(next);
      tabs[next].focus();
    });
  });

  /* =====================================================================
     1. Ask my portfolio — TF-IDF retrieval with cited passages
     ===================================================================== */
  const STOP = new Set(
    "a an and are as at be been but by can did do does for from had has have how i in is it its me my of on or our so that the their them then there these this to was we were what when where which who why will with you your yours ever any about work worked working experience experienced use used using know tell done much many".split(
      " "
    )
  );
  // Expand common abbreviations so "k8s" finds "Kubernetes", etc.
  const SYNONYMS = {
    k8s: "kubernetes", ml: "machine learning", llm: "llm language model", llms: "llm language model",
    ai: "ai llm machine learning", rag: "rag retrieval", genai: "llm ai", js: "javascript", ts: "typescript",
    golang: "go", postgres: "postgresql", mobile: "android mobile", lead: "lead mentor", led: "lead mentor",
    team: "team lead mentor", teams: "team lead mentor", cost: "cost spend",
    eval: "evaluation", evals: "evaluation", evaluate: "evaluation", offline: "offline sync"
  };
  const stem = (w) => w.replace(/(ing|ed|es|s)$/, (m) => (w.length - m.length >= 4 ? "" : m));
  const words = (text) =>
    String(text)
      .toLowerCase()
      .split(/[^a-z0-9+#]+/)
      .filter((w) => w && !STOP.has(w));
  const tokenize = (text) => words(text).map(stem);
  // Query terms: typed words at full weight, synonym expansions at half weight
  const queryTerms = (text) =>
    words(text).flatMap((w) => [
      [stem(w), 1],
      ...(SYNONYMS[w] || "").split(" ").filter(Boolean).map((x) => [stem(x), 0.5])
    ]);

  const docs = [
    ...D.projects.map((p) => ({
      kind: "project",
      ref: p.title,
      title: p.title,
      source: `Project · ${p.year}`,
      text: [p.summary, p.problem, p.solution, "Architecture: " + (p.architecture || []).join(", ") + ".", (p.decisions || []).join(". "), p.impact.join(". "), "Stack: " + p.stack.join(", ")].join(" ")
    })),
    ...D.experience.map((e) => ({
      kind: "experience",
      title: `${e.role} @ ${e.company}`,
      source: `Experience · ${e.period}`,
      text: [e.summary, e.highlights.join(". "), "Stack: " + e.stack.join(", ")].join(" ")
    })),
    ...D.expertise.map((x) => ({
      kind: "expertise",
      title: x.title,
      source: "Expertise",
      text: `${x.desc} Tools: ${x.tags.join(", ")}.`
    })),
    ...Object.entries(D.skills).map(([g, items]) => ({
      kind: "skills",
      title: `Skills: ${g}`,
      source: "Toolbox",
      text: `${g}: ${items.join(", ")}.`
    })),
    ...D.principles.map((p) => ({ kind: "principle", title: p.title, source: "How I work", text: p.text })),
    ...D.about.map((t, i) => ({ kind: "about", title: "About me", source: `About · ¶${i + 1}`, text: t }))
  ];

  // Build a BM25 index (the lexical half of hybrid search). Titles count double.
  const K1 = 1.2, B = 0.5;
  // Concrete evidence (projects, roles) ranks slightly above lists of skills
  const KIND_BOOST = { project: 1.3, experience: 1.15 };
  const df = new Map();
  docs.forEach((d) => {
    const toks = [...tokenize(d.title), ...tokenize(d.title), ...tokenize(d.text)];
    d.len = toks.length;
    d.tf = new Map();
    toks.forEach((t) => d.tf.set(t, (d.tf.get(t) || 0) + 1));
    d.tf.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1));
  });
  const avgLen = docs.reduce((n, d) => n + d.len, 0) / docs.length;
  const idf = (t) => {
    const n = df.get(t) || 0;
    return Math.log(1 + (docs.length - n + 0.5) / (n + 0.5));
  };

  const search = (q) => {
    const qv = new Map();
    queryTerms(q).forEach(([t, w]) => qv.set(t, Math.max(qv.get(t) || 0, w)));
    const hits = docs
      .map((d) => {
        let score = 0;
        qv.forEach((w, t) => {
          const f = d.tf.get(t);
          if (f) score += w * idf(t) * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.len) / avgLen)));
        });
        return { d, score: score * (KIND_BOOST[d.kind] || 1) };
      })
      .filter((r) => r.score > 0.5)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    return { terms: new Set(qv.keys()), hits };
  };

  // Pick the most relevant two sentences and highlight matching words
  const snippet = (text, terms) => {
    const sentences = text.match(/[^.!?]+[.!?]?/g) || [text];
    const scored = sentences.map((s, i) => ({ s: s.trim(), i, n: tokenize(s).filter((t) => terms.has(t)).length }));
    const best = scored
      .filter((x) => x.s)
      .sort((a, b) => b.n - a.n || a.i - b.i)
      .slice(0, 2)
      .sort((a, b) => a.i - b.i)
      .map((x) => x.s)
      .join(" … ");
    return best
      .split(/(\s+)/)
      .map((w) => {
        const t = tokenize(w);
        return t.length && t.some((x) => terms.has(x)) ? `<mark>${esc(w)}</mark>` : esc(w);
      })
      .join("");
  };

  const results = $("#askResults");
  const runAsk = (q) => {
    q = q.trim();
    if (!q) return;
    const t0 = performance.now();
    const { terms, hits } = search(q);
    const ms = (performance.now() - t0).toFixed(1);
    if (!hits.length) {
      results.innerHTML = `<p class="ask__empty">No strong matches for “${esc(q)}”. Try a technology (Kafka, Compose, pgvector) or a topic (leadership, cost, offline).</p>`;
      return;
    }
    results.innerHTML =
      `<p class="ask__meta">Retrieved ${hits.length} passage${hits.length > 1 ? "s" : ""} from ${docs.length} documents in ${ms} ms</p>` +
      hits
        .map(
          ({ d, score }, i) => `
        <article class="hit">
          <div class="hit__head">
            <span class="hit__rank">[${i + 1}]</span>
            <strong>${esc(d.title)}</strong>
            <span class="hit__score" title="BM25 relevance score">score ${score.toFixed(2)}</span>
          </div>
          <p>${snippet(d.text, terms)}</p>
          <div class="hit__foot">
            <span class="tag">${esc(d.source)}</span>
            ${d.kind === "project" ? `<button class="hit__open" data-ref="${esc(d.ref)}">Open case study →</button>` : ""}
          </div>
        </article>`
        )
        .join("");
  };

  $("#askForm").addEventListener("submit", (e) => {
    e.preventDefault();
    runAsk($("#askInput").value);
  });
  results.addEventListener("click", (e) => {
    const b = e.target.closest(".hit__open");
    if (b && window.openProjectByTitle) window.openProjectByTitle(b.dataset.ref);
  });
  const suggestions = [
    "Have you worked with Kafka at scale?",
    "How do you evaluate LLM features?",
    "Offline-first Android experience",
    "Have you led teams?",
    "Cutting cloud costs"
  ];
  $("#askSuggest").innerHTML = suggestions.map((s) => `<button class="chip" type="button">${esc(s)}</button>`).join("");
  $("#askSuggest").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    $("#askInput").value = b.textContent;
    runAsk(b.textContent);
  });

  /* =====================================================================
     2. Token-bucket rate limiter simulator
     ===================================================================== */
  const lm = {
    rate: $("#lmRate"), refill: $("#lmRefill"), cap: $("#lmCap"),
    canvas: $("#lmChart"), fill: $("#lmFill"), tokensEl: $("#lmTokens"),
    ok: $("#lmOk"), no: $("#lmNo"), pct: $("#lmPct")
  };
  const sim = { tokens: +lm.cap.value, acc: 0, burst: 0, ok: 0, no: 0, hist: [], paused: false, timer: null };
  const HIST = 90; // 9 seconds of 100ms ticks

  const syncOutputs = () => {
    $("#lmRateOut").textContent = `${lm.rate.value} req/s`;
    $("#lmRefillOut").textContent = `${lm.refill.value} tokens/s`;
    $("#lmCapOut").textContent = `${lm.cap.value} tokens`;
  };
  [lm.rate, lm.refill, lm.cap].forEach((el) => el.addEventListener("input", syncOutputs));
  syncOutputs();

  const tick = () => {
    const cap = +lm.cap.value;
    sim.tokens = Math.min(cap, sim.tokens + +lm.refill.value * 0.1);
    // Jittered arrivals so traffic looks organic
    sim.acc += +lm.rate.value * 0.1 * (0.5 + Math.random());
    let n = Math.floor(sim.acc);
    sim.acc -= n;
    const fromBurst = Math.min(sim.burst, 8);
    sim.burst -= fromBurst;
    n += fromBurst;
    let ok = 0, no = 0;
    for (let i = 0; i < n; i++) {
      if (sim.tokens >= 1) { sim.tokens -= 1; ok++; } else no++;
    }
    sim.ok += ok;
    sim.no += no;
    sim.hist.push({ ok, no });
    if (sim.hist.length > HIST) sim.hist.shift();
    drawLimiter();
  };

  const drawLimiter = () => {
    const cap = +lm.cap.value;
    const level = Math.max(0, sim.tokens) / cap;
    lm.fill.style.height = `${level * 100}%`;
    lm.fill.classList.toggle("is-low", level < 0.15);
    lm.tokensEl.textContent = Math.floor(sim.tokens);
    lm.ok.textContent = sim.ok.toLocaleString();
    lm.no.textContent = sim.no.toLocaleString();
    const total = sim.ok + sim.no;
    lm.pct.textContent = total ? `${((sim.no / total) * 100).toFixed(1)}%` : "0%";

    const c = lm.canvas;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth, h = c.clientHeight;
    if (!w) return;
    if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    const ctx = c.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const css = getComputedStyle(document.documentElement);
    const okColor = css.getPropertyValue("--accent").trim();
    const noColor = css.getPropertyValue("--danger").trim();
    const grid = css.getPropertyValue("--border").trim();
    const max = Math.max(8, ...sim.hist.map((x) => x.ok + x.no));
    ctx.strokeStyle = grid;
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75].forEach((f) => {
      ctx.beginPath(); ctx.moveTo(0, h * f + 0.5); ctx.lineTo(w, h * f + 0.5); ctx.stroke();
    });
    const bw = w / HIST;
    sim.hist.forEach((x, i) => {
      const xPos = w - (sim.hist.length - i) * bw;
      const hOk = (x.ok / max) * (h - 4);
      const hNo = (x.no / max) * (h - 4);
      ctx.fillStyle = okColor;
      ctx.fillRect(xPos + 1, h - hOk, bw - 2, hOk);
      ctx.fillStyle = noColor;
      ctx.fillRect(xPos + 1, h - hOk - hNo, bw - 2, hNo);
    });
  };

  const limiterPanel = $("#demo-limiter");
  let limiterInView = false;
  const updateLimiterRunning = () => {
    const run = limiterInView && !limiterPanel.hidden && !sim.paused && !document.hidden;
    if (run && !sim.timer) sim.timer = setInterval(tick, 100);
    if (!run && sim.timer) { clearInterval(sim.timer); sim.timer = null; }
  };
  new IntersectionObserver((en) => { limiterInView = en[0].isIntersecting; updateLimiterRunning(); }).observe(limiterPanel.parentElement);
  document.addEventListener("visibilitychange", updateLimiterRunning);
  document.addEventListener("demo:shown", (e) => {
    if (e.detail === "demo-limiter") limiterInView = true; // the visitor just picked it
    updateLimiterRunning();
    drawLimiter();
  });
  $("#lmBurst").addEventListener("click", () => (sim.burst += 40));
  $("#lmPause").addEventListener("click", (e) => {
    sim.paused = !sim.paused;
    e.currentTarget.textContent = sim.paused ? "Resume" : "Pause";
    updateLimiterRunning();
  });
  addEventListener("resize", drawLimiter);
  drawLimiter();

  /* =====================================================================
     3. Offline-first sync — local DB is the source of truth
     ===================================================================== */
  const off = {
    online: true,
    seq: 3,
    syncing: false,
    items: [
      { id: 3, meter: "M-2290", value: "018734", status: "synced" },
      { id: 2, meter: "M-1187", value: "004512", status: "synced" },
      { id: 1, meter: "M-0931", value: "112009", status: "synced" }
    ]
  };
  const list = $("#readingList");
  const log = $("#serverLog");
  const banner = $("#phBanner");
  const now = () => new Date().toTimeString().slice(0, 8);

  const STATUS = {
    queued: { icon: "⏳", label: "Queued locally" },
    syncing: { icon: "↻", label: "Syncing" },
    synced: { icon: "✓", label: "Synced" }
  };
  const renderPhone = () => {
    list.innerHTML = off.items
      .map(
        (it) => `
      <li class="reading is-${it.status}">
        <div><strong>${esc(it.meter)}</strong><span>${esc(it.value)} kWh</span></div>
        <em title="${STATUS[it.status].label}">${STATUS[it.status].icon} ${STATUS[it.status].label}</em>
      </li>`
      )
      .join("");
    const pending = off.items.filter((i) => i.status !== "synced").length;
    $("#phNet").textContent = off.online ? "● Online" : "○ Offline";
    $("#phNet").classList.toggle("is-off", !off.online);
    banner.className = "phone__banner";
    if (!off.online) {
      banner.textContent = pending ? `Offline · ${pending} change${pending > 1 ? "s" : ""} saved on device` : "Offline · app still fully usable";
      banner.classList.add("is-off");
    } else if (pending) {
      banner.textContent = `Syncing ${pending} change${pending > 1 ? "s" : ""}…`;
      banner.classList.add("is-sync");
    } else {
      banner.textContent = "All changes synced";
    }
  };
  const addLog = (html, cls = "") => {
    log.insertAdjacentHTML("afterbegin", `<li class="${cls}"><time>${now()}</time>${html}</li>`);
    while (log.children.length > 30) log.lastElementChild.remove();
  };

  const flush = async () => {
    if (off.syncing) return;
    off.syncing = true;
    const delay = (ms) => new Promise((r) => setTimeout(r, reducedMotion ? 50 : ms));
    let next;
    while (off.online && (next = [...off.items].reverse().find((i) => i.status === "queued"))) {
      next.status = "syncing";
      renderPhone();
      await delay(650);
      if (!off.online) { next.status = "queued"; break; } // connection dropped mid-request: retry later
      next.status = "synced";
      addLog(`<b class="ok">201</b> ${esc(next.meter)} = ${esc(next.value)} <span>Idempotency-Key: op-${next.id}</span>`);
      renderPhone();
    }
    off.syncing = false;
    renderPhone();
  };

  $("#netToggle").addEventListener("change", (e) => {
    off.online = e.target.checked;
    const pending = off.items.filter((i) => i.status !== "synced").length;
    if (off.online) {
      addLog(`↻ Connection restored${pending ? ` · flushing ${pending} queued op${pending > 1 ? "s" : ""}` : ""}`, "info");
      flush();
    } else {
      addLog("✕ Device went offline · writes go to the local queue", "warn");
    }
    renderPhone();
  });

  $("#readingForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const meterEl = $("#readingMeter"), valEl = $("#readingValue");
    const meter = meterEl.value.trim().toUpperCase() || `M-${String(1000 + Math.floor(Math.random() * 8999))}`;
    const value = valEl.value.replace(/\D/g, "");
    if (!value) { valEl.focus(); valEl.classList.add("is-invalid"); return; }
    valEl.classList.remove("is-invalid");
    off.items.unshift({ id: ++off.seq, meter, value: value.padStart(6, "0"), status: "queued" });
    if (off.items.length > 6) off.items.length = 6;
    meterEl.value = valEl.value = "";
    renderPhone();
    if (off.online) flush();
  });

  const clock = () => ($("#phTime").textContent = new Date().toTimeString().slice(0, 5));
  clock();
  setInterval(clock, 30000);
  addLog("Server ready · 3 readings on record", "info");
  renderPhone();
})();
