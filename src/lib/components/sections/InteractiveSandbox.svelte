<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { createScrollAnimation, ensureGsapRegistered, ScrollTrigger } from '$lib/animations/gsap';
    import ChartShowcase from '../charts/ChartShowcase.svelte';
    import ResponsiveD3Chart from '../charts/ResponsiveD3Chart.svelte';

    type Framework = 'chartjs' | 'd3';

    type SimulationParameters = {
        principal: number;
        contribution: number;
        rate: number;
        years: number;
        frequency: number;
        extraAnnual: number;
    };

    type Preset = {
        id: string;
        name: string;
        description: string;
        parameters: SimulationParameters;
    };

    type ControlKey = keyof SimulationParameters;

    type ChartDataset = {
        label: string;
        data: number[];
    };

    type CompoundPoint = {
        year: number;
        total: number;
        contributions: number;
        interest: number;
    };

    const CUSTOM_PRESET_ID = 'personalizado';

    const presets: Preset[] = [
        {
            id: 'universidad',
            name: 'Meta universitaria',
            description:
                'Ahorra desde la adolescencia para cubrir colegiaturas: depósitos moderados con extra en diciembre.',
            parameters: {
                principal: 8000,
                contribution: 350,
                rate: 7,
                years: 12,
                frequency: 12,
                extraAnnual: 1500
            }
        },
        {
            id: 'jubilacion',
            name: 'Jubilación relajada',
            description:
                'Aportaciones constantes durante 25 años con refuerzos anuales. Ideal para quien inicia en sus 30s.',
            parameters: {
                principal: 20000,
                contribution: 600,
                rate: 6.5,
                years: 25,
                frequency: 12,
                extraAnnual: 3000
            }
        },
        {
            id: 'proyecto',
            name: 'Proyecto familiar',
            description:
                'Combinación de aportes trimestrales y refuerzos anuales para un negocio o remodelación en 8 años.',
            parameters: {
                principal: 15000,
                contribution: 1200,
                rate: 8,
                years: 8,
                frequency: 4,
                extraAnnual: 2000
            }
        }
    ];

    const frequencyOptions = [
        { value: 1, label: 'Anual', description: 'Intereses se suman una vez por año.' },
        { value: 4, label: 'Trimestral', description: 'Los intereses se abonan cuatro veces por año.' },
        { value: 12, label: 'Mensual', description: 'Capitalización frecuente, ideal para aportes automáticos.' }
    ];

    type ControlConfig = {
        key: ControlKey;
        label: string;
        min?: number;
        max?: number;
        step?: number;
        type?: 'range' | 'select';
    };

    const controlConfigs: ControlConfig[] = [
        { key: 'principal', label: 'Capital inicial', min: 1000, max: 100000, step: 500 },
        { key: 'contribution', label: 'Aporte por periodo', min: 0, max: 4000, step: 100 },
        { key: 'rate', label: 'Tasa anual (%)', min: 1, max: 15, step: 0.1 },
        { key: 'years', label: 'Duración (años)', min: 1, max: 40, step: 1 },
        { key: 'frequency', label: 'Frecuencia de capitalización', type: 'select' },
        { key: 'extraAnnual', label: 'Aporte extra al cierre de año', min: 0, max: 10000, step: 250 }
    ];

    const parameterDefinitions: Record<ControlKey, string> = {
        principal: 'Dinero que colocas desde el inicio para activar el interés compuesto.',
        contribution: 'Aporte recurrente que realizas en cada periodo según la frecuencia elegida.',
        rate: 'Porcentaje de crecimiento anual estimado. Procura ser realista con tu institución financiera.',
        years: 'Tiempo durante el que dejarás crecer la inversión sin retirar el capital.',
        frequency: 'Número de veces que se capitalizan intereses por año. Más frecuencia = crecimiento acelerado.',
        extraAnnual: 'Depósito adicional que realizas una vez al año (bonos, aguinaldos, utilidades).'
    };

    const frameTemplates = [
        {
            framework: 'chartjs' as const,
            title: 'Panorámica desde Chart.js'
        },
        {
            framework: 'd3' as const,
            title: 'Zoom anual con D3.js'
        }
    ];

    const activeFramework = writable<Framework>(frameTemplates[0].framework);

    let params: SimulationParameters = { ...presets[0].parameters };
    let selectedPresetId: string = presets[0].id;
    let storyNodes: Array<HTMLElement | undefined> = [];
    let activeTooltip: ControlKey | null = null;
    let simulation: CompoundPoint[] = [];
    let chartLabels: string[] = [];
    let chartDatasets: ChartDataset[] = [];
    let d3Points: CompoundPoint[] = [];
    let defaultPoint: CompoundPoint = {
        year: 0,
        total: params.principal,
        contributions: params.principal,
        interest: 0
    };
    let finalPoint: CompoundPoint = defaultPoint;
    let totalInterest = 0;
    let interestPercentage = 0;
    let presetDescription = presets[0].description;
    let narrativeFrames = frameTemplates.map((template) => ({ ...template, body: '' }));
    let metrics: Array<{ label: string; value: string }> = [];

    function registerStory(node: HTMLElement, index: number) {
        storyNodes[index] = node;

        return {
            destroy() {
                storyNodes[index] = undefined;
            }
        };
    }

    const teardown: Array<() => void> = [];

    function formatCurrency(value: number) {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(
            value
        );
    }

    function simulateCompound(parameters: SimulationParameters): CompoundPoint[] {
        const { principal, contribution, rate, years, frequency, extraAnnual } = parameters;
        const ratePerPeriod = rate / 100 / frequency;
        const points: CompoundPoint[] = [];
        let balance = principal;
        let contributions = principal;

        for (let year = 1; year <= years; year++) {
            for (let period = 0; period < frequency; period++) {
                balance *= 1 + ratePerPeriod;
                if (contribution > 0) {
                    balance += contribution;
                    contributions += contribution;
                }
            }

            if (extraAnnual > 0) {
                balance += extraAnnual;
                contributions += extraAnnual;
            }

            const roundedBalance = Number(balance.toFixed(2));
            const roundedContributions = Number(contributions.toFixed(2));
            points.push({
                year,
                total: roundedBalance,
                contributions: roundedContributions,
                interest: Number((roundedBalance - roundedContributions).toFixed(2))
            });
        }

        return points;
    }

    function applyPreset(id: string) {
        const preset = presets.find((item) => item.id === id);
        if (!preset) return;
        params = { ...preset.parameters };
        selectedPresetId = preset.id;
    }

    function updateParam(key: ControlKey, value: number) {
        params = { ...params, [key]: value };
        selectedPresetId = CUSTOM_PRESET_ID;
    }

    function showTooltip(key: ControlKey) {
        activeTooltip = key;
    }

    function hideTooltip(key: ControlKey) {
        if (activeTooltip === key) {
            activeTooltip = null;
        }
    }

    $: simulation = simulateCompound(params);
    $: chartLabels = simulation.map((point) => `Año ${point.year}`);
    $: chartDatasets = [
        {
            label: 'Monto total',
            data: simulation.map((point) => point.total)
        },
        {
            label: 'Aportes acumulados',
            data: simulation.map((point) => point.contributions)
        }
    ];
    $: d3Points = simulation;
    $: defaultPoint = {
        year: 0,
        total: params.principal,
        contributions: params.principal,
        interest: 0
    };
    $: finalPoint = simulation[simulation.length - 1] ?? defaultPoint;
    $: totalInterest = Math.max(0, finalPoint.total - finalPoint.contributions);
    $: interestPercentage = finalPoint.total > 0 ? (totalInterest / finalPoint.total) * 100 : 0;
    $: presetDescription =
        selectedPresetId === CUSTOM_PRESET_ID
            ? 'Has personalizado los valores. Ajusta cada control y observa cómo cambian las curvas.'
            : presets.find((preset) => preset.id === selectedPresetId)?.description ?? '';
    $: narrativeFrames = frameTemplates.map((template) => {
        if (template.framework === 'chartjs') {
            return {
                ...template,
                body: `En ${params.years} años podrías alcanzar ${formatCurrency(finalPoint.total)}. El área azul marca tus aportes (${formatCurrency(finalPoint.contributions)}), mientras la línea naranja destaca los intereses (${formatCurrency(totalInterest)}).`
            };
        }

        return {
            ...template,
            body: `Cada punto revela el salto anual. El año ${finalPoint.year} suma ${formatCurrency(totalInterest)} en ganancias acumuladas, útil para decidir cuándo aumentar el aporte extra de ${formatCurrency(params.extraAnnual)}.`
        };
    });

    $: metrics = [
        {
            label: 'Monto proyectado',
            value: formatCurrency(finalPoint.total)
        },
        {
            label: 'Aportes acumulados',
            value: formatCurrency(finalPoint.contributions)
        },
        {
            label: 'Intereses generados',
            value: `${formatCurrency(totalInterest)} · ${interestPercentage.toFixed(1)}%`
        }
    ];

    onMount(() => {
        ensureGsapRegistered();

        frameTemplates.forEach((template, index) => {
            const node = storyNodes[index];
            if (!node) return;

            const animation = createScrollAnimation(
                node,
                {
                    trigger: node,
                    scrub: true,
                    start: 'top 80%',
                    end: 'bottom 55%'
                },
                (timeline) => {
                    timeline.fromTo(
                        node,
                        { opacity: 0.2, y: 48 },
                        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
                    );
                }
            );

            const trigger = ScrollTrigger.create({
                trigger: node,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => activeFramework.set(template.framework),
                onEnterBack: () => activeFramework.set(template.framework)
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
                <ChartShowcase labels={chartLabels} datasets={chartDatasets} ariaLabel="Proyección global con Chart.js" />
            </div>
            <div class:active={$activeFramework === 'd3'} class="sandbox__frame" aria-hidden={$activeFramework !== 'd3'}>
                <ResponsiveD3Chart points={d3Points} ariaLabel="Detalle anual con D3" />
            </div>
        </div>
        <p class="sandbox__hint">
            Ajusta los parámetros y sigue desplazándote: las visualizaciones reaccionan al instante.
        </p>
        <div class="sandbox__metrics" role="list">
            {#each metrics as metric}
                <div role="listitem" class="metric">
                    <span class="metric__label">{metric.label}</span>
                    <span class="metric__value">{metric.value}</span>
                </div>
            {/each}
        </div>
    </div>

    <div class="sandbox__controls" aria-label="Laboratorio de parámetros">
        <div class="sandbox__presets">
            <h3>Presets narrativos</h3>
            <div class="preset-buttons" role="group" aria-label="Escenarios sugeridos">
                {#each presets as preset}
                    <button
                        type="button"
                        class:active={selectedPresetId === preset.id}
                        on:click={() => applyPreset(preset.id)}
                    >
                        {preset.name}
                    </button>
                {/each}
            </div>
            <p class="preset-description">{presetDescription}</p>
        </div>

        <div class="control-grid">
            {#each controlConfigs as control}
                <div class="control" data-key={control.key}>
                    <div class="control__header">
                        <label for={`control-${control.key}`}>{control.label}</label>
                        <button
                            type="button"
                            class="control__info"
                            aria-describedby={`definition-${control.key}`}
                            on:focus={() => showTooltip(control.key)}
                            on:blur={() => hideTooltip(control.key)}
                            on:mouseenter={() => showTooltip(control.key)}
                            on:mouseleave={() => hideTooltip(control.key)}
                        >
                            i
                        </button>
                        <span
                            id={`definition-${control.key}`}
                            class:visible={activeTooltip === control.key}
                            role="tooltip"
                        >
                            {parameterDefinitions[control.key]}
                        </span>
                        <output>
                            {control.key === 'frequency'
                                ? frequencyOptions.find((option) => option.value === params.frequency)?.label
                                : control.key === 'rate'
                                ? `${params.rate.toFixed(1)}%`
                                : control.key === 'years'
                                ? `${params.years} años`
                                : formatCurrency(params[control.key])}
                        </output>
                    </div>
                    {#if control.type === 'select'}
                        <select
                            id={`control-${control.key}`}
                            on:change={(event) =>
                                updateParam(control.key, Number((event.target as HTMLSelectElement).value))}
                            value={params.frequency}
                        >
                            {#each frequencyOptions as option}
                                <option value={option.value}>{option.label}</option>
                            {/each}
                        </select>
                        <p class="control__helper">
                            {frequencyOptions.find((option) => option.value === params.frequency)?.description}
                        </p>
                    {:else}
                        <input
                            id={`control-${control.key}`}
                            type="range"
                            min={control.min}
                            max={control.max}
                            step={control.step}
                            value={params[control.key]}
                            on:input={(event) =>
                                updateParam(control.key, Number((event.target as HTMLInputElement).value))}
                        />
                    {/if}
                </div>
            {/each}
        </div>

        <div class="sandbox__stories">
            {#each narrativeFrames as frame, index}
                <article class="story" use:registerStory={index}>
                    <h3>{frame.title}</h3>
                    <p>{frame.body}</p>
                </article>
            {/each}
        </div>
    </div>
</div>

<style>
    .sandbox {
        display: grid;
        gap: clamp(2rem, 6vw, 3.5rem);
    }

    .sandbox__display {
        position: relative;
        padding: var(--spacing-md);
        background: rgba(15, 23, 42, 0.55);
        border-radius: 24px;
        border: 1px solid rgba(148, 163, 184, 0.25);
        display: grid;
        gap: var(--spacing-sm);
    }

    .sandbox__stage {
        position: relative;
        overflow: hidden;
        min-height: clamp(320px, 45vh, 460px);
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

    .sandbox__hint {
        font-size: 0.9rem;
        color: rgba(226, 232, 240, 0.8);
    }

    .sandbox__metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 0.75rem;
    }

    .metric {
        background: rgba(15, 23, 42, 0.8);
        border-radius: 16px;
        padding: 0.75rem 1rem;
        display: grid;
        gap: 0.35rem;
        border: 1px solid rgba(125, 211, 252, 0.2);
    }

    .metric__label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: rgba(226, 232, 240, 0.65);
    }

    .metric__value {
        font-size: 1.1rem;
        font-weight: 600;
    }

    .sandbox__controls {
        display: grid;
        gap: clamp(1.5rem, 4vw, 2.5rem);
    }

    .sandbox__presets h3 {
        margin-bottom: 0.5rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-size: 0.85rem;
    }

    .preset-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .preset-buttons button {
        border-radius: 999px;
        border: 1px solid rgba(125, 211, 252, 0.4);
        background: rgba(15, 23, 42, 0.65);
        padding: 0.55rem 1.1rem;
        color: rgba(226, 232, 240, 0.9);
        transition: border-color 160ms ease, transform 160ms ease;
    }

    .preset-buttons button:hover,
    .preset-buttons button:focus-visible,
    .preset-buttons button.active {
        border-color: rgba(249, 115, 22, 0.6);
        transform: translateY(-1px);
        color: #f8fafc;
    }

    .preset-description {
        font-size: 0.95rem;
        color: rgba(226, 232, 240, 0.82);
        margin-top: 0.5rem;
    }

    .control-grid {
        display: grid;
        gap: 1.25rem;
    }

    .control {
        background: rgba(15, 23, 42, 0.7);
        border-radius: 20px;
        border: 1px solid rgba(148, 163, 184, 0.25);
        padding: 1rem 1.25rem;
        position: relative;
    }

    .control__header {
        display: grid;
        grid-template-columns: auto auto 1fr;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.85rem;
    }

    .control__header label {
        font-weight: 600;
    }

    .control__info {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        border: 1px solid rgba(125, 211, 252, 0.5);
        background: none;
        color: rgba(226, 232, 240, 0.85);
        font-size: 0.9rem;
        display: grid;
        place-items: center;
        transition: border-color 160ms ease, background 160ms ease;
    }

    .control__info:hover,
    .control__info:focus-visible {
        border-color: rgba(249, 115, 22, 0.6);
        background: rgba(15, 23, 42, 0.85);
    }

    .control__header output {
        justify-self: end;
        font-size: 0.9rem;
        color: rgba(226, 232, 240, 0.85);
    }

    .control__header span {
        position: absolute;
        top: calc(100% - 0.5rem);
        left: 1.25rem;
        right: 1.25rem;
        background: rgba(15, 23, 42, 0.92);
        border: 1px solid rgba(148, 163, 184, 0.3);
        border-radius: 12px;
        padding: 0.65rem 0.85rem;
        font-size: 0.85rem;
        opacity: 0;
        transform: translateY(8px);
        pointer-events: none;
        transition: opacity 150ms ease, transform 150ms ease;
    }

    .control__header span.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .control input[type='range'] {
        width: 100%;
    }

    .control select {
        width: 100%;
        padding: 0.6rem 0.75rem;
        border-radius: 12px;
        border: 1px solid rgba(125, 211, 252, 0.35);
        background: rgba(15, 23, 42, 0.85);
        color: rgba(226, 232, 240, 0.9);
    }

    .control__helper {
        margin-top: 0.65rem;
        font-size: 0.85rem;
        color: rgba(148, 163, 184, 0.9);
    }

    .sandbox__stories {
        display: grid;
        gap: clamp(1.5rem, 4vh, 2.5rem);
    }

    .story {
        display: grid;
        gap: 0.75rem;
        padding-inline: clamp(0rem, 4vw, 1.5rem);
    }

    .story h3 {
        font-size: clamp(1.2rem, 2.4vw, 1.6rem);
        font-weight: 600;
    }

    .story p {
        color: rgba(226, 232, 240, 0.9);
        line-height: 1.6;
    }

    @media (min-width: 62rem) {
        .sandbox {
            grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
            align-items: start;
        }

        .sandbox__display {
            position: sticky;
            top: clamp(4rem, 16vh, 7rem);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .sandbox__frame,
        .preset-buttons button,
        .control__info,
        .control__header span,
        .control select {
            transition: none;
        }

        .sandbox__frame {
            transform: none;
        }

        .sandbox__frame.active {
            transform: none;
        }
    }
</style>
