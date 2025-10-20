<script lang="ts">
    import { onMount } from 'svelte';
    import { ensureGsapRegistered, gsap } from '@animations/gsap';

    const principal = 25000;

    let rate = 8;
    let years = 12;
    let prefersReducedMotion = false;
    let root: HTMLElement;
    let progressEl: HTMLDivElement;

    const formatCurrency = (value: number) =>
        value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

    onMount(() => {
        ensureGsapRegistered();
        prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const ctx = gsap.context(() => {
            gsap.from('.hero__title span', {
                opacity: 0,
                y: 30,
                stagger: 0.14,
                duration: 0.8,
                ease: 'power3.out'
            });

            gsap.from('.hero__lede', {
                opacity: 0,
                y: 24,
                delay: 0.4,
                duration: 0.8,
                ease: 'power3.out'
            });

            gsap.from('.hero__controls', {
                opacity: 0,
                y: 20,
                delay: 0.6,
                duration: 0.7,
                ease: 'power2.out'
            });
        }, root);

        return () => ctx.revert();
    });

    const formatYears = (value: number) => `${value} ${value === 1 ? 'año' : 'años'}`;

    const triggerSprint = () => {
        if (!progressEl || prefersReducedMotion) return;

        const width = Math.min(100, Math.max(progressPercent, 6));
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
        tl.to(progressEl, { width: `${width}%`, duration: 1.2 });
        tl.fromTo(
            '.treat',
            { y: 0 },
            { y: -12, duration: 0.35, yoyo: true, repeat: 1, stagger: 0.08, ease: 'power1.inOut' },
            '-=0.6'
        );
        tl.fromTo('.collie', { rotate: -6 }, { rotate: 6, yoyo: true, repeat: 5, duration: 0.18, ease: 'sine.inOut' }, '-=1');
    };

    $: growthFactor = Math.pow(1 + rate / 100, years);
    $: finalAmount = principal * growthFactor;
    $: totalInterest = finalAmount - principal;
    $: doublingTime = Math.log(2) / Math.log(1 + rate / 100);
    $: progressPercent = Math.min(100, (Math.min(growthFactor, 4) / 4) * 100);

    $: if (progressEl) {
        const width = Math.min(100, Math.max(progressPercent, 6));
        if (prefersReducedMotion) {
            progressEl.style.width = `${width}%`;
        } else {
            gsap.to(progressEl, { width: `${width}%`, duration: 0.6, ease: 'power2.out' });
        }
    }

    const milestoneLabels = [1, 2, 3, 4];
    const treatLevels = [1, 2, 3, 4];
</script>

