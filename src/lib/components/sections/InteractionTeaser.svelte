<script lang="ts">
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import { createScrollAnimation, gsap } from '@animations/gsap';

    type Scenario = {
        id: string;
        label: string;
        description: string;
        returns: number[];
    };

    const scenarios: Scenario[] = [
        {
            id: 'templado',
            label: 'Cielo despejado',
            description:
                'Rendimientos moderados pero constantes que muestran cómo el interés compuesto crece sin sobresaltos.',
            returns: [0.08, 0.09, 0.07, 0.08, 0.09]
        },
        {
            id: 'chaparron',
            label: 'Chaparrón inesperado',
            description:
                'Un año negativo seguido de un rebote vigoroso. Los intereses acumulados amortiguan la caída y aceleran la recuperación.',
            returns: [0.08, -0.12, 0.04, 0.15, 0.09]
        },
        {
            id: 'tormenta',
            label: 'Tormenta larga',
            description:
                'Dos años complicados antes de recuperar la calma. Ideal para recordar por qué el horizonte y las aportaciones importan.',
            returns: [0.08, -0.18, -0.05, 0.12, 0.1]
        }
    ];

    let panel: HTMLElement;
    let selectedScenario = scenarios[1];
    let prefersReducedMotion = false;

    function growthPath(returns: number[]) {
        const path = [] as { year: number; value: number; change: number }[];
        let value = 100;
        path.push({ year: 0, value, change: 0 });
        returns.forEach((change, index) => {
            value *= 1 + change;
            path.push({ year: index + 1, value, change });
        });
        return path;
    }

    $: timeline = growthPath(selectedScenario.returns);

    onMount(() => {
        prefersReducedMotion = browser
            ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
            : false;

        const controls = createScrollAnimation(
            panel,
            {
                trigger: panel,
                start: 'top 85%',
                end: 'bottom 65%',
                scrub: false,
                once: true
            },
            (timelineGsap) => {
                timelineGsap
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

    function selectScenario(option: Scenario) {
        selectedScenario = option;
        if (prefersReducedMotion) return;
        const cards = panel?.querySelectorAll('.interaction__returns li');
        if (!cards) return;
        gsap.fromTo(
            cards,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out' }
        );
    }
</script>

<div class="interaction" bind:this={panel} id="interaccion">
    <p class="interaction__tagline">Clima financiero y resiliencia</p>
    <div class="interaction__list">
        <p>
            Cambia el clima y observa cómo las mismas reglas del interés compuesto responden a años buenos y
            malos. La línea base arranca con 100 huesos imaginarios.
        </p>

        <div class="interaction__scenarios">
            {#each scenarios as scenario}
                <button
                    type="button"
                    class:active={selectedScenario.id === scenario.id}
                    on:click={() => selectScenario(scenario)}
                >
                    {scenario.label}
                </button>
            {/each}
        </div>

        <p class="interaction__description">{selectedScenario.description}</p>

        <ul class="interaction__returns">
            {#each timeline.slice(1) as point}
                <li class:negative={point.change < 0}>
                    <span>Año {point.year}</span>
                    <strong>{(point.change * 100).toFixed(1)}%</strong>
                    <div class="interaction__bar" style={`--change:${point.change}; --value:${point.value};`}></div>
                    <small>Saldo: {new Intl.NumberFormat('es-MX', { maximumFractionDigits: 1 }).format(point.value)}</small>
                </li>
            {/each}
        </ul>
    </div>
</div>

<style>
    .interaction {
        background: rgba(15, 23, 42, 0.6);
        border-radius: 24px;
        padding: var(--spacing-lg);
        border: 1px solid rgba(148, 163, 184, 0.25);
        display: grid;
        gap: var(--spacing-md);
        max-width: 780px;
    }

    .interaction__tagline {
        text-transform: uppercase;
        letter-spacing: 0.28em;
        color: var(--color-accent);
        font-weight: 600;
    }

    .interaction__list {
        display: grid;
        gap: 1rem;
    }

    .interaction__scenarios {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    .interaction__scenarios button {
        padding: 0.5rem 1.2rem;
    }

    .interaction__description {
        margin: 0;
        color: var(--color-text-muted);
        line-height: 1.5;
    }

    .interaction__returns {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0.75rem;
    }

    .interaction__returns li {
        background: rgba(15, 23, 42, 0.65);
        border-radius: 18px;
        border: 1px solid rgba(59, 130, 246, 0.25);
        padding: 0.9rem 1.1rem;
        display: grid;
        gap: 0.35rem;
        position: relative;
        overflow: hidden;
    }

    .interaction__returns li span {
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.75rem;
        color: rgba(148, 163, 184, 0.9);
    }

    .interaction__returns li strong {
        font-size: 1.1rem;
    }

    .interaction__returns li small {
        color: rgba(148, 163, 184, 0.9);
    }

    .interaction__returns li.negative {
        border-color: rgba(248, 113, 113, 0.5);
    }

    .interaction__bar {
        position: relative;
        height: 4px;
        border-radius: 999px;
        background: linear-gradient(90deg, rgba(56, 189, 248, 0.35), rgba(249, 115, 22, 0.4));
        transform-origin: left;
        scale: calc(1 + clamp(-0.6, var(--change) * 4, 0.9));
    }

    .interaction__returns li.negative .interaction__bar {
        background: linear-gradient(90deg, rgba(248, 113, 113, 0.6), rgba(248, 113, 113, 0.2));
    }

    @media (max-width: 768px) {
        .interaction {
            padding: var(--spacing-md);
        }
    }
</style>
