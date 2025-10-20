<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import type { ChartDatasetConfig } from './types';

    export let labels: string[] = [];
    export let datasets: ChartDatasetConfig[] = [];
    export let valueFormatter: (value: number) => string = (value) =>
        value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
    export let yAxisLabel = 'Saldo acumulado';

    let canvas: HTMLCanvasElement;
    let chart: import('chart.js/auto').Chart | undefined;

    const toChartDataset = (dataset: ChartDatasetConfig) => ({
        label: dataset.label,
        data: dataset.data,
        tension: 0.35,
        borderWidth: 3,
        borderColor: dataset.stroke,
        backgroundColor: dataset.fillColor ?? 'rgba(0,0,0,0)',
        fill: Boolean(dataset.fillColor),
        borderDash: dataset.dashed ? [8, 6] : undefined,
        pointRadius: 0,
        pointHitRadius: 12,
        pointHoverRadius: 5
    });

    const getTooltipLabel = (context: any) => {
        const label = context.dataset.label ?? '';
        const value = typeof context.parsed.y === 'number' ? valueFormatter(context.parsed.y) : context.parsed.y;
        return `${label}: ${value}`;
    };

    const getTickLabel = (value: string | number) => {
        const numericValue = typeof value === 'number' ? value : Number(value);
        return Number.isFinite(numericValue) ? valueFormatter(numericValue) : `${value}`;
    };

    onMount(async () => {
        let active = true;
        const { Chart } = await import('chart.js/auto');

        if (!active) return;

        chart = new Chart(canvas, {
            type: 'line',
            data: {
                labels,
                datasets: datasets.map(toChartDataset)
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#f8fafc',
                            font: {
                                family: 'Inter, sans-serif',
                                weight: 600
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: getTooltipLabel
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#cbd5f5',
                            font: {
                                family: 'Inter, sans-serif'
                            }
                        },
                        grid: {
                            color: 'rgba(148, 163, 184, 0.15)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: yAxisLabel,
                            color: '#94a3b8',
                            font: {
                                family: 'Inter, sans-serif'
                            }
                        },
                        ticks: {
                            color: '#cbd5f5',
                            callback: getTickLabel
                        },
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)'
                        }
                    }
                }
            }
        });

        onDestroy(() => {
            active = false;
            chart?.destroy();
        });
    });

    $: if (chart) {
        chart.data.labels = labels;
        chart.data.datasets = datasets.map(toChartDataset);
        if (chart.options.scales?.y?.ticks) {
            chart.options.scales.y.ticks.callback = getTickLabel;
        }
        if (chart.options.plugins?.tooltip?.callbacks) {
            chart.options.plugins.tooltip.callbacks.label = getTooltipLabel;
        }
        chart.update('none');
    }
</script>

<div class="chart-shell">
    <canvas bind:this={canvas} aria-label="Comparativa visual usando Chart.js"></canvas>
</div>

<style>
    .chart-shell {
        position: relative;
        width: 100%;
        min-height: 360px;
        background: rgba(15, 23, 42, 0.6);
        border-radius: 24px;
        border: 1px solid rgba(148, 163, 184, 0.24);
        padding: var(--spacing-md);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }
</style>
