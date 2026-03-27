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
  title: "Adaptive Purchase Decision Engine",
  subtitle: "Adaptive Decision System · E-Commerce",
  badge: "FLAGSHIP CASE",
  tier: "Adaptive UX Sprint",
  sector: "E-Commerce · Synthesized",
  accentColor: "#316BFF",
  problemSentence:
    "Users browse hundreds of options with no system helping them decide. The catalog grows; the signal doesn't. Most visitors leave without buying — not because the product wasn't right, but because the choice never got clear.",
  problemStats: [
    { stat: "Too many choices", label: "Large catalogs generate comparison fatigue before intent can form" },
    { stat: "No prioritization", label: "Every product surfaces equally — the system has no ranking logic tied to user state" },
    { stat: "High drop-off", label: "Users disengage at the comparison stage — not at checkout" },
  ],
  approachIntro:
    "We built an Adaptive Purchase Decision Engine — a behavioral layer that reads how a user is shopping in real time and continuously restructures the decision environment to match their state.",
  approachPillars: [
    {
      title: "Signal Capture",
      body: "",
      items: [
        "Scroll and dwell time per product — how long attention holds",
        "Comparison behavior — which products are stacked and how often",
        "Return visits — products revisited signal unresolved intent",
        "Exit timing — when the user abandons and from where",
      ],
    },
    {
      title: "State Detection",
      body: "",
      items: [
        "Browsing: low dwell, wide scan — user is orienting, not deciding",
        "Evaluating: deep dwell, active comparisons — narrowing is happening",
        "Hesitating: revisits with no action — intent is present, friction is blocking",
      ],
    },
    {
      title: "Decision Layer",
      body: "",
      items: [
        "Ranks options by fit signal — not popularity or margin",
        "Reduces visible list to highest-confidence matches per state",
        "Surfaces a clear best-fit recommendation with decision rationale",
        "Delivers adaptive UI — the interface responds, not just the content",
      ],
    },
  ],
  diagramSteps: [
    "User Behavior",
    "Signals Captured",
    "State Detected",
    "HADE Decision Engine",
    "Options Ranked",
    "Adaptive UI",
    "Conversion",
  ],
  interventionsLabel: "Experience Moments",
  interventions: [
    "Browsing → system narrows the catalog based on engagement patterns, removing noise before the user asks",
    "Comparing → visible options collapse to highest-signal matches; lower-fit products deprioritized",
    "Hesitating → system surfaces a direct recommendation with rationale, breaking the comparison loop",
    "Decision → friction-reduced path to conversion; no re-navigation, no restarts",
  ],
  metrics: [
    { label: "Decision Speed", from: "Baseline", to: "Faster", delta: "Modeled", positive: true },
    { label: "Catalog Drop-off", from: "High", to: "Directional ↓", delta: "Modeled", positive: true },
    { label: "Comparison Depth", from: "Unresolved", to: "Resolved", delta: "Modeled", positive: true },
    { label: "Conversion Rate", from: "Baseline", to: "15–30%", delta: "Modeled lift", positive: true },
  ],
  businessImpact: [
    "Faster path from catalog entry to confident purchase decision — without reducing product depth",
    "Reduced drop-off at the comparison stage — the highest-friction point in the purchase funnel",
    "A behavioral signal layer that improves with each session — sharpening recommendations over time",
  ],
  closingInsight:
    "Conversion failure is rarely a product problem. It's a decision problem — users are ready to buy but can't find their way to yes. The engine changes that: it reads where they are and clears the path forward.",
  ctaTitle: "Deploy a Purchase Decision Engine",
  ctaSubtext: "Map your catalog drop-off patterns and model adaptive decision routing — in 2–3 weeks.",
  ctaButton: "Book a Sprint",
};

