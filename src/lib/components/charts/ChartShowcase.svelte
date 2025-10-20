<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import type { ContributionPoint, GrowthPoint, TimingPoint } from '@utils/compound';

    export let mode: 'comparison' | 'contributions' | 'timing' = 'comparison';
    export let comparisonData: GrowthPoint[] = [];
    export let contributionsData: ContributionPoint[] = [];
    export let timingData: TimingPoint[] = [];

    let canvas: HTMLCanvasElement;
    let chart: import('chart.js/auto').Chart | undefined;

    function formatCurrency(value: number) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: value >= 100000 ? 0 : 2
        }).format(value);
    }

    function buildConfig(): import('chart.js').ChartConfiguration<'line'> {
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' as const },
            plugins: {
                legend: {
                    labels: {
                        color: '#f8fafc',
                        font: { family: 'Inter, sans-serif' }
                    }
                },
                tooltip: {
                    callbacks: {
                        label(context: any) {
                            const raw = context.parsed.y ?? 0;
                            return `${context.dataset.label}: ${formatCurrency(raw)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#cbd5f5' },
                    grid: { color: 'rgba(148, 163, 184, 0.1)' }
                },
                y: {
                    ticks: {
                        color: '#cbd5f5',
                        callback(value: any) {
                            return formatCurrency(Number(value));
                        }
                    },
                    grid: { color: 'rgba(148, 163, 184, 0.1)' }
                }
            }
        } satisfies import('chart.js').ChartOptions<'line'>;

        if (mode === 'comparison') {
            const labels = comparisonData.map((point) => `Año ${point.year}`);
            return {
                type: 'line',
                data: {
                    labels,
                    datasets: [
                        {
                            label: 'Interés simple',
                            data: comparisonData.map((point) => point.simple),
                            borderColor: 'rgba(148, 163, 184, 0.65)',
                            backgroundColor: 'rgba(148, 163, 184, 0.15)',
                            tension: 0.3,
                            fill: false
                        },
                        {
                            label: 'Interés compuesto',
                            data: comparisonData.map((point) => point.compound),
                            borderColor: 'rgba(249, 115, 22, 1)',
                            backgroundColor: 'rgba(249, 115, 22, 0.25)',
                            tension: 0.35,
                            fill: true
                        }
                    ]
                },
                options: baseOptions
            };
        }

        if (mode === 'contributions') {
            const labels = contributionsData.map((point) => `Año ${point.year}`);
            return {
                type: 'line',
                data: {
                    labels,
                    datasets: [
                        {
                            label: 'Aportaciones acumuladas',
                            data: contributionsData.map((point) => point.contributions),
                            borderColor: 'rgba(56, 189, 248, 1)',
                            backgroundColor: 'rgba(56, 189, 248, 0.2)',
                            tension: 0.3,
                            fill: true
                        },
                        {
                            label: 'Intereses generados',
                            data: contributionsData.map((point) => point.contributions + point.interest),
                            borderColor: 'rgba(249, 115, 22, 1)',
                            backgroundColor: 'rgba(249, 115, 22, 0.15)',
                            tension: 0.3,
                            fill: '-1'
                        }
                    ]
                },
                options: baseOptions
            };
        }

        const labels = timingData.map((point) => `Año ${point.year}`);
        return {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Inversión temprana',
                        data: timingData.map((point) => point.early),
                        borderColor: 'rgba(56, 189, 248, 1)',
                        backgroundColor: 'rgba(56, 189, 248, 0.2)',
                        tension: 0.3,
                        fill: false
                    },
                    {
                        label: 'Inicio tardío',
                        data: timingData.map((point) => point.late),
                        borderColor: 'rgba(248, 113, 113, 1)',
                        backgroundColor: 'rgba(248, 113, 113, 0.2)',
                        tension: 0.3,
                        fill: false
                    }
                ]
            },
            options: baseOptions
        };
    }

    async function renderChart() {
        const { Chart } = await import('chart.js/auto');
        chart?.destroy();
        chart = new Chart(canvas, buildConfig());
    }

    onMount(renderChart);

    onDestroy(() => {
        chart?.destroy();
        chart = undefined;
    });

    $: if (chart) {
        const config = buildConfig();
        chart.config.data = config.data;
        chart.options = config.options ?? chart.options;
        chart.update();
    }
</script>

<div class="chart-shell">
    <canvas bind:this={canvas} aria-label="Visualización de crecimiento con Chart.js"></canvas>
</div>

<style>
    .chart-shell {
        position: relative;
        width: 100%;
        min-height: 360px;
        background: rgba(15, 23, 42, 0.55);
        border-radius: 24px;
        border: 1px solid rgba(148, 163, 184, 0.2);
        padding: var(--spacing-md);
    }
</style>
