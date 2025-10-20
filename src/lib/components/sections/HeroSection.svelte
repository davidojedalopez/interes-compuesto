<script lang="ts">
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import { ensureGsapRegistered, gsap } from '@animations/gsap';

    const moundMarkers = [1, 1.5, 2, 3, 4];
    const years = 10;
    const principal = 10000;

    let runner: HTMLDivElement;
    let sliderValue = 2.5;
    let prefersReducedMotion = false;

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 0
        }).format(value);

    $: normalized = (sliderValue - 1) / (moundMarkers[moundMarkers.length - 1] - 1);
    $: impliedRate = Math.pow(sliderValue, 1 / years) - 1;
    $: futureValue = principal * Math.pow(1 + impliedRate, years);

    function moveRunner(duration = 0.85) {
        if (!runner) return;

        if (prefersReducedMotion) {
            runner.style.setProperty('--progress', `${normalized}`);
            return;
        }

        gsap.to(runner, {
            '--progress': normalized,
            duration,
            ease: 'power2.out'
        });
    }

    function replay() {
        if (!runner) return;
        if (prefersReducedMotion) {
            runner.style.setProperty('--progress', '0');
            requestAnimationFrame(() => {
                runner.style.setProperty('--progress', `${normalized}`);
            });
            return;
        }

        gsap.fromTo(
            runner,
            { '--progress': 0 },
            {
                '--progress': normalized,
                duration: 1.1,
                ease: 'power3.out'
            }
        );
    }

    onMount(() => {
        prefersReducedMotion = browser
            ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
            : false;

        ensureGsapRegistered();
        moveRunner(0);
    });
</script>

