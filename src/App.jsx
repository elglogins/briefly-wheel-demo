import LanguageToggle from "./components/LanguageToggle.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import BackToTop from "./components/BackToTop.jsx";
import Wheel from "./components/Wheel.jsx";

// Page layout — ports the original index.html body 1:1: top nav, hero
// (greeting + language toggle + wheel), footer, and the floating back-to-top
// button.
export default function App() {
  return (
    <>
      <nav className="top-nav" aria-label="Site">
        <ThemeToggle />
      </nav>
      <main className="hero">
        <LanguageToggle />
        <Wheel />
      </main>
      <footer
        style={{
          textAlign: "center",
          fontSize: "0.85rem",
          color: "var(--muted)",
          padding: "1rem",
        }}
      >
        &copy; 2026 Elgars Logins &middot;{" "}
        <a
          href="https://github.com/elglogins/briefly-wheel-demo"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
        <br />
        Made with &#10084; in Aarhus, Denmark
      </footer>
      <BackToTop />
    </>
  );
}