<div class="hero" bind:this={root}>
    <div class="hero__copy">
        <p class="hero__eyebrow">La Border Collie del interés compuesto</p>
        <h1 class="hero__title" id="inicio">
            <span>Planifica</span>
            <span>capitaliza</span>
            <span>celebra</span>
        </h1>
        <p class="hero__lede">
            Ajusta las perillas y mira cómo un depósito disciplinado se transforma en una pista llena de recompensas. La
            mascota guía solo necesita tiempo y constancia para multiplicar cada croqueta.
        </p>
        <div class="hero__stats">
            <div>
                <p class="label">Saldo proyectado</p>
                <p class="value">{formatCurrency(finalAmount)}</p>
            </div>
            <div>
                <p class="label">Interés ganado</p>
                <p class="value">{formatCurrency(totalInterest)}</p>
            </div>
            <div>
                <p class="label">Tiempo para duplicar</p>
                <p class="value">{doublingTime.toFixed(1)} años</p>
            </div>
        </div>
        <div class="hero__controls">
            <label>
                Tasa anual
                <input type="range" min="2" max="18" step="0.5" bind:value={rate} />
                <span>{rate.toFixed(1)}%</span>
            </label>
            <label>
                Horizonte temporal
                <input type="range" min="1" max="30" step="1" bind:value={years} />
                <span>{formatYears(years)}</span>
            </label>
            <button type="button" on:click={triggerSprint}>Ver a Niebla acelerar</button>
        </div>
    </div>
    <div class="hero__visual">
        <div class="track">
            <div class="track__milestones">
                {#each milestoneLabels as milestone}
                    <div class="milestone">
                        <span>{milestone}x</span>
                    </div>
                {/each}
            </div>
            <div class="track__progress" bind:this={progressEl}>
                <div class="collie" aria-hidden="true">🐕‍🦺</div>
            </div>
            <div class="track__treats">
                {#each treatLevels as level}
                    <div class:treat-active={growthFactor >= level} class="treat" aria-hidden="true">🦴</div>
                {/each}
            </div>
        </div>
        <p class="track__caption">
            El carril se llena conforme el saldo se multiplica. Alcanzar cuatro veces el depósito inicial requiere paciencia,
            pero cada hito libera nuevas recompensas.
        </p>
    </div>
</div>

<style>
    .hero {
        position: relative;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: clamp(2rem, 8vw, 6rem);
        align-items: center;
        padding: var(--spacing-xxl) 0 var(--spacing-xl);
    }

    .hero__copy {
        display: grid;
        gap: var(--spacing-md);
    }

    .hero__eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.32em;
        font-size: 0.7rem;
        color: rgba(148, 163, 184, 0.9);
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
        font-size: 1.05rem;
        color: var(--color-text-muted);
        line-height: 1.6;
    }

    .hero__stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: var(--spacing-sm);
        background: rgba(15, 23, 42, 0.65);
        border-radius: 20px;
        padding: 1rem 1.25rem;
        border: 1px solid rgba(148, 163, 184, 0.25);
    }

    .hero__stats .label {
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.65rem;
        color: rgba(148, 163, 184, 0.9);
    }

    .hero__stats .value {
        font-size: 1.05rem;
        font-weight: 600;
    }

    .hero__controls {
        display: grid;
        gap: var(--spacing-sm);
        align-content: start;
    }

    .hero__controls label {
        display: grid;
        gap: 0.4rem;
        font-size: 0.9rem;
        color: var(--color-text-muted);
    }

    .hero__controls span {
        font-weight: 600;
        color: var(--color-text-primary);
    }

    .hero__controls input[type='range'] {
        width: 100%;
    }

    .hero__controls button {
        justify-self: start;
        margin-top: 0.25rem;
        background: linear-gradient(120deg, rgba(249, 115, 22, 0.9), rgba(249, 115, 22, 0.6));
        border: none;
        color: #0f172a;
        font-weight: 600;
        padding: 0.75rem 1.5rem;
        border-radius: 999px;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        cursor: pointer;
        transition: transform 150ms ease, box-shadow 150ms ease;
        box-shadow: 0 12px 30px rgba(249, 115, 22, 0.35);
    }

    .hero__controls button:hover,
    .hero__controls button:focus-visible {
        transform: translateY(-2px);
        box-shadow: 0 16px 40px rgba(249, 115, 22, 0.4);
    }

    .hero__visual {
        display: grid;
        gap: var(--spacing-sm);
        position: relative;
    }

    .track {
        position: relative;
        background: rgba(15, 23, 42, 0.8);
        border-radius: 28px;
        border: 1px solid rgba(148, 163, 184, 0.25);
        padding: 2rem 1.5rem 2.5rem;
        overflow: hidden;
    }

    .track__milestones {
        position: absolute;
        inset: 1.25rem 1.5rem auto;
        display: flex;
        justify-content: space-between;
        pointer-events: none;
        color: rgba(148, 163, 184, 0.8);
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.18em;
    }

    .milestone span {
        display: inline-block;
        padding: 0.35rem 0.65rem;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.75);
        border: 1px solid rgba(148, 163, 184, 0.25);
    }

    .track__progress {
        position: relative;
        height: 16px;
        background: rgba(30, 41, 59, 0.6);
        border-radius: 999px;
        border: 1px solid rgba(148, 163, 184, 0.2);
        width: 6%;
        transition: width 0.6s ease;
    }

    .collie {
        position: absolute;
        top: 50%;
        right: -1.4rem;
        transform: translateY(-50%);
        font-size: 1.5rem;
    }

    .track__treats {
        margin-top: 2.5rem;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1.25rem;
        position: relative;
    }

    .treat {
        font-size: 1.6rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 50%;
        background: rgba(15, 23, 42, 0.85);
        border: 1px solid rgba(59, 130, 246, 0.25);
        transition: transform 150ms ease, box-shadow 150ms ease;
    }

    .treat-active {
        box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.35);
        transform: translateY(-4px);
    }

    .track__caption {
        font-size: 0.9rem;
        color: rgba(226, 232, 240, 0.85);
        line-height: 1.5;
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

        .hero__controls button {
            justify-self: center;
        }

        .track__milestones {
            inset: 1.25rem 1rem auto;
        }
    }
</style>