export const retentionCaseStudy: FlagshipCaseStudy = {
  title: "Retention System Design for a PLG Analytics Tool",
  subtitle: "Adaptive Module Deployment (Tier 2)",
  tier: "Adaptive Module Deployment",
  sector: "PLG SaaS · Synthesized",
  accentColor: "#2C7B76",
  problemStats: [
    { stat: "No loop", label: "Users reached initial value but had no system pulling them back — engagement decayed on its own timeline" },
    { stat: "No context", label: "The product served the same interface to dormant users and power users alike — no behavioral differentiation" },
    { stat: "No signal", label: "Churn was invisible until it happened — there was no early detection of disengagement drift" },
  ],
  problemSentence:
    "The product knew how to acquire users and activate them. It had no system for what came next. Retention was left to habit — and habit wasn't forming.",
  approachIntro:
    "We designed a state-based Retention Module — an adaptive layer that tracks engagement depth, classifies user state continuously, and injects the right response at the right moment to close the disengagement loop before it opens.",
  approachPillars: [
    {
      title: "Engagement Signal Tracking",
      body: "",
      items: [
        "Session frequency and gap length",
        "Feature breadth (how many features touched per session)",
        "Depth per feature (surface use vs. meaningful action)",
        "Return trigger — what brought them back last time",
      ],
    },
    {
      title: "State Classification",
      body: "",
      items: [
        "New: activated, exploring — high intent, fragile habit",
        "Exploring: building patterns, moderate engagement depth",
        "Dormant: session gap exceeds threshold, drift detected",
        "Power User: consistent depth, expansion-ready signals present",
      ],
    },
    {
      title: "Adaptive Response Layer",
      body: "",
      items: [
        "Surfaced insights drawn from the user's own data to restore perceived value",
        "Feature nudges triggered when adjacent capability matches current usage pattern",
        "Dormancy prompts fired on gap threshold — not on a calendar schedule",
        "Expansion context shown only when Power User state is confirmed",
      ],
    },
  ],
  diagramSteps: [
    "Session Behavior",
    "Engagement State",
    "Trigger Condition",
    "HADE Decision Engine",
    "Response Injected",
    "Re-engagement / Expansion",
  ],
  interventions: [
    "Dormancy detection: re-engagement prompt fires when session gap crosses state threshold — not on a fixed schedule",
    "Insight surfacing: system surfaces a relevant metric from the user's own data to restore value perception",
    "Feature adjacency nudges: triggered when usage pattern shows readiness for the next feature — not before",
    "Expansion context: upgrade or tier nudges shown only after Power User state is classified and held across two sessions",
  ],
  metrics: [
    { label: "Week 4 Retention", from: "38%", to: "54%", delta: "+16 pts", positive: true },
    { label: "Feature Adoption", from: "Narrow usage", to: "Doubled", delta: "Explorer segment", positive: true },
    { label: "Churn Detection", from: "Post-event", to: "6 days", delta: "Earlier on avg", positive: true },
    { label: "Expansion Readiness", from: "Untriggered", to: "State-gated", delta: "Behavioral", positive: true },
  ],
  businessImpact: [
    "Reduced passive churn — the kind that happens not from dissatisfaction but from drift and distraction",
    "Higher feature adoption depth per user, increasing switching cost and perceived product value",
    "Expansion nudges tied to behavioral evidence rather than arbitrary time-based rules — improving upgrade conversion quality",
  ],
  closingInsight:
    "Retention is not a messaging problem. Users don't churn because they forgot to come back — they churn because the product gave them no reason grounded in their own context. A retention system that reads behavior and responds to it changes that dynamic entirely.",
  ctaTitle: "Deploy a Retention Module",
  ctaSubtext: "Design a state-based retention system that responds to real engagement signals — not calendar rules.",
  ctaButton: "Start Deployment",
};

