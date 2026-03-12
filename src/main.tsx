import { createRoot } from "react-dom/client";
import { App } from "./app/providers";
import "./app/i18n";
import "./app/index.css";

createRoot(document.getElementById("root")!).render(<App />);
