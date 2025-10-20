<script lang="ts">
    import SiteFooter from './SiteFooter.svelte';
    import SiteHeader from './SiteHeader.svelte';

    export let enableProgress = true;
</script>

<div class="app-shell">
    <SiteHeader />

    {#if enableProgress}
        <div class="progress" aria-hidden="true">
            <span class="progress__bar"></span>
        </div>
    {/if}

    <main>
        <slot />
    </main>

    <SiteFooter />
</div>

<style>
    .app-shell {
        position: relative;
        min-height: 100vh;
    }

    .progress {
        position: fixed;
        top: 50%;
        right: clamp(0.75rem, 4vw, 3rem);
        transform: translateY(-50%);
        width: 2px;
        height: 45vh;
        background: rgba(148, 163, 184, 0.2);
        border-radius: 999px;
        overflow: hidden;
        z-index: 15;
    }

    .progress__bar {
        position: absolute;
        inset: auto 0 0 0;
        height: 30%;
        background: linear-gradient(180deg, rgba(249, 115, 22, 0.15), var(--color-accent));
        animation: pulse 6s ease-in-out infinite alternate;
    }

    @media (max-width: 1024px) {
        .progress {
            display: none;
        }
    }

    @keyframes pulse {
        from {
            opacity: 0.45;
        }
        to {
            opacity: 1;
        }
    }
</style>
