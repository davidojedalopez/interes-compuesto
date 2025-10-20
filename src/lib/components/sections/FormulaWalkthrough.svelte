<script lang="ts">
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import { createScrollAnimation, ensureGsapRegistered, gsap } from '@animations/gsap';

    const frequencies = [
        { label: 'Anual', value: 1 },
        { label: 'Trimestral', value: 4 },
        { label: 'Mensual', value: 12 }
    ];

    const principal = 12000;
    const rate = 0.08;
    const years = 10;

    let container: HTMLElement;
    let frequencyIndex = 2;
    let prefersReducedMotion = false;

    const formatter = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        maximumFractionDigits: 0
    });

    $: sliderValue = frequencies[frequencyIndex]?.value ?? frequencies[0].value;
    $: growth = principal * Math.pow(1 + rate / sliderValue, sliderValue * years);

    const parts = [
        { id: 'principal', label: 'P', text: 'Principal: el primer puñado de croquetas.' },
        { id: 'rate', label: 'r', text: 'Tasa anual: el “ritmo de lluvia” que moja el montículo.' },
        {
            id: 'frequency',
            label: 'n',
            text: 'Frecuencia de capitalización: cuántas veces al año se reinvierte la lluvia.'
        },
        { id: 'time', label: 't', text: 'Tiempo: cuántos años dejamos enterrado el tesoro.' }
    ];

    onMount(() => {
        prefersReducedMotion = browser
            ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
            : false;

        ensureGsapRegistered();

        const controls = createScrollAnimation(
            container,
            {
                trigger: container,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: false,
                once: true
            },
            (timeline) => {
                timeline
                    .from('.formula__expression span', {
                        opacity: 0,
                        y: 40,
                        duration: 0.5,
                        ease: 'power3.out',
                        stagger: 0.2
                    })
                    .from(
                        '.formula__legend li',
                        {
                            opacity: 0,
                            x: -30,
                            duration: 0.45,
                            ease: 'power2.out',
                            stagger: 0.18
                        },
                        '-=0.3'
                    );
            }
        );

        return () => controls.destroy();
    });

    function animateHighlight(id: string) {
        if (prefersReducedMotion) return;
        const target = container?.querySelector(`[data-id="${id}"]`);
        if (!target) return;
        gsap.fromTo(
            target,
            { boxShadow: '0 0 0 rgba(249, 115, 22, 0)' },
            { boxShadow: '0 0 0 12px rgba(249, 115, 22, 0)', duration: 1.2, ease: 'power3.out' }
        );
    }
</script>

