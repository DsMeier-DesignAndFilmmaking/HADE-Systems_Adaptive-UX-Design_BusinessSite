"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const REVEAL_TARGET_SELECTOR = "[data-reveal], .load-into-view, .reveal";
const BOT_USER_AGENT_REGEX =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|linkedinbot|mediapartners-google|adsbot-google|duckduckbot|yandexbot|baiduspider/i;
const DEBUG_SCROLL_ANIMATIONS = false;

let intersectionObserver: IntersectionObserver | null = null;
let mainMutationObserver: MutationObserver | null = null;
let mainWatchObserver: MutationObserver | null = null;
let observedMainElement: HTMLElement | null = null;

let domReadyHandler: (() => void) | null = null;
let rafA: number | null = null;
let rafB: number | null = null;
let mutationMountTimer: number | null = null;
let engineEpoch = 0;

let observedTargets: WeakSet<HTMLElement> = new WeakSet();
const failSafeTimers = new Map<HTMLElement, number>();

function debugLog(message: string, element?: HTMLElement) {
  if (!DEBUG_SCROLL_ANIMATIONS) return;
  if (element) {
    console.log(`[ScrollReveal] ${message}`, element);
    return;
  }
  console.log(`[ScrollReveal] ${message}`);
}

function clearFrameQueue() {
  if (rafA !== null) {
    window.cancelAnimationFrame(rafA);
    rafA = null;
  }

  if (rafB !== null) {
    window.cancelAnimationFrame(rafB);
    rafB = null;
  }
}

function clearDomReadyListener() {
  if (!domReadyHandler) return;
  document.removeEventListener("DOMContentLoaded", domReadyHandler);
  domReadyHandler = null;
}

function clearMutationMountTimer() {
  if (mutationMountTimer !== null) {
    window.clearTimeout(mutationMountTimer);
    mutationMountTimer = null;
  }
}

function clearFailSafe(element: HTMLElement) {
  const timer = failSafeTimers.get(element);
  if (timer === undefined) return;
  window.clearTimeout(timer);
  failSafeTimers.delete(element);
}

function clearAllFailSafes() {
  failSafeTimers.forEach((timer) => window.clearTimeout(timer));
  failSafeTimers.clear();
}

