<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { createScrollAnimation } from '@animations/gsap';

    type AgeRange = {
        id: string;
        label: string;
        ariaLabel: string;
        description: string;
        actOne: {
            simple: string;
            compound: string;
            takeaway: string;
        };
    };

    const ageRanges: AgeRange[] = [
        {
            id: 'infancia',
            label: 'Niñez (5-11)',
            ariaLabel: 'Copy para niñez',
            description: 'Vocabulario con metáforas juguetonas y frases cortas.',
            actOne: {
                simple:
                    'Plantas una ficha y cada año te da otra igual. Si tenías 3 huesos, luego tienes 6 y ahí termina la magia.',
                compound:
                    'Plantas una ficha que da otra, y las nuevas fichas también se vuelven plantas. Al poco tiempo el jardín se llena de monedas.',
                takeaway: 'Haz que tus ahorros sigan en el jardín para que crezcan solos.'
            }
        },
        {
            id: 'adolescencia',
            label: 'Adolescencia (12-25)',
            ariaLabel: 'Copy para adolescencia',
            description: 'Conceptos claros con referencias a metas de estudio o viajes.',
            actOne: {
                simple:
                    'El interés simple paga solo sobre tu depósito inicial. Es como vender palomitas y quedarte siempre con la misma ganancia.',
                compound:
                    'El interés compuesto reinvierte cada ganancia. Tus palomitas compran más maíz y pronto necesitas más puestos.',
                takeaway: 'Comienza pronto: el tiempo es el ingrediente que multiplica cualquier meta.'
            }
        },
        {
            id: 'adultez',
            label: 'Adultez mayor (26-90)',
            ariaLabel: 'Copy para adultez mayor',
            description: 'Lenguaje sobrio conectado con bienestar familiar y retiro.',
            actOne: {
                simple:
                    'El interés simple suma una cantidad fija cada periodo. Útil para metas cortas, pero la curva se queda plana.',
                compound:
                    'El interés compuesto acumula intereses sobre intereses, igual que una red de apoyo financiera que cada año se fortalece.',
                takeaway: 'La constancia convierte pequeños ahorros en un ingreso complementario real.'
            }
        }
    ];

    type FormulaStep = {
        symbol: string;
        title: string;
        story: string;
        detail: string;
    };

    const formulaSteps: FormulaStep[] = [
        {
            symbol: 'P',
            title: 'La semilla inicial',
            story: 'El capital de partida, lo que hoy puedes invertir.',
            detail: 'Ejemplo: $5,000 pesos que depositas en una cuenta que reinvierte los intereses.'
        },
        {
            symbol: 'r',
            title: 'La vitamina',
            story: 'La tasa anual expresada como decimal. Es la potencia nutritiva del jardín.',
            detail: 'Un 7% anual equivale a 0.07 en la fórmula.'
        },
        {
            symbol: 'n',
            title: 'Las veces que alimentas',
            story: 'Número de capitalizaciones por año. Puede ser mensual (12), trimestral (4) o anual (1).',
            detail: 'Si los intereses se abonan cada mes, n = 12.'
        },
        {
            symbol: 't',
            title: 'El tiempo',
            story: 'Los años que dejas crecer tu inversión.',
            detail: 'Un plan de estudios o retiro suele requerir al menos 10 años.'
        },
        {
            symbol: 'A',
            title: 'El jardín completo',
            story: 'El resultado final: capital + intereses acumulados.',
            detail: 'A = P(1 + r / n)^{nt} da el valor de tu inversión al cabo de t años.'
        }
    ];

    type Scenario = {
        title: string;
        description: string;
        icon: string;
        takeaway: string;
    };

    const scenarios: Scenario[] = [
        {
            title: 'Empezar tarde',
            description:
                'Invertir $2,000 al año a partir de los 35 años a una tasa del 6% genera cerca de $96,000 a los 55 años.',
            icon: '🌙',
            takeaway: 'Si comienzas tarde, incrementa tus aportaciones o extiende el horizonte para recuperar terreno.'
        },
        {
            title: 'Constancia sin drama',
            description:
                'Ahorrar $1,200 anuales desde los 20 años al 7% produce unos $126,000 a los 50. Más de la mitad viene de intereses.',
            icon: '🌱',
            takeaway: 'Automatiza transferencias para que la disciplina no dependa de tu memoria.'
        },
        {
            title: 'Aportes extra estratégicos',
            description:
                'Sumar $300 adicionales cada fin de año sobre un ahorro mensual de $100 eleva la meta de 20 años en un 15%.',
            icon: '💡',
            takeaway: 'Redirige ingresos extraordinarios (aguinaldo, bonos) a tu inversión y acelera la curva.'
        }
    ];

    let ageIndex = 1;
    let activePopover: number | null = null;
    let showFormulaDetail = false;
    let actOneSection: HTMLElement;
    let actTwoSection: HTMLElement;
    let actThreeSection: HTMLElement;
    let progress = 0;

    const controls: Array<{ destroy(): void } | undefined> = [];

    $: currentRange = ageRanges[ageIndex];
    $: progressLabel = `Lectura de escenarios completada al ${Math.round(progress)}%`;

    onMount(() => {
        controls.push(
            createScrollAnimation(
                actOneSection,
                {
                    trigger: actOneSection,
                    start: 'top 80%',
                    end: 'bottom 60%',
                    scrub: false,
                    once: true
                },
                (timeline) => {
                    timeline
                        .from('.act-one__slider', { opacity: 0, y: 25, duration: 0.6, ease: 'power2.out' })
                        .from(
                            '.act-one__card',
                            { opacity: 0, y: 40, duration: 0.65, ease: 'power3.out', stagger: 0.2 },
                            '-=0.3'
                        );
                }
            )
        );

        controls.push(
            createScrollAnimation(
                actTwoSection,
                {
                    trigger: actTwoSection,
                    start: 'top 80%',
                    end: 'bottom 60%',
                    scrub: false,
                    once: true
                },
                (timeline) => {
                    timeline.from('.formula-step', {
                        opacity: 0,
                        x: -30,
                        duration: 0.55,
                        ease: 'power2.out',
                        stagger: 0.18
                    });
                }
            )
        );

        controls.push(
            createScrollAnimation(
                actThreeSection,
                {
                    trigger: actThreeSection,
                    start: 'top 85%',
                    end: 'bottom 45%',
                    scrub: false,
                    once: true
                },
                (timeline) => {
                    const tracker = { value: 0 };
                    timeline
                        .from('.scenario-card', {
                            opacity: 0,
                            y: 40,
                            duration: 0.6,
                            ease: 'power3.out',
                            stagger: 0.2
                        })
                        .to(tracker, {
                            value: 100,
                            duration: 1.2,
                            ease: 'power2.out',
                            onUpdate: () => {
                                progress = tracker.value;
                            }
                        });
                }
            )
        );
    });

    onDestroy(() => {
        controls.forEach((control) => control?.destroy());
        controls.length = 0;
    });
