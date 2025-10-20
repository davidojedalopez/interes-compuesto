<script lang="ts">
    import { browser } from '$app/environment';
    import { onDestroy, onMount } from 'svelte';
    import { createScrollAnimation } from '@animations/gsap';

    type Achievement = {
        title: string;
        description: string;
    };

    const achievements: Achievement[] = [
        {
            title: 'Desbloqueaste la fórmula',
            description: 'Interpretaste cada símbolo y sabes aplicarlo con tus propios números.'
        },
        {
            title: 'Ajustaste aportaciones',
            description: 'Probaste con aportes periódicos y extras para encontrar un ritmo sostenible.'
        },
        {
            title: 'Diseñaste tu siguiente meta',
            description: 'Elegiste un preset o personalizaste parámetros para una meta concreta.'
        }
    ];

    type ConfettiBurst = {
        id: number;
        pieces: number[];
    };

    let panel: HTMLElement;
    let completionStates = achievements.map(() => false);
    let reduceMotion = false;
    let audioEnabled = false;
    let audioContext: AudioContext | undefined;
    let liveMessage = '';
    let messageTimeout: ReturnType<typeof setTimeout> | undefined;
    let confettiBursts: ConfettiBurst[] = [];

    function updateCompletion(index: number) {
        const wasCompleted = completionStates[index];
        completionStates = completionStates.map((value, current) => (current === index ? !value : value));

        if (!wasCompleted) {
            triggerCelebration();
            announce(`${achievements[index].title} completado.`);
        } else {
            announce(`${achievements[index].title} marcado como pendiente.`);
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
        if (!browser || reduceMotion || !audioEnabled) return;
        const context = await ensureAudioContext();
        if (!context) return;

        const now = context.currentTime;
        const gain = context.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.25, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        gain.connect(context.destination);

        [988, 1480, 1976].forEach((frequency, index) => {
            const osc = context.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, now + index * 0.05);
            osc.connect(gain);
            osc.start(now + index * 0.05);
            osc.stop(now + 1.2);
        });
    }

    function triggerCelebration() {
        if (!reduceMotion) {
            const id = Date.now();
            confettiBursts = [...confettiBursts, { id, pieces: Array.from({ length: 14 }, (_, index) => index) }];
            setTimeout(() => {
                confettiBursts = confettiBursts.filter((burst) => burst.id !== id);
            }, 1800);
        }

        void playChime();
    }

    function announce(message: string) {
        liveMessage = message;
        if (messageTimeout) {
            clearTimeout(messageTimeout);
        }
        messageTimeout = setTimeout(() => {
            liveMessage = '';
        }, 2200);
    }

    async function toggleAudio() {
        audioEnabled = !audioEnabled;
        if (audioEnabled) {
            await ensureAudioContext();
            await playChime();
        }
    }

    function triggerPrint() {
        if (browser) {
            window.print();
        }
    }

    $: completedCount = completionStates.filter(Boolean).length;
    $: progress = Math.round((completedCount / achievements.length) * 100);
    $: progressLabel = `Has completado ${completedCount} de ${achievements.length} logros.`;

    onMount(() => {
        reduceMotion = browser ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

        const controls = createScrollAnimation(
            panel,
            {
                trigger: panel,
                start: 'top 85%',
                end: 'bottom 60%',
                scrub: false,
                once: true
            },
            (timeline) => {
                timeline
                    .from('.interaction__tagline', {
                        opacity: 0,
                        y: 30,
                        duration: 0.6,
                        ease: 'power2.out'
                    })
                    .from(
                        '.interaction__list li',
                        { opacity: 0, x: -40, duration: 0.55, stagger: 0.18, ease: 'power2.out' },
                        '-=0.2'
                    );
            }
        );

        return () => controls.destroy();
    });

    onDestroy(() => {
        if (messageTimeout) {
            clearTimeout(messageTimeout);
        }
    });
</script>

