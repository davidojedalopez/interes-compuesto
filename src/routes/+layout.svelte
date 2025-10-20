<script lang="ts">
    import '@styles/global.css';
    import AppShell from '$lib/components/layout/AppShell.svelte';

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href="/favicon.svg" />
    <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
        crossorigin="anonymous"
    />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700&display=swap"
        rel="stylesheet"
    />
    <meta name="description" content="Sitio narrativo sobre el interés compuesto en construcción." />
</svelte:head>

<AppShell>
    {@render children?.()}
</AppShell>
