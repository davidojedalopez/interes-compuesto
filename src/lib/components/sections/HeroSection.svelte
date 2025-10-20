<script lang="ts">
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import { ensureGsapRegistered, gsap } from '@animations/gsap';
    import LottiePlaceholder from '../graphics/LottiePlaceholder.svelte';

    const glossary = [
        {
            term: 'Capital',
            description: 'El dinero inicial que pones a trabajar: tu semilla de ahorros.'
        },
        {
            term: 'Tiempo',
            description: 'El tramo durante el que dejas crecer tu inversión. Mientras más largo, mejor cosecha.'
        },
        {
            term: 'Tasa',
            description:
                'La velocidad de crecimiento. Puede venir de intereses bancarios, rendimientos o ganancias reinvertidas.'
        }
    ];

    const particles = Array.from({ length: 12 }, (_, index) => index);

    let root: HTMLElement;
    let activeTerm: number | null = null;
    let audioEnabled = false;
    let audioContext: AudioContext | undefined;
    let reduceMotion = false;

    function openTooltip(index: number) {
        activeTerm = index;
    }

    function closeTooltip(index: number) {
        if (activeTerm === index) {
            activeTerm = null;
        }
    }

    async function ensureAudioContext() {
        if (!browser) return undefined;
        if (!audioContext) {
            const context = new AudioContext();
            await context.resume();
            audioContext = context;
        }
        return audioContext;
    }

    async function playChime() {
        if (!browser || reduceMotion) return;
        const context = await ensureAudioContext();
        if (!context) return;

        const now = context.currentTime;
        const gain = context.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.2, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        gain.connect(context.destination);

        [880, 1318].forEach((frequency, idx) => {
            const osc = context.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, now + idx * 0.03);
            osc.connect(gain);
            osc.start(now + idx * 0.03);
            osc.stop(now + 1.2);
        });
    }

    async function toggleAudio() {
        audioEnabled = !audioEnabled;
        if (audioEnabled) {
            await ensureAudioContext();
            await playChime();
        }
    }

    onMount(() => {
        reduceMotion = browser
            ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
            : false;

        ensureGsapRegistered();
        const ctx = gsap.context(() => {
            const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

            timeline.from('.hero__title span', {
                opacity: 0,
                y: 40,
                stagger: 0.12,
                duration: 0.8
            });

            timeline.from(
                '.hero__lede',
                {
                    opacity: 0,
                    y: 28,
                    duration: 0.75
                },
                '-=0.3'
            );

            timeline.from(
                '.hero__summary li',
                {
                    opacity: 0,
                    x: -24,
                    duration: 0.6,
                    stagger: 0.16
                },
                '-=0.35'
            );

            timeline.from(
                '.hero__controls',
                {
                    opacity: 0,
                    y: 20,
                    duration: 0.6
                },
                '-=0.35'
            );

            timeline.call(() => {
                if (audioEnabled) {
                    void playChime();
                }
            });

            if (!reduceMotion) {
                gsap.from('.hero__particle', {
                    opacity: 0,
                    scale: 0.4,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: 'back.out(1.8)'
                });

                gsap.utils.toArray<HTMLElement>('.hero__particle').forEach((particle, index) => {
                    gsap.to(particle, {
                        rotate: '+=360',
                        duration: gsap.utils.random(18, 26),
                        repeat: -1,
                        ease: 'none',
                        delay: index * 0.3
                    });

                    gsap.to(particle, {
                        y: '+=12',
                        duration: gsap.utils.random(3, 5),
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                        delay: index * 0.12
                    });
                });
            }
        }, root);

        return () => ctx.revert();
    });
</script>

