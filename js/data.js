/* =========================================================================
   PORTFOLIO CONTENT — edit this file only.
   Everything on the site (and resume.html) is rendered from this object.

   ⚠️  "Alex Morgan" is a FICTIONAL persona. The companies, projects and
   metrics below are invented to demonstrate a complete senior portfolio.
   Replace them with your own real experience before using this to apply
   for jobs — employers verify work history.
   ========================================================================= */

window.PORTFOLIO = {
  profile: {
    name: "Alex Morgan",
    initials: "AM",
    role: "Senior Full-Stack Engineer",
    headline:
      "I build AI-powered products, distributed systems, and web & Android apps — and take them from whiteboard to production.",
    summary:
      "Senior full-stack engineer with 11 years of experience shipping production software across AI, backend systems, web and native Android. I've led teams of up to 8, designed platforms serving millions of users, and put LLM features into real products with evaluation, guardrails and cost control built in.",
    location: "Toronto, Canada · Remote (UTC−5)",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 014-2290",
    website: "alexmorgan.dev",
    availability: "Open to senior / staff roles and select contracts",
    resumeUrl: "assets/resume.pdf",
    socials: [
      { label: "GitHub", url: "https://github.com/alexmorgan-dev", icon: "github" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/alexmorgan-dev", icon: "linkedin" },
      { label: "Email", url: "mailto:alex.morgan@example.com", icon: "mail" }
    ]
  },

  stats: [
    { value: "11+", label: "Years shipping production software" },
    { value: "40+", label: "Products & services delivered" },
    { value: "6M+", label: "End users on systems I built" },
    { value: "14", label: "Engineers mentored to senior" }
  ],

  about: [
    "I started in 2014 writing PHP order systems for an e-commerce agency, and over eleven years grew into an engineer who is as comfortable reading a Postgres query plan as polishing a Jetpack Compose animation. I've worked across fintech, logistics, healthcare and B2B SaaS — usually on the team that owns the hardest, most business-critical piece.",
    "Since 2023 my focus has been applied AI: retrieval-augmented generation, agent workflows, evaluation pipelines, and getting LLM features into production responsibly — with tracing, cost budgets, permission-aware retrieval and regression tests that run on every pull request.",
    "I like owning problems end to end: talking to users, sketching the architecture, writing the code, wiring up the dashboards, and being on call for it. I care just as much about the people side — clear design docs, kind and thorough code review, and helping engineers grow."
  ],

  expertise: [
    {
      icon: "ai",
      title: "AI & Machine Learning",
      desc: "LLM applications, RAG, agents, embeddings, evaluation and MLOps for production workloads.",
      tags: ["LLM APIs", "RAG", "Agents", "PyTorch", "pgvector", "Evals"]
    },
    {
      icon: "system",
      title: "Systems & Backend",
      desc: "Distributed, event-driven services with strong observability, SLOs and reliability.",
      tags: ["Go", "Python", "Node.js", "Kafka", "PostgreSQL", "gRPC"]
    },
    {
      icon: "web",
      title: "Web Applications",
      desc: "Fast, accessible, well-tested frontends, design systems and real-time UIs.",
      tags: ["React", "Next.js", "TypeScript", "GraphQL", "Tailwind", "Playwright"]
    },
    {
      icon: "android",
      title: "Android & Mobile",
      desc: "Native Android with Clean Architecture and offline-first data; cross-platform when it fits.",
      tags: ["Kotlin", "Jetpack Compose", "Coroutines", "Room", "Hilt", "React Native"]
    },
    {
      icon: "cloud",
      title: "Cloud & DevOps",
      desc: "Infrastructure as code, CI/CD, Kubernetes and cost-aware cloud architecture.",
      tags: ["AWS", "GCP", "Kubernetes", "Terraform", "Docker", "GitHub Actions"]
    },
    {
      icon: "lead",
      title: "Technical Leadership",
      desc: "Architecture and design reviews, roadmaps, hiring loops and mentoring.",
      tags: ["System design", "RFCs", "Mentoring", "Hiring", "Incident review"]
    }
  ],

  // category values: "ai" | "system" | "web" | "android"
  projects: [
    {
      title: "Atlas — Enterprise Knowledge Copilot",
      categories: ["ai", "web"],
      year: "2025",
      role: "Tech lead · 5 engineers",
      duration: "7 months",
      summary:
        "A RAG assistant that answers employee questions across 2.3M internal documents, with cited sources and permission-aware retrieval.",
      problem:
        "Support and operations staff spent an average of 26 minutes per ticket searching wikis, Jira, Slack exports and PDFs. Answers were inconsistent, often outdated, and new hires took months to become effective.",
      solution:
        "Designed an ingestion pipeline with structure-aware chunking and embeddings, hybrid BM25 + vector search in Postgres/pgvector, a cross-encoder re-ranker, and a streaming chat UI in Next.js that always cites its sources. Every query is filtered by the user's document ACLs before retrieval. An offline evaluation harness of 1,200 graded questions runs in CI on every prompt or retrieval change.",
      architecture: ["Connectors", "Chunk + embed", "pgvector + BM25", "Re-ranker", "LLM (streaming)", "Cited answer"],
      decisions: [
        "Hybrid search over pure vectors: exact product codes and ticket IDs were failing semantic-only retrieval",
        "ACL filtering in the retrieval query itself, never in the prompt",
        "Model routing: small model for simple lookups, large model only when the re-ranker confidence is low"
      ],
      impact: ["−62% time-to-answer", "91% accuracy on graded eval set", "−45% LLM cost via caching & routing", "3,400 weekly active users"],
      stack: ["Python", "FastAPI", "pgvector", "LLM APIs", "Next.js", "AWS ECS", "OpenTelemetry"],
      links: { live: "", code: "" },
      featured: true
    },
    {
      title: "Pulse — Real-Time Fleet Telemetry",
      categories: ["system"],
      year: "2024",
      role: "Lead backend engineer · 6 engineers",
      duration: "10 months",
      summary:
        "An event-driven platform tracking 50,000+ vehicles with sub-second updates, live ETAs and geofence alerts.",
      problem:
        "A Rails monolith ingested GPS pings through a single queue. At peak, dispatch dashboards lagged by up to four minutes and the database was the bottleneck for every team.",
      solution:
        "Split ingestion into Go services over Kafka, partitioned by vehicle ID. A stream processor computes ETAs and geofence events; Redis holds hot vehicle state; a WebSocket gateway fans updates out to dispatch dashboards. Migrated with the strangler-fig pattern and dual writes, with zero downtime.",
      architecture: ["Devices (MQTT)", "Ingest (Go)", "Kafka", "Stream processor", "Redis + Postgres", "WebSocket gateway"],
      decisions: [
        "Partition by vehicle ID to guarantee per-vehicle ordering without global locks",
        "Idempotent consumers keyed on (device, sequence) so replays are always safe",
        "SLO-based alerting (p99 freshness) instead of CPU/memory alerts"
      ],
      impact: ["300k events/sec sustained", "p99 freshness 4 min → 220 ms", "99.95% uptime over 12 months", "−38% infrastructure cost"],
      stack: ["Go", "Kafka", "Redis", "PostgreSQL", "Kubernetes", "Terraform", "Grafana"],
      links: { live: "", code: "" },
      featured: true
    },
    {
      title: "Fieldnote — Offline-First Android App",
      categories: ["android", "ai"],
      year: "2024",
      role: "Android lead · 3 engineers",
      duration: "6 months",
      summary:
        "A Kotlin app for 2,800 utility technicians that works fully offline and reads meter photos with on-device ML.",
      problem:
        "Technicians often worked without connectivity and re-typed meter readings by hand from paper notes. Around 7% of readings had errors, which triggered costly billing disputes.",
      solution:
        "Built a Jetpack Compose app on Clean Architecture with Room as the single source of truth and a WorkManager sync engine that queues operations and resolves conflicts per field. A quantized TensorFlow Lite OCR model reads meter dials from the camera in about 120 ms on mid-range devices. (Try the offline-sync demo on this page.)",
      architecture: ["Compose UI", "ViewModel", "Repository", "Room (source of truth)", "WorkManager sync", "REST API"],
      decisions: [
        "Operation log plus last-writer-wins per field, not per record, so concurrent edits rarely collide",
        "On-device OCR with a confidence threshold; low-confidence reads ask the technician to confirm",
        "Baseline Profiles and lazy model loading kept cold start under 900 ms"
      ],
      impact: ["4.7★ Play Store rating", "Reading errors 7% → 1.2%", "Works 100% offline", "Crash-free sessions 99.8%"],
      stack: ["Kotlin", "Jetpack Compose", "Room", "WorkManager", "TFLite", "Hilt", "CameraX"],
      links: { live: "", code: "" },
      featured: true
    },
    {
      title: "Sentinel — LLM Evaluation & Guardrails",
      categories: ["ai", "system"],
      year: "2025",
      role: "Architect · 3 engineers",
      duration: "4 months",
      summary:
        "An internal platform that tests, monitors and guards every LLM feature in the company — evals in CI, tracing in production.",
      problem:
        "Four product teams shipped LLM features independently. Prompt changes caused silent regressions, and nobody could say what each feature cost or how often it hallucinated.",
      solution:
        "Built a shared SDK that traces every LLM call (prompt version, tokens, latency, cost), a dataset-driven evaluation runner that blocks merges when quality drops, and a guardrail layer for PII redaction, prompt-injection heuristics and output schema validation.",
      architecture: ["Feature code", "Sentinel SDK", "Guardrails", "LLM provider", "Trace store", "Eval dashboards"],
      decisions: [
        "LLM-as-judge only for subjective criteria; deterministic checks wherever possible",
        "Prompts versioned as code and reviewed like code",
        "Per-feature monthly cost budgets with alerts at 80%"
      ],
      impact: ["Adopted by 4 product teams", "23 regressions caught before release", "PII leaks in logs: 0", "Spend visible per feature"],
      stack: ["Python", "TypeScript", "ClickHouse", "LLM APIs", "GitHub Actions", "Grafana"],
      links: { live: "", code: "" },
      featured: false
    },
    {
      title: "Ledgerline — Payments Reconciliation Engine",
      categories: ["system", "ai"],
      year: "2023",
      role: "Senior engineer · 4 engineers",
      duration: "8 months",
      summary:
        "Automated matching of bank, card-processor and ledger transactions, with anomaly detection that flags suspicious entries.",
      problem:
        "Finance reconciled about 9 million transactions a month in spreadsheets. Month-end close took five days, and mismatches were found weeks late.",
      solution:
        "Built an idempotent matching engine in Python and Postgres that runs rules in confidence tiers (exact, fuzzy, many-to-one), orchestrated by Airflow, plus a gradient-boosted anomaly model that routes outliers to a review queue with full explanations and an audit trail.",
      architecture: ["Bank / PSP files", "Normalizer", "Matching tiers", "Anomaly model", "Review queue", "Audit ledger"],
      decisions: [
        "Append-only audit log; every match records which rule produced it and why",
        "Exact decimal arithmetic everywhere, enforced in code review and linting",
        "Model flags for review but never auto-approves money movement"
      ],
      impact: ["98.6% auto-match rate", "Month-end close 5 days → 1 day", "Passed external SOC 2 audit", "~1,100 analyst-hours saved / year"],
      stack: ["Python", "PostgreSQL", "Airflow", "XGBoost", "Docker", "AWS"],
      links: { live: "", code: "" },
      featured: false
    },
    {
      title: "Canvas — Multi-Tenant Analytics Builder",
      categories: ["web"],
      year: "2023",
      role: "Frontend lead · 5 engineers",
      duration: "9 months",
      summary:
        "A drag-and-drop dashboard builder and scheduled-report product for a B2B SaaS platform.",
      problem:
        "Customers exported CSVs to build reports in other tools. Churn interviews named missing insights as a top-three reason for leaving.",
      solution:
        "Designed a React and TypeScript dashboard builder with a GraphQL API over a ClickHouse query layer, server-side PDF report rendering, and a shared component library with Storybook and visual regression tests.",
      architecture: ["React builder", "GraphQL BFF", "Query compiler", "ClickHouse", "Report scheduler", "PDF / email"],
      decisions: [
        "A typed query DSL compiled server-side, so tenants never send raw SQL",
        "Virtualized grid and Web Workers for large widget datasets",
        "Accessibility (WCAG 2.1 AA) as a release gate, not an afterthought"
      ],
      impact: ["Load time 4.1 s → 1.2 s", "+18% paid-plan conversion", "Component library reused by 4 teams", "NPS +11"],
      stack: ["React", "TypeScript", "GraphQL", "ClickHouse", "Node.js", "Storybook", "Playwright"],
      links: { live: "", code: "" },
      featured: false
    },
    {
      title: "Kite — Compose Design System",
      categories: ["android"],
      year: "2022",
      role: "Creator & maintainer",
      duration: "Ongoing",
      summary:
        "A Jetpack Compose component library and theming system shared by three Android apps.",
      problem:
        "Three apps re-implemented the same buttons, forms and dialogs, each with slightly different behaviour and accessibility bugs.",
      solution:
        "Built a token-based theming layer, 40+ accessible Compose components, screenshot tests with Paparazzi, and a catalog app for designers to review components on real devices.",
      architecture: ["Design tokens", "Theme layer", "Components", "Screenshot tests", "Catalog app", "Maven release"],
      decisions: [
        "Tokens generated from the design tool so design and code never drift",
        "Every component ships with TalkBack semantics and a large-text test",
        "Semantic versioning with automated changelogs"
      ],
      impact: ["Used by 3 apps", "−30% UI code per new screen", "Accessibility bugs −70%", "Releases every 2 weeks"],
      stack: ["Kotlin", "Jetpack Compose", "Paparazzi", "Gradle", "GitHub Actions"],
      links: { live: "", code: "" },
      featured: false
    },
    {
      title: "CareLink — Telehealth Suite",
      categories: ["android", "web"],
      year: "2021",
      role: "Full-stack lead · 6 engineers",
      duration: "10 weeks to launch",
      summary:
        "A patient Android app, a clinician web portal and secure video consultations for a network of 60 clinics.",
      problem:
        "A clinic network needed remote consultations within weeks during a demand surge, while meeting strict health-data privacy requirements.",
      solution:
        "Shipped a Kotlin patient app, a React clinician portal and WebRTC video via a managed SFU, with encrypted messaging, appointment scheduling and audit logging — from kickoff to launch in 10 weeks.",
      architecture: ["Android app", "React portal", "Node.js API", "WebRTC SFU", "Encrypted store", "Audit log"],
      decisions: [
        "Bought video infrastructure (managed SFU) and built only what made the product different",
        "Feature flags to roll out clinic by clinic",
        "Field-level encryption for clinical notes"
      ],
      impact: ["120k consultations in year one", "Launched in 10 weeks", "99.7% crash-free sessions", "4.6★ patient rating"],
      stack: ["Kotlin", "React", "Node.js", "WebRTC", "PostgreSQL", "GCP"],
      links: { live: "", code: "" },
      featured: false
    }
  ],

  experience: [
    {
      role: "Lead Full-Stack Engineer, AI Platform",
      company: "Quillstone Software",
      period: "2023 — Present",
      location: "Remote",
      summary: "Lead a 6-person team bringing LLM-powered features into a B2B workflow product used by 1,900 companies.",
      highlights: [
        "Architected the RAG platform behind Atlas, now powering 3 product lines",
        "Built Sentinel, the company-wide LLM evaluation and guardrails platform",
        "Reduced AI infrastructure spend by 30% through caching, model routing and autoscaling",
        "Run the AI architecture review and mentor 4 engineers"
      ],
      stack: ["Python", "TypeScript", "AWS", "LLMs", "pgvector"]
    },
    {
      role: "Senior Software Engineer",
      company: "Corvane Logistics",
      period: "2019 — 2023",
      location: "Toronto, Canada",
      summary: "Owned core backend services and the Android driver and technician apps for a logistics platform.",
      highlights: [
        "Led the monolith-to-microservices migration (Pulse) with zero downtime",
        "Shipped Android apps used by 40k+ drivers and technicians every day",
        "Introduced SLOs, on-call runbooks and blameless postmortems",
        "Mentored 8 engineers, 3 of whom were promoted to senior"
      ],
      stack: ["Go", "Kotlin", "Kafka", "Kubernetes", "PostgreSQL"]
    },
    {
      role: "Full-Stack Developer",
      company: "Brightpath Digital",
      period: "2016 — 2019",
      location: "Toronto, Canada",
      summary: "Built web and mobile products for fintech and healthcare clients at a product studio.",
      highlights: [
        "Delivered 15+ client projects, including the CareLink telehealth launch",
        "Created a React component library adopted across the studio",
        "Set up the studio's first CI/CD pipelines and testing standards"
      ],
      stack: ["React", "Node.js", "Java", "Android", "AWS"]
    },
    {
      role: "Software Developer",
      company: "Ferrowave Commerce",
      period: "2014 — 2016",
      location: "Toronto, Canada",
      summary: "Backend and web development for e-commerce stores and internal tools.",
      highlights: [
        "Built order-processing APIs handling 10k orders per day",
        "Optimized critical SQL reports from minutes to seconds"
      ],
      stack: ["PHP", "Java", "MySQL", "JavaScript"]
    }
  ],

  skills: {
    Languages: ["TypeScript", "JavaScript", "Python", "Go", "Kotlin", "Java", "SQL"],
    "AI / ML": ["LLM APIs", "RAG", "LangGraph", "Embeddings", "PyTorch", "scikit-learn", "XGBoost", "TFLite", "pgvector"],
    Frontend: ["React", "Next.js", "Redux Toolkit", "Tailwind", "Vite", "Storybook", "Playwright"],
    Backend: ["Node.js", "FastAPI", "Spring Boot", "gRPC", "GraphQL", "REST", "WebSockets"],
    Mobile: ["Android SDK", "Jetpack Compose", "Coroutines / Flow", "Room", "WorkManager", "Hilt", "React Native"],
    "Data & Infra": ["PostgreSQL", "Redis", "Kafka", "ClickHouse", "Docker", "Kubernetes", "Terraform", "AWS", "GCP"]
  },

  principles: [
    {
      title: "Measure first, then optimize",
      text: "Every project starts with a metric we can move — latency, cost, error rate, time saved — and a dashboard that shows it."
    },
    {
      title: "Boring tech for core paths",
      text: "Postgres, queues and well-understood patterns carry the critical path. Novel tools have to earn their place."
    },
    {
      title: "AI with guardrails",
      text: "LLM features ship with evaluations, tracing, cost budgets and a fallback. If we can't measure quality, we don't ship it."
    },
    {
      title: "Offline and failure are normal",
      text: "Networks drop and services fail. I design for retries, idempotency and graceful degradation from day one."
    },
    {
      title: "Write it down",
      text: "Short design docs and decision records let teams move fast without re-arguing the past."
    },
    {
      title: "Grow the team",
      text: "Thorough, kind code review and pairing. The best measure of a senior engineer is how the people around them improve."
    }
  ],

  education: [
    { title: "B.Sc. Computer Science", place: "Lakeshore Institute of Technology", year: "2014" },
    { title: "AWS Certified Solutions Architect – Professional", place: "Amazon Web Services", year: "2023" },
    { title: "Certified Kubernetes Application Developer (CKAD)", place: "CNCF", year: "2021" },
    { title: "Associate Android Developer", place: "Google", year: "2019" }
  ]
};
