/* About hero — floating polaroids around a centred line (after Profound).
   Photos drift on their own and can be picked up and thrown; they do not react to hover.
   Scrolling on flies through them: the hero holds while the mission rises over it. */
(() => {
  if (!window.gsap) return;
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const onView = (el, fn) => { const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); fn(); } }, { threshold: .25 }); io.observe(el); };

  /* ---------- floating polaroids ---------- */

  const hp = $(".hp3");
  if (hp) {
    const stage = $(".hp3__stage", hp);
    // [img, caption, x%, y%, width, rotation, depth]  — x,y are the photo's centre; depth < .7 sits far back (blurred)
    // Four near and four far, paired across the headline so each side carries the same weight.
    const PICS = [
      ["img/about/hero-1.webp", "on stage", 14, 28, 196, -5, 1],
      ["img/about/hero-2.webp", "say hi!", 86, 28, 196, 5, 1],
      ["img/about/hero-3.webp", "the booth crew", 13, 72, 208, 3, 1.1],
      ["img/office-2.png", "review day", 87, 72, 208, -3, 1.1],
      ["img/office-3.png", "the floor", 32, 19, 132, 3, .55],
      ["img/office-6.png", "standup", 68, 19, 132, -3, .55],
      ["img/office-1.png", "heads down", 31, 83, 140, -4, .6],
      ["img/office-4.png", "1:1s", 69, 83, 140, 4, .6],
    ];
    // phones: only the near photos, two above the headline and two below
    const PHONE = [[27, 17], [73, 16], [27, 83], [73, 84]];
    const phone = innerWidth < 821;
    const fit = phone ? .62 : gsap.utils.clamp(.72, 1.25, innerWidth / 1440);  // photos keep their share of wider screens
    let pi = 0;
    const items = PICS.filter(p => !phone || p[6] >= .7).map(([src, cap, x, y, w, rot, depth]) => {
      if (phone) [x, y] = PHONE[pi++ % PHONE.length];
      w = Math.round(w * fit);
      const h = (w - (phone ? 12 : 18)) * 1.05 + (phone ? 32 : 47);  // polaroid height: photo plus its border
      const fly = document.createElement("div"), par = document.createElement("div");
      fly.className = "pol-fly";
      fly.style.left = `calc(${x}% - ${w / 2}px)`; fly.style.top = `calc(${y}% - ${h / 2}px)`; fly.style.width = w + "px"; fly.style.zIndex = Math.round(depth * 10);
      par.className = "pol-par" + (depth < .7 ? " is-far" : "");
      par.innerHTML = `<figure class="pol"><img src="${src}" alt="" draggable="false"><span>${cap}</span></figure>`;
      fly.append(par);
      stage.append(fly);
      const pol = $(".pol", par);
      gsap.set(pol, { rotation: rot });
      return { fly, par, pol, rot, depth };
    });

    // idle drift, each on its own slow sine
    if (!REDUCED) items.forEach((it, i) => gsap.to(it.pol, { y: (i % 2 ? -1 : 1) * (6 + it.depth * 5), rotation: it.rot + (i % 2 ? 1.5 : -1.5), duration: 3.2 + (i % 4) * .7, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * .2 }));

    // pick one up: it follows the pointer, tilts with the throw, lands where you drop it
    let top = 20;
    items.forEach(it => {
      let sx, sy, ox, oy, lx, vx = 0, lt;
      const dx = { v: 0 }, dy = { v: 0 };
      it.pol.addEventListener("pointerdown", e => {
        e.preventDefault();
        it.pol.setPointerCapture(e.pointerId); it.pol.classList.add("is-drag");
        it.fly.style.zIndex = ++top;
        sx = e.clientX; sy = e.clientY; ox = gsap.getProperty(it.pol, "x"); oy = gsap.getProperty(it.pol, "y");
        lx = e.clientX; lt = performance.now();
        gsap.killTweensOf(it.pol);
        gsap.to(it.pol, { scale: 1.06, rotation: 0, duration: .3, ease: "power3.out" });
      });
      it.pol.addEventListener("pointermove", e => {
        if (!it.pol.classList.contains("is-drag")) return;
        const now = performance.now(); vx = (e.clientX - lx) / Math.max(1, now - lt); lx = e.clientX; lt = now;
        gsap.set(it.pol, { x: ox + e.clientX - sx, y: oy + e.clientY - sy, rotation: gsap.utils.clamp(-14, 14, vx * 9) });
      });
      const drop = () => {
        if (!it.pol.classList.contains("is-drag")) return;
        it.pol.classList.remove("is-drag");
        const land = it.rot + gsap.utils.clamp(-8, 8, vx * 6);
        it.rot = land;
        gsap.to(it.pol, { scale: 1, rotation: land, duration: .8, ease: "elastic.out(1,.55)" });
      };
      it.pol.addEventListener("pointerup", drop);
      it.pol.addEventListener("pointercancel", drop);
    });

    // entrance: tossed onto the table from the centre, nearest first
    if (!REDUCED) {
      items.forEach(it => gsap.set(it.par, { opacity: 0 }));
      onView(hp, () => {
        const r = hp.getBoundingClientRect();
        items.slice().sort((a, b) => b.depth - a.depth).forEach((it, i) => {
          const pr = it.par.getBoundingClientRect();
          gsap.fromTo(it.par, { opacity: 0, x: r.left + r.width / 2 - (pr.left + pr.width / 2), y: r.top + r.height / 2 - (pr.top + pr.height / 2), scale: .4 },
            { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.1, ease: "expo.out", delay: .15 + i * .08 });
        });
      });
    }

    // scroll: the hero holds and the camera moves through the photos. Each one grows as it nears
    // and slides out from the centre, far ones setting off a little later, while the mission rises.
    if (!REDUCED && window.ScrollTrigger && hp.nextElementSibling?.matches(".mission")) {
      const copy = $(".hp3__copy", hp), glow = $(".hp3__glow", hp);
      const clamp = gsap.utils.clamp(0, 1), part = (t, a, b) => clamp((t - a) / (b - a));
      const measure = () => items.forEach(it => {
        it.dx = it.fly.offsetLeft + it.fly.offsetWidth / 2 - hp.offsetWidth / 2;
        it.dy = it.fly.offsetTop + it.fly.offsetHeight / 2 - hp.offsetHeight / 2;
        it.delay = (1.25 - it.depth) * .22;
      });
      const render = t => {
        items.forEach(it => {
          const p = part(t, it.delay, 1), s = 1 / (1 - .86 * p), o = 1 - part(t, .5, .75);
          gsap.set(it.fly, { x: it.dx * (s - 1), y: it.dy * (s - 1), scale: s, rotation: (it.dx < 0 ? -1 : 1) * p * 8, autoAlpha: o });
          if (it.depth < .7) { const c = part(p, 0, .3); it.pol.style.filter = c < 1 ? `blur(${2.2 * (1 - c)}px)` : "none"; it.pol.style.opacity = .55 + .45 * c; }
        });
        const c = part(t, 0, .3);
        copy.style.opacity = 1 - c;
        copy.style.transform = `translateY(${-48 * c}px)`;
        copy.style.filter = c ? `blur(${8 * c}px)` : "none";
        copy.style.visibility = c === 1 ? "hidden" : "";
        glow.style.opacity = .7 * (1 - part(t, .2, .7));
      };
      measure();
      const fly = { t: 0 };
      gsap.to(fly, { t: 1, ease: "none", onUpdate: () => render(fly.t), scrollTrigger: {
        trigger: hp, start: 0, end: () => "+=" + hp.offsetHeight, pin: true, pinSpacing: false, scrub: .6, invalidateOnRefresh: true,
        onRefresh: () => { measure(); render(fly.t); } } });
    }
  }
})();