<div class="hero" bind:this={root}>
    <div class="hero__copy">
        <p class="hero__eyebrow">Guía animada al interés compuesto</p>
        <h1 class="hero__title">
            <span>Tu</span>
            <span>futuro</span>
            <span>se cocina</span>
            <span>a fuego lento</span>
        </h1>
        <p class="hero__lede">
            Una Border Collie curiosa te recibe en el jardín donde el dinero crece como semillas.
            Aprenderás qué hace única a la capitalización compuesta y cómo usarla para metas reales sin
            importar tu edad.
        </p>
        <ul class="hero__summary" aria-label="Lo que descubrirás durante la historia">
            <li>Conecta analogías sencillas con decisiones financieras concretas.</li>
            <li>Ve la fórmula cobrar vida con animaciones aptas para todas las edades.</li>
            <li>Experimenta con números propios y llévate un plan imprimible.</li>
        </ul>
        <div class="hero__controls">
            <a class="hero__cta" href="#historia">Explorar la historia</a>
            <button class:active={audioEnabled} class="hero__audio" type="button" on:click={toggleAudio}>
                {audioEnabled ? 'Silenciar campanillas' : 'Activar campanillas'}</button
            >
        </div>
        <div class="hero__glossary" role="list" aria-label="Conceptos clave">
            {#each glossary as item, index}
                <div role="listitem" class="hero__term">
                    <button
                        type="button"
                        class="hero__term-trigger"
                        aria-describedby={`glossary-${index}`}
                        on:focus={() => openTooltip(index)}
                        on:blur={() => closeTooltip(index)}
                        on:mouseenter={() => openTooltip(index)}
                        on:mouseleave={() => closeTooltip(index)}
                    >
                        {item.term}
                    </button>
                    <span
                        id={`glossary-${index}`}
                        role="tooltip"
                        class:visible={activeTerm === index}
                    >
                        {item.description}
                    </span>
                </div>
            {/each}
        </div>
    </div>
    <div class="hero__visual" aria-hidden="true">
        <div class="hero__particles">
            {#each particles as particle}
                <span class="hero__particle" style={`--particle-index:${particle};`}></span>
            {/each}
        </div>
        <LottiePlaceholder label="Animación de la guía canina cuidando un jardín financiero" />
    </div>
</div>

<style>
    .hero {
        position: relative;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: clamp(2rem, 10vw, 6rem);
        align-items: center;
        padding: var(--spacing-xxl) 0 var(--spacing-xl);
    }

    .hero__copy {
        display: grid;
        gap: var(--spacing-md);
        position: relative;
        z-index: 1;
    }

    .hero__eyebrow {
        font-size: 0.85rem;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: rgba(226, 232, 240, 0.7);
    }

    .hero__title {
        display: inline-grid;
        gap: 0.15rem;
        text-transform: uppercase;
        letter-spacing: 0.18em;
    }

    .hero__title span {
        display: inline-block;
        background: linear-gradient(120deg, #22d3ee, var(--color-accent));
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
    }

    .hero__lede {
        font-size: 1.1rem;
        color: var(--color-text-muted);
        max-width: 46ch;
    }

    .hero__visual {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .hero__summary {
        list-style: none;
        display: grid;
        gap: 0.75rem;
        margin: 0;
        padding: 0;
    }

    .hero__summary li {
        display: grid;
        grid-auto-flow: column;
        align-items: start;
        gap: 0.65rem;
        padding-left: 1.6rem;
        position: relative;
        line-height: 1.6;
    }

    .hero__summary li::before {
        content: '';
        width: 0.65rem;
        height: 0.65rem;
        border-radius: 999px;
        background: linear-gradient(120deg, rgba(125, 211, 252, 0.85), rgba(249, 115, 22, 0.85));
        position: absolute;
        left: 0.35rem;
        top: 0.55rem;
        box-shadow: 0 0 0.75rem rgba(125, 211, 252, 0.45);
    }

    .hero__controls {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
        align-items: center;
    }

    .hero__cta {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.8rem 1.8rem;
        border-radius: 999px;
        background: linear-gradient(120deg, rgba(34, 211, 238, 0.95), rgba(249, 115, 22, 0.95));
        color: #0f172a;
        font-weight: 600;
        text-decoration: none;
        transition: transform 200ms ease, box-shadow 200ms ease;
    }

    .hero__cta:hover,
    .hero__cta:focus-visible {
        transform: translateY(-2px);
        box-shadow: 0 14px 30px rgba(14, 165, 233, 0.35);
    }

    .hero__audio {
        background: rgba(15, 23, 42, 0.65);
        border: 1px solid rgba(125, 211, 252, 0.35);
        padding: 0.6rem 1.1rem;
        border-radius: 999px;
        color: rgba(226, 232, 240, 0.85);
        font-size: 0.95rem;
        transition: border-color 180ms ease, color 180ms ease, transform 180ms ease;
    }

    .hero__audio:hover,
    .hero__audio:focus-visible,
    .hero__audio.active {
        border-color: rgba(249, 115, 22, 0.55);
        color: #f8fafc;
        transform: translateY(-1px);
    }

    .hero__glossary {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: var(--spacing-sm);
    }

    .hero__term {
        position: relative;
        display: inline-flex;
        align-items: center;
    }

    .hero__term-trigger {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(125, 211, 252, 0.3);
        border-radius: 999px;
        padding: 0.45rem 1.1rem;
        color: rgba(226, 232, 240, 0.9);
        font-size: 0.85rem;
        transition: border-color 180ms ease, background 180ms ease;
    }

    .hero__term-trigger:hover,
    .hero__term-trigger:focus-visible {
        border-color: rgba(249, 115, 22, 0.6);
        background: rgba(15, 23, 42, 0.8);
    }

    .hero__term span {
        position: absolute;
        left: 0;
        bottom: calc(100% + 0.5rem);
        width: max(16rem, 220px);
        background: rgba(15, 23, 42, 0.92);
        border: 1px solid rgba(148, 163, 184, 0.35);
        border-radius: 12px;
        padding: 0.75rem 1rem;
        font-size: 0.85rem;
        color: rgba(226, 232, 240, 0.95);
        opacity: 0;
        transform: translateY(6px);
        pointer-events: none;
        transition: opacity 160ms ease, transform 160ms ease;
        box-shadow: 0 18px 30px rgba(15, 23, 42, 0.35);
    }

    .hero__term span.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .hero__particles {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }

    .hero__particle {
        position: absolute;
        width: 0.9rem;
        height: 0.9rem;
        border-radius: 50%;
        background: linear-gradient(120deg, rgba(125, 211, 252, 0.9), rgba(249, 115, 22, 0.9));
        filter: drop-shadow(0 0 10px rgba(125, 211, 252, 0.45));
        top: 50%;
        left: 50%;
        transform-origin: -6rem calc(-3rem - var(--particle-index) * 0.2rem);
    }

    @media (max-width: 960px) {
        .hero {
            grid-template-columns: 1fr;
            text-align: center;
        }

        .hero__visual {
            order: -1;
        }

        .hero__title,
        .hero__copy,
        .hero__summary {
            justify-items: center;
            text-align: center;
        }

        .hero__summary li {
            padding-left: 0;
        }

        .hero__summary li::before {
            left: 50%;
            transform: translateX(-50%);
            top: -0.1rem;
        }

        .hero__term span {
            left: 50%;
            transform: translate(-50%, 6px);
        }

        .hero__term span.visible {
            transform: translate(-50%, 0);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .hero__particle {
            display: none;
        }

        .hero__term span,
        .hero__audio,
        .hero__cta {
            transition: none;
        }
    }
</style>
