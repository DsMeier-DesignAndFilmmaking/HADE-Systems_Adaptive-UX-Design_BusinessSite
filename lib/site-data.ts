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

export type FlagshipCaseStudy = {
  title: string;
  subtitle: string;
  badge?: string;
  tier: CaseStudy["tier"];
  sector: string;
  accentColor: string;
  problemStats: { stat: string; label: string }[];
  problemSentence: string;
  approachIntro: string;
  approachPillars: { title: string; body: string; items?: string[] }[];
  diagramSteps: string[];
  diagramModules?: string[];
  interventions: string[];
  interventionsLabel?: string;
  metrics: { label: string; from: string; to: string; delta: string; positive: boolean }[];
  businessImpact: string[];
  closingInsight: string;
  ctaTitle: string;
  ctaSubtext: string;
  ctaButton: string;
};

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

export const flagshipCaseStudy: FlagshipCaseStudy = {
  title: "Activation Recovery System for B2B SaaS",
  subtitle: "Adaptive UX Sprint (Tier 1)",
  badge: "FLAGSHIP CASE",
  tier: "Adaptive UX Sprint",
  sector: "Composite Case Study",
  accentColor: "#316BFF",
  problemStats: [
    { stat: "62%", label: "Onboarding drop-off before core setup" },
    { stat: "21%", label: "Activation rate stalled" },
    { stat: "2.5 days", label: "Time-to-value exceeded" },
  ],
  problemSentence:
    "The onboarding experience was static, assumption-driven, and blind to real user intent.",
  approachIntro:
    "We deployed an Activation Recovery System — a lightweight adaptive layer that responds to real-time user behavior.",
  approachPillars: [
    {
      title: "Signal Detection",
      body: "Capture behavioral markers: hesitation, scroll depth, time-on-step, and exit intent.",
    },
    {
      title: "Intent Classification",
      body: "Classify users as evaluators vs. operators in real time based on early product signals.",
    },
    {
      title: "Adaptive Intervention",
      body: "Trigger the right path, prompt, and sequence for each user at the right moment.",
    },
  ],
  diagramSteps: [
    "User Enters",
    "Signal Captured",
    "Intent Classified",
    "Friction Detected",
    "HADE Decision Engine",
    "Adaptive Path Triggered",
    "Activation",
  ],
  interventions: [
    "Adaptive onboarding paths (3–5 steps vs. 7 static)",
    "Contextual tooltips triggered by hesitation",
    "Dynamic branching instead of linear flows",
    "Re-entry recovery loops",
  ],
  metrics: [
    { label: "Activation Rate", from: "21%", to: "38%", delta: "+81%", positive: true },
    { label: "Time-to-Value", from: "2.5 days", to: "1.2 days", delta: "−52%", positive: true },
    { label: "Completion Rate", from: "38%", to: "61%", delta: "+60%", positive: true },
    { label: "Step Drop-off Reduction", from: "—", to: "~30%", delta: "−30%", positive: true },
  ],
  businessImpact: [
    "Increased product-qualified leads (PQLs)",
    "Reduced wasted acquisition spend",
    "Faster path to revenue",
  ],
  closingInsight:
    "Most onboarding flows are static. HADE transforms onboarding into a responsive system that adapts in real time.",
  ctaTitle: "Run an Adaptive UX Sprint",
  ctaSubtext: "Identify your highest-impact activation opportunities in 2–3 weeks.",
  ctaButton: "Book a Sprint",
};

