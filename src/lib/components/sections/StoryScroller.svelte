<script lang="ts">
    import { onMount } from 'svelte';
    import { createScrollAnimation, gsap } from '@animations/gsap';

    const storyBeats = [
        {
            title: 'Concepto',
            description:
                'Introduciremos los fundamentos del interés compuesto con metáforas amigables y visuales.'
        },
        {
            title: 'Estrategia',
            description:
                'Mostraremos cómo los pequeños hábitos crecen en el tiempo a través de animaciones sincronizadas.'
        },
        {
            title: 'Aplicación',
            description:
                'Cerraremos con ejemplos interactivos y sorpresas protagonizadas por nuestra Border Collie guía.'
        }
    ];

    let container: HTMLElement;

    onMount(() => {
        const controls = createScrollAnimation(
            container,
            {
                trigger: container,
                start: 'top 80%',
                end: 'bottom 60%',
                scrub: false,
                once: true
            },
            (timeline) => {
                timeline.fromTo(
                    '.story-grid article',
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                        stagger: 0.2
                    }
                );
            }
        );

        return () => controls.destroy();
    });
</script>

<div class="story-grid" bind:this={container} id="historia">
    {#each storyBeats as beat}
        <article>
            <h3>{beat.title}</h3>
            <p>{beat.description}</p>
        </article>
    {/each}
</div>

<style>
    .story-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: var(--spacing-md);
        margin-top: var(--spacing-lg);
    }

    article {
        background: rgba(15, 23, 42, 0.65);
        border: 1px solid rgba(148, 163, 184, 0.25);
        border-radius: 24px;
        padding: var(--spacing-md);
        display: grid;
        gap: var(--spacing-sm);
        min-height: 200px;
        transition: transform 200ms ease, border-color 200ms ease;
    }

    article:hover,
    article:focus-within {
        transform: translateY(-6px);
        border-color: rgba(249, 115, 22, 0.5);
    }

    article h3 {
        text-transform: uppercase;
        letter-spacing: 0.18em;
    }
</style>
