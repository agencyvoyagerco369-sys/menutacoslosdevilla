import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    server: {
        host: "::",
        port: 8080,
        hmr: {
            overlay: false,
        },
    },
    plugins: [
        react(),
        mode === "development" && componentTagger(),
        mode !== "development" && VitePWA({
            // Only register the SW in production builds — prevents caching issues in Lovable editor
            devOptions: { enabled: false },
            registerType: "autoUpdate",
            includeAssets: ["favicon.ico", "robots.txt"],
            manifest: {
                name: "Taquería Los de Villa - Carne Asada y Tripa",
                short_name: "Los de Villa",
                description: "Pide los mejores tacos de carne asada y tripa a domicilio",
                theme_color: "#8B2A1A",
                background_color: "#FAF8F5",
                display: "standalone",
                orientation: "portrait",
                scope: "/",
                start_url: "/",
                icons: [
                    {
                        src: "/icons/icon-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/icons/icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: "/icons/icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
            },
            workbox: {
                // Force the new SW to take over immediately
                skipWaiting: true,
                clientsClaim: true,
                // Use NetworkFirst for navigations so fresh HTML is always served
                navigateFallback: "index.html",
                navigateFallbackDenylist: [/^\/admin/],
                // Don't precache images (they change rarely and cause cache bloat)
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
                globPatterns: ["**/*.{js,css,html,ico,svg,woff,woff2}"],
                // Runtime caching — NetworkFirst for JS/CSS so updates appear fast
                runtimeCaching: [
                    {
                        // JS and CSS — always check network first, fall back to cache
                        urlPattern: /\.(?:js|css)$/i,
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "static-assets",
                            expiration: {
                                maxEntries: 60,
                                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                            },
                        },
                    },
                    {
                        // Images — serve cached, revalidate in background
                        urlPattern: /\.(?:png|jpg|jpeg|webp|gif|svg)$/i,
                        handler: "StaleWhileRevalidate",
                        options: {
                            cacheName: "images-cache",
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                            },
                        },
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "google-fonts-cache",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365,
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "gstatic-fonts-cache",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365,
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                ],
            },
        }),
    ].filter(Boolean),
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
}));
