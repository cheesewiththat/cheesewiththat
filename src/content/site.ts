import type {
  Article,
  AboutProfile,
  Engagement,
  Expertise,
  ExternalProfile,
  Interest,
  LinkItem,
  Location,
  Photograph,
  PrintProduct,
  Service,
  Training,
  WorkItem,
} from "./types";

export const site = {
  name: "Cheesewiththat",
  title: "Mihir—with context.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cheesewiththat.com",
  description:
    "Mihir builds products, commercialises technology and makes complicated systems useful.",
};
export const externalProfiles: ExternalProfile[] = [
  { id: "linkedin", label: "LinkedIn", configured: false },
  { id: "facebook", label: "Facebook", configured: false },
  { id: "x", label: "X / Twitter", configured: false },
  { id: "current-work", label: "Current work profile", configured: false },
  {
    id: "previous-blog",
    label: "Mihir’s previous blog",
    href: "https://mihirspeaks.blogspot.com",
    configured: true,
  },
  {
    id: "zero-one-products",
    label: "0–1 Products",
    href: "https://0-1products.com",
    configured: true,
  },
];
export const navigation: LinkItem[] = [
  { label: "Mihir", href: "/mihir" },
  { label: "Work", href: "/work" },
  { label: "Ideas", href: "/ideas" },
  { label: "Map", href: "/map" },
  { label: "Photography", href: "/photography" },
  { label: "Collect", href: "/collect" },
  { label: "Engage", href: "/engage" },
];
export const roles = [
  {
    title: "Builder",
    body: "Turning ambiguous problems into useful products, systems and momentum.",
  },
  {
    title: "Operator",
    body: "Making complex programmes legible, governable and deliverable.",
  },
  {
    title: "Commercial Leader",
    body: "Connecting customer reality, product decisions and routes to market.",
  },
  {
    title: "Advisor",
    body: "Bringing a calm, independent view to difficult decisions.",
  },
];
export const aboutMihir: AboutProfile = {
  heading: "A little about me",
  paragraphs: [
    "I’m Mihir — a product, technology and commercial leader who has spent much of his career working at the intersection of telecom, software, transformation and new product development. I’ve helped shape and deliver complex platforms across OSS/BSS, connectivity, digital marketplaces, CPQ, network operations and AI-enabled products, often moving between product strategy, solution design, delivery, partnerships, sales and customer leadership depending on what the situation actually needs.",
    "I enjoy taking complicated ideas and turning them into something clearer, more practical and commercially useful. That might mean helping a company modernise a telecom stack, breaking down an early-stage product idea, shaping a go-to-market plan, rescuing a difficult programme or working with teams to make AI useful without turning it into theatre. I’m equally comfortable in a boardroom, a product workshop, a customer meeting or deep in a conversation about architecture, APIs and why six integrations somehow became twelve.",
    "Outside work, I’m a traveller, photographer, F1 follower, car enthusiast and collector of oddly specific facts. I like cities, stories, machines, maps, good design and people who are building something interesting. Cheesewiththat is where all of those sides come together — the professional work, the ideas, the things I’m learning, the places I’ve been and the occasional unnecessary opinion.",
  ],
  portrait: {
    src: "/images/mihir/mihir-waterfront.png",
    alt: "Portrait of Mihir by the water",
    width: 800,
    height: 800,
    caption:
      "Usually somewhere between a product workshop, an airport lounge and an argument about engines.",
  },
};
export const expertise: Expertise[] = [
  [
    "Product Strategy and 0–1 Product Building",
    "From problem definition to a credible first release.",
  ],
  ["AI Product Management", "Useful AI products with sensible human controls."],
  [
    "AI Project and Program Management",
    "Delivery plans that account for data, adoption, governance and cost.",
  ],
  [
    "Telecom OSS/BSS Transformation",
    "Modernising the machinery behind connectivity.",
  ],
  [
    "CPQ and Quote-to-Cash",
    "Making complex propositions easier to configure, sell and fulfil.",
  ],
  [
    "Network Observability and AIOps",
    "Turning operational signals into decisions and action.",
  ],
  [
    "Connectivity Solution Architecture",
    "Joining commercial intent to technical feasibility.",
  ],
  [
    "GTM and Commercial Strategy",
    "Positioning, packaging and routes to market.",
  ],
  [
    "Complex Program Delivery",
    "Structure and recovery for multi-party change.",
  ],
].map(([title, description]) => ({ title, description }));
export const work: WorkItem[] = [
  [
    "airline-marketplace",
    "Global Airline Digital Marketplace",
    "A demonstration of how a multi-partner marketplace case study could explain product, commercial and integration decisions.",
    ["Product", "Marketplace", "Integration"],
  ],
  [
    "quote-to-cash",
    "Telecom Quote-to-Cash Modernisation",
    "A sample structure for connecting customer journeys with catalogue, pricing, orchestration and operations.",
    ["Telecom", "CPQ", "Transformation"],
  ],
  [
    "network-operations",
    "AI-Assisted Network Operations",
    "A sample exploration of safe, operator-centred AI workflows for complex network environments.",
    ["AI", "AIOps", "Operations"],
  ],
  [
    "field-platform",
    "Field Operations and Fibre Maintenance Platform",
    "A sample product narrative spanning field teams, workflow, evidence and service assurance.",
    ["0–1", "Field operations", "Fibre"],
  ],
  [
    "carrier-api",
    "Carrier API Interoperability",
    "A sample architecture narrative for consistent partner experiences across heterogeneous carrier APIs.",
    ["APIs", "Ecosystems", "Connectivity"],
  ],
].map(([slug, title, summary, disciplines]) => ({
  slug: slug as string,
  title: title as string,
  summary: summary as string,
  disciplines: disciplines as string[],
  sample: true,
}));
export const interests: Interest[] = [
  {
    label: "Building",
    value: "A more useful home for all the work and wandering.",
  },
  {
    label: "Thinking about",
    value: "Where AI genuinely changes the product, not merely the pitch.",
  },
  {
    label: "Reading",
    value:
      "A rotating stack of systems, cities and wonderfully specific obsessions.",
  },
  {
    label: "Watching",
    value: "Formula 1, with an unreasonable interest in strategy calls.",
  },
  { label: "Learning", value: "Better ways to make complex ideas tangible." },
  {
    label: "Travelling",
    value: "Between familiar places and the next good long walk.",
  },
  {
    label: "Obsessing over unnecessarily",
    value: "The tiny details that make an interface—or an engine—feel right.",
  },
];
export const engagements: Engagement[] = [
  {
    slug: "direction-check",
    title: "15-minute Direction Check",
    duration: "15 min",
    description: "A quick fit check for a clearly framed decision.",
    mode: "preview",
  },
  {
    slug: "expert-session",
    title: "30-minute Expert Session",
    duration: "30 min",
    description: "Focused perspective on a product, AI or telecom question.",
    mode: "preview",
  },
  {
    slug: "working-session",
    title: "60-minute Working Session",
    duration: "60 min",
    description: "Work through a problem and leave with practical next moves.",
    mode: "preview",
  },
  {
    slug: "idea-clinic",
    title: "90-minute Idea Clinic",
    duration: "90 min",
    description: "Pressure-test an idea, proposition, roadmap or programme.",
    mode: "preview",
  },
];
export const services: Service[] = [
  {
    slug: "product",
    title: "Product and 0–1 Building",
    intro: "Make the problem and first product concrete.",
    capabilities: [
      "Idea evaluation",
      "Problem definition",
      "Product strategy",
      "MVP definition",
      "Product roadmap",
      "Prototype and validation planning",
    ],
  },
  {
    slug: "ai",
    title: "AI Product and Delivery Advisory",
    intro: "Move from AI enthusiasm to a governable product and delivery plan.",
    capabilities: [
      "AI use-case identification",
      "AI readiness",
      "AI product strategy",
      "Agentic workflow design",
      "Human-in-the-loop models",
      "AI program planning",
      "Governance, adoption and cost",
    ],
  },
  {
    slug: "telecom",
    title: "Telecom and Connectivity Consulting",
    intro:
      "Navigate the operational and commercial machinery behind connectivity.",
    capabilities: [
      "OSS/BSS modernisation",
      "CPQ and quote-to-cash",
      "Service inventory",
      "Digital marketplaces",
      "Partner ecosystems",
      "Network observability and AIOps",
      "API interoperability",
      "TM Forum, MEF and CAMARA-aligned integration",
      "Connectivity solution architecture",
    ],
  },
  {
    slug: "program",
    title: "Program and Project Advisory",
    intro: "Bring structure and momentum to complex delivery.",
    capabilities: [
      "Complex program planning",
      "Delivery governance",
      "Scope and milestone definition",
      "Vendor coordination",
      "Stakeholder management",
      "Program recovery",
    ],
  },
  {
    slug: "commercial",
    title: "Commercial and GTM Advisory",
    intro:
      "Connect positioning and propositions with how customers actually buy.",
    capabilities: [
      "Product positioning",
      "GTM planning",
      "B2B acquisition journeys",
      "Product commercialisation",
      "Proposal strategy",
      "Partner strategy",
      "Sales and product alignment",
    ],
  },
];
export const training: Training[] = [
  "Product Management Fundamentals",
  "AI Product Management",
  "AI Project Management",
  "Telecom Software and OSS/BSS Fundamentals",
  "Connectivity Solution Architecture",
  "From Idea to MVP",
].map((title, index) => ({
  slug: `programme-${index + 1}`,
  title,
  audience: "Teams and leaders who want practical, shared language and tools.",
  outcomes: [
    "A usable mental model",
    "Techniques that transfer to current work",
    "A concrete next-step plan",
  ],
  durations: ["Half-day", "Full-day", "Multi-week"],
  modes: [
    "One-to-one coaching",
    "Corporate workshop",
    "Conference session",
    "Guest lecture",
  ],
}));
export const locations: Location[] = [
  {
    id: "melbourne",
    city: "Melbourne",
    country: "Australia",
    coordinates: [-37.81, 144.96],
    categories: ["Lived", "Worked", "Photographed"],
    period: "A chapter, not a live location",
    reason: "Home, work and photography",
    story:
      "Architecture, weather in several acts, and long tram-window observations.",
    contextType: "both",
    relatedPhotos: ["blue-hour"],
    relatedProjects: [],
    relatedArticles: [],
    public: true,
    position: [72, 73],
  },
  {
    id: "mumbai",
    city: "Mumbai",
    country: "India",
    coordinates: [19.08, 72.88],
    categories: ["Lived", "Worked", "Photographed"],
    period: "Foundational",
    reason: "Home, work and formative experience",
    story: "A city that teaches pace, density, ambition and excellent snacks.",
    contextType: "both",
    relatedPhotos: ["monsoon-lines"],
    relatedProjects: [],
    relatedArticles: [],
    public: true,
    position: [57, 48],
  },
  {
    id: "singapore",
    city: "Singapore",
    country: "Singapore",
    coordinates: [1.35, 103.82],
    categories: ["Visited", "Client work"],
    period: "Selected visits",
    reason: "Client work and travel",
    story: "Systems, greenery and the elegance of things that quietly work.",
    contextType: "work",
    relatedPhotos: ["geometry"],
    relatedProjects: [],
    relatedArticles: [],
    public: true,
    position: [67, 58],
  },
];
export const photographs: Photograph[] = [
  {
    id: "p1",
    slug: "blue-hour",
    title: "Blue Hour, Held",
    description: "A study in windows and dusk.",
    story:
      "Placeholder artwork marks the intended editorial rhythm until an approved photograph is supplied.",
    location: "Melbourne",
    country: "Australia",
    year: 2025,
    image: "/images/blue-hour.svg",
    thumbnail: "/images/blue-hour.svg",
    width: 1200,
    height: 1500,
    orientation: "portrait",
    alt: "Abstract cobalt windows against a warm dusk field",
    categories: ["Cities", "Architecture", "Australia"],
    featured: true,
    availableAsPrint: true,
    printProduct: "blue-hour-print",
    mapLocation: "melbourne",
    visibility: "public",
  },
  {
    id: "p2",
    slug: "monsoon-lines",
    title: "Monsoon Lines",
    description: "Movement, rain and reflected vermilion.",
    story: "Placeholder artwork for a future street photograph.",
    location: "Mumbai",
    country: "India",
    year: 2024,
    image: "/images/monsoon-lines.svg",
    thumbnail: "/images/monsoon-lines.svg",
    width: 1600,
    height: 1000,
    orientation: "landscape",
    alt: "Abstract rain lines and a vermilion reflection",
    categories: ["Street", "India", "Black and White"],
    featured: true,
    availableAsPrint: false,
    mapLocation: "mumbai",
    visibility: "public",
  },
  {
    id: "p3",
    slug: "geometry",
    title: "Useful Geometry",
    description: "Concrete, shade and deliberate green.",
    story: "Placeholder artwork for a future architecture photograph.",
    location: "Singapore",
    country: "Singapore",
    year: 2023,
    image: "/images/geometry.svg",
    thumbnail: "/images/geometry.svg",
    width: 1200,
    height: 1200,
    orientation: "square",
    alt: "Abstract teal architectural planes with a chartreuse detail",
    categories: ["Architecture", "Travel", "Details and Textures"],
    featured: true,
    availableAsPrint: true,
    printProduct: "geometry-print",
    mapLocation: "singapore",
    visibility: "public",
  },
];
export const prints: PrintProduct[] = [
  {
    id: "blue-hour-print",
    slug: "blue-hour-print",
    photograph: "p1",
    title: "Blue Hour, Held",
    description:
      "An editorial print preview in the Cities I’ve Carried Back collection.",
    story:
      "Final paper, dimensions and edition details will be confirmed before orders open.",
    collection: "Cities I’ve Carried Back",
    edition: "signature",
    sizes: ["A3", "A2", "A1"],
    materials: ["Archival fine-art paper"],
    framed: true,
    currency: "AUD",
    shippingRegions: ["Australia (planned)"],
    availability: "interest",
    featured: true,
    status: "preview",
    seo: {
      title: "Blue Hour, Held print",
      description:
        "Register interest in this planned fine-art photography print.",
    },
  },
  {
    id: "geometry-print",
    slug: "geometry-print",
    photograph: "p3",
    title: "Useful Geometry",
    description: "A print preview from Quiet Frames.",
    story:
      "A calm architectural study; production specifications remain intentionally uncommitted.",
    collection: "Quiet Frames",
    edition: "open",
    sizes: ["A3", "A2"],
    materials: ["Archival fine-art paper"],
    framed: false,
    currency: "AUD",
    shippingRegions: ["Australia (planned)"],
    availability: "interest",
    featured: true,
    status: "preview",
    seo: {
      title: "Useful Geometry print",
      description: "Register interest in this planned architecture print.",
    },
  },
];
export const articles: Article[] = [
  {
    slug: "ai-without-the-theatre",
    title: "AI without the theatre: start with the work",
    excerpt:
      "A sample editorial structure for discussing AI in terms of decisions, workflows and responsibility—not stagecraft.",
    author: "Mihir",
    published: "2026-07-01",
    category: "AI Without the Theatre",
    tags: ["AI", "Product", "Delivery"],
    readingTime: "4 min",
    featured: true,
    relatedServices: ["ai"],
    relatedProjects: [],
    relatedLocations: [],
    seo: {
      title: "AI without the theatre",
      description:
        "A sample article about finding useful AI product opportunities.",
    },
    draft: false,
    sample: true,
    sections: [
      {
        heading: "Begin with friction",
        body: "The useful question is rarely “Where can we add AI?” It is “Where does valuable work currently stall, repeat or lose context?”",
      },
      {
        heading: "Design the decision",
        body: "A model output is not a product outcome. Define who decides, what evidence they need and how uncertainty remains visible.",
      },
      {
        heading: "Earn the automation",
        body: "Start with assistance, instrument the workflow and expand autonomy only when the evidence and controls justify it.",
      },
    ],
  },
];
