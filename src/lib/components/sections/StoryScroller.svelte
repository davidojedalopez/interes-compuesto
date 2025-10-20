<script lang="ts">
    import { onMount } from 'svelte';
    import { createScrollAnimation, gsap } from '@animations/gsap';

    const storyBeats = [
        {
            icon: '🦴',
            title: 'Enterrar la primera golosina',
            description:
                'El principal es la primera golosina que decides enterrar. Cuanto antes lo hagas, más tiempo tendrá para absorber nutrientes del suelo (los intereses).'
        },
        {
            icon: '🌦️',
            title: 'Esperar a que el clima haga su magia',
            description:
                'Cada estación el banco riega tu montículo. Si retiras la golosina, el clima deja de trabajar. Esa es la esencia del interés compuesto: dejar que las gotas se acumulen sobre el botín inicial y también sobre lo que ya creció.'
        },
        {
            icon: '🐾',
            title: 'Visitas programadas',
            description:
                'Aportar con constancia —mensual, quincenal o anual— equivale a dejar nuevas huellas en la ruta. Cada visita añade croquetas frescas que también comienzan a reproducirse.'
        },
        {
            icon: '🎯',
            title: 'Plan de juego',
            description:
                'Define cuánto tiempo permanecerá enterrado el tesoro y qué meta persigues (una casa, estudios, la jubilación). Con objetivos claros, cada decisión se conecta con la fórmula del compuesto.'
        }
    ];

    let container: HTMLElement;

    onMount(() => {
        const controls = createScrollAnimation(
            container,
            {
                trigger: container,
                start: 'top 80%',
                end: 'bottom 30%',
                scrub: false,
                once: true
            },
            (timeline) => {
                timeline
                    .from('.story-grid article', {
                        opacity: 0,
                        y: 80,
                        duration: 0.7,
                        ease: 'power3.out',
                        stagger: 0.18
                    })
                    .from(
                        '.story-grid article .story__icon',
                        {
                            scale: 0.4,
                            rotate: -15,
                            duration: 0.5,
                            ease: 'back.out(2)',
                            stagger: 0.18
                        },
                        '-=0.45'
                    );
            }
        );

        return () => controls.destroy();
    });
</script>

<div class="story-grid" bind:this={container} id="historia">
    {#each storyBeats as beat, index}
        <article>
            <span class="story__step">Paso {index + 1}</span>
            <span class="story__icon" aria-hidden="true">{beat.icon}</span>
            <h3>{beat.title}</h3>
            <p>{beat.description}</p>
        </article>
    {/each}
</div>

<style>
    .story-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: clamp(1.25rem, 4vw, 2.25rem);
        margin-top: var(--spacing-lg);
    }

    article {
        background: rgba(15, 23, 42, 0.68);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 28px;
        padding: clamp(1.25rem, 4vw, 2rem);
        display: grid;
        gap: 0.75rem;
        position: relative;
        min-height: 240px;
        box-shadow: 0 30px 70px rgba(15, 23, 42, 0.25);
        transition: transform 220ms ease, border-color 220ms ease;
    }

    article:hover,
    article:focus-within {
        transform: translateY(-6px);
        border-color: rgba(249, 115, 22, 0.55);
    }

    .story__step {
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 0.75rem;
        color: rgba(148, 163, 184, 0.8);
    }

    .story__icon {
        font-size: 2rem;
    }

    article h3 {
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: 1rem;
    }

    article p {
        color: var(--color-text-muted);
        line-height: 1.6;
    }
</style>
