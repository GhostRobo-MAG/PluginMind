import { type NavItem, type NavItemFooter } from "@/types"
import { features } from "./features"

const links = {
  github: "https://github.com/your-org/your-app", // Placeholder for your GitHub repo
  twitter: "",
  linkedin: "",
  discord: "",
  authorsWebsite: "https://yourdomain.com",
  authorsGitHub: "",
  openGraphImage: "https://yourdomain.com/images/opengraph-image.png",
}

export const siteConfig = {
  name: "YourApp",
  description:
    "Production-ready AI SaaS template with generic AI processing, plugin-style service registry, and comprehensive authentication. Transform your AI idea into a production application with FastAPI backend, Next.js frontend, and 107+ automated tests.",
  links,
  url: "https://yourdomain.com",
  ogImage: links.openGraphImage,
  author: "Your Name",
  hostingRegion: "fra1",
  keywords: ["AI SaaS", "Next.js", "FastAPI", "Template", "AI Processing", "Production Ready"],
  features,
  navItems: [
    {
      title: "Features",
      href: "/#features-section",
    },
    {
      title: "Pricing",
      href: "/#pricing-section",
    },
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "AI Demo",
      href: "/ai",
    },
  ] satisfies NavItem[],
  navItemsMobile: [],
  navItemsFooter: [
    {
      title: "Product",
      items: [
        {
          title: "Features",
          href: "/#features-section",
          external: false,
        },
        {
          title: "Pricing",
          href: "/#pricing-section",
          external: false,
        },
        {
          title: "AI Demo",
          href: "/ai",
          external: false,
        },
      ],
    },
    {
      title: "Resources",
      items: [
        {
          title: "Documentation",
          href: "/docs",
          external: false,
        },
        {
          title: "API Reference",
          href: "/docs/api",
          external: false,
        },
        {
          title: "GitHub",
          href: "https://github.com/your-org/your-app",
          external: true,
        },
      ],
    },
    {
      title: "Legal",
      items: [
        {
          title: "Privacy Policy",
          href: "/privacy",
          external: false,
        },
        {
          title: "Terms of Service",
          href: "/tos",
          external: false,
        },
      ],
    },
  ] satisfies NavItemFooter[],
}
