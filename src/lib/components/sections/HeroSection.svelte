<script lang="ts">
    import { onMount } from 'svelte';
    import { ensureGsapRegistered, gsap } from '@animations/gsap';
    import LottiePlaceholder from '../graphics/LottiePlaceholder.svelte';

    let root: HTMLElement;

    onMount(() => {
        ensureGsapRegistered();
        const ctx = gsap.context(() => {
            gsap.from('.hero__title span', {
                opacity: 0,
                y: 35,
                stagger: 0.15,
                duration: 0.85,
                ease: 'power3.out'
            });

            gsap.from('.hero__lede', {
                opacity: 0,
                y: 25,
                delay: 0.6,
                duration: 0.9,
                ease: 'power3.out'
            });
        }, root);

        return () => ctx.revert();
    });
</script>

<div class="hero" bind:this={root}>
    <div class="hero__copy">
        <h1 class="hero__title" id="inicio">
            <span>Una</span>
            <span>experiencia</span>
            <span>narrativa</span>
        </h1>
        <p class="hero__lede">
            Estamos preparando un recorrido interactivo sobre el poder del interés compuesto. Este es el
            punto de partida para una historia llena de datos, animaciones y travesuras perrunas.
        </p>
        <button type="button">Avísame cuando esté listo</button>
    </div>
    <div class="hero__visual">
        <LottiePlaceholder label="Animación canina en progreso" />
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
    }

    .hero__title {
        display: inline-grid;
        gap: 0.35rem;
        text-transform: uppercase;
        letter-spacing: 0.2em;
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
    }

    .hero__visual {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
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
    }
</style>
