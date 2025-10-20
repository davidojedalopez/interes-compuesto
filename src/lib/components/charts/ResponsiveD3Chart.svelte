<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import type { D3Series } from './types';

    export let labels: string[] = [];
    export let series: D3Series[] = [];
    export let valueFormatter: (value: number) => string = (value) =>
        value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
    export let yAxisLabel = 'Saldo acumulado';

    let container: HTMLDivElement;
    let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;

    const dashArray = (shouldDash: boolean) => (shouldDash ? '10 6' : '0');

    const render = () => {
        if (!container || labels.length === 0 || series.length === 0) {
            svg?.remove();
            svg = null;
            return;
        }

        svg?.remove();

        const width = 640;
        const height = 360;
        const padding = { top: 48, right: 32, bottom: 64, left: 88 };

        svg = d3
            .select(container)
            .append('svg')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('role', 'img')
            .attr('aria-label', 'Gráfica de crecimiento generada con D3');

        const innerWidth = width - padding.left - padding.right;
        const innerHeight = height - padding.top - padding.bottom;

        const flatValues = series.flatMap((serie) => serie.values);
        const yMax = d3.max(flatValues) ?? 1;
        const xScale = d3
            .scalePoint()
            .domain(labels)
            .range([0, innerWidth]);

        const yScale = d3
            .scaleLinear()
            .domain([0, yMax * 1.05])
            .nice()
            .range([innerHeight, 0]);

        const root = svg.append('g').attr('transform', `translate(${padding.left},${padding.top})`);

        const grid = root.append('g').attr('class', 'grid');
        grid
            .append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale).tickSize(-innerHeight).tickFormat((value) => value as string))
            .call((g) => g.select('.domain').remove());

        grid
            .append('g')
            .call(d3.axisLeft(yScale).ticks(6).tickSize(-innerWidth).tickFormat((d) => valueFormatter(Number(d))))
            .call((g) => g.select('.domain').remove());

        grid.selectAll('line').attr('stroke', 'rgba(148, 163, 184, 0.2)');
        grid.selectAll('text').attr('fill', '#cbd5f5').attr('font-family', 'Inter, sans-serif');

        const areaGenerator = d3
            .area<number>()
            .x((_, index) => xScale(labels[index]) ?? 0)
            .y0(innerHeight)
            .y1((value) => yScale(value))
            .curve(d3.curveCatmullRom.alpha(0.85));

        const lineGenerator = d3
            .line<number>()
            .x((_, index) => xScale(labels[index]) ?? 0)
            .y((value) => yScale(value))
            .curve(d3.curveCatmullRom.alpha(0.85));

        series.forEach((serie) => {
            if (serie.fillColor) {
                root
                    .append('path')
                    .datum(serie.values)
                    .attr('fill', serie.fillColor)
                    .attr('d', areaGenerator)
                    .attr('opacity', 0.85);
            }

            root
                .append('path')
                .datum(serie.values)
                .attr('fill', 'none')
                .attr('stroke', serie.stroke)
                .attr('stroke-width', 4)
                .attr('stroke-linecap', 'round')
                .attr('stroke-dasharray', dashArray(Boolean(serie.dashed)))
                .attr('d', lineGenerator);
        });

        const legend = root.append('g').attr('class', 'legend').attr('transform', `translate(0, ${-padding.top / 2})`);

        series.forEach((serie, index) => {
            const legendItem = legend.append('g').attr('transform', `translate(${index * 240}, 0)`);

            legendItem
                .append('line')
                .attr('x1', 0)
                .attr('x2', 48)
                .attr('y1', 0)
                .attr('y2', 0)
                .attr('stroke', serie.stroke)
                .attr('stroke-width', 4)
                .attr('stroke-dasharray', dashArray(Boolean(serie.dashed)));

            legendItem
                .append('text')
                .attr('x', 56)
                .attr('y', 6)
                .attr('fill', '#e2e8f0')
                .attr('font-size', 14)
                .attr('font-family', 'Inter, sans-serif')
                .text(serie.label);
        });

        const focusLine = root
            .append('line')
            .attr('class', 'focus-line')
            .attr('stroke', 'rgba(148, 163, 184, 0.5)')
            .attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '4 6')
            .attr('y1', 0)
            .attr('y2', innerHeight)
            .style('opacity', 0);

        const focusLabels = legend
            .selectAll('text.focus')
            .data(series)
            .enter()
            .append('text')
            .attr('class', 'focus')
            .attr('x', (_, index) => index * 240)
            .attr('y', 28)
            .attr('fill', '#f8fafc')
            .attr('font-size', 13)
            .attr('font-family', 'Inter, sans-serif')
            .style('opacity', 0);

        const pointerOverlay = root
            .append('rect')
            .attr('fill', 'transparent')
            .attr('width', innerWidth)
            .attr('height', innerHeight)
            .style('cursor', 'crosshair')
            .on('mousemove', (event) => {
                const [x] = d3.pointer(event);
                const domain = xScale.domain();
                let closestLabel = domain[0];
                let smallestDistance = Number.POSITIVE_INFINITY;

                domain.forEach((label) => {
                    const distance = Math.abs((xScale(label) ?? 0) - x);
                    if (distance < smallestDistance) {
                        closestLabel = label;
                        smallestDistance = distance;
                    }
                });

                const labelIndex = labels.indexOf(closestLabel);
                if (labelIndex === -1) return;

                const xPosition = xScale(closestLabel) ?? 0;

                focusLine.attr('x1', xPosition).attr('x2', xPosition).style('opacity', 1);

                focusLabels
                    .style('opacity', 1)
                    .text((d) => `${d.label}: ${valueFormatter(d.values[labelIndex])}`);
            })
            .on('mouseleave', () => {
                focusLine.style('opacity', 0);
                focusLabels.style('opacity', 0);
            });

        svg
            .append('text')
            .attr('x', padding.left - 32)
            .attr('y', padding.top - 16)
            .attr('fill', '#94a3b8')
            .attr('font-size', 13)
            .attr('font-family', 'Inter, sans-serif')
            .text(yAxisLabel);

        pointerOverlay.attr('aria-hidden', 'true');
    };

    onMount(() => {
        render();

        const resizeObserver = new ResizeObserver(() => {
            render();
        });

        resizeObserver.observe(container);

        return () => resizeObserver.disconnect();
    });

    $: render();
</script>

<div class="d3-shell" bind:this={container}></div>

<style>
    .d3-shell {
        width: 100%;
        min-height: 360px;
        background: rgba(15, 23, 42, 0.6);
        border-radius: 24px;
        border: 1px solid rgba(148, 163, 184, 0.24);
        padding: 1.25rem;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    :global(.d3-shell svg) {
        width: 100%;
        height: 100%;
    }
</style>
