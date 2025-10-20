<div class="closing" id="cierre">
    <h2>Epílogo — De la teoría a la acción</h2>
    <p>
        Ya dominas las metáforas, la fórmula y los ajustes principales. Lo que sigue es convertir este
        entusiasmo en un hábito. La guía perruna seguirá enviando recordatorios para que tu jardín financiero
        no deje de florecer.
    </p>
    <section class="closing__summary" aria-label="Tarjeta resumen imprimible">
        <h3>Tarjeta resumen lista para imprimir</h3>
        <ul>
            <li>Interés compuesto = capital + aportes + tiempo trabajando en equipo.</li>
            <li>Revisa tus parámetros cada seis meses y registra cualquier aumento de ingresos.</li>
            <li>Programa una transferencia automática esta semana: el primer paso es el más valioso.</li>
        </ul>
        <p class="closing__disclaimer">
            Muy pronto podrás descargar esta tarjeta en PDF y compartirla con tu familia o equipo.
        </p>
    </section>
    <div class="closing__links">
        <a class="closing__cta" href="mailto:hola@interescompuesto.com.mx">Pedir acompañamiento personalizado</a>
        <a class="closing__cta" href="#visualizaciones">Recalcular mi escenario</a>
    </div>
    <div class="closing__resources">
        <h3>Recursos externos recomendados</h3>
        <ul>
            <li>
                <a href="https://www.gob.mx/educacionfinanciera" target="_blank" rel="noreferrer"
                    >Educación financiera (Gobierno de México)</a
                >
            </li>
            <li>
                <a href="https://www.condusef.gob.mx/?p=educacion_financiera" target="_blank" rel="noreferrer"
                    >CONDUSEF: calculadoras y consejos</a
                >
            </li>
            <li>
                <a href="https://www.investopedia.com/terms/c/compoundinterest.asp" target="_blank" rel="noreferrer"
                    >Glosario internacional sobre interés compuesto</a
                >
            </li>
        </ul>
    </div>
</div>

<style>
    .closing {
        display: grid;
        gap: var(--spacing-lg);
        text-align: center;
        padding: var(--spacing-xl) 0;
        max-width: 940px;
        margin-inline: auto;
    }

    .closing__summary {
        background: rgba(15, 23, 42, 0.6);
        border-radius: 24px;
        border: 1px solid rgba(148, 163, 184, 0.25);
        padding: clamp(1.5rem, 4vw, 2.5rem);
        text-align: left;
        display: grid;
        gap: 1rem;
    }

    .closing__summary h3 {
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: 1rem;
        color: rgba(148, 163, 184, 0.95);
    }

    .closing__summary ul {
        margin: 0;
        padding-left: 1.2rem;
        display: grid;
        gap: 0.5rem;
        color: rgba(226, 232, 240, 0.9);
        line-height: 1.6;
    }

    .closing__disclaimer {
        font-size: 0.85rem;
        color: rgba(148, 163, 184, 0.85);
    }

    .closing__links {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
    }

    .closing__cta {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.85rem 1.5rem;
        border-radius: 999px;
        background: var(--color-accent);
        color: #0f172a;
        font-weight: 600;
        text-decoration: none;
        transition: transform 180ms ease, box-shadow 180ms ease;
    }

    .closing__cta:hover,
    .closing__cta:focus-visible {
        transform: translateY(-2px);
        box-shadow: 0 18px 36px rgba(249, 115, 22, 0.35);
    }

    .closing__resources {
        display: grid;
        gap: 0.75rem;
    }

    .closing__resources h3 {
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.95rem;
        color: rgba(148, 163, 184, 0.9);
    }

    .closing__resources ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0.75rem;
    }

    .closing__resources a {
        color: rgba(226, 232, 240, 0.9);
        text-decoration: none;
    }

    .closing__resources a:hover,
    .closing__resources a:focus-visible {
        color: var(--color-accent);
        text-decoration: underline;
    }

    @media (max-width: 768px) {
        .closing {
            padding-inline: 1rem;
        }

        .closing__summary {
            text-align: left;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .closing__cta {
            transition: none;
        }
    }
</style>
