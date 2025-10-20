<script lang="ts">
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';

    const targetSubscribers = 3826;
    let displayedSubscribers = 3180;
    let interval: ReturnType<typeof setInterval> | undefined;

    onMount(() => {
        if (!browser) return;
        const step = Math.ceil((targetSubscribers - displayedSubscribers) / 40);
        interval = setInterval(() => {
            displayedSubscribers += step;
            if (displayedSubscribers >= targetSubscribers) {
                displayedSubscribers = targetSubscribers;
                clearInterval(interval);
            }
        }, 60);

        return () => {
            if (interval) clearInterval(interval);
        };
    });
</script>

<div class="closing" id="cierre">
    <h2>Únete a la manada precavida</h2>
    <p>
        Estamos construyendo herramientas para que planifiques objetivos, automatices aportaciones y
        compartas los avances con otros entusiastas del interés compuesto.
    </p>
    <p>
        Déjanos tu correo para recibir la checklist de lanzamiento y los experimentos más recientes.
    </p>
    <form class="closing__form" on:submit|preventDefault>
        <label for="email" class="sr-only">Correo electrónico</label>
        <input id="email" type="email" placeholder="tucorreo@ejemplo.com" required />
        <button type="submit">Quiero las novedades</button>
    </form>
    <p class="closing__badge">{displayedSubscribers.toLocaleString('es-MX')} personas ya se apuntaron.</p>
</div>

<style>
    .closing {
        display: grid;
        gap: var(--spacing-md);
        text-align: center;
        padding: var(--spacing-xl) 0;
        max-width: 840px;
        margin-inline: auto;
    }

    .closing h2 {
        font-size: clamp(2rem, 4vw, 2.8rem);
    }

    .closing p {
        margin: 0;
        color: var(--color-text-muted);
        line-height: 1.6;
    }

    .closing__form {
        display: inline-flex;
        gap: 0.75rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: var(--spacing-sm);
    }

    .closing__form input[type='email'] {
        padding: 0.9rem 1.1rem;
        border-radius: 999px;
        border: 1px solid rgba(148, 163, 184, 0.35);
        background: rgba(15, 23, 42, 0.6);
        color: var(--color-text-primary);
        min-width: clamp(220px, 40vw, 320px);
    }

    .closing__form button {
        padding: 0.9rem 1.6rem;
        border-radius: 999px;
        border: 1px solid rgba(249, 115, 22, 0.4);
        background: linear-gradient(120deg, rgba(249, 115, 22, 0.35), rgba(56, 189, 248, 0.25));
        color: var(--color-text-primary);
        text-transform: uppercase;
        letter-spacing: 0.2em;
    }

    .closing__badge {
        color: var(--color-accent);
        font-weight: 600;
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

    @media (max-width: 640px) {
        .closing__form {
            width: 100%;
        }

        .closing__form button {
            width: 100%;
        }
    }
</style>
