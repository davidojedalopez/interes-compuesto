<script lang="ts">
    import {
        ClosingSection,
        HeroSection,
        InteractionTeaser,
        InteractiveSandbox,
        ScrollSection,
        StoryScroller
    } from '$lib';
</script>

<ScrollSection id="inicio" label="Portal de bienvenida" tone="surface">
    <HeroSection />
</ScrollSection>

<ScrollSection id="historia" label="Recorrido narrativo" tone="highlight">
    <StoryScroller />
</ScrollSection>

<ScrollSection id="visualizaciones" label="Laboratorio interactivo" tone="surface">
    <InteractiveSandbox />
</ScrollSection>

<ScrollSection id="interaccion" label="Celebración y próximos pasos" tone="highlight">
    <InteractionTeaser />
</ScrollSection>

<ScrollSection id="cierre" label="Epílogo inspirador">
    <ClosingSection />
</ScrollSection>
