<header class="site-header">
    <div class="shell">
        <div class="brand">
            <span aria-hidden="true" class="brand__glyph">∞</span>
            <div class="brand__copy">
                <p class="brand__title">interés compuesto</p>
                <p class="brand__subtitle">Historias que crecen contigo</p>
            </div>
        </div>
    </div>
</header>

<style>
    .site-header {
        position: sticky;
        top: 0;
        z-index: 20;
        backdrop-filter: blur(16px);
        background: linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0));
        border-bottom: 1px solid rgba(148, 163, 184, 0.2);
    }

    .shell {
        margin: 0 auto;
        max-width: calc(var(--content-max-width) + 4rem);
        padding: 1.25rem 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1.5rem;
    }

    .brand {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.18em;
    }

    .brand__glyph {
        font-size: 1.75rem;
        color: var(--color-accent);
        filter: drop-shadow(0 0 12px rgba(249, 115, 22, 0.65));
    }

    .brand__copy {
        display: grid;
        gap: 0.2rem;
    }

    .brand__title {
        font-weight: 700;
        margin: 0;
    }

    .brand__subtitle {
        margin: 0;
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.24em;
        color: var(--color-text-muted);
    }

    @media (max-width: 900px) {
        .shell {
            padding-inline: 1.25rem;
        }
    }
</style>
