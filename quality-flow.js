/* The Deccan Approach: when it scrolls in, the inputs light up one by one and then the result.
   One outcome is open at a time; clicking the open one closes it. The first starts open. */
(() => {
  const root = document.querySelector(".qf");
  if (!root) return;
  const $$ = s => [...root.querySelectorAll(s)];
  const rows = $$(".qf-row"), end = root.querySelector(".qf-end"), outs = $$(".qf-out");
  const steps = [...rows, end];

  root.classList.add("is-live");

  const set = (o, on) => { o.classList.toggle("is-on", on); o.setAttribute("aria-expanded", on); };
  outs.forEach((o, k) => {
    set(o, k === 0);
    o.addEventListener("click", () => { const on = !o.classList.contains("is-on"); outs.forEach(x => set(x, x === o && on)); });
  });

  if (!window.gsap || matchMedia("(prefers-reduced-motion: reduce)").matches) { steps.forEach(el => el.classList.add("is-on")); return; }
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    steps.forEach((el, i) => gsap.delayedCall(.5 + i * .7, () => el.classList.add("is-on")));
  }, { threshold: .35 });
  io.observe(root);
})();
