<script lang="ts">
    import { onMount } from 'svelte';
    import { createScrollAnimation } from '@animations/gsap';

    const ageOptions = [
        {
            label: 'Infancia',
            shortLabel: 'Niñez',
            copy:
                'Imagina una maceta donde cada moneda es una semilla que despierta y llama a más monedas amigas.'
        },
        {
            label: 'Juventud',
            shortLabel: 'Juventud',
            copy:
                'Los ahorros son como playlists que se hacen virales: cada reproducción (periodo) suma y comparte su energía.'
        },
        {
            label: 'Adultos mayores',
            shortLabel: 'Personas mayores',
            copy:
                'El interés compuesto es un invernadero paciente: cuida tus plantas financieras y te regalarán sombra y frutos estables.'
        }
    ];

    const comparisons = {
        simple: [
            'La semilla da el mismo fruto cada cosecha, sin importar cuánto tiempo pases cuidándola.',
            'Solo se multiplica el capital inicial; los intereses no vuelven a trabajar.'
        ],
        compound: [
            'Cada fruto reinvertido se convierte en una nueva semilla que también da frutos.',
            'Mientras más tiempo dejes la inversión, más capas de crecimiento aparecen.'
        ]
    };

    const formulaSegments = [
        {
            symbol: 'A',
            title: 'Monto acumulado',
            description: 'Es el jardín completo después de un periodo: capital, intereses y aportaciones.',
            example: 'Si empiezas con $5,000 y aportas cada mes, A muestra cuánto tendrás al final.'
        },
        {
            symbol: 'P',
            title: 'Capital inicial',
            description: 'Tu semilla original, el dinero que ya tienes ahorrado hoy.',
            example: 'Puede ser la beca, el aguinaldo o el capital de arranque de tu negocio.'
        },
        {
            symbol: 'r',
            title: 'Tasa anual',
            description: 'La vitamina que alimenta el crecimiento. Se expresa como porcentaje.',
            example: 'Una tasa del 8% significa que cada año se agrega 0.08 veces lo que tengas en ese momento.'
        },
        {
            symbol: 'n',
            title: 'Frecuencia',
            description: 'Las veces que se aplica la tasa al año: mensual, trimestral, anual…',
            example: 'Si tu cuenta capitaliza cada mes, n = 12.'
        },
        {
            symbol: 't',
            title: 'Tiempo',
            description: 'Los años que dejas correr la historia. Mientras más amplio, más capas de interés.',
            example: 'Para un plan universitario de 10 años, t = 10.'
        }
    ];

    const scenarioCards = [
        {
            icon: 'calendar',
            title: 'Empezar tarde',
            description:
                'Si dejas pasar 10 años antes de invertir, el dinero crece, pero pierde el tramo más jugoso del interés compuesto.',
            takeaway: 'Empieza con lo que tengas hoy: el tiempo es el ingrediente más difícil de recuperar.'
        },
        {
            icon: 'habit',
            title: 'Aporte constante',
            description:
                'Aportar la misma cantidad cada mes crea una escalera firme. Incluso con tasas moderadas, la curva despega.',
            takeaway:
                'Automatiza un cargo mensual para no depender de tu memoria ni de tu estado de ánimo.'
        },
        {
            icon: 'boost',
            title: 'Aumentos estratégicos',
            description:
                'Sumar un 10% extra cada año acelera la curva. Cada refuerzo envía más semillitas a trabajar.',
            takeaway:
                'Destina parte de tus ingresos extraordinarios (bonos, ventas, aguinaldos) a este refuerzo.'
        }
    ];

    let container: HTMLElement;
    let ageIndex = 1;
    let visited = scenarioCards.map(() => false);

    const scenarioIcons: Record<string, string> = {
        calendar:
            'M4 6h16M4 12h16M7 4v4m10-4v4M6 20h12a2 2 0 0 0 2-2v-8H4v8a2 2 0 0 0 2 2z',
        habit: 'M5 11c0-3.866 3.134-7 7-7s7 3.134 7 7-3.134 7-7 7H7l-3 3 1.5-4.5A6.97 6.97 0 0 1 5 11z',
        boost: 'M4 13l8-8 8 8h-6v7h-4v-7H4z'
    };

    function markScenario(index: number) {
        if (!visited[index]) {
            visited = visited.map((value, idx) => (idx === index ? true : value));
        }
    }

    function handleScenarioFocus(index: number) {
        markScenario(index);
    }

    function handleScenarioClick(index: number) {
        markScenario(index);
    }

    $: completed = visited.reduce((total, value) => total + (value ? 1 : 0), 0);
    $: progress = (completed / scenarioCards.length) * 100;

    onMount(() => {
        const controls = createScrollAnimation(
            container,
            {
                trigger: container,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: false,
                once: true
            },
            (timeline) => {
                timeline.from('.story__panel', {
                    opacity: 0,
                    y: 42,
                    duration: 0.75,
                    ease: 'power3.out',
                    stagger: 0.22
                });
            }
        );

        return () => controls.destroy();
    });
