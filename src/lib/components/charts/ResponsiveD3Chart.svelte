<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import * as d3 from 'd3';
    import type { ChartPoint } from './ChartShowcase.svelte';

    export let points: ChartPoint[] = [];

    let container: HTMLDivElement;
    let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;

    const padding = { top: 32, right: 24, bottom: 48, left: 56 };
    const viewBox = { width: 560, height: 320 };

    function prepareData(data: ChartPoint[]) {
        return data.map((point, index) => ({
            step: index,
            label: point.label,
            total: point.total,
            contributions: point.contributions
        }));
    }

    function render(data: ChartPoint[]) {
        const series = prepareData(data.length ? data : [{ label: '0 años', total: 0, contributions: 0 }]);

        svg?.remove();

        svg = d3
            .select(container)
            .append('svg')
            .attr('viewBox', `0 0 ${viewBox.width} ${viewBox.height}`)
            .attr('role', 'img')
            .attr('aria-label', 'Línea D3 que compara aportes contra crecimiento total año con año.');

        const width = viewBox.width - padding.left - padding.right;
        const height = viewBox.height - padding.top - padding.bottom;

        const x = d3
            .scaleLinear()
            .domain(d3.extent(series, (d) => d.step) as [number, number])
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(series, (d) => Math.max(d.total, d.contributions)) ?? 1])
            .nice()
            .range([height, 0]);

        const group = svg.append('g').attr('transform', `translate(${padding.left},${padding.top})`);

        const area = d3
            .area<typeof series[number]>()
            .x((d) => x(d.step))
            .y0(height)
            .y1((d) => y(d.total))
            .curve(d3.curveCatmullRom.alpha(0.85));

        const totalLine = d3
            .line<typeof series[number]>()
            .x((d) => x(d.step))
            .y((d) => y(d.total))
            .curve(d3.curveCatmullRom.alpha(0.85));

        const contributionsLine = d3
            .line<typeof series[number]>()
            .x((d) => x(d.step))
            .y((d) => y(d.contributions))
            .curve(d3.curveCatmullRom.alpha(0.85));

        group.append('path').datum(series).attr('fill', 'rgba(249, 115, 22, 0.18)').attr('d', area);

        group
            .append('path')
            .datum(series)
            .attr('fill', 'none')
            .attr('stroke', 'rgba(249, 115, 22, 1)')
            .attr('stroke-width', 4)
            .attr('stroke-linecap', 'round')
            .attr('d', totalLine);

        group
            .append('path')
            .datum(series)
            .attr('fill', 'none')
            .attr('stroke', 'rgba(56, 189, 248, 1)')
            .attr('stroke-width', 3)
            .attr('stroke-dasharray', '6 6')
            .attr('stroke-linecap', 'round')
            .attr('d', contributionsLine);

        const xAxis = d3
            .axisBottom(x)
            .ticks(Math.min(series.length, 8))
            .tickFormat((value) => series[Number(value)]?.label ?? String(value))
            .tickSizeOuter(0);

        const yAxis = d3.axisLeft(y).ticks(5).tickSizeOuter(0);

        group
            .append('g')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis)
            .selectAll('text')
            .attr('fill', '#cbd5f5')
            .attr('font-size', '12px');

        group
            .append('g')
            .call(yAxis)
            .selectAll('text')
            .attr('fill', '#cbd5f5')
            .attr('font-size', '12px');

        svg.selectAll('path.domain, line').attr('stroke', 'rgba(148, 163, 184, 0.25)');
    }

    onMount(() => {
        render(points);
    });

    $: if (container) {
        render(points);
    }

    onDestroy(() => {
        svg?.remove();
    });
</script>

<div class="d3-shell" bind:this={container}></div>

<style>
    .d3-shell {
        width: 100%;
        min-height: 320px;
        background: rgba(15, 23, 42, 0.55);
        border-radius: 24px;
        border: 1px solid rgba(148, 163, 184, 0.2);
        padding: 1rem;
    }

    :global(.d3-shell svg) {
        width: 100%;
        height: 100%;
    }
</style>
