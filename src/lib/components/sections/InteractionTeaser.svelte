<script lang="ts">
    import { onMount } from 'svelte';
    import { createScrollAnimation } from '@animations/gsap';

    const upcoming = [
        {
            title: 'Clima financiero interactivo',
            copy: 'Simularemos años buenos y malos para mostrar cómo un colchón de intereses amortigua las tormentas.'
        },
        {
            title: 'Guías ramificadas',
            copy: 'Dependiendo de tus metas, la Border Collie recomendará atajos o descansos estratégicos.'
        },
        {
            title: 'Celebraciones sincronizadas',
            copy: 'Cuando alcances un hito, microinteracciones y sonidos suaves acompañarán el logro.'
        }
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
                    .from('.interaction__list li', {
                        opacity: 0,
                        x: -40,
                        duration: 0.55,
                        stagger: 0.18,
                        ease: 'power2.out'
                    });
            }
        );

        return () => controls.destroy();
    });
</script>

<div class="interaction" bind:this={panel} id="interaccion">
    <p class="interaction__tagline">Lo que estamos cocinando</p>
    <ul class="interaction__list">
        {#each upcoming as item}
            <li>
                <h4>{item.title}</h4>
                <p>{item.copy}</p>
            </li>
        {/each}
    </ul>
</div>

<style>
    .interaction {
        background: rgba(15, 23, 42, 0.65);
        border-radius: 24px;
        padding: var(--spacing-lg);
        border: 1px solid rgba(249, 115, 22, 0.25);
        display: grid;
        gap: var(--spacing-md);
        max-width: 760px;
    }

    .interaction__tagline {
        text-transform: uppercase;
        letter-spacing: 0.28em;
        color: var(--color-accent);
        font-weight: 600;
        font-size: 0.75rem;
    }

    .interaction__list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: var(--spacing-sm);
    }

    .interaction__list li {
        background: rgba(15, 23, 42, 0.85);
        border-radius: 16px;
        padding: 1.25rem 1.5rem;
        border: 1px solid rgba(59, 130, 246, 0.25);
        line-height: 1.5;
        display: grid;
        gap: 0.35rem;
    }

    .interaction__list h4 {
        margin: 0;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        color: rgba(226, 232, 240, 0.9);
    }

    .interaction__list p {
        margin: 0;
        font-size: 0.95rem;
        color: rgba(226, 232, 240, 0.8);
    }

    @media (max-width: 768px) {
        .interaction {
            padding: var(--spacing-md);
        }
    }
</style>
