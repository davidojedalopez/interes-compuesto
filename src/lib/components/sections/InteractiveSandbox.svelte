<script lang="ts">
    import { derived, writable, type Readable } from 'svelte/store';
    import ChartShowcase from '../charts/ChartShowcase.svelte';
    import ResponsiveD3Chart from '../charts/ResponsiveD3Chart.svelte';
    import type { ChartDatasetConfig, D3Series } from '../charts/types';

    const selectedFramework = writable<'chartjs' | 'd3'>('chartjs');
    const selectedMode = writable<'comparison' | 'contributions'>('comparison');

    const compoundingOptions = [
        { label: 'Anual', value: 1 },
        { label: 'Semestral', value: 2 },
        { label: 'Trimestral', value: 4 },
        { label: 'Mensual', value: 12 }
    ];

    const formatCurrency = (value: number) =>
        value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

    type ComparisonSummary = {
        ratio: number;
        finalSimple: number;
        finalCompound: number;
    };

    type ContributionSummary = {
        saved: number;
        interestEarned: number;
        finalBalance: number;
    };

    type ComparisonView = {
        labels: string[];
        chartDatasets: ChartDatasetConfig[];
        d3Series: D3Series[];
        summary: ComparisonSummary;
        mode: 'comparison';
    };

    type ContributionsView = {
        labels: string[];
        chartDatasets: ChartDatasetConfig[];
        d3Series: D3Series[];
        summary: ContributionSummary;
        mode: 'contributions';
    };

    type SandboxView = ComparisonView | ContributionsView;

    const principal = writable(25000);
    const annualRate = writable(8);
    const years = writable(20);
    const compounding = writable(12);
    const monthlyContribution = writable(1500);
    const annualBonus = writable(6000);

    const comparisonData: Readable<ComparisonView> = derived(
        [principal, annualRate, years, compounding],
        ([$principal, $rate, $years, $comp]) => {
            const labels = Array.from({ length: $years + 1 }, (_, index) => `Año ${index}`);
            const simple: number[] = [];
            const compound: number[] = [];

            for (let year = 0; year <= $years; year += 1) {
            simple.push($principal * (1 + ($rate / 100) * year));

            const growth = Math.pow(1 + $rate / 100 / $comp, $comp * year);
            compound.push($principal * growth);
        }

        const ratio = compound[compound.length - 1] / ($principal || 1);

        const chartDatasets: ChartDatasetConfig[] = [
            {
                label: 'Interés compuesto',
                data: compound,
                stroke: 'rgba(249, 115, 22, 1)',
                fillColor: 'rgba(249, 115, 22, 0.12)'
            },
            {
                label: 'Interés simple',
                data: simple,
                stroke: 'rgba(56, 189, 248, 1)',
                dashed: true
            }
        ];

        const d3Series: D3Series[] = chartDatasets.map((dataset) => ({
            label: dataset.label,
            values: dataset.data,
            stroke: dataset.stroke,
            fillColor: dataset.fillColor,
            dashed: dataset.dashed
        }));

            return {
                labels,
                chartDatasets,
                d3Series,
                summary: {
                    ratio,
                    finalSimple: simple.at(-1) ?? 0,
                    finalCompound: compound.at(-1) ?? 0
                },
                mode: 'comparison'
            } satisfies ComparisonView;
        }
    );

    const contributionsData: Readable<ContributionsView> = derived(
        [principal, annualRate, years, monthlyContribution, annualBonus],
        ([$principal, $rate, $years, $monthlyContribution, $annualBonus]) => {
            const labels = Array.from({ length: $years + 1 }, (_, index) => `Año ${index}`);
            const contributions: number[] = [];
            const balances: number[] = [];

            let balance = $principal;
            let saved = $principal;
            let interestEarned = 0;
            const monthlyRate = Math.pow(1 + $rate / 100, 1 / 12) - 1;

            for (let month = 0; month <= $years * 12; month += 1) {
                if (month === 0) {
                    contributions.push(saved);
                    balances.push(balance);
                    continue;
                }

                balance += $monthlyContribution;
                saved += $monthlyContribution;

                if (month % 12 === 1) {
                    balance += $annualBonus;
                    saved += $annualBonus;
                }

                const beforeInterest = balance;
                balance *= 1 + monthlyRate;
                interestEarned += balance - beforeInterest;

                if (month % 12 === 0) {
                    const yearIndex = month / 12;
                    contributions[yearIndex] = saved;
                    balances[yearIndex] = balance;
                }
            }

            const chartDatasets: ChartDatasetConfig[] = [
                {
                    label: 'Saldo total',
                    data: balances,
                    stroke: 'rgba(249, 115, 22, 1)',
                    fillColor: 'rgba(249, 115, 22, 0.12)'
                },
                {
                    label: 'Aportaciones propias',
                    data: contributions,
                    stroke: 'rgba(96, 165, 250, 1)',
                    dashed: true
                }
            ];

            const d3Series: D3Series[] = chartDatasets.map((dataset) => ({
                label: dataset.label,
                values: dataset.data,
                stroke: dataset.stroke,
                fillColor: dataset.fillColor,
                dashed: dataset.dashed
            }));

            return {
                labels,
                chartDatasets,
                d3Series,
                summary: {
                    saved,
                    interestEarned,
                    finalBalance: balances.at(-1) ?? 0
                },
                mode: 'contributions'
            } satisfies ContributionsView;
        }
    );

    const sandboxView: Readable<SandboxView> = derived(
        [selectedMode, comparisonData, contributionsData],
        ([$mode, comparison, contributions]) => ($mode === 'comparison' ? comparison : contributions)
    );
