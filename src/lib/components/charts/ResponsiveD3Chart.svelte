<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    type CompoundPoint = {
        year: number;
        total: number;
        contributions: number;
        interest: number;
    };

    export let points: CompoundPoint[] = [];
    export let ariaLabel = 'Detalle anual de interés compuesto con D3';

    let container: HTMLDivElement;
    let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | undefined;

    const padding = { top: 32, right: 24, bottom: 48, left: 56 };
    const viewBox = { width: 560, height: 320 };

    function draw() {
        if (!svg) return;

        svg.selectAll('*').remove();

        const width = viewBox.width - padding.left - padding.right;
        const height = viewBox.height - padding.top - padding.bottom;
        const safePoints = points.length ? points : [{ year: 0, total: 0, contributions: 0, interest: 0 }];

        const x = d3
            .scaleLinear()
            .domain(d3.extent(safePoints, (point) => point.year) as [number, number])
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(safePoints, (point) => point.total) ?? 1])
            .nice()
            .range([height, 0]);

        const group = svg
            .append('g')
            .attr('transform', `translate(${padding.left},${padding.top})`);

        const contributionArea = d3
            .area<CompoundPoint>()
            .x((d) => x(d.year))
            .y0(height)
            .y1((d) => y(d.contributions))
            .curve(d3.curveCatmullRom.alpha(0.85));

        const totalLine = d3
            .line<CompoundPoint>()
            .x((d) => x(d.year))
            .y((d) => y(d.total))
            .curve(d3.curveCatmullRom.alpha(0.85));

        group
            .append('path')
            .datum(safePoints)
            .attr('fill', 'rgba(56, 189, 248, 0.18)')
            .attr('d', contributionArea);

        group
            .append('path')
            .datum(safePoints)
            .attr('fill', 'none')
            .attr('stroke', 'rgba(249, 115, 22, 1)')
            .attr('stroke-width', 4)
            .attr('stroke-linecap', 'round')
            .attr('d', totalLine);

        group
            .selectAll('.interest-dot')
            .data(safePoints)
            .enter()
            .append('circle')
            .attr('class', 'interest-dot')
            .attr('cx', (d) => x(d.year))
            .attr('cy', (d) => y(d.total))
            .attr('r', 4)
            .attr('fill', '#fff')
            .attr('stroke', 'rgba(249, 115, 22, 1)')
            .attr('stroke-width', 2)
            .append('title')
            .text((d) => `Año ${d.year}: $${d.total.toLocaleString('es-MX')}`);

        group
            .append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(Math.min(safePoints.length, 10)).tickSizeOuter(0))
            .selectAll('text')
            .attr('fill', '#cbd5f5');

        group
            .append('g')
            .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0))
            .selectAll('text')
            .attr('fill', '#cbd5f5');

        svg.selectAll('path.domain, line').attr('stroke', 'rgba(148, 163, 184, 0.25)');
    }

    onMount(() => {
        svg = d3
            .select(container)
            .append('svg')
            .attr('viewBox', `0 0 ${viewBox.width} ${viewBox.height}`)
            .attr('role', 'img')
            .attr('aria-label', ariaLabel);

        draw();

        return () => {
            svg?.remove();
        };
    });

    $: if (svg) {
        svg.attr('aria-label', ariaLabel);
        draw();
    }
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
