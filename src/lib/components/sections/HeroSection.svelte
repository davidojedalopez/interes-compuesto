<script lang="ts">
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import { ensureGsapRegistered, gsap } from '@animations/gsap';
    import LottiePlaceholder from '../graphics/LottiePlaceholder.svelte';

    type Term = { label: string; description: string };

    const terms: Term[] = [
        {
            label: 'Capital',
            description: 'El monto inicial que decides invertir: tu semilla de partida.'
        },
        {
            label: 'Tiempo',
            description: 'Los años que dejas trabajar al dinero para que crezca sin prisas.'
        },
        {
            label: 'Tasa',
            description: 'El porcentaje que se añade cada periodo; es el sazón que acelera el crecimiento.'
        }
    ];

    let root: HTMLElement;
    let reduceMotion = false;

    onMount(() => {
        if (!browser) return;

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        reduceMotion = mediaQuery.matches;

        const updateReduceMotion = (event: MediaQueryListEvent) => {
            reduceMotion = event.matches;
        };

        mediaQuery.addEventListener('change', updateReduceMotion);

        ensureGsapRegistered();
        const ctx = gsap.context(() => {
            gsap.from('.hero__title span', {
                opacity: 0,
                y: 38,
                stagger: 0.16,
                duration: 0.9,
                ease: 'power3.out'
            });

            gsap.from('.hero__lede', {
                opacity: 0,
                y: 28,
                delay: 0.5,
                duration: 0.9,
                ease: 'power3.out'
            });

            if (!reduceMotion) {
                gsap.fromTo(
                    '.hero__particle',
                    { opacity: 0, scale: 0.6 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 1.1,
                        stagger: 0.18,
                        ease: 'power2.out'
                    }
                );

                gsap.to('.hero__particle', {
                    rotate: 360,
                    duration: 18,
                    ease: 'none',
                    repeat: -1,
                    transformOrigin: 'center'
                });
            }
        }, root);

        return () => {
            ctx.revert();
            mediaQuery.removeEventListener('change', updateReduceMotion);
        };
    });
</script>

<div class="hero" bind:this={root}>
    <div class="hero__copy">
        <h1 class="hero__title" id="inicio">
            <span>Tu futuro</span>
            <span>se cocina</span>
            <span>a fuego lento</span>
        </h1>
        <p class="hero__lede">
            Una Border Collie curiosa te abre la puerta a la historia del interés compuesto. En unos
            minutos descubrirás cómo cada peso que cuidas hoy invita a más billetes a la fiesta del
            mañana.
        </p>
        <div class="hero__actions">
            <a class="hero__cta" href="#historia">Explorar la historia</a>
            <p class="hero__note" aria-live="polite">
                ¿Sensibilidad al movimiento? Las animaciones se adaptan automáticamente.
            </p>
        </div>
        <div class="hero__glossary" aria-label="Definiciones clave">
            {#each terms as term}
                <details class="hero__term">
                    <summary>{term.label}</summary>
                    <p>{term.description}</p>
                </details>
            {/each}
        </div>
    </div>
    <div class="hero__visual">
        <span class="hero__particle" aria-hidden="true"></span>
        <span class="hero__particle hero__particle--secondary" aria-hidden="true"></span>
        <span class="hero__particle hero__particle--tertiary" aria-hidden="true"></span>
        <LottiePlaceholder label="Ilustración animada de la guía perruna cuidando un jardín de monedas" />
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
        gap: var(--spacing-lg);
    }

    .hero__title {
        display: inline-grid;
        gap: 0.35rem;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: clamp(2.2rem, 4vw, 3.4rem);
    }

    .hero__title span {
        display: inline-block;
        background: linear-gradient(120deg, #22d3ee, var(--color-accent));
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
    }

    .hero__lede {
        font-size: clamp(1.05rem, 2vw, 1.25rem);
        color: var(--color-text-muted);
        line-height: 1.8;
    }

    .hero__actions {
        display: grid;
        gap: 0.45rem;
        align-content: start;
    }

    .hero__cta {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.85rem 1.6rem;
        border-radius: 999px;
        background: var(--color-accent);
        color: #0f172a;
        font-weight: 600;
        text-decoration: none;
        transition: transform 180ms ease, box-shadow 180ms ease;
    }

    .hero__cta:hover,
    .hero__cta:focus-visible {
        transform: translateY(-2px);
        box-shadow: 0 18px 36px rgba(249, 115, 22, 0.35);
    }

    .hero__note {
        font-size: 0.85rem;
        color: rgba(226, 232, 240, 0.75);
    }

    .hero__glossary {
        display: grid;
        gap: 0.75rem;
        align-content: start;
    }

    .hero__term {
        background: rgba(15, 23, 42, 0.55);
        border: 1px solid rgba(148, 163, 184, 0.3);
        border-radius: 16px;
        padding: 0.75rem 1rem;
        transition: border-color 160ms ease;
    }

    .hero__term[open] {
        border-color: rgba(56, 189, 248, 0.75);
    }

    .hero__term summary {
        cursor: pointer;
        list-style: none;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    .hero__term summary::-webkit-details-marker {
        display: none;
    }

    .hero__term p {
        margin-top: 0.5rem;
        font-size: 0.95rem;
        line-height: 1.5;
        color: rgba(226, 232, 240, 0.85);
    }

    .hero__visual {
        display: grid;
        place-items: center;
        position: relative;
    }

    .hero__particle {
        position: absolute;
        width: clamp(220px, 24vw, 320px);
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.35), rgba(15, 23, 42, 0));
        filter: blur(0px);
        mix-blend-mode: screen;
    }

    .hero__particle--secondary {
        width: clamp(140px, 16vw, 220px);
        background: radial-gradient(circle at 70% 30%, rgba(249, 115, 22, 0.45), rgba(15, 23, 42, 0));
    }

    .hero__particle--tertiary {
        width: clamp(120px, 14vw, 180px);
        background: radial-gradient(circle at 45% 65%, rgba(59, 130, 246, 0.35), rgba(15, 23, 42, 0));
    }

    @media (max-width: 960px) {
        .hero {
            grid-template-columns: 1fr;
            text-align: center;
        }

        .hero__visual {
            order: -1;
        }

        .hero__title {
            justify-items: center;
        }

        .hero__copy {
            justify-items: center;
        }

        .hero__glossary {
            text-align: left;
            width: min(420px, 100%);
            justify-self: center;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .hero__cta {
            transition: none;
        }

        .hero__particle {
            display: none;
        }
    }
</style>
