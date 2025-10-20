<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { createScrollAnimation, ensureGsapRegistered, ScrollTrigger } from '$lib/animations/gsap';
    import ChartShowcase from '../charts/ChartShowcase.svelte';
    import ResponsiveD3Chart from '../charts/ResponsiveD3Chart.svelte';

    type Framework = 'chartjs' | 'd3';

    type Preset = {
        id: string;
        name: string;
        description: string;
        principal: number;
        contributionMonthly: number;
        rate: number;
        frequency: number;
        years: number;
    };

    type Config = Pick<Preset, 'principal' | 'contributionMonthly' | 'rate' | 'frequency' | 'years'>;

    type NarrativeFrame = {
        framework: Framework;
        title: string;
        body: string;
        preset: Preset['id'];
    };

    type SchedulePoint = {
        year: number;
        total: number;
        contributions: number;
    };

    const presets: Preset[] = [
        {
            id: 'universitaria',
            name: 'Meta universitaria',
            description: 'Ahorra con tiempo para pagar colegiaturas sin sobresaltos.',
            principal: 12000,
            contributionMonthly: 800,
            rate: 0.07,
            frequency: 12,
            years: 10
        },
        {
            id: 'jubilacion',
            name: 'Jubilación relajada',
            description: 'Una reserva que cubre 20 años de gastos tranquilos.',
            principal: 50000,
            contributionMonthly: 2500,
            rate: 0.06,
            frequency: 12,
            years: 25
        },
        {
            id: 'proyecto',
            name: 'Proyecto familiar',
            description: 'Reúne capital para remodelar la casa o emprender juntos.',
            principal: 20000,
            contributionMonthly: 1500,
            rate: 0.085,
            frequency: 4,
            years: 12
        }
    ];

    const frames: NarrativeFrame[] = [
        {
            framework: 'chartjs',
            title: 'Meta universitaria: observa la curva completa',
            body: 'Chart.js nos deja ver cómo se acumula el capital para pagar la universidad. La línea naranja muestra el total con intereses; la azul, lo que aportarías sin reinversión.',
            preset: 'universitaria'
        },
        {
            framework: 'd3',
            title: 'Jubilación relajada: revisa cada hito',
            body: 'Con D3 detallamos los años críticos. El zoom revela cuándo conviene incrementar aportes y cómo se separa el capital aportado del rendimiento generado.',
            preset: 'jubilacion'
        },
        {
            framework: 'chartjs',
            title: 'Proyecto familiar: refuerzos trimestrales',
            body: 'Los aportes trimestrales muestran saltos visibles. Ajusta las variables para ver cómo pequeñas inyecciones extra aceleran la meta compartida.',
            preset: 'proyecto'
        }
    ];

    const frequencyOptions: Array<{ value: number; label: string; help: string }> = [
        { value: 1, label: 'Anual', help: 'Los intereses se calculan una vez al año.' },
        { value: 4, label: 'Trimestral', help: 'Se capitaliza cada 3 meses.' },
        { value: 12, label: 'Mensual', help: 'Los intereses y aportes se aplican cada mes.' }
    ];

    const activeFramework = writable<Framework>(frames[0].framework);

    let config: Config = { ...presets[0] };
    let activePreset: string = presets[0].id;
    let storyNodes: Array<HTMLElement | undefined> = [];

    const teardown: Array<() => void> = [];

    const currencyFormatter = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        maximumFractionDigits: 0
    });

    const percentFormatter = new Intl.NumberFormat('es-MX', {
        style: 'percent',
        maximumFractionDigits: 1
    });

    function formatCurrency(value: number) {
        return currencyFormatter.format(Math.round(value));
    }

    function formatPercent(value: number) {
        return percentFormatter.format(value);
    }

    function registerStory(node: HTMLElement, index: number) {
        storyNodes[index] = node;

        return {
            destroy() {
                storyNodes[index] = undefined;
            }
        };
    }

    function applyPreset(id: string) {
        const preset = presets.find((item) => item.id === id);
        if (!preset) return;
        config = {
            principal: preset.principal,
            contributionMonthly: preset.contributionMonthly,
            rate: preset.rate,
            frequency: preset.frequency,
            years: preset.years
        };
        activePreset = preset.id;
    }

    function handleInput<K extends keyof Config>(key: K, value: number) {
        config = { ...config, [key]: value };
        activePreset = 'personalizado';
    }

    function buildSchedule(state: Config): SchedulePoint[] {
        const { principal, contributionMonthly, rate, frequency, years } = state;
        const periodsPerYear = frequency;
        const totalYears = Math.max(1, Math.round(years));
        const periodicRate = rate / periodsPerYear;
        const contributionPerPeriod = (contributionMonthly * 12) / periodsPerYear;
        let balance = principal;
        let contributions = principal;
        const points: SchedulePoint[] = [{ year: 0, total: balance, contributions }];

        for (let year = 1; year <= totalYears; year += 1) {
            for (let period = 0; period < periodsPerYear; period += 1) {
                balance *= 1 + periodicRate;
                balance += contributionPerPeriod;
                contributions += contributionPerPeriod;
            }
            points.push({ year, total: balance, contributions });
        }

        return points;
    }

    $: schedule = buildSchedule(config);
    $: chartPoints = schedule.map((point) => ({
        label: `${point.year} ${point.year === 1 ? 'año' : 'años'}`,
        total: point.total,
        contributions: point.contributions
    }));

    $: finalPoint = schedule[schedule.length - 1];
    $: totalContributions = finalPoint?.contributions ?? 0;
    $: finalBalance = finalPoint?.total ?? 0;
    $: interestEarned = finalBalance - totalContributions;
    $: summaryText = `Con estas variables llegarías a ${formatCurrency(finalBalance)}. Tus aportaciones acumuladas son ${formatCurrency(totalContributions)} y el interés compuesto aporta ${formatCurrency(interestEarned)} del total.`;

    onMount(() => {
        ensureGsapRegistered();

        frames.forEach((frame, index) => {
            const node = storyNodes[index];
            if (!node) return;

            const animation = createScrollAnimation(
                node,
                {
                    trigger: node,
                    scrub: true,
                    start: 'top 85%',
                    end: 'bottom 60%'
                },
                (timeline) => {
                    timeline.fromTo(
                        node,
                        { opacity: 0.25, y: 48 },
                        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
                    );
                }
            );

            const trigger = ScrollTrigger.create({
                trigger: node,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => {
                    activeFramework.set(frame.framework);
                    applyPreset(frame.preset);
                },
                onEnterBack: () => {
                    activeFramework.set(frame.framework);
                    applyPreset(frame.preset);
                }
            });

            teardown.push(() => {
                animation?.destroy();
                trigger.kill();
            });
        });
    });

    onDestroy(() => {
        teardown.forEach((fn) => fn());
        teardown.length = 0;
    });
