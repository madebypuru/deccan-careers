/* Deccan Experts landing: role tabs, the how-it-works card, FAQ and grow-in images.
   The stage (hiring.js), culture-code grid (values.js), reel (team.js) and dial / office / reveals (about.js) are shared. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EASE = "power3.out";

  /* ---------- roles: five categories, six roles each ---------- */

  // [title, line, where, hours, level, rate]
  const ROLES = {
    General: [
      ["AI Data Quality Analyst", "Review and rate AI outputs from anywhere — no prior AI experience needed.", "Remote", "10–20 hrs/wk", "Entry level", 45],
      ["Prompt Writer", "Craft creative prompts that push the boundaries of machine reasoning.", "Remote", "Flexible hours", "Mid level", 50],
      ["Subject-Matter Reviewer", "Bring deep expertise in your field to review and validate model outputs.", "Remote", "Project-based", "Senior", 65],
      ["Model Response Ranker", "Compare competing AI answers and judge which one a real user would trust.", "Remote", "10–20 hrs/wk", "Entry level", 48],
      ["Red Team Analyst", "Probe models for unsafe, biased or evasive behaviour before they ship.", "Remote", "Flexible hours", "Mid level", 62],
      ["Physical AI Data Collector", "Wear the head-mount camera and capture real-world demonstrations for embodied AI.", "On-site", "Project-based", "No experience needed", 40],
    ],
    Coding: [
      ["Software Engineer — Code Quality", "Review agent pull requests and write reference solutions for coding tasks.", "Remote", "15–25 hrs/wk", "Mid–Senior", 60],
      ["AI Annotation Expert — LLM Reasoning", "Author frontier evaluation questions that push the strongest models past their limits.", "Remote", "Flexible hours", "Mid level", 55],
      ["Trajectory & PR Reviewer", "Trace a model’s reasoning step by step and score where it holds up — or breaks down.", "Remote", "Project-based", "Senior", 58],
      ["Systems & Infrastructure Reviewer", "Assess model reasoning on distributed systems, concurrency and performance.", "Remote", "10–20 hrs/wk", "Senior", 72],
      ["Security Code Auditor", "Find the vulnerabilities that model-written code quietly introduces.", "Remote", "Project-based", "5+ yrs experience", 78],
      ["Data & ML Engineering Expert", "Evaluate pipelines, training code and evaluation harnesses written by agents.", "Remote", "Flexible hours", "Mid–Senior", 68],
    ],
    Legal: [
      ["Legal Reasoning Analyst", "Test how models reason through statutes, precedent and legal argument.", "Remote", "Project-based", "JD / LLB", 85],
      ["Contract Review Specialist", "Review model-drafted clauses and flag risk, ambiguity and omissions.", "Remote", "10–20 hrs/wk", "5+ yrs practice", 80],
      ["Compliance & Policy Reviewer", "Evaluate model outputs against regulatory and policy requirements.", "Remote", "Flexible hours", "Senior", 75],
      ["Litigation Reasoning Expert", "Score how models construct arguments, cite authority and handle counterclaims.", "Remote", "Flexible hours", "Litigator", 88],
      ["IP & Patent Reviewer", "Check claim construction, prior art reasoning and patentability analysis.", "Remote", "Project-based", "Patent attorney", 92],
      ["Corporate Law Task Author", "Write the transactional problems that expose where models fall short.", "Remote", "10–20 hrs/wk", "Senior", 82],
    ],
    Medical: [
      ["Clinical AI Specialist", "Review model outputs for clinical accuracy and flag unsafe advice.", "Remote", "Project-based", "MD / MBBS", 90],
      ["Diagnostic Review Expert", "Assess diagnostic reasoning and imaging interpretation across specialties.", "Remote", "10–20 hrs/wk", "Specialist", 85],
      ["Pharmacology Validator", "Verify dosing, interactions and contraindications in generated guidance.", "Remote", "Flexible hours", "PharmD / PhD", 80],
      ["Surgical & Procedural Reviewer", "Evaluate procedural reasoning, indications and peri-operative guidance.", "Remote", "Project-based", "Surgeon", 95],
      ["Mental Health Safety Reviewer", "Assess how models respond in sensitive clinical and crisis contexts.", "Remote", "Flexible hours", "Licensed clinician", 82],
      ["Medical Literature Validator", "Verify citations, study design claims and evidence grading in model output.", "Remote", "10–20 hrs/wk", "PhD / MD", 78],
    ],
    Finance: [
      ["Finance & Accounting Task Author", "Design expert reconciliation tasks that challenge advanced AI agents.", "Remote", "Project-based", "CA / CFA", 95],
      ["Quantitative Modelling Reviewer", "Pressure-test valuation and risk models produced by frontier systems.", "Remote", "Flexible hours", "Senior", 90],
      ["Audit & Reconciliation Expert", "Check statements, ledgers and controls the way a real audit would.", "Remote", "10–20 hrs/wk", "5+ yrs experience", 78],
      ["Markets & Trading Analyst", "Judge model reasoning on derivatives, hedging and market microstructure.", "Remote", "Project-based", "Buy-side experience", 98],
      ["Financial Reporting Reviewer", "Validate IFRS and GAAP treatment in model-generated statements.", "Remote", "Flexible hours", "CA / CPA", 85],
      ["Risk & Compliance Expert", "Stress-test how models handle regulatory limits and reporting duties.", "Remote", "10–20 hrs/wk", "Senior", 88],
    ],
  };

  const tabs = $(".ex-tabs"), jobs = $(".ex-jobs");
  if (tabs && jobs) {
    const ink = $(".ex-tabs__ink", tabs);
    const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    const card = ([t, d, where, hrs, lvl, rate]) => `<a class="ex-job" href="#apply">
        <h4>${esc(t)}</h4><p>${esc(d)}</p>
        <span class="ex-job__tags"><span class="chip">${where}</span><span class="chip">${hrs}</span><span class="chip">${lvl}</span></span>
        <span class="ex-job__foot"><span class="ex-job__rate"><b>$${rate}<small> / hr</small></b><span>Fixed rate</span></span><span class="ex-job__go">Apply <img src="img/arrow-ne.svg" alt=""></span></span>
      </a>`;
    const names = Object.keys(ROLES);
    names.forEach((n, i) => tabs.insertAdjacentHTML("beforeend",
      `<button role="tab" id="ex-tab-${i}" aria-selected="${i ? "false" : "true"}" aria-controls="ex-jobs">${n}</button>`));
    jobs.id = "ex-jobs";
    const btns = $$("button", tabs);
    let cur = -1;
    const moveInk = () => {
      const b = btns[Math.max(cur, 0)];
      ink.style.width = b.offsetWidth + "px";
      ink.style.transform = `translateX(${b.offsetLeft}px)`;
    };
    const show = (i, animate) => {
      if (i === cur) return;
      cur = i;
      btns.forEach((b, k) => b.setAttribute("aria-selected", k === i));
      jobs.setAttribute("aria-labelledby", btns[i].id);
      moveInk();
      const fill = () => {
        jobs.innerHTML = ROLES[names[i]].map(card).join("");
        if (animate && window.gsap && !REDUCED)
          gsap.fromTo($$(".ex-job", jobs), { opacity: 0, y: 18, filter: "blur(8px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: .9, ease: EASE, stagger: .05, clearProps: "filter" });
      };
      if (animate && window.gsap && !REDUCED && jobs.children.length)
        gsap.to($$(".ex-job", jobs), { opacity: 0, y: -8, filter: "blur(6px)", duration: .3, ease: "power2.in", stagger: .02, onComplete: fill });
      else fill();
    };
    btns.forEach((b, i) => b.addEventListener("click", () => show(i, true)));
    tabs.addEventListener("keydown", e => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      const n = (cur + d + btns.length) % btns.length;
      show(n, true); btns[n].focus();
    });
    show(0, false);
    addEventListener("resize", moveInk);
    document.fonts && document.fonts.ready.then(moveInk);
  }

  /* ---------- images grow into place as they scroll in (data-grow = starting scale) ---------- */

  const grow = $$("[data-grow]");
  if (grow.length && !REDUCED) {
    let ticking = false;
    const paint = () => {
      ticking = false;
      const vh = innerHeight;
      grow.forEach(el => {
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * .95 - r.top) / (vh * .9)));
        const from = +el.dataset.grow, e = p * p * (3 - 2 * p);
        el.style.transform = `scale(${from + (1 - from) * e})`;
      });
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
    addEventListener("resize", paint);
    paint();
  }

  /* ---------- FAQ accordion ---------- */

  $$(".qa").forEach(qa => {
    const q = $(".qa__q", qa);
    q.addEventListener("click", () => {
      const open = !qa.classList.contains("is-open");
      qa.classList.toggle("is-open", open);
      q.setAttribute("aria-expanded", open);
    });
  });



  /* ---------- the work: tabs auto-advance over the canvas; each tab shows the task itself ---------- */

  const wk = $("[data-work]");
  if (wk) {
    const tabs = $$(".wk-tab", wk), panels = $$(".wk-panel", wk), bars = tabs.map(t => $(".wk-tab__bar b", t));
    const DUR = 6.5;
    let cur = -1, prog = null, seen = false;
    const go = i => {
      i = (i + tabs.length) % tabs.length;
      if (i === cur) return;
      cur = i;
      tabs.forEach((t, k) => t.setAttribute("aria-selected", k === i));
      panels.forEach((p, k) => p.classList.toggle("is-on", k === i));
      if (!window.gsap) return;
      prog && prog.kill();
      bars.forEach((b, k) => k !== i && gsap.to(b, { scaleX: 0, duration: .3 }));
      prog = gsap.fromTo(bars[i], { scaleX: 0 }, { scaleX: 1, duration: DUR, ease: "none", onComplete: () => go(cur + 1) });
      if (!seen || REDUCED) prog.pause();
    };
    tabs.forEach((t, i) => t.addEventListener("click", () => go(i)));
    go(0);
    new IntersectionObserver(([e]) => { seen = e.isIntersecting; prog && (seen && !REDUCED ? prog.resume() : prog.pause()); }, { threshold: .3 }).observe(wk);
  }

  /* ---------- testimonials: the wall's columns drift at different speeds as it scrolls by ---------- */

  const drift = $$("[data-drift]");
  if (drift.length && !REDUCED && matchMedia("(min-width: 821px)").matches) {
    let ticking = false;
    const paint = () => {
      ticking = false;
      drift.forEach(col => {
        const r = col.parentElement.getBoundingClientRect();
        const p = (innerHeight / 2 - (r.top + r.height / 2)) * +col.dataset.drift;
        col.style.transform = `translateY(${p.toFixed(1)}px)`;
      });
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
    paint();
  }

  /* ---------- how it works: the card's timing line and big number follow the active step ---------- */

  const when = $("[data-when]"), big = $(".ex-card__big"), list = $$(".ex-sl");
  if (when && list.length) {
    const WHEN = ["~5 min", "~5 business days", "Online", "Paid", "Ongoing · paid"];
    const sync = () => {
      const i = list.findIndex(b => b.getAttribute("aria-selected") === "true");
      if (i < 0) return;
      if (big.textContent === String(i + 1).padStart(2, "0")) return;
      const set = () => { when.textContent = WHEN[i]; big.textContent = String(i + 1).padStart(2, "0"); };
      if (!window.gsap || REDUCED || !big.textContent) return set();
      gsap.to([when, big], { opacity: 0, y: -6, duration: .2, ease: "power2.in", onComplete: () => {
        set(); gsap.fromTo([when, big], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .6, ease: EASE });
      } });
    };
    list.forEach(b => new MutationObserver(sync).observe(b, { attributes: true, attributeFilter: ["aria-selected"] }));
    sync();
  }

  /* ---------- pins: team.js creates the reel's pin before about.js creates the dial's, though the dial sits
     above it on this page — re-sort by page order so the reel's start includes the dial's pin spacing ---------- */
  if (window.ScrollTrigger) {
    const resort = () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); };
    resort();
    addEventListener("load", resort);
  }
})();
