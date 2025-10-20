<script lang="ts">
    import { onMount } from 'svelte';
    import { createScrollAnimation } from '@animations/gsap';

    const formulaParts = [
        {
            symbol: 'P',
            label: 'Principal',
            description: 'El depósito inicial, ese primer puñado de croquetas que enciende la magia.'
        },
        {
            symbol: 'r',
            label: 'Tasa anual',
            description: 'La velocidad de crecimiento expresada como porcentaje decimal.'
        },
        {
            symbol: 'n',
            label: 'Capitalizaciones por año',
            description: 'Cuántas veces al año añadimos los intereses acumulados al saldo.'
        },
        {
            symbol: 't',
            label: 'Tiempo',
            description: 'La cantidad de años que dejamos trabajar al capital sin interrumpirlo.'
        }
    ];

    const compoundingOptions = [
        { label: 'Anual', value: 1 },
        { label: 'Semestral', value: 2 },
        { label: 'Trimestral', value: 4 },
        { label: 'Mensual', value: 12 }
    ];

    const principal = 15000;
    const rate = 0.09;
    const years = 12;

    const formatCurrency = (value: number) =>
        value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

    let section: HTMLElement;
    let compoundingIndex = 3;

    onMount(() => {
        const controls = createScrollAnimation(
            section,
            {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 60%',
                scrub: false,
                once: true
            },
            (timeline) => {
                timeline
                    .from('.formula__equation', { opacity: 0, y: 30, duration: 0.7, ease: 'power2.out' })
                    .from('.formula__part', { opacity: 0, y: 24, stagger: 0.18, duration: 0.6, ease: 'power2.out' }, '-=0.3')
                    .from('.formula__aside', { opacity: 0, x: 40, duration: 0.6, ease: 'power2.out' }, '-=0.2');
            }
        );

        return () => controls.destroy();
    });

    $: compounding = compoundingOptions[compoundingIndex];
    $: growth = Math.pow(1 + rate / compounding.value, compounding.value * years);
    $: effectiveRate = Math.pow(1 + rate / compounding.value, compounding.value) - 1;
    $: finalBalance = principal * growth;
    $: interestEarned = finalBalance - principal;
</script>

<div class="formula" bind:this={section}>
    <div class="formula__header">
        <p class="eyebrow">Fórmula en cámara lenta</p>
        <h3>Descompón el interés compuesto paso a paso</h3>
        <p>
            Esta ecuación resume todo el viaje de nuestra Border Collie financiera. Cada símbolo describe una pieza del
            rompecabezas: el dinero inicial, la tasa, las capitalizaciones y el tiempo. Ajusta la frecuencia y observa
            cómo cambia el resultado.
        </p>
    </div>

    <div class="formula__grid">
        <div class="formula__equation">
            <p class="equation">
                A = P · (1 + r / n)
                <sup>n · t</sup>
            </p>
            <div class="formula__parts">
                {#each formulaParts as part}
                    <article class="formula__part">
                        <div class="symbol">{part.symbol}</div>
                        <div>
                            <h4>{part.label}</h4>
                            <p>{part.description}</p>
                        </div>
                    </article>
                {/each}
            </div>
        </div>

        <aside class="formula__aside">
            <label>
                Capitaliza
                <input type="range" min="0" max={compoundingOptions.length - 1} bind:value={compoundingIndex} />
                <span>{compounding.label} (n = {compounding.value})</span>
            </label>
            <ul>
                <li><span>Depósito inicial:</span> {formatCurrency(principal)}</li>
                <li><span>Tasa nominal:</span> {(rate * 100).toFixed(1)}%</li>
                <li><span>Tiempo:</span> {years} años</li>
                <li><span>Rendimiento efectivo:</span> {(effectiveRate * 100).toFixed(2)}% anual</li>
                <li><span>Saldo final:</span> {formatCurrency(finalBalance)}</li>
                <li><span>Interés generado:</span> {formatCurrency(interestEarned)}</li>
            </ul>
            <p class="aside-note">
                Entre más veces se capitalice el interés, más pronto alcanzamos nuevas metas. No es magia: es disciplina
                matemática multiplicando tu esfuerzo inicial.
            </p>
        </aside>
    </div>
</div>

<style>
    .formula {
        display: grid;
        gap: var(--spacing-lg);
        background: rgba(15, 23, 42, 0.65);
        border-radius: 28px;
        border: 1px solid rgba(148, 163, 184, 0.25);
        padding: var(--spacing-xl);
    }

    .formula__header {
        display: grid;
        gap: var(--spacing-sm);
        max-width: 720px;
    }

    .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.24em;
        font-size: 0.75rem;
        color: rgba(148, 163, 184, 0.9);
    }

    .formula__grid {
        display: grid;
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
        gap: var(--spacing-lg);
        align-items: start;
    }

    .equation {
        font-family: 'IBM Plex Mono', monospace;
        font-size: clamp(1.4rem, 2vw, 1.9rem);
        margin-bottom: var(--spacing-md);
        background: rgba(15, 23, 42, 0.8);
        padding: 1.25rem;
        border-radius: 20px;
        border: 1px solid rgba(148, 163, 184, 0.2);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    .equation sup {
        font-size: 0.7em;
        margin-left: 0.25rem;
    }

    .formula__parts {
        display: grid;
        gap: var(--spacing-sm);
    }

    .formula__part {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--spacing-sm);
        align-items: start;
        background: rgba(15, 23, 42, 0.75);
        border-radius: 18px;
        border: 1px solid rgba(59, 130, 246, 0.2);
        padding: 1rem 1.25rem;
    }

    .formula__part h4 {
        font-size: 1rem;
        margin-bottom: 0.35rem;
        text-transform: uppercase;
        letter-spacing: 0.16em;
    }

    .formula__part p {
        font-size: 0.95rem;
        color: var(--color-text-muted);
        line-height: 1.5;
    }

    .symbol {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 1.25rem;
        padding: 0.55rem 0.75rem;
        border-radius: 12px;
        background: rgba(59, 130, 246, 0.18);
        border: 1px solid rgba(59, 130, 246, 0.35);
        color: rgba(191, 219, 254, 1);
    }

    .formula__aside {
        background: rgba(15, 23, 42, 0.85);
        border-radius: 20px;
        border: 1px solid rgba(148, 163, 184, 0.25);
        padding: 1.5rem;
        display: grid;
        gap: var(--spacing-sm);
    }

    .formula__aside label {
        display: grid;
        gap: 0.35rem;
        font-size: 0.9rem;
        color: var(--color-text-muted);
    }

    .formula__aside span {
        font-weight: 600;
        color: var(--color-text-primary);
    }

    .formula__aside input[type='range'] {
        width: 100%;
    }

    .formula__aside ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0.4rem;
        font-size: 0.95rem;
    }

    .formula__aside li {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
    }

    .aside-note {
        font-size: 0.9rem;
        color: rgba(226, 232, 240, 0.85);
        line-height: 1.5;
        border-top: 1px solid rgba(148, 163, 184, 0.2);
        padding-top: 0.75rem;
    }

    @media (max-width: 960px) {
        .formula {
            padding: var(--spacing-lg);
        }

        .formula__grid {
            grid-template-columns: 1fr;
        }

        .formula__aside {
            order: -1;
        }
    }
</style>
