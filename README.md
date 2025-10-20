# interes-compuesto

Sitio narrativo en construcción para interescompuesto.com.mx. El objetivo es crear una experiencia de
_scrollytelling_ sobre el interés compuesto usando Svelte, GSAP (ScrollTrigger), D3/Chart.js y animaciones
vectoriales con SVG/Lottie.

## Stack base

- [SvelteKit](https://kit.svelte.dev/) con adapter estático listo para desplegar como sitio estático.
- [GSAP](https://greensock.com/gsap/) + ScrollTrigger ya inicializado en `src/lib/animations/gsap.ts`.
- [Chart.js](https://www.chartjs.org/) y [D3](https://d3js.org/) con componentes de ejemplo listos para iterar.
- [lottie-web](https://airbnb.io/lottie/#/) para reproducir animaciones exportadas desde After Effects u otras
  herramientas.

## Estructura relevante

```
src/
├── app.html                 → Plantilla base con idioma español y tema oscuro.
├── lib/
│   ├── animations/          → Utilidades para GSAP + ScrollTrigger.
│   ├── components/
│   │   ├── charts/          → Integraciones iniciales con Chart.js y D3.
│   │   ├── common/          → Componentes utilitarios (por ejemplo, ScrollSection).
│   │   ├── graphics/        → Recursos gráficos y envoltorios de Lottie.
│   │   ├── layout/          → Shell, encabezado y pie de página.
│   │   └── sections/        → Secciones placeholder del recorrido narrativo.
│   └── styles/              → Estilos globales y variables de diseño.
└── routes/
    ├── +layout.svelte       → Carga estilos globales y estructura la página.
    └── +page.svelte         → Secciones principales con contenido provisional.
```

## Scripts disponibles

```bash
npm run dev      # servidor de desarrollo
npm run build    # compila la versión lista para producción (estática)
npm run preview  # previsualiza la compilación de producción
npm run check    # revisa tipos y convenciones de Svelte
```

## Desarrollo

1. Instala las dependencias del proyecto con `npm install`.
2. Ejecuta `npm run dev` para arrancar el servidor de desarrollo de Vite/SvelteKit.
3. Mantén `npm run check` o `npm run check:watch` en ejecución si quieres recibir retroalimentación
   continua del chequeo de tipos mientras iteras sobre los componentes en `src/`.
4. Puedes usar `npm run preview` para revisar localmente cómo se comporta el build de producción
   mientras desarrollas.

Los directorios bajo `src/lib` reúnen utilidades de animación, componentes de gráficas, layout y
secciones ya preparadas para iterar mientras el servidor de desarrollo está activo.

## Despliegue

La aplicación está configurada con el adapter estático de SvelteKit, por lo que `npm run build`
pre-renderiza todos los assets necesarios para servir el sitio como archivos estáticos. Los
archivos generados se pueden publicar en cualquier servicio de hosting estático (por ejemplo,
Vercel, Netlify o GitHub Pages). Para validar el resultado localmente utiliza `npm run preview`,
que levanta un servidor Vite sirviendo el build de producción.

## Próximos pasos

- Sustituir los textos y datos de ejemplo por la narrativa definitiva en español.
- Integrar ilustraciones SVG/Lottie definitivas del Border Collie y demás recursos visuales.
- Afinar las animaciones de ScrollTrigger en conjunto con el contenido final.
