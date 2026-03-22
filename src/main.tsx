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

  // Force unregister in development/preview to prevent caching issues in Lovable
  if (import.meta.env.MODE === 'development') {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }
}

// ─── Global Error Handler for Debugging Blank Screens ───
window.addEventListener('error', (event) => {
  console.error("Global error caught:", event.error);
  const root = document.getElementById("root");
  if (root && root.innerHTML === '') {
    root.innerHTML = `<div style="padding: 20px; color: red; font-family: monospace;"><h3>App crashed on load:</h3><pre>${event.error?.stack || event.error || event.message}</pre></div>`;
  }
});

// ─── Always render immediately ───
try {
  createRoot(document.getElementById("root")!).render(
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  );
} catch (error: any) {
  console.error("Failed to mount app:", error);
  document.body.innerHTML = `<div style="padding: 20px; color: red;"><h3>Mount Error:</h3><pre>${error.stack || error}</pre></div>`;
}
