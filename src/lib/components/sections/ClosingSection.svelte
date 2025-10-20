<script lang="ts">
    import { onMount } from 'svelte';

    let supporters = 1842;

    onMount(() => {
        const increment = () => {
            supporters = supporters + Math.floor(Math.random() * 3);
        };

        const interval = setInterval(increment, 4200);
        return () => clearInterval(interval);
    });
</script>

<div class="closing" id="cierre">
    <h2>Esto es apenas el comienzo</h2>
    <p>
        Estamos afinando la experiencia completa: guías descargables, recordatorios programables y animaciones que te
        acompañarán cada vez que alcances un nuevo múltiplo del ahorro inicial.
    </p>
    <p>
        Únete a la lista temprana para recibir la checklist de metas y actualizaciones exclusivas. También puedes
        escribirnos a <a href="mailto:hola@interescompuesto.com.mx">hola@interescompuesto.com.mx</a> si quieres sumar
        ideas o datasets.
    </p>
    <div class="closing__cta">
        <button type="button">Quiero la checklist</button>
        <button type="button" class="secondary">Manténganme al tanto</button>
    </div>
    <p class="closing__meta">{supporters.toLocaleString('es-MX')} personas ya están siguiendo el proyecto.</p>
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

    .closing a {
        color: var(--color-accent);
        text-decoration: none;
    }

    .closing a:hover,
    .closing a:focus-visible {
        text-decoration: underline;
    }

    .closing__cta {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
        margin-top: var(--spacing-sm);
    }

    .closing__cta button {
        background: linear-gradient(120deg, rgba(249, 115, 22, 0.85), rgba(249, 115, 22, 0.65));
        border: none;
        color: #0f172a;
        font-weight: 600;
        padding: 0.8rem 1.8rem;
        border-radius: 999px;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        cursor: pointer;
        transition: transform 150ms ease, box-shadow 150ms ease;
        box-shadow: 0 12px 30px rgba(249, 115, 22, 0.35);
    }

    .closing__cta button:hover,
    .closing__cta button:focus-visible {
        transform: translateY(-2px);
        box-shadow: 0 16px 38px rgba(249, 115, 22, 0.4);
    }

    .closing__cta .secondary {
        background: rgba(15, 23, 42, 0.9);
        color: rgba(226, 232, 240, 0.95);
        border: 1px solid rgba(148, 163, 184, 0.4);
        box-shadow: none;
    }

    .closing__meta {
        font-size: 0.9rem;
        color: rgba(148, 163, 184, 0.9);
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }
</style>
