export type Service = {
  id: string;
  title: string;
  priceRange: string;
  shortDescription: string;
  problem: string;
  deliverables: string[];
  outcome: string;
  ctaLabel: string;
};

export type SprintTier = {
  id: string;
  label: string;
  name: string;
  priceRange: string;
  timeline: string;
  isFeatured: boolean;
  tagline: string;
  deliverables: string[];
  ctaLabel: string;
  ctaHref: string;
};

export type CaseStudy = {
  title: string;
  sector: string;
  tier: "Adaptive UX Sprint" | "Adaptive Module Deployment" | "Adaptive System Lab";
  isPrototype: boolean;
  problem: string;
  insight: string;
  systemApplied: string;
  outcome: string[];
};

export type CTAState = "awareness" | "trust" | "conversion";

export const navLinks = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/services", label: "Services" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export const hadeLayers = [
  {
    letter: "H",
    title: "Human Signal Mapping",
    detail: "Capture friction patterns, intent markers, hesitation moments, and success behavior across key journeys."
  },
  {
    letter: "A",
    title: "Adaptive Logic Architecture",
    detail: "Translate signals into real-time decision rules that change copy, sequence, emphasis, and guidance."
  },
  {
    letter: "D",
    title: "Decision Layer Orchestration",
    detail: "Connect product states, user segments, and event triggers so the interface responds with precision."
  },
  {
    letter: "E",
    title: "Experiment + Evolution",
    detail: "Run controlled experiments and iteration loops so the adaptive system compounds over time."
  }
];

export const services: Service[] = [
  {
    id: "audit",
    title: "UX Experience Audit",
    priceRange: "$300 - $800",
    shortDescription: "Find exactly where static UX is suppressing activation and retention.",
    problem:
      "Founders often know conversion is soft, but they cannot see where users hesitate, stall, or churn in the flow.",
    deliverables: [
      "Journey teardown with friction map",
      "Signal-level analysis by user intent",
      "Prioritized opportunity backlog with quick wins",
      "60-minute walkthrough with next-step plan"
    ],
    outcome: "A clear action map to improve onboarding and activation without guessing.",
    ctaLabel: "Start With an Audit"
  },
  {
    id: "system-design",
    title: "AI Adaptive UX System Design",
    priceRange: "$2,000 - $5,000",
    shortDescription: "Design a production-ready adaptive UX engine for your product.",
    problem:
      "Most products treat every user the same, even when behavior signals show they need different guidance and paths.",
    deliverables: [
      "HADE system blueprint for your product",
      "Adaptive state and decision logic map",
      "Component-level UX specs for engineering handoff",
      "Experiment roadmap with measurable success criteria"
    ],
    outcome: "A scalable adaptive system your team can implement, test, and evolve confidently.",
    ctaLabel: "Design My Adaptive System"
  },
  {
    id: "add-ons",
    title: "Product Add-On Services",
    priceRange: "Custom scope",
    shortDescription: "Extend and operationalize the system as your product evolves.",
    problem:
      "Teams need tactical support after launch, but piecemeal fixes can break system consistency and learning loops.",
    deliverables: [
      "Adaptive onboarding copy + UX modules",
      "Decision rule tuning based on live data",
      "Quarterly optimization sprints",
      "Enablement docs for product and growth teams"
    ],
    outcome: "Continuous performance gains while preserving a coherent product system.",
    ctaLabel: "Explore Add-Ons"
  }
];

