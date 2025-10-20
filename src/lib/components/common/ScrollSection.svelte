<script lang="ts">
    export let id: string;
    export let label: string;
    export let tone: 'default' | 'surface' | 'highlight' = 'default';
</script>

<section
    id={id}
    data-section
    data-label={label}
    class:surface={tone === 'surface'}
    class:highlight={tone === 'highlight'}
>
    <div class="section-content">
        <slot />
    </div>
</section>

<style>
    section.surface {
        background: linear-gradient(160deg, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.25));
        border-radius: 32px;
        margin: var(--spacing-xl) auto;
        max-width: calc(var(--content-max-width) + 4rem);
        padding: calc(var(--spacing-xl) + var(--spacing-md)) 2rem;
        box-shadow: 0 40px 80px rgba(15, 23, 42, 0.25);
    }

    section.highlight {
        background: linear-gradient(140deg, var(--color-accent-soft), rgba(249, 115, 22, 0.05));
        border: 1px solid rgba(249, 115, 22, 0.25);
        border-radius: 24px;
        margin: var(--spacing-lg) auto;
        max-width: calc(var(--content-max-width) + 2rem);
    }

    @media (max-width: 768px) {
        section.surface {
            border-radius: 24px;
            padding: calc(var(--spacing-lg) + 1rem) 1.25rem;
        }
    }
</style>
