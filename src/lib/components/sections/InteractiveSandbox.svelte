<script lang="ts">
    import { writable } from 'svelte/store';
    import ChartShowcase from '../charts/ChartShowcase.svelte';
    import ResponsiveD3Chart from '../charts/ResponsiveD3Chart.svelte';
    import {
        generateGrowthSeries,
        simulateContributionGrowth,
        simulateStartTiming
    } from '@utils/compound';

    type Mode = 'comparison' | 'contributions' | 'timing';

    const selectedFramework = writable<'chartjs' | 'd3'>('chartjs');
    const modeLabels: Record<Mode, { title: string; description: string }> = {
        comparison: {
            title: 'Carrera simple vs. compuesta',
            description:
                'Compara una línea que solo paga intereses sobre el principal versus otra que capitaliza cada periodo.'
        },
        contributions: {
            title: 'Laboratorio de aportaciones',
            description:
                'Mezcla depósito inicial, aportaciones mensuales y bonos anuales para ver qué parte del total proviene de tu constancia.'
        },
        timing: {
            title: 'Temprano vs. tardío',
            description:
                'Mueve el retraso del segundo inversionista y observa cómo el tiempo extra multiplica el resultado final.'
        }
    };

    let mode: Mode = 'comparison';

    let comparisonPrincipal = 12000;
    let comparisonRate = 0.08;
    let comparisonYears = 20;
    let comparisonFrequency = 12;

    let contributionInitial = 3000;
    let contributionMonthly = 1500;
    let contributionBonus = 8000;
    let contributionRate = 0.09;
    let contributionYears = 15;

    let timingMonthly = 1800;
    let timingYearsInvesting = 10;
    let timingDelay = 5;
    let timingRate = 0.08;
    let timingHorizon = 25;

    let comparisonPoints = generateGrowthSeries({
        principal: comparisonPrincipal,
        rate: comparisonRate,
        years: comparisonYears,
        frequency: comparisonFrequency
    });

    let contributionPoints = simulateContributionGrowth({
        initial: contributionInitial,
        monthly: contributionMonthly,
        annualBonus: contributionBonus,
        rate: contributionRate,
        years: contributionYears
    });

    let timingPoints = simulateStartTiming({
        monthly: timingMonthly,
        yearsInvesting: timingYearsInvesting,
        delayYears: timingDelay,
        rate: timingRate,
        horizonYears: timingHorizon
    });

    $: comparisonPoints = generateGrowthSeries({
        principal: comparisonPrincipal,
        rate: comparisonRate,
        years: comparisonYears,
        frequency: comparisonFrequency
    });

    $: contributionPoints = simulateContributionGrowth({
        initial: contributionInitial,
        monthly: contributionMonthly,
        annualBonus: contributionBonus,
        rate: contributionRate,
        years: contributionYears
    });

    $: timingPoints = simulateStartTiming({
        monthly: timingMonthly,
        yearsInvesting: timingYearsInvesting,
        delayYears: timingDelay,
        rate: timingRate,
        horizonYears: timingHorizon
    });

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: value >= 100000 ? 0 : 2
        }).format(value);

    const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

    $: comparisonSummary = (() => {
        if (!comparisonPoints.length) return null;
        const last = comparisonPoints[comparisonPoints.length - 1];
        const gap = last.compound - last.simple;
        return {
            simple: formatCurrency(last.simple),
            compound: formatCurrency(last.compound),
            gap: formatCurrency(gap)
        };
    })();

    $: contributionSummary = (() => {
        if (!contributionPoints.length) return null;
        const last = contributionPoints[contributionPoints.length - 1];
        const totalDeposits = formatCurrency(last.contributions);
        const interest = formatCurrency(last.interest);
        const total = formatCurrency(last.total);
        return { totalDeposits, interest, total };
    })();

    $: timingSummary = (() => {
        if (!timingPoints.length) return null;
        const last = timingPoints[timingPoints.length - 1];
        const gap = last.early - last.late;
        return {
            early: formatCurrency(last.early),
            late: formatCurrency(last.late),
            gap: formatCurrency(gap)
        };
    })();