export const travelCaseStudy: FlagshipCaseStudy = {
  title: "Adaptive Trip Discovery",
  subtitle: "Helping Travelers Decide What to Do Next — in Real Time",
  badge: "APPLIED CONCEPT",
  tier: "Adaptive UX Sprint",
  sector: "Travel",
  accentColor: "#0891B2",
  problemStats: [
    { stat: "Static plans", label: "Itineraries built before a trip break the moment context changes — weather, crowds, energy, an unexpected discovery — and the tool offers no live response" },
    { stat: "No field awareness", label: "Travel tools are designed for pre-trip decisions. Once the trip begins, they have no awareness of where the user is, what time it is, or what just happened" },
    { stat: "Re-decision fatigue", label: "Every unplanned moment required the user to manually re-evaluate all options from scratch — the system had no memory of what had already been ruled out" },
  ],
  problemSentence:
    "Travel doesn't follow a plan. Context changes constantly — time of day, energy level, what you just experienced, what's within walking distance right now. A system built only for pre-trip decisions goes silent the moment the trip actually begins.",
  approachIntro:
    "We designed an Adaptive Trip Discovery System — a real-time behavioral layer that reads contextual signals continuously, classifies the user's current state in the field, and surfaces the best next move rather than a menu of all possible moves.",
  approachPillars: [
    {
      title: "Contextual Signal Capture",
      body: "",
      items: [
        "Location and proximity to nearby points of interest — not just GPS but meaningful context radius",
        "Time of day, duration since last activity, and time remaining in the session",
        "Movement velocity — stationary, walking pace, or in active transit between points",
        "Behavioral signals — what was opened, dismissed, dwelled on, or acted on in the last interaction",
      ],
    },
    {
      title: "Real-Time State Classification",
      body: "",
      items: [
        "Exploring Area: moving slowly through a new space, no specific intent — user is orienting, needs ambient options not a decision",
        "Evaluating Options: stationary or slow-moving, interacting with multiple results — user has narrowed to a type of experience and needs help choosing between 2–3",
        "In Motion: velocity signals active transit to a known point — system quiets, surfaces only navigation, holds all new recommendations",
        "Decision Moment: stationary, high proximity signal, high dwell or repeated view of one option — user is seconds from acting and needs a single clear path forward",
      ],
    },
    {
      title: "Adaptive Response Layer",
      body: "",
      items: [
        "Exploring Area: surface nearby options in clusters by experience type (food, movement, culture, rest) — no ranked lists, low cognitive weight",
        "Evaluating Options: collapse to the 2–3 best-matched options with the single most context-relevant attribute (current wait time, proximity, energy match)",
        "In Motion: quiet the interface entirely — navigation only, no new suggestions until arrival or stop is detected",
        "Decision Moment: full-screen single recommendation with one direct action (walk here, book now, call ahead) — the system resolves the decision, the user only needs to confirm",
      ],
    },
  ],
  diagramSteps: [
    "Context Detected",
    "Signals Captured",
    "State Classified",
    "HADE Decision Engine",
    "Response Surfaced",
    "Decision Made",
  ],
  interventionsLabel: "Moment-by-Moment System Behavior",
  interventions: [
    "Walking through a new neighborhood (Exploring Area): 3 nearby options surface, grouped by experience type — no search, no filter, no ranked list required",
    "Pausing outside two restaurants (Evaluating Options): the system detects the pause and proximity, collapses to a direct comparison of both with one attribute — current wait time",
    "Moving toward a destination (In Motion): interface goes quiet — navigation only, no new recommendations until a stop or arrival is detected",
    "Standing still at a decision point (Decision Moment): one option fills the screen with a single action — the system has resolved the choice, the user only needs to confirm",
  ],
  metrics: [
    { label: "In-Moment Decision Quality", from: "Overwhelm or default", to: "Context-matched", delta: "Improved", positive: true },
    { label: "Interface Interruptions", from: "Continuous", to: "State-triggered only", delta: "Directional ↓", positive: true },
    { label: "Time at Decision Moment", from: "Extended hesitation", to: "Reduced", delta: "Faster", positive: true },
    { label: "Experience Continuity", from: "Re-plan from scratch", to: "System adapts in place", delta: "Improved", positive: true },
  ],
  businessImpact: [
    "Decisions matched to the actual context of the moment — energy level, proximity, time remaining — rather than a plan made hours earlier",
    "Reduced friction at the highest-stakes moments: the pause outside a venue, the fork in the road, the unexpected change of plans",
    "A product that stays useful after the trip begins — closing the gap between pre-trip discovery tools and real-time in-field guidance",
  ],
  closingInsight:
    "Travel tools are excellent for planning the night before and largely useless by noon the next day. That gap isn't a feature gap — it's an architectural one. A system that operates on live context rather than stored plans is a categorically different product. It doesn't help you decide what to do. It responds to what is actually happening.",
  ctaTitle: "Apply Real-Time Adaptive Thinking to Your Platform",
  ctaSubtext: "Design a system that reads live context and responds — not one that waits for the user to search.",
  ctaButton: "Book a Discovery Call",
};