<div class="interaction" bind:this={panel} id="interaccion">
    <p class="interaction__tagline">Celebración y siguientes pasos</p>
    <h3>Checklist de logros alcanzados</h3>
    <p class="interaction__intro">
        Marca cada hito cuando te sientas listo. Las campanillas y el confeti son opcionales; la idea es
        que celebres a tu ritmo y encuentres el siguiente paso claro.
    </p>

    <div class="interaction__actions">
        <button type="button" class:active={audioEnabled} on:click={toggleAudio}>
            {audioEnabled ? 'Silenciar celebraciones' : 'Activar celebraciones sonoras'}
        </button>
        <button type="button" on:click={triggerPrint}>Descargar guía imprimible</button>
        <a class="interaction__subscribe" href="mailto:hola@interescompuesto.com.mx">Suscribirme a novedades</a>
    </div>

    <div class="interaction__progress" role="img" aria-label={progressLabel}>
        <div class="interaction__progress-track">
            <div class="interaction__progress-bar" style={`--progress:${progress}%`}></div>
        </div>
        <span>{completedCount}/{achievements.length}</span>
    </div>

    <ul class="interaction__list">
        {#each achievements as achievement, index}
            <li>
                <label>
                    <input
                        type="checkbox"
                        checked={completionStates[index]}
                        on:change={() => updateCompletion(index)}
                    />
                    <span class="interaction__content">
                        <span class="interaction__title">{achievement.title}</span>
                        <span>{achievement.description}</span>
                    </span>
                    <span class="interaction__icon" aria-hidden="true">🐾</span>
                </label>
            </li>
        {/each}
    </ul>

    <div class="interaction__confetti" aria-hidden="true">
        {#each confettiBursts as burst}
            <div class="confetti-burst">
                {#each burst.pieces as piece}
                    <span style={`--index:${piece}`}></span>
                {/each}
            </div>
        {/each}
    </div>

    <p class="sr-only" aria-live="polite">{liveMessage}</p>
</div>

<style>
    .interaction {
        background: rgba(15, 23, 42, 0.5);
        border-radius: 24px;
        padding: clamp(1.8rem, 6vw, 2.75rem);
        border: 1px solid rgba(148, 163, 184, 0.25);
        display: grid;
        gap: var(--spacing-md);
        max-width: 760px;
        position: relative;
        overflow: hidden;
    }

    .interaction__tagline {
        text-transform: uppercase;
        letter-spacing: 0.28em;
        color: var(--color-accent);
        font-weight: 600;
        font-size: 0.85rem;
    }

    .interaction__intro {
        color: rgba(226, 232, 240, 0.85);
    }

    .interaction__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    .interaction__actions button,
    .interaction__subscribe {
        border-radius: 999px;
        border: 1px solid rgba(125, 211, 252, 0.4);
        background: rgba(15, 23, 42, 0.7);
        color: rgba(226, 232, 240, 0.9);
        padding: 0.6rem 1.2rem;
        text-decoration: none;
        transition: border-color 160ms ease, transform 160ms ease;
    }

    .interaction__actions button:hover,
    .interaction__actions button:focus-visible,
    .interaction__actions button.active,
    .interaction__subscribe:hover,
    .interaction__subscribe:focus-visible {
        border-color: rgba(249, 115, 22, 0.6);
        transform: translateY(-2px);
        color: #f8fafc;
    }

    .interaction__progress {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.9rem;
        color: rgba(226, 232, 240, 0.8);
    }

    .interaction__progress-track {
        flex: 1;
        height: 8px;
        border-radius: 999px;
        background: rgba(148, 163, 184, 0.18);
        overflow: hidden;
    }

    .interaction__progress-bar {
        height: 100%;
        width: var(--progress, 0%);
        background: linear-gradient(120deg, rgba(125, 211, 252, 0.9), rgba(249, 115, 22, 0.9));
        border-radius: 999px;
        transition: width 200ms ease;
    }

    .interaction__list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: var(--spacing-sm);
    }

    .interaction__list li {
        background: rgba(15, 23, 42, 0.8);
        border-radius: 18px;
        border: 1px solid rgba(59, 130, 246, 0.25);
        overflow: hidden;
    }

    .interaction__list label {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 1rem;
        align-items: center;
        padding: 1rem 1.25rem;
        cursor: pointer;
    }

    .interaction__list input[type='checkbox'] {
        width: 1.1rem;
        height: 1.1rem;
        border-radius: 4px;
        border: 2px solid rgba(125, 211, 252, 0.4);
        appearance: none;
        background: rgba(15, 23, 42, 0.9);
        position: relative;
    }

    .interaction__list input[type='checkbox']:checked {
        border-color: rgba(249, 115, 22, 0.65);
        background: rgba(249, 115, 22, 0.8);
    }

    .interaction__list input[type='checkbox']:checked::after {
        content: '';
        position: absolute;
        inset: 0.2rem;
        border-radius: 2px;
        background: #0f172a;
    }

    .interaction__content {
        display: grid;
        gap: 0.25rem;
        color: rgba(226, 232, 240, 0.92);
    }

    .interaction__title {
        font-weight: 600;
    }

    .interaction__icon {
        font-size: 1.4rem;
        transition: transform 200ms ease;
    }

    .interaction__list input[type='checkbox']:checked ~ .interaction__icon {
        transform: rotate(12deg) translateY(-4px);
    }

    .interaction__confetti {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
    }

    .confetti-burst {
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 0;
        height: 0;
    }

    .confetti-burst span {
        position: absolute;
        width: 0.4rem;
        height: 1.1rem;
        background: linear-gradient(120deg, rgba(125, 211, 252, 0.9), rgba(249, 115, 22, 0.9));
        border-radius: 4px;
        animation: confetti-fall 1.6s ease-out forwards;
        transform: rotate(calc(var(--index) * 18deg));
        transform-origin: center -1.5rem;
    }

    @keyframes confetti-fall {
        0% {
            opacity: 1;
            transform: translate(-50%, -10%) rotate(calc(var(--index) * 18deg));
        }
        100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--index) * 0.5rem), 140%) rotate(calc(var(--index) * 28deg));
        }
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
    }

    @media (max-width: 768px) {
        .interaction__actions {
            flex-direction: column;
            align-items: stretch;
        }

        .interaction__list label {
            grid-template-columns: auto 1fr;
            grid-template-rows: auto auto;
        }

        .interaction__icon {
            grid-column: span 2;
            justify-self: end;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .interaction__progress-bar,
        .interaction__actions button,
        .interaction__subscribe,
        .interaction__icon,
        .confetti-burst span {
            transition: none;
            animation: none;
        }

        .interaction__confetti {
            display: none;
        }
    }
</style>