</script>

<div class="story" aria-labelledby="storyline-heading">
    <header class="story__header">
        <p class="story__eyebrow">Historia en siete actos ligeros</p>
        <h2 id="storyline-heading">Así se siente aprender interés compuesto al hacer scroll</h2>
        <p>
            Cada sección mezcla narrativa, motion y decisiones prácticas. Ajusta el lenguaje, explora la
            fórmula y compara hábitos hasta ver cómo una simple constancia cambia la curva.
        </p>
    </header>

    <section class="act act-one" bind:this={actOneSection} aria-labelledby="act-one-heading">
        <header class="act__header">
            <h3 id="act-one-heading">Acto 1 · Semillas que se multiplican</h3>
            <p>
                Comienza con una metáfora de jardinería: sembrar fichas que brotan en monedas. Usa el
                control de edades para adaptar el lenguaje y compartir la historia sin perder precisión.
            </p>
        </header>
        <div class="act-one__slider" role="group" aria-labelledby="age-selector-label">
            <label id="age-selector-label" for="age-selector">Elige el tono de voz</label>
            <input
                id="age-selector"
                type="range"
                min="0"
                max={ageRanges.length - 1}
                step="1"
                bind:value={ageIndex}
                aria-valuemin="0"
                aria-valuemax={ageRanges.length - 1}
                aria-valuenow={ageIndex}
                aria-valuetext={currentRange.ariaLabel}
            />
            <div class="act-one__labels" aria-hidden="true">
                {#each ageRanges as range, index}
                    <span class:active={index === ageIndex}>{range.label}</span>
                {/each}
            </div>
            <p class="act-one__description">{currentRange.description}</p>
        </div>
        <div class="act-one__cards" role="list">
            <article class="act-one__card" role="listitem">
                <h4>Interés simple</h4>
                <p>{currentRange.actOne.simple}</p>
            </article>
            <article class="act-one__card highlight" role="listitem">
                <h4>Interés compuesto</h4>
                <p>{currentRange.actOne.compound}</p>
                <p class="act-one__takeaway">{currentRange.actOne.takeaway}</p>
            </article>
        </div>
    </section>

    <section class="act act-two" bind:this={actTwoSection} aria-labelledby="act-two-heading">
        <header class="act__header">
            <h3 id="act-two-heading">Acto 2 · La fórmula se vuelve cuento</h3>
            <p>
                Desmenuza cada símbolo de
                <code class="formula__notation">A = P (1 + r / n)<sup>nt</sup></code>
                y deja que el lector profundice solo si lo desea. Los popovers ofrecen ejemplos puntuales
                para quien necesite referencias numéricas.
            </p>
        </header>
        <div class="formula" role="list">
            {#each formulaSteps as step, index}
                <article class="formula-step" role="listitem">
                    <div class="formula-step__symbol" aria-hidden="true">{step.symbol}</div>
                    <div class="formula-step__content">
                        <h4>{step.title}</h4>
                        <p>{step.story}</p>
                        <button
                            type="button"
                            class="formula-step__button"
                            aria-expanded={activePopover === index}
                            aria-controls={`formula-detail-${index}`}
                            on:click={() => (activePopover = activePopover === index ? null : index)}
                            on:blur={() => (activePopover = activePopover === index ? null : activePopover)}
                        >
                            Dame un ejemplo
                        </button>
                    </div>
                    <div
                        id={`formula-detail-${index}`}
                        class:visible={activePopover === index}
                        class="formula-step__popover"
                        role="status"
                    >
                        {step.detail}
                    </div>
                </article>
            {/each}
        </div>
        <button
            type="button"
            class="formula__toggle"
            on:click={() => (showFormulaDetail = !showFormulaDetail)}
            aria-expanded={showFormulaDetail}
        >
            {showFormulaDetail ? 'Ocultar el cálculo completo' : 'Muéstrame el detalle'}
        </button>
        {#if showFormulaDetail}
            <div class="formula__detail" role="region" aria-live="polite">
                <p>
                    Si inviertes <strong>$5,000</strong> pesos a una tasa del <strong>7% anual</strong>,
                    capitalizando <strong>mensualmente</strong> durante <strong>10 años</strong>, la fórmula
                    queda así:
                    <code class="formula__notation">A = 5000 (1 + 0.07 / 12)<sup>120</sup></code>. El
                    resultado es de aproximadamente <strong>$10,070</strong>. Más de $5,000 provienen
                    únicamente de reinvertir intereses.
                </p>
                <p>
                    Añadir aportaciones periódicas (por ejemplo $200 mensuales) incrementa el resultado hasta
                    los $42,000. Es el punto exacto donde la matemática se siente como una historia que te
                    empuja hacia adelante.
                </p>
            </div>
        {/if}
    </section>

    <section class="act act-three" bind:this={actThreeSection} aria-labelledby="act-three-heading">
        <header class="act__header">
            <h3 id="act-three-heading">Acto 3 · Hábitos que cambian la curva</h3>
            <p>
                Contrasta tres rutinas financieras. Cada tarjeta termina con un paso accionable, mientras la
                barra de progreso celebra cuando completas la lectura.
            </p>
        </header>
        <div class="act-three__progress" role="img" aria-label={progressLabel}>
            <div class="act-three__progress-track">
                <div class="act-three__progress-bar" style={`--progress:${progress}%`}></div>
            </div>
            <span>{Math.round(progress)}%</span>
        </div>
        <div class="act-three__grid" role="list">
            {#each scenarios as scenario}
                <article class="scenario-card" role="listitem">
                    <div class="scenario-card__icon" aria-hidden="true">{scenario.icon}</div>
                    <h4>{scenario.title}</h4>
                    <p>{scenario.description}</p>
                    <p class="scenario-card__takeaway">{scenario.takeaway}</p>
                </article>
            {/each}
        </div>
    </section>
</div>

<style>
    .story {
        display: grid;
        gap: clamp(2.5rem, 6vw, 4.5rem);
    }

    .story__header {
        display: grid;
        gap: var(--spacing-sm);
        max-width: 720px;
    }

    .story__eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.28em;
        font-size: 0.85rem;
        color: rgba(226, 232, 240, 0.6);
    }

    .story__header h2 {
        font-size: clamp(1.8rem, 3.1vw, 2.6rem);
    }

    .act {
        display: grid;
        gap: var(--spacing-md);
        background: rgba(15, 23, 42, 0.6);
        border-radius: 28px;
        padding: clamp(1.5rem, 5vw, 2.75rem);
        border: 1px solid rgba(148, 163, 184, 0.2);
        position: relative;
        overflow: hidden;
    }

    .act::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(120deg, rgba(125, 211, 252, 0.08), rgba(249, 115, 22, 0.05));
        pointer-events: none;
    }

    .act__header {
        display: grid;
        gap: 0.75rem;
        position: relative;
        z-index: 1;
    }

    .act-one__slider {
        display: grid;
        gap: 0.75rem;
        position: relative;
        z-index: 1;
    }

    .act-one__slider label {
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    .act-one__slider input[type='range'] {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 4px;
        border-radius: 999px;
        background: rgba(148, 163, 184, 0.35);
    }

    .act-one__slider input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 18px;
        width: 18px;
        border-radius: 50%;
        background: linear-gradient(120deg, rgba(125, 211, 252, 1), rgba(249, 115, 22, 1));
        box-shadow: 0 0 0 6px rgba(125, 211, 252, 0.25);
        border: none;
    }

    .act-one__slider input[type='range']::-moz-range-thumb {
        height: 18px;
        width: 18px;
        border-radius: 50%;
        background: linear-gradient(120deg, rgba(125, 211, 252, 1), rgba(249, 115, 22, 1));
        border: none;
    }

    .act-one__labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        color: rgba(148, 163, 184, 0.8);
    }

    .act-one__labels span.active {
        color: rgba(248, 250, 252, 0.95);
        font-weight: 600;
    }

    .act-one__description {
        font-size: 0.95rem;
        color: rgba(226, 232, 240, 0.85);
    }

    .act-one__cards {
        display: grid;
        gap: var(--spacing-sm);
    }

    .act-one__card {
        position: relative;
        padding: 1.4rem;
        border-radius: 20px;
        background: rgba(15, 23, 42, 0.88);
        border: 1px solid rgba(148, 163, 184, 0.28);
        display: grid;
        gap: 0.6rem;
        overflow: hidden;
    }

    .act-one__card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at bottom, rgba(59, 130, 246, 0.28), transparent 65%);
        opacity: 0;
        transition: opacity 200ms ease;
    }

    .act-one__card:hover::before,
    .act-one__card:focus-within::before {
        opacity: 1;
    }

    .act-one__card h4 {
        font-size: 1.1rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }

    .act-one__takeaway {
        font-weight: 600;
        color: rgba(249, 115, 22, 0.9);
    }

    .act-one__card.highlight::before {
        background: radial-gradient(circle at bottom, rgba(249, 115, 22, 0.4), transparent 70%);
    }

    .formula {
        display: grid;
        gap: clamp(1rem, 3vw, 1.5rem);
        position: relative;
        z-index: 1;
    }

    .formula-step {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 1rem;
        align-items: start;
        position: relative;
        padding: 1rem 1.25rem;
        border-radius: 18px;
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(148, 163, 184, 0.25);
    }

    .formula-step__symbol {
        width: 3rem;
        height: 3rem;
        display: grid;
        place-items: center;
        font-weight: 700;
        border-radius: 999px;
        background: rgba(125, 211, 252, 0.22);
        color: rgba(125, 211, 252, 1);
    }

    .formula-step__button {
        background: none;
        border: 1px solid rgba(125, 211, 252, 0.4);
        border-radius: 999px;
        padding: 0.45rem 1rem;
        color: rgba(226, 232, 240, 0.9);
        font-size: 0.85rem;
        transition: border-color 160ms ease, background 160ms ease;
    }

    .formula-step__button:hover,
    .formula-step__button:focus-visible,
    .formula-step__button[aria-expanded='true'] {
        border-color: rgba(249, 115, 22, 0.6);
        background: rgba(15, 23, 42, 0.9);
    }

    .formula-step__popover {
        position: absolute;
        left: clamp(1rem, 8vw, 2rem);
        right: clamp(1rem, 8vw, 2rem);
        bottom: -0.5rem;
        transform: translateY(100%);
        background: rgba(15, 23, 42, 0.92);
        border-radius: 16px;
        border: 1px solid rgba(148, 163, 184, 0.35);
        padding: 0.85rem 1.1rem;
        font-size: 0.9rem;
        opacity: 0;
        transition: opacity 160ms ease, transform 160ms ease;
        pointer-events: none;
    }

    .formula-step__popover.visible {
        opacity: 1;
        transform: translateY(calc(100% + 0.6rem));
        pointer-events: auto;
    }

    .formula__toggle {
        justify-self: start;
        border-radius: 999px;
        background: rgba(249, 115, 22, 0.1);
        border: 1px solid rgba(249, 115, 22, 0.4);
        padding: 0.6rem 1.3rem;
        color: rgba(249, 115, 22, 0.95);
        font-weight: 600;
        transition: transform 160ms ease;
    }

    .formula__toggle:hover,
    .formula__toggle:focus-visible {
        transform: translateY(-2px);
    }

    .formula__detail {
        background: rgba(15, 23, 42, 0.92);
        border-radius: 20px;
        border: 1px solid rgba(125, 211, 252, 0.25);
        padding: clamp(1rem, 4vw, 1.8rem);
        display: grid;
        gap: 0.75rem;
        font-size: 0.95rem;
        color: rgba(226, 232, 240, 0.9);
    }

    .formula__notation {
        font-family: 'IBM Plex Mono', 'Fira Code', monospace;
        font-size: 0.95em;
        color: rgba(125, 211, 252, 0.9);
        white-space: nowrap;
    }

    .act-three__progress {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.9rem;
        color: rgba(226, 232, 240, 0.8);
    }

    .act-three__progress-track {
        flex: 1;
        height: 8px;
        border-radius: 999px;
        background: rgba(148, 163, 184, 0.2);
        overflow: hidden;
    }

    .act-three__progress-bar {
        height: 100%;
        width: var(--progress, 0%);
        background: linear-gradient(120deg, rgba(125, 211, 252, 0.9), rgba(249, 115, 22, 0.9));
        border-radius: 999px;
        transition: width 200ms ease;
    }

    .act-three__grid {
        display: grid;
        gap: var(--spacing-sm);
    }

    .scenario-card {
        position: relative;
        padding: 1.4rem;
        border-radius: 20px;
        background: rgba(15, 23, 42, 0.88);
        border: 1px solid rgba(148, 163, 184, 0.25);
        display: grid;
        gap: 0.65rem;
    }

    .scenario-card__icon {
        font-size: 1.8rem;
    }

    .scenario-card__takeaway {
        font-weight: 600;
        color: rgba(249, 115, 22, 0.9);
    }

    @media (min-width: 56rem) {
        .act-one__cards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .act-three__grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
    }

    @media (max-width: 640px) {
        .formula-step {
            grid-template-columns: 1fr;
        }

        .formula-step__symbol {
            justify-self: start;
        }

        .formula-step__popover {
            position: relative;
            transform: translateY(1rem);
            left: 0;
            right: 0;
        }

        .formula-step__popover.visible {
            transform: translateY(0);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .act,
        .act-one__card,
        .scenario-card,
        .formula-step__button,
        .formula__toggle {
            transition: none;
        }

        .act-three__progress-bar {
            transition: none;
        }
    }
</style>
