<script lang="ts">
    import { onMount } from 'svelte';

    let canvas: HTMLCanvasElement;
    let chart: import('chart.js/auto').Chart | undefined;

    onMount(() => {
        let active = true;

        const loadChart = async () => {
            const { Chart } = await import('chart.js/auto');

            if (!active) return;

            chart = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: ['A', 'B', 'C', 'D', 'E', 'F'],
                    datasets: [
                        {
                            label: 'Datos de ejemplo',
                            data: [0, 2, 3, 4, 6, 9],
                            tension: 0.4,
                            fill: true,
                            borderColor: 'rgba(249, 115, 22, 1)',
                            backgroundColor: 'rgba(249, 115, 22, 0.25)',
                            pointBackgroundColor: '#fff',
                            pointBorderColor: 'rgba(249, 115, 22, 1)'
                        }
                    ]
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
</script>

<div class="chart-shell">
    <canvas bind:this={canvas} aria-label="Visualización base en Chart.js"></canvas>
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
