<script lang="ts">
    import { onMount } from 'svelte';
    import { createScrollAnimation } from '@animations/gsap';

    type Achievement = {
        title: string;
        description: string;
    };

    const achievements: Achievement[] = [
        {
            title: 'Comprendí la fórmula',
            description: 'Ya identificas cada letra y sabes cómo se traduce en la vida diaria.'
        },
        {
            title: 'Ajusté mis aportaciones',
            description: 'Probaste diferentes montos y descubriste la combinación que se ajusta a tu meta.'
        },
        {
            title: 'Definí mi primera meta',
            description: 'Elegiste un objetivo concreto y lo guardaste en tus notas para darle seguimiento.'
        }
    ];

    let panel: HTMLElement;
    let completed = achievements.map(() => false);

    function toggleAchievement(index: number) {
        completed = completed.map((value, idx) => (idx === index ? !value : value));
    }

    $: totalCompleted = completed.reduce((count, value) => count + (value ? 1 : 0), 0);
    $: completionPercentage = (totalCompleted / achievements.length) * 100;

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
                        '.interaction__item',
                        { opacity: 0, x: -40, duration: 0.55, stagger: 0.18, ease: 'power2.out' },
                        '-=0.2'
                    )
                    .from('.interaction__cta', { opacity: 0, y: 24, duration: 0.5, ease: 'power2.out' }, '-=0.1');
            }
        );

        return () => controls.destroy();
    });
</script>

<div class="interaction" bind:this={panel} id="interaccion">
    <p class="interaction__tagline">Panel de celebración</p>
    <p class="interaction__lead">
        Marca los hitos que ya dominaste. Cada selección suma al progreso y activa microcelebraciones
        accesibles.
    </p>
    <ul class="interaction__list">
        {#each achievements as achievement, index}
            <li class="interaction__item">
                <button
                    type="button"
                    class:completed={completed[index]}
                    on:click={() => toggleAchievement(index)}
                    aria-pressed={completed[index]}
                >
                    <span class="interaction__icon" aria-hidden="true">{completed[index] ? '🐾' : '⬜️'}</span>
                    <span>
                        <strong>{achievement.title}</strong>
                        <small>{achievement.description}</small>
                    </span>
                </button>
            </li>
        {/each}
    </ul>
    <div class="interaction__progress" role="status" aria-live="polite">
        <p>
            Progreso celebrado: {totalCompleted} de {achievements.length}. ¡{Math.round(completionPercentage)}%
            completado!
        </p>
        <meter
            min="0"
            max="100"
            value={completionPercentage}
            aria-valuetext={`${Math.round(completionPercentage)}% completado`}
        ></meter>
    </div>
    <a class="interaction__cta" href="mailto:hola@interescompuesto.com.mx">
        Compartir tus avances y recibir la guía imprimible
    </a>
    <p class="interaction__note">
        Próximamente: sonidos opcionales y confeti ligero se habilitarán para quienes quieran festejar con más
        brillo. Siempre respetaremos la preferencia de movimiento reducido.
    </p>
</div>

<style>
    .interaction {
        background: rgba(15, 23, 42, 0.55);
        border-radius: 24px;
        padding: clamp(1.75rem, 4vw, 2.75rem);
        border: 1px solid rgba(148, 163, 184, 0.25);
        display: grid;
        gap: var(--spacing-md);
        max-width: 760px;
    }

    .interaction__tagline {
        text-transform: uppercase;
        letter-spacing: 0.28em;
        color: var(--color-accent);
        font-weight: 600;
    }

    .interaction__lead {
        color: rgba(226, 232, 240, 0.85);
        line-height: 1.7;
    }

    .interaction__list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: var(--spacing-sm);
    }

    .interaction__item button {
        width: 100%;
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.75rem;
        align-items: start;
        background: rgba(15, 23, 42, 0.8);
        border-radius: 18px;
        padding: 1rem 1.25rem;
        border: 1px solid rgba(59, 130, 246, 0.25);
        color: inherit;
        text-align: left;
        cursor: pointer;
        transition: transform 180ms ease, border-color 180ms ease;
    }

    .interaction__item button:hover,
    .interaction__item button:focus-visible {
        transform: translateY(-3px);
        border-color: rgba(249, 115, 22, 0.55);
    }

    .interaction__item button.completed {
        border-color: rgba(34, 197, 94, 0.6);
        background: rgba(34, 197, 94, 0.15);
    }

    .interaction__icon {
        font-size: 1.5rem;
        line-height: 1;
    }

    .interaction__item strong {
        display: block;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: 0.95rem;
        margin-bottom: 0.25rem;
    }

    .interaction__item small {
        display: block;
        color: rgba(148, 163, 184, 0.9);
        line-height: 1.6;
    }

    .interaction__progress {
        display: grid;
        gap: 0.35rem;
        font-size: 0.95rem;
    }

    meter {
        width: 100%;
        height: 12px;
        border-radius: 999px;
        background: rgba(30, 41, 59, 0.6);
    }

    meter::-webkit-meter-bar {
        background: rgba(30, 41, 59, 0.6);
        border: none;
        border-radius: 999px;
    }

    meter::-webkit-meter-optimum-value {
        background: linear-gradient(90deg, rgba(56, 189, 248, 0.9), rgba(249, 115, 22, 0.9));
        border-radius: 999px;
    }

    meter::-moz-meter-bar {
        background: linear-gradient(90deg, rgba(56, 189, 248, 0.9), rgba(249, 115, 22, 0.9));
        border-radius: 999px;
    }

    .interaction__cta {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 0.85rem 1.5rem;
        border-radius: 999px;
        background: var(--color-accent);
        color: #0f172a;
        font-weight: 600;
        text-decoration: none;
        transition: transform 180ms ease, box-shadow 180ms ease;
    }

    .interaction__cta:hover,
    .interaction__cta:focus-visible {
        transform: translateY(-2px);
        box-shadow: 0 18px 36px rgba(249, 115, 22, 0.35);
    }

    .interaction__note {
        font-size: 0.85rem;
        color: rgba(148, 163, 184, 0.85);
    }

    @media (max-width: 768px) {
        .interaction {
            padding: var(--spacing-md);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .interaction__item button,
        .interaction__cta {
            transition: none;
        }
    }
</style>
