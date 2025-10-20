import { browser } from '$app/environment';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type ScrollAnimationConfig = {
    trigger: gsap.DOMTarget;
    timeline?: gsap.core.Timeline;
    scrub?: boolean | number;
    start?: string;
    end?: string;
    once?: boolean;
    markers?: boolean;
};

let isRegistered = false;

export function ensureGsapRegistered() {
    if (!browser || isRegistered) return;
    gsap.registerPlugin(ScrollTrigger);
    isRegistered = true;
}

export function createScrollAnimation(
    node: HTMLElement,
    config: ScrollAnimationConfig,
    onCreate?: (timeline: gsap.core.Timeline) => void
) {
    ensureGsapRegistered();

    const timeline = config.timeline ?? gsap.timeline({ paused: true });

    const trigger = ScrollTrigger.create({
        trigger: config.trigger,
        scrub: config.scrub ?? true,
        start: config.start ?? 'top center',
        end: config.end ?? 'bottom center',
        toggleActions: config.once ? 'play none none none' : 'play reverse play reverse',
        markers: config.markers ?? false,
        animation: timeline
    });

    onCreate?.(timeline);

    return {
        destroy() {
            trigger.kill();
            timeline.kill();
        }
    };
}

export { gsap, ScrollTrigger };
