<script lang="ts">
    import { onMount } from 'svelte';
    import { createScrollAnimation } from '@animations/gsap';

    const storyBeats = [
        {
            title: '1. Enterramos la primera reserva',
            description:
                'Imaginamos a Niebla escondiendo su primer hueso: definimos el depósito inicial, la tasa y el tiempo. Aquí sembramos el hábito.'
        },
        {
            title: '2. El tiempo hace su trabajo',
            description:
                'Cada estación trae intereses que se suman al saldo. Explicamos visualmente cómo las capitalizaciones parciales crean una curva exponencial.'
        },
        {
            title: '3. Celebramos los hitos',
            description:
                'El doble, triple y cuádruple del ahorro aparecen con microanimaciones y copys que vinculan cada hito con decisiones concretas.'
        },
        {
            title: '4. Acción inmediata',
            description:
                'Cerramos con herramientas para automatizar aportaciones, checklist descargable y recordatorios para ajustar la estrategia cuando cambie la tasa.'
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
                    { opacity: 0, y: 50, rotateX: -15 },
                    {
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        duration: 0.85,
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
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: var(--spacing-md);
        margin-top: var(--spacing-lg);
        perspective: 1200px;
    }

    article {
        background: rgba(15, 23, 42, 0.7);
        border: 1px solid rgba(148, 163, 184, 0.25);
        border-radius: 24px;
        padding: var(--spacing-md);
        display: grid;
        gap: var(--spacing-sm);
        min-height: 220px;
        transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
        box-shadow: 0 25px 45px rgba(15, 23, 42, 0.3);
    }

    article:hover,
    article:focus-within {
        transform: translateY(-8px);
        border-color: rgba(249, 115, 22, 0.5);
        box-shadow: 0 30px 55px rgba(249, 115, 22, 0.15);
    }

    article h3 {
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.85rem;
        color: rgba(148, 163, 184, 0.9);
    }

    article p {
        font-size: 0.95rem;
        line-height: 1.5;
        color: rgba(226, 232, 240, 0.92);
    }
</style>
