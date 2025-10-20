<script context="module" lang="ts">
    export type ChartPoint = { label: string; total: number; contributions: number };
</script>

<script lang="ts">
    import { onDestroy, onMount } from 'svelte';

    export let points: ChartPoint[] = [];
    export let caption = 'Visualización comparativa de aportes y crecimiento compuesto.';

    let canvas: HTMLCanvasElement;
    let chart: import('chart.js/auto').Chart | undefined;

    function buildDataset(data: ChartPoint[]) {
        return {
            labels: data.map((point) => point.label),
            datasets: [
                {
                    label: 'Valor total con interés compuesto',
                    data: data.map((point) => Math.round(point.total)),
                    tension: 0.32,
                    fill: true,
                    borderColor: 'rgba(249, 115, 22, 1)',
                    backgroundColor: 'rgba(249, 115, 22, 0.22)',
                    pointBackgroundColor: '#fff',
                    pointBorderColor: 'rgba(249, 115, 22, 1)'
                },
                {
                    label: 'Aportaciones acumuladas + capital inicial',
                    data: data.map((point) => Math.round(point.contributions)),
                    tension: 0.32,
                    fill: true,
                    borderColor: 'rgba(56, 189, 248, 1)',
                    backgroundColor: 'rgba(56, 189, 248, 0.18)',
                    borderDash: [6, 6],
                    pointBackgroundColor: '#0f172a',
                    pointBorderColor: 'rgba(56, 189, 248, 1)'
                }
            ]
        };
    }

    function updateChart(data: ChartPoint[]) {
        if (!chart) return;
        const dataset = buildDataset(data);
        chart.data.labels = dataset.labels;
        chart.data.datasets = dataset.datasets as unknown as typeof chart.data.datasets;
        chart.update('none');
    }

    onMount(() => {
        let active = true;

        const loadChart = async () => {
            const { Chart } = await import('chart.js/auto');

            if (!active) return;

            chart = new Chart(canvas, {
                type: 'line',
                data: buildDataset(points),
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#f8fafc',
                                font: {
                                    family: 'Inter, sans-serif'
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#cbd5f5'
                            },
                            grid: {
                                color: 'rgba(148, 163, 184, 0.15)'
                            }
                        },
                        y: {
                            ticks: {
                                color: '#cbd5f5'
                            },
                            grid: {
                                color: 'rgba(148, 163, 184, 0.1)'
                            }
                        }
                    }
                }
            });
        };

        loadChart();

        return () => {
            active = false;
        };
    });

    $: if (chart) {
        updateChart(points);
    }

    onDestroy(() => {
        chart?.destroy();
    });
</script>

<div class="chart-shell">
    <canvas bind:this={canvas} aria-label="Curva generada con Chart.js"></canvas>
    <p class="chart-shell__caption">{caption}</p>
</div>

<style>
    .chart-shell {
        position: relative;
        width: 100%;
        min-height: 320px;
        background: rgba(15, 23, 42, 0.55);
        border-radius: 24px;
        border: 1px solid rgba(148, 163, 184, 0.2);
        padding: var(--spacing-md);
        display: grid;
        gap: 0.5rem;
    }

    .chart-shell__caption {
        font-size: 0.85rem;
        color: rgba(148, 163, 184, 0.85);
    }
</style>
