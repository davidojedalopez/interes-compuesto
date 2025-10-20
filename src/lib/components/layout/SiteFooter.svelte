<footer class="site-footer">
    <div class="shell">
        <p>© {new Date().getFullYear()} interescompuesto.com.mx — Proyecto educativo en construcción.</p>
        <small>Hecho con Svelte, GSAP, D3, Chart.js y Lottie.</small>
    </div>
</footer>

<style>
    .site-footer {
        padding: var(--spacing-lg) 1.5rem var(--spacing-xl);
        border-top: 1px solid rgba(148, 163, 184, 0.2);
        background: linear-gradient(180deg, rgba(15, 23, 42, 0), rgba(15, 23, 42, 0.9));
        margin-top: var(--spacing-xxl);
    }

    .shell {
        margin: 0 auto;
        max-width: calc(var(--content-max-width) + 2rem);
        display: grid;
        gap: 0.5rem;
        color: var(--color-text-muted);
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.2em;
    }
</style>
