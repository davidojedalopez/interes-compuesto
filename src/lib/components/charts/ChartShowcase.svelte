<script lang="ts">
    import { onMount } from 'svelte';

    type ChartDataset = {
        label: string;
        data: number[];
        borderColor?: string;
        backgroundColor?: string;
        fill?: boolean;
    };

    export let labels: string[] = [];
    export let datasets: ChartDataset[] = [];
    export let ariaLabel = 'Visualización de crecimiento compuesto con Chart.js';

    let canvas: HTMLCanvasElement;
    let chart: import('chart.js/auto').Chart | undefined;

    const defaultColors = [
        {
            borderColor: 'rgba(249, 115, 22, 1)',
            backgroundColor: 'rgba(249, 115, 22, 0.25)'
        },
        {
            borderColor: 'rgba(56, 189, 248, 1)',
            backgroundColor: 'rgba(56, 189, 248, 0.25)'
        }
    ];

    onMount(() => {
        let active = true;

        const loadChart = async () => {
            const { Chart } = await import('chart.js/auto');

            if (!active) return;

            chart = new Chart(canvas, {
                type: 'line',
                data: {
                    labels,
                    datasets: datasets.map((dataset, index) => ({
                        ...defaultColors[index % defaultColors.length],
                        fill: true,
                        tension: 0.35,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: defaultColors[index % defaultColors.length].borderColor,
                        ...dataset
                    }))
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
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
                    interaction: {
                        intersect: false,
                        mode: 'index'
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
            chart?.destroy();
        };
    });

    $: if (chart) {
        chart.data.labels = labels;
        chart.data.datasets = datasets.map((dataset, index) => ({
            ...defaultColors[index % defaultColors.length],
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#fff',
            pointBorderColor: defaultColors[index % defaultColors.length].borderColor,
            ...dataset
        }));
        chart.update('none');
    }
</script>

<div class="chart-shell">
    <canvas bind:this={canvas} aria-label={ariaLabel}></canvas>
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
    }
</style>
