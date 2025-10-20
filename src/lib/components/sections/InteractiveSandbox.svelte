<script lang="ts">
    import { writable } from 'svelte/store';
    import ChartShowcase from '../charts/ChartShowcase.svelte';
    import ResponsiveD3Chart from '../charts/ResponsiveD3Chart.svelte';

    const selectedFramework = writable<'chartjs' | 'd3'>('chartjs');
</script>

<div class="sandbox" id="visualizaciones">
    <div class="sandbox__controls">
        <h3>Zona interactiva</h3>
        <p>
            Aquí probaremos ideas de visualizaciones dinámicas. Usa los botones para alternar entre distintos
            motores gráficos.
        </p>
        <div class="toggle-group">
            <button type="button" class:active={$selectedFramework === 'chartjs'} on:click={() => selectedFramework.set('chartjs')}>
                Chart.js
            </button>
            <button type="button" class:active={$selectedFramework === 'd3'} on:click={() => selectedFramework.set('d3')}>
                D3.js
            </button>
        </div>
    </div>
    <div class="sandbox__display">
        {#if $selectedFramework === 'chartjs'}
            <ChartShowcase />
        {:else}
            <ResponsiveD3Chart />
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
        gap: var(--spacing-sm);
        background: rgba(15, 23, 42, 0.5);
        border-radius: 24px;
        border: 1px solid rgba(148, 163, 184, 0.2);
        padding: var(--spacing-md);
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

    .sandbox__display {
        min-height: 340px;
    }

    @media (max-width: 1024px) {
        .sandbox {
            grid-template-columns: 1fr;
        }
    }
</style>