</script>

<div class="sandbox" id="visualizaciones">
    <div class="sandbox__controls">
        <div class="sandbox__header">
            <div>
                <p class="eyebrow">Laboratorio financiero</p>
                <h3>Experimenta con tu ritmo de crecimiento</h3>
            </div>
            <div class="framework-toggle" role="group" aria-label="Selecciona motor de visualización">
                <button
                    type="button"
                    class:active={$selectedFramework === 'chartjs'}
                    on:click={() => selectedFramework.set('chartjs')}
                >
                    Chart.js
                </button>
                <button type="button" class:active={$selectedFramework === 'd3'} on:click={() => selectedFramework.set('d3')}>
                    D3.js
                </button>
            </div>
        </div>

        <div class="mode-toggle" role="tablist" aria-label="Escenarios disponibles">
            <button
                type="button"
                role="tab"
                aria-selected={$selectedMode === 'comparison'}
                class:active={$selectedMode === 'comparison'}
                on:click={() => selectedMode.set('comparison')}
            >
                Carrera simple vs. compuesta
            </button>
            <button
                type="button"
                role="tab"
                aria-selected={$selectedMode === 'contributions'}
                class:active={$selectedMode === 'contributions'}
                on:click={() => selectedMode.set('contributions')}
            >
                Laboratorio de aportaciones
            </button>
        </div>

        {#if $sandboxView.mode === 'comparison'}
            <p>
                Ajusta la tasa y los años para ver cómo el interés compuesto acelera el recorrido frente a su versión
                lineal. La Border Collie no corre más rápido: simplemente aprovecha cada vuelta para multiplicar lo ya
                ganado.
            </p>
        {:else}
            <p>
                Combina aportaciones mensuales y bonificaciones anuales para descubrir qué parte del saldo final proviene
                de tu constancia y cuál es producto del interés que trabaja por su cuenta.
            </p>
        {/if}

        <div class="controls-grid">
            <label>
                Depósito inicial
                <input type="range" min="5000" max="120000" step="5000" bind:value={$principal} />
                <span>{formatCurrency($principal)}</span>
            </label>

            <label>
                Tasa anual
                <input type="range" min="2" max="18" step="0.5" bind:value={$annualRate} />
                <span>{$annualRate.toFixed(1)}%</span>
            </label>

            <label>
                Años en juego
                <input type="range" min="5" max="35" step="1" bind:value={$years} />
                <span>{$years}</span>
            </label>

            {#if $sandboxView.mode === 'comparison'}
                <label>
                    Frecuencia de capitalización
                    <select bind:value={$compounding}>
                        {#each compoundingOptions as option}
                            <option value={option.value}>{option.label}</option>
                        {/each}
                    </select>
                </label>
            {/if}

            {#if $sandboxView.mode === 'contributions'}
                <label>
                    Aportación mensual
                    <input type="range" min="0" max="8000" step="250" bind:value={$monthlyContribution} />
                    <span>{formatCurrency($monthlyContribution)}</span>
                </label>

                <label>
                    Bono anual
                    <input type="range" min="0" max="20000" step="1000" bind:value={$annualBonus} />
                    <span>{formatCurrency($annualBonus)}</span>
                </label>
            {/if}
        </div>
    </div>

    <div class="sandbox__display">
        {#if $selectedFramework === 'chartjs'}
            <ChartShowcase
                valueFormatter={formatCurrency}
                labels={$sandboxView.labels}
                datasets={$sandboxView.chartDatasets}
                yAxisLabel={
                    $sandboxView.mode === 'comparison'
                        ? 'Saldo por año (interés simple vs. compuesto)'
                        : 'Saldo por año con aportaciones'
                }
            />
        {:else}
            <ResponsiveD3Chart
                valueFormatter={formatCurrency}
                labels={$sandboxView.labels}
                series={$sandboxView.d3Series}
                yAxisLabel={
                    $sandboxView.mode === 'comparison'
                        ? 'Saldo por año (interés simple vs. compuesto)'
                        : 'Saldo por año con aportaciones'
                }
            />
        {/if}

        <div class="summary">
            {#if $sandboxView.mode === 'comparison'}
                {#key $sandboxView.summary.finalCompound}
                <p>
                    Tras {$years} años, el interés compuesto alcanza
                    <strong>{formatCurrency($sandboxView.summary.finalCompound)}</strong>,
                    {#if $sandboxView.summary.finalSimple > 0}
                        {formatCurrency($sandboxView.summary.finalCompound - $sandboxView.summary.finalSimple)} más que la versión
                        simple.
                    {/if}
                </p>
                <p>
                    Esto equivale a multiplicar el depósito inicial {Math.max(1, $sandboxView.summary.ratio).toFixed(2)} veces. Cada
                    capitalización alimenta la siguiente, igual que una carrera de relevos donde nadie deja caer la estafeta.
                </p>
                {/key}
            {:else}
                <p>
                    Con disciplina, acumulas <strong>{formatCurrency($sandboxView.summary.saved)}</strong> de tu propio bolsillo y el
                    interés agrega <strong>{formatCurrency($sandboxView.summary.interestEarned)}</strong> extra.
                </p>
                <p>
                    El saldo final asciende a <strong>{formatCurrency($sandboxView.summary.finalBalance)}</strong>. Automatizar aportes
                    convierte al interés compuesto en tu compañero más obediente.
                </p>
            {/if}
        </div>
    </div>
</div>

<style>
    .sandbox {
        display: grid;
        grid-template-columns: minmax(0, 420px) minmax(0, 1fr);
        gap: var(--spacing-lg);
        align-items: start;
    }

    .sandbox__controls {
        display: grid;
        gap: var(--spacing-md);
        background: rgba(15, 23, 42, 0.55);
        border-radius: 24px;
        border: 1px solid rgba(148, 163, 184, 0.24);
        padding: var(--spacing-lg);
    }

    .sandbox__header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: var(--spacing-sm);
        align-items: center;
    }

    .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.24em;
        font-size: 0.75rem;
        color: rgba(148, 163, 184, 0.95);
        margin-bottom: 0.25rem;
    }

    .framework-toggle {
        display: flex;
        gap: 0.5rem;
    }

    .framework-toggle button,
    .mode-toggle button {
        background: rgba(15, 23, 42, 0.85);
        border: 1px solid rgba(148, 163, 184, 0.3);
        color: var(--color-text-primary);
        padding: 0.55rem 1.35rem;
        border-radius: 999px;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.7rem;
        transition: border-color 150ms ease, transform 150ms ease, background 150ms ease;
    }

    .framework-toggle button.active,
    .mode-toggle button.active {
        border-color: rgba(249, 115, 22, 0.75);
        transform: translateY(-2px);
        background: linear-gradient(120deg, rgba(249, 115, 22, 0.2), rgba(249, 115, 22, 0.05));
    }

    .mode-toggle {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
    }

    .mode-toggle button {
        border-radius: 18px;
        text-transform: none;
        letter-spacing: normal;
        font-size: 0.85rem;
        font-weight: 600;
        padding: 0.85rem 1rem;
    }

    .controls-grid {
        display: grid;
        gap: var(--spacing-sm);
    }

    label {
        display: grid;
        gap: 0.35rem;
        font-size: 0.9rem;
        color: var(--color-text-muted);
    }

    label span {
        font-weight: 600;
        color: var(--color-text-primary);
    }

    input[type='range'] {
        width: 100%;
    }

    select {
        background: rgba(15, 23, 42, 0.85);
        border: 1px solid rgba(148, 163, 184, 0.35);
        color: var(--color-text-primary);
        padding: 0.6rem 0.75rem;
        border-radius: 12px;
    }

    .sandbox__display {
        display: grid;
        gap: var(--spacing-md);
    }

    .summary {
        background: rgba(15, 23, 42, 0.55);
        border-radius: 20px;
        border: 1px solid rgba(148, 163, 184, 0.24);
        padding: var(--spacing-md);
        display: grid;
        gap: var(--spacing-sm);
        font-size: 0.95rem;
    }

    .summary strong {
        color: var(--color-accent);
        font-weight: 700;
    }

    @media (max-width: 1080px) {
        .sandbox {
            grid-template-columns: 1fr;
        }

        .sandbox__header {
            flex-direction: column;
            align-items: stretch;
        }

        .framework-toggle {
            justify-content: space-between;
        }
    }
</style>
