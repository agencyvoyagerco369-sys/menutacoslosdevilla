/* v6 - force SW unregister + cache clear for mobile */
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import "./index.css";

// Force unregister old Service Workers and clear caches on first load
const APP_VERSION = "v6";
const STORED_VERSION = localStorage.getItem("app-version");

if (STORED_VERSION !== APP_VERSION) {
  // Clear all caches
  if ("caches" in window) {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }

  // Unregister all service workers
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((reg) => reg.unregister());
    });
  }

  localStorage.setItem("app-version", APP_VERSION);

  // Reload to get fresh content
  setTimeout(() => {
    window.location.reload();
  }, 500);
} else {
  // Normal boot — only runs after cache is clean
  createRoot(document.getElementById("root")!).render(
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  );
}
