<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { createScrollAnimation, ensureGsapRegistered, ScrollTrigger } from '$lib/animations/gsap';
    import ChartShowcase from '../charts/ChartShowcase.svelte';
    import ResponsiveD3Chart from '../charts/ResponsiveD3Chart.svelte';

    type Framework = 'chartjs' | 'd3';

    const frames: Array<{
        framework: Framework;
        title: string;
        body: string;
    }> = [
        {
            framework: 'chartjs',
            title: 'Primero, una panorámica desde Chart.js',
            body: 'Piensa en este gráfico como el dron que toma la primera foto del terreno. Muestra tendencias generales, suaviza el ruido y deja claro por qué reinvertir intereses acelera cualquier meta: cada aporte extra se vuelve un nuevo cachorrito que también trae huesos al canasto.'
        },
        {
            framework: 'd3',
            title: 'Después, zoom quirúrgico con D3.js',
            body: 'Cuando necesitas entender qué pasa año con año, D3 permite abrir la gráfica y revisar cada rastro. Así detectas cuándo conviene aumentar aportaciones o reducir gastos que muerden tu rendimiento, igual que un entrenador analiza cuadro por cuadro la carrera de su Border Collie.'
        }
    ];

    const activeFramework = writable<Framework>(frames[0].framework);

    let storyNodes: Array<HTMLElement | undefined> = [];

    function registerStory(node: HTMLElement, index: number) {
        storyNodes[index] = node;

        return {
            destroy() {
                storyNodes[index] = undefined;
            }
        };
    }

    const teardown: Array<() => void> = [];

    onMount(() => {
        ensureGsapRegistered();

        frames.forEach((frame, index) => {
            const node = storyNodes[index];
            if (!node) return;

            const animation = createScrollAnimation(
                node,
                {
                    trigger: node,
                    scrub: true,
                    start: 'top 80%',
                    end: 'bottom 55%'
                },
                (timeline) => {
                    timeline.fromTo(
                        node,
                        { opacity: 0.2, y: 48 },
                        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
                    );
                }
            );

            const trigger = ScrollTrigger.create({
                trigger: node,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => activeFramework.set(frame.framework),
                onEnterBack: () => activeFramework.set(frame.framework)
            });

            teardown.push(() => {
                animation?.destroy();
                trigger.kill();
            });
        });
    });

    onDestroy(() => {
        teardown.forEach((fn) => fn());
        teardown.length = 0;
    });
</script>

<div class="sandbox" id="visualizaciones">
    <div class="sandbox__display" aria-live="polite">
        <div class="sandbox__stage">
            <div class:active={$activeFramework === 'chartjs'} class="sandbox__frame" aria-hidden={$activeFramework !== 'chartjs'}>
                <ChartShowcase />
            </div>
            <div class:active={$activeFramework === 'd3'} class="sandbox__frame" aria-hidden={$activeFramework !== 'd3'}>
                <ResponsiveD3Chart />
            </div>
        </div>
        <p class="sandbox__hint">Sigue desplazándote: la historia cambia y la visualización responde sin presionar un solo botón.</p>
    </div>

    <div class="sandbox__stories">
        {#each frames as frame, index}
            <article class="story" use:registerStory={index}>
                <h3>{frame.title}</h3>
                <p>{frame.body}</p>
            </article>
        {/each}
    </div>
</div>

<style>
    .sandbox {
        display: grid;
        gap: var(--spacing-lg);
    }

    .sandbox__display {
        position: relative;
        padding: var(--spacing-md);
        background: rgba(15, 23, 42, 0.55);
        border-radius: 24px;
        border: 1px solid rgba(148, 163, 184, 0.25);
        display: grid;
        gap: var(--spacing-sm);
    }

    .sandbox__stage {
        position: relative;
        overflow: hidden;
        min-height: clamp(280px, 40vh, 420px);
        border-radius: 18px;
    }

    .sandbox__frame {
        position: absolute;
        inset: 0;
        opacity: 0;
        transform: scale(0.97);
        transition: opacity 320ms ease, transform 320ms ease;
        pointer-events: none;
    }

    .sandbox__frame.active {
        opacity: 1;
        transform: scale(1);
        pointer-events: auto;
    }

    .sandbox__hint {
        font-size: 0.9rem;
        color: rgba(226, 232, 240, 0.8);
    }

    .sandbox__stories {
        display: grid;
        gap: clamp(2rem, 8vh, 4rem);
    }

    .story {
        display: grid;
        gap: 0.75rem;
        padding-inline: clamp(0rem, 4vw, 1.5rem);
    }

    .story h3 {
        font-size: clamp(1.25rem, 2.4vw, 1.6rem);
        font-weight: 600;
    }

    .story p {
        color: rgba(226, 232, 240, 0.9);
        line-height: 1.7;
    }

    @media (min-width: 62rem) {
        .sandbox {
            grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
            align-items: start;
        }

        .sandbox__display {
            position: sticky;
            top: clamp(4rem, 16vh, 7rem);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .sandbox__frame {
            transition: opacity 160ms ease;
            transform: none;
        }

        .sandbox__frame.active {
            transform: none;
        }
    }
</style>
