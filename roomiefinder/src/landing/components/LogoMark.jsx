import { useEffect, useRef } from "react";

const EYE_REACH = 2.6;
const lerp = (from, to, amt) => from + (to - from) * amt;

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHoverFine = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const floatA = (t) => ({
  x: Math.sin(t * ((2 * Math.PI) / 6.7)) * 3,
  y: -Math.sin(t * ((2 * Math.PI) / 5.2)) * 7,
});
const floatB = (t) => ({
  x: Math.sin(t * ((2 * Math.PI) / 8.9) + Math.PI) * 3,
  y: Math.sin(t * ((2 * Math.PI) / 6.8)) * 7,
});

export function LogoMark({ className = "" }) {
  const svgRef = useRef(null);
  const ballARef = useRef(null);
  const ballBRef = useRef(null);
  const eyeARef = useRef(null);
  const eyeBRef = useRef(null);

  const hovering = useRef(false);
  const pointer = useRef(null);
  const pos = useRef({ ax: 0, ay: 0, bx: 0, by: 0, eax: 0, eay: 0, ebx: 0, eby: 0 });

  useEffect(() => {
    if (reduceMotion()) return;

    const onWindowMove = (e) => {
      const svg = svgRef.current;
      if (!svg || !canHoverFine()) return;
      const r = svg.getBoundingClientRect();
      pointer.current = {
        x: ((e.clientX - r.left) / r.width) * 97,
        y: ((e.clientY - r.top) / r.height) * 94,
      };
    };
    window.addEventListener("pointermove", onWindowMove);

    const look = (cx, cy) => {
      if (!pointer.current) return { x: 0, y: 0 };
      const dx = pointer.current.x - cx;
      const dy = pointer.current.y - cy;
      const dist = Math.hypot(dx, dy) || 1;
      return { x: (dx / dist) * EYE_REACH, y: (dy / dist) * EYE_REACH };
    };

    const start = performance.now();
    let raf = 0;
    const tick = (now) => {
      const t = (now - start) / 1000;
      const p = pos.current;
      const joined = hovering.current;

      const mx = pointer.current ? (pointer.current.x - 48.5) / 48.5 : 0;
      const my = pointer.current ? (pointer.current.y - 47) / 47 : 0;
      const targetA = joined ? { x: mx * 3.5, y: my * 3.5 } : floatA(t);
      const targetB = joined ? { x: mx * 5.5, y: my * 5.5 } : floatB(t);
      p.ax = lerp(p.ax, targetA.x, 0.06);
      p.ay = lerp(p.ay, targetA.y, 0.06);
      p.bx = lerp(p.bx, targetB.x, 0.06);
      p.by = lerp(p.by, targetB.y, 0.06);

      const lookA = look(31.3263, 46.3263);
      const lookB = look(61.6036, 46.3263);
      p.eax = lerp(p.eax, lookA.x, 0.2);
      p.eay = lerp(p.eay, lookA.y, 0.2);
      p.ebx = lerp(p.ebx, lookB.x, 0.2);
      p.eby = lerp(p.eby, lookB.y, 0.2);

      if (ballARef.current) ballARef.current.style.transform = `translate(${p.ax.toFixed(2)}px, ${p.ay.toFixed(2)}px)`;
      if (ballBRef.current) ballBRef.current.style.transform = `translate(${p.bx.toFixed(2)}px, ${p.by.toFixed(2)}px)`;
      if (eyeARef.current) eyeARef.current.style.transform = `translate(${p.eax.toFixed(2)}px, ${p.eay.toFixed(2)}px)`;
      if (eyeBRef.current) eyeBRef.current.style.transform = `translate(${p.ebx.toFixed(2)}px, ${p.eby.toFixed(2)}px)`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onWindowMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      onPointerEnter={() => (hovering.current = true)}
      onPointerLeave={() => (hovering.current = false)}
      viewBox="0 0 97 94"
      fill="none"
      role="img"
      aria-hidden="true"
      className={`logo-mark ${className}`}
    >

      <g ref={ballARef} className="ball">
        <circle cx="31.3263" cy="46.3263" r="18.3263" fill="white" />
        <g ref={eyeARef}>
          <circle cx="25.7487" cy="43.1391" r="3.18718" fill="#3076ED" />
          <circle cx="36.903" cy="43.1391" r="3.18718" fill="#3076ED" />
        </g>
      </g>

      <g ref={ballBRef} className="ball">
        <rect
          x="67.1816"
          y="57.3617"
          width="4.75323"
          height="9.50646"
          transform="rotate(-44.2143 67.1816 57.3617)"
          fill="#256BEA"
        />
        <path
          d="M72.8898 66.6361C72.1195 65.8444 72.1369 64.5782 72.9286 63.8079L76.8753 59.968C77.667 59.1978 78.9332 59.2151 79.7034 60.0068L90.5235 71.1277C92.3541 73.0093 92.3128 76.0186 90.4313 77.8492V77.8492C88.5498 79.6798 85.5405 79.6386 83.7098 77.757L72.8898 66.6361Z"
          fill="#256BEA"
        />
        <circle cx="61.6036" cy="46.3263" r="18.3263" fill="#256BEA" />
        <g ref={eyeBRef}>
          <circle cx="56.026" cy="43.936" r="3.18718" fill="white" />
          <circle cx="67.1813" cy="43.936" r="3.18718" fill="white" />
        </g>
      </g>
    </svg>
  );
}
