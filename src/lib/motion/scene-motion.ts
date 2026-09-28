import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function startSceneMotion(root: HTMLElement) {
  const media = gsap.matchMedia();
  media.add(
    {
      desktop: '(min-width: 761px)',
      mobile: '(max-width: 760px)',
      allowed: '(prefers-reduced-motion: no-preference)',
    },
    (context) => {
      if (!context.conditions?.allowed) return;
      const desktop = context.conditions.desktop;
      const forest = root.querySelector('.forest-chapter');
      const gesture = root.querySelector('.ink-gesture');
      if (gesture && desktop) {
        gsap.to(gesture.querySelector('.gesture-arm'), {
          rotation: -10,
          svgOrigin: '305 250',
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: gesture,
            start: 'top 90%',
            end: 'bottom 20%',
            scrub: 0.5,
          },
        });
        gsap.fromTo(
          gesture.querySelector('.practitioner'),
          { y: 8 },
          {
            y: -8,
            ease: 'sine.inOut',
            scrollTrigger: {
              trigger: gesture,
              start: 'top 90%',
              end: 'bottom 20%',
              scrub: 0.5,
            },
          },
        );
      }
      if (forest && desktop) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: forest,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.45,
            },
          })
          .to(
            '.forest-painting',
            { scale: 1.12, yPercent: -3, ease: 'none' },
            0,
          )
          .to('.foliage-left', { xPercent: -9, rotation: -3, ease: 'none' }, 0)
          .to('.foliage-right', { xPercent: 9, rotation: 3, ease: 'none' }, 0)
          .to(
            '.forest-mist',
            { xPercent: -12, opacity: 0.25, ease: 'none' },
            0,
          );
      }
      root.querySelectorAll<SVGPathElement>('[data-draw]').forEach((path) => {
        const length = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: path.closest('section'),
              start: 'top 80%',
              end: 'bottom 80%',
              scrub: desktop ? 0.5 : true,
            },
          },
        );
      });
      root.querySelectorAll<HTMLElement>('[data-drift]').forEach((element) => {
        gsap.fromTo(
          element,
          { y: desktop ? 35 : 8 },
          {
            y: desktop ? -35 : -8,
            ease: 'none',
            scrollTrigger: {
              trigger: element.closest('section'),
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });
    },
    root,
  );
  return () => media.revert();
}
