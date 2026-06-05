import { useEffect, useRef, useState } from "react";

const SEGMENTS = [1, 2, 3, 4, 5, 6];
const COLORS = ["#e6194b", "#3cb44b", "#4363d8", "#f58231", "#911eb4", "#46c2cb"];
const EXTRA_SPINS = 5;
const DURATION = 4000;
const TWO_PI = Math.PI * 2;
const POINTER_ANGLE = TWO_PI * 0.75; // top of the wheel (12 o'clock)
const SPINNING_TOOLTIP = "Spinning… Reset is available when the wheel stops";

function easeOut(p) {
  return 1 - Math.pow(1 - p, 3);
}

// Canvas prize wheel. Spins with an ease-out over ~4s, lands on a segment,
// and shows "Winner: N". Reset clears the result. The rotation and any
// in-flight animation frame live in refs so the render-driven state (spinning,
// result) stays minimal; the frame is cancelled on unmount.
export default function Wheel() {
  const canvasRef = useRef(null);
  const rotationRef = useRef(0);
  const rafRef = useRef(null);
  const spinningRef = useRef(false);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("");

  function draw(angle) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const radius = cx - 4;
    const seg = TWO_PI / SEGMENTS.length;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    for (let i = 0; i < SEGMENTS.length; i++) {
      const start = i * seg;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, start + seg);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.save();
      ctx.rotate(start + seg / 2);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(String(SEGMENTS[i]), radius - 14, 0);
      ctx.restore();
    }
    ctx.restore();
    // fixed pointer at the top, pointing down into the wheel
    ctx.beginPath();
    ctx.moveTo(cx - 10, 2);
    ctx.lineTo(cx + 10, 2);
    ctx.lineTo(cx, 22);
    ctx.closePath();
    ctx.fillStyle = "#222";
    ctx.fill();
  }

  // Draw the wheel at rest on mount; cancel any in-flight frame on unmount.
  useEffect(() => {
    draw(rotationRef.current);
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function spin() {
    if (spinningRef.current) return;
    spinningRef.current = true;
    setSpinning(true);
    setResult("");

    const seg = TWO_PI / SEGMENTS.length;
    const target = Math.floor(Math.random() * SEGMENTS.length);
    // angle that puts the centre of the target segment under the pointer
    const desired = (((POINTER_ANGLE - (target + 0.5) * seg) % TWO_PI) + TWO_PI) % TWO_PI;
    const currentMod = ((rotationRef.current % TWO_PI) + TWO_PI) % TWO_PI;
    const delta = (((desired - currentMod) % TWO_PI) + TWO_PI) % TWO_PI;
    const from = rotationRef.current;
    const to = rotationRef.current + EXTRA_SPINS * TWO_PI + delta;
    let startTime = null;

    function step(now) {
      if (startTime === null) startTime = now;
      const p = Math.min((now - startTime) / DURATION, 1);
      rotationRef.current = from + (to - from) * easeOut(p);
      draw(rotationRef.current);
      if (p < 1) {
        rafRef.current = window.requestAnimationFrame(step);
      } else {
        rotationRef.current = to;
        rafRef.current = null;
        spinningRef.current = false;
        setSpinning(false);
        setResult("Winner: " + SEGMENTS[target]);
      }
    }

    rafRef.current = window.requestAnimationFrame(step);
  }

  function reset() {
    // Reset is only clickable when idle, so no in-flight animation to cancel.
    setResult("");
  }

  return (
    <section className="wheel" aria-label="Spin the wheel">
      <canvas
        id="wheel-canvas"
        ref={canvasRef}
        width="300"
        height="300"
        role="img"
        aria-label="Prize wheel"
      ></canvas>
      <button id="spin-button" type="button" onClick={spin} disabled={spinning}>
        Spin
      </button>
      <span id="reset-wrapper" title={spinning ? SPINNING_TOOLTIP : undefined}>
        <button id="reset-button" type="button" onClick={reset} disabled={spinning}>
          Reset
        </button>
      </span>
      <p id="wheel-result" role="status" aria-live="polite">
        {result}
      </p>
    </section>
  );
}
