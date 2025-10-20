<script lang="ts">
    import { onMount } from 'svelte';
    import lottie from 'lottie-web';

    export let label = 'Animación en construcción';

    let container: HTMLDivElement;

    onMount(() => {
        // Placeholder animation: simple pulsating circle drawn procedurally.
        const animation = lottie.loadAnimation({
            container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: {
                v: '5.7.8',
                fr: 60,
                ip: 0,
                op: 120,
                w: 400,
                h: 400,
                nm: 'placeholder',
                ddd: 0,
                assets: [],
                layers: [
                    {
                        ddd: 0,
                        ind: 1,
                        ty: 4,
                        nm: 'Ring',
                        sr: 1,
                        ks: {
                            o: { a: 0, k: 100 },
                            r: { a: 0, k: 0 },
                            p: { a: 0, k: [200, 200, 0] },
                            a: { a: 0, k: [0, 0, 0] },
                            s: { a: 0, k: [100, 100, 100] }
                        },
                        shapes: [
                            {
                                ty: 'el',
                                p: { a: 0, k: [0, 0] },
                                s: { a: 0, k: [260, 260] },
                                nm: 'Ellipse Path 1'
                            },
                            {
                                ty: 'st',
                                c: { a: 0, k: [0.976, 0.451, 0.129, 1] },
                                o: { a: 0, k: 100 },
                                w: { a: 0, k: 12 },
                                lc: 2,
                                lj: 2,
                                ml: 4,
                                nm: 'Stroke 1'
                            },
                            {
                                ty: 'tr',
                                p: { a: 0, k: [0, 0] },
                                a: { a: 0, k: [0, 0] },
                                s: { a: 0, k: [100, 100] },
                                r: { a: 0, k: 0 },
                                o: { a: 0, k: 100 },
                                sk: { a: 0, k: 0 },
                                sa: { a: 0, k: 0 }
                            }
                        ],
                        ao: 0,
                        ef: [
                            {
                                ty: 5,
                                nm: 'Pulsar',
                                en: 1,
                                ef: [
                                    { ty: 7, nm: 'Opacity', mn: 'ADBE Turbulent Noise-0001', v: { a: 1, k: [
                                                { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [20] },
                                                { t: 120, s: [90] }
                                            ] } },
                                    { ty: 0, nm: 'Frequency', mn: 'ADBE Turbulent Noise-0002', v: { a: 0, k: 1.2 } }
                                ]
                            }
                        ]
                    }
                ],
                markers: []
            }
        });

        return () => {
            animation?.destroy();
        };
    });
</script>

<div class="lottie" aria-label={label} bind:this={container}>
    <div class="lottie__fallback">{label}</div>
</div>

<style>
    .lottie {
        width: min(360px, 100%);
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, rgba(14, 165, 233, 0.35), rgba(15, 23, 42, 0.8));
        display: grid;
        place-items: center;
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(148, 163, 184, 0.2);
    }

    .lottie__fallback {
        font-size: 0.75rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        text-align: center;
        padding: 1rem;
        color: var(--color-text-muted);
    }
</style>
