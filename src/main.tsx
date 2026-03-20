import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import "./index.css";

// ─── SW Update Listener ───
// When a new Service Worker is detected, it will automatically activate
// and we reload the page once so the user always sees the latest version.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    // Only reload if the page is already fully loaded (prevents loops)
    if (document.readyState === "complete") {
      window.location.reload();
    }
  });
}

// ─── Always render immediately ───
createRoot(document.getElementById("root")!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);