export const aiToolCaseStudy: FlagshipCaseStudy = {
  title: "Adaptive AI Interaction System",
  subtitle: "Reducing Overwhelm in AI-Assisted Workflows",
  badge: "APPLIED CONCEPT",
  tier: "Adaptive UX Sprint",
  sector: "AI Tool · Concept Build",
  accentColor: "#7C3AED",
  problemStats: [
    { stat: "Blank slate", label: "Every session began with an empty input field — no scaffolding, no structure, no awareness of what the user was trying to accomplish" },
    { stat: "Trial and error", label: "Users iterated through multiple prompt attempts to reach a usable output — the AI responded but never guided the process forward" },
    { stat: "No task model", label: "The system treated the first prompt in a session identically to the tenth refinement — no awareness of progress, stage, or accumulated context" },
  ],
  problemSentence:
    "AI tools are capable of producing sophisticated outputs. The failure isn't capability — it's structure. Without a system that understands where a user is in their task, the interface defaults to a blank input field and the user is left to figure out the rest.",
  approachIntro:
    "We designed an Adaptive AI Interaction System — a behavioral layer that reads intent from prompt patterns and interaction signals, classifies the current task stage, and surfaces structured scaffolding and next-step guidance that reduces the cognitive load of working with AI.",
  approachPillars: [
    {
      title: "Interaction Signal Capture",
      body: "",
      items: [
        "Prompt content and specificity — is the user exploring a direction or specifying a precise output?",
        "Edit and refinement patterns — how many iterations, what changed, how much was rewritten",
        "Dwell time on outputs vs. immediate re-prompting — signals output satisfaction or dissatisfaction",
        "Copy, save, export, and discard actions — the clearest behavioral signal of whether an output landed",
      ],
    },
    {
      title: "Task State Classification",
      body: "",
      items: [
        "Starting: first or second prompt, broad or unclear intent — user needs orientation and a structured entry point before writing",
        "Refining: repeated prompts with incremental changes, high edit frequency — user has a direction but is struggling to reach the target output precisely",
        "Executing: specific high-confidence prompts, low revision rate, output actions present — user needs delivery speed and minimal friction, not guidance",
      ],
    },
    {
      title: "Adaptive Interface Response",
      body: "",
      items: [
        "Starting state: surface a structured task scaffold — intent categories, suggested starting prompts, or a brief guided intake before the blank field appears",
        "Refining state: surface targeted controls alongside the output — rewrite options, tone and length adjusters, alternative version generator — without requiring a new prompt",
        "Executing state: collapse the scaffolding, streamline the interface to the output layer, and foreground export and next-action paths",
      ],
    },
  ],
  diagramSteps: [
    "User Prompt",
    "Signals Captured",
    "Task State Classified",
    "HADE Decision Engine",
    "Scaffold Adapted",
    "Task Completed",
  ],
  interventionsLabel: "How the System Behaves",
  interventions: [
    "In Starting state: instead of a blank input, the system surfaces a structured task scaffold — the user selects an intent type before writing a single prompt",
    "When Refining is detected: targeted refinement controls appear alongside the output — the user adjusts parameters directly rather than re-prompting from scratch",
    "In Executing state: scaffolding is hidden, the interface collapses to the output layer, and export and next-action paths are foregrounded",
    "Session context: task type, established constraints, and prior decisions are preserved across prompts — the system remembers what the user has already resolved",
  ],
  metrics: [
    { label: "Task Completion Rate", from: "High mid-task drop-off", to: "Directional ↑", delta: "Modeled", positive: true },
    { label: "Prompts to Useful Output", from: "Multiple iterations", to: "Reduced", delta: "Faster", positive: true },
    { label: "Cognitive Load", from: "Unstructured / high", to: "Directional ↓", delta: "Modeled", positive: true },
    { label: "Workflow Clarity", from: "Blank slate", to: "Stage-guided", delta: "Improved", positive: true },
  ],
  businessImpact: [
    "Reduced time from stated intent to usable output — the primary friction point in AI-assisted task completion across all user types",
    "Lower abandonment at the refinement stage — where most users give up on AI tools and revert to manual methods",
    "Higher perceived output quality produced by guided refinement, not blind re-prompting — improving the user's relationship with the tool over time",
  ],
  closingInsight:
    "The blank slate is not a feature — it is a failure of interface design. AI tools that front-load capability without structure ask users to solve two problems simultaneously: what to ask and how to ask it. A system that reads task stage and responds with the right scaffold at the right moment removes that second problem entirely.",
  ctaTitle: "Apply Adaptive Thinking to Your AI Tool",
  ctaSubtext: "Map your users' task stages and design an interaction system that guides rather than just responds.",
  ctaButton: "Book a Discovery Call",
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
  }
];
