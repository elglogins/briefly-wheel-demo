import { useEffect, useState } from "react";

// Floating back-to-top button: hidden until the page is scrolled past 200px,
// then smooth-scrolls to the top. Scroll handling is throttled with
// requestAnimationFrame, matching the original implementation.
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    function update() {
      setVisible(window.scrollY > 200);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      id="back-to-top"
      type="button"
      aria-label="Back to top"
      className={visible ? "is-visible" : undefined}
      aria-hidden={visible ? undefined : "true"}
      tabIndex={visible ? undefined : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      &uarr;
    </button>
  );
}