</script>

<div class="story" bind:this={container} id="historia">
    <section class="story__panel" id="acto-1">
        <header>
            <p class="story__overtitle">Acto 1</p>
            <h2>Semillas que se multiplican</h2>
        </header>
        <p class="story__intro">
            Para explicar el interés compuesto a todas las edades, usamos el huerto como metáfora. Cada moneda
            sembrada se replica en nuevas semillas si la dejas descansar el tiempo suficiente.
        </p>
        <div class="story__age">
            <label class="story__age-label" for="story-age">Adapta el relato a tu etapa de vida</label>
            <input
                id="story-age"
                type="range"
                min="0"
                max={ageOptions.length - 1}
                step="1"
                bind:value={ageIndex}
                aria-valuemin={0}
                aria-valuemax={ageOptions.length - 1}
                aria-valuenow={ageIndex}
                aria-valuetext={ageOptions[ageIndex].label}
            />
            <div class="story__age-marks" aria-hidden="true">
                {#each ageOptions as option, index}
                    <span class:active={index === ageIndex}>{option.shortLabel}</span>
                {/each}
            </div>
            <p class="story__age-copy">{ageOptions[ageIndex].copy}</p>
        </div>
        <div class="story__comparison">
            <article>
                <h3>Interés simple</h3>
                <ul>
                    {#each comparisons.simple as item}
                        <li>{item}</li>
                    {/each}
                </ul>
            </article>
            <article>
                <h3>Interés compuesto</h3>
                <ul>
                    {#each comparisons.compound as item}
                        <li>{item}</li>
                    {/each}
                </ul>
            </article>
        </div>
    </section>

    <section class="story__panel story__panel--highlight" id="acto-2">
        <header>
            <p class="story__overtitle">Acto 2</p>
            <h2>La fórmula se vuelve cuento</h2>
        </header>
        <p class="story__intro">
            La expresión A = P · (1 + r/n)^(n · t) suena intimidante hasta que la escuchas paso a paso. Aquí la
            desmenuzamos con ejemplos cotidianos y un glosario listo para explorar.
        </p>
        <div class="story__formula" role="list">
            <div class="story__formula-figure" aria-hidden="true">
                <span class="story__formula-symbol">A</span>
                <span>=</span>
                <span class="story__formula-symbol">P</span>
                <span>
                    (
                    <span>1 +</span>
                    <span class="story__fraction">
                        <span class="story__formula-symbol">r</span>
                        <span class="story__line"></span>
                        <span class="story__formula-symbol">n</span>
                    </span>
                    )
                </span>
                <sup class="story__exponent">nt</sup>
            </div>
            <ul class="story__formula-list">
                {#each formulaSegments as segment}
                    <li>
                        <span class="story__chip" aria-hidden="true">{segment.symbol}</span>
                        <div>
                            <h3>{segment.title}</h3>
                            <p>{segment.description}</p>
                            <p class="story__example">{segment.example}</p>
                        </div>
                    </li>
                {/each}
            </ul>
            <details class="story__details">
                <summary>Muéstrame el detalle</summary>
                <p>
                    Supongamos que inviertes $5,000 con una tasa del 7% anual, capitalizada cada mes (n = 12)
                    durante 5 años. La fórmula multiplica tu capital por (1 + 0.07 / 12) elevado a la potencia
                    12 × 5. Si además aportas $500 mensuales, esos aportes se suman en cada periodo y se
                    benefician del mismo factor de crecimiento.
                </p>
            </details>
        </div>
    </section>

    <section class="story__panel" id="acto-3">
        <header>
            <p class="story__overtitle">Acto 3</p>
            <h2>Hábitos que cambian la curva</h2>
        </header>
        <p class="story__intro">
            Estas tres escenas contrastan decisiones comunes. El progreso se ilumina conforme exploras cada
            tarjeta: al completarlas, obtienes una mini guía accionable.
        </p>
        <div class="story__scenarios">
            {#each scenarioCards as card, index}
                <button
                    type="button"
                    class="story__scenario"
                    on:focus={() => handleScenarioFocus(index)}
                    on:mouseenter={() => handleScenarioFocus(index)}
                    on:click={() => handleScenarioClick(index)}
                    aria-pressed={visited[index]}
                >
                    <div class="story__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" role="presentation">
                            <path d={scenarioIcons[card.icon]} fill="none" stroke="currentColor" stroke-width="1.75" />
                        </svg>
                    </div>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <p class="story__takeaway">{card.takeaway}</p>
                    <span class:story__badge--active={visited[index]} class="story__badge">
                        {visited[index] ? '¡Listo!' : 'Da clic o enfoca para marcar'}</span
                    >
                </button>
            {/each}
        </div>
        <div class="story__progress" role="status" aria-live="polite">
            <p>Progreso: {completed} de {scenarioCards.length} escenas recorridas.</p>
            <div class="story__progress-bar" aria-hidden="true">
                <span style={`width: ${progress}%`}></span>
            </div>
        </div>
    </section>
</div>

<style>
    .story {
        display: grid;
        gap: clamp(3rem, 8vh, 5rem);
    }

    .story__panel {
        background: rgba(15, 23, 42, 0.6);
        border-radius: 24px;
        border: 1px solid rgba(148, 163, 184, 0.22);
        padding: clamp(1.5rem, 5vw, 2.75rem);
        display: grid;
        gap: clamp(1.5rem, 4vh, 2.5rem);
    }

    .story__panel--highlight {
        background: linear-gradient(140deg, rgba(249, 115, 22, 0.12), rgba(14, 165, 233, 0.05));
        border: 1px solid rgba(249, 115, 22, 0.35);
    }

    header h2 {
        font-size: clamp(1.8rem, 3vw, 2.4rem);
    }

    .story__overtitle {
        text-transform: uppercase;
        letter-spacing: 0.28em;
        font-weight: 600;
        color: rgba(148, 163, 184, 0.9);
        margin-bottom: 0.5rem;
    }

    .story__intro {
        font-size: 1.05rem;
        color: rgba(226, 232, 240, 0.85);
        line-height: 1.75;
    }

    .story__age {
        display: grid;
        gap: 0.85rem;
    }

    .story__age-label {
        font-weight: 600;
        letter-spacing: 0.04em;
    }

    input[type='range'] {
        width: 100%;
        accent-color: var(--color-accent);
    }

    .story__age-marks {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        color: rgba(148, 163, 184, 0.9);
        text-transform: uppercase;
    }

    .story__age-marks span {
        flex: 1;
        text-align: center;
    }

    .story__age-marks span.active {
        color: var(--color-accent);
        font-weight: 600;
    }

    .story__age-copy {
        margin-top: 0.35rem;
        color: rgba(226, 232, 240, 0.85);
    }

    .story__comparison {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: var(--spacing-md);
    }

    .story__comparison article {
        background: rgba(15, 23, 42, 0.75);
        border-radius: 18px;
        padding: 1.25rem;
        border: 1px solid rgba(59, 130, 246, 0.25);
        display: grid;
        gap: 0.75rem;
    }

    .story__comparison h3 {
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: 1rem;
    }

    .story__comparison ul {
        display: grid;
        gap: 0.5rem;
        padding-left: 1.1rem;
    }

    .story__comparison li {
        line-height: 1.6;
    }

    .story__formula {
        display: grid;
        gap: clamp(1rem, 3vw, 1.75rem);
    }

    .story__formula-figure {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
        align-items: baseline;
        font-size: clamp(1.6rem, 4vw, 2.4rem);
        font-weight: 600;
    }

    .story__formula-symbol {
        color: var(--color-accent);
    }

    .story__fraction {
        display: inline-grid;
        gap: 0.35rem;
        justify-items: center;
    }

    .story__line {
        display: block;
        width: 100%;
        height: 2px;
        background: rgba(148, 163, 184, 0.6);
    }

    .story__exponent {
        font-size: 0.75em;
        color: rgba(226, 232, 240, 0.8);
        margin-left: 0.3rem;
    }

    .story__formula-list {
        display: grid;
        gap: clamp(0.75rem, 2vw, 1.2rem);
    }

    .story__formula-list li {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 1rem;
        align-items: start;
        background: rgba(15, 23, 42, 0.65);
        border-radius: 16px;
        padding: 1rem;
        border: 1px solid rgba(148, 163, 184, 0.22);
    }

    .story__chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 999px;
        background: rgba(59, 130, 246, 0.2);
        color: rgba(56, 189, 248, 1);
        font-weight: 600;
    }

    .story__example {
        margin-top: 0.4rem;
        font-size: 0.9rem;
        color: rgba(148, 163, 184, 0.9);
    }

    .story__details {
        background: rgba(15, 23, 42, 0.7);
        border-radius: 16px;
        padding: 1rem 1.25rem;
        border: 1px solid rgba(249, 115, 22, 0.35);
    }

    .story__details summary {
        cursor: pointer;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        list-style: none;
    }

    .story__details summary::-webkit-details-marker {
        display: none;
    }

    .story__details[open] {
        box-shadow: 0 24px 45px rgba(249, 115, 22, 0.15);
    }

    .story__details p {
        margin-top: 0.65rem;
        line-height: 1.6;
    }

    .story__scenarios {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: var(--spacing-md);
    }

    .story__scenario {
        position: relative;
        display: grid;
        gap: 0.75rem;
        padding: 1.35rem;
        border-radius: 20px;
        border: 1px solid rgba(148, 163, 184, 0.3);
        background: rgba(15, 23, 42, 0.65);
        transition: transform 200ms ease, border-color 200ms ease;
        cursor: pointer;
        color: inherit;
        text-align: left;
        font: inherit;
    }

    .story__scenario:focus-visible,
    .story__scenario:hover {
        transform: translateY(-4px);
        border-color: rgba(59, 130, 246, 0.5);
    }

    .story__scenario h3 {
        text-transform: uppercase;
        letter-spacing: 0.12em;
    }

    .story__icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: rgba(249, 115, 22, 0.18);
        color: rgba(249, 115, 22, 1);
    }

    .story__takeaway {
        font-weight: 600;
        color: rgba(226, 232, 240, 0.95);
    }

    .story__badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.35rem 0.75rem;
        border-radius: 999px;
        background: rgba(148, 163, 184, 0.2);
        font-size: 0.75rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(148, 163, 184, 0.9);
    }

    .story__badge--active {
        background: rgba(34, 197, 94, 0.35);
        color: rgba(22, 163, 74, 1);
    }

    .story__progress {
        margin-top: 1rem;
        display: grid;
        gap: 0.5rem;
    }

    .story__progress-bar {
        position: relative;
        width: 100%;
        height: 10px;
        border-radius: 999px;
        background: rgba(30, 41, 59, 0.6);
        overflow: hidden;
    }

    .story__progress-bar span {
        position: absolute;
        inset: 0;
        border-radius: 999px;
        background: linear-gradient(90deg, rgba(56, 189, 248, 0.8), rgba(249, 115, 22, 0.8));
        transition: width 240ms ease;
    }

    @media (max-width: 768px) {
        .story__formula-list li {
            grid-template-columns: 1fr;
        }

        .story__chip {
            justify-self: start;
        }

        .story__scenario {
            cursor: default;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .story__scenario,
        .story__progress-bar span {
            transition: none;
        }
    }
</style>