</script>

<div class="sandbox" id="visualizaciones">
    <div class="sandbox__controls">
        <div class="sandbox__header">
            <h3>Zona interactiva</h3>
            <p>Explora distintos escenarios ajustando las perillas.</p>
        </div>

        <div class="sandbox__framework">
            <span>Motor gráfico</span>
            <div class="toggle-group">
                <button
                    type="button"
                    class:active={$selectedFramework === 'chartjs'}
                    on:click={() => selectedFramework.set('chartjs')}
                >
                    Chart.js
                </button>
                <button
                    type="button"
                    class:active={$selectedFramework === 'd3'}
                    on:click={() => selectedFramework.set('d3')}
                >
                    D3.js
                </button>
            </div>
        </div>

        <div class="sandbox__modes">
            {#each Object.entries(modeLabels) as [key, value]}
                <button type="button" class:active={mode === key} on:click={() => (mode = key as Mode)}>
                    {value.title}
                </button>
            {/each}
        </div>

        <p class="sandbox__description">{modeLabels[mode].description}</p>

        <div class="sandbox__form">
            {#if mode === 'comparison'}
                <label>
                    Principal inicial
                    <input
                        type="range"
                        min="2000"
                        max="50000"
                        step="1000"
                        bind:value={comparisonPrincipal}
                    />
                    <span>{formatCurrency(comparisonPrincipal)}</span>
                </label>
                <label>
                    Tasa anual
                    <input
                        type="range"
                        min="0.02"
                        max="0.15"
                        step="0.005"
                        bind:value={comparisonRate}
                    />
                    <span>{formatPercent(comparisonRate)}</span>
                </label>
                <label>
                    Años en pista
                    <input type="range" min="5" max="30" step="1" bind:value={comparisonYears} />
                    <span>{comparisonYears}</span>
                </label>
                <label>
                    Capitalizaciones por año
                    <input type="range" min="1" max="12" step="1" bind:value={comparisonFrequency} />
                    <span>{comparisonFrequency}</span>
                </label>
                {#if comparisonSummary}
                    <div class="sandbox__summary">
                        <p>Interés simple: <strong>{comparisonSummary.simple}</strong></p>
                        <p>Interés compuesto: <strong>{comparisonSummary.compound}</strong></p>
                        <p>Diferencia: <strong>{comparisonSummary.gap}</strong></p>
                    </div>
                {/if}
            {:else if mode === 'contributions'}
                <label>
                    Depósito inicial
                    <input
                        type="range"
                        min="0"
                        max="20000"
                        step="500"
                        bind:value={contributionInitial}
                    />
                    <span>{formatCurrency(contributionInitial)}</span>
                </label>
                <label>
                    Aportación mensual
                    <input
                        type="range"
                        min="500"
                        max="4000"
                        step="100"
                        bind:value={contributionMonthly}
                    />
                    <span>{formatCurrency(contributionMonthly)}</span>
                </label>
                <label>
                    Bono anual
                    <input
                        type="range"
                        min="0"
                        max="20000"
                        step="500"
                        bind:value={contributionBonus}
                    />
                    <span>{formatCurrency(contributionBonus)}</span>
                </label>
                <label>
                    Tasa anual
                    <input
                        type="range"
                        min="0.03"
                        max="0.15"
                        step="0.005"
                        bind:value={contributionRate}
                    />
                    <span>{formatPercent(contributionRate)}</span>
                </label>
                <label>
                    Años de ahorro
                    <input
                        type="range"
                        min="5"
                        max="30"
                        step="1"
                        bind:value={contributionYears}
                    />
                    <span>{contributionYears}</span>
                </label>
                {#if contributionSummary}
                    <div class="sandbox__summary">
                        <p>Aportaciones: <strong>{contributionSummary.totalDeposits}</strong></p>
                        <p>Intereses: <strong>{contributionSummary.interest}</strong></p>
                        <p>Saldo proyectado: <strong>{contributionSummary.total}</strong></p>
                    </div>
                {/if}
            {:else}
                <label>
                    Aportación mensual
                    <input type="range" min="500" max="4000" step="100" bind:value={timingMonthly} />
                    <span>{formatCurrency(timingMonthly)}</span>
                </label>
                <label>
                    Años aportando
                    <input
                        type="range"
                        min="5"
                        max="20"
                        step="1"
                        bind:value={timingYearsInvesting}
                    />
                    <span>{timingYearsInvesting}</span>
                </label>
                <label>
                    Retraso del segundo inversionista
                    <input type="range" min="0" max="15" step="1" bind:value={timingDelay} />
                    <span>{timingDelay} años</span>
                </label>
                <label>
                    Horizonte total
                    <input type="range" min="10" max="40" step="1" bind:value={timingHorizon} />
                    <span>{timingHorizon} años</span>
                </label>
                <label>
                    Tasa anual
                    <input type="range" min="0.03" max="0.15" step="0.005" bind:value={timingRate} />
                    <span>{formatPercent(timingRate)}</span>
                </label>
                {#if timingSummary}
                    <div class="sandbox__summary">
                        <p>Inversión temprana: <strong>{timingSummary.early}</strong></p>
                        <p>Inicio tardío: <strong>{timingSummary.late}</strong></p>
                        <p>Ventaja acumulada: <strong>{timingSummary.gap}</strong></p>
                    </div>
                {/if}
            {/if}
        </div>
    </div>

    <div class="sandbox__display">
        {#if $selectedFramework === 'chartjs'}
            <ChartShowcase
                mode={mode}
                comparisonData={comparisonPoints}
                contributionsData={contributionPoints}
                timingData={timingPoints}
            />
        {:else}
            <ResponsiveD3Chart
                mode={mode}
                comparisonData={comparisonPoints}
                contributionsData={contributionPoints}
                timingData={timingPoints}
            />
        {/if}
    </div>
</div>

<style>
    .sandbox {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--spacing-lg);
        align-items: start;
    }

    .sandbox__controls {
        display: grid;
        gap: var(--spacing-md);
        background: rgba(15, 23, 42, 0.55);
        border-radius: 24px;
        border: 1px solid rgba(148, 163, 184, 0.2);
        padding: var(--spacing-md);
    }

    .sandbox__header h3 {
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.24em;
    }

    .sandbox__header p {
        margin: 0;
        color: var(--color-text-muted);
    }

    .sandbox__framework {
        display: grid;
        gap: 0.5rem;
        align-items: start;
    }

    .sandbox__framework span {
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.85rem;
        color: var(--color-text-muted);
    }

    .toggle-group {
        display: inline-flex;
        gap: 0.75rem;
        flex-wrap: wrap;
    }

    button {
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.3);
        color: var(--color-text-primary);
        padding: 0.7rem 1.5rem;
        border-radius: 999px;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        transition: border-color 150ms ease, transform 150ms ease;
    }

    button.active {
        border-color: rgba(249, 115, 22, 0.75);
        transform: translateY(-2px);
        background: linear-gradient(120deg, rgba(249, 115, 22, 0.2), rgba(249, 115, 22, 0.05));
    }

    .sandbox__modes {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    .sandbox__description {
        color: var(--color-text-muted);
        margin: 0;
        line-height: 1.5;
    }

    .sandbox__form {
        display: grid;
        gap: 1rem;
    }

    label {
        display: grid;
        gap: 0.35rem;
        font-size: 0.9rem;
    }

    label span {
        font-weight: 600;
        color: var(--color-text-primary);
    }

    input[type='range'] {
        width: 100%;
    }

    .sandbox__summary {
        display: grid;
        gap: 0.4rem;
        background: rgba(15, 23, 42, 0.65);
        border-radius: 18px;
        padding: 1rem 1.25rem;
        border: 1px solid rgba(249, 115, 22, 0.25);
        font-size: 0.95rem;
    }

    .sandbox__display {
        min-height: 360px;
    }

    @media (max-width: 1024px) {
        .sandbox {
            grid-template-columns: 1fr;
        }

        .sandbox__display {
            order: -1;
        }
    }
</style>
