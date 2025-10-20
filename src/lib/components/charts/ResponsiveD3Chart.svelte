<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import * as d3 from 'd3';
    import type { ContributionPoint, GrowthPoint, TimingPoint } from '@utils/compound';

    export let mode: 'comparison' | 'contributions' | 'timing' = 'comparison';
    export let comparisonData: GrowthPoint[] = [];
    export let contributionsData: ContributionPoint[] = [];
    export let timingData: TimingPoint[] = [];

    let container: HTMLDivElement;
    let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;

    function formatCurrency(value: number) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: value >= 100000 ? 0 : 2
        }).format(value);
    }

    function renderChart() {
        if (!container) return;

        svg?.remove();
        svg = d3
            .select(container)
            .append('svg')
            .attr('viewBox', '0 0 640 360')
            .attr('role', 'img')
            .attr('aria-label', 'Visualización D3 de interés compuesto');

        const padding = { top: 36, right: 24, bottom: 48, left: 68 };
        const width = 640 - padding.left - padding.right;
        const height = 360 - padding.top - padding.bottom;

        const group = svg.append('g').attr('transform', `translate(${padding.left},${padding.top})`);

        const labels =
            mode === 'comparison'
                ? comparisonData
                : mode === 'contributions'
                ? contributionsData
                : timingData;

        const x = d3
            .scaleLinear()
            .domain([0, d3.max(labels, (point: any) => point.year) ?? 1])
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .range([height, 0]);

        if (mode === 'comparison') {
            const maxValue = d3.max(comparisonData, (point) => Math.max(point.simple, point.compound)) ?? 0;
            y.domain([0, maxValue]).nice();

            const line = d3
                .line<GrowthPoint>()
                .x((point) => x(point.year))
                .y((point) => y(point.compound))
                .curve(d3.curveCatmullRom.alpha(0.6));

            const simpleLine = d3
                .line<GrowthPoint>()
                .x((point) => x(point.year))
                .y((point) => y(point.simple))
                .curve(d3.curveLinear);

            group
                .append('path')
                .datum(comparisonData)
                .attr('fill', 'none')
                .attr('stroke', 'rgba(148, 163, 184, 0.75)')
                .attr('stroke-width', 3)
                .attr('d', simpleLine);

            group
                .append('path')
                .datum(comparisonData)
                .attr('fill', 'rgba(249, 115, 22, 0.15)')
                .attr('stroke', 'rgba(249, 115, 22, 1)')
                .attr('stroke-width', 4)
                .attr('stroke-linecap', 'round')
                .attr('d', line);
        } else if (mode === 'contributions') {
            const maxValue =
                d3.max(contributionsData, (point) => point.contributions + point.interest) ?? 0;
            y.domain([0, maxValue]).nice();

            const area = d3
                .area<ContributionPoint>()
                .x((point) => x(point.year))
                .y0(height)
                .y1((point) => y(point.contributions))
                .curve(d3.curveCatmullRom.alpha(0.65));

            const interestArea = d3
                .area<ContributionPoint>()
                .x((point) => x(point.year))
                .y0((point) => y(point.contributions))
                .y1((point) => y(point.contributions + point.interest))
                .curve(d3.curveCatmullRom.alpha(0.65));

            group
                .append('path')
                .datum(contributionsData)
                .attr('fill', 'rgba(56, 189, 248, 0.25)')
                .attr('d', area);

            group
                .append('path')
                .datum(contributionsData)
                .attr('fill', 'rgba(249, 115, 22, 0.2)')
                .attr('d', interestArea);
        } else {
            const maxValue = d3.max(timingData, (point) => Math.max(point.early, point.late)) ?? 0;
            y.domain([0, maxValue]).nice();

            const earlyLine = d3
                .line<TimingPoint>()
                .x((point) => x(point.year))
                .y((point) => y(point.early))
                .curve(d3.curveCatmullRom.alpha(0.6));

            const lateLine = d3
                .line<TimingPoint>()
                .x((point) => x(point.year))
                .y((point) => y(point.late))
                .curve(d3.curveCatmullRom.alpha(0.6));

            group
                .append('path')
                .datum(timingData)
                .attr('fill', 'none')
                .attr('stroke', 'rgba(56, 189, 248, 1)')
                .attr('stroke-width', 4)
                .attr('stroke-linecap', 'round')
                .attr('d', earlyLine);

            group
                .append('path')
                .datum(timingData)
                .attr('fill', 'none')
                .attr('stroke', 'rgba(248, 113, 113, 1)')
                .attr('stroke-width', 4)
                .attr('stroke-dasharray', '6 6')
                .attr('d', lateLine);
        }

        group
            .append('g')
            .attr('transform', `translate(0,${height})`)
            .call(
                d3
                    .axisBottom(x)
                    .ticks(labels.length)
                    .tickFormat((value) => `Año ${value}` as any)
                    .tickSizeOuter(0)
            )
            .selectAll('text')
            .attr('fill', '#cbd5f5');

        group
            .append('g')
            .call(
                d3
                    .axisLeft(y)
                    .ticks(6)
                    .tickFormat((value) => formatCurrency(Number(value)) as any)
                    .tickSizeOuter(0)
            )
            .selectAll('text')
            .attr('fill', '#cbd5f5');

        svg.selectAll('path.domain').attr('stroke', 'rgba(148, 163, 184, 0.35)');
        svg.selectAll('line').attr('stroke', 'rgba(148, 163, 184, 0.2)');
    }

    onMount(renderChart);

    onDestroy(() => {
        svg?.remove();
        svg = null;
    });

    $: if (container) {
        renderChart();
    }
</script>

<div class="d3-shell" bind:this={container}></div>

<style>
    .d3-shell {
        width: 100%;
        min-height: 360px;
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
