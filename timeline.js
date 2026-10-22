/* Research timeline options without photos (about-v2.html).
   Option 1 — ruler scrubber: a month ruler slides under a fixed playhead; ticks swell as they pass it.
   Option 3 — changelog: a sticky year rolls over as entries scroll through the centre of the screen.
   Titles, summaries and links are Deccan's published research (deccan.ai/research).
   DATES ARE PLACEHOLDERS — the research pages don't show publish dates. Fix them here. */
(() => {
  if (!window.gsap) return;
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SNAP = "expo.out";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const R = "https://www.deccan.ai/research/";

  const ENTRIES = [ // oldest → newest
    { date: "2025-03", tag: "Coding agents", title: "Anthar Study: Evaluating AI Coding Agents Beyond Benchmarks",
      desc: "A human evaluation benchmark measuring how well autonomous coding agents perform in real development workflows and security-critical scenarios.",
      href: R + "anthar-study-evaluating-ai-coding-agents-beyond-benchmarks" },
    { date: "2025-05", tag: "Web app builders", title: "WebApp Study: Evaluating AI-Native Web Application Builders",
      desc: "A human evaluation benchmark measuring how well no-code platforms handle real application development tasks.",
      href: R + "webapp-study-evaluating-ai-native-web-application-builders" },
    { date: "2025-07", tag: "Image generation", title: "Image Generation Study: Deeper Assessment of Image SOTA Models",
      desc: "We introduce a new framework for end-to-end evaluation of next-gen image generation models.",
      href: R + "the-next-generation-of-image-ai-a-5-model-benchmark-study" },
    { date: "2025-09", tag: "Instruction following", title: "IF Benchmark: Constraint Choice Predicts Failure Rate Better Than Model Choice",
      desc: "This study evaluates instruction-following reliability in frontier models under controlled, multi-constraint conditions.",
      href: R + "if-benchmark-constraint-choice-predicts-failure-rate-better-than-model-choice" },
    { date: "2025-11", tag: "Deep research agents", title: "From Compliance to Foresight: Benchmarking Deep Research Agents",
      desc: "The study examines the “proactive” research capabilities of state-of-the-art models using novel rubrics.",
      href: R + "from-compliance-to-foresight-benchmarking-deep-research-agents" },
    { date: "2026-01", tag: "Embodied AI data", title: "Introducing the Bumblebee Dataset Report",
      desc: "A report on our egocentric video corpus, focused on the properties that characterise a corpus for embodied learning.",
      href: "https://www.deccan.ai/research" },
    { date: "2026-04", tag: "Text-to-speech", board: true, title: "Introducing VoxClash: A TTS leaderboard that reveals where exactly a model breaks down",
      desc: "TTS outputs finally sound human, yet picking the right model for your language and use case is still a guessing game. VoxClash is our shot at fixing that.",
      href: R + "introducing-voxclash-a-tts-leaderboard-that-reveals-where-exactly-a-model-breaks-down" },
    { date: "2026-07", tag: "Video captioning", title: "Introducing CaptionBench: A Stalemate on the Leaderboard Masks Distinct Failure Modes",
      desc: "Trained reviewers rewrote and graded every caption from six video captioning models against the footage, then compared what they found with the leaderboard scores.",
      href: R + "introducing-caption-bench-video-captioning-benchmark" },
    { date: "2026-10", tag: "Text-to-speech", board: true, title: "Introducing VoxClash TTS 2.0",
      desc: "Cartesia Sonic 3.6 has the highest Elo on six of nine languages, and ElevenLabs v4 and Gemini 3.1 Flash TTS lead the rest.",
      href: R + "introducing-voxclash-tts-2-0" },
  ];
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const ym = d => { const [y, m] = d.split("-").map(Number); return { y, m: m - 1 }; };
  const fmt = d => { const { y, m } = ym(d); return `${MON[m]} ${y}`; };
  const arrow = '<svg viewBox="0 0 12 12" fill="none"><path d="M3 9 9 3M4 3h5v5" stroke="currentColor" stroke-width="1.3"/></svg>';
  const meta = e => `<span class="rs-chip">${e.tag}</span>${e.board ? '<span class="rs-chip rs-chip--blue">Leaderboard</span>' : ""}<a class="rs-link" href="${e.href}" target="_blank" rel="noopener">Read the research ${arrow}</a>`;
  const words = (el, text) => { el.innerHTML = text.split(/(\s+)/).map(w => /^\s+$/.test(w) ? w : `<span data-w>${w}</span>`).join(""); return $$("[data-w]", el); };

  /* ---------- option 1 · ruler scrubber ---------- */

  const rsec = $(".ruler-sec");
  if (rsec) {
    const stage = $(".rs-stage", rsec), track = $(".rs-track", rsec);
    const card = $(".rs-card", rsec), dateEl = $(".rs-date", card), titleEl = $(".rs-title", card), descEl = $(".rs-desc", card), metaEl = $(".rs-meta", card);
    const countEl = $(".rs-count", rsec), playBtn = $(".rs-btn--play", rsec);
    const PX_MONTH = 84, MINOR = 12, PAD = 7;                          // 7 minor ticks a month, 7 months of runway each side
    const first = ym(ENTRIES[0].date), monthIdx = d => { const { y, m } = ym(d); return (y - first.y) * 12 + (m - first.m) + PAD; };
    const months = monthIdx(ENTRIES[ENTRIES.length - 1].date) + PAD + 1;
    const width = months * PX_MONTH;
    track.style.width = width + "px";

    // ticks, month/year labels, entry markers
    const ticks = [];
    let html = "";
    for (let x = 0; x <= width; x += MINOR) {
      const isMonth = x % PX_MONTH === 0;
      html += `<i class="rs-tick${isMonth ? " rs-tick--month" : ""}" style="left:${x}px;height:${isMonth ? 30 : 16}px"></i>`;
      if (isMonth) {
        const mi = x / PX_MONTH - PAD + first.m, y = first.y + Math.floor(mi / 12), m = ((mi % 12) + 12) % 12;
        html += `<span class="rs-lbl${m === 0 ? " rs-lbl--year" : ""}" style="left:${x}px">${m === 0 ? y : MON[m]}</span>`;
      }
    }
    const entryX = ENTRIES.map(e => monthIdx(e.date) * PX_MONTH + PX_MONTH / 2);
    entryX.forEach((x, i) => { html += `<i class="rs-tick rs-tick--entry" style="left:${x}px;height:64px"></i><span class="rs-hit" style="left:${x}px" data-i="${i}" title="${fmt(ENTRIES[i].date)}"></span>`; });
    track.innerHTML = html;
    $$(".rs-tick", track).forEach(t => ticks.push({ el: t, x: parseFloat(t.style.left) }));

    // the ruler is a single offset; ticks near the playhead swell (a gaussian magnifier)
    const pos = { x: 0 };
    const centre = () => stage.clientWidth / 2;
    const render = () => {
      gsap.set(track, { x: pos.x });
      const c = centre();
      for (const t of ticks) {
        const d = t.x + pos.x - c;
        if (d < -c - 40 || d > c + 40) continue;
        t.el.style.transform = `scaleY(${1 + 1.25 * Math.exp(-(d * d) / (2 * 110 * 110))})`;
      }
    };
    const offsetFor = i => centre() - entryX[i];

    let cur = -1, prog = null, paused = REDUCED, visible = false;
    const swap = i => {
      const e = ENTRIES[i], els = $$("[data-w]", card);
      const enter = () => {
        dateEl.textContent = fmt(e.date);
        const w = [...words(titleEl, e.title), ...words(descEl, e.desc)];
        metaEl.innerHTML = meta(e);
        gsap.fromTo([dateEl, ...w, ...metaEl.children], { opacity: 0, y: 10, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: .5, ease: "power2.out", stagger: .012 });
      };
      if (!els.length || REDUCED) return enter();
      gsap.killTweensOf([dateEl, ...els, ...metaEl.children]);
      gsap.to([dateEl, ...els, ...metaEl.children], { opacity: 0, y: -6, filter: "blur(6px)", duration: .18, ease: "power2.in", stagger: .002, onComplete: enter });
    };
    const go = (i, quick) => {
      i = (i + ENTRIES.length) % ENTRIES.length;
      if (i !== cur) swap(i);
      cur = i;
      countEl.innerHTML = `<b>${String(i + 1).padStart(2, "0")}</b> / ${String(ENTRIES.length).padStart(2, "0")}`;
      gsap.to(pos, { x: offsetFor(i), duration: quick ? 0 : 1.1, ease: SNAP, overwrite: true, onUpdate: render });
      if (quick) render();
      schedule();
    };
    const schedule = () => {
      prog && prog.kill();
      prog = gsap.delayedCall(4.5, () => go(cur + 1));
      if (paused || !visible) prog.pause();
    };

    $(".rs-btn--prev", rsec).addEventListener("click", () => go(cur - 1));
    $(".rs-btn--next", rsec).addEventListener("click", () => go(cur + 1));
    track.addEventListener("click", e => { const h = e.target.closest(".rs-hit"); if (h && !dragged) go(+h.dataset.i); });
    playBtn.addEventListener("click", () => {
      paused = !paused;
      playBtn.setAttribute("aria-pressed", paused);
      playBtn.setAttribute("aria-label", paused ? "Play timeline" : "Pause timeline");
      playBtn.innerHTML = paused ? '<svg viewBox="0 0 12 12"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor"/></svg>' : '<svg viewBox="0 0 12 12"><path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor"/></svg>';
      paused ? prog.pause() : visible && prog.resume();
    });

    // drag: the ruler follows the pointer, then snaps to the nearest entry (with a little throw)
    let dragging = false, dragged = false, startX = 0, startPos = 0, lastX = 0, lastT = 0, vel = 0;
    stage.addEventListener("pointerdown", e => {
      dragging = true; dragged = false; startX = lastX = e.clientX; startPos = pos.x; lastT = performance.now(); vel = 0;
      gsap.killTweensOf(pos); prog && prog.pause();
      stage.classList.add("is-drag"); stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener("pointermove", e => {
      if (!dragging) return;
      const now = performance.now();
      vel = (e.clientX - lastX) / Math.max(1, now - lastT); lastX = e.clientX; lastT = now;
      if (Math.abs(e.clientX - startX) > 4) dragged = true;
      pos.x = Math.min(centre() - entryX[0] + 60, Math.max(centre() - entryX[entryX.length - 1] - 60, startPos + e.clientX - startX));
      render();
    });
    const release = () => {
      if (!dragging) return;
      dragging = false; stage.classList.remove("is-drag");
      if (!dragged) return schedule();
      const aim = centre() - (pos.x + vel * 220);
      let best = 0; entryX.forEach((x, i) => { if (Math.abs(x - aim) < Math.abs(entryX[best] - aim)) best = i; });
      go(best);
      setTimeout(() => (dragged = false), 0);
    };
    stage.addEventListener("pointerup", release);
    stage.addEventListener("pointercancel", release);
    addEventListener("resize", () => go(cur, true));
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; prog && (visible && !paused ? prog.resume() : prog.pause()); }, { threshold: .3 }).observe(rsec);
    go(0, true);
  }

  /* ---------- option 4 · calendar (after amie.so/calendar) ---------- */

  const cal = $(".cal");
  if (cal) {
    const board = $(".cal__board", cal), track = $(".cal__track", cal);
    const SWATCH = ["#fff1a8", "#dcecff", "#e2f3dd", "#fde3e1", "#efe6ff"];  // sticky-note paper
    const TOPS = [100, 168, 112, 226, 96, 190, 128, 214, 104];
    const short = e => e.title.split(":")[0].replace(/^Introducing (the )?/, "");
    const cols = ENTRIES.map((e, i) => {
      const { y, m } = ym(e.date), bg = SWATCH[i % SWATCH.length];
      return `<div class="cal__col"><div class="cal__ch"><b>${MON[m]}</b><span>${y}</span></div>
        <a class="ev" href="${e.href}" target="_blank" rel="noopener" draggable="false" style="--bg:${bg};top:${TOPS[i % TOPS.length]}px">
          <span class="ev__t">${short(e)}${e.board ? '<span class="ev__b">Board</span>' : ""}</span>
          <span class="ev__d">${fmt(e.date)} · ${e.tag}</span>
          <span class="ev__x">${e.desc}</span>
          <span class="ev__a">Read ${arrow}</span>
        </a></div>`;
    });
    const RING = '<svg class="cal__ring" viewBox="0 0 118 58"><path pathLength="1" d="M70 6C38 2 6 12 5 30c-1 18 30 25 58 23 30-2 52-12 50-27C111 11 86 4 54 7"/></svg>';
    cols.push(`<div class="cal__col cal__col--today"><div class="cal__ch"><b>Today</b><span>Oct 23, 2026</span>${RING}</div></div>`);
    track.innerHTML = cols.join("");
    const evs = $$(".ev", track);

    // handwritten margin notes: [column, x, y, text, arrow path (from the text toward its note), arrow box]
    // arrows are drawn from the words to the note, in the words' own coordinates (0,0 = top-left of the text)
    const HAND = [
      [0, 44, 380, "where it all started", "M58 -6 C 56 -28, 66 -48, 84 -66 M84 -66 l-9 3 M84 -66 l-1 9"],
      [3, 92, 128, "constraints > models", "M44 30 C 34 46, 32 64, 40 80 M40 80 l-8 -5 M40 80 l3 -9"],
      [6, 46, 400, "our first leaderboard!", "M44 -6 C 46 -24, 56 -40, 70 -56 M70 -56 l-9 2 M70 -56 l0 9"],
      [7, 30, 112, "6 models, no clear winner", "M118 30 C 120 52, 112 70, 100 86 M100 86 l1 -9 M100 86 l8 -4"],
      [8, 50, 404, "now in 9 languages", "M40 -6 C 42 -26, 50 -44, 62 -60 M62 -60 l-9 2 M62 -60 l0 9"],
    ];
    const hands = HAND.map(([c, x, y, text, d]) => {
      const el = document.createElement("span");
      el.className = "cal__hand";
      el.style.left = `calc(${c} * var(--colw) + ${x}px)`; el.style.top = y + "px";
      el.innerHTML = `<svg style="left:0;top:0" width="1" height="1"><path pathLength="1" d="${d}"/></svg>${text}`;
      track.append(el);
      return el;
    });
    const setColW = () => track.style.setProperty("--colw", $(".cal__col", track).offsetWidth + "px");
    setColW();

    const pos = { x: 0 };
    let minX = 0;
    const bounds = () => { minX = Math.min(0, board.clientWidth - track.scrollWidth - 40); };
    const setX = x => { pos.x = x; gsap.set(track, { x }); };
    const rubber = x => x > 0 ? x * .3 : x < minX ? minX + (x - minX) * .3 : x;
    // notes hang from their top edge and swing against the motion, then settle
    const TILT = [-2.4, 1.8, -1.1, 2.6, -1.9, 1.2, -2.8, 2.1, -1.4];
    evs.forEach((n, i) => n.style.setProperty("--tape", (i % 2 ? 3 : -3) + "deg"));
    const sway = v => evs.forEach((n, i) => gsap.to(n, { rotation: TILT[i % TILT.length] + gsap.utils.clamp(-6, 6, -v * 3.2), duration: .55, ease: "power3.out", overwrite: "auto" }));
    const settle = (target, dur = .9) => {
      const to = gsap.utils.clamp(minX, 0, target);
      gsap.to(pos, { x: to, duration: dur, ease: "expo.out", overwrite: true, onUpdate: () => gsap.set(track, { x: pos.x }) });
      sway(0);
    };
    bounds();
    setX(0);                                                    // start at the first study; travel forward in time

    let drag = false, moved = false, sx = 0, s0 = 0, lx = 0, lt = 0, v = 0;
    board.addEventListener("pointerdown", e => {
      if (e.button) return;
      drag = true; moved = false; sx = lx = e.clientX; s0 = pos.x; lt = performance.now(); v = 0;
      gsap.killTweensOf(pos);
      board.setPointerCapture(e.pointerId); board.classList.add("is-drag");
    });
    board.addEventListener("pointermove", e => {
      if (!drag) return;
      const now = performance.now();
      v = (e.clientX - lx) / Math.max(1, now - lt); lx = e.clientX; lt = now;
      if (Math.abs(e.clientX - sx) > 4) moved = true;
      setX(rubber(s0 + e.clientX - sx));
      sway(v);
    });
    const up = () => { if (!drag) return; drag = false; board.classList.remove("is-drag"); settle(pos.x + v * 420); };
    board.addEventListener("pointerup", up);
    board.addEventListener("pointercancel", up);
    board.addEventListener("click", e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    board.addEventListener("wheel", e => {
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!dx) return;
      e.preventDefault(); gsap.killTweensOf(pos);
      setX(gsap.utils.clamp(minX, 0, pos.x - dx));
      sway(-dx / 40); clearTimeout(board._w); board._w = setTimeout(() => sway(0), 140);
    }, { passive: false });
    // page scroll nudges them too: a small swing proportional to scroll speed
    let lastY = scrollY, lastS = performance.now(), sTo;
    addEventListener("scroll", () => {
      const r = board.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) { lastY = scrollY; return; }
      const now = performance.now(), vy = (scrollY - lastY) / Math.max(1, now - lastS);
      lastY = scrollY; lastS = now;
      sway(gsap.utils.clamp(-1.4, 1.4, vy * .9));
      clearTimeout(sTo); sTo = setTimeout(() => sway(0), 120);
    }, { passive: true });
    const colW = () => $(".cal__col", track).offsetWidth;
    $(".cal__prev", cal).addEventListener("click", () => settle(Math.round((pos.x + colW()) / colW()) * colW(), 1));
    $(".cal__next", cal).addEventListener("click", () => settle(Math.round((pos.x - colW()) / colW()) * colW(), 1));
    addEventListener("resize", () => { setColW(); bounds(); settle(pos.x, 0); });

    if (!REDUCED) {
      evs.forEach((n, i) => gsap.set(n, { rotation: TILT[i % TILT.length] }));
      gsap.set(evs, { opacity: 0, y: 14 });
      new IntersectionObserver(([e], io) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        gsap.to(evs, { opacity: 1, y: 0, duration: .6, ease: "back.out(1.6)", stagger: .07, delay: .1 });
        // ink: arrows and the Today circle draw themselves in, then the words fade up
        gsap.fromTo($$(".cal__hand path, .cal__ring path", track), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .9, ease: "power2.inOut", stagger: .12, delay: .7 });
        gsap.fromTo(hands, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .5, ease: "power2.out", stagger: .12, delay: .9 });
      }, { threshold: .3 }).observe(board);
    }
  }

  /* ---------- option 3 · pinned research index ---------- */

  const rix = $(".rix");
  if (rix) {
    const items = [...ENTRIES].reverse(); // newest first
    const short = e => e.title.split(":")[0].replace(/^Introducing (the )?/, "");
    const list = $(".rix__list", rix), card = $(".rix__card", rix), countEl = $(".rix__count", rix), prog = $(".rix__prog i", rix);
    const yearEl = $(".rix__year", card), monEl = $(".rix__mon", card), titleEl = $(".rix__title", card), descEl = $(".rix__desc", card), metaEl = $(".rix__meta", card);
    const ROW = 56;
    list.innerHTML = items.map((e, i) => `<div class="rix__row" role="listitem" data-i="${i}"><time>${fmt(e.date)}</time><span>${short(e)}</span></div>`).join("");
    const rows = $$(".rix__row", list);

    const byYear = {};
    items.forEach(e => (byYear[ym(e.date).y] ||= []).push(e));
    $(".rix-m", rix).innerHTML = Object.keys(byYear).sort((a, b) => b - a).map(y => `<div class="rix-m__year">${y}</div>` +
      byYear[y].map(e => `<article class="rix-m__item"><time>${fmt(e.date)}</time><h3>${e.title}</h3><p>${e.desc}</p><div class="rix__meta">${meta(e)}</div></article>`).join("")).join("");

    let shownY = "";
    const setYear = (y, dir) => {
      const next = String(y);
      if (!shownY) { yearEl.innerHTML = [...next].map(d => `<i><b>${d}</b></i>`).join(""); shownY = next; return; }
      const slots = $$("i", yearEl);
      [...next].forEach((d, k) => {
        if (d === shownY[k]) return;
        const slot = slots[k], old = $$("b", slot), nb = document.createElement("b");
        nb.textContent = d; gsap.set(nb, { position: "absolute", top: 0, left: 0 }); slot.append(nb);
        gsap.to(old, { yPercent: -100 * dir, opacity: 0, duration: .5, ease: "power3.inOut", onComplete: () => old.forEach(o => o.remove()) });
        gsap.fromTo(nb, { yPercent: 100 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .5, ease: "power3.inOut", delay: k * .05, onComplete: () => gsap.set(nb, { position: "relative" }) });
      });
      shownY = next;
    };

    let cur = -1;
    const show = (i, dir = 1) => {
      if (i === cur) return;
      const e = items[i];
      setYear(ym(e.date).y, dir);
      countEl.innerHTML = `<b>${String(i + 1).padStart(2, "0")}</b> / ${String(items.length).padStart(2, "0")}`;
      const old = [monEl, ...$$("[data-w]", card), ...metaEl.children];
      const enter = () => {
        monEl.textContent = MON[ym(e.date).m];
        const w = [...words(titleEl, e.title), ...words(descEl, e.desc)];
        metaEl.innerHTML = meta(e);
        gsap.fromTo([monEl, ...w, ...metaEl.children], { opacity: 0, y: 12 * dir, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: .55, ease: "power2.out", stagger: .01 });
      };
      cur = i;
      if (REDUCED || old.length < 3) return enter();
      gsap.killTweensOf(old);
      gsap.to(old, { opacity: 0, y: -10 * dir, filter: "blur(6px)", duration: .18, ease: "power2.in", stagger: .002, onComplete: enter });
    };

    const paint = p => {
      const f = p * (items.length - 1);
      const mid = $(".rix__line", rix).offsetTop - ROW / 2;      // centre of the selected slot
      gsap.set(list, { y: mid - ROW / 2 - f * ROW });
      rows.forEach((r, k) => { r.style.opacity = Math.max(.12, 1 - Math.abs(k - f) * .3).toFixed(3); });
      prog.style.transform = `scaleY(${p})`;
      const i = Math.round(f);
      if (i !== cur) show(i, i > cur ? 1 : -1);
    };

    if (matchMedia("(min-width: 821px)").matches && window.ScrollTrigger && !REDUCED) {
      const st = ScrollTrigger.create({
        trigger: rix, start: "top top", end: () => "+=" + items.length * innerHeight * .42, pin: true, scrub: true,
        snap: { snapTo: 1 / (items.length - 1), duration: { min: .25, max: .6 }, ease: "power2.inOut", delay: .08 },
        onUpdate: s => paint(s.progress),
      });
      ScrollTrigger.sort(); ScrollTrigger.refresh();
      rows.forEach((r, k) => r.addEventListener("click", () => window.scrollTo({ top: st.start + (st.end - st.start) * (k / (items.length - 1)), behavior: "smooth" })));
    } else {
      rows.forEach((r, k) => r.addEventListener("click", () => paint(k / (items.length - 1))));
    }
    paint(0);
  }
})();