<div class="hero">
    <div class="hero__copy">
        <p class="hero__eyebrow">Border Collie Launchpad</p>
        <h1 class="hero__title" id="inicio">
            <span>Tu guía canina</span>
            <span>al interés compuesto</span>
        </h1>
        <p class="hero__lede">
            Ajusta el control y mira cómo nuestra Border Collie recorre una pista donde cada montículo
            duplica el botín de croquetas. Así se siente dejar que el tiempo y la capitalización hagan el
            trabajo pesado.
        </p>

        <div class="hero__controls">
            <label for="growth">Multiplicador deseado</label>
            <input
                id="growth"
                type="range"
                min="1"
                max="4"
                step="0.1"
                bind:value={sliderValue}
                on:input={() => moveRunner()}
                aria-describedby="growth-help"
            />
            <div class="hero__metrics" id="growth-help">
                <p>
                    <strong>{sliderValue.toFixed(1)}&times;</strong> en {years} años implica una tasa anual
                    aproximada del <strong>{(impliedRate * 100).toFixed(1)}%</strong>.
                </p>
                <p>
                    Si empiezas con {formatCurrency(principal)}, podrías terminar con
                    <strong>{formatCurrency(futureValue)}</strong> si mantienes esa velocidad.
                </p>
            </div>
            <button type="button" class="hero__cta" on:click={replay}>Iniciar carrera</button>
        </div>
    </div>

    <div class="hero__track" aria-hidden="true">
        <div class="launchpad">
            <div class="launchpad__runner" bind:this={runner} style="--progress: 0">
                <span class="launchpad__dog" role="img" aria-hidden="true">🐕</span>
                <span class="launchpad__trail"></span>
            </div>
            <div class="launchpad__mounds">
                {#each moundMarkers as marker}
                    <div
                        class="launchpad__mound"
                        class:active={marker <= sliderValue}
                        style={`--scale:${1 + normalized * (marker / moundMarkers[moundMarkers.length - 1])};`}
                    >
                        <span>{marker.toFixed(1)}×</span>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    .hero {
        position: relative;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: clamp(2rem, 9vw, 6rem);
        align-items: center;
        padding: var(--spacing-xxl) 0 var(--spacing-xl);
    }

    .hero__copy {
        display: grid;
        gap: var(--spacing-md);
    }

    .hero__eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.28em;
        color: var(--color-accent);
        font-weight: 600;
    }

    .hero__title {
        display: grid;
        gap: 0.35rem;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: clamp(2.2rem, 4vw, 3.4rem);
    }

    .hero__lede {
        font-size: 1.1rem;
        color: var(--color-text-muted);
        line-height: 1.6;
    }

    .hero__controls {
        display: grid;
        gap: var(--spacing-sm);
        background: rgba(15, 23, 42, 0.55);
        padding: var(--spacing-md);
        border-radius: 20px;
        border: 1px solid rgba(148, 163, 184, 0.2);
    }

    .hero__controls label {
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.85rem;
        color: var(--color-text-muted);
    }

    .hero__controls input[type='range'] {
        width: 100%;
    }

    .hero__metrics {
        display: grid;
        gap: 0.25rem;
        font-size: 0.95rem;
        color: var(--color-text-muted);
    }

    .hero__cta {
        justify-self: start;
        padding: 0.75rem 1.6rem;
        border-radius: 999px;
        background: linear-gradient(120deg, rgba(56, 189, 248, 0.2), rgba(249, 115, 22, 0.65));
        border: 1px solid rgba(249, 115, 22, 0.35);
        color: var(--color-text-primary);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        transition: transform 180ms ease;
    }

    .hero__cta:hover,
    .hero__cta:focus-visible {
        transform: translateY(-2px);
    }

    .hero__track {
        position: relative;
        width: 100%;
    }

    .launchpad {
        position: relative;
        background: radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.15), rgba(15, 23, 42, 0.85));
        border-radius: 28px;
        padding: clamp(2rem, 5vw, 3rem);
        border: 1px solid rgba(148, 163, 184, 0.15);
        overflow: hidden;
    }

    .launchpad__runner {
        position: relative;
        width: min(440px, 100%);
        height: clamp(120px, 16vw, 180px);
        margin-inline: auto;
        display: grid;
        align-content: center;
        justify-content: start;
        background: linear-gradient(90deg, rgba(148, 163, 184, 0.15), rgba(15, 23, 42, 0));
        border-radius: 999px;
        padding-left: clamp(1.5rem, 4vw, 3rem);
        --progress: 0;
    }

    .launchpad__runner::before,
    .launchpad__runner::after {
        content: '';
        position: absolute;
        inset: 20% 6%;
        border-radius: 999px;
        border: 1px dashed rgba(148, 163, 184, 0.4);
        pointer-events: none;
    }

    .launchpad__runner::after {
        inset: 30% 8%;
        border-style: solid;
        border-color: rgba(56, 189, 248, 0.3);
    }

    .launchpad__dog {
        font-size: clamp(1.8rem, 4vw, 2.4rem);
    }

    .launchpad__trail {
        position: absolute;
        top: 50%;
        left: clamp(1.5rem, 4vw, 3rem);
        width: calc(100% - clamp(1.5rem, 4vw, 3rem) * 2);
        height: 2px;
        background: linear-gradient(90deg, rgba(249, 115, 22, 0.85), rgba(56, 189, 248, 0));
        transform: translateY(-50%);
        transform-origin: left;
        scale: var(--progress);
        transition: scale 300ms ease;
    }

    .launchpad__dog {
        position: absolute;
        top: 50%;
        left: clamp(1.5rem, 4vw, 3rem);
        transform: translate(calc(var(--progress) * 85%), -50%);
        transition: transform 220ms ease;
    }

    .launchpad__mounds {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
        gap: clamp(0.75rem, 2vw, 1.25rem);
        margin-top: clamp(1.5rem, 3vw, 2.5rem);
    }

    .launchpad__mound {
        position: relative;
        background: rgba(15, 23, 42, 0.65);
        border-radius: 20px;
        padding: 1.1rem 0.75rem;
        display: grid;
        place-items: center;
        border: 1px solid rgba(148, 163, 184, 0.25);
        transform: scaleY(var(--scale));
        transform-origin: bottom;
        transition: transform 250ms ease, border-color 200ms ease, background 200ms ease;
    }

    .launchpad__mound span {
        font-weight: 600;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        font-size: 0.9rem;
    }

    .launchpad__mound.active {
        border-color: rgba(249, 115, 22, 0.6);
        background: linear-gradient(160deg, rgba(249, 115, 22, 0.25), rgba(56, 189, 248, 0.1));
    }

    @media (max-width: 960px) {
        .hero {
            grid-template-columns: 1fr;
            text-align: center;
        }

        .hero__controls {
            text-align: left;
        }

        .hero__cta {
            justify-self: center;
        }

        .hero__track {
            order: -1;
        }

        .launchpad__runner {
            padding-left: clamp(1.25rem, 8vw, 2.5rem);
        }

        .launchpad__dog {
            left: clamp(1.25rem, 8vw, 2.5rem);
        }
    }
</style>
