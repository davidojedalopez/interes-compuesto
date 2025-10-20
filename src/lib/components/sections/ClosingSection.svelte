<script lang="ts">
    import { browser } from '$app/environment';

    const takeaways = [
        'Dale tiempo a tus aportaciones: la fórmula premia la constancia y los refuerzos extraordinarios.',
        'Haz seguimiento de tus metas cada trimestre para ajustar aportes y tasas realistas.',
        'Comparte la historia con tu familia: adaptar el vocabulario por edades mantiene viva la conversación financiera.'
    ];

    const resources = [
        {
            title: 'Calculadora descargable',
            description: 'Hoja de cálculo con fórmulas listas para copiar y pegar en tu planeación personal.',
            href: 'https://docs.google.com'
        },
        {
            title: 'Guía rápida para automatizar aportes',
            description: 'Checklist de pasos para programar transferencias en banca digital mexicana.',
            href: 'https://www.condusef.gob.mx/'
        },
        {
            title: 'Glosario ampliado',
            description: 'Explicaciones en lenguaje llano de tasas, rendimientos y capitalización.',
            href: 'https://www.banxico.org.mx/'
        }
    ];

    function printSummary() {
        if (browser) {
            window.print();
        }
    }
</script>

<div class="closing" id="cierre">
    <header class="closing__header">
        <p class="closing__eyebrow">Epílogo</p>
        <h2>De la teoría a la acción cotidiana</h2>
        <p>
            Lleva la historia a tu vida diaria: programa recordatorios, comparte lo aprendido y sigue
            experimentando con los números. El jardín financiero que construimos juntos necesita visitas
            frecuentes para florecer.
        </p>
    </header>

    <div class="closing__summary" role="region" aria-label="Tarjeta resumen imprimible">
        <h3>Tarjeta resumen</h3>
        <p>
            <code class="closing__notation">A = P (1 + r / n)<sup>nt</sup></code> cobra sentido cuando lo
            conectas con hábitos concretos. Recuerda estos tres puntos antes de cerrar sesión:
        </p>
        <ul>
            {#each takeaways as takeaway}
                <li>{takeaway}</li>
            {/each}
        </ul>
        <button type="button" on:click={printSummary}>Imprimir esta ficha</button>
    </div>

    <div class="closing__resources">
        <h3>Explora más herramientas</h3>
        <ul>
            {#each resources as resource}
                <li>
                    <a href={resource.href} target="_blank" rel="noreferrer">
                        <span class="resource__title">{resource.title}</span>
                        <span class="resource__description">{resource.description}</span>
                    </a>
                </li>
            {/each}
        </ul>
    </div>

    <div class="closing__contact">
        <p>
            ¿Quieres compartir sugerencias o recibir nuevas actividades? Escribe a
            <a href="mailto:hola@interescompuesto.com.mx">hola@interescompuesto.com.mx</a> y cuéntanos cómo
            usas el interés compuesto en casa, la escuela o el trabajo.
        </p>
    </div>
</div>

<style>
    .closing {
        display: grid;
        gap: clamp(1.75rem, 5vw, 2.75rem);
        padding: clamp(2.5rem, 8vw, 4rem) 0;
        max-width: 940px;
        margin-inline: auto;
        text-align: center;
    }

    .closing__header {
        display: grid;
        gap: 0.75rem;
        margin-inline: auto;
        max-width: 620px;
    }

    .closing__eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.3em;
        font-size: 0.8rem;
        color: rgba(226, 232, 240, 0.6);
    }

    .closing__summary {
        background: rgba(15, 23, 42, 0.6);
        border-radius: 24px;
        padding: clamp(1.75rem, 6vw, 2.6rem);
        border: 1px solid rgba(125, 211, 252, 0.25);
        display: grid;
        gap: 1rem;
        text-align: left;
    }

    .closing__summary ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 0.75rem;
    }

    .closing__summary li {
        padding-left: 1.5rem;
        position: relative;
        line-height: 1.6;
    }

    .closing__summary li::before {
        content: '✦';
        position: absolute;
        left: 0;
        top: 0.2rem;
        color: rgba(249, 115, 22, 0.9);
    }

    .closing__summary code {
        font-family: 'IBM Plex Mono', 'Fira Code', monospace;
        font-size: 0.95em;
        color: rgba(125, 211, 252, 0.9);
    }

    .closing__summary button {
        justify-self: start;
        border-radius: 999px;
        border: 1px solid rgba(249, 115, 22, 0.5);
        background: rgba(249, 115, 22, 0.15);
        color: rgba(249, 115, 22, 0.95);
        padding: 0.6rem 1.4rem;
        font-weight: 600;
        transition: transform 160ms ease;
    }

    .closing__summary button:hover,
    .closing__summary button:focus-visible {
        transform: translateY(-2px);
    }

    .closing__resources {
        display: grid;
        gap: 1rem;
    }

    .closing__resources ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 0.9rem;
    }

    .closing__resources li a {
        display: grid;
        gap: 0.25rem;
        background: rgba(15, 23, 42, 0.55);
        border-radius: 18px;
        padding: 1rem 1.4rem;
        border: 1px solid rgba(148, 163, 184, 0.2);
        color: inherit;
        text-decoration: none;
        transition: border-color 160ms ease, transform 160ms ease;
    }

    .closing__resources li a:hover,
    .closing__resources li a:focus-visible {
        border-color: rgba(249, 115, 22, 0.6);
        transform: translateY(-2px);
    }

    .resource__title {
        font-weight: 600;
    }

    .resource__description {
        color: rgba(226, 232, 240, 0.78);
        font-size: 0.95rem;
    }

    .closing__contact {
        color: rgba(226, 232, 240, 0.85);
    }

    .closing__contact a {
        color: var(--color-accent);
        text-decoration: none;
    }

    .closing__contact a:hover,
    .closing__contact a:focus-visible {
        text-decoration: underline;
    }

    @media (max-width: 720px) {
        .closing__summary {
            text-align: left;
        }

        .closing {
            text-align: left;
        }

        .closing__resources li a {
            text-align: left;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .closing__summary button,
        .closing__resources li a {
            transition: none;
        }
    }
</style>
