export type LinkItem = { label: string; href: string };
export type ExternalProfile = {
  id:
    | "linkedin"
    | "facebook"
    | "x"
    | "current-work"
    | "previous-blog"
    | "zero-one-products";
  label: string;
  href?: string;
  configured: boolean;
};
export type Expertise = { title: string; description: string };
export type WorkItem = {
  slug: string;
  title: string;
  summary: string;
  disciplines: string[];
  sample: boolean;
};
export type Interest = { label: string; value: string };
export type AboutProfile = {
  heading: string;
  paragraphs: string[];
  portrait: {
    src: string;
    alt: string;
    width: number;
    height: number;
    caption?: string;
  };
};
export type Engagement = {
  slug: string;
  title: string;
  duration?: string;
  description: string;
  mode: "enquiry" | "preview";
};
export type Service = {
  slug: string;
  title: string;
  intro: string;
  capabilities: string[];
};
export type Training = {
  slug: string;
  title: string;
  audience: string;
  outcomes: string[];
  durations: string[];
  modes: string[];
};
export type LocationCategory =
  | "Lived"
  | "Worked"
  | "Visited"
  | "Client work"
  | "Events and conferences"
  | "Photographed"
  | "Want to visit";
export type Location = {
  id: string;
  city: string;
  country: string;
  coordinates: [number, number];
  categories: LocationCategory[];
  period: string;
  from?: string;
  to?: string;
  reason: string;
  story: string;
  contextType: "work" | "personal" | "both";
  relatedOrganisation?: string;
  relatedEvent?: string;
  relatedPhotos: string[];
  relatedProjects: string[];
  relatedArticles: string[];
  public: boolean;
  position: [number, number];
};
export type Photograph = {
  id: string;
  slug: string;
  title: string;
  description: string;
  story: string;
  location: string;
  country: string;
  year: number;
  image: string;
  thumbnail: string;
  width: number;
  height: number;
  orientation: "landscape" | "portrait" | "square";
  alt: string;
  categories: string[];
  featured: boolean;
  availableAsPrint: boolean;
  printProduct?: string;
  mapLocation?: string;
  visibility: "public" | "draft";
};
export type PrintProduct = {
  id: string;
  slug: string;
  photograph: string;
  title: string;
  description: string;
  story: string;
  collection: string;
  edition: "open" | "limited" | "signature";
  sizes: string[];
  materials: string[];
  framed: boolean;
  price?: number;
  currency: "AUD";
  shippingRegions: string[];
  availability: "interest" | "unavailable";
  featured: boolean;
  status: "preview";
  fulfilmentProvider?: string;
  seo: { title: string; description: string };
};
export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  published: string;
  updated?: string;
  category: string;
  tags: string[];
  readingTime: string;
  featured: boolean;
  relatedServices: string[];
  relatedProjects: string[];
  relatedLocations: string[];
  seo: { title: string; description: string };
  draft: boolean;
  sample: boolean;
  sections: { heading: string; body: string }[];
};