export const sprintTiers: SprintTier[] = [
  {
    id: "sprint",
    label: "Tier 1",
    name: "Adaptive UX Sprint",
    priceRange: "$4k – $7k",
    timeline: "3–5 days",
    isFeatured: true,
    tagline: "The fastest path from static UX to a working adaptive prototype.",
    deliverables: [
      "Rapid UX + behavior audit",
      "1 working adaptive prototype",
      "1–2 micro-experiments designed and ready to run",
      "Decision logic map for the prototype",
      "Loom walkthrough + system explanation"
    ],
    ctaLabel: "Book Sprint",
    ctaHref: "/contact"
  },
  {
    id: "module",
    label: "Tier 2",
    name: "Adaptive Module Deployment",
    priceRange: "$8k – $15k",
    timeline: "1–3 weeks",
    isFeatured: false,
    tagline: "Turn the prototype into a live, measurable adaptive system.",
    deliverables: [
      "Production-ready adaptive module built and deployed",
      "Behavior-triggered UI logic",
      "A/B or variant testing with success criteria",
      "Performance tracking + engineering handoff specs"
    ],
    ctaLabel: "Start Deployment",
    ctaHref: "/contact"
  },
  {
    id: "lab",
    label: "Tier 3",
    name: "Adaptive System Lab",
    priceRange: "Custom",
    timeline: "Ongoing",
    isFeatured: false,
    tagline: "Expand into a full adaptive UX ecosystem that compounds over time.",
    deliverables: [
      "Full adaptive UX system design",
      "Multi-context personalization",
      "Continuous experimentation + iteration loops",
      "Iterative optimization cycles"
    ],
    ctaLabel: "Discuss System",
    ctaHref: "/contact"
  }
];

export const processSteps = [
  {
    title: "Diagnose Behavior",
    detail: "Audit sessions, events, and flows to isolate where real behavior diverges from intended UX."
  },
  {
    title: "Map Adaptive Rules",
    detail: "Define the triggers, states, and decisions that tailor guidance by user intent in real time."
  },
  {
    title: "Design + Ship",
    detail: "Deliver implementation-ready components and specs your team can move into production quickly."
  },
  {
    title: "Measure + Improve",
    detail: "Track conversion impact, run experiments, and evolve the system based on evidence."
  }
];

export const caseStudies: CaseStudy[] = [
  {
    title: "B2B SaaS Onboarding Recovery",
    sector: "Composite Case Study",
    tier: "Adaptive UX Sprint",
    isPrototype: false,
    problem:
      "A workflow automation startup had strong signups but weak activation. New users hit the same static onboarding, regardless of role or urgency.",
    insight:
      "Behavior data showed two dominant intent profiles: evaluators needed fast proof, while operators needed setup confidence. The single-path flow satisfied neither.",
    systemApplied:
      "We implemented a HADE-based adaptive onboarding model that branched messaging, setup sequence, and support prompts based on early product signals.",
    outcome: [
      "Activation lift target of 25–40% with adaptive onboarding",
      "Time-to-first-value improved 2× with personalized flows",
      "30-day retention improved 15–25% after adaptive onboarding"
    ]
  },
  {
    title: "Retention Module for a PLG Analytics Tool",
    sector: "Composite Case Study",
    tier: "Adaptive Module Deployment",
    isPrototype: false,
    problem:
      "A product-led growth analytics tool had solid activation but saw users disengage at day 14. The UI offered the same experience regardless of usage depth.",
    insight:
      "Power users and explorers required completely different nudges. Power users needed advanced workflow shortcuts; explorers needed guided discovery of underused features.",
    systemApplied:
      "We deployed an Adaptive Module that read engagement signals at the session level and surfaced contextual UI prompts, tooltips, and email triggers tuned to each segment.",
    outcome: [
      "Day-30 retention improved from 38% to 54%",
      "Feature discovery rate doubled in the explorer segment",
      "Churn risk alerts fired 6 days earlier on average"
    ]
  },
  {
    title: "Full-Stack Adaptive UX Ecosystem",
    sector: "Concept Prototype",
    tier: "Adaptive System Lab",
    isPrototype: true,
    problem:
      "A Series B SaaS team needed to coordinate adaptive UX across onboarding, in-app guidance, and growth email — but had no unified decision architecture connecting them.",
    insight:
      "Each channel made independent routing decisions, creating contradictory experiences. A shared behavioral signal layer would allow all three channels to adapt coherently.",
    systemApplied:
      "A concept HADE System Lab architecture connecting onboarding, in-app, and lifecycle email through a shared decision layer. User signals from any channel update the routing context globally.",
    outcome: [
      "Concept: unified signal layer across 3 product surfaces",
      "Concept: 40%+ reduction in contradictory cross-channel messages",
      "Concept: experiment velocity target of 2 validated changes/week"
    ]
  }
];