export const retentionCaseStudy: FlagshipCaseStudy = {
  title: "Retention & Expansion Engine for PLG Products",
  subtitle: "Adaptive Module Deployment (Tier 2)",
  tier: "Adaptive Module Deployment",
  sector: "Composite Case Study",
  accentColor: "#2C7B76",
  problemStats: [
    { stat: "Week 2", label: "Retention cliff — strong acquisition, weak hold" },
    { stat: "Low", label: "Feature adoption despite active signups" },
    { stat: "Flat", label: "Expansion revenue from existing user base" },
  ],
  problemSentence:
    "Retention systems were rule-based and disconnected from real user behavior.",
  approachIntro:
    "We deployed a modular Retention & Expansion Engine embedded directly into the product.",
  approachPillars: [
    {
      title: "Behavior Tracking",
      body: "",
      items: ["Feature usage", "Session depth", "Activity frequency"],
    },
    {
      title: "State Classification",
      body: "",
      items: ["New User", "At-Risk", "Power User", "Expansion Ready"],
    },
    {
      title: "Adaptive Modules",
      body: "",
      items: ["Feature prompts", "Use-case education", "Upgrade nudges"],
    },
  ],
  diagramSteps: [
    "User Behavior",
    "State Classification",
    "Trigger Condition",
    "Module Injected",
    "Behavior Change",
    "Retention / Expansion Event",
  ],
  interventions: [
    "Behavior-triggered prompts",
    '"Next best action" system',
    "Lifecycle-aware UX",
    "Contextual upgrade nudges",
  ],
  metrics: [
    { label: "Week 4 Retention", from: "28%", to: "44%", delta: "+57%", positive: true },
    { label: "Feature Adoption", from: "—", to: "+35%", delta: "+35%", positive: true },
    { label: "Expansion Revenue", from: "—", to: "+18–25%", delta: "+18–25%", positive: true },
    { label: "Churn Risk", from: "—", to: "−20%", delta: "−20%", positive: true },
  ],
  businessImpact: [
    "Increased LTV",
    "Monetized existing users",
    "Reduced reliance on acquisition",
  ],
  closingInsight: "Retention is not messaging — it is system design.",
  ctaTitle: "Deploy a Retention & Expansion Module",
  ctaSubtext: "Build a behavior-driven retention system in 1–3 weeks.",
  ctaButton: "Start Deployment",
};

export const systemLabCaseStudy: FlagshipCaseStudy = {
  title: "Adaptive Product System (End-to-End)",
  subtitle: "Adaptive System Lab (Tier 3)",
  badge: "REFERENCE SYSTEM",
  tier: "Adaptive System Lab",
  sector: "Reference Architecture",
  accentColor: "#F59E0B",
  problemStats: [
    { stat: "Static", label: "Products don't adapt to user behavior" },
    { stat: "Siloed", label: "Disconnected lifecycle stages — onboarding, retention, monetization" },
    { stat: "Leaky", label: "Lost revenue and inefficient growth from fragmented journeys" },
  ],
  problemSentence:
    "Most products treat every user the same at every stage — and pay for it in lost activation, retention, and expansion.",
  approachIntro:
    "We designed a full-stack Adaptive Product System where every interaction feeds a real-time decision engine.",
  approachPillars: [
    {
      title: "Unified Signal Layer",
      body: "",
      items: [
        "Behavioral signals from all product surfaces",
        "Session events, feature usage, lifecycle stage",
        "Unified context passed to decision engine",
      ],
    },
    {
      title: "HADE Decision Engine",
      body: "",
      items: [
        "Real-time routing across all product stages",
        "Adaptive rules for onboarding, retention, monetization",
        "Feedback loop for continuous optimization",
      ],
    },
    {
      title: "Adaptive Experience Layer",
      body: "",
      items: [
        "Onboarding adapts to acquisition source",
        "Retention modules trigger on inactivity",
        "Monetization on usage thresholds",
        "Re-engagement on churn signals",
      ],
    },
  ],
  diagramSteps: ["Signals", "HADE Decision Engine", "Feedback Loop", "Continuous Optimization"],
  diagramModules: ["Onboarding", "Retention", "Monetization", "Re-engagement"],
  interventionsLabel: "Example Behaviors",
  interventions: [
    "Onboarding adapts to acquisition source and role",
    "Retention triggers fire on detected inactivity",
    "Monetization nudges based on usage thresholds",
    "Re-engagement activates after churn signals",
  ],
  metrics: [
    { label: "Activation", from: "Baseline", to: "+40–80%", delta: "+40–80%", positive: true },
    { label: "Retention", from: "Baseline", to: "+30–60%", delta: "+30–60%", positive: true },
    { label: "Expansion Revenue", from: "Baseline", to: "+20–40%", delta: "+20–40%", positive: true },
    { label: "System Compounding", from: "—", to: "Continuous", delta: "Ongoing", positive: true },
  ],
  businessImpact: [
    "System-level growth engine — not a one-time fix",
    "Compounding optimization across every product stage",
    "Sustainable competitive advantage",
  ],
  closingInsight:
    "This is not a single feature or redesign. It is a system layer that transforms how products make decisions.",
  ctaTitle: "Build Your Adaptive Product System",
  ctaSubtext: "Design a full-stack adaptive architecture for your product in 4–8 weeks.",
  ctaButton: "Discuss System",
};

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