<div class="formula" bind:this={container}>
    <header>
        <p class="formula__eyebrow">Fórmula en cámara lenta</p>
        <h2>Así se arma <span class="formula__math">A = P(1 + r / n)<sup>n·t</sup></span></h2>
        <p class="formula__lede">
            Desliza la frecuencia para ver cómo cambia el exponente. Cada símbolo de la fórmula responde a
            una decisión concreta.
        </p>
    </header>

    <div class="formula__content">
        <div class="formula__expression">
            <button
                type="button"
                class="formula__token"
                data-id="principal"
                on:mouseenter={() => animateHighlight('principal')}
                on:focus={() => animateHighlight('principal')}
            >
                P = {formatter.format(principal)}
            </button>
            <button
                type="button"
                class="formula__token"
                data-id="rate"
                on:mouseenter={() => animateHighlight('rate')}
                on:focus={() => animateHighlight('rate')}
            >
                r = {(rate * 100).toFixed(1)}%
            </button>
            <button
                type="button"
                class="formula__token"
                data-id="frequency"
                on:mouseenter={() => animateHighlight('frequency')}
                on:focus={() => animateHighlight('frequency')}
            >
                n = {sliderValue} veces
            </button>
            <button
                type="button"
                class="formula__token"
                data-id="time"
                on:mouseenter={() => animateHighlight('time')}
                on:focus={() => animateHighlight('time')}
            >
                t = {years} años
            </button>
        </div>

        <div class="formula__controls">
            <label for="frequency">Frecuencia de capitalización</label>
            <input
                id="frequency"
                type="range"
                min="0"
                max={frequencies.length - 1}
                step="1"
                bind:value={frequencyIndex}
            />
            <div class="formula__chips">
                {#each frequencies as frequency, index}
                    <span class:active={frequencyIndex === index}>#{index + 1} {frequency.label}</span>
                {/each}
            </div>
        </div>

        <ul class="formula__legend">
            {#each parts as part}
                <li data-id={part.id}>
                    <span>{part.label}</span>
                    <p>{part.text}</p>
                </li>
            {/each}
        </ul>
    </div>

    <footer class="formula__summary">
        <p>
            Resultado estimado: <strong>{formatter.format(growth)}</strong>. Con más capitalizaciones por
            año, el exponente <code>n·t</code> crece y el efecto bola de nieve se acelera.
        </p>
    </footer>
</div>

<style>
    .formula {
        display: grid;
        gap: var(--spacing-lg);
    }

    header {
        display: grid;
        gap: 0.75rem;
    }

    .formula__eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.28em;
        color: var(--color-accent);
        font-weight: 600;
    }

    header h2 {
        font-size: clamp(2rem, 4vw, 2.8rem);
    }

    .formula__lede {
        color: var(--color-text-muted);
        max-width: 620px;
        line-height: 1.6;
    }

    .formula__content {
        display: grid;
        gap: clamp(1.5rem, 4vw, 2.5rem);
        background: rgba(15, 23, 42, 0.6);
        border-radius: 28px;
        border: 1px solid rgba(148, 163, 184, 0.25);
        padding: clamp(1.5rem, 4vw, 2.75rem);
    }

    .formula__expression {
        display: grid;
        gap: 0.5rem;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }

    .formula__token {
        background: rgba(15, 23, 42, 0.55);
        border-radius: 20px;
        padding: 1rem;
        border: 1px solid rgba(148, 163, 184, 0.25);
        transition: transform 150ms ease, border-color 150ms ease;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
    }

    .formula__token:hover,
    .formula__token:focus-visible {
        transform: translateY(-4px);
        border-color: rgba(249, 115, 22, 0.6);
    }

    .formula__controls {
        display: grid;
        gap: 0.75rem;
    }

    .formula__controls label {
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.85rem;
        color: var(--color-text-muted);
    }

    .formula__controls input[type='range'] {
        width: 100%;
    }

    .formula__chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .formula__chips span {
        border-radius: 999px;
        padding: 0.4rem 0.9rem;
        background: rgba(15, 23, 42, 0.65);
        border: 1px solid rgba(148, 163, 184, 0.25);
        font-size: 0.85rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    .formula__chips span.active {
        border-color: rgba(249, 115, 22, 0.6);
        background: linear-gradient(120deg, rgba(249, 115, 22, 0.2), rgba(56, 189, 248, 0.1));
    }

    .formula__legend {
        list-style: none;
        display: grid;
        gap: 1rem;
        margin: 0;
        padding: 0;
    }

    .formula__legend li {
        display: grid;
        gap: 0.4rem;
        background: rgba(15, 23, 42, 0.55);
        border-radius: 20px;
        border: 1px solid rgba(148, 163, 184, 0.25);
        padding: 1rem 1.25rem;
    }

    .formula__legend span {
        letter-spacing: 0.2em;
        text-transform: uppercase;
        font-size: 0.8rem;
        color: rgba(148, 163, 184, 0.9);
    }

    .formula__legend p {
        color: var(--color-text-muted);
        line-height: 1.5;
    }

    .formula__summary {
        background: linear-gradient(160deg, rgba(56, 189, 248, 0.12), rgba(249, 115, 22, 0.1));
        border-radius: 24px;
        padding: 1.5rem 1.75rem;
        border: 1px solid rgba(56, 189, 248, 0.35);
        color: var(--color-text-primary);
    }

    .formula__summary p {
        margin: 0;
        font-size: 1.05rem;
        line-height: 1.6;
    }

    @media (max-width: 768px) {
        header h2 {
            font-size: clamp(1.8rem, 5vw, 2.4rem);
        }

        .formula__expression {
            grid-template-columns: 1fr;
        }
    }
</style>
