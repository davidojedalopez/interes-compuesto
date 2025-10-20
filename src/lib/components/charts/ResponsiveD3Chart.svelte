<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    type SamplePoint = { step: number; value: number };

    const sample: SamplePoint[] = [
        { step: 0, value: 1 },
        { step: 1, value: 1.4 },
        { step: 2, value: 2 },
        { step: 3, value: 3.1 },
        { step: 4, value: 4.9 }
    ];

    let container: HTMLDivElement;

    onMount(() => {
        const svg = d3
            .select(container)
            .append('svg')
            .attr('viewBox', '0 0 560 320')
            .attr('role', 'img')
            .attr('aria-label', 'Bosquejo D3 en progreso');

        const padding = { top: 32, right: 24, bottom: 48, left: 56 };
        const width = 560 - padding.left - padding.right;
        const height = 320 - padding.top - padding.bottom;

        const x = d3
            .scaleLinear()
            .domain(d3.extent(sample, (d: SamplePoint) => d.step) as [number, number])
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(sample, (d: SamplePoint) => d.value) ?? 1])
            .nice()
            .range([height, 0]);

        const group = svg
            .append('g')
            .attr('transform', `translate(${padding.left},${padding.top})`);

        const line = d3
            .line<SamplePoint>()
            .x((d) => x(d.step))
            .y((d) => y(d.value))
            .curve(d3.curveCatmullRom.alpha(0.85));

        group
            .append('path')
            .datum(sample)
            .attr('fill', 'none')
            .attr('stroke', 'rgba(56, 189, 248, 1)')
            .attr('stroke-width', 4)
            .attr('stroke-linecap', 'round')
            .attr('d', line);

        group
            .append('path')
            .datum(sample)
            .attr('fill', 'rgba(56, 189, 248, 0.15)')
            .attr(
                'd',
                d3
                    .area<SamplePoint>()
                    .x((d) => x(d.step))
                    .y0(height)
                    .y1((d) => y(d.value))
                    .curve(d3.curveCatmullRom.alpha(0.85))
            );

        group
            .append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(sample.length).tickSizeOuter(0))
            .selectAll('text')
            .attr('fill', '#cbd5f5');

        group
            .append('g')
            .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0))
            .selectAll('text')
            .attr('fill', '#cbd5f5');

        svg.selectAll('path.domain, line').attr('stroke', 'rgba(148, 163, 184, 0.25)');

        return () => {
            svg.remove();
        };
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
