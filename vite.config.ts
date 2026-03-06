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
        VitePWA({
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
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
                globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp}"],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "google-fonts-cache",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
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
                                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
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