</script>

<div class="sandbox" id="visualizaciones">
    <div class="sandbox__display" aria-live="polite">
        <div class="sandbox__stage">
            <div class:active={$activeFramework === 'chartjs'} class="sandbox__frame" aria-hidden={$activeFramework !== 'chartjs'}>
                <ChartShowcase points={chartPoints} caption="Comparación entre aportes acumulados y crecimiento total" />
            </div>
            <div class:active={$activeFramework === 'd3'} class="sandbox__frame" aria-hidden={$activeFramework !== 'd3'}>
                <ResponsiveD3Chart points={chartPoints} />
            </div>
        </div>
        <div class="sandbox__stats">
            <p>{summaryText}</p>
            <dl>
                <div>
                    <dt>Capital inicial</dt>
                    <dd>{formatCurrency(config.principal)}</dd>
                </div>
                <div>
                    <dt>Aportación mensual</dt>
                    <dd>{formatCurrency(config.contributionMonthly)}</dd>
                </div>
                <div>
                    <dt>Tasa anual</dt>
                    <dd>{formatPercent(config.rate)}</dd>
                </div>
            </dl>
        </div>
        <p class="sandbox__hint">
            ¿Quieres personalizar? Ajusta los controles y guarda una captura para seguir tu plan. El modo de
            movimiento reducido mantiene cambios suaves.
        </p>
    </div>

    <div class="sandbox__stories">
        <div class="sandbox__controls" aria-label="Controles del laboratorio">
            <h3>Preajustes narrativos</h3>
            <div class="sandbox__presets">
                {#each presets as preset}
                    <button
                        type="button"
                        class:active={activePreset === preset.id}
                        on:click={() => applyPreset(preset.id)}
                    >
                        <span>{preset.name}</span>
                        <small>{preset.description}</small>
                    </button>
                {/each}
            </div>
            <h3>Personaliza tus números</h3>
            <form class="sandbox__form" aria-describedby="sandbox-defs">
                <div class="sandbox__field">
                    <label for="principal">Capital inicial</label>
                    <p id="principal-help">Dinero con el que empiezas hoy.</p>
                    <input
                        id="principal"
                        type="range"
                        min="0"
                        max="150000"
                        step="1000"
                        value={config.principal}
                        on:input={(event) => handleInput('principal', Number(event.currentTarget.value))}
                        aria-describedby="principal-help"
                    />
                    <output>{formatCurrency(config.principal)}</output>
                </div>
                <div class="sandbox__field">
                    <label for="contribution">Aportación mensual</label>
                    <p id="contribution-help">Depósito periódico que agregas después de cada periodo.</p>
                    <input
                        id="contribution"
                        type="range"
                        min="0"
                        max="6000"
                        step="50"
                        value={config.contributionMonthly}
                        on:input={(event) => handleInput('contributionMonthly', Number(event.currentTarget.value))}
                        aria-describedby="contribution-help"
                    />
                    <output>{formatCurrency(config.contributionMonthly)}</output>
                </div>
                <div class="sandbox__field">
                    <label for="rate">Tasa anual</label>
                    <p id="rate-help">Porcentaje que gana tu inversión cada año.</p>
                    <input
                        id="rate"
                        type="range"
                        min="0.01"
                        max="0.15"
                        step="0.005"
                        value={config.rate}
                        on:input={(event) => handleInput('rate', Number(event.currentTarget.value))}
                        aria-describedby="rate-help"
                    />
                    <output>{formatPercent(config.rate)}</output>
                </div>
                <div class="sandbox__field">
                    <label for="frequency">Frecuencia de capitalización</label>
                    <p id="frequency-help">Cuántas veces se aplican intereses y aportes cada año.</p>
                    <select
                        id="frequency"
                        on:change={(event) => handleInput('frequency', Number(event.currentTarget.value))}
                        aria-describedby="frequency-help"
                    >
                        {#each frequencyOptions as option}
                            <option value={option.value} selected={config.frequency === option.value}>
                                {option.label}
                            </option>
                        {/each}
                    </select>
                    <ul class="sandbox__help-list">
                        {#each frequencyOptions as option}
                            <li>{option.label}: {option.help}</li>
                        {/each}
                    </ul>
                </div>
                <div class="sandbox__field">
                    <label for="years">Tiempo (años)</label>
                    <p id="years-help">El ingrediente clave: deja que el interés trabaje con calma.</p>
                    <input
                        id="years"
                        type="range"
                        min="1"
                        max="40"
                        step="1"
                        value={config.years}
                        on:input={(event) => handleInput('years', Number(event.currentTarget.value))}
                        aria-describedby="years-help"
                    />
                    <output>{config.years} {config.years === 1 ? 'año' : 'años'}</output>
                </div>
            </form>
            <p id="sandbox-defs" class="sandbox__definitions">
                Nota: las aportaciones se calculan al final de cada periodo. Puedes duplicar este cálculo en tu
                hoja de cálculo con la fórmula FV = P(1 + r/n)^(n · t) + C × ((1 + r/n)^(n · t) - 1) / (r/n).
            </p>
        </div>
        {#each frames as frame, index}
            <article class="story" use:registerStory={index}>
                <h3>{frame.title}</h3>
                <p>{frame.body}</p>
            </article>
        {/each}
    </div>
</div>

<style>
    .sandbox {
        display: grid;
        gap: var(--spacing-lg);
    }

    .sandbox__display {
        position: relative;
        padding: var(--spacing-md);
        background: rgba(15, 23, 42, 0.55);
        border-radius: 24px;
        border: 1px solid rgba(148, 163, 184, 0.25);
        display: grid;
        gap: var(--spacing-md);
    }

    .sandbox__stage {
        position: relative;
        overflow: hidden;
        min-height: clamp(280px, 40vh, 420px);
        border-radius: 18px;
    }

    .sandbox__frame {
        position: absolute;
        inset: 0;
        opacity: 0;
        transform: scale(0.97);
        transition: opacity 320ms ease, transform 320ms ease;
        pointer-events: none;
    }

    .sandbox__frame.active {
        opacity: 1;
        transform: scale(1);
        pointer-events: auto;
    }

    .sandbox__stats {
        display: grid;
        gap: 0.75rem;
    }

    .sandbox__stats dl {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 0.75rem;
    }

    .sandbox__stats dt {
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 0.75rem;
        color: rgba(148, 163, 184, 0.9);
    }

    .sandbox__stats dd {
        font-size: 1.1rem;
        font-weight: 600;
        color: rgba(226, 232, 240, 0.95);
    }

    .sandbox__hint {
        font-size: 0.9rem;
        color: rgba(226, 232, 240, 0.8);
    }

    .sandbox__stories {
        display: grid;
        gap: clamp(2rem, 7vh, 3.5rem);
    }

    .sandbox__controls {
        background: rgba(15, 23, 42, 0.6);
        border-radius: 24px;
        border: 1px solid rgba(59, 130, 246, 0.25);
        padding: clamp(1.5rem, 4vw, 2.5rem);
        display: grid;
        gap: 1.5rem;
    }

    .sandbox__controls h3 {
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 0.95rem;
        color: rgba(148, 163, 184, 0.9);
    }

    .sandbox__presets {
        display: grid;
        gap: 0.75rem;
    }

    .sandbox__presets button {
        display: grid;
        gap: 0.35rem;
        padding: 0.85rem 1rem;
        border-radius: 14px;
        background: rgba(15, 23, 42, 0.7);
        border: 1px solid rgba(148, 163, 184, 0.25);
        color: inherit;
        text-align: left;
        cursor: pointer;
        transition: border-color 160ms ease, transform 160ms ease;
    }

    .sandbox__presets button:hover,
    .sandbox__presets button:focus-visible {
        border-color: rgba(59, 130, 246, 0.55);
        transform: translateY(-2px);
    }

    .sandbox__presets button.active {
        border-color: rgba(249, 115, 22, 0.65);
        background: rgba(249, 115, 22, 0.12);
    }

    .sandbox__presets small {
        color: rgba(148, 163, 184, 0.9);
    }

    .sandbox__form {
        display: grid;
        gap: 1.25rem;
    }

    .sandbox__field {
        display: grid;
        gap: 0.5rem;
    }

    .sandbox__field label {
        font-weight: 600;
    }

    .sandbox__field p {
        font-size: 0.85rem;
        color: rgba(148, 163, 184, 0.9);
    }

    .sandbox__field input[type='range'] {
        width: 100%;
        accent-color: var(--color-accent);
    }

    .sandbox__field output {
        font-size: 0.95rem;
        font-weight: 600;
        color: rgba(226, 232, 240, 0.95);
    }

    .sandbox__field select {
        background: rgba(15, 23, 42, 0.75);
        color: inherit;
        border-radius: 12px;
        border: 1px solid rgba(148, 163, 184, 0.35);
        padding: 0.65rem 0.75rem;
    }

    .sandbox__help-list {
        margin: 0;
        padding-left: 1rem;
        font-size: 0.8rem;
        color: rgba(148, 163, 184, 0.85);
        display: grid;
        gap: 0.25rem;
    }

    .sandbox__definitions {
        font-size: 0.85rem;
        color: rgba(226, 232, 240, 0.8);
        line-height: 1.6;
    }

    .story {
        display: grid;
        gap: 0.75rem;
        padding-inline: clamp(0rem, 4vw, 1.5rem);
    }

    .story h3 {
        font-size: clamp(1.25rem, 2.4vw, 1.6rem);
        font-weight: 600;
    }

    .story p {
        color: rgba(226, 232, 240, 0.9);
        line-height: 1.7;
    }

    @media (min-width: 62rem) {
        .sandbox {
            grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
            align-items: start;
        }

        .sandbox__display {
            position: sticky;
            top: clamp(4rem, 16vh, 7rem);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .sandbox__frame {
            transition: opacity 160ms ease;
            transform: none;
        }

        .sandbox__frame.active {
            transform: none;
        }
    }
</style>
