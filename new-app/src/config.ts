// =============================================================================
// Clout - Open Source Discord Bot Website Configuration
// =============================================================================

// -- Site-wide settings -------------------------------------------------------
export interface SiteConfig {
  title: string;
  description: string;
  language: string;
}

export const siteConfig: SiteConfig = {
  title: "Clout - Open Source Discord Bot",
  description: "Build Community Clout with the ultimate open-source Discord bot. Features karma, economy, moderation, music, and analytics.",
  language: "en",
};

// -- Hero Section -------------------------------------------------------------
export interface HeroNavItem {
  label: string;
  sectionId: string;
  icon: "disc" | "play" | "calendar" | "music";
}

export interface HeroConfig {
  backgroundImage: string;
  brandName: string;
  decodeText: string;
  decodeChars: string;
  subtitle: string;
  ctaPrimary: string;
  ctaPrimaryTarget: string;
  ctaSecondary: string;
  ctaSecondaryTarget: string;
  cornerLabel: string;
  cornerDetail: string;
  navItems: HeroNavItem[];
}

export const heroConfig: HeroConfig = {
  backgroundImage: "/hero-bg.jpg",
  brandName: "Clout",
  decodeText: "BUILD COMMUNITY CLOUT",
  decodeChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  subtitle: "The open-source Discord bot for communities that value quality. Self-hosted, fully customizable, and completely free.",
  ctaPrimary: "Get Started",
  ctaPrimaryTarget: "features",
  ctaSecondary: "View on GitHub",
  ctaSecondaryTarget: "github",
  cornerLabel: "OPEN SOURCE",
  cornerDetail: "MIT License",
  navItems: [
    { label: "Features", sectionId: "features", icon: "disc" },
    { label: "Gallery", sectionId: "gallery", icon: "play" },
    { label: "Docs", sectionId: "docs", icon: "calendar" },
    { label: "Contact", sectionId: "contact", icon: "music" },
  ],
};

