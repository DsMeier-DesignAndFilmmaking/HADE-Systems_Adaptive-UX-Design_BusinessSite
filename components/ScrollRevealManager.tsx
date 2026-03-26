"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_TARGET_SELECTOR = "[data-reveal], .load-into-view";
const BOT_USER_AGENT_REGEX =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|linkedinbot|mediapartners-google|adsbot-google|duckduckbot|yandexbot|baiduspider/i;

let observer: IntersectionObserver | null = null;
let failSafeTimer: number | null = null;

function teardownScrollAnimations() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  if (failSafeTimer !== null) {
    window.clearTimeout(failSafeTimer);
    failSafeTimer = null;
  }
}

function revealElement(element: HTMLElement, immediate = false) {
  if (immediate) {
    element.style.transitionDelay = "0ms";
  }

  element.classList.remove("reveal-init");
  element.classList.add("reveal-in");
}

function shouldBypassAnimations() {
  const prefersMotion = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  const isBot = BOT_USER_AGENT_REGEX.test(navigator.userAgent);

  return isBot || !prefersMotion || typeof IntersectionObserver === "undefined";
}

export function initScrollAnimations() {
  teardownScrollAnimations();

  const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_TARGET_SELECTOR));
  if (targets.length === 0) {
    document.documentElement.classList.remove("reveal-enabled");
    return;
  }

  if (shouldBypassAnimations()) {
    document.documentElement.classList.remove("reveal-enabled");
    targets.forEach((element) => revealElement(element, true));
    return;
  }

  const pending = new Set<HTMLElement>();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target as HTMLElement;
        revealElement(element);
        pending.delete(element);
        observer?.unobserve(element);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  targets.forEach((element) => {
    const delay = Number(element.dataset.revealDelay ?? "0");
    element.style.transitionDelay = Number.isFinite(delay) ? `${Math.max(0, delay)}ms` : "0ms";

    if (element.classList.contains("reveal-in")) return;

    const rect = element.getBoundingClientRect();
    const isInViewport = rect.top < viewportHeight * 0.95 && rect.bottom > 0;
    if (isInViewport) {
      revealElement(element);
      return;
    }

    element.classList.add("reveal-init");
    pending.add(element);
    observer?.observe(element);
  });

  document.documentElement.classList.add("reveal-enabled");

  failSafeTimer = window.setTimeout(() => {
    pending.forEach((element) => {
      revealElement(element, true);
      observer?.unobserve(element);
    });
    pending.clear();
    teardownScrollAnimations();
  }, 3000);
}

export function ScrollRevealManager() {
  const pathname = usePathname();

  useEffect(() => {
    let rafA = 0;
    let rafB = 0;

    rafA = window.requestAnimationFrame(() => {
      rafB = window.requestAnimationFrame(() => {
        initScrollAnimations();
      });
    });

    return () => {
      window.cancelAnimationFrame(rafA);
      window.cancelAnimationFrame(rafB);
      teardownScrollAnimations();
    };
  }, [pathname]);

  return null;
}
