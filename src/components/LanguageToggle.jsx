import { useLayoutEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const GREETINGS = { en: "Hello world", lv: "Sveiks!", da: "Hej verden", es: "Hola mundo" };
const TOGGLE_LABEL = { en: "Latviski", lv: "Dansk", da: "Español", es: "English" };
const LANG_ORDER = ["en", "lv", "da", "es"];
const STORAGE_KEY = "wheel.lang";

// Renders the greeting heading and the language toggle button. Cycles
// en -> lv -> da -> es and persists the choice to localStorage["wheel.lang"].
export default function LanguageToggle() {
  const [lang, setLang] = useLocalStorage(STORAGE_KEY, (stored) =>
    stored && GREETINGS[stored] ? stored : "en"
  );

  // Keep <html lang> in sync, applied before paint (no flash).
  useLayoutEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function cycle() {
    const current = LANG_ORDER.indexOf(lang);
    setLang(LANG_ORDER[(current + 1) % LANG_ORDER.length]);
  }

  return (
    <>
      <h1 id="greeting">{GREETINGS[lang]}</h1>
      <button id="lang-toggle" type="button" onClick={cycle}>
        {TOGGLE_LABEL[lang]}
      </button>
    </>
  );
}