// -- Album Cube Section (Features Cube) ---------------------------------------
export interface Album {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

export interface AlbumCubeConfig {
  albums: Album[];
  cubeTextures: string[];
  scrollHint: string;
}

export const albumCubeConfig: AlbumCubeConfig = {
  albums: [
    { id: 1, title: "KARMA", subtitle: "REPUTATION SYSTEM", image: "/cube-karma.jpg" },
    { id: 2, title: "ECONOMY", subtitle: "VIRTUAL CURRENCY", image: "/cube-economy.jpg" },
    { id: 3, title: "MODERATION", subtitle: "SERVER PROTECTION", image: "/cube-moderation.jpg" },
    { id: 4, title: "MUSIC", subtitle: "VOICE EXPERIENCE", image: "/cube-music.jpg" },
  ],
  cubeTextures: [
    "/cube-analytics.jpg",  // right
    "/cube-community.jpg",  // left
    "/cube-karma.jpg",      // top
    "/cube-economy.jpg",    // bottom
    "/cube-moderation.jpg", // front
    "/cube-music.jpg",      // back
  ],
  scrollHint: "Scroll to explore features",
};

// -- Parallax Gallery Section -------------------------------------------------
export interface ParallaxImage {
  id: number;
  src: string;
  alt: string;
}

export interface GalleryImage {
  id: number;
  src: string;
  title: string;
  date: string;
}

export interface ParallaxGalleryConfig {
  sectionLabel: string;
  sectionTitle: string;
  galleryLabel: string;
  galleryTitle: string;
  marqueeTexts: string[];
  endCtaText: string;
  parallaxImagesTop: ParallaxImage[];
  parallaxImagesBottom: ParallaxImage[];
  galleryImages: GalleryImage[];
}

export const parallaxGalleryConfig: ParallaxGalleryConfig = {
  sectionLabel: "FEATURES",
  sectionTitle: "Everything Your Server Needs",
  galleryLabel: "SHOWCASE",
  galleryTitle: "See Clout in Action",
  marqueeTexts: [
    "KARMA SYSTEM",
    "ECONOMY",
    "MODERATION",
    "MUSIC",
    "ANALYTICS",
    "CUSTOM COMMANDS",
    "LEVELING",
    "SELF-HOSTED",
  ],
  endCtaText: "Ready to elevate your community?",
  parallaxImagesTop: [
    { id: 1, src: "/feature-karma.jpg", alt: "Karma System" },
    { id: 2, src: "/feature-economy.jpg", alt: "Economy System" },
    { id: 3, src: "/feature-moderation.jpg", alt: "Moderation Dashboard" },
    { id: 4, src: "/feature-music.jpg", alt: "Music Player" },
    { id: 5, src: "/feature-analytics.jpg", alt: "Analytics Dashboard" },
    { id: 6, src: "/feature-commands.jpg", alt: "Custom Commands" },
  ],
  parallaxImagesBottom: [
    { id: 1, src: "/gallery-1.jpg", alt: "Community" },
    { id: 2, src: "/gallery-2.jpg", alt: "Welcome" },
    { id: 3, src: "/gallery-3.jpg", alt: "Leveling" },
    { id: 4, src: "/gallery-4.jpg", alt: "Roles" },
    { id: 5, src: "/gallery-5.jpg", alt: "Statistics" },
    { id: 6, src: "/gallery-6.jpg", alt: "Automation" },
  ],
  galleryImages: [
    { id: 1, src: "/feature-karma.jpg", title: "Karma System", date: "Reputation Tracking" },
    { id: 2, src: "/feature-economy.jpg", title: "Economy", date: "Virtual Currency" },
    { id: 3, src: "/feature-moderation.jpg", title: "Moderation", date: "Server Protection" },
    { id: 4, src: "/feature-music.jpg", title: "Music", date: "Voice Experience" },
    { id: 5, src: "/feature-analytics.jpg", title: "Analytics", date: "Data Insights" },
    { id: 6, src: "/feature-commands.jpg", title: "Commands", date: "Automation" },
  ],
};

// -- Tour Schedule Section (GitHub/Docs Links) --------------------------------
export interface TourDate {
  id: number;
  date: string;
  time: string;
  city: string;
  venue: string;
  status: "on-sale" | "sold-out" | "coming-soon";
  image: string;
}

export interface TourStatusLabels {
  onSale: string;
  soldOut: string;
  comingSoon: string;
  default: string;
}

export interface TourScheduleConfig {
  sectionLabel: string;
  sectionTitle: string;
  vinylImage: string;
  buyButtonText: string;
  detailsButtonText: string;
  bottomNote: string;
  bottomCtaText: string;
  statusLabels: TourStatusLabels;
  tourDates: TourDate[];
}

export const tourScheduleConfig: TourScheduleConfig = {
  sectionLabel: "GET STARTED",
  sectionTitle: "Deploy in Minutes",
  vinylImage: "/pricing-bg.jpg",
  buyButtonText: "View Docs",
  detailsButtonText: "Learn More",
  bottomNote: "Self-hosted. Full control. Zero cost.",
  bottomCtaText: "Star us on GitHub",
  statusLabels: {
    onSale: "Ready",
    soldOut: "Popular",
    comingSoon: "Coming Soon",
    default: "Available",
  },
  tourDates: [
    {
      id: 1,
      date: "STEP 01",
      time: "Clone",
      city: "GitHub",
      venue: "Clone the repository to your server",
      status: "on-sale",
      image: "/cube-karma.jpg",
    },
    {
      id: 2,
      date: "STEP 02",
      time: "Configure",
      city: "Environment",
      venue: "Set up your bot token and settings",
      status: "on-sale",
      image: "/cube-economy.jpg",
    },
    {
      id: 3,
      date: "STEP 03",
      time: "Deploy",
      city: "Docker",
      venue: "Run with Docker or Node.js directly",
      status: "on-sale",
      image: "/cube-moderation.jpg",
    },
    {
      id: 4,
      date: "STEP 04",
      time: "Customize",
      city: "Extend",
      venue: "Add custom commands and features",
      status: "on-sale",
      image: "/cube-analytics.jpg",
    },
  ],
};

// -- Footer Section -----------------------------------------------------------
export interface FooterImage {
  id: number;
  src: string;
}

export interface SocialLink {
  icon: "instagram" | "twitter" | "youtube" | "music";
  label: string;
  href: string;
}

export interface FooterConfig {
  portraitImage: string;
  portraitAlt: string;
  heroTitle: string;
  heroSubtitle: string;
  artistLabel: string;
  artistName: string;
  artistSubtitle: string;
  brandName: string;
  brandDescription: string;
  quickLinksTitle: string;
  quickLinks: string[];
  contactTitle: string;
  emailLabel: string;
  email: string;
  phoneLabel: string;
  phone: string;
  addressLabel: string;
  address: string;
  newsletterTitle: string;
  newsletterDescription: string;
  newsletterButtonText: string;
  subscribeAlertMessage: string;
  copyrightText: string;
  bottomLinks: string[];
  socialLinks: SocialLink[];
  galleryImages: FooterImage[];
}

export const footerConfig: FooterConfig = {
  portraitImage: "/footer-hero.jpg",
  portraitAlt: "Clout Crown",
  heroTitle: "BUILD COMMUNITY CLOUT",
  heroSubtitle: "Open Source Discord Bot",
  artistLabel: "PROJECT",
  artistName: "Clout Bot",
  artistSubtitle: "MIT Licensed",
  brandName: "Clout",
  brandDescription: "The open-source Discord bot for communities that value quality. Self-hosted, fully customizable, and completely free. Built with modern technologies.",
  quickLinksTitle: "Resources",
  quickLinks: ["Documentation", "GitHub", "Docker Hub", "Discord Support"],
  contactTitle: "Connect",
  emailLabel: "Email",
  email: "hello@clout.dev",
  phoneLabel: "Discord",
  phone: "discord.gg/clout",
  addressLabel: "GitHub",
  address: "github.com/clout-bot",
  newsletterTitle: "Get Updates",
  newsletterDescription: "Stay informed about new releases and features.",
  newsletterButtonText: "Subscribe",
  subscribeAlertMessage: "Thanks for subscribing!",
  copyrightText: "© 2025 Clout. Open source under MIT License.",
  bottomLinks: ["License", "Contributing", "Code of Conduct"],
  socialLinks: [
    { icon: "twitter", label: "Twitter", href: "https://twitter.com/cloutbot" },
    { icon: "youtube", label: "YouTube", href: "https://youtube.com/cloutbot" },
    { icon: "music", label: "Discord", href: "https://discord.gg/clout" },
    { icon: "instagram", label: "GitHub", href: "https://github.com/clout-bot" },
  ],
  galleryImages: [
    { id: 1, src: "/cube-karma.jpg" },
    { id: 2, src: "/cube-economy.jpg" },
    { id: 3, src: "/cube-moderation.jpg" },
    { id: 4, src: "/cube-music.jpg" },
  ],
};
