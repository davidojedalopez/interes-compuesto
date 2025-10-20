<script lang="ts">
    import {
        ClosingSection,
        HeroSection,
        InteractionTeaser,
        InteractiveSandbox,
        FormulaWalkthrough,
        ScrollSection,
        StoryScroller
    } from '$lib';
</script>

<ScrollSection id="inicio" label="Introducción" tone="surface">
    <HeroSection />
</ScrollSection>

<ScrollSection id="historia" label="Estructura narrativa">
    <StoryScroller />
</ScrollSection>

<ScrollSection id="formula" label="La fórmula paso a paso" tone="surface">
    <FormulaWalkthrough />
</ScrollSection>

<ScrollSection id="visualizaciones" label="Exploración de datos" tone="surface">
    <InteractiveSandbox />
</ScrollSection>

<ScrollSection id="interaccion" label="Interacciones y animaciones" tone="highlight">
    <InteractionTeaser />
</ScrollSection>

<ScrollSection id="cierre" label="Siguiente paso">
    <ClosingSection />
</ScrollSection>
