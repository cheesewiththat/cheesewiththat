export type LinkItem = { label: string; href: string };
export type ExternalProfile = {
  id:
    | "linkedin"
    | "facebook"
    | "x"
    | "instagram"
    | "github"
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
export type LocationCategory = "lived" | "travelled";
export type LocationChapter = {
  label: string;
  approximateDuration: string;
  context: string;
  sequence: number;
};
export type Location = {
  id: string;
  name: string;
  country: string;
  region?: string;
  coordinates: [number, number];
  category: LocationCategory;
  sequence?: number;
  approximateDuration?: string;
  context: string;
  chapters: LocationChapter[];
  current: boolean;
  publicationStatus: "public" | "draft";
  verified: boolean;
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