function parseDelayToMs(rawDelay: string | undefined) {
  if (!rawDelay) return 0;

  const value = rawDelay.trim();
  if (value.length === 0) return 0;

  if (value.endsWith("ms")) {
    const parsed = Number.parseFloat(value.replace("ms", ""));
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  }

  if (value.endsWith("s")) {
    const parsed = Number.parseFloat(value.replace("s", ""));
    return Number.isFinite(parsed) ? Math.max(0, parsed * 1000) : 0;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function setElementDelay(element: HTMLElement) {
  const inlineDelay = element.style.getPropertyValue("--entry-delay") || undefined;
  const rawDelay = element.dataset.revealDelay ?? inlineDelay;
  const delay = parseDelayToMs(rawDelay);
  element.style.setProperty("--entry-delay", `${delay}ms`);
}

function resetElementDelay(element: HTMLElement) {
  element.style.setProperty("--entry-delay", "0ms");
}

function shouldBypassAnimations() {
  const isBot = BOT_USER_AGENT_REGEX.test(navigator.userAgent);
  const allowsMotion = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  return isBot || !allowsMotion || typeof IntersectionObserver === "undefined";
}

function isElementInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top <= viewportHeight - 50 && rect.bottom >= 0;
}

function revealElement(
  element: HTMLElement,
  source: "observer" | "immediate" | "bypass" | "fail-safe"
) {
  if (source === "bypass" || source === "fail-safe") {
    resetElementDelay(element);
  }

  element.classList.remove("reveal-init");
  element.classList.add("reveal-in");
  clearFailSafe(element);
  intersectionObserver?.unobserve(element);

  if (source === "observer") {
    debugLog("Element entered viewport", element);
  }
}

function armFailSafe(element: HTMLElement) {
  clearFailSafe(element);
  const timer = window.setTimeout(() => {
    revealElement(element, "fail-safe");
  }, 3000);
  failSafeTimers.set(element, timer);
}

function collectTargets(root: ParentNode) {
  return Array.from(root.querySelectorAll<HTMLElement>(REVEAL_TARGET_SELECTOR));
}

function watchTarget(element: HTMLElement, bypassAnimations: boolean) {
  element.classList.add("animate-trigger");
  setElementDelay(element);

  if (element.classList.contains("reveal-in")) return;

  if (bypassAnimations) {
    revealElement(element, "bypass");
    return;
  }

  if (isElementInViewport(element)) {
    revealElement(element, "immediate");
    return;
  }

  if (observedTargets.has(element)) return;

  element.classList.add("reveal-init");
  observedTargets.add(element);
  intersectionObserver?.observe(element);
  armFailSafe(element);
}

export function mountAnimations() {
  if (typeof window === "undefined") return;

  document.body.classList.add("js-enabled");
  const bypassAnimations = shouldBypassAnimations();
  document.documentElement.classList.toggle("reveal-enabled", !bypassAnimations);

  collectTargets(document).forEach((element) => {
    watchTarget(element, bypassAnimations);
  });
}

function queueMountAnimations(reason: string, token: number) {
  clearFrameQueue();
  rafA = window.requestAnimationFrame(() => {
    rafB = window.requestAnimationFrame(() => {
      if (token !== engineEpoch) return;
      mountAnimations();
      debugLog(`mountAnimations(${reason})`);
    });
  });
}

function scheduleMutationMount(reason: string, token: number) {
  clearMutationMountTimer();
  mutationMountTimer = window.setTimeout(() => {
    queueMountAnimations(reason, token);
  }, 40);
}

function bindMainMutationObserver(token: number) {
  const nextMain = document.querySelector("main");
  const mainElement = nextMain instanceof HTMLElement ? nextMain : null;

  if (mainElement === observedMainElement) return;

  observedMainElement = mainElement;
  mainMutationObserver?.disconnect();
  mainMutationObserver = null;

  if (!mainElement) return;

  mainMutationObserver = new MutationObserver(() => {
    scheduleMutationMount("main-mutation", token);
  });

  mainMutationObserver.observe(mainElement, {
    childList: true,
    subtree: true,
  });
}

function setupObservers(token: number) {
  if (typeof IntersectionObserver !== "undefined") {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealElement(entry.target as HTMLElement, "observer");
        });
      },
      {
        rootMargin: "0px 0px -50px 0px",
        threshold: 0.05,
      }
    );
  }

  bindMainMutationObserver(token);

  mainWatchObserver = new MutationObserver(() => {
    bindMainMutationObserver(token);
    scheduleMutationMount("main-layout-change", token);
  });

  mainWatchObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function runReadyLifecycle() {
  const token = engineEpoch;

  domReadyHandler = () => {
    if (token !== engineEpoch) return;
    queueMountAnimations("dom-content-loaded", token);
  };

  document.addEventListener("DOMContentLoaded", domReadyHandler, { once: true });

  if (document.readyState === "interactive" || document.readyState === "complete") {
    domReadyHandler();
  }
}

function teardown() {
  engineEpoch += 1;

  clearFrameQueue();
  clearMutationMountTimer();
  clearDomReadyListener();
  clearAllFailSafes();

  observedTargets = new WeakSet();
  observedMainElement = null;

  intersectionObserver?.disconnect();
  intersectionObserver = null;

  mainMutationObserver?.disconnect();
  mainMutationObserver = null;

  mainWatchObserver?.disconnect();
  mainWatchObserver = null;
}

function start() {
  teardown();
  const token = engineEpoch;

  setupObservers(token);
  runReadyLifecycle();
  queueMountAnimations("route-sync", token);
}

export function ScrollRevealManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams?.toString() ?? "";

  useEffect(() => {
    start();
    return () => {
      teardown();
    };
  }, [pathname, searchKey]);

  return null;
}

