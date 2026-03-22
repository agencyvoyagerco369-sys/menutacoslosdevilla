# Documentación Técnica y Comercial: WebApp "Taquería Los de Villa"

## 1. Información General del Proyecto
**Nombre de la Aplicación:** Menú Interactivo de Taquería Los de Villa
**Dominio Oficial:** https://www.taquerialosdevillamenu.shop/
**Plataforma de Hosting:** Lovable (Frontend gestionado)
**Naturaleza del Proyecto:** Single Page Application (SPA) optimizada para dispositivos móviles (Mobile-first design)
**Tecnologías Principales:** React 18, TypeScript, Vite, Tailwind CSS y componentes de UI (shadcn).

## 2. Arquitectura de Diseño y Experiencia de Usuario (UI/UX)
La aplicación fue diseñada siguiendo las mejores prácticas de las plataformas de food delivery modernas (como Uber Eats o Rappi).
*   **Tema Moderno:** Interfaces limpias, modo claro/oscuro compatible, esquemas de colores responsivos y componentes redondeados.
*   **Velocidad de Carga (Anti-Caché):** Se implementaron encabezados (HTTP Headers y meta tags en `index.html`) para evitar retenciones de caché agresivas. Así, cualquier nuevo platillo desplegado está disponible instantáneamente para los comensales.

## 3. Funciones Principales y Módulos

### A. Sección Héroe (Hero Section)
Una cabecera sumamente visual y contundente para captar rápidamente la atención:
*   **Gestor Automático de Estatus en Tiempo Real:** 
    *   Si el horario de operación está activo, la barra superior cambiará a verde con el mensaje contundente: *"Abierto • Recibiendo pedidos"*.
    *   Fuera del horario de operación, la barra pasará a rojo indicando: *"Cerrado • Abrimos a las 6:00 PM"*.
*   **Insignias de Propuesta de Valor:** Integración de "Delivery Dispatch" (`Envío disponible` flotante) y badge de rating estelar con la localización en Cd. Obregón.
*   **Acciones de Contacto Rápido:** Chips minimalistas de llamar al negocio, checar horario o ver perfil de mapas.
*   **Portada Full-Frame:** Ajuste dinámico de aspecto matemático (16:9 con altura máxima controlada) para garantizar que la fotografía estelar posicione el foco correcto (por ejemplo, el encuadre de la foto de Pancho Villa).

### B. Carrusel de Promociones y Productos (Carousel)
*   Integración de banners visuales tipo "Porn Food" para incrementar las compras por impulso (Gringas, Combinados, Chorreadas, etc.).
*   Autoplay y navegación fluida orientada a uso táctil (Swipeable).

### C. Menú Interactivo Clasificado (Category/Product List)
*   **Navegación por Pestañas:** Segmentación entre Tacos, Bebidas y Especialidades, manteniéndolo siempre a 1 clic de distancia.
*   **Tarjetas de Producto (Cards):** Fotografías reales en alta calidad, descripciones breves (copywriting gastronómico) y precios unificados.
*   **Personalización In-App (Customization Sheet):** Posibilidad de añadir variables (salsa roja, tipo de carne seleccionada, sin cebolla, etc.) mediante un modal que imita comportamientos de apps nativas de comida.

### D. Carrito de Compras Local (Cart Drawer)
*   **Estado Guardado en Memoria:** Usa `zustand` para almacenar los platillos seleccionados globalmente sin requerir registro.
*   **Cálculo Automatizado:** Sumatoria total de precios y cantidades en micro-tiempo real.
*   **Experiencia Emocional:** Uso de lenguaje amigable (e.g. *¡Agrega algo delicioso! 🌮*).

### E. Integración de Pedidos por WhatsApp (Check-Out)
*   Al concretar el carrito, la aplicación compila sistemáticamente todos los tacos, bebidas e instrucciones personalizadas en una matriz de texto (Plantilla de Mensaje).
*   Se lanza un `deep-link` hacia la API de WhatsApp para que el negocio reciba el pedido completamente redactado y organizado y no exista rotación de fallos humanos.
*(Nota: El botón se encuentra pre-desactivado a nivel de variables si el comercio no está operacional en el momento de la programación o si requiere control de flujo).*

## 4. Estructura de Operaciones y SEO Avanzado

### SEO (Optimización de Motores de Búsqueda)
Esta webapp no es sólo un menú interno, sino que está cableada para rankear activamente en Google:
*   **Indexación Google Search Console:** Validado permanentemente sobre el dominio DNS de Hostinger.
*   **Archivística Web (Crawler bots):**
    *   `robots.txt`: Archivo que dirige y autoriza el acceso a motores como GoogleBot.
    *   `sitemap.xml`: Mapa del sitio inyectado para facilitar la inclusión inmediata en las hojas locales de resultados de búsqueda (SERP).
*   **Open Graph / Meta Tags Facebook & Twitter:** Configurado para desplegar tarjetas estéticas con título y descripción (ej. "Tacos de Carne Asada y Tripa") cuando clientes se pasen el link por redes sociales.

## 5. Próximos Pasos Proyectados (Roadmap Opcional)
*   Activación del Botón Principal de WhatsApp para la canalización final.
*   Conexión de Automatics n8n (o Lovable Backend Supabase) para guardar recibos o historial de clientes en un CRM a largo plazo.
*   Efectos y decoraciones visuales premium (Modo Noche, transiciones adicionales estilo parallax).
