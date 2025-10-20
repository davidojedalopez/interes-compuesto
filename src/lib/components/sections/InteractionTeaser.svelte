<script lang="ts">
    import { onMount } from 'svelte';
    import { createScrollAnimation } from '@animations/gsap';

    const upcoming = [
        'Simulaciones ajustables con parámetros personalizados',
        'Historias ramificadas guiadas por una Border Collie curiosa',
        'Microinteracciones que celebran cada hito alcanzado'
    ];

    let panel: HTMLElement;

    onMount(() => {
        const controls = createScrollAnimation(
            panel,
            {
                trigger: panel,
                start: 'top 85%',
                end: 'bottom 65%',
                scrub: false,
                once: true
            },
            (timeline) => {
                timeline
                    .from('.interaction__tagline', {
                        opacity: 0,
                        y: 30,
                        duration: 0.6,
                        ease: 'power2.out'
                    })
                    .from(
                        '.interaction__list li',
                        { opacity: 0, x: -40, duration: 0.55, stagger: 0.18, ease: 'power2.out' },
                        '-=0.2'
                    );
            }
        );

        return () => controls.destroy();
    });
</script>

<div class="interaction" bind:this={panel} id="interaccion">
    <p class="interaction__tagline">Lo que viene pronto</p>
    <ul class="interaction__list">
        {#each upcoming as item}
            <li>{item}</li>
        {/each}
    </ul>
</div>

<style>
    .interaction {
        background: rgba(15, 23, 42, 0.5);
        border-radius: 24px;
        padding: var(--spacing-lg);
        border: 1px solid rgba(148, 163, 184, 0.25);
        display: grid;
        gap: var(--spacing-md);
        max-width: 720px;
    }

    .interaction__tagline {
        text-transform: uppercase;
        letter-spacing: 0.28em;
        color: var(--color-accent);
        font-weight: 600;
    }

    .interaction__list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: var(--spacing-sm);
    }

    .interaction__list li {
        background: rgba(15, 23, 42, 0.8);
        border-radius: 16px;
        padding: 1rem 1.25rem;
        border: 1px solid rgba(59, 130, 246, 0.25);
        line-height: 1.5;
    }

    @media (max-width: 768px) {
        .interaction {
            padding: var(--spacing-md);
        }
    }
</style>
